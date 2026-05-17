/**
 * range-ref.js — Intégration inline de grilles de range dans les articles.
 *
 * Syntaxe : [N/M]
 *   N = numéro de catégorie (1-based, de haut en bas dans la sidebar)
 *   M = numéro d'onglet     (1-based, de gauche à droite dans les tabs)
 *
 * Remplace chaque tag par le tableau de ranges complet (grille + légende)
 * directement dans le flux de l'article.
 */

(function(global) {
  'use strict';

  var PATTERN = /\[(\d+)\/(\d+)\]/g;

  var _rmPromise = null;

  function getRMData() {
    if (_rmPromise) return _rmPromise;
    var rmUrl = global.RM_FILE_URL;
    if (!rmUrl) return Promise.reject(new Error('RM_FILE_URL non défini'));
    _rmPromise = fetch(rmUrl)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
    return _rmPromise;
  }

  // ── Résolution des indices → catégorie + onglet ───────────────────

  function resolveCatAndTab(data, catIdx, tabIdx) {
    var cats = typeof global.getRootCategories === 'function'
      ? global.getRootCategories(data)
      : fallbackCats(data);

    var cat = cats[catIdx - 1];
    if (!cat) return null;

    var tabs = typeof global.getTabs === 'function'
      ? global.getTabs(cat)
      : fallbackTabs(cat);

    var tab = tabs[tabIdx - 1];
    if (!tab) return null;

    return { cat: cat, tab: tab };
  }

  function fallbackCats(data) {
    var root = data.categories && data.categories.root;
    if (root && Array.isArray(root.children)) {
      return root.children.map(function(id) { return data.categories[id]; }).filter(Boolean);
    }
    return Object.values(data.categories || {}).filter(function(c) { return c && c.name; });
  }

  function fallbackTabs(cat) {
    var list = cat.tabList || Object.keys(cat.tabs || {});
    return list.map(function(tid) { return (cat.tabs || {})[tid]; }).filter(Boolean);
  }

  // ── Initialisation ────────────────────────────────────────────────

  function initRangeRefs() {
    var containers = document.querySelectorAll('.article-content, .strat-content');
    var placeholders = [];

    containers.forEach(function(c) {
      var found = processContainer(c);
      found.forEach(function(p) { placeholders.push(p); });
    });

    if (!placeholders.length) return;

    getRMData()
      .then(function(data) {
        placeholders.forEach(function(el) {
          var catIdx = parseInt(el.getAttribute('data-cat-idx'), 10);
          var tabIdx = parseInt(el.getAttribute('data-tab-idx'), 10);
          renderInline(el, data, catIdx, tabIdx);
        });
      })
      .catch(function(err) {
        placeholders.forEach(function(el) {
          el.innerHTML = '<p class="range-ref-error">Erreur chargement ranges : ' + esc(String(err)) + '</p>';
          el.classList.remove('range-ref-loading');
        });
      });
  }

  // ── Transformation du texte → placeholders ────────────────────────

  function processContainer(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n) {
        var tag = n.parentNode && n.parentNode.tagName;
        if (tag === 'CODE' || tag === 'PRE' || tag === 'SCRIPT') return NodeFilter.FILTER_REJECT;
        PATTERN.lastIndex = 0;
        return PATTERN.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }, false);

    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);

    var placeholders = [];
    nodes.forEach(function(tn) {
      var found = replaceTextNode(tn);
      found.forEach(function(p) { placeholders.push(p); });
    });
    return placeholders;
  }

  function replaceTextNode(tn) {
    var text = tn.nodeValue;
    var frag = document.createDocumentFragment();
    var placeholders = [];
    var last = 0;
    var m;
    PATTERN.lastIndex = 0;
    while ((m = PATTERN.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var catIdx = parseInt(m[1], 10);
      var tabIdx = parseInt(m[2], 10);

      var wrapper = document.createElement('div');
      wrapper.className = 'range-ref-inline range-ref-loading';
      wrapper.setAttribute('data-cat-idx', catIdx);
      wrapper.setAttribute('data-tab-idx', tabIdx);
      wrapper.innerHTML = '<p class="range-ref-spinner">Chargement de la range ' + catIdx + '/' + tabIdx + '…</p>';

      placeholders.push(wrapper);
      frag.appendChild(wrapper);
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    tn.parentNode.replaceChild(frag, tn);
    return placeholders;
  }

  // ── Rendu inline ──────────────────────────────────────────────────

  function renderInline(el, data, catIdx, tabIdx) {
    var resolved = resolveCatAndTab(data, catIdx, tabIdx);

    if (!resolved) {
      var cats = typeof global.getRootCategories === 'function'
        ? global.getRootCategories(data) : fallbackCats(data);
      el.innerHTML = '<p class="range-ref-error">Range introuvable ('
        + catIdx + '/' + tabIdx + ', max cat : ' + cats.length + ').</p>';
      el.classList.remove('range-ref-loading');
      return;
    }

    el.innerHTML = '';

    // Titre
    var title = document.createElement('div');
    title.className = 'range-ref-title';
    var tabName = resolved.tab.name || ('Tab ' + tabIdx);
    var catName = resolved.cat.name || ('Cat ' + catIdx);
    title.textContent = tabName + ' — ' + catName;
    el.appendChild(title);

    if (typeof global.buildCellMap === 'function' && typeof global.renderRangeGrid === 'function') {
      var cellMap = global.buildCellMap(data, resolved.tab);

      var gridWrapper = document.createElement('div');
      gridWrapper.className = 'ranges-grid-wrapper';
      el.appendChild(gridWrapper);
      global.renderRangeGrid(cellMap, gridWrapper);

      if (typeof global.renderLegend === 'function') {
        var legendEl = document.createElement('div');
        legendEl.className = 'ranges-legend';
        el.appendChild(legendEl);
        global.renderLegend(data, resolved.tab, legendEl);
      }
    } else {
      el.innerHTML += '<p class="range-ref-error">ranges-ui.js non chargé.</p>';
    }

    el.classList.remove('range-ref-loading');
  }

  // ── Utilitaire ────────────────────────────────────────────────────

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  global.initRangeRefs = initRangeRefs;

})(typeof window !== 'undefined' ? window : this);
