/**
 * hh-render.js — Rendu visuel des blocs hand history dans les articles.
 * Cherche tous les blocs <code class="language-hh"> ou <code data-lang="hh">
 * et les remplace par un affichage structuré.
 * Supporte les formats PT4 et PokerStars natif via hh-parser.js.
 */

(function(global) {
  'use strict';

  function renderHandHistories() {
    // Support both Goldmark (class="language-hh") and Chroma (data-lang="hh") output
    var blocks = document.querySelectorAll(
      'code.language-hh, code[data-lang="hh"], pre > code.language-hh, pre code[data-lang="hh"]'
    );

    // Hero name from data-hero attribute on the article element
    var heroEl = document.querySelector('[data-hero]');
    var heroName = (heroEl && heroEl.getAttribute('data-hero')) || null;

    blocks.forEach(function(code) {
      var text = code.textContent || '';
      var parsed = null;
      try {
        if (typeof global.parseHandHistory === 'function') {
          parsed = global.parseHandHistory(text, heroName);
        } else if (typeof global.parsePT4HandHistory === 'function') {
          parsed = global.parsePT4HandHistory(text);
        }
      } catch(e) {
        console.warn('[hh-render] Erreur parsing:', e);
      }
      if (!parsed) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'hh-block';
      wrapper.innerHTML = buildHHHtml(parsed, heroName);

      var pre = code.parentNode;
      if (pre && pre.tagName === 'PRE') {
        var preParent = pre.parentNode;
        // Handle Chroma wrapper div
        if (preParent && preParent.classList && preParent.classList.contains('highlight')) {
          preParent.parentNode.replaceChild(wrapper, preParent);
        } else {
          preParent.replaceChild(wrapper, pre);
        }
      } else {
        code.parentNode.replaceChild(wrapper, code);
      }
    });
  }

  function extractBB(stake) {
    if (!stake) return null;
    var m = stake.match(/[\/][€$£¥]?\s*([\d]+\.[\d]+)/);
    return m ? parseFloat(m[1]) : null;
  }

  function fmtBB(val, bb) {
    var inBB = Math.round((val / bb) * 10) / 10;
    return (inBB === Math.floor(inBB) ? inBB.toFixed(0) : inBB.toFixed(1)) + 'BB';
  }

  function convertActionToBB(str, bb) {
    if (!bb) return str;
    return str.replace(/\b(\d+\.\d+)\b/g, function(_, num) {
      return fmtBB(parseFloat(num), bb);
    });
  }

  function buildHHHtml(p, heroName) {
    var html = '';
    var bb = (p.room === 'PokerStars') ? extractBB(p.stake) : null;

    // ── En-tête ──────────────────────────────────────────────────
    html += '<div class="hh-header">';
    if (p.room)   html += '<span class="hh-badge">' + esc(p.room) + '</span>';
    if (p.stake)  html += '<span class="hh-badge">' + esc(p.stake) + '</span>';
    if (p.format) html += '<span class="hh-badge">' + esc(p.format) + '</span>';
    if (p.game)   html += '<span class="hh-badge">' + esc(p.game) + '</span>';
    if (p.hero_position && p.hero_position !== 'Hero') {
      html += '<span class="hh-badge hh-badge--hero">Hero : ' + esc(p.hero_position) + '</span>';
    } else if (heroName) {
      html += '<span class="hh-badge hh-badge--hero">Hero : ' + esc(heroName) + '</span>';
    }
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

    html += buildStreet('Préflop', p.preflop, null, p.pot_preflop, bb);

    if (p.flop) {
      var flopCodes = p.flop.trim().split(/\s+/);
      var flopCards = typeof global.renderCards === 'function'
        ? global.renderCards(flopCodes) : '<span>' + esc(p.flop) + '</span>';
      html += buildStreet('Flop', p.flop_actions, flopCards, p.pot_flop, bb);
    }
    if (p.turn) {
      var turnCodes = p.turn.trim().split(/\s+/);
      var turnCards = typeof global.renderCards === 'function'
        ? global.renderCards(turnCodes) : '<span>' + esc(p.turn) + '</span>';
      html += buildStreet('Turn', p.turn_actions, turnCards, p.pot_turn, bb);
    }
    if (p.river) {
      var riverCodes = p.river.trim().split(/\s+/);
      var riverCards = typeof global.renderCards === 'function'
        ? global.renderCards(riverCodes) : '<span>' + esc(p.river) + '</span>';
      html += buildStreet('River', p.river_actions, riverCards, p.pot_river, bb);
    }

    html += '</div>';

    // ── Résultat ──────────────────────────────────────────────────
    if (p.winner) {
      var winnerLabel = (heroName && p.winner.toLowerCase() === heroName.toLowerCase()) ? 'Hero' : p.winner;
      winnerLabel = p.winner === 'Hero' ? 'Hero' : winnerLabel;
      var wonDisplay = '';
      if (p.amount_won !== null && p.amount_won !== undefined) {
        wonDisplay = bb ? fmtBB(p.amount_won, bb) : (p.amount_won + ' BB');
      }
      html += '<div class="hh-result">'
        + '<span class="hh-street-label">Résultat</span>'
        + '<strong>' + esc(winnerLabel) + '</strong> gagne'
        + (wonDisplay ? ' <strong>' + wonDisplay + '</strong>' : '')
        + '</div>';
    }

    // ── Stats HUD ─────────────────────────────────────────────────
    var statsRows = Object.values(p.players).filter(function(pl) {
      return pl.name !== 'Hero' && pl.stats && Object.keys(pl.stats).length > 0;
    });
    if (statsRows.length) {
      html += '<details class="hh-stats">'
        + '<summary class="hh-stats-toggle">Stats HUD adverses</summary>'
        + '<table class="stats-table"><thead><tr>'
        + '<th>Joueur</th><th>VPIP</th><th>PFR</th><th>3Bet PF</th><th>Mains</th>'
        + '</tr></thead><tbody>';
      statsRows.forEach(function(pl) {
        html += '<tr>'
          + '<td>' + esc(pl.position || pl.name) + '</td>'
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

  function buildStreet(label, actions, boardHtml, pot, bb) {
    var html = '<div class="hh-street">';
    html += '<div class="hh-street-header">';
    html += '<span class="hh-street-label">' + label + '</span>';
    if (boardHtml) html += '<span class="hh-street-board">' + boardHtml + '</span>';
    if (pot) html += '<span class="hh-street-pot">Pot : ' + pot + ' BB</span>';
    html += '</div>';

    var meaningful = (actions || []).filter(function(a) {
      return a.player && a.player !== 'unknown';
    });
    if (meaningful.length) {
      html += '<ul class="hh-actions">';
      meaningful.forEach(function(a) {
        var isHero = /^hero$/i.test(a.player);
        html += '<li class="hh-action' + (isHero ? ' hh-action--hero' : '') + '">'
          + '<span class="hh-action-player">' + esc(a.player) + '</span>'
          + '<span class="hh-action-verb">' + esc(bb ? convertActionToBB(a.action, bb) : a.action) + '</span>'
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
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  global.renderHandHistories = renderHandHistories;

})(typeof window !== 'undefined' ? window : this);
