'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

if (menu && navigation) {
  function closeNavigation() {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }

  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('open', open);
  });

  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));

  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menu.contains(event.target)) closeNavigation();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const mobileOpen = menu.getAttribute('aria-expanded') === 'true';
    closeNavigation();
    if (mobileOpen) menu.focus();
  });
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = document.querySelectorAll('[data-reveal]');
  document.documentElement.classList.add('about-motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach(item => revealObserver.observe(item));
}
