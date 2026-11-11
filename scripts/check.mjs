import fs from 'node:fs';
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/script.js', 'utf8');
const problems = [];
const ok = [];

// 1. Duplicate IDs
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
dup.length ? problems.push('Duplicate IDs: ' + [...new Set(dup)].join(', ')) : ok.push('No duplicate IDs (' + ids.length + ' ids)');

// 2. Anchor targets
const anchors = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))];
anchors.forEach(a => { if (!ids.includes(a)) problems.push('Anchor #' + a + ' has no matching id'); });
ok.push('Anchors checked: ' + anchors.length);

// 3. JS getElementById coverage
const jsIds = [...new Set([...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]))];
jsIds.forEach(id => { if (!ids.includes(id)) problems.push('JS getElementById("' + id + '") missing in HTML'); });
ok.push('JS DOM ids checked: ' + jsIds.length);

// 4. Local asset references exist
const refs = [...new Set([...html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"]+)"/g)].map(m => m[1]))];
refs.forEach(r => { if (!fs.existsSync(r)) problems.push('Missing asset: ' + r); });
ok.push('Local assets checked: ' + refs.length);

// 5. Raw unescaped ampersands (outside tags/entities)
const amp = [...html.matchAll(/&(?!amp;|lt;|gt;|quot;|apos;|nbsp;|#\d+;|#x[0-9a-f]+;|[a-zA-Z]+;)/g)];
amp.length ? problems.push('Raw unescaped & : ' + amp.length + ' occurrence(s)') : ok.push('No raw ampersands');

// 6. <img> without alt
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
const noAlt = imgs.filter(t => !/\salt="/.test(t));
noAlt.length ? problems.push(noAlt.length + ' <img> without alt:\n   ' + noAlt.join('\n   ')) : ok.push('All ' + imgs.length + ' <img> have alt');

// 7. Tag balance for structural tags
['section', 'header', 'footer', 'form', 'figure', 'article', 'nav', 'ul', 'select'].forEach(tag => {
  const open = (html.match(new RegExp('<' + tag + '\\b', 'g')) || []).length;
  const close = (html.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  if (open !== close) problems.push('Tag imbalance <' + tag + '>: ' + open + ' open / ' + close + ' close');
});
ok.push('Structural tag balance checked');

// 8. <html> lang + dir
if (!/<html[^>]*\blang="fr"/.test(html)) problems.push('<html lang="fr"> missing');
if (!/<html[^>]*\bdir="ltr"/.test(html)) problems.push('<html dir="ltr"> missing');

// 9. Single H1
const h1 = (html.match(/<h1\b/g) || []).length;
h1 === 1 ? ok.push('Exactly one <h1>') : problems.push('H1 count = ' + h1 + ' (should be 1)');

// 10. Preloader failsafe (must hide even if script.js errors OR JS disabled)
const noscriptGuard = /<noscript>\s*<style>[^<]*#preloader\s*\{\s*display:\s*none/i.test(html);
const inlineFailsafe = /id="preloader"[\s\S]{0,700}?<script>[\s\S]*?getElementById\(['"]preloader['"]\)/.test(html);
(noscriptGuard && inlineFailsafe)
  ? ok.push('Preloader has failsafe (noscript + independent inline script)')
  : problems.push('Preloader failsafe missing (noscript:' + noscriptGuard + ' inline:' + inlineFailsafe + ')');

// 11. Links with target=_blank must have rel=noopener
const blanks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(m => m[0]);
const noRel = blanks.filter(t => !/rel="[^"]*noopener/.test(t));
noRel.length ? problems.push(noRel.length + ' target=_blank link(s) missing rel=noopener') : ok.push('All ' + blanks.length + ' _blank links have rel=noopener');

// 12. iframe title
const iframes = [...html.matchAll(/<iframe\b[^>]*>/g)].map(m => m[0]);
iframes.forEach(t => { if (!/\stitle="/.test(t)) problems.push('iframe without title'); });

console.log('--- PASSED ---'); ok.forEach(o => console.log('  ✓ ' + o));
console.log('\n--- ISSUES (' + problems.length + ') ---');
problems.forEach(p => console.log('  ✗ ' + p));
