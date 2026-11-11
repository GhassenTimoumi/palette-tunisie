/* =========================================================
   SG Palette — regenerate SEO URLs from js/config.js
   Run:  node scripts/build-seo.mjs
   - Reads BASE_URL from js/config.js (USE_CUSTOM_DOMAIN + DOMAIN or GITHUB_PAGES_URL)
   - Rewrites every absolute site URL in *.html (canonical/OG/hreflang/JSON-LD)
   - Regenerates sitemap.xml and robots.txt
   Safe to run repeatedly (idempotent).
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';

const cfg = fs.readFileSync('js/config.js', 'utf8');
const get = (re, d = '') => { const m = cfg.match(re); return m ? m[1] : d; };
const useCustom = /USE_CUSTOM_DOMAIN:\s*true/.test(cfg);
const domain = get(/DOMAIN:\s*'([^']*)'/);
const ghPages = get(/GITHUB_PAGES_URL:\s*'([^']*)'/);
const BASE = (useCustom && domain ? domain.replace(/\/+$/, '') + '/' : ghPages);

// Known previous base URLs we might need to replace with the new BASE.
const OLD = [ghPages, (domain.replace(/\/+$/, '') + '/')].filter(Boolean);

// All indexable pages (relative to repo root).
const PAGES = [
  '',
  'produits/palette-bois-tunisie.html',
  'produits/palette-eur-epal.html',
  'produits/palette-export-ispm15.html',
  'produits/caisse-bois.html',
  'produits/palette-sur-mesure.html',
  'produits/palette-reemployee.html',
  'legal/confidentialite.html',
  'legal/mentions-legales.html'
];

// 1) Rewrite absolute URLs inside every HTML file.
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/^(\.git|node_modules)$/.test(e.name)) walk(p); }
    else if (e.name.endsWith('.html')) {
      let h = fs.readFileSync(p, 'utf8'); let before = h;
      for (const o of OLD) if (o && o !== BASE) h = h.split(o).join(BASE);
      if (h !== before) { fs.writeFileSync(p, h); console.log('updated URLs:', p); }
    }
  }
}
walk('.');

// 2) sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.map(rel => {
  const loc = BASE + rel;
  const pr = rel === '' ? '1.0' : (rel.startsWith('legal/') ? '0.3' : '0.8');
  return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`;
}).join('\n');
fs.writeFileSync('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log('wrote sitemap.xml (' + PAGES.length + ' urls), base=' + BASE);

// 3) robots.txt
fs.writeFileSync('robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('wrote robots.txt');
