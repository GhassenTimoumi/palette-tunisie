/* =========================================================
   Palette Tunisie — SITE CONFIGURATION (single source of truth)
   Brand: "Palette Tunisie" — opéré par la Société Galgaoui (SG Palette).
   Items marked TODO must be confirmed before going live.
   ========================================================= */
(function (global) {
  'use strict';

  var CONFIG = {
    /* -------- Brand / identity -------- */
    BRAND: 'Palette Tunisie',
    LEGAL_ENTITY: 'Société Galgaoui (SG Palette)',   // real operating company
    THEME: 'modern',

    /* -------- Domain / deployment (Cloudflare Pages + custom domain) --------
       DOMAIN is the production custom domain. Before DNS is live, the site also
       works on the *.pages.dev URL Cloudflare assigns. Canonical/OG/sitemap use DOMAIN. */
    DOMAIN: 'https://palette-tunisie.site',          // purchased domain (.site)
    GITHUB_PAGES_URL: 'https://ghassentimoumi.github.io/sg-palette/', // legacy base (used by build-seo to rewrite old URLs)
    USE_CUSTOM_DOMAIN: true,

    /* -------- Lead capture --------
       Paste the n8n/Make/Zapier webhook URL (JSON POST). Placeholder => WhatsApp/email fallback. */
    LEAD_ENDPOINT: 'https://REPLACE_WITH_N8N_WEBHOOK_URL',

    /* -------- Contact (shared operating company) --------*/
    WHATSAPP_NUMBER: '21651886122',
    PHONE_DISPLAY: '+216 51 886 122',
    PHONE_HREF: '+21651886122',
    EMAIL: 'contact@sg-palette.com',                 // TODO: switch to contact@palette-tunisie.site once mailbox exists
    ADDRESS: 'Boujardgua, Mornag, Ben Arous — Tunisie',
    MAPS_QUERY: 'Mornag,+Ben+Arous,+Tunisie',
    RESPONSE_TIME: { fr: 'sous 2 heures ouvrables', ar: 'خلال ساعتين عمل' },

    /* -------- Trust numbers — TODO confirm (rendered statically; JS only animates) -------- */
    STATS: [
      { value: 25,  suffix: '+', key: 'stat.years' },
      { value: 200, suffix: '+', key: 'stat.refs'  },
      { value: 100, suffix: '%', key: 'stat.eco'   }
    ],

    /* -------- Analytics (OFF until consent + IDs filled) -------- */
    ANALYTICS: { enabled: false, ga4Id: '', metaPixelId: '' }
  };

  CONFIG.BASE_URL = (CONFIG.USE_CUSTOM_DOMAIN && CONFIG.DOMAIN)
    ? (CONFIG.DOMAIN.replace(/\/+$/, '') + '/')
    : CONFIG.GITHUB_PAGES_URL;

  global.SGP_CONFIG = CONFIG;
})(window);
