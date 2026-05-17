/**
 * ranges-ui.js — Affichage des ranges depuis un fichier .rm (JSON Range Manager).
 * Chargement côté navigateur. Aucune modification des données source.
 */

(function(global) {
  'use strict';

  var RM_FILE_URL = '/data/ranges/Ranges_NL2_v3.rm';

  var RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

  // État courant
  var _data = null;
  var _currentCatId = null;
  var _currentTabId = null;

  /** Point d'entrée principal. */
  function initRanges() {
    loadRangeManagerFile(RM_FILE_URL).then(function(data) {
      _data = data;
      var loadingEl = document.getElementById('ranges-loading');
      if (loadingEl) loadingEl.hidden = true;

      var categories = getRootCategories(data);
      if (!categories.length) {
        showRangesError('Aucune catégorie trouvée dans le fichier .rm.');
        return;
      }

      renderCategories(categories);
      var layout = document.getElementById('ranges-layout');
      if (layout) layout.hidden = false;
      // Sélectionner la première catégorie par défaut
      selectCategory(categories[0].id);
    }).catch(function(err) {
      var loadingEl = document.getElementById('ranges-loading');
      if (loadingEl) loadingEl.hidden = true;
      showRangesError('Impossible de charger le fichier .rm : ' + err.message);
    });
  }

  /** Charge et valide le fichier .rm. */
  function loadRangeManagerFile(url) {
    return fetch(url).then(function(resp) {
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' pour ' + url);
      return resp.json();
    }).then(function(data) {
      if (!data.categories) throw new Error('Champ "categories" manquant dans le fichier .rm');
      if (!data.ranges)     throw new Error('Champ "ranges" manquant dans le fichier .rm');
      return data;
    });
  }

  /** Retourne les catégories racines dans l'ordre de root.children. */
  function getRootCategories(data) {
    var root = data.categories && data.categories.root;
    if (!root || !Array.isArray(root.children)) return [];
    return root.children.reduce(function(acc, id) {
      var cat = data.categories[id];
      if (!cat) {
        console.warn('[ranges-ui] Catégorie introuvable :', id);
        return acc;
      }
      acc.push({ id: id, name: cat.name, data: cat });
      return acc;
    }, []);
  }

  /** Retourne les onglets d'une catégorie dans l'ordre de tabList. */
  function getTabs(category) {
    if (!category.tabList || !category.tabs) return [];
    return category.tabList.reduce(function(acc, id) {
      var tab = category.tabs[id];
      if (!tab) {
        console.warn('[ranges-ui] Onglet introuvable :', id);
        return acc;
      }
      acc.push({ id: id, name: tab.name, data: tab });
      return acc;
    }, []);
  }

  /**
   * parseHandEntry("98s:0.5000") → { hand: "98s", frequency: 0.5 }
   * parseHandEntry("AKs")        → { hand: "AKs", frequency: 1.0 }
   */
  function parseHandEntry(entry) {
    if (typeof entry !== 'string') return null;
    var parts = entry.split(':');
    var hand = parts[0].trim();
    var frequency = 1.0;
    if (parts.length > 1) {
      var f = parseFloat(parts[1]);
      if (!isNaN(f) && f >= 0 && f <= 1) {
        frequency = f;
      } else {
        console.warn('[ranges-ui] Fréquence invalide pour', entry, '— utilisation de 1.0');
      }
    }
    return { hand: hand, frequency: frequency };
  }

  /**
   * buildCellMap(data, tab) → map hand → [{actionId, actionName, color, frequency}]
   * Préserve strictement toutes les données existantes.
   */
  function buildCellMap(data, tab) {
    var cellMap = {};
    if (!tab.rangeList) return cellMap;

    tab.rangeList.forEach(function(rangeEntry) {
      var actionId = rangeEntry.id;
      var rangeInfo = data.ranges[actionId];
      var actionName, color;

      if (rangeInfo) {
        actionName = rangeInfo.name || actionId;
        color      = rangeInfo.color || '#3a4354';
      } else {
        console.warn('[ranges-ui] Action inconnue :', actionId);
        actionName = actionId;
        color      = '#3a4354';
      }

      (rangeEntry.hands || []).forEach(function(entry) {
        var parsed = parseHandEntry(entry);
        if (!parsed) return;
        var hand = parsed.hand;
        if (!cellMap[hand]) cellMap[hand] = [];
        cellMap[hand].push({
          actionId:   actionId,
          actionName: actionName,
          color:      color,
          frequency:  parsed.frequency
        });
      });
    });

    return cellMap;
  }

  /**
   * handAt(row, col) → notation standard poker.
   * row/col sont des indices dans RANKS (0=A, 12=2).
   */
  function handAt(row, col) {
    if (row === col) return RANKS[row] + RANKS[col];
    if (row < col)  return RANKS[row] + RANKS[col] + 's';
    return RANKS[col] + RANKS[row] + 'o';
  }

  /** Rend la grille 13x13 et l'injecte dans le conteneur (ou #ranges-grid par défaut). */
  function renderRangeGrid(cellMap, container) {
    if (!container) container = document.getElementById('ranges-grid');
    if (!container) return;

    var table = document.createElement('table');
    table.className = 'range-grid';

    // Header row
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var emptyTh = document.createElement('th');
    headerRow.appendChild(emptyTh);
    RANKS.forEach(function(r) {
      var th = document.createElement('th');
      th.textContent = r;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    var tbody = document.createElement('tbody');
    RANKS.forEach(function(rowRank, ri) {
      var tr = document.createElement('tr');
      // Row header
      var rowTh = document.createElement('th');
      rowTh.textContent = rowRank;
      tr.appendChild(rowTh);

      RANKS.forEach(function(colRank, ci) {
        var hand = handAt(ri, ci);
        var td = document.createElement('td');
        var actions = cellMap[hand] || [];
        var isPair = (ri === ci);
        if (isPair) td.classList.add('cell-pair');

        if (!actions.length) {
          td.classList.add('cell-empty');
          td.textContent = hand;
          td.style.color = '#2a3a30';
        } else {
          // Couleur de fond : gradient si mixte
          var bgStyle = buildBackground(actions);
          td.style.background = bgStyle;
          td.style.color = getTextColor(actions);

          // Label + fréquence si mixte
          var labelSpan = document.createElement('span');
          labelSpan.className = 'cell-label';
          labelSpan.textContent = hand;
          td.appendChild(labelSpan);

          // Si la main est mixte, afficher un indicateur
          if (actions.length > 1 || (actions.length === 1 && actions[0].frequency < 1.0)) {
            var freqSpan = document.createElement('span');
            freqSpan.className = 'cell-freq';
            freqSpan.textContent = '~';
            td.appendChild(freqSpan);
          }

          // Tooltip
          td.title = buildTooltip(hand, actions);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
  }

  /** Construit le background CSS (couleur unique ou gradient). */
  function buildBackground(actions) {
    if (!actions.length) return 'var(--cell-empty, #0a1510)';
    if (actions.length === 1 && actions[0].frequency >= 0.99) {
      return hexToRgba(actions[0].color, 0.82);
    }
    // Gradient linéaire proportionnel aux fréquences
    var stops = [];
    var pct = 0;
    // Normalise les fréquences
    var total = actions.reduce(function(s, a) { return s + a.frequency; }, 0);
    if (total <= 0) total = 1;
    actions.forEach(function(a) {
      var share = (a.frequency / total) * 100;
      stops.push(hexToRgba(a.color, 0.82) + ' ' + pct.toFixed(1) + '%');
      pct += share;
      stops.push(hexToRgba(a.color, 0.82) + ' ' + pct.toFixed(1) + '%');
    });
    return 'linear-gradient(135deg, ' + stops.join(', ') + ')';
  }

  function getTextColor(actions) {
    // Couleur de texte lisible sur fond coloré
    return '#fff';
  }

  function buildTooltip(hand, actions) {
    return hand + ' — ' + actions.map(function(a) {
      var pct = Math.round(a.frequency * 100);
      return a.actionName + ' ' + pct + '%';
    }).join(' / ');
  }

  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  /** Rend la légende des actions actives dans l'onglet courant. */
  function renderLegend(data, tab, container) {
    if (!container) container = document.getElementById('ranges-legend');
    if (!container) return;

    var seen = {};
    (tab.rangeList || []).forEach(function(re) {
      var info = data.ranges[re.id];
      if (info && !seen[re.id]) {
        seen[re.id] = info;
      }
    });

    container.innerHTML = '';
    Object.keys(seen).forEach(function(id) {
      var info = seen[id];
      var item = document.createElement('div');
      item.className = 'legend-item';
      var swatch = document.createElement('span');
      swatch.className = 'legend-swatch';
      swatch.style.background = info.color;
      var label = document.createElement('span');
      label.textContent = info.name;
      item.appendChild(swatch);
      item.appendChild(label);
      container.appendChild(item);
    });
  }

  /** Retourne le nombre d'onglets d'une catégorie. */
  function getTabCount(cat) {
    if (!cat.tabList) return 0;
    return cat.tabList.length;
  }

  /** Affiche les boutons de catégories avec badges et icônes. */
  function renderCategories(categories) {
    var container = document.getElementById('ranges-categories');
    if (!container) return;
    container.innerHTML = '';

    var header = document.createElement('div');
    header.className = 'ranges-sidebar-title';
    header.textContent = 'Catégories';
    container.appendChild(header);

    categories.forEach(function(cat) {
      var btn = document.createElement('button');
      btn.className = 'range-cat-btn';
      btn.dataset.catId = cat.id;

      var nameSpan = document.createElement('span');
      nameSpan.className = 'range-cat-name';
      nameSpan.textContent = cat.name;

      var count = getTabCount(cat.data);
      if (count > 0) {
        var badge = document.createElement('span');
        badge.className = 'range-cat-badge';
        badge.textContent = count;
        btn.appendChild(nameSpan);
        btn.appendChild(badge);
      } else {
        btn.appendChild(nameSpan);
      }

      btn.addEventListener('click', function() { selectCategory(cat.id); });
      container.appendChild(btn);
    });
  }

  /** Active une catégorie. */
  function selectCategory(catId) {
    _currentCatId = catId;
    // Mise à jour boutons
    document.querySelectorAll('.range-cat-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.catId === catId);
    });

    var cat = _data.categories[catId];
    if (!cat) return;

    var tabs = getTabs(cat);
    renderTabButtons(tabs);
    if (tabs.length) selectTab(catId, tabs[0].id);
  }

  /** Affiche les boutons d'onglets. */
  function renderTabButtons(tabs) {
    var container = document.getElementById('ranges-tabs');
    if (!container) return;
    container.innerHTML = '';
    tabs.forEach(function(tab) {
      var btn = document.createElement('button');
      btn.className = 'range-tab-btn';
      btn.textContent = tab.name;
      btn.dataset.tabId = tab.id;
      btn.addEventListener('click', function() { selectTab(_currentCatId, tab.id); });
      container.appendChild(btn);
    });
  }

  /** Active un onglet. */
  function selectTab(catId, tabId) {
    _currentTabId = tabId;
    document.querySelectorAll('.range-tab-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.tabId === tabId);
    });

    var cat = _data.categories[catId];
    if (!cat) return;
    var tab = cat.tabs[tabId];
    if (!tab) return;

    var cellMap = buildCellMap(_data, tab);
    renderRangeGrid(cellMap);
    renderLegend(_data, tab);

  }

  function showRangesError(msg) {
    var el = document.getElementById('ranges-error');
    if (el) { el.textContent = msg; el.hidden = false; }
  }

  // Exports
  global.RM_FILE_URL = RM_FILE_URL;
  global.initRanges = initRanges;
  global.loadRangeManagerFile = loadRangeManagerFile;
  global.getRootCategories = getRootCategories;
  global.getTabs = getTabs;
  global.parseHandEntry = parseHandEntry;
  global.buildCellMap = buildCellMap;
  global.renderRangeGrid = renderRangeGrid;
  global.renderLegend = renderLegend;

})(typeof window !== 'undefined' ? window : this);
