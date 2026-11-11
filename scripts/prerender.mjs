// One-off: bake French (default-lang) content into static index.html for SEO/AI crawlers.
// Idempotent: only fills elements that are empty; JS i18n still swaps to AR at runtime.
import fs from 'node:fs';

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');
const src = fs.readFileSync('js/i18n.js', 'utf8');

// Extract the DICT object literal (pure data) and eval it to get exact FR strings.
const start = src.indexOf('var DICT = ');
const end = src.indexOf('function apply');
const dictLiteral = src.slice(start + 'var DICT = '.length, end).trim().replace(/;$/, '');
const DICT = eval('(' + dictLiteral + ')');
const fr = DICT.fr;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 1) Fill EMPTY data-i18n elements with their FR value (raw HTML if data-i18n-html).
let filled = 0;
html = html.replace(/(<(\w+)([^>]*\bdata-i18n="([^"]+)"[^>]*)>)<\/\2>/g, (m, open, tag, attrs, key) => {
  const val = fr[key];
  if (val === undefined) return m;
  filled++;
  const isHtml = /\bdata-i18n-html\b/.test(attrs);
  return open + (isHtml ? val : esc(val)) + '</' + tag + '>';
});

// 2) Add static placeholders for inputs/textarea that only have data-i18n-ph.
let ph = 0;
html = html.replace(/<(input|textarea)([^>]*\bdata-i18n-ph="([^"]+)"[^>]*)>/g, (m, tag, attrs, key) => {
  if (/\bplaceholder=/.test(attrs)) return m;
  const val = fr[key];
  if (val === undefined) return m;
  ph++;
  return `<${tag}${attrs} placeholder="${val.replace(/"/g, '&quot;')}">`;
});

// 3) Render the gallery statically (real <img> + descriptive alt + dimensions).
const GAL = [
  { f: 'palette-bois-neuve-tunisie.jpg', w: 675, h: 900, key: 'gal.g1', alt: 'Palette en bois neuve empilée — SG Palette Tunisie' },
  { f: 'palette-europe-epal.jpg',        w: 900, h: 397, key: 'gal.g2', alt: 'Palette Europe EUR / EPAL normalisée en bois' },
  { f: 'caisse-bois-emballage.jpg',      w: 900, h: 675, key: 'gal.g3', alt: 'Caisses en bois pour emballage et transport' },
  { f: 'palette-renforcee-bois.jpg',     w: 900, h: 611, key: 'gal.g4', alt: 'Palettes en bois renforcées empilées' },
  { f: 'caisse-bois-grand-format.jpg',   w: 900, h: 675, key: 'gal.g5', alt: 'Caisse en bois grand format sur chariot élévateur' },
  { f: 'palettes-empilees-stock.jpg',    w: 849, h: 900, key: 'gal.g6', alt: 'Palettes EUR / EPAL neuves empilées en stock' }
];
const galHTML = GAL.map(g =>
  `<figure class="g-card reveal">` +
  `<div class="g-card__img g-card__img--photo"><img src="assets/gallery/${g.f}" alt="${g.alt}" width="${g.w}" height="${g.h}" loading="lazy" /></div>` +
  `<figcaption data-i18n="${g.key}">${esc(fr[g.key])}</figcaption></figure>`
).join('\n        ');
html = html.replace(/<div class="gallery" id="gallery"><\/div>/,
  `<div class="gallery" id="gallery">\n        ${galHTML}\n      </div>`);

fs.writeFileSync(htmlPath, html);
console.log(`filled ${filled} text nodes, ${ph} placeholders, gallery static: ${/palettes-empilees-stock/.test(html)}`);
