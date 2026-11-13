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

// All indexable pages — auto-discovered (root + produits/ + guides/ + zones/ + legal/).
function discover(dir, prefix = '') {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (/^(\.git|node_modules|scripts|assets|js|css|data)$/.test(e.name)) continue;
      out = out.concat(discover(path.join(dir, e.name), prefix + e.name + '/'));
    } else if (e.name.endsWith('.html') && e.name !== '404.html') {
      out.push(prefix + e.name);
    }
  }
  return out;
}
const PAGES = ['', ...discover('.').filter(p => p !== 'index.html').sort()];

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

// 3) robots.txt — GEO-friendly: wildcard allow + explicit AI-search crawlers
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
const aiBlock = AI_BOTS.map(b => `User-agent: ${b}\nAllow: /`).join('\n');
fs.writeFileSync('robots.txt',
  `User-agent: *\nAllow: /\n\n# AI / GEO crawlers explicitly welcomed\n${aiBlock}\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('wrote robots.txt (GEO)');
