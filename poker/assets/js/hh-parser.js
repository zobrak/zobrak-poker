/**
 * hh-parser.js — Parser de hand histories.
 * Supporte le format PokerTracker 4 (PT4) et le format natif PokerStars.
 * Parsing côté navigateur. Aucune donnée envoyée au serveur.
 */

(function(global) {
  'use strict';

  /**
   * parseHandHistory(text, heroName) → objet structuré ou null si échec.
   * Auto-détecte le format (PT4 ou PokerStars natif).
   * @param {string} text       Texte brut de la main
   * @param {string} [heroName] Nom du héros (pour format natif PS)
   */
  function parseHandHistory(text, heroName) {
    if (!text || typeof text !== 'string') return null;
    var trimmed = text.trim();
    if (!trimmed) return null;

    // Détection format natif PS: commence par "PokerStars Hand #"
    if (/^PokerStars\s+Hand\s+#/i.test(trimmed)) {
      return parsePSNativeHandHistory(trimmed, heroName);
    }
    // Fallback: format PT4
    return parsePT4HandHistory(trimmed);
  }

  // ═══════════════════════════════════════════════════════════════════
  // Format natif PokerStars
  // ═══════════════════════════════════════════════════════════════════

  function parsePSNativeHandHistory(text, heroName) {
    var lines = text.split('\n').map(function(l) { return l.trimEnd(); });

    var result = {
      room: 'PokerStars',
      stake: null,
      game: null,
      format: null,
      players_count: 0,
      hero_position: null,
      hero_hand: null,
      players: {},
      blinds: [],
      preflop: [],
      flop: null,
      flop_actions: [],
      turn: null,
      turn_actions: [],
      river: null,
      river_actions: [],
      winner: null,
      amount_won: null,
      pot_preflop: null,
      pot_flop: null,
      pot_turn: null,
      pot_river: null,
      raw: text
    };

    // ── Header ────────────────────────────────────────────────────
    // "PokerStars Hand #260824466012:  Hold'em No Limit (€0.01/€0.02 EUR) - 2026/05/16..."
    var hdrMatch = lines[0].match(
      /PokerStars\s+Hand\s+#[\d]+:\s+(.+?)\s*\(([\S\/€$£¥]+\s+\w+)\)/i
    );
    if (hdrMatch) {
      result.game = hdrMatch[1].trim();
      result.stake = hdrMatch[2].trim();
    } else {
      var hdrFallback = lines[0].match(/\(([\S\/€$£¥]+\/[\S\/€$£¥]+)/);
      if (hdrFallback) result.stake = hdrFallback[1].replace('(', '').trim();
    }

    // ── Table info ────────────────────────────────────────────────
    // "Table 'Alemannia VII' 6-max Seat #3 is the button"
    var tableMatch = lines[1] && lines[1].match(/Table\s+'([^']+)'\s+(\S+)/i);
    if (tableMatch) {
      result.format = tableMatch[2]; // "6-max"
    }

    // ── Seats → player names + stacks ────────────────────────────
    // "Seat 1: BaboonPeedas (€2.09 in chips)"
    var seatMap = {}; // seatNum → playerName
    lines.forEach(function(line) {
      var m = line.match(/^Seat\s+(\d+)\s*:\s*(.+?)\s+\(([€$£¥]?[\d,]+\.?\d*)\s+in chips\)/i);
      if (!m) return;
      var seat = parseInt(m[1], 10);
      var name = m[2].trim();
      seatMap[seat] = name;
      result.players[name] = { name: name, seat: seat, stats: {} };
      result.players_count++;
    });

    // ── Identify hero ─────────────────────────────────────────────
    // From "Dealt to PlayerName [Ah Kh]"
    var dealtMatch = null;
    for (var i = 0; i < lines.length; i++) {
      var dm = lines[i].match(/^Dealt\s+to\s+(.+?)\s+\[([^\]]+)\]/i);
      if (dm) { dealtMatch = dm; break; }
    }
    var resolvedHero = heroName || (dealtMatch && dealtMatch[1].trim()) || null;
    if (dealtMatch) {
      result.hero_hand = dealtMatch[2].trim();
      if (!resolvedHero) resolvedHero = dealtMatch[1].trim();
    }

    // ── Blinds ────────────────────────────────────────────────────
    // "keki8115: posts small blind €0.01"
    var sbPos = null, bbPos = null;
    lines.forEach(function(line) {
      var m = line.match(/^(.+?):\s*posts\s+(small blind|big blind|straddle|ante)\s+[€$£¥]?([\d.]+)/i);
      if (!m) return;
      var pname = m[1].trim();
      var btype = m[2].toLowerCase();
      result.blinds.push({ player: pname, type: btype, amount: parseFloat(m[3]) || 0 });
      if (btype === 'small blind') sbPos = pname;
      if (btype === 'big blind') bbPos = pname;
    });

    // Assign positions if we can
    if (resolvedHero && result.players[resolvedHero]) {
      // Try to infer hero position from context - mark as Hero
      result.hero_position = 'Hero';
    }

    // ── Street parsing ────────────────────────────────────────────
    var street = 'init';
    var inHoleCards = false;

    for (var li = 0; li < lines.length; li++) {
      var line = lines[li];

      if (/^\*\*\* HOLE CARDS \*\*\*/.test(line)) {
        street = 'preflop';
        inHoleCards = true;
        continue;
      }

      // Flop: *** FLOP *** [Ah Kh Qh]
      var flopM = line.match(/^\*\*\* FLOP \*\*\*\s+\[([^\]]+)\]/i);
      if (flopM) {
        street = 'flop';
        result.flop = flopM[1].trim();
        result.pot_flop = extractPotFromPrev(lines, li);
        continue;
      }

      // Turn: *** TURN *** [Ah Kh Qh] [Jh]
      var turnM = line.match(/^\*\*\* TURN \*\*\*\s+\[[^\]]+\]\s+\[([^\]]+)\]/i);
      if (turnM) {
        street = 'turn';
        result.turn = turnM[1].trim();
        result.pot_turn = extractPotFromPrev(lines, li);
        continue;
      }

      // River: *** RIVER *** [Ah Kh Qh Jh] [Th]
      var riverM = line.match(/^\*\*\* RIVER \*\*\*\s+\[[^\]]+\]\s+\[([^\]]+)\]/i);
      if (riverM) {
        street = 'river';
        result.river = riverM[1].trim();
        result.pot_river = extractPotFromPrev(lines, li);
        continue;
      }

      // Summary
      if (/^\*\*\* SUMMARY \*\*\*/.test(line)) {
        street = 'summary';
        continue;
      }

      if (street === 'summary') continue;

      // Dealt to — already handled above
      if (/^Dealt\s+to/.test(line)) continue;

      // Collect / win
      var collectM = line.match(/^(.+?)\s+collected\s+[€$£¥]?([\d.]+)\s+from/i);
      if (collectM) {
        if (!result.winner) {
          result.winner = collectM[1].trim();
          result.amount_won = parseFloat(collectM[2]);
        }
        continue;
      }

      // Actions
      if (street === 'preflop' || street === 'flop' || street === 'turn' || street === 'river') {
        var action = parsePSActionLine(line, resolvedHero);
        if (action) {
          if (street === 'preflop') result.preflop.push(action);
          else if (street === 'flop') result.flop_actions.push(action);
          else if (street === 'turn') result.turn_actions.push(action);
          else result.river_actions.push(action);
        }
      }
    }

    return result;
  }

  /** Tente d'extraire le montant du pot depuis la ligne précédente (rare dans PS natif). */
  function extractPotFromPrev(lines, idx) {
    // Le pot n'est pas toujours dans le header de street en PS natif
    // On retourne null si non disponible
    return null;
  }

  /** Parse une ligne d'action PS natif. */
  function parsePSActionLine(line, heroName) {
    if (!line || !line.trim()) return null;

    // "PlayerName: raises €0.22 to €0.28"
    // "PlayerName: calls €0.06"
    // "PlayerName: folds"
    // "PlayerName: checks"
    // "PlayerName: bets €0.10"
    var m = line.match(/^(.+?):\s+(raises?\s+[€$£¥]?[\d.]+\s+to\s+[€$£¥]?[\d.]+|calls?\s+[€$£¥]?[\d.]+|bets?\s+[€$£¥]?[\d.]+|folds?|checks?|raises?\s+to\s+[€$£¥]?[\d.]+)/i);
    if (!m) return null;

    var player = m[1].trim();
    var action = m[2].trim().replace(/[€$£¥]/g, '');

    var isHero = heroName && (player.toLowerCase() === heroName.toLowerCase());
    return {
      player: isHero ? 'Hero' : player,
      action: action,
      isHero: !!isHero
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // Format PokerTracker 4 (PT4)
  // ═══════════════════════════════════════════════════════════════════

  function parsePT4HandHistory(text) {
    if (!text || typeof text !== 'string') return null;
    var lines = text.split('\n').map(function(l) { return l.trim(); });

    var result = {
      room: null,
      stake: null,
      game: null,
      format: null,
      players_count: 0,
      hero_position: null,
      hero_hand: null,
      players: {},
      blinds: [],
      preflop: [],
      flop: null,
      flop_actions: [],
      turn: null,
      turn_actions: [],
      river: null,
      river_actions: [],
      winner: null,
      amount_won: null,
      pot_preflop: null,
      pot_flop: null,
      pot_turn: null,
      pot_river: null,
      raw: text
    };

    // ── Header ───────────────────────────────────────────────────
    var headerMatch = lines[0] && lines[0].match(
      /^(.+?)\s*[-–]\s*([\S]+\s+NL|[\S]+\s+PL|[\S]+\s+FL)\s*(?:\((.*?)\))?\s*[-–]\s*(\w+)\s*[-–]\s*(\d+)\s*player/i
    );
    if (headerMatch) {
      result.room   = headerMatch[1].trim();
      result.stake  = headerMatch[2].trim();
      result.format = headerMatch[3] ? headerMatch[3].trim() : null;
      result.game   = headerMatch[4].trim();
      result.players_count = parseInt(headerMatch[5], 10);
    } else {
      var roomFallback = lines[0] && lines[0].split('-')[0];
      if (roomFallback) result.room = roomFallback.trim();
    }

    // ── Joueurs + stats ──────────────────────────────────────────
    var playerRe = /^([\w]+(?:\s*\([\w]+\))?)\s*:\s*([\d.]+)\s*BB(?:\s*\((.+)\))?/;
    lines.forEach(function(line) {
      var m = line.match(playerRe);
      if (!m) return;
      var rawName = m[1].trim();
      var stack   = parseFloat(m[2]);
      var statsRaw = m[3] || null;

      var heroMatch = rawName.match(/^Hero\s*\((\w+)\)$/i);
      var position, name;
      if (heroMatch) {
        position = heroMatch[1].toUpperCase();
        name = 'Hero';
        result.hero_position = position;
      } else {
        position = rawName.toUpperCase();
        name = rawName;
      }

      var player = { name: name, position: position, stack_bb: stack, stats: {} };

      if (statsRaw) {
        var statPairs = statsRaw.split(',');
        statPairs.forEach(function(pair) {
          var kv = pair.split(':');
          if (kv.length >= 2) {
            var k = kv[0].trim();
            var v = parseFloat(kv[1].trim());
            player.stats[k] = isNaN(v) ? kv[1].trim() : v;
          }
        });
      }
      result.players[position] = player;
    });

    // ── Blinds ───────────────────────────────────────────────────
    lines.forEach(function(line) {
      var blindRe = /(\w+)\s+posts\s+(?:SB|BB|straddle|ante)\s+([\d.]+)\s*BB/gi;
      var bm;
      while ((bm = blindRe.exec(line)) !== null) {
        result.blinds.push({ player: bm[1], amount: parseFloat(bm[2]) });
      }
    });

    // ── Streets ──────────────────────────────────────────────────
    var street = 'preflop';
    var preflopStarted = false;

    lines.forEach(function(line) {
      var pfMatch = line.match(/^Pre\s*Flop\s*:\s*\(pot:\s*([\d.]+)\s*BB\)\s*Hero has\s+(.+)/i);
      if (pfMatch) {
        street = 'preflop';
        preflopStarted = true;
        result.pot_preflop = parseFloat(pfMatch[1]);
        result.hero_hand = pfMatch[2].trim();
        return;
      }

      var flopMatch = line.match(/^Flop\s*:?\s*\(([\d.]+)\s*BB[^)]*\)\s*(.+)/i);
      if (flopMatch) {
        street = 'flop';
        result.pot_flop = parseFloat(flopMatch[1]);
        result.flop = flopMatch[2].trim();
        return;
      }

      var turnMatch = line.match(/^Turn\s*:?\s*\(([\d.]+)\s*BB[^)]*\)\s*(.+)/i);
      if (turnMatch) {
        street = 'turn';
        result.pot_turn = parseFloat(turnMatch[1]);
        result.turn = turnMatch[2].trim();
        return;
      }

      var riverMatch = line.match(/^River\s*:?\s*\(([\d.]+)\s*BB[^)]*\)\s*(.+)/i);
      if (riverMatch) {
        street = 'river';
        result.pot_river = parseFloat(riverMatch[1]);
        result.river = riverMatch[2].trim();
        return;
      }

      var winnerMatch = line.match(/^(\w+)\s+wins?\s+([\d.]+)\s*BB/i);
      if (winnerMatch) {
        result.winner = winnerMatch[1];
        result.amount_won = parseFloat(winnerMatch[2]);
        return;
      }

      if (street === 'preflop' && preflopStarted) {
        var pfActions = parseActionLine(line);
        if (pfActions.length) result.preflop = result.preflop.concat(pfActions);
      }
      if (street === 'flop') {
        var flActions = parseActionLine(line);
        if (flActions.length) result.flop_actions = result.flop_actions.concat(flActions);
      }
      if (street === 'turn') {
        var tuActions = parseActionLine(line);
        if (tuActions.length) result.turn_actions = result.turn_actions.concat(tuActions);
      }
      if (street === 'river') {
        var riActions = parseActionLine(line);
        if (riActions.length) result.river_actions = result.river_actions.concat(riActions);
      }
    });

    return result;
  }

  function parseActionLine(line) {
    var actions = [];
    if (!line) return actions;

    var actionRe = /(\w+(?:\s*\(\w+\))?)\s+(raises?\s+to\s+[\d.]+\s*BB|bets?\s+[\d.]+\s*BB|calls?\s+[\d.]+\s*BB|folds?|checks?|raises?\s+[\d.]+\s*BB)/gi;
    var m;
    while ((m = actionRe.exec(line)) !== null) {
      actions.push({ player: m[1].trim(), action: m[2].trim() });
    }

    var lineNoMatches = line;
    actions.forEach(function(a) {
      lineNoMatches = lineNoMatches.replace(a.player + ' ' + a.action, '');
    });
    var foldCount = (lineNoMatches.match(/\bfold\b/gi) || []).length;
    for (var i = 0; i < foldCount; i++) {
      actions.push({ player: 'unknown', action: 'fold' });
    }

    return actions;
  }

  // Export
  global.parseHandHistory = parseHandHistory;
  global.parsePT4HandHistory = parsePT4HandHistory;

})(typeof window !== 'undefined' ? window : this);
