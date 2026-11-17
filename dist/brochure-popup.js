'use strict';

const triggers = document.querySelectorAll('.brochure-trigger');
const dialog = document.querySelector('#brochure-download-dialog');
const form = document.querySelector('#brochure-download-form');

if (triggers.length && dialog && form) {
  const success = dialog.querySelector('#brochure-download-success');
  const close = dialog.querySelector('.close');
  const download = success?.querySelector('a');
  if (!success || !close || !download) throw new Error('Brochure download dialog is incomplete.');

  let activeTrigger;
  triggers.forEach(trigger => trigger.addEventListener('click', event => {
    event.preventDefault();
    activeTrigger = trigger;
    if (!dialog.open) dialog.showModal();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => activeTrigger?.focus());
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    form.hidden = true;
    success.hidden = false;
    download.click();
  });
}
