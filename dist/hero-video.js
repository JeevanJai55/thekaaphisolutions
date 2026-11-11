'use strict';
(() => {
  const hero = document.querySelector('.film-hero');
  if (!hero) return;

  const video = document.querySelector('#hero-video');
  const toggle = document.querySelector('#hero-play');
  const status = document.querySelector('#hero-video-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const saveData = navigator.connection?.saveData;

  let userPaused = reduced.matches || Boolean(saveData);
  let userRequestedPlayback = false;
  let visible = !('IntersectionObserver' in window);

  function updateControl() {
    const playing = !video.paused && !video.ended;
    toggle.setAttribute('aria-label', playing ? 'Pause hero video' : 'Play hero video');
    toggle.querySelector('[aria-hidden]').textContent = playing ? 'Ⅱ' : '▷';
    toggle.querySelector('.film-play-label').textContent = playing ? 'Pause' : 'Play';
    hero.classList.toggle('film-playing', playing);
  }

  async function play(manual = false) {
    if (userPaused || !visible || document.hidden || (!manual && mobile.matches)) return;
    if (!video.src) {
      video.src = video.dataset.src;
      video.load();
    }
    try { await video.play(); } catch { /* Playback stays under the visitor's control. */ }
    updateControl();
  }

  video.muted = true;
  video.addEventListener('canplay', () => play(userRequestedPlayback));
  video.addEventListener('play', updateControl);
  video.addEventListener('pause', updateControl);
  video.addEventListener('error', () => {
    userPaused = true;
    updateControl();
    status.textContent = 'The video could not load. Please try again later.';
  });

  toggle.addEventListener('click', () => {
    if (!video.paused) {
      userPaused = true;
      userRequestedPlayback = false;
      video.pause();
    } else {
      userPaused = false;
      userRequestedPlayback = true;
      play(true);
    }
    updateControl();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else play(userRequestedPlayback);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !userPaused) play(userRequestedPlayback);
      else if (!visible) video.pause();
    }, { threshold: .15 });
    observer.observe(hero);
  }

  reduced.addEventListener('change', event => {
    if (event.matches) {
      userPaused = true;
      video.pause();
      updateControl();
    } else {
      userPaused = false;
      userRequestedPlayback = false;
      play(false);
    }
  });

  mobile.addEventListener('change', event => {
    if (event.matches && !userRequestedPlayback) video.pause();
    else if (!event.matches) play();
    updateControl();
  });

  if (!userPaused) play();
  updateControl();
})();
