'use strict';
(() => {
  const section = document.querySelector('#feedback');
  const grid = section?.querySelector('.review-shuffle');
  if (!section || !grid) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let timer;
  let currentAnimation;

  async function advanceReview() {
    if (document.hidden || reducedMotion.matches || !visible) return;
    const frontCard = grid.firstElementChild;
    if (!frontCard) return;

    const animation = frontCard.animate(
      [
        { transform: 'translateX(0) rotate(0)', opacity: 1 },
        { transform: 'translateX(115%) rotate(7deg)', opacity: 0 }
      ],
      { duration: 650, easing: 'cubic-bezier(.55,0,.8,.25)', fill: 'forwards' }
    );
    currentAnimation = animation;

    try {
      await animation.finished;
    } catch {
      return;
    }

    if (document.hidden || reducedMotion.matches || !visible) return;

    animation.cancel();
    currentAnimation = undefined;
    frontCard.classList.add('is-returning');
    grid.append(frontCard);
    requestAnimationFrame(() => frontCard.classList.remove('is-returning'));
  }

  function stop() {
    window.clearInterval(timer);
    timer = undefined;
    currentAnimation?.cancel();
    currentAnimation = undefined;
  }

  function start() {
    if (timer || !visible || document.hidden || reducedMotion.matches) return;
    timer = window.setInterval(advanceReview, 5200);
  }

  function updateVisibility() {
    const bounds = section.getBoundingClientRect();
    visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    if (visible) start();
    else stop();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  reducedMotion.addEventListener('change', () => {
    stop();
    start();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(updateVisibility, { threshold: 0 });
    observer.observe(section);
  }
  updateVisibility();
})();
