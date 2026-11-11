'use strict';
(() => {
  const hero = document.querySelector('.film-hero');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealSelectors = [
    '.video-showcase-heading',
    '.video-showcase-card',
    '.home-product-heading > *',
    '.home-product-card',
    '.home-machines-heading > *',
    '.machine-photo-card',
    '.setup-guide .section-heading > *',
    '.setup-steps li',
    '.customer-feedback-intro',
    '.faq-intro',
    '.faq-list details',
    '.contact > *'
  ];

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-scroll-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.dataset.scrollReveal = '';
        element.style.setProperty('--scroll-reveal-order', String(index % 4));
        revealObserver.observe(element);
      });
    });

    document.body.classList.add('scroll-effects-ready');
  }
})();
