/* =========================================================
   SG Palette — lead capture
   - Both forms POST JSON to CONFIG.LEAD_ENDPOINT
   - Client validation (Tunisian phone), honeypot, loading state,
     success message, error with WhatsApp fallback
   - Captures UTM params; prefills the sticky WhatsApp button
   ========================================================= */
(function (global) {
  'use strict';

  var CFG = global.SGP_CONFIG || {};
  var i18n = function (k) { return global.SGPi18n ? global.SGPi18n.t(k) : k; };
  var lang = function () { return global.SGP_LANG || 'fr'; };
  var track = function (ev, params) { if (typeof global.SGPTrack === 'function') global.SGPTrack(ev, params || {}); };

  /* ---------- Prices ---------- */
  global.SGP_PRICES = null;
  fetch('data/prices.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (p) { global.SGP_PRICES = p; document.dispatchEvent(new CustomEvent('sgp:prices', { detail: p })); })
    .catch(function () { /* no prices => "Prix sur devis" everywhere */ });

  /* ---------- UTM capture (persist for the session) ---------- */
  function utm() {
    var out = { utm_source: '', utm_medium: '', utm_campaign: '' };
    try {
      var qs = new URLSearchParams(global.location.search);
      Object.keys(out).forEach(function (k) {
        var v = qs.get(k);
        if (v) { out[k] = v; sessionStorage.setItem('sgp_' + k, v); }
        else { var s = sessionStorage.getItem('sgp_' + k); if (s) out[k] = s; }
      });
    } catch (e) {}
    return out;
  }

  /* ---------- Validation ---------- */
  function cleanPhone(v) { return (v || '').replace(/[\s\-().]/g, ''); }
  function isTnPhone(v) {
    var p = cleanPhone(v);
    // Optional +216 / 216 country code, then 8 local digits starting 2,3,4,5,7,9.
    return /^(\+?216)?[2-57-9]\d{7}$/.test(p);
  }
  function isEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function showStatus(el, type, html) {
    if (!el) return;
    el.hidden = false;
    el.className = 'form__status form__status--' + type;
    el.innerHTML = html;
  }
  function waFallbackLink(prefill) {
    var num = CFG.WHATSAPP_NUMBER || '21651886122';
    return '<a class="form__wa" target="_blank" rel="noopener" data-track="whatsapp_click" href="https://wa.me/' + num +
      '?text=' + encodeURIComponent(prefill || i18n('cta.title')) + '">' + i18n('form.err.wa') + '</a>';
  }

  /* ---------- Payload ---------- */
  function basePayload(source) {
    var u = utm();
    return {
      name: '', company: '', phone: '', email: '', need: '',
      quantity: '', format: '', condition: '', export_treatment: '', message: '',
      page_language: lang(),
      utm_source: u.utm_source, utm_medium: u.utm_medium, utm_campaign: u.utm_campaign,
      source: source,
      page_url: global.location.href,
      timestamp: new Date().toISOString()
    };
  }

  function estimatorSelection() {
    var g = function (id) { var e = document.getElementById(id); return e ? e.value : ''; };
    var seg = document.querySelector('#calcCond .seg__btn.active');
    var typeSel = document.getElementById('calcType');
    return {
      need: typeSel ? typeSel.options[typeSel.selectedIndex].text : '',
      format: g('calcSize'),
      condition: seg ? seg.getAttribute('data-val') : '',
      export_treatment: (document.getElementById('calcTreat') || {}).checked ? 'oui' : 'non',
      quantity: g('calcQty')
    };
  }

  /* ---------- WhatsApp prefill (sticky button + fallbacks) ---------- */
  function waMessage() {
    var sel = estimatorSelection();
    var parts = [lang() === 'ar' ? 'مرحبًا SG Palette، أودّ عرض سعر' : 'Bonjour SG Palette, je souhaite un devis'];
    if (sel.need) parts.push((lang() === 'ar' ? 'المنتج: ' : 'Produit : ') + sel.need);
    if (sel.format) parts.push((lang() === 'ar' ? 'المقاس: ' : 'Format : ') + sel.format);
    if (sel.quantity) parts.push((lang() === 'ar' ? 'الكمية: ' : 'Quantité : ') + sel.quantity);
    return parts.join('\n');
  }
  function updateWhatsApp() {
    var num = CFG.WHATSAPP_NUMBER || '21651886122';
    var f = document.getElementById('waFloat');
    if (f) f.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(waMessage());
  }

  /* ---------- Submit ---------- */
  function endpointReady() {
    return CFG.LEAD_ENDPOINT && CFG.LEAD_ENDPOINT.indexOf('REPLACE_WITH') === -1;
  }

  function submitLead(payload, btn, statusEl, successMsg) {
    var prefill = waMessage();
    if (!endpointReady()) {
      // No endpoint configured yet: don't pretend it sent — guide to WhatsApp.
      showStatus(statusEl, 'err', i18n('form.err') + ' ' + waFallbackLink(prefill));
      return;
    }
    var oldLabel = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.dataset.loading = '1'; btn.textContent = i18n('form.sending'); }
    showStatus(statusEl, 'info', i18n('form.sending'));

    fetch(CFG.LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      showStatus(statusEl, 'ok', successMsg || i18n('form.ok'));
      track(payload.source === 'estimator' ? 'estimator_used' : 'generate_lead', { source: payload.source });
      var form = btn ? btn.closest('form') : null;
      if (form && payload.source === 'form') form.reset();
    }).catch(function () {
      showStatus(statusEl, 'err', i18n('form.err') + ' ' + waFallbackLink(prefill));
    }).finally(function () {
      if (btn) { btn.disabled = false; delete btn.dataset.loading; btn.textContent = oldLabel; }
    });
  }

  function init() {
    updateWhatsApp();
    ['calcType', 'calcSize', 'calcQty', 'calcTreat'].forEach(function (id) {
      var e = document.getElementById(id); if (e) { e.addEventListener('change', updateWhatsApp); e.addEventListener('input', updateWhatsApp); }
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('#calcCond .seg__btn'); if (b) setTimeout(updateWhatsApp, 0);
    });
    document.addEventListener('sgp:lang', updateWhatsApp);

    /* Contact form */
    var quote = document.getElementById('quoteForm');
    if (quote) quote.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('formNote');
      var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
      var hp = quote.querySelector('.hp');
      if (hp && hp.value) return; // honeypot
      var name = g('name'), phone = g('phone'), email = g('email');
      if (!name) { showStatus(statusEl, 'err', i18n('form.invalid.name')); document.getElementById('name').focus(); return; }
      if (!isTnPhone(phone)) { showStatus(statusEl, 'err', i18n('form.invalid.phone')); document.getElementById('phone').focus(); return; }
      if (!isEmail(email)) { showStatus(statusEl, 'err', i18n('form.invalid.email')); document.getElementById('email').focus(); return; }
      var p = basePayload('form');
      p.name = name; p.company = g('company'); p.phone = phone; p.email = email;
      p.need = g('product'); p.quantity = g('monthlyQty'); p.message = g('message');
      submitLead(p, quote.querySelector('[type="submit"]'), statusEl, i18n('form.ok'));
    });

    /* Estimator form */
    var est = document.getElementById('estimatorForm');
    if (est) est.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('estimatorStatus');
      if (est.querySelector('.hp') && est.querySelector('.hp').value) return; // honeypot
      var sel = estimatorSelection();
      var p = basePayload('estimator');
      p.need = sel.need; p.format = sel.format; p.condition = sel.condition;
      p.export_treatment = sel.export_treatment; p.quantity = sel.quantity;
      p.message = lang() === 'ar' ? 'طلب من حاسبة التقدير' : 'Demande depuis l\'estimateur de devis';
      submitLead(p, document.getElementById('calcSend'), statusEl, i18n('form.ok'));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.SGPLead = { updateWhatsApp: updateWhatsApp, isTnPhone: isTnPhone };
})(window);
