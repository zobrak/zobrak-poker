/**
 * range-ref.js — Tags de range inline dans les articles.
 *
 * Syntaxe : [N/M]
 *   N = numéro de catégorie (1-based, de haut en bas dans la sidebar)
 *   M = numéro d'onglet     (1-based, de gauche à droite dans les tabs)
 *
 * Exemple : [3/2] → 3ème catégorie, 2ème onglet.
 */

(function(global) {
  'use strict';

  var PATTERN = /\[(\d+)\/(\d+)\]/g;

  function initRangeRefs() {
    var containers = document.querySelectorAll('.article-content, .strat-content');
    containers.forEach(processContainer);

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
      var catIdx = parseInt(m[1], 10);
      var tabIdx = parseInt(m[2], 10);
      var btn = document.createElement('button');
      btn.className = 'range-ref-tag';
      btn.setAttribute('data-cat-idx', catIdx);
      btn.setAttribute('data-tab-idx', tabIdx);
      btn.textContent = catIdx + '/' + tabIdx;
      btn.setAttribute('title', 'Range ' + catIdx + '/' + tabIdx);
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
    var catIdx = parseInt(btn.getAttribute('data-cat-idx'), 10);
    var tabIdx = parseInt(btn.getAttribute('data-tab-idx'), 10);

    closeAllPopups();

    var popup = document.createElement('div');
    popup.className = 'range-ref-popup';
    popup.innerHTML =
      '<div class="range-ref-popup-header">' +
        '<span class="range-ref-popup-title">Range ' + catIdx + ' / ' + tabIdx + '</span>' +
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
      .then(function(data) { renderInPopup(popup, data, catIdx, tabIdx, btn); })
      .catch(function(err) {
        popup.querySelector('.range-ref-popup-body').innerHTML =
          '<p class="range-ref-error">Erreur : ' + esc(String(err)) + '</p>';
      });
  }

  function renderInPopup(popup, data, catIdx, tabIdx, btn) {
    var body = popup.querySelector('.range-ref-popup-body');
    var header = popup.querySelector('.range-ref-popup-title');

    // Récupère les catégories dans l'ordre d'affichage (via getRootCategories si dispo)
    var cats;
    if (typeof global.getRootCategories === 'function') {
      cats = global.getRootCategories(data);
    } else {
      // Fallback: ordre des children de root, ou Object.values si pas de root
      var root = data.categories && data.categories.root;
      if (root && root.children) {
        cats = root.children.map(function(id) { return data.categories[id]; }).filter(Boolean);
      } else {
        cats = Object.values(data.categories || {}).filter(function(c) { return c && c.name; });
      }
    }

    var cat = cats[catIdx - 1];
    if (!cat) {
      body.innerHTML = '<p class="range-ref-error">Catégorie ' + catIdx + ' introuvable (max ' + cats.length + ').</p>';
      return;
    }

    // Récupère les onglets dans l'ordre d'affichage (via getTabs si dispo)
    var tabs;
    if (typeof global.getTabs === 'function') {
      tabs = global.getTabs(cat);
    } else {
      var tabList = cat.tabList || Object.keys(cat.tabs || {});
      tabs = tabList.map(function(tid) { return (cat.tabs || {})[tid]; }).filter(Boolean);
    }

    var tab = tabs[tabIdx - 1];
    if (!tab) {
      body.innerHTML = '<p class="range-ref-error">Onglet ' + tabIdx + ' introuvable (max ' + tabs.length + ').</p>';
      return;
    }

    // Met à jour le titre du popup et le tooltip du bouton avec les vrais noms
    var catName = cat.name || ('Cat ' + catIdx);
    var tabName = tab.name || ('Tab ' + tabIdx);
    header.textContent = tabName + ' — ' + catName;
    btn.setAttribute('title', tabName + ' — ' + catName);

    if (typeof global.buildCellMap === 'function' && typeof global.renderRangeGrid === 'function') {
      var cellMap = global.buildCellMap(data, tab);
      body.innerHTML = '';
      var wrapper = document.createElement('div');
      wrapper.className = 'ranges-grid-wrapper';
      body.appendChild(wrapper);
      global.renderRangeGrid(cellMap, wrapper);
      if (typeof global.renderLegend === 'function') {
        global.renderLegend(data, tab, body);
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
