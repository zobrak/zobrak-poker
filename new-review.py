#!/usr/bin/env python3
"""
new-review.py — Génère des fichiers Markdown Hugo depuis des hand histories brutes.

Pour chaque main trouvée dans le fichier source :
  - Anonymise les pseudos (Villain1/2/…, Hero)
  - Extrait les métadonnées (stakes, format, date, cartes, position, streets,
    type de pot, actions Hero)
  - Génère un fichier .md prêt à éditer (draft: true)

Usage :
  ./new-review.py session.txt
  ./new-review.py session.txt --hero MonPseudo
  ./new-review.py session.txt --out poker/content/review/session-mai/
"""

import sys
import re
import os
import argparse
from datetime import datetime

REPO_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUT = os.path.join(REPO_DIR, 'poker', 'content', 'review')

# ── Symboles ──────────────────────────────────────────────────────────────────
SUIT_SYM = {'h': '♥', 'd': '♦', 'c': '♣', 's': '♠'}


# ═══════════════════════════════════════════════════════════════════════════════
# Anonymisation (logique partagée avec anonymize-hh.py)
# ═══════════════════════════════════════════════════════════════════════════════

def extract_players_ps(lines):
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


def detect_hero_name_from_dealt(lines):
    dealt_re = re.compile(r'^Dealt\s+to\s+(.+?)\s+\[', re.IGNORECASE)
    for line in lines:
        m = dealt_re.match(line)
        if m:
            return m.group(1).strip()
    return None


def build_mapping(players_by_seat, hero_name):
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
    result = text
    for original in sorted(mapping, key=len, reverse=True):
        result = result.replace(original, mapping[original])
    return result


def anonymize(raw_text, hero_name=None):
    """Retourne (texte_anonymisé, mapping, hero_résolu)."""
    lines = raw_text.splitlines()
    players_by_seat = extract_players_ps(lines)
    if not players_by_seat:
        return raw_text, {}, hero_name

    resolved_hero = hero_name or detect_hero_name_from_dealt(lines)
    mapping = build_mapping(players_by_seat, resolved_hero)
    return apply_mapping(raw_text, mapping), mapping, resolved_hero


# ═══════════════════════════════════════════════════════════════════════════════
# Extraction de métadonnées (travaille sur le texte APRÈS anonymisation)
# ═══════════════════════════════════════════════════════════════════════════════

def extract_date(text):
    m = re.search(r'(\d{4}/\d{2}/\d{2})', text)
    if m:
        return m.group(1).replace('/', '-')
    return datetime.now().strftime('%Y-%m-%d')


def extract_bb_amount(text):
    """'€0.01/€0.02 EUR' → 0.02"""
    m = re.search(r'[€$£¥]?[\d.]+/[€$£¥]?([\d.]+)', text)
    if m:
        return float(m.group(1))
    return None


def extract_limit(text):
    """bb × 100 → 'NL2', 'NL5', etc."""
    bb = extract_bb_amount(text)
    if bb is None:
        return None
    nl = int(round(bb * 100))
    return f'NL{nl}'


def extract_format(text):
    """'Table ... 6-max ...' → '6-max'"""
    m = re.search(r"Table\s+['\"].*?['\"]\s+(\S+)", text, re.IGNORECASE)
    if m:
        fmt = m.group(1).rstrip('.')
        if fmt.lower() in ('6-max', '9-max', 'heads-up', 'full-ring', 'hu'):
            return fmt
        return fmt
    return None


def extract_hero_cards(text):
    """'Dealt to Hero [Ah Kh]' → 'Ah Kh'"""
    m = re.search(r'^Dealt\s+to\s+Hero\s+\[([^\]]+)\]', text, re.MULTILINE | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return None


def extract_hero_seat(text):
    m = re.search(r'^Seat\s+(\d+)\s*:\s*Hero\b', text, re.MULTILINE | re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None


def extract_button_seat(text):
    m = re.search(r'Seat\s+#(\d+)\s+is\s+the\s+button', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None


def extract_hero_position(text):
    """Calcule la position Hero depuis le siège bouton et les sièges occupés."""
    players_seats = []
    for m in re.finditer(
        r'^Seat\s+(\d+)\s*:\s*.+?\s+\([€$£¥]?[\d,]+\.?\d*\s+in chips\)',
        text, re.MULTILINE | re.IGNORECASE
    ):
        players_seats.append(int(m.group(1)))
    players_seats.sort()

    hero_seat = extract_hero_seat(text)
    btn_seat = extract_button_seat(text)
    if hero_seat is None or btn_seat is None or not players_seats:
        return None

    n = len(players_seats)
    if btn_seat not in players_seats:
        return None

    btn_idx = players_seats.index(btn_seat)
    # Rotation : BTN en position 0
    rotated = players_seats[btn_idx:] + players_seats[:btn_idx]

    # Noms de positions selon nombre de joueurs
    if n == 2:
        pos_map = {0: 'BTN', 1: 'BB'}
    elif n == 3:
        pos_map = {0: 'BTN', 1: 'SB', 2: 'BB'}
    elif n == 4:
        pos_map = {0: 'BTN', 1: 'SB', 2: 'BB', 3: 'CO'}
    elif n == 5:
        pos_map = {0: 'BTN', 1: 'SB', 2: 'BB', 3: 'HJ', 4: 'CO'}
    elif n == 6:
        pos_map = {0: 'BTN', 1: 'SB', 2: 'BB', 3: 'UTG', 4: 'HJ', 5: 'CO'}
    else:
        pos_map = {0: 'BTN', 1: 'SB', 2: 'BB', 3: 'UTG', 4: 'UTG+1',
                   5: 'MP', 6: 'LJ', 7: 'HJ', 8: 'CO'}

    for i, seat in enumerate(rotated):
        if seat == hero_seat:
            return pos_map.get(i, f'Seat{i + 1}')
    return None


def extract_streets_played(text):
    """Retourne la liste des streets avec action."""
    streets = ['preflop']
    if re.search(r'^\*\*\* FLOP \*\*\*', text, re.MULTILINE):
        streets.append('flop')
    if re.search(r'^\*\*\* TURN \*\*\*', text, re.MULTILINE):
        streets.append('turn')
    if re.search(r'^\*\*\* RIVER \*\*\*', text, re.MULTILINE):
        streets.append('river')
    return streets


def extract_pot_type(text):
    """Compte les raises préflop pour déduire le type de pot."""
    pf_m = re.search(
        r'\*\*\* HOLE CARDS \*\*\*(.*?)(?=\*\*\* FLOP|\*\*\* TURN|\*\*\* SUMMARY)',
        text, re.DOTALL | re.IGNORECASE
    )
    if not pf_m:
        return 'SRP'
    pf = pf_m.group(1)
    n_raises = len(re.findall(r':\s+raises?\s+', pf, re.IGNORECASE))
    return {0: 'limped', 1: 'SRP', 2: '3bet pot', 3: '4bet pot'}.get(n_raises, f'{n_raises + 1}bet pot')


def extract_hero_preflop_actions(text):
    """Détecte les actions préflop de Hero : open, 3bet, 4bet, call, fold…"""
    pf_m = re.search(
        r'\*\*\* HOLE CARDS \*\*\*(.*?)(?=\*\*\* FLOP|\*\*\* TURN|\*\*\* SUMMARY)',
        text, re.DOTALL | re.IGNORECASE
    )
    if not pf_m:
        return []

    pf_lines = [l.strip() for l in pf_m.group(1).splitlines() if l.strip()]
    raise_count = 0
    actions = []

    for line in pf_lines:
        if re.match(r'^Dealt\s+to', line, re.IGNORECASE):
            continue
        is_hero = re.match(r'^Hero:', line, re.IGNORECASE)
        if re.search(r':\s+raises?\b', line, re.IGNORECASE):
            raise_count += 1
            if is_hero:
                label = {1: 'open', 2: '3bet', 3: '4bet'}.get(raise_count, f'{raise_count + 1}bet')
                # squeeze si des callers précèdent la raise Hero
                if label == 'open':
                    callers_before = len(re.findall(r':\s+calls?\b', pf_m.group(1)[:pf_m.group(1).find(line)], re.IGNORECASE))
                    if callers_before > 0:
                        label = 'squeeze'
                actions.append(label)
        elif is_hero:
            if re.search(r':\s+calls?\b', line, re.IGNORECASE):
                actions.append('call')
            elif re.search(r':\s+folds?\b', line, re.IGNORECASE):
                actions.append('fold')
            elif re.search(r':\s+checks?\b', line, re.IGNORECASE):
                actions.append('check')

    return actions


def extract_result_bb(text, bb):
    """
    Calcule le résultat net Hero en BB.
    Approximation : collected - blinds - calls - bets - raises_to + uncalled.
    """
    if not bb:
        return 0.0

    # Gains
    collected = sum(
        float(m) for m in re.findall(
            r'^Hero\s+collected\s+[€$£¥]?([\d.]+)', text, re.MULTILINE | re.IGNORECASE
        )
    )

    # Investissements
    blinds = sum(
        float(m) for m in re.findall(
            r'^Hero:\s+posts\s+\S+\s+blind\s+[€$£¥]?([\d.]+)', text, re.MULTILINE | re.IGNORECASE
        )
    )
    calls = sum(
        float(m) for m in re.findall(
            r'^Hero:\s+calls?\s+[€$£¥]?([\d.]+)', text, re.MULTILINE | re.IGNORECASE
        )
    )
    bets = sum(
        float(m) for m in re.findall(
            r'^Hero:\s+bets?\s+[€$£¥]?([\d.]+)', text, re.MULTILINE | re.IGNORECASE
        )
    )
    # "raises X to Y" : Y = total commité pour cette raise
    # Le blind préflop est déjà dans Y si Hero est BB et relance → peut être sur-compté d'un BB
    raises_to = sum(
        float(m) for m in re.findall(
            r'^Hero:\s+raises?\s+[€$£¥]?[\d.]+\s+to\s+[€$£¥]?([\d.]+)', text, re.MULTILINE | re.IGNORECASE
        )
    )
    uncalled = sum(
        float(m) for m in re.findall(
            r'Uncalled\s+bet\s+\([€$£¥]?([\d.]+)\)\s+returned\s+to\s+Hero', text, re.MULTILINE | re.IGNORECASE
        )
    )

    invested = blinds + calls + bets + raises_to - uncalled
    net = collected - invested
    return round(net / bb, 1)


# ═══════════════════════════════════════════════════════════════════════════════
# Formatage du Markdown
# ═══════════════════════════════════════════════════════════════════════════════

def pretty_card(card):
    if len(card) >= 2:
        rank = card[:-1].upper()
        suit = SUIT_SYM.get(card[-1].lower(), card[-1])
        return rank + suit
    return card


def pretty_hand(cards_str):
    return ' '.join(pretty_card(c) for c in cards_str.split())


def make_slug(cards_str, position, date, existing_slugs):
    """'Ah Kh', 'BB', '2026-05-16' → '2026-05-16-ah-kh-bb'"""
    base_cards = cards_str.lower().replace(' ', '-') if cards_str else 'xx-xx'
    pos_slug = position.lower().replace('+', 'p') if position else 'unk'
    base = f'{date}-{base_cards}-{pos_slug}'
    slug = base
    n = 2
    while slug in existing_slugs:
        slug = f'{base}-{n}'
        n += 1
    existing_slugs.add(slug)
    return slug


def make_title(cards_str, position, hero_actions, limit):
    parts = []
    if cards_str:
        parts.append(pretty_hand(cards_str))
    if position:
        parts.append(position)
    desc_parts = []
    if hero_actions:
        desc_parts.append(' + '.join(hero_actions))
    if limit:
        desc_parts.append(limit)
    title = ' '.join(parts)
    if desc_parts:
        title += ' — ' + ', '.join(desc_parts)
    return title or 'Review'


def render_frontmatter(meta):
    lines = ['---']
    lines.append(f'title: "{meta["title"]}"')
    lines.append(f'date: {meta["date"]}')
    lines.append('draft: true')
    if meta.get('description'):
        lines.append(f'description: "{meta["description"]}"')
    lines.append('hero: "Hero"')
    lines.append('')
    lines.append('tags:')
    for t in meta.get('tags', []):
        lines.append(f'  - {t}')
    if meta.get('limit'):
        lines.append('')
        lines.append('limits:')
        lines.append(f'  - {meta["limit"]}')
    lines.append('')
    lines.append('rooms:')
    lines.append('  - PokerStars')
    if meta.get('position'):
        lines.append('')
        lines.append('positions:')
        lines.append(f'  - {meta["position"]}')
    if meta.get('hero_actions'):
        lines.append('')
        lines.append('actions:')
        for a in meta['hero_actions']:
            lines.append(f'  - {a}')
    if meta.get('streets'):
        lines.append('')
        lines.append('streets:')
        for s in meta['streets']:
            lines.append(f'  - {s}')
    if meta.get('fmt'):
        lines.append('')
        lines.append('formats:')
        lines.append(f'  - {meta["fmt"]}')
    lines.append('')
    lines.append('params:')
    lines.append(f'  hero_position: "{meta.get("position", "")}"')
    lines.append(f'  pot_type: "{meta.get("pot_type", "")}"')
    lines.append(f'  result_bb: {meta.get("result_bb", 0.0)}')
    lines.append('  video_url: ""')
    lines.append('---')
    return '\n'.join(lines)


def render_md(meta, anon_hh):
    fm = render_frontmatter(meta)
    body = f'\n```hh\n{anon_hh.strip()}\n```\n\n## Analyse\n\n### Préflop\n\n\n'
    if meta.get('streets') and len(meta['streets']) > 1:
        for s in meta['streets'][1:]:
            body += f'### {s.capitalize()}\n\n\n'
    return fm + '\n' + body


# ═══════════════════════════════════════════════════════════════════════════════
# Découpage du fichier source en mains individuelles
# ═══════════════════════════════════════════════════════════════════════════════

def split_hands(text):
    """Découpe un fichier multi-mains en liste de mains individuelles."""
    # Chaque main commence par "PokerStars Hand #"
    pattern = re.compile(r'(?=^PokerStars\s+Hand\s+#)', re.MULTILINE | re.IGNORECASE)
    parts = pattern.split(text)
    hands = [p.strip() for p in parts if p.strip()]
    return hands


# ═══════════════════════════════════════════════════════════════════════════════
# Pipeline principal
# ═══════════════════════════════════════════════════════════════════════════════

def process_hand(raw, hero_name, existing_slugs, out_dir):
    anon, mapping, resolved_hero = anonymize(raw, hero_name)

    date = extract_date(anon)
    bb = extract_bb_amount(anon)
    limit = extract_limit(anon)
    fmt = extract_format(anon)
    cards = extract_hero_cards(anon)
    position = extract_hero_position(anon)
    streets = extract_streets_played(anon)
    pot_type = extract_pot_type(anon)
    hero_actions = extract_hero_preflop_actions(anon)
    result_bb = extract_result_bb(anon, bb)

    # Tags automatiques
    tags = ['holdem', 'no-limit', 'cash-game']
    if fmt:
        tags.append(fmt)
    if limit:
        tags.append(limit)
    tags.append('PokerStars')
    tags.extend(hero_actions)

    title = make_title(cards, position, hero_actions, limit)
    slug = make_slug(cards or 'xx-xx', position, date, existing_slugs)

    meta = {
        'title': title,
        'date': date,
        'description': '',
        'tags': tags,
        'limit': limit,
        'position': position,
        'hero_actions': hero_actions,
        'streets': streets,
        'fmt': fmt,
        'pot_type': pot_type,
        'result_bb': result_bb,
    }

    content = render_md(meta, anon)
    filepath = os.path.join(out_dir, f'{slug}.md')
    return filepath, content, mapping


TXT_DIR = os.path.join(REPO_DIR, 'txt')


def resolve_input_path(arg):
    """
    Si l'argument ne contient pas de séparateur, cherche dans txt/ en priorité.
    Sinon utilise le chemin tel quel.
    """
    if os.sep not in arg and '/' not in arg:
        candidate = os.path.join(TXT_DIR, arg)
        if os.path.isfile(candidate):
            return candidate
    return arg


def main():
    parser = argparse.ArgumentParser(
        description='Génère des fichiers Markdown Hugo depuis des hand histories brutes.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples :
  %(prog)s session.txt              # cherche dans txt/session.txt
  %(prog)s session.txt --hero Pseudo
  %(prog)s session.txt --out poker/content/review/session-mai/
  %(prog)s /chemin/complet/hh.txt  # chemin absolu ou relatif explicite
        """.strip()
    )
    parser.add_argument('fichier', help='Fichier .txt (cherché dans txt/ si nom seul)')
    parser.add_argument('--hero', '-H', metavar='NOM',
                        help="Nom du joueur Hero (auto-détecté si absent)")
    parser.add_argument('--out', '-o', metavar='DOSSIER', default=DEFAULT_OUT,
                        help=f"Dossier de sortie (défaut: {DEFAULT_OUT})")
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help="Affiche ce qui serait créé sans écrire les fichiers")
    args = parser.parse_args()

    filepath = resolve_input_path(args.fichier)

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='latin-1') as f:
            text = f.read()
    except FileNotFoundError:
        print(f'Erreur : fichier introuvable : {filepath}', file=sys.stderr)
        sys.exit(1)

    hands = split_hands(text)
    if not hands:
        print('Aucune hand history PokerStars trouvée dans le fichier.', file=sys.stderr)
        sys.exit(1)

    out_dir = os.path.abspath(args.out)
    if not args.dry_run:
        os.makedirs(out_dir, exist_ok=True)

    existing_slugs = set()
    created = []
    errors = []

    print(f'\n{len(hands)} main(s) trouvée(s)\n')

    for i, raw in enumerate(hands, 1):
        try:
            filepath, content, mapping = process_hand(raw, args.hero, existing_slugs, out_dir)

            print(f'[{i}/{len(hands)}] → {os.path.relpath(filepath)}')
            if mapping:
                for orig, repl in sorted(mapping.items(), key=lambda x: (x[1] != 'Hero', x[1])):
                    marker = ' ← Hero' if repl == 'Hero' else ''
                    print(f'         {orig:<28} → {repl}{marker}')
            print()

            if not args.dry_run:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                created.append(filepath)
            else:
                created.append(filepath)

        except Exception as e:
            errors.append((i, str(e)))
            print(f'[{i}/{len(hands)}] ✖ Erreur : {e}', file=sys.stderr)

    # Résumé
    print('─' * 52)
    if args.dry_run:
        print(f'  Dry-run : {len(created)} fichier(s) seraient créés')
    else:
        print(f'  {len(created)} fichier(s) créé(s) dans {os.path.relpath(out_dir)}')
    if errors:
        print(f'  {len(errors)} erreur(s)')
    print()

    if not args.dry_run and created:
        print('Prochaines étapes :')
        print('  1. Éditer les fichiers (title, description, result_bb)')
        print('  2. Passer draft: false quand l\'article est prêt')
        print('  3. git add + commit + push + ./deploy.sh')
        print()


if __name__ == '__main__':
    main()
