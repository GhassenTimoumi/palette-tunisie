/* =========================================================
   SG Palette — consent + analytics
   Analytics stay OFF until BOTH:
     1) CONFIG.ANALYTICS.enabled === true (with IDs filled), and
     2) the visitor clicks "Accepter".
   Exposes global SGPTrack(event, params) used across the site:
     generate_lead, whatsapp_click, phone_click, estimator_used, maps_click
   ========================================================= */
(function (global) {
  'use strict';

  var CFG = global.SGP_CONFIG || {};
  var A = CFG.ANALYTICS || { enabled: false, ga4Id: '', metaPixelId: '' };
  var KEY = 'sgp-consent'; // 'granted' | 'denied'
  var loaded = false;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function analyticsConfigured() { return A.enabled && (A.ga4Id || A.metaPixelId); }
  function granted() { return stored() === 'granted' && analyticsConfigured(); }

  /* ---------- Loaders (injected only after consent) ---------- */
  function loadGA4() {
    if (!A.ga4Id) return;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(A.ga4Id);
    document.head.appendChild(s);
    global.dataLayer = global.dataLayer || [];
    global.gtag = function () { global.dataLayer.push(arguments); };
    global.gtag('js', new Date());
    global.gtag('config', A.ga4Id, { anonymize_ip: true });
  }
  function loadPixel() {
    if (!A.metaPixelId) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(global, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    global.fbq('init', A.metaPixelId);
    global.fbq('track', 'PageView');
  }
  function loadAll() {
    if (loaded || !granted()) return;
    loaded = true; loadGA4(); loadPixel();
  }

  /* ---------- Public tracking API (safe no-op until consent) ---------- */
  var PIXEL_MAP = { generate_lead: 'Lead', estimator_used: 'Lead', whatsapp_click: 'Contact', phone_click: 'Contact', maps_click: 'FindLocation' };
  global.SGPTrack = function (event, params) {
    if (!granted()) return;
    loadAll();
    try { if (typeof global.gtag === 'function') global.gtag('event', event, params || {}); } catch (e) {}
    try { if (typeof global.fbq === 'function') global.fbq('track', PIXEL_MAP[event] || 'CustomEvent', params || {}); } catch (e) {}
  };

  /* ---------- Consent banner ---------- */
  function showBanner() {
    var el = document.getElementById('consent'); if (!el) return;
    el.hidden = false;
    var acc = document.getElementById('consentAccept');
    var dec = document.getElementById('consentDecline');
    if (acc) acc.addEventListener('click', function () { save('granted'); el.hidden = true; loadAll(); });
    if (dec) dec.addEventListener('click', function () { save('denied'); el.hidden = true; });
  }

  function init() {
    // Delegate data-track clicks (whatsapp/phone/maps/cta...) regardless of analytics state.
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-track]'); if (!t) return;
      global.SGPTrack(t.getAttribute('data-track'), { label: (t.textContent || '').trim().slice(0, 40) });
    });

    if (!analyticsConfigured()) return;         // nothing to ask: tracking disabled in config
    if (stored() === 'granted') { loadAll(); return; }
    if (stored() === 'denied') return;
    showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
