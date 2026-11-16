'use strict';
(() => {
  const section = document.querySelector('.video-showcase');
  if (!section) return;

  const videos = [...section.querySelectorAll('video[data-src]')];
  if (!videos.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  const visibleVideos = new Map();
  let activeVideo = null;
  let syncFrame = 0;

  function pauseOthers(active) {
    videos.forEach(video => {
      if (video === active) return;
      video.pause();
      if (video.hasAttribute('src')) {
        video.removeAttribute('src');
        video.load();
      }
    });
  }

  async function playVideo(video) {
    if (document.hidden || reducedMotion.matches || saveData || !visibleVideos.has(video)) return;
    pauseOthers(video);
    activeVideo = video;

    if (!video.hasAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }

    try {
      await video.play();
    } catch {
      const message = video.closest('.video-showcase-card')?.querySelector('.video-card-error');
      if (message) message.hidden = false;
    }
  }

  function updateActiveVideo() {
    if (document.hidden || reducedMotion.matches || saveData || !visibleVideos.size) {
      videos.forEach(video => video.pause());
      activeVideo = null;
      return;
    }

    const next = [...visibleVideos.entries()]
      .sort((a, b) => b[1] - a[1] || (a[0] === activeVideo ? -1 : b[0] === activeVideo ? 1 : 0))[0][0];
    if (next !== activeVideo || next.paused) playVideo(next);
  }

  function scheduleUpdate() {
    if (syncFrame) return;
    syncFrame = requestAnimationFrame(() => {
      syncFrame = 0;
      updateActiveVideo();
    });
  }

  videos.forEach(video => {
    video.addEventListener('play', () => {
      activeVideo = video;
      pauseOthers(video);
      const message = video.closest('.video-showcase-card')?.querySelector('.video-card-error');
      if (message) message.hidden = true;
    });
    video.addEventListener('error', () => {
      const message = video.closest('.video-showcase-card')?.querySelector('.video-card-error');
      if (message) message.hidden = false;
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
    else scheduleUpdate();
  });
  reducedMotion.addEventListener('change', scheduleUpdate);
  navigator.connection?.addEventListener?.('change', scheduleUpdate);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
        if (isIntersecting && intersectionRatio >= 0.4) {
          visibleVideos.set(target, intersectionRatio);
        } else {
          visibleVideos.delete(target);
          target.pause();
          if (target === activeVideo) activeVideo = null;
        }
      });
      scheduleUpdate();
    }, { threshold: [0, 0.4, 0.6], rootMargin: '80px 0px' });
    videos.forEach(video => observer.observe(video));
  } else {
    const measureVisibility = () => {
      videos.forEach(video => {
        const bounds = video.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0));
        const ratio = bounds.height ? visibleHeight / bounds.height : 0;
        if (ratio >= 0.4) visibleVideos.set(video, ratio);
        else visibleVideos.delete(video);
      });
      scheduleUpdate();
    };
    window.addEventListener('scroll', measureVisibility, { passive: true });
    window.addEventListener('resize', measureVisibility, { passive: true });
    measureVisibility();
  }
})();
