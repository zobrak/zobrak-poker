/**
 * hh-parser.js — Parser de hand histories PokerTracker 4.
 * Parsing côté navigateur. Aucune donnée envoyée au serveur.
 */

(function(global) {
  'use strict';

  /**
   * parsePT4HandHistory(text) → objet structuré ou null si échec.
   * Retourne un objet avec toutes les données extraites.
   */
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

    // ── Ligne 1 : header ─────────────────────────────────────────
    // Ex: "PokerStars - €0.02 NL (6 max) - Holdem - 6 players"
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
      // Fallback partiel
      var roomFallback = lines[0] && lines[0].split('-')[0];
      if (roomFallback) result.room = roomFallback.trim();
    }

    // ── Joueurs + stats ────────────────────────────────────────────
    // Ex: "BTN: 100 BB (VPIP: 29.41, PFR: 23.53, 3Bet Preflop: 0.00, Hands: 17)"
    // Ex: "Hero (CO): 137.5 BB"
    var playerRe = /^([\w]+(?:\s*\([\w]+\))?)\s*:\s*([\d.]+)\s*BB(?:\s*\((.+)\))?/;
    lines.forEach(function(line) {
      var m = line.match(playerRe);
      if (!m) return;
      var rawName = m[1].trim();
      var stack   = parseFloat(m[2]);
      var statsRaw = m[3] || null;

      // Detect Hero
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
        // Parse stats: "VPIP: 64.71, PFR: 17.65, 3Bet Preflop: 12.50, Hands: 17"
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

    // ── Blinds ─────────────────────────────────────────────────────
    // Ex: "SB posts SB 0.5 BB, BB posts BB 1 BB"
    lines.forEach(function(line) {
      var blindRe = /(\w+)\s+posts\s+(?:SB|BB|straddle|ante)\s+([\d.]+)\s*BB/gi;
      var bm;
      while ((bm = blindRe.exec(line)) !== null) {
        result.blinds.push({ player: bm[1], amount: parseFloat(bm[2]) });
      }
    });

    // ── Détection des streets ──────────────────────────────────────
    var street = 'preflop';
    var preflopStarted = false;

    lines.forEach(function(line) {
      // Preflop
      var pfMatch = line.match(/^Pre\s*Flop\s*:\s*\(pot:\s*([\d.]+)\s*BB\)\s*Hero has\s+(.+)/i);
      if (pfMatch) {
        street = 'preflop';
        preflopStarted = true;
        result.pot_preflop = parseFloat(pfMatch[1]);
        result.hero_hand = pfMatch[2].trim();
        return;
      }

      // Flop
      var flopMatch = line.match(/^Flop\s*:?\s*\(([\d.]+)\s*BB[^)]*\)\s*(.+)/i);
      if (flopMatch) {
        street = 'flop';
        result.pot_flop = parseFloat(flopMatch[1]);
        result.flop = flopMatch[2].trim();
        return;
      }

      // Turn
      var turnMatch = line.match(/^Turn\s*:?\s*\(([\d.]+)\s*BB[^)]*\)\s*(.+)/i);
      if (turnMatch) {
        street = 'turn';
        result.pot_turn = parseFloat(turnMatch[1]);
        result.turn = turnMatch[2].trim();
        return;
      }

      // River
      var riverMatch = line.match(/^River\s*:?\s*\(([\d.]+)\s*BB[^)]*\)\s*(.+)/i);
      if (riverMatch) {
        street = 'river';
        result.pot_river = parseFloat(riverMatch[1]);
        result.river = riverMatch[2].trim();
        return;
      }

      // Winner
      var winnerMatch = line.match(/^(\w+)\s+wins?\s+([\d.]+)\s*BB/i);
      if (winnerMatch) {
        result.winner = winnerMatch[1];
        result.amount_won = parseFloat(winnerMatch[2]);
        return;
      }

      // Actions préflop (après "Pre Flop:" jusqu'au flop)
      if (street === 'preflop' && preflopStarted) {
        var pfActions = parseActionLine(line);
        if (pfActions.length) result.preflop = result.preflop.concat(pfActions);
      }

      // Actions flop
      if (street === 'flop') {
        var flActions = parseActionLine(line);
        if (flActions.length) result.flop_actions = result.flop_actions.concat(flActions);
      }

      // Actions turn
      if (street === 'turn') {
        var tuActions = parseActionLine(line);
        if (tuActions.length) result.turn_actions = result.turn_actions.concat(tuActions);
      }

      // Actions river
      if (street === 'river') {
        var riActions = parseActionLine(line);
        if (riActions.length) result.river_actions = result.river_actions.concat(riActions);
      }
    });

    return result;
  }

  /**
   * parseActionLine(line) → tableau d'actions extraites d'une ligne.
   * Une ligne peut contenir plusieurs actions séparées par ", ".
   * Ex: "fold, fold, Hero raises to 3 BB, BTN raises to 10.5 BB, fold, fold, ..."
   */
  function parseActionLine(line) {
    var actions = [];
    if (!line) return actions;

    // Découpe sur les virgules mais garde le contexte
    // On cherche les patterns d'actions connus
    var actionRe = /(\w+(?:\s*\(\w+\))?)\s+(raises?\s+to\s+[\d.]+\s*BB|bets?\s+[\d.]+\s*BB|calls?\s+[\d.]+\s*BB|folds?|checks?|raises?\s+[\d.]+\s*BB)/gi;
    var m;
    while ((m = actionRe.exec(line)) !== null) {
      actions.push({ player: m[1].trim(), action: m[2].trim() });
    }

    // Folds simples non attachés à un joueur explicite ("fold, fold, ...")
    // On compte les "fold" orphelins (hors match ci-dessus)
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
  global.parsePT4HandHistory = parsePT4HandHistory;

})(typeof window !== 'undefined' ? window : this);
