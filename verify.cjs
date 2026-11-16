const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
 const root = path.join(__dirname, 'dist');
 let checked = 0;
 for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  for (const [, ref] of html.matchAll(/(?:src|href|poster|data-src)="([^"]+)"/g)) {
   if (/^(https?:|tel:|mailto:|#)/.test(ref)) continue;
   const local = decodeURIComponent(ref.split(/[?#]/)[0]);
   if (!local) continue;
   assert.ok(fs.existsSync(path.join(root, local)), `${file}: missing ${local}`);
   checked++;
  }
 }
 const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
 assert.ok(home.includes('Better coffee.'));
 assert.equal((home.match(/class="space-card"/g) || []).length, 3);
 assert.ok(home.includes('<script src="machine-rail.js"'));
 assert.ok(home.includes('assets/kaphi-equipment-brochure.pdf'));
 assert.ok(home.includes('<script src="brochure-popup.js" defer></script>'));
 assert.ok(!home.includes('<form id="enquiry">'));
 assert.ok(home.includes('<form id="brochure-download-form">'));
 assert.ok(home.includes('name="name"'));
 assert.ok(home.includes('name="email"'));
 assert.ok(!home.includes('whatsapp-enquiry.mjs'));
 assert.ok(!fs.existsSync(path.join(__dirname, 'api', 'brochure-leads.mjs')));
 const packagedHome = fs.readFileSync(path.join(__dirname, 'update-package', 'dist', 'index.html'), 'utf8');
 assert.ok(packagedHome.includes('<form id="brochure-download-form">'));
 assert.ok(packagedHome.includes('assets/kaphi-equipment-brochure.pdf'));
 console.log(`PASS: all page IDs unique, ${checked} local asset/link references exist, conversion sections present.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
