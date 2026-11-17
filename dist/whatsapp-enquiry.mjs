const recipient = '919880491458';
const limits = Object.freeze({ name: 100, company: 120, city: 100, phone: 40, message: 1500 });

function cleanText(value, maximum = 140) {
  if (typeof value !== 'string') return '';
  const normalized = value.replace(/\r\n?/g, '\n').trim().replace(/[\uD800-\uDFFF]/gu, '\uFFFD');
  return Array.from(normalized).slice(0, maximum).join('');
}

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

  const requestedProduct = new URLSearchParams(location.search).get('product');
  if (new Set([
    'Filter coffee', 'Roasted coffee beans', 'Instant coffee powder', 'Premium tea',
    'Cardamom tea', 'Masala tea', 'Assam tea bags', 'Flavoured tea bags', 'Green tea bags',
    'Flavoured green tea bags', 'Lemon tea bags', 'Areca tea bags', 'Flavoured areca tea bags',
    'Hot chocolate', 'Badam milk'
  ]).has(requestedProduct)) {
    fields.interest.value = 'Coffee & tea';
    fields.message.value = `I would like to know more about ${requestedProduct}. Please share the available packs and product details.`;
  }

  const equipmentEnquiries = {
    b2c: ['Bean-to-cup equipment', 'I would like to know more about the B2C 2.4 bean-to-cup coffee machine for my space.'],
    ftc: ['Filter coffee & tea equipment', 'I would like to know more about the FTC 2.4 filter coffee and tea system for my space.'],
    boilers: ['Hot-water boilers', 'I would like to discuss the boiler and beverage dispenser range. Please share the available models and capacities.']
  };
  const requestedEquipment = new URLSearchParams(location.search).get('equipment');
  if (Object.hasOwn(equipmentEnquiries, requestedEquipment)) {
    [fields.interest.value, fields.message.value] = equipmentEnquiries[requestedEquipment];
  }

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
    window.location.assign(url);
  });
  updateDraft();
}

if (typeof document !== 'undefined') connectEnquiryForm();
