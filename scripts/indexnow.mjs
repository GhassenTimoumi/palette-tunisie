/* =========================================================
   Palette Tunisie — IndexNow submitter
   Instantly notifies Bing, Yandex, Seznam (and others) of new/updated
   URLs so they crawl faster. Google does NOT use IndexNow (use Search
   Console for Google). Run after each deploy:
     node scripts/indexnow.mjs
   Requires the key file "<key>.txt" at the repo root (already present)
   and the site to be live at the host below.
   ========================================================= */
import fs from 'node:fs';

const HOST = 'palette-tunisie.site';
const keyFile = fs.readdirSync('.').find(f => /^[0-9a-f]{16,32}\.txt$/.test(f));
if (!keyFile) { console.error('No IndexNow key file (<key>.txt) found at root.'); process.exit(1); }
const key = keyFile.replace('.txt', '');

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const body = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/${keyFile}`,
  urlList
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body)
});
console.log('IndexNow POST', res.status, res.statusText, '—', urlList.length, 'URLs submitted');
console.log('key:', key, '| keyLocation:', body.keyLocation);
if (res.status === 200 || res.status === 202) console.log('✓ Accepted. Bing/Yandex will crawl soon.');
else console.log('Body:', await res.text().catch(() => ''));
