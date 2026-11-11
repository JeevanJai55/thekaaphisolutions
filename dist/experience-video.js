'use strict';
(() => {
  const section = document.querySelector('.video-showcase');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const saveData = navigator.connection?.saveData;
  const videos = [...section.querySelectorAll('.video-showcase-card video')];
  const pauseVideos = () => videos.forEach(video => video.pause());

  function isVideoVisible(video) {
    const bounds = video.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight &&
      bounds.right > 0 && bounds.left < window.innerWidth;
  }

  async function playVideo(video) {
    if (!video.paused || reducedMotion.matches || saveData || document.hidden) return;
    if (!video.poster) video.poster = video.dataset.poster;
    if (!video.src) {
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

  function syncPlayback() {
    if (document.hidden || reducedMotion.matches || saveData) {
      pauseVideos();
      return;
    }

    const visibleVideos = videos.filter(isVideoVisible);
    if (mobile.matches) {
      const mostVisible = visibleVideos.reduce((best, video) => {
        const bounds = video.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0));
        const ratio = bounds.height ? visibleHeight / bounds.height : 0;
        return !best || ratio > best.ratio ? { video, ratio } : best;
      }, null);
      videos.forEach(video => {
        if (video !== mostVisible?.video) video.pause();
      });
      if (mostVisible?.ratio >= .5) playVideo(mostVisible.video);
      return;
    }

    videos.forEach(video => {
      if (visibleVideos.includes(video)) playVideo(video);
      else video.pause();
    });
  }

  videos.forEach(video => {
    video.addEventListener('error', () => {
      const message = video.closest('.video-showcase-card')?.querySelector('.video-card-error');
      if (message) message.hidden = false;
    });
  });

  document.addEventListener('visibilitychange', () => {
    syncPlayback();
  });

  reducedMotion.addEventListener('change', () => {
    syncPlayback();
  });
  mobile.addEventListener('change', () => {
    syncPlayback();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          if (!target.poster) target.poster = target.dataset.poster;
        }
        else target.pause();
      });
      const visibleVideos = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio >= .5);
      if (mobile.matches) {
        const candidates = videos.map(video => {
          const bounds = video.getBoundingClientRect();
          const visibleHeight = Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0));
          return { video, ratio: bounds.height ? visibleHeight / bounds.height : 0 };
        }).filter(({ ratio }) => ratio >= .5);
        const mostVisible = candidates.reduce((best, candidate) =>
          !best || candidate.ratio > best.ratio ? candidate : best
        , null);
        videos.forEach(video => {
          if (video !== mostVisible?.video) video.pause();
        });
        if (mostVisible) playVideo(mostVisible.video);
      } else {
        visibleVideos.forEach(({ target }) => playVideo(target));
      }
    }, { threshold: [0, .5] });
    videos.forEach(video => observer.observe(video));
  } else {
    window.addEventListener('scroll', syncPlayback, { passive: true });
    window.addEventListener('resize', syncPlayback);
  }
})();
