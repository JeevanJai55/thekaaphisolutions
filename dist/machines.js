'use strict';
(() => {
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (menu && navigation) {
    const closeNavigation = () => {
      menu.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
    };
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
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeNavigation();
        menu.focus();
      }
    });
  }

  document.querySelectorAll('.machine-description[data-collapsible]').forEach(description => {
    const toggle = description.nextElementSibling;
    if (!(toggle instanceof HTMLElement) || !toggle.classList.contains('machine-read-more')) return;
    const update = () => {
      const expanded = description.classList.contains('is-expanded');
      description.classList.toggle('is-collapsed', !expanded);
      toggle.textContent = expanded ? 'Show less' : 'Read more';
      toggle.setAttribute('aria-expanded', String(expanded));
    };
    toggle.addEventListener('click', () => {
      description.classList.toggle('is-expanded');
      update();
    });
    update();
  });

  const lightbox = document.querySelector('#machine-lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  document.querySelectorAll('[data-equipment-photo]').forEach(button => button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.equipmentPhoto;
    lightboxImage.alt = button.dataset.photoCaption;
    lightboxCaption.textContent = button.dataset.photoCaption;
    lightbox.showModal();
  }));
  lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
      lightbox.close();
  });
})();
