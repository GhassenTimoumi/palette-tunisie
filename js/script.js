/* SG Palette — interactions (UI only; forms handled by js/lead.js) */
(function () {
  'use strict';
  var lang = function () { return window.SGP_LANG || 'fr'; };
  var i18n = function (k) { return window.SGPi18n ? window.SGPi18n.t(k) : k; };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open'); burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Pallet illustrations ---------- */
  var P = window.SGPallet;
  if (P) {
    P.render(document.getElementById('heroPallet'), { scale: 22, topBoards: 5, accentIndex: 2, animate: !reduceMotion, label: 'Palette en bois SG Palette' });
    P.render(document.getElementById('aboutPallet'), { scale: 17, topBoards: 5, accentIndex: 2 });
    P.render(document.getElementById('preloaderPallet'), { scale: 15, topBoards: 5, accentIndex: 2, animate: !reduceMotion });
  }

  /* ---------- Gallery fallback (static markup already present) ---------- */
  var GAL = [
    { f: 'palette-bois-neuve-tunisie.jpg', key: 'gal.g1' }, { f: 'palette-europe-epal.jpg', key: 'gal.g2' },
    { f: 'caisse-bois-emballage.jpg', key: 'gal.g3' }, { f: 'palette-renforcee-bois.jpg', key: 'gal.g4' },
    { f: 'caisse-bois-grand-format.jpg', key: 'gal.g5' }, { f: 'palettes-empilees-stock.jpg', key: 'gal.g6' }
  ];
  var gal = document.getElementById('gallery');
  if (gal && !gal.children.length) {
    gal.innerHTML = GAL.map(function (g) {
      var alt = i18n(g.key);
      return '<figure class="g-card reveal"><div class="g-card__img g-card__img--photo">' +
        '<img src="assets/gallery/' + g.f + '" alt="' + alt + '" loading="lazy" /></div>' +
        '<figcaption data-i18n="' + g.key + '">' + alt + '</figcaption></figure>';
    }).join('');
  }

  /* ---------- Social buttons ---------- */
  /* CONFIRM: replace FB/IG/LinkedIn hrefs with SG Palette's real profiles (or remove). */
  var CFG = window.SGP_CONFIG || {};
  var wa = CFG.WHATSAPP_NUMBER || '21651886122';
  var SOCIAL = [
    { name: 'WhatsApp', href: 'https://wa.me/' + wa, cls: 'wa', track: 'whatsapp_click', path: 'M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.516 5.26l-.999 3.648 3.472-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.199.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z' },
    { name: 'Facebook', href: 'https://www.facebook.com/', cls: 'fb', path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z' },
    { name: 'Instagram', href: 'https://www.instagram.com/', cls: 'ig', path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm6.41-10.4a1.44 1.44 0 11-1.44-1.44 1.44 1.44 0 011.44 1.44z' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/', cls: 'in', path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 112.06-2.07 2.07 2.07 0 01-2.06 2.07zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z' }
  ];
  function socialHTML() {
    return SOCIAL.map(function (s) {
      return '<a class="social__btn social__btn--' + s.cls + '" href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + s.name + '"' +
        (s.track ? ' data-track="' + s.track + '"' : '') + '><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="' + s.path + '"/></svg></a>';
    }).join('');
  }
  ['socialRow', 'socialFooter'].forEach(function (id) { var el = document.getElementById(id); if (el) el.innerHTML = socialHTML(); });

  /* ---------- Estimator (preview + price display) ---------- */
  var TYPE_OPTS = { standard: { topBoards: 5, accentIndex: 2 }, euro: { topBoards: 7, accentIndex: 3 }, crate: { crate: true }, heavy: { topBoards: 6, accentIndex: 2 } };
  var elType = document.getElementById('calcType'), elSize = document.getElementById('calcSize'),
      elTreat = document.getElementById('calcTreat'), elQty = document.getElementById('calcQty'),
      elQtyVal = document.getElementById('calcQtyVal'), elUnit = document.getElementById('calcUnit'),
      elTotal = document.getElementById('calcTotal'), elPreview = document.getElementById('calcPreview');
  var cond = 'new';

  function money(v) {
    var loc = lang() === 'ar' ? 'ar-TN' : 'fr-TN';
    var cur = (window.SGP_PRICES && window.SGP_PRICES.currency) || 'TND';
    var sym = lang() === 'ar' ? 'د.ت' : 'DT';
    return v.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + sym + (cur !== 'TND' ? '' : '');
  }

  // Returns a number (unit price) or null when any needed price is missing => "Prix sur devis".
  function unitPrice(ty, sz, treat) {
    var pr = window.SGP_PRICES; if (!pr || !pr.types || !pr.types[ty]) return null;
    var base = pr.types[ty].unit_price_tnd;
    if (base === null || base === undefined || base === '') return null;
    var sf = (pr.size_factor && pr.size_factor[sz] != null) ? pr.size_factor[sz] : 1;
    var cf = (pr.condition_factor && pr.condition_factor[cond] != null) ? pr.condition_factor[cond] : 1;
    var u = base * sf * cf;
    if (treat) { var t = pr.export_treatment_tnd; if (t != null && t !== '') u += t; }
    // quantity discount
    var q = parseInt((elQty && elQty.value) || '0', 10);
    if (pr.qty_discounts && pr.qty_discounts.length) {
      var factor = 1;
      pr.qty_discounts.forEach(function (d) { if (q >= d.min_qty) factor = d.factor; });
      u *= factor;
    }
    return u;
  }

  function recalc() {
    if (!elType) return;
    var ty = elType.value, sz = elSize.value, q = parseInt(elQty.value, 10);
    if (elQtyVal) elQtyVal.textContent = q.toLocaleString(lang() === 'ar' ? 'ar-TN' : 'fr-TN');
    var u = unitPrice(ty, sz, elTreat && elTreat.checked);
    if (u == null) {
      var msg = i18n('calc.priceonquote');
      if (elUnit) elUnit.textContent = msg;
      if (elTotal) elTotal.textContent = msg;
    } else {
      if (elUnit) elUnit.textContent = money(u);
      if (elTotal) elTotal.textContent = money(u * q);
    }
    if (elPreview && P) P.render(elPreview, Object.assign({ scale: 15 }, TYPE_OPTS[ty]));
  }

  if (elType) {
    [elType, elSize, elTreat, elQty].forEach(function (el) { el.addEventListener('input', recalc); el.addEventListener('change', recalc); });
    var seg = document.getElementById('calcCond');
    if (seg) seg.querySelectorAll('.seg__btn').forEach(function (b) {
      b.addEventListener('click', function () {
        seg.querySelectorAll('.seg__btn').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); cond = b.getAttribute('data-val'); recalc();
      });
    });
  }
  document.addEventListener('sgp:prices', recalc);

  /* ---------- i18n init (default FR) + recalc on language change ---------- */
  if (window.SGPi18n) window.SGPi18n.init();
  document.addEventListener('sgp:lang', recalc);

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) { setTimeout(function () { e.target.classList.add('in'); }, (i % 4) * 80); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Counters (values are baked in HTML; animate as enhancement) ---------- */
  var nums = document.querySelectorAll('.stat__num');
  function animateNum(el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dur = 1500, start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3), val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateNum(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { cio.observe(n); });
  } /* else: leave baked values as-is */

  /* ---------- Year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  recalc();
})();
