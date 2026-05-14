/**
 * review-ui.js — Interface de review de main.
 * Connecte le textarea + bouton → parsing → rendu HTML + Markdown.
 * Utilise cards-ui.js et hh-parser.js.
 */

(function(global) {
  'use strict';

  function initReview() {
    var parseBtn    = document.getElementById('parse-btn');
    var hhTextarea  = document.getElementById('hh-textarea');
    var videoInput  = document.getElementById('video-url');
    var outputDiv   = document.getElementById('review-output');
    var errorDiv    = document.getElementById('review-error');
    var copyBtn     = document.getElementById('copy-btn');
    var mdOutput    = document.getElementById('markdown-output');

    if (!parseBtn || !hhTextarea) return;

    parseBtn.addEventListener('click', function() {
      var text = hhTextarea.value.trim();
      if (!text) {
        showError(errorDiv, 'Veuillez coller une hand history.');
        return;
      }
      hideError(errorDiv);

      var parsed = null;
      try {
        parsed = global.parsePT4HandHistory(text);
      } catch(e) {
        showError(errorDiv, 'Erreur de parsing : ' + e.message);
        return;
      }

      if (!parsed) {
        showError(errorDiv, 'Impossible de parser cette hand history. Vérifiez le format PokerTracker 4.');
        return;
      }

      var videoUrl = videoInput ? videoInput.value.trim() : '';

      renderOutput(parsed, videoUrl);
      outputDiv.hidden = false;
    });

    if (copyBtn && mdOutput) {
      copyBtn.addEventListener('click', function() {
        mdOutput.select();
        try {
          document.execCommand('copy');
          copyBtn.textContent = 'Copié !';
          setTimeout(function() { copyBtn.textContent = 'Copier'; }, 2000);
        } catch(e) {
          copyBtn.textContent = 'Erreur';
        }
      });
    }
  }

  function renderOutput(p, videoUrl) {
    renderSummary(p);
    renderHand(p);
    renderStats(p);
    renderMarkdown(p, videoUrl);
  }

  function renderSummary(p) {
    var el = document.getElementById('summary-content');
    if (!el) return;
    var parts = [];
    if (p.room)   parts.push('<strong>Room :</strong> ' + escHtml(p.room));
    if (p.stake)  parts.push('<strong>Stake :</strong> ' + escHtml(p.stake));
    if (p.format) parts.push('<strong>Format :</strong> ' + escHtml(p.format));
    if (p.hero_position) parts.push('<strong>Hero :</strong> ' + escHtml(p.hero_position));
    if (p.hero_hand) parts.push('<strong>Main :</strong> ' + escHtml(p.hero_hand));
    var heroPlayer = p.players[p.hero_position];
    if (heroPlayer) parts.push('<strong>Stack :</strong> ' + heroPlayer.stack_bb + ' BB');
    el.innerHTML = '<p>' + parts.join(' &nbsp;|&nbsp; ') + '</p>';
  }

  function renderHand(p) {
    var heroEl = document.getElementById('hand-hero');
    var actionsEl = document.getElementById('hand-actions');
    if (!heroEl || !actionsEl) return;

    var html = '';
    // Hero hand
    if (p.hero_hand) {
      var codes = p.hero_hand.split(/\s+/);
      var cardsHtml = (typeof global.renderCards === 'function')
        ? global.renderCards(codes)
        : escHtml(p.hero_hand);
      html += '<div class="hand-hero-line">'
        + '<span class="hand-hero-label">Hero ' + escHtml(p.hero_position || '') + '</span>'
        + cardsHtml
        + '<span style="margin-left:0.5rem;color:var(--muted);font-size:0.88rem;">' + escHtml(p.hero_hand) + '</span>'
        + '</div>';
    }
    // Flop
    if (p.flop) {
      var boardCodes = p.flop.trim().split(/\s+/);
      var boardHtml = (typeof global.renderCards === 'function')
        ? global.renderCards(boardCodes)
        : escHtml(p.flop);
      html += '<div class="hand-hero-line">'
        + '<span class="hand-hero-label">Flop</span>'
        + boardHtml
        + '<span style="margin-left:0.5rem;color:var(--muted);font-size:0.88rem;">' + escHtml(p.flop) + '</span>'
        + '</div>';
    }
    heroEl.innerHTML = html;

    // Actions
    var actHtml = '<div class="action-list">';
    actHtml += '<div class="action-item street-header">Préflop' + (p.pot_preflop ? ' — pot ' + p.pot_preflop + ' BB' : '') + '</div>';
    p.preflop.forEach(function(a) {
      if (a.player !== 'unknown') {
        actHtml += '<div class="action-item">' + escHtml(a.player) + ' <strong>' + escHtml(a.action) + '</strong></div>';
      }
    });
    if (p.flop) {
      actHtml += '<div class="action-item street-header">Flop ' + escHtml(p.flop) + (p.pot_flop ? ' — pot ' + p.pot_flop + ' BB' : '') + '</div>';
      p.flop_actions.forEach(function(a) {
        if (a.player !== 'unknown') {
          actHtml += '<div class="action-item">' + escHtml(a.player) + ' <strong>' + escHtml(a.action) + '</strong></div>';
        }
      });
    }
    if (p.turn) {
      actHtml += '<div class="action-item street-header">Turn ' + escHtml(p.turn) + (p.pot_turn ? ' — pot ' + p.pot_turn + ' BB' : '') + '</div>';
      p.turn_actions.forEach(function(a) {
        if (a.player !== 'unknown') {
          actHtml += '<div class="action-item">' + escHtml(a.player) + ' <strong>' + escHtml(a.action) + '</strong></div>';
        }
      });
    }
    if (p.river) {
      actHtml += '<div class="action-item street-header">River ' + escHtml(p.river) + (p.pot_river ? ' — pot ' + p.pot_river + ' BB' : '') + '</div>';
      p.river_actions.forEach(function(a) {
        if (a.player !== 'unknown') {
          actHtml += '<div class="action-item">' + escHtml(a.player) + ' <strong>' + escHtml(a.action) + '</strong></div>';
        }
      });
    }
    if (p.winner) {
      actHtml += '<div class="action-item street-header">Résultat</div>';
      actHtml += '<div class="action-item">' + escHtml(p.winner) + ' gagne <strong>' + p.amount_won + ' BB</strong></div>';
    }
    actHtml += '</div>';
    actionsEl.innerHTML = actHtml;
  }

  function renderStats(p) {
    var el = document.getElementById('stats-content');
    if (!el) return;
    var rows = Object.values(p.players).filter(function(pl) {
      return pl.name !== 'Hero' && Object.keys(pl.stats).length > 0;
    });
    if (!rows.length) { el.innerHTML = '<p style="color:var(--muted)">Aucune stat HUD détectée.</p>'; return; }
    var html = '<table class="stats-table"><thead><tr><th>Joueur</th><th>VPIP</th><th>PFR</th><th>3Bet PF</th><th>Mains</th></tr></thead><tbody>';
    rows.forEach(function(pl) {
      html += '<tr>'
        + '<td>' + escHtml(pl.position) + '</td>'
        + '<td>' + fmtStat(pl.stats['VPIP']) + '</td>'
        + '<td>' + fmtStat(pl.stats['PFR']) + '</td>'
        + '<td>' + fmtStat(pl.stats['3Bet Preflop']) + '</td>'
        + '<td>' + fmtStat(pl.stats['Hands']) + '</td>'
        + '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  function fmtStat(v) {
    if (v === undefined || v === null) return '—';
    if (typeof v === 'number') return v.toFixed(2) + (v < 50 ? '%' : '');
    return String(v);
  }

  function renderMarkdown(p, videoUrl) {
    var el = document.getElementById('markdown-output');
    if (!el) return;
    el.value = generateMarkdown(p, videoUrl);
  }

  function generateMarkdown(p, videoUrl) {
    var today = new Date().toISOString().split('T')[0];
    var heroPos = p.hero_position || 'XX';
    var heroHand = p.hero_hand || '??';
    var board = p.flop || '';

    // Détection positions adversaires principaux
    var positions = [heroPos];
    p.preflop.forEach(function(a) {
      if (a.player && a.player !== 'Hero' && a.player !== 'unknown' && positions.indexOf(a.player.toUpperCase()) === -1) {
        positions.push(a.player.toUpperCase());
      }
    });

    // Actions détectées
    var actions = [];
    p.preflop.forEach(function(a) {
      var act = a.action.toLowerCase();
      if (/raise/.test(act)) {
        if (actions.indexOf('open') === -1) actions.push('open');
        if (/raises/.test(act) && actions.indexOf('open') !== -1) {
          if (actions.indexOf('3bet') === -1) actions.push('3bet');
        }
      }
    });

    // Calcul stack effectif
    var heroPlayer = p.players[heroPos];
    var heroStack = heroPlayer ? heroPlayer.stack_bb : null;

    var md = '---\n';
    md += 'title: "' + escMd(heroHand) + ' ' + heroPos + ' — à compléter"\n';
    md += 'date: ' + today + '\n';
    md += 'draft: false\n';
    md += 'description: "Review ' + escMd(p.stake || 'NL') + ' ' + escMd(p.format || '') + ' : Hero ' + heroPos + ' avec ' + escMd(heroHand) + '."\n';
    md += 'tags:\n  - holdem\n  - no-limit\n  - cash-game\n';
    if (p.format) md += '  - ' + p.format.toLowerCase().replace(/\s+/g,'-') + '\n';
    if (p.room) md += '  - ' + p.room.toLowerCase().replace(/\s+/g,'-') + '\n';
    md += '  - hand-history\n  - review\n';
    md += 'limits:\n';
    if (p.stake) md += '  - ' + escMd(p.stake) + '\n';
    md += 'rooms:\n';
    if (p.room) md += '  - ' + escMd(p.room) + '\n';
    md += 'positions:\n';
    positions.forEach(function(pos) { md += '  - ' + pos + '\n'; });
    md += 'actions:\n';
    actions.forEach(function(a) { md += '  - ' + a + '\n'; });
    md += 'streets:\n  - preflop\n';
    if (p.flop) md += '  - flop\n';
    if (p.turn) md += '  - turn\n';
    if (p.river) md += '  - river\n';
    md += 'formats:\n';
    if (p.format) md += '  - ' + escMd(p.format) + '\n';
    md += 'params:\n';
    md += '  hero_position: "' + heroPos + '"\n';
    md += '  villain_position: "à compléter"\n';
    md += '  hero_hand: "' + escMd(heroHand) + '"\n';
    md += '  board: "' + escMd(board) + '"\n';
    md += '  pot_type: "à compléter"\n';
    if (heroStack) md += '  effective_stack_bb: ' + heroStack + '\n';
    if (p.amount_won) md += '  result_bb: ' + p.amount_won + '\n';
    md += '  video_url: "' + escMd(videoUrl || '') + '"\n';
    md += '  source: "PT4 hand history"\n';
    md += '---\n\n';

    md += '# Résumé\n\n';
    if (p.hero_hand) md += 'Hero ' + heroPos + ' avec ' + heroHand + '.';
    if (heroStack) md += ' ' + heroStack + ' BB deep.';
    md += '\n\n';

    md += '# Main\n\n';
    md += '## Contexte\n\n';
    if (p.room)   md += '- Room : ' + p.room + '\n';
    if (p.stake)  md += '- Stake : ' + p.stake + '\n';
    if (p.format) md += '- Format : ' + p.format + '\n';
    md += '\n## Profils détectés\n\n';
    var statsRows = Object.values(p.players).filter(function(pl) { return pl.name !== 'Hero' && Object.keys(pl.stats).length > 0; });
    if (statsRows.length) {
      md += '| Joueur | VPIP | PFR | 3Bet PF | Mains |\n';
      md += '|--------|------|-----|---------|-------|\n';
      statsRows.forEach(function(pl) {
        md += '| ' + pl.position + ' | ' + fmtStatMd(pl.stats['VPIP']) + ' | ' + fmtStatMd(pl.stats['PFR']) + ' | ' + fmtStatMd(pl.stats['3Bet Preflop']) + ' | ' + fmtStatMd(pl.stats['Hands']) + ' |\n';
      });
      md += '\n';
    } else {
      md += 'Aucune stat HUD disponible.\n\n';
    }

    md += '## Préflop\n\n';
    p.preflop.forEach(function(a) {
      if (a.player !== 'unknown') md += '- **' + a.player + '** ' + a.action + '\n';
    });
    if (p.pot_preflop) md += '\nPot : ' + p.pot_preflop + ' BB\n';
    md += '\n';

    if (p.flop) {
      md += '## Flop\n\nBoard : **' + p.flop + '**\n\n';
      p.flop_actions.forEach(function(a) {
        if (a.player !== 'unknown') md += '- **' + a.player + '** ' + a.action + '\n';
      });
      if (p.pot_flop) md += '\nPot : ' + p.pot_flop + ' BB\n';
      md += '\n';
    }

    if (p.turn) {
      md += '## Turn\n\nBoard : **' + p.flop + ' ' + p.turn + '**\n\n';
      p.turn_actions.forEach(function(a) {
        if (a.player !== 'unknown') md += '- **' + a.player + '** ' + a.action + '\n';
      });
      md += '\n';
    }

    if (p.river) {
      md += '## River\n\nBoard : **' + p.flop + ' ' + (p.turn || '') + ' ' + p.river + '**\n\n';
      p.river_actions.forEach(function(a) {
        if (a.player !== 'unknown') md += '- **' + a.player + '** ' + a.action + '\n';
      });
      md += '\n';
    }

    md += '## Résultat\n\n';
    if (p.winner && p.amount_won) md += p.winner + ' gagne **' + p.amount_won + ' BB**\n\n';
    else md += 'À compléter.\n\n';

    md += '# Analyse stratégique\n\n';
    md += '## Décision préflop\n\nÀ compléter.\n\n';
    md += '## Décision flop\n\nÀ compléter.\n\n';
    md += '## Notes exploitantes\n\nÀ compléter.\n\n';
    md += '## Erreurs potentielles\n\nÀ compléter.\n\n';
    md += '## Conclusion\n\nÀ compléter.\n';

    return md;
  }

  function fmtStatMd(v) {
    if (v === undefined || v === null) return '—';
    if (typeof v === 'number') return v.toFixed(2) + '%';
    return String(v);
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function escMd(s) {
    return String(s).replace(/"/g, '\\"');
  }

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function hideError(el) {
    if (!el) return;
    el.hidden = true;
  }

  global.initReview = initReview;

})(typeof window !== 'undefined' ? window : this);
