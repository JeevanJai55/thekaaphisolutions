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

  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const target = link.getAttribute('href');
    if (target?.startsWith('#')) {
      const card = document.querySelector(target)?.closest('[data-category]');
      if (card?.hidden) document.querySelector('[data-filter="all"]')?.click();
    }
    closeNavigation();
  }));

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
const descriptions = {
  filter: ['Filter coffee', 'Explore Kaphi filter coffee. Ask us about available blends, grinds and pack sizes.'],
  beans: ['Roasted coffee beans', 'Prefer to grind your own coffee? Ask about the roasted beans and pack sizes available.'],
  tea: ['Premium tea', 'Explore Kaphi premium tea. Contact us for available packs and product details.'],
  cardamom: ['Cardamom tea', 'Tea with a fragrant cardamom note. Ask us about ingredients, pack sizes and availability.'],
  masala: ['Masala tea', 'Explore Kaphi masala tea. Ask us about ingredients, pack sizes and availability.']
};
const productDialog=document.querySelector('#product-dialog');document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{const [title,copy]=descriptions[button.dataset.product];document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;document.querySelector('#ask-product').dataset.productName=title;productDialog.showModal()}));document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}})});document.querySelector('#ask-product').addEventListener('click',e=>{productDialog.close();document.querySelector('#interest').value='Coffee & tea';document.querySelector('#message').value='I would like to know more about '+e.currentTarget.dataset.productName+'.';document.querySelector('#draft-result').hidden=true});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter)}));
// WhatsApp enquiry behavior is provided by whatsapp-enquiry.mjs.

let progressScheduled = false;
function updateReadingProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  const amount = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
  document.querySelector('#reading-progress-fill').style.transform = 'scaleX(' + amount + ')';
  progressScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!progressScheduled) { progressScheduled = true; requestAnimationFrame(updateReadingProgress); }
}, { passive: true });
window.addEventListener('resize', updateReadingProgress, { passive: true });
updateReadingProgress();
const aboutSection = document.querySelector('#about');
if (aboutSection && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  aboutSection.classList.add('about-reveal-ready');
  function revealAbout() {
    const bounds = aboutSection.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
    aboutSection.classList.add('about-is-visible');
    window.removeEventListener('scroll', revealAbout);
    window.removeEventListener('resize', revealAbout);
    aboutObserver.disconnect();
  }
  const aboutObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    revealAbout();
  }, { threshold: .18 });
  aboutObserver.observe(aboutSection);
  window.addEventListener('scroll', revealAbout, { passive: true });
  window.addEventListener('resize', revealAbout);
  revealAbout();
}
// Product-page links prefill an enquiry; nothing is stored or sent here.
const catalogueNames = new Set(['Filter coffee','Roasted coffee beans','Instant coffee powder','Premium tea','Cardamom tea','Masala tea','Assam tea bags','Flavoured tea bags','Green tea bags','Flavoured green tea bags','Lemon tea bags','Areca tea bags','Flavoured areca tea bags','Hot chocolate','Badam milk']);
const requestedProduct = new URLSearchParams(location.search).get('product');
if (catalogueNames.has(requestedProduct)) {
  document.querySelector('#interest').value = 'Coffee & tea';
  document.querySelector('#message').value = 'I would like to know more about ' + requestedProduct + '. Please share the available packs and product details.';
}
const equipmentEnquiries = {
  b2c: ['Bean-to-cup equipment', 'I would like to know more about the B2C 2.4 bean-to-cup coffee machine for my space.'],
  ftc: ['Filter coffee & tea equipment', 'I would like to know more about the FTC 2.4 filter coffee and tea system for my space.'],
  boilers: ['Hot-water boilers', 'I would like to discuss the boiler and beverage dispenser range. Please share the available models and capacities.']
};
const requestedEquipment = new URLSearchParams(location.search).get('equipment');
if (Object.hasOwn(equipmentEnquiries, requestedEquipment)) {
  [document.querySelector('#interest').value, document.querySelector('#message').value] = equipmentEnquiries[requestedEquipment];
}
const requestedMachine = new URLSearchParams(location.search).get('machine');
const legacyMachineAnchors = { 'bean-front': 'bean-to-cup', 'bean-angle': 'bean-to-cup', 'filter-front': 'filter-coffee-machine', 'filter-angle': 'filter-coffee-machine' };
if (Object.hasOwn(legacyMachineAnchors, requestedMachine)) location.replace('machines.html#' + legacyMachineAnchors[requestedMachine]);
document.querySelectorAll('[data-enquiry]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#interest').value = link.dataset.enquiry;
  document.querySelector('#message').value = link.dataset.enquiryMessage || ('I would like to discuss ' + link.dataset.enquiry.toLowerCase() + ' for my space.');
  document.querySelector('#draft-result').hidden = true;
}));
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        navigation.querySelectorAll('a').forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }
  }, { rootMargin: '-15% 0px -60% 0px' });
  navigation.querySelectorAll('a[href^="#"]').forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section?.tagName === 'SECTION') navObserver.observe(section);
  });
}
