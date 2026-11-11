The Kaphi Solutions Website

Run locally (requires Node.js):
1. Open a terminal in this folder.
2. Run: node preview.cjs
3. Open: http://127.0.0.1:4174/

The deployable website is in the dist folder. The root vercel.json points Vercel to that folder, so keep the Vercel project Root Directory set to the repository root. No package installation is required.

Deployment notes:
- Deploy the repository root to Vercel; its root vercel.json sets dist as the output directory. Push this configuration and redeploy after importing the repository.
- The dist folder includes the static website and custom 404 page.
- The canonical URLs, sitemap, and structured data currently use the temporary chatgpt.site hostname. Update them to the final HTTPS domain before switching domains.
- Google Analytics is not enabled because no GA4 Measurement ID was provided. Verify the final domain in Search Console (DNS verification is suitable) after deployment.
