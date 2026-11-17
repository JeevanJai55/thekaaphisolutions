# Kaphi website refresh

The updated working copy is in this folder. The original Desktop project has not been modified.

## Run

From this folder, run:

```powershell
node preview.cjs --port=4387
```

Open http://127.0.0.1:4387/. If the port is in use, choose another with `--port=4388`.

## Changes

- Stronger homepage headline and visitor-focused copy.
- Office, cafe and shared-space paths to the contact section.
- A brochure download popup that requires name and email, with phone and business optional, plus a mobile call/contact bar.
- Three large, full-width homepage videos, stacked vertically in their original widescreen proportions.
- Continuous horizontal equipment carousel, including while hovering. Keyboard focus, touch interaction and reduced-motion preferences are respected.
- Shorter reveal animations and a background-video pause button.
- Brochure links on the home and machines pages open a details popup and provide the PDF download; email delivery is not configured, and visitor details are not sent or stored.
- Restored the contact enquiry form. It prepares a message in WhatsApp for the visitor to review and send; the website does not store the submitted details.
- Existing product pages, supplied media and contact details retained; Google Sheets lead storage removed.

## Apply the update archive

The older `kaphi-website-update.zip` archive does not include these latest changes. Do not use it to deploy; deploy the current working copy instead.

## Lead collection

The website does not send lead details to Google Sheets. The brochure form validates visitor details and provides the download without sending or storing those details. The contact form opens a prefilled WhatsApp message; the visitor reviews it and chooses whether to send.

## Validation and limits

Run `node verify.cjs` to check local page references and verify the brochure form is present without the old Google Sheets endpoint.

Existing customer testimonials were preserved; confirm their accuracy and permission before publication. No conversion-rate outcome is guaranteed or measured by this update.

The obsolete one-time refresh utility has been removed.
