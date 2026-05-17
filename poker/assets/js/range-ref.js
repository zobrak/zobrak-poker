/**
 * range-ref.js — Transforme les balises [action/position] dans les articles
 * en boutons interactifs affichant la range correspondante.
 *
 * Syntaxe dans le markdown : [openc3b5b/utg]
 * → tab=openc3b5b, catégorie=utg
 */

(function(global) {
  'use strict';

  var PATTERN = /\[([a-zA-Z0-9_.,%-]+)\/([a-zA-Z0-9_-]+)\]/g;

  function initRangeRefs() {
    var containers = document.querySelectorAll('.article-content, .strat-content');
    containers.forEach(function(c) { processContainer(c); });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.range-ref-popup') && !e.target.closest('.range-ref-tag')) {
        closeAllPopups();
      }
    });
  }

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
    nodes.forEach(replaceTextNode);
  }

  function replaceTextNode(tn) {
    var text = tn.nodeValue;
    var frag = document.createDocumentFragment();
    var last = 0;
    var m;
    PATTERN.lastIndex = 0;
    while ((m = PATTERN.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var btn = document.createElement('button');
      btn.className = 'range-ref-tag';
      btn.setAttribute('data-tab', m[1]);
      btn.setAttribute('data-cat', m[2]);
      btn.textContent = m[1] + ' / ' + m[2].toUpperCase();
      btn.addEventListener('click', onTagClick);
      frag.appendChild(btn);
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    tn.parentNode.replaceChild(frag, tn);
  }

  function onTagClick(e) {
    e.stopPropagation();
    var btn = e.currentTarget;
    var tabName = btn.getAttribute('data-tab');
    var catName = btn.getAttribute('data-cat');

    closeAllPopups();

    var popup = document.createElement('div');
    popup.className = 'range-ref-popup';
    popup.innerHTML =
      '<div class="range-ref-popup-header">' +
        '<span class="range-ref-popup-title">' + esc(tabName) + ' / ' + esc(catName.toUpperCase()) + '</span>' +
        '<button class="range-ref-popup-close" aria-label="Fermer">×</button>' +
      '</div>' +
      '<div class="range-ref-popup-body"><p class="range-ref-loading">Chargement…</p></div>';

    popup.querySelector('.range-ref-popup-close').addEventListener('click', function(ev) {
      ev.stopPropagation();
      popup.remove();
    });

    document.body.appendChild(popup);
    positionPopup(popup, btn);

    var rmUrl = global.RM_FILE_URL;
    if (!rmUrl) {
      popup.querySelector('.range-ref-popup-body').innerHTML =
        '<p class="range-ref-error">Fichier de ranges non configuré (RM_FILE_URL manquant).</p>';
      return;
    }

    fetch(rmUrl)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) { renderInPopup(popup, data, tabName, catName); })
      .catch(function(err) {
        popup.querySelector('.range-ref-popup-body').innerHTML =
          '<p class="range-ref-error">Erreur chargement ranges : ' + esc(String(err)) + '</p>';
      });
  }

  function renderInPopup(popup, data, tabName, catName) {
    var body = popup.querySelector('.range-ref-popup-body');
    var cats = data.categories || {};

    var foundCatId = null;
    var lower = catName.toLowerCase();

    // Exact match first
    Object.keys(cats).forEach(function(id) {
      var c = cats[id];
      if (!foundCatId && (id.toLowerCase() === lower || (c.name || '').toLowerCase() === lower)) {
        foundCatId = id;
      }
    });
    // Partial match fallback
    if (!foundCatId) {
      Object.keys(cats).forEach(function(id) {
        var c = cats[id];
        if (!foundCatId &&
            (id.toLowerCase().includes(lower) || (c.name || '').toLowerCase().includes(lower))) {
          foundCatId = id;
        }
      });
    }

    if (!foundCatId) {
      body.innerHTML = '<p class="range-ref-error">Position &laquo;' + esc(catName) + '&raquo; introuvable.</p>';
      return;
    }

    var cat = cats[foundCatId];
    var tabs = cat.tabs || {};
    var tabLower = tabName.toLowerCase();
    var foundTabId = null;

    Object.keys(tabs).forEach(function(tid) {
      var t = tabs[tid];
      if (!foundTabId && (tid.toLowerCase() === tabLower || (t.name || '').toLowerCase() === tabLower)) {
        foundTabId = tid;
      }
    });
    if (!foundTabId) {
      Object.keys(tabs).forEach(function(tid) {
        var t = tabs[tid];
        if (!foundTabId &&
            (tid.toLowerCase().includes(tabLower) || (t.name || '').toLowerCase().includes(tabLower))) {
          foundTabId = tid;
        }
      });
    }

    if (!foundTabId) {
      body.innerHTML = '<p class="range-ref-error">Action &laquo;' + esc(tabName) + '&raquo; introuvable dans ' + esc(catName.toUpperCase()) + '.</p>';
      return;
    }

    if (typeof global.buildCellMap === 'function' && typeof global.renderRangeGrid === 'function') {
      var cellMap = global.buildCellMap(data, tabs[foundTabId]);
      body.innerHTML = '';
      var wrapper = document.createElement('div');
      wrapper.className = 'ranges-grid-wrapper';
      body.appendChild(wrapper);
      global.renderRangeGrid(cellMap, wrapper);
      if (typeof global.renderLegend === 'function') {
        global.renderLegend(data, tabs[foundTabId], body);
      }
    } else {
      body.innerHTML = '<p class="range-ref-error">ranges-ui.js non chargé sur cette page.</p>';
    }
  }

  function positionPopup(popup, anchor) {
    var rect = anchor.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 8;
    var left = Math.max(8, Math.min(rect.left + window.scrollX, window.innerWidth - 440));
    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

  function closeAllPopups() {
    document.querySelectorAll('.range-ref-popup').forEach(function(p) { p.remove(); });
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  global.initRangeRefs = initRangeRefs;

})(typeof window !== 'undefined' ? window : this);
