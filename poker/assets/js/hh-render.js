/**
 * hh-render.js — Rendu visuel des blocs hand history dans les articles.
 * Cherche tous les <code class="language-hh"> et les remplace par
 * un affichage structuré (résumé, cartes, actions, stats HUD).
 * Utilise hh-parser.js et cards-ui.js.
 */

(function(global) {
  'use strict';

  function renderHandHistories() {
    var blocks = document.querySelectorAll('code.language-hh');
    blocks.forEach(function(code) {
      var text = code.textContent || '';
      var parsed = null;
      try { parsed = global.parsePT4HandHistory(text); } catch(e) {}
      if (!parsed) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'hh-block';
      wrapper.innerHTML = buildHHHtml(parsed);

      var pre = code.parentNode; // <pre> englobant
      if (pre && pre.tagName === 'PRE') {
        pre.parentNode.replaceChild(wrapper, pre);
      } else {
        code.parentNode.replaceChild(wrapper, code);
      }
    });
  }

  function buildHHHtml(p) {
    var html = '';

    // ── En-tête ──────────────────────────────────────────────────
    html += '<div class="hh-header">';
    if (p.room)   html += '<span class="hh-badge">' + esc(p.room) + '</span>';
    if (p.stake)  html += '<span class="hh-badge">' + esc(p.stake) + '</span>';
    if (p.format) html += '<span class="hh-badge">' + esc(p.format) + '</span>';
    if (p.hero_position) html += '<span class="hh-badge hh-badge--hero">Hero : ' + esc(p.hero_position) + '</span>';
    html += '</div>';

    // ── Cartes Hero ───────────────────────────────────────────────
    if (p.hero_hand) {
      var codes = p.hero_hand.trim().split(/\s+/);
      var cardsHtml = typeof global.renderCards === 'function'
        ? global.renderCards(codes)
        : '<span>' + esc(p.hero_hand) + '</span>';
      html += '<div class="hh-hero-hand">'
        + '<span class="hh-street-label">Main Hero</span>'
        + cardsHtml
        + '<span class="hh-hand-text">' + esc(p.hero_hand) + '</span>'
        + '</div>';
    }

    // ── Actions par street ────────────────────────────────────────
    html += '<div class="hh-streets">';

    html += buildStreet('Préflop', p.preflop, null, p.pot_preflop);

    if (p.flop) {
      var flopCodes = p.flop.trim().split(/\s+/);
      var flopCards = typeof global.renderCards === 'function'
        ? global.renderCards(flopCodes) : '<span>' + esc(p.flop) + '</span>';
      html += buildStreet('Flop', p.flop_actions, flopCards, p.pot_flop);
    }
    if (p.turn) {
      var turnCodes = p.turn.trim().split(/\s+/);
      var turnCards = typeof global.renderCards === 'function'
        ? global.renderCards(turnCodes) : '<span>' + esc(p.turn) + '</span>';
      html += buildStreet('Turn', p.turn_actions, turnCards, p.pot_turn);
    }
    if (p.river) {
      var riverCodes = p.river.trim().split(/\s+/);
      var riverCards = typeof global.renderCards === 'function'
        ? global.renderCards(riverCodes) : '<span>' + esc(p.river) + '</span>';
      html += buildStreet('River', p.river_actions, riverCards, p.pot_river);
    }

    html += '</div>'; // hh-streets

    // ── Résultat ──────────────────────────────────────────────────
    if (p.winner) {
      html += '<div class="hh-result">'
        + '<span class="hh-street-label">Résultat</span>'
        + '<strong>' + esc(p.winner) + '</strong> gagne <strong>' + p.amount_won + ' BB</strong>'
        + '</div>';
    }

    // ── Stats HUD ─────────────────────────────────────────────────
    var statsRows = Object.values(p.players).filter(function(pl) {
      return pl.name !== 'Hero' && Object.keys(pl.stats).length > 0;
    });
    if (statsRows.length) {
      html += '<details class="hh-stats">'
        + '<summary class="hh-stats-toggle">Stats HUD adverses</summary>'
        + '<table class="stats-table"><thead><tr>'
        + '<th>Joueur</th><th>VPIP</th><th>PFR</th><th>3Bet PF</th><th>Mains</th>'
        + '</tr></thead><tbody>';
      statsRows.forEach(function(pl) {
        html += '<tr>'
          + '<td>' + esc(pl.position) + '</td>'
          + '<td>' + fmt(pl.stats['VPIP']) + '</td>'
          + '<td>' + fmt(pl.stats['PFR']) + '</td>'
          + '<td>' + fmt(pl.stats['3Bet Preflop']) + '</td>'
          + '<td>' + fmt(pl.stats['Hands']) + '</td>'
          + '</tr>';
      });
      html += '</tbody></table></details>';
    }

    return html;
  }

  function buildStreet(label, actions, boardHtml, pot) {
    var html = '<div class="hh-street">';
    html += '<div class="hh-street-header">';
    html += '<span class="hh-street-label">' + label + '</span>';
    if (boardHtml) html += '<span class="hh-street-board">' + boardHtml + '</span>';
    if (pot) html += '<span class="hh-street-pot">Pot : ' + pot + ' BB</span>';
    html += '</div>';

    var meaningful = (actions || []).filter(function(a) { return a.player !== 'unknown'; });
    if (meaningful.length) {
      html += '<ul class="hh-actions">';
      meaningful.forEach(function(a) {
        var isHero = /^hero$/i.test(a.player);
        html += '<li class="hh-action' + (isHero ? ' hh-action--hero' : '') + '">'
          + '<span class="hh-action-player">' + esc(a.player) + '</span>'
          + '<span class="hh-action-verb">' + esc(a.action) + '</span>'
          + '</li>';
      });
      html += '</ul>';
    }
    html += '</div>';
    return html;
  }

  function fmt(v) {
    if (v === undefined || v === null) return '—';
    if (typeof v === 'number') return v.toFixed(1) + '%';
    return String(v);
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  global.renderHandHistories = renderHandHistories;

})(typeof window !== 'undefined' ? window : this);
