'use strict';
(() => {
  const hero = document.querySelector('.film-hero');
  const video = document.querySelector('#hero-video');
  const status = document.querySelector('#hero-video-status');
  if (!hero || !video || !status) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  let visible = !('IntersectionObserver' in window);
  let autoPlaybackReady = false;
  let userPaused = reducedMotion.matches || saveData;
  let startPromise;
  const motionButton = document.querySelector('.hero-motion');
  motionButton?.addEventListener('click', () => {
    userPaused = !userPaused;
    motionButton.setAttribute('aria-pressed', String(userPaused));
    motionButton.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
    motionButton.textContent = userPaused ? 'Play film \u25b6' : 'Pause film \u275a\u275a';
    if (userPaused) video.pause();
    else playVideo();
  });

  async function playVideo() {
    if (video.paused && !userPaused && visible && !document.hidden &&
        autoPlaybackReady && !reducedMotion.matches && !saveData) {
      if (!video.src) {
        video.src = video.dataset.src;
        video.load();
      }
      if (!startPromise) {
        startPromise = video.play()
          .then(() => { status.textContent = ''; })
          .catch(() => {
            status.textContent = 'The video could not start automatically.';
          })
          .finally(() => { startPromise = undefined; });
      }
      await startPromise;
    }
  }

  video.addEventListener('error', () => {
    status.textContent = 'The video could not load. Please try again later.';
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else playVideo();
  });

  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      userPaused = true;
      video.pause();
    } else {
      userPaused = false;
      playVideo();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) playVideo();
      else video.pause();
    }, { threshold: 0.1 });
    observer.observe(hero);
  }

  if (!userPaused) {
    const enableAutoPlayback = () => {
      autoPlaybackReady = true;
      playVideo();
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(enableAutoPlayback, { timeout: 2000 });
    } else {
      window.setTimeout(enableAutoPlayback, 1200);
    }
  }

})();
