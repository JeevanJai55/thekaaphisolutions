'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const dropdowns = [...navigation.querySelectorAll('.nav-dropdown')];
function closeDropdowns(except) { dropdowns.forEach(dropdown => { if (dropdown !== except) dropdown.open = false; }); }
function closeNavigation() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); closeDropdowns(); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open);
  if (!open) closeDropdowns();
});
dropdowns.forEach(dropdown => {
  dropdown.addEventListener('toggle', () => { if (dropdown.open) closeDropdowns(dropdown); });
  dropdown.querySelector('summary').addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); dropdown.open = true; dropdown.querySelector('a')?.focus(); }
  });
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('click', event => { if (!navigation.contains(event.target) && !menu.contains(event.target)) closeNavigation(); });
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const open = dropdowns.find(dropdown => dropdown.open);
  const mobile = menu.getAttribute('aria-expanded') === 'true';
  closeNavigation();
  if (mobile) menu.focus(); else open?.querySelector('summary').focus();
});
const imageDialog = document.querySelector('#catalogue-image-dialog');
const packetImages = {
  'filter-coffee': ['assets/filter-cutout.webp', 'Front of The Kaphi Filter Coffee package', 763, 1280],
  'roasted-coffee-beans': ['assets/beans-cutout.webp', 'Front of The Kaphi Roasted Coffee Beans package', 853, 1280],
  'premium-tea': ['assets/tea-cutout.webp', 'Front of The Kaphi Premium Tea package', 880, 1280],
  'cardamom-tea': ['assets/cardamom-cutout.webp', 'Front of The Kaphi Cardamom Tea package', 724, 1014],
  'masala-tea': ['assets/masala-front-cutout.webp', 'Front of The Kaphi Premium Masala Tea package', 506, 710]
};
Object.entries(packetImages).forEach(([id, [source, alt, width, height]]) => {
  const photo = document.querySelector(`#${id} .catalogue-photo`);
  if (!photo) return;
  const image = photo.querySelector('img');
  photo.dataset.catalogueImage = source;
  photo.dataset.imageAlt = alt;
  image.src = source;
  image.width = width;
  image.height = height;
  image.alt = alt;
});
const collectionImages = document.querySelectorAll('.catalogue-hero figure img');
if (collectionImages.length >= 2) {
  collectionImages[0].src = 'assets/beans-cutout.webp';
  collectionImages[0].alt = 'The Kaphi Roasted Coffee Beans package';
  collectionImages[1].src = 'assets/cardamom-cutout.webp';
  collectionImages[1].alt = 'The Kaphi Cardamom Tea package';
}
document.querySelectorAll('[data-catalogue-image]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#catalogue-image-title').textContent = button.dataset.imageTitle;
  const expandedImage = document.querySelector('#catalogue-image-expanded');
  expandedImage.src = button.dataset.catalogueImage;
  expandedImage.alt = button.dataset.imageAlt;
  imageDialog.showModal();
}));
imageDialog.querySelector('.close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target !== imageDialog) return;
  const bounds = imageDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imageDialog.close();
});

// One category at a time, with direct links to individual products preserved.
const filterButtons = [...document.querySelectorAll('[data-catalogue-filter]')];
const catalogueSections = [...document.querySelectorAll('[data-catalogue-category]')];
function filterCatalogue(category) {
  const valid = category === 'all' || catalogueSections.some(section => section.id === category);
  if (!valid) return;
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.catalogueFilter === category)));
  catalogueSections.forEach(section => { section.hidden = category !== 'all' && section.id !== category; });
}
function categoryFromHash() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  return target?.closest('[data-catalogue-category]')?.id || 'all';
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.catalogueFilter;
  filterCatalogue(category);
  history.replaceState(null, '', category === 'all' ? location.pathname : '#' + category);
}));
window.addEventListener('hashchange', () => filterCatalogue(categoryFromHash()));
filterCatalogue(categoryFromHash());
