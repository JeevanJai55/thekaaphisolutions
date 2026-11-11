// Recipient verified against the supplied company signage and brochure.
const recipient = '919880491458';
const limits = Object.freeze({ name: 100, company: 120, city: 100, phone: 40, message: 1500 });

function cleanText(value, maximum = 140) {
  if (typeof value !== 'string') return '';
  const normalized = value.replace(/\r\n?/g, '\n').trim().replace(/[\uD800-\uDFFF]/gu, '\uFFFD');
  // Keep complete Unicode characters when a programmatic value exceeds a limit.
  return Array.from(normalized).slice(0, maximum).join('');
}

/** Build a WhatsApp draft; this function never sends a message or stores data. */
export function buildWhatsAppUrl(input = {}) {
  const data = input && typeof input === 'object' ? input : {};
  const details = {};
  for (const [key, maximum] of Object.entries(limits)) details[key] = cleanText(data[key], maximum);
  const interest = cleanText(data.interest);
  const lines = [
    'Hello The Kaphi Solutions,',
    '',
    interest ? `I would like to enquire about ${interest}.` : 'I would like to discuss a coffee or tea solution.',
    ''
  ];
  for (const [key, label] of [['name', 'Name'], ['company', 'Company'], ['city', 'City'], ['phone', 'Phone']]) {
    if (details[key]) lines.push(`${label}: ${details[key]}`);
  }
  if (details.message) lines.push('', 'Message:', details.message);
  const text = lines.join('\n').trim();
  return `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`;
}

function connectEnquiryForm() {
  const form = document.querySelector('#enquiry');
  const fallback = document.querySelector('#whatsapp-link');
  const result = document.querySelector('#draft-result');
  if (!form || !fallback || !result) return;

  const fields = {
    interest: form.querySelector('#interest'),
    name: form.querySelector('#name'),
    company: form.querySelector('#company'),
    city: form.querySelector('#city'),
    phone: form.querySelector('#customer-phone'),
    message: form.querySelector('#message')
  };
  if (!fields.name || !fields.message) return;

  fields.name.required = true;
  fields.message.required = true;
  for (const [key, maximum] of Object.entries(limits)) {
    if (fields[key]) fields[key].maxLength = maximum;
  }

  function updateDraft() {
    const data = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field?.value || '']));
    fallback.href = buildWhatsAppUrl(data);
    return fallback.href;
  }

  form.addEventListener('input', event => {
    if (event.target === fields.name || event.target === fields.message) event.target.setCustomValidity('');
    updateDraft();
  });
  form.addEventListener('change', updateDraft);
  form.addEventListener('submit', event => {
    event.preventDefault();
    fields.name.setCustomValidity(fields.name.value.trim() ? '' : 'Please enter your name.');
    fields.message.setCustomValidity(fields.message.value.trim() ? '' : 'Please tell us what you are looking for.');
    if (!form.reportValidity()) return;

    const url = updateDraft();
    result.hidden = false;
    // WhatsApp opens the prefilled conversation. The visitor chooses to send it.
    window.location.assign(url);
  });
  updateDraft();
}

if (typeof document !== 'undefined') connectEnquiryForm();
