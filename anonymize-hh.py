#!/usr/bin/env python3
"""
anonymize-hh.py — Anonymise une hand history PokerStars avant publication.

Remplace les noms des adversaires par Villain1, Villain2, …
Renomme le Hero en "Hero". Anonymise le nom de la table.

Usage :
  ./anonymize-hh.py <fichier.txt>
  ./anonymize-hh.py <fichier.txt> --hero MonPseudo
  cat hh.txt | ./anonymize-hh.py -
  ./anonymize-hh.py hh.txt > anonymized.txt
"""

import sys
import re
import argparse


def extract_players_ps(lines):
    """Seat X: Name (€X.XX in chips) → {seat: name}"""
    seat_re = re.compile(
        r'^Seat\s+(\d+)\s*:\s*(.+?)\s+\([€$£¥]?[\d,]+\.?\d*\s+in chips\)',
        re.IGNORECASE
    )
    players = {}
    for line in lines:
        m = seat_re.match(line)
        if m:
            players[int(m.group(1))] = m.group(2).strip()
    return players


def detect_hero_ps(lines):
    """Détecte le hero depuis 'Dealt to Name [cards]'"""
    dealt_re = re.compile(r'^Dealt\s+to\s+(.+?)\s+\[', re.IGNORECASE)
    for line in lines:
        m = dealt_re.match(line)
        if m:
            return m.group(1).strip()
    return None


def build_mapping(players_by_seat, hero_name):
    """Construit {nom_original: nom_anonyme}, triés par numéro de siège."""
    mapping = {}
    villain_idx = 0
    for seat in sorted(players_by_seat):
        name = players_by_seat[seat]
        if hero_name and name.lower() == hero_name.lower():
            mapping[name] = 'Hero'
        else:
            villain_idx += 1
            mapping[name] = f'Villain{villain_idx}'
    return mapping


def apply_mapping(text, mapping):
    """
    Remplace les noms dans le texte.
    Tri par longueur décroissante pour éviter les correspondances partielles
    (ex: "Tom" ne doit pas remplacer l'intérieur de "Tommy").
    """
    result = text
    for original in sorted(mapping, key=len, reverse=True):
        result = result.replace(original, mapping[original])
    return result


def anonymize_table_name(text):
    """Table 'Alemannia VII' → Table 'Anonyme'"""
    text = re.sub(r"(Table\s+)'[^']+'", r"\1'Anonyme'", text)
    text = re.sub(r'(Table\s+)"[^"]+"', r'\1"Anonyme"', text)
    return text


def anonymize_hand_id(text):
    """PokerStars Hand #260824466012 → PokerStars Hand #XXXXXXXXXXXX"""
    return re.sub(
        r'(PokerStars\s+(?:Hand|Game)\s+#)\d+',
        r'\1XXXXXXXXXXXX',
        text, flags=re.IGNORECASE
    )


def anonymize_ps(text, hero_name=None):
    lines = text.splitlines()

    players_by_seat = extract_players_ps(lines)
    if not players_by_seat:
        return None, None, None

    detected_hero = detect_hero_ps(lines)
    resolved_hero = hero_name or detected_hero

    mapping = build_mapping(players_by_seat, resolved_hero)

    result = apply_mapping(text, mapping)
    result = anonymize_table_name(result)
    result = anonymize_hand_id(result)

    return result, mapping, resolved_hero


def anonymize(text, hero_name=None):
    text = text.strip()
    if re.match(r'^PokerStars\s+Hand\s+#', text, re.IGNORECASE):
        return anonymize_ps(text, hero_name)
    # Format PT4 : positions déjà anonymes (Hero, UTG, CO…), rien à faire
    return text, {}, hero_name


def print_mapping(mapping, hero_detected):
    print('── Correspondances ──────────────────────────────────', file=sys.stderr)
    for original, replacement in sorted(
        mapping.items(),
        key=lambda x: (x[1] != 'Hero', x[1])
    ):
        marker = '  ← Hero' if replacement == 'Hero' else ''
        print(f'  {original:<32} → {replacement}{marker}', file=sys.stderr)
    print('─────────────────────────────────────────────────────', file=sys.stderr)
    if hero_detected:
        print(f'\nFrontmatter → hero: "Hero"', file=sys.stderr)
    print('', file=sys.stderr)


def read_input(path):
    if path == '-':
        return sys.stdin.read()
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Certains exports PS sont en latin-1
        with open(path, 'r', encoding='latin-1') as f:
            return f.read()


def main():
    parser = argparse.ArgumentParser(
        description='Anonymise une hand history PokerStars avant publication.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples :
  %(prog)s hh.txt
  %(prog)s hh.txt --hero MonPseudo
  cat hh.txt | %(prog)s -
  %(prog)s hh.txt > anonymized.txt
        """.strip()
    )
    parser.add_argument(
        'fichier',
        help="Fichier hand history ou - pour lire depuis stdin"
    )
    parser.add_argument(
        '--hero', '-H',
        metavar='NOM',
        help="Nom exact du joueur Hero dans la HH (auto-détecté depuis 'Dealt to' si absent)"
    )
    args = parser.parse_args()

    try:
        text = read_input(args.fichier)
    except FileNotFoundError:
        print(f'Erreur : fichier introuvable : {args.fichier}', file=sys.stderr)
        sys.exit(1)

    if not text.strip():
        print('Erreur : fichier vide.', file=sys.stderr)
        sys.exit(1)

    result, mapping, hero_detected = anonymize(text, args.hero)

    if result is None:
        print(
            'Erreur : aucun joueur détecté. Vérifier que le fichier est une '
            'hand history PokerStars valide.',
            file=sys.stderr
        )
        sys.exit(1)

    if mapping:
        print_mapping(mapping, hero_detected)

    print(result)


if __name__ == '__main__':
    main()
