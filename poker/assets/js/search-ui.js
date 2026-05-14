/**
 * search-ui.js — Recherche locale côté navigateur.
 * Charge /search-index.json (pages/reviews/taxonomies) et le fichier .rm (ranges).
 * Aucune donnée envoyée au serveur.
 */

(function(global) {
  'use strict';

  var SEARCH_INDEX_URL = '/search-index.json';
  var RM_FILE_URL      = '/data/ranges/Ranges_NL2_edited_by_chatGPT_v2.rm';
  var MAX_RESULTS      = 12;

  var _index = [];
  var _loaded = false;

  function initSearch() {
    var input   = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    if (!input || !results) return;

    // Chargement asynchrone de l'index
    loadIndex();

    input.addEventListener('input', function() {
      var q = input.value.trim();
      if (q.length < 2) { results.hidden = true; return; }
      var found = search(q);
      renderResults(results, found, q);
      results.hidden = false;
    });

    input.addEventListener('blur', function() {
      setTimeout(function() { results.hidden = true; }, 200);
    });

    input.addEventListener('focus', function() {
      var q = input.value.trim();
      if (q.length >= 2 && results.children.length) results.hidden = false;
    });

    // Navigation clavier dans les résultats
    input.addEventListener('keydown', function(e) {
      if (results.hidden) return;
      var items = results.querySelectorAll('.search-result-item');
      if (!items.length) return;
      var focused = results.querySelector('.search-result-item:focus');
      var idx = Array.prototype.indexOf.call(items, focused);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = idx < items.length - 1 ? idx + 1 : 0;
        items[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = idx > 0 ? idx - 1 : items.length - 1;
        items[prev].focus();
      } else if (e.key === 'Escape') {
        results.hidden = true;
        input.focus();
      }
    });
  }

  function loadIndex() {
    // Charge search-index.json
    fetch(SEARCH_INDEX_URL)
      .then(function(r) { return r.ok ? r.json() : []; })
      .catch(function() { return []; })
      .then(function(pages) {
        _index = _index.concat(pages);
        // Charge le fichier .rm pour indexer les ranges
        return fetch(RM_FILE_URL)
          .then(function(r) { return r.ok ? r.json() : null; })
          .catch(function() { return null; });
      })
      .then(function(rm) {
        if (rm) _index = _index.concat(buildRangeIndex(rm));
        _loaded = true;
      });
  }

  /** Construit l'index des ranges depuis le fichier .rm. */
  function buildRangeIndex(data) {
    var entries = [];
    var root = data.categories && data.categories.root;
    if (!root || !Array.isArray(root.children)) return entries;

    root.children.forEach(function(catId) {
      var cat = data.categories[catId];
      if (!cat) return;
      var catName = cat.name || catId;

      // Entrée catégorie
      entries.push({
        title: catName,
        type: 'range-category',
        url: '/ranges/#category=' + encodeURIComponent(catName),
        description: 'Catégorie range : ' + catName,
        tags: ['range', catName]
      });

      // Entrées onglets
      (cat.tabList || []).forEach(function(tabId) {
        var tab = cat.tabs && cat.tabs[tabId];
        if (!tab) return;
        var tabName = tab.name || tabId;
        entries.push({
          title: catName + ' — ' + tabName,
          type: 'range',
          url: '/ranges/#category=' + encodeURIComponent(catName) + '&tab=' + encodeURIComponent(tabName),
          description: 'Catégorie ' + catName + ', onglet ' + tabName,
          tags: ['range', tabName, catName]
        });
      });
    });

    return entries;
  }

  /** Recherche insensible à la casse, partielle. */
  function search(q) {
    var ql = q.toLowerCase();
    return _index.filter(function(item) {
      var text = [item.title, item.description, item.type]
        .concat(item.tags || [])
        .join(' ')
        .toLowerCase();
      return text.indexOf(ql) !== -1;
    }).slice(0, MAX_RESULTS);
  }

  var TYPE_LABELS = {
    'page':            'Page',
    'review':          'Review',
    'range':           'Range',
    'range-category':  'Range',
    'position':        'Position',
    'action':          'Action',
    'limit':           'Limite',
    'room':            'Room',
    'tag':             'Tag'
  };

  function renderResults(container, items, q) {
    container.innerHTML = '';
    if (!items.length) {
      var noRes = document.createElement('div');
      noRes.className = 'search-no-results';
      noRes.textContent = 'Aucun résultat pour "' + q + '".';
      container.appendChild(noRes);
      return;
    }

    // Grouper par type
    var groups = {};
    items.forEach(function(item) {
      var t = item.type || 'page';
      if (!groups[t]) groups[t] = [];
      groups[t].push(item);
    });

    Object.keys(groups).forEach(function(type) {
      var label = document.createElement('div');
      label.className = 'search-group-label';
      label.textContent = TYPE_LABELS[type] || type;
      container.appendChild(label);

      groups[type].forEach(function(item) {
        var a = document.createElement('a');
        a.className = 'search-result-item';
        a.href = item.url || '#';
        a.setAttribute('role', 'option');
        a.tabIndex = 0;
        a.innerHTML = '<div class="search-result-title">' + escHtml(item.title) + '</div>'
          + (item.description ? '<div class="search-result-desc">' + escHtml(item.description) + '</div>' : '');
        container.appendChild(a);
      });
    });
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  global.initSearch = initSearch;

})(typeof window !== 'undefined' ? window : this);
