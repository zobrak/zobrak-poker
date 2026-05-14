/**
 * cards-ui.js — Affichage graphique des cartes à jouer.
 * Jeu quatre couleurs. Pas de dépendance externe.
 * Entrée : "Ac", "Kh", "Td", "5s"
 */

(function(global) {
  'use strict';

  // Mapping rang
  var RANK_DISPLAY = {
    'A':'A','K':'K','Q':'Q','J':'J','T':'10',
    '9':'9','8':'8','7':'7','6':'6','5':'5','4':'4','3':'3','2':'2'
  };

  // Mapping couleur → classe CSS + symbole Unicode
  var SUIT_MAP = {
    's': { cls: 'suit-spade',   sym: '♠', name: 'pique' },
    'h': { cls: 'suit-heart',   sym: '♥', name: 'cœur' },
    'd': { cls: 'suit-diamond', sym: '♦', name: 'carreau' },
    'c': { cls: 'suit-club',    sym: '♣', name: 'trèfle' }
  };

  /**
   * renderCard(code) → HTML string d'une carte.
   * @param {string} code  Ex: "Ac", "Kh", "Td", "5s"
   * @returns {string}
   */
  function renderCard(code) {
    if (!code || typeof code !== 'string') return '';
    var c = code.trim();
    if (c.length < 2) return '';

    var rank = c.slice(0, -1).toUpperCase();
    var suit = c.slice(-1).toLowerCase();

    var rankDisplay = RANK_DISPLAY[rank] || rank;
    var suitInfo = SUIT_MAP[suit];
    if (!suitInfo) {
      // Carte inconnue — fallback texte brut
      return '<span class="playing-card" title="' + escHtml(c) + '">'
        + '<span class="card-rank">' + escHtml(rankDisplay) + '</span>'
        + '<span class="card-suit">?</span>'
        + '</span>';
    }

    return '<span class="playing-card ' + suitInfo.cls + '" title="' + escHtml(c) + '" aria-label="' + escHtml(rankDisplay + ' ' + suitInfo.name) + '">'
      + '<span class="card-rank">' + escHtml(rankDisplay) + '</span>'
      + '<span class="card-suit" aria-hidden="true">' + suitInfo.sym + '</span>'
      + '</span>';
  }

  /**
   * renderCards(codes) → HTML string d'un groupe de cartes.
   * @param {string[]} codes  Ex: ["Ac", "Ad"]
   * @returns {string}
   */
  function renderCards(codes) {
    if (!Array.isArray(codes)) codes = [codes];
    var html = '<span class="cards-row">';
    for (var i = 0; i < codes.length; i++) {
      html += renderCard(codes[i]);
    }
    html += '</span>';
    return html;
  }

  /** Échappement HTML minimal. */
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Export global
  global.renderCard  = renderCard;
  global.renderCards = renderCards;

})(typeof window !== 'undefined' ? window : this);
