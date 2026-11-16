'use strict';
(() => {
  const rail = document.querySelector('.machine-photo-rail');
  if (!rail) return;

  const cards = [...rail.querySelectorAll('.machine-photo-card')];
  if (cards.length < 2) return;

  const track = document.createElement('div');
  track.className = 'machine-photo-track';
  const group = document.createElement('div');
  group.className = 'machine-photo-group';
  cards.forEach(card => group.append(card));

  const cloneGroup = group.cloneNode(true);
  cloneGroup.setAttribute('aria-hidden', 'true');
  cloneGroup.querySelectorAll('[data-scroll-reveal]').forEach(element => {
    element.removeAttribute('data-scroll-reveal');
    element.style.removeProperty('--scroll-reveal-order');
  });
  cloneGroup.querySelectorAll('a').forEach(link => {
    link.tabIndex = -1;
  });
  track.append(group, cloneGroup);
  rail.append(track);
  rail.tabIndex = 0;
  rail.setAttribute('aria-label', 'Coffee and beverage equipment options');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let focused = false;
  let interacting = false;
  let interactionTimer;
  let animationFrame;
  let lastFrameTime;
  let scrollPosition = rail.scrollLeft;

  function normalizeScrollPosition() {
    const groupWidth = group.getBoundingClientRect().width;
    if (!groupWidth) return;
    while (rail.scrollLeft >= groupWidth) {
      rail.scrollLeft -= groupWidth;
    }
  }

  function shouldAnimate() {
    return !reducedMotion.matches && visible && !focused &&
      !interacting && !document.hidden;
  }

  function stopAnimation() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
    lastFrameTime = undefined;
  }

  function animate(timestamp) {
    if (!shouldAnimate()) {
      stopAnimation();
      return;
    }

    if (lastFrameTime !== undefined) {
      const groupWidth = group.getBoundingClientRect().width;
      if (groupWidth) {
        scrollPosition = (scrollPosition + Math.min(timestamp - lastFrameTime, 50) * 0.045) % groupWidth;
        rail.scrollLeft = scrollPosition;
      }
    }
    lastFrameTime = timestamp;
    animationFrame = requestAnimationFrame(animate);
  }

  function updateAnimation() {
    if (shouldAnimate()) {
      if (!animationFrame) {
        scrollPosition = rail.scrollLeft;
        animationFrame = requestAnimationFrame(animate);
      }
    } else {
      stopAnimation();
    }
  }

  function pauseForInteraction() {
    interacting = true;
    window.clearTimeout(interactionTimer);
    updateAnimation();
  }

  function resumeAfterInteraction() {
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => {
      interacting = false;
      updateAnimation();
    }, 1800);
  }

  rail.addEventListener('scroll', normalizeScrollPosition, { passive: true });
  rail.addEventListener('pointerdown', pauseForInteraction);
  rail.addEventListener('pointerup', resumeAfterInteraction);
  rail.addEventListener('pointercancel', resumeAfterInteraction);
  rail.addEventListener('wheel', event => {
    if (event.deltaX || event.shiftKey) {
      pauseForInteraction();
      resumeAfterInteraction();
    }
  }, { passive: true });
  rail.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      pauseForInteraction();
    }
  });
  rail.addEventListener('keyup', resumeAfterInteraction);
  rail.addEventListener('focusin', () => {
    focused = true;
    updateAnimation();
  });
  rail.addEventListener('focusout', event => {
    if (!rail.contains(event.relatedTarget)) {
      focused = false;
      updateAnimation();
    }
  });
  document.addEventListener('visibilitychange', updateAnimation);
  reducedMotion.addEventListener('change', updateAnimation);
  window.addEventListener('resize', normalizeScrollPosition);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAnimation();
    });
    observer.observe(rail);
  }

  updateAnimation();
})();
