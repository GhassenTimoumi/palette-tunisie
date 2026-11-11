/* =========================================================
   SG Palette — isometric pallet illustration generator
   Builds crisp, themeable SVG "photos" of pallets & crates.
   Art style matches the SGP logo (isometric, warm wood + teal).
   ========================================================= */
(function (global) {
  'use strict';

  var COLORS = {
    wood:      { top: '#D9AB66', right: '#B9823F', left: '#89592A' },
    woodDark:  { top: '#C79A58', right: '#A5722F', left: '#7A4E24' },
    teal:      { top: '#1FB89A', right: '#148E76', left: '#0C6E5A' },
    crate:     { top: '#E0C07E', right: '#C19B55', left: '#94703A' }
  };

  var SX = 0.866; // iso x projection
  function project(x, y, z, s, ox, oy) {
    return [ox + (x - y) * SX * s, oy + (x + y) * 0.5 * s - z * s];
  }
  function pts(arr) { return arr.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }

  // One extruded wooden board -> 3 visible faces (left, right, top).
  function boardSVG(b, s, ox, oy) {
    var P = function (x, y, z) { return project(x, y, z, s, ox, oy); };
    var c = COLORS[b.tone] || COLORS.wood;
    var top   = [P(b.x0, b.y0, b.z1), P(b.x1, b.y0, b.z1), P(b.x1, b.y1, b.z1), P(b.x0, b.y1, b.z1)];
    var right = [P(b.x1, b.y0, b.z1), P(b.x1, b.y1, b.z1), P(b.x1, b.y1, b.z0), P(b.x1, b.y0, b.z0)];
    var left  = [P(b.x0, b.y1, b.z1), P(b.x1, b.y1, b.z1), P(b.x1, b.y1, b.z0), P(b.x0, b.y1, b.z0)];
    var g = '<polygon points="' + pts(left) + '" fill="' + c.left + '"/>' +
            '<polygon points="' + pts(right) + '" fill="' + c.right + '"/>' +
            '<polygon points="' + pts(top) + '" fill="' + c.top + '"/>';
    if (b.plank) {
      var attr = b.animate ? ' class="sgp-plank" style="animation-delay:' + (b.delay || 0) + 'ms"' : '';
      return '<g' + attr + '>' + g + '</g>';
    }
    return g;
  }

  // Build the board list for a single pallet, stacked at zBase.
  function addPallet(boards, opts, zBase) {
    var W = 7, D = 6;
    var topN = opts.topBoards || 5;
    var accent = (opts.accentIndex === undefined) ? Math.floor(topN / 2) : opts.accentIndex;

    // z levels
    var bz = [zBase + 0,    zBase + 0.65];
    var sz = [zBase + 0.65, zBase + 1.5];
    var tz = [zBase + 1.5,  zBase + 2.15];

    // bottom deck (3 boards along X)
    var bw = 0.8, bYs = [0, (D - bw) / 2, D - bw];
    bYs.forEach(function (y) {
      boards.push({ x0: 0, y0: y, z0: bz[0], x1: W, y1: y + bw, z1: bz[1], tone: 'woodDark' });
    });

    // stringers (3 along Y)
    var sw = 0.8, sXs = [0, (W - sw) / 2, W - sw];
    sXs.forEach(function (x) {
      boards.push({ x0: x, y0: 0, z0: sz[0], x1: x + sw, y1: D, z1: sz[1], tone: 'woodDark' });
    });

    if (opts.crate) {
      // crate body sitting on the base + teal band
      boards.push({ x0: 0.3, y0: 0.3, z0: sz[1], x1: W - 0.3, y1: D - 0.3, z1: zBase + 3.6, tone: 'crate' });
      boards.push({ x0: 0.3, y0: 0.3, z0: zBase + 2.3, x1: W - 0.3, y1: D - 0.3, z1: zBase + 2.75, tone: 'teal' });
      return;
    }

    // top deck (topN boards along X), front-to-back order handled by push order (increasing Y)
    var tbw = 0.72;
    var gap = (D - topN * tbw) / (topN - 1);
    var base = Date.now ? 0 : 0;
    for (var i = 0; i < topN; i++) {
      var y = i * (tbw + gap);
      boards.push({
        x0: 0, y0: y, z0: tz[0], x1: W, y1: y + tbw, z1: tz[1],
        tone: (i === accent ? 'teal' : 'wood'),
        plank: true, animate: opts.animate, delay: 120 + i * 110
      });
    }
  }

  function buildSVG(opts) {
    opts = opts || {};
    var s = opts.scale || 20;
    var boards = [];
    addPallet(boards, opts, 0);
    if (opts.stack) addPallet(boards, Object.assign({}, opts, { animate: false }), 2.35);

    // compute bounds from all corners
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    boards.forEach(function (b) {
      [[b.x0, b.y0, b.z0], [b.x1, b.y0, b.z0], [b.x0, b.y1, b.z0], [b.x1, b.y1, b.z0],
       [b.x0, b.y0, b.z1], [b.x1, b.y0, b.z1], [b.x0, b.y1, b.z1], [b.x1, b.y1, b.z1]].forEach(function (c) {
        var p = project(c[0], c[1], c[2], s, 0, 0);
        if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
      });
    });
    var pad = 18;
    var ox = -minX + pad, oy = -minY + pad;
    var vbW = (maxX - minX) + pad * 2, vbH = (maxY - minY) + pad * 2;

    // ground shadow (project footprint center at z=0)
    var cx = project(3.5, 3, 0, s, ox, oy);
    var shadow = '<ellipse cx="' + cx[0].toFixed(1) + '" cy="' + (cx[1] + 6).toFixed(1) +
      '" rx="' + (s * 5).toFixed(1) + '" ry="' + (s * 1.7).toFixed(1) + '" fill="#2E2016" opacity="0.12"/>';

    var body = boards.map(function (b) { return boardSVG(b, s, ox, oy); }).join('');

    return '<svg class="sgp-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      vbW.toFixed(0) + ' ' + vbH.toFixed(0) + '" role="img" aria-label="' +
      (opts.label || 'Palette en bois SG Palette') + '">' + shadow + body + '</svg>';
  }

  global.SGPallet = {
    svg: buildSVG,
    render: function (el, opts) { if (el) el.innerHTML = buildSVG(opts); }
  };
})(window);
