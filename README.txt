The Kaphi Solutions Website

Run locally (requires Node.js):
1. Open a terminal in this folder.
2. Run: node preview.cjs
3. Open: http://127.0.0.1:4174/

The deployable website is in the dist folder. The root vercel.json points Vercel to that folder, so keep the Vercel project Root Directory set to the repository root. No package installation is required.

Deployment notes:
- Deploy the repository root to Vercel; its root vercel.json sets dist as the output directory and adds production hardening headers and CDN-friendly cache settings. Push this configuration and redeploy after importing the repository.
- The dist folder includes the static website and custom 404 page.
- Homepage videos are served from this repository's Git LFS media endpoint because Vercel deploys Git LFS pointer files instead of the video bytes. Update those media URLs if the repository or asset location changes.
- The local preview server also applies security headers and sensible cache lifetimes for HTML versus immutable assets.
- Brochure links on the home and machines pages open a popup requesting name and email (phone and business are optional), then provide the PDF download. Email delivery is not configured; submitted details are not sent or stored.
- The contact form prepares an enquiry in WhatsApp. Review the message and choose whether to send it; details are not stored by the website. Phone and WhatsApp contact links remain available.
- If Google Sheets credentials were previously added to Vercel, remove GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY from Project Settings > Environment Variables, then redeploy. If the Google service account was created only for this site, remove its key or account in Google Cloud. Existing rows in any spreadsheet are not deleted by this code change.
- The canonical URLs, sitemap, and structured data currently use the temporary chatgpt.site hostname. Update them to the final HTTPS domain before switching domains.
- Google Analytics is not enabled because no GA4 Measurement ID was provided. Verify the final domain in Search Console (DNS verification is suitable) after deployment.
