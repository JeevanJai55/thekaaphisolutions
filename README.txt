The Kaphi Solutions Website

Run locally (requires Node.js):
1. Open a terminal in this folder.
2. Run: node preview.cjs
3. Open: http://127.0.0.1:4174/

The deployable website is in the dist folder. No package installation is required.

Deployment notes:
- Deploy the dist folder as a static site. It includes a custom 404 page and Vercel redirect configuration.
- The canonical URLs, sitemap, and structured data currently use the temporary chatgpt.site hostname. Update them to the final HTTPS domain before switching domains.
- Google Analytics is not enabled because no GA4 Measurement ID was provided. Verify the final domain in Search Console (DNS verification is suitable) after deployment.
