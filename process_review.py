#!/usr/bin/env python3
"""
process_review.py — Pipeline de génération de reviews poker.

Workflow :
  1. Lit le nom Hero dans .hero
  2. Charge / crée la base joueurs (.player-db.json) : pseudo → uuid → avatar
  3. Pour chaque HH dans txt/ (ou fichier en argument) :
     a. Détecte le format via parsers/*.yaml
     b. Extrait joueurs, stats, cartes Hero, streets, résultat
     c. Anonymise (Hero / Villain1…N par ordre d'action pré-flop)
     d. Génère l'avatar SVG si nécessaire (local, aucun appel réseau)
     e. Vérifie si la main a déjà une review (hand_id déterministe)
     f. Génère le .md via templates/review.md.j2
     g. Archive la main source dans archive/txt/{hand_id}.txt
  4. Traite la photo hero si présente dans pictures/
  5. Archive le fichier txt source

Usage :
  ./process_review.py                  # traite tous les txt/
  ./process_review.py session.txt      # fichier spécifique (cherche dans txt/)
  ./process_review.py --dry-run        # simulation sans écrire
"""

import sys
import os
import re
import json
import hashlib
import shutil
import argparse
from datetime import datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML manquant : pip install PyYAML  (ou : source .venv/bin/activate)")

try:
    from jinja2 import Environment, FileSystemLoader
except ImportError:
    sys.exit("Jinja2 manquant : pip install Jinja2  (ou : source .venv/bin/activate)")

try:
    from PIL import Image, ImageDraw
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

# ── Chemins ───────────────────────────────────────────────────────────────────
REPO        = Path(__file__).parent.resolve()
PARSERS_DIR = REPO / 'parsers'
TMPL_DIR    = REPO / 'templates'
PLAYER_DB   = REPO / '.player-db.json'
HERO_FILE   = REPO / '.hero'
TXT_DIR     = REPO / 'txt'
PICS_DIR    = REPO / 'pictures'
ARCHIVE_DIR = REPO / 'archive'
STATIC_DIR  = REPO / 'poker' / 'static'
AVATARS_DIR = STATIC_DIR / 'avatars'
PICS_OUT    = STATIC_DIR / 'pictures'
CONTENT_DIR = REPO / 'poker' / 'content' / 'review'

SUIT_SYM = {'h': '♥', 'd': '♦', 'c': '♣', 's': '♠'}

# Ordre des positions pré-flop (UTG agit en premier)
POS_ORDER = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']


# ═══════════════════════════════════════════════════════════════════════════════
# Hero file
# ═══════════════════════════════════════════════════════════════════════════════

def read_hero_name() -> str | None:
    if HERO_FILE.exists():
        name = HERO_FILE.read_text(encoding='utf-8').strip()
        return name or None
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# Player DB  (.player-db.json — gitignore, local uniquement)
# ═══════════════════════════════════════════════════════════════════════════════

def load_player_db() -> dict:
    if PLAYER_DB.exists():
        try:
            return json.loads(PLAYER_DB.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            pass
    return {'players': {}}


def save_player_db(db: dict) -> None:
    PLAYER_DB.write_text(
        json.dumps(db, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )


def get_or_create_uuid(db: dict, pseudo: str) -> str:
    """UUID déterministe basé sur le pseudo (SHA-256 tronqué)."""
    players = db.setdefault('players', {})
    today = datetime.now().strftime('%Y-%m-%d')
    if pseudo not in players:
        uid = hashlib.sha256(pseudo.encode('utf-8')).hexdigest()[:8]
        players[pseudo] = {'uuid': uid, 'first_seen': today, 'last_seen': today}
    else:
        players[pseudo]['last_seen'] = today
    return players[pseudo]['uuid']


# ═══════════════════════════════════════════════════════════════════════════════
# Génération d'avatars SVG (identicons 5×5, 128×128, aucune dépendance réseau)
# ═══════════════════════════════════════════════════════════════════════════════

def _hsl_to_hex(h: float, s: float, l: float) -> str:
    h, s, l = h / 360, s / 100, l / 100
    if s == 0:
        r = g = b = l
    else:
        def _h2r(p, q, t):
            t %= 1
            if t < 1 / 6: return p + (q - p) * 6 * t
            if t < 1 / 2: return q
            if t < 2 / 3: return p + (q - p) * (2 / 3 - t) * 6
            return p
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = _h2r(p, q, h + 1 / 3)
        g = _h2r(p, q, h)
        b = _h2r(p, q, h - 1 / 3)
    return f'#{round(r * 255):02x}{round(g * 255):02x}{round(b * 255):02x}'


def _generate_avatar_svg(uid: str) -> str:
    """Identicon 5×5 dans un cercle 128×128 — déterministe, aucune lib externe."""
    SIZE, PAD, GRID = 128, 14, 5
    CELL, RENDER, RX = (SIZE - 2 * PAD) // GRID, 17, 3

    h = hashlib.sha256(uid.encode()).hexdigest()
    bits = [int(c, 16) >= 8 for c in h[:15]]

    hue = int(h[15:19], 16) / 65536 * 360
    sat = 55 + int(h[19:21], 16) / 255 * 30   # 55–85 %
    lit = 50 + int(h[21:23], 16) / 255 * 15   # 50–65 %
    color = _hsl_to_hex(hue, sat, lit)

    rects = []
    for row in range(GRID):
        for col in range(GRID):
            mc = col if col <= 2 else 4 - col
            if bits[row * 3 + mc]:
                x = PAD + col * CELL
                y = PAD + row * CELL
                rects.append(
                    f'<rect x="{x}" y="{y}" width="{RENDER}" height="{RENDER}"'
                    f' rx="{RX}" fill="{color}"/>'
                )

    cx = cy = SIZE // 2
    clip_id = f'c{uid[:6]}'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}"'
        f' viewBox="0 0 {SIZE} {SIZE}" role="img" aria-label="avatar">'
        f'<defs><clipPath id="{clip_id}">'
        f'<circle cx="{cx}" cy="{cy}" r="{cx}"/></clipPath></defs>'
        f'<circle cx="{cx}" cy="{cy}" r="{cx}" fill="#0d1f16"/>'
        f'<g clip-path="url(#{clip_id})">' + ''.join(rects) + '</g>'
        f'</svg>'
    )


def ensure_avatar(uid: str) -> str:
    """Génère et enregistre l'avatar si absent. Retourne le chemin web."""
    AVATARS_DIR.mkdir(parents=True, exist_ok=True)
    path = AVATARS_DIR / f'{uid}.svg'
    if not path.exists():
        path.write_text(_generate_avatar_svg(uid), encoding='utf-8')
    return f'/avatars/{uid}.svg'


# ═══════════════════════════════════════════════════════════════════════════════
# Photo hero
# ═══════════════════════════════════════════════════════════════════════════════

def process_hero_photo() -> str | None:
    """Redimensionne / convertit la photo hero en 128×128 WebP. Retourne le chemin web."""
    PICS_OUT.mkdir(parents=True, exist_ok=True)
    for name in ('hero.png', 'hero.jpg', 'hero.jpeg', 'hero.webp'):
        src = PICS_DIR / name
        if not src.exists():
            continue
        dest = PICS_OUT / 'hero.webp'
        if HAS_PIL:
            img = Image.open(src).convert('RGBA')
            img = img.resize((128, 128), Image.LANCZOS)
            mask = Image.new('L', (128, 128), 0)
            ImageDraw.Draw(mask).ellipse([0, 0, 127, 127], fill=255)
            img.putalpha(mask)
            img.save(dest, 'WEBP', quality=85)
        else:
            shutil.copy2(src, PICS_OUT / src.name)
            dest = PICS_OUT / src.name
            print(f'  ⚠ Pillow absent — copie brute (pip install Pillow pour la conversion)')
        web_path = f'/pictures/{dest.name}'
        print(f'  ✓ photo hero → {dest.relative_to(REPO)}')
        return web_path
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# Chargement des parsers
# ═══════════════════════════════════════════════════════════════════════════════

def load_parsers() -> list[dict]:
    configs = []
    for path in sorted(PARSERS_DIR.glob('*.yaml')):
        with open(path, encoding='utf-8') as f:
            cfg = yaml.safe_load(f)
            cfg['_file'] = path.name
            configs.append(cfg)
    return configs


def detect_parser(text: str, parsers: list[dict]) -> dict | None:
    for cfg in parsers:
        if re.search(cfg['detect'], text):
            return cfg
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# Découpage du fichier en mains individuelles
# ═══════════════════════════════════════════════════════════════════════════════

def split_hands(text: str, cfg: dict) -> list[str]:
    pattern = re.compile(f'(?={cfg["hand_delimiter"]})', re.MULTILINE)
    parts = pattern.split(text)
    return [p.strip() for p in parts if p.strip() and re.search(cfg['detect'], p)]


# ═══════════════════════════════════════════════════════════════════════════════
# Hand ID déterministe
# ═══════════════════════════════════════════════════════════════════════════════

def make_hand_id(raw: str) -> str:
    return hashlib.sha256(raw.strip().encode('utf-8')).hexdigest()[:8]


# ═══════════════════════════════════════════════════════════════════════════════
# Parsing (piloted par le config YAML)
# ═══════════════════════════════════════════════════════════════════════════════

def parse_players(text: str, cfg: dict) -> list[dict]:
    pat = re.compile(cfg['patterns']['players'], re.MULTILINE)
    players = []
    for m in pat.finditer(text):
        g = m.groupdict()
        players.append({
            'name':      g['name'].strip(),
            'position':  g['position'].strip(),
            'stack_bb':  float(g.get('stack_bb') or 0),
            'vpip':      float(g['vpip'])      if g.get('vpip')      else -1,
            'pfr':       float(g['pfr'])       if g.get('pfr')       else -1,
            'three_bet': float(g['three_bet']) if g.get('three_bet') else -1,
            'hands':     int(g['hands'])       if g.get('hands')     else 0,
        })
    return players


def detect_hero(text: str, cfg: dict, hero_hint: str | None) -> str | None:
    """Détecte le hero. Le .hero sert d'indice prioritaire ; fallback sur les cartes."""
    pat = re.compile(cfg['patterns']['hero_cards'])
    m = pat.search(text)
    hh_hero = m.group('name').strip() if m else None

    if not hero_hint:
        return hh_hero

    players = parse_players(text, cfg)
    for p in players:
        if p['name'].lower() == hero_hint.lower():
            return p['name']

    if hh_hero:
        print(f'  ⚠ .hero "{hero_hint}" introuvable dans la main — détection auto : "{hh_hero}"')
    return hh_hero


def anonymize(text: str, players: list[dict], hero_name: str) -> tuple[str, dict]:
    """
    Remplace les pseudos réels par Hero / Villain1…N.
    Ordre des villains : position d'action pré-flop (UTG → BB).
    """
    pos_idx = {pos: i for i, pos in enumerate(POS_ORDER)}
    non_heroes = sorted(
        [p for p in players if p['name'] != hero_name],
        key=lambda p: pos_idx.get(p['position'], 99)
    )
    mapping = {hero_name: 'Hero'}
    for i, p in enumerate(non_heroes, 1):
        mapping[p['name']] = f'Villain{i}'

    result = text
    for orig in sorted(mapping, key=len, reverse=True):
        result = result.replace(orig, mapping[orig])
    return result, mapping


def extract_hero_cards(text: str, cfg: dict) -> str | None:
    m = re.search(cfg['patterns']['hero_cards'], text)
    return m.group('cards').strip() if m else None


def extract_hero_position(players: list[dict], hero_name: str) -> str | None:
    for p in players:
        if p['name'] == hero_name:
            return p['position']
    return None


def extract_streets(text: str, cfg: dict) -> list[str]:
    streets = ['preflop']
    for name in ('flop', 'turn', 'river'):
        if marker := cfg.get('streets', {}).get(name):
            if re.search(marker, text):
                streets.append(name)
    return streets


def extract_pot_type(text: str, cfg: dict) -> str:
    pf_pat = cfg.get('streets', {}).get('preflop', 'Pre Flop:')
    fl_pat = cfg.get('streets', {}).get('flop', 'Flop')
    pf_m = re.search(rf'{pf_pat}(.*?)(?={fl_pat}|\Z)', text, re.DOTALL)
    if not pf_m:
        return 'SRP'
    n = len(re.findall(cfg['patterns']['raise_action'], pf_m.group(1)))
    return {0: 'limped', 1: 'SRP', 2: '3bet pot', 3: '4bet pot'}.get(n, f'{n + 1}bet pot')


def extract_result(anon_text: str, cfg: dict) -> float:
    """Résultat net Hero en BB depuis le texte anonymisé."""
    h = r'Hero'
    pats = cfg['patterns']

    def _sum(pattern_key: str) -> float:
        return sum(
            float(m.group('amount'))
            for m in re.finditer(
                pats[pattern_key].replace('(?P<name>[^\\s,\\n]+)', h),
                anon_text
            )
        )

    posts    = _sum('post')
    calls    = _sum('call')
    bets     = _sum('bet')
    uncalled = _sum('uncalled_bet')

    wins_m = re.search(
        pats['wins'].replace('(?P<name>[^\\s,\\n]+)', h),
        anon_text
    )
    wins = float(wins_m.group('amount')) if wins_m else 0.0

    return round(wins - (posts + calls + bets - uncalled), 1)


def extract_hero_pf_actions(anon_text: str, cfg: dict) -> list[str]:
    """Actions pré-flop de Hero dans le texte anonymisé."""
    pf_pat = cfg.get('streets', {}).get('preflop', 'Pre Flop:')
    fl_pat = cfg.get('streets', {}).get('flop', 'Flop')
    pf_m = re.search(rf'{pf_pat}(.*?)(?={fl_pat}|\Z)', anon_text, re.DOTALL)
    if not pf_m:
        return []

    pf = pf_m.group(1)
    raise_count = 0
    actions = []
    parts = [p.strip() for chunk in pf.splitlines()
             for p in chunk.split(',') if p.strip()]

    for part in parts:
        if re.search(r'raises to [\d.]+ BB', part):
            raise_count += 1
            if part.startswith('Hero '):
                label = {1: 'open', 2: '3bet', 3: '4bet'}.get(raise_count, f'{raise_count + 1}bet')
                actions.append(label)
        elif part.startswith('Hero '):
            if re.search(r'calls [\d.]+ BB', part):
                actions.append('call')
            elif 'folds' in part or part == 'fold':
                actions.append('fold')
    return actions


def extract_limit(text: str) -> str | None:
    m = re.search(r'[€$£¥]?[\d.]+/[€$£¥]?([\d.]+)', text)
    if m:
        return f'NL{int(round(float(m.group(1)) * 100))}'
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# Formatage des cartes / slug / titre
# ═══════════════════════════════════════════════════════════════════════════════

def _fmt_card(card: str) -> str:
    return (card[:-1].upper() + SUIT_SYM.get(card[-1].lower(), card[-1])) if len(card) >= 2 else card


def fmt_hand(cards: str) -> str:
    return ' '.join(_fmt_card(c) for c in cards.split())


def cards_slug(cards: str) -> str:
    return cards.lower().replace(' ', '-') if cards else 'xx-xx'


def make_slug(cards: str, position: str, date: str, hand_id: str) -> str:
    pos = (position or 'unk').lower().replace('+', 'p')
    return f'{date}-{cards_slug(cards)}-{pos}-{hand_id}'


def make_title(cards: str, position: str, actions: list[str], limit: str) -> str:
    parts = [fmt_hand(cards)] if cards else []
    if position:
        parts.append(position)
    title = ' '.join(parts) or 'Review'
    desc = []
    if actions:
        desc.append(' + '.join(actions))
    if limit:
        desc.append(limit)
    return title + (' — ' + ', '.join(desc) if desc else '')


# ═══════════════════════════════════════════════════════════════════════════════
# Construction du frontmatter joueurs
# ═══════════════════════════════════════════════════════════════════════════════

def build_player_list(
    players_raw: list[dict],
    mapping: dict,
    hero_name: str,
    hero_avatar: str | None,
    db: dict,
) -> list[dict]:
    pos_idx = {pos: i for i, pos in enumerate(POS_ORDER)}
    hero_uid = get_or_create_uuid(db, hero_name)
    hero_av = hero_avatar or ensure_avatar(hero_uid)

    result = []
    for p in players_raw:
        is_hero = (p['name'] == hero_name)
        uid = get_or_create_uuid(db, p['name'])
        result.append({
            'label':     mapping.get(p['name'], p['name']),
            'position':  p['position'],
            'stack_bb':  p['stack_bb'],
            'is_hero':   is_hero,
            'avatar':    hero_av if is_hero else ensure_avatar(uid),
            'vpip':      -1 if is_hero else p['vpip'],
            'pfr':       -1 if is_hero else p['pfr'],
            'three_bet': -1 if is_hero else p['three_bet'],
            'hands':     0  if is_hero else p['hands'],
        })
    result.sort(key=lambda p: pos_idx.get(p['position'], 99))
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# Archive
# ═══════════════════════════════════════════════════════════════════════════════

def archive_src(src: Path, sub: str) -> Path:
    """Déplace src → archive/{sub}/YYYY-MM-DD/. Retourne le nouveau chemin."""
    today = datetime.now().strftime('%Y-%m-%d')
    dest_dir = ARCHIVE_DIR / sub / today
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name
    if dest.exists():
        dest = dest.with_stem(dest.stem + f'-{datetime.now().strftime("%H%M%S")}')
    shutil.move(str(src), str(dest))
    return dest


def archive_hand(raw: str, hand_id: str) -> str:
    """Archive une main individuelle. Retourne le chemin relatif au repo."""
    dest = ARCHIVE_DIR / 'txt' / f'{hand_id}.txt'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(raw, encoding='utf-8')
    return str(dest.relative_to(REPO))


def find_existing_review(hand_id: str) -> Path | None:
    for md in CONTENT_DIR.rglob('*.md'):
        if f'hand_id: "{hand_id}"' in md.read_text(encoding='utf-8', errors='ignore'):
            return md
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# Pipeline d'une main
# ═══════════════════════════════════════════════════════════════════════════════

def process_hand(
    raw: str,
    cfg: dict,
    hero_hint: str | None,
    db: dict,
    jinja_env,
    hero_avatar: str | None,
    dry_run: bool = False,
    force: bool = False,
) -> bool:

    hand_id = make_hand_id(raw)

    existing = find_existing_review(hand_id)
    if existing and not force:
        print(f'  ↩ {hand_id} déjà traité ({existing.name}) — skip (--force pour régénérer)')
        return False
    if existing and force:
        archive_src(existing, 'reviews')
        print(f'  ↩ Ancien .md archivé → archive/reviews/')

    players = parse_players(raw, cfg)
    if not players:
        print('  ✖ Aucun joueur trouvé', file=sys.stderr)
        return False

    hero_name = detect_hero(raw, cfg, hero_hint)
    if not hero_name:
        print('  ✖ Hero non détecté', file=sys.stderr)
        return False

    anon_text, mapping = anonymize(raw, players, hero_name)

    cards    = extract_hero_cards(raw, cfg)
    position = extract_hero_position(players, hero_name)
    streets  = extract_streets(raw, cfg)
    pot_type = extract_pot_type(raw, cfg)
    actions  = extract_hero_pf_actions(anon_text, cfg)
    result   = extract_result(anon_text, cfg)
    limit    = extract_limit(raw)

    date_str = datetime.now().strftime('%Y-%m-%d')
    slug     = make_slug(cards or 'xx-xx', position, date_str, hand_id)
    title    = make_title(cards, position, actions, limit)

    player_list = build_player_list(players, mapping, hero_name, hero_avatar, db)

    tags = ['holdem', 'no-limit', 'cash-game', 'PokerStars']
    if limit:
        tags.append(limit)
    tags.extend(actions)

    # Échapper les délimiteurs Jinja2 dans le contenu HH (précaution)
    safe_hh = (anon_text.strip()
               .replace('{%', '{ %').replace('%}', '% }')
               .replace('{{', '{ {').replace('}}', '} }'))

    src_archive = archive_hand(raw, hand_id) if not dry_run else f'archive/txt/{hand_id}.txt'

    meta = dict(
        title=title, date=date_str, hand_id=hand_id, slug=slug,
        tags=tags, limit=limit or '',
        hero_position=position or '', pot_type=pot_type,
        result_bb=result, source_archive=src_archive,
        table_size=len(players), players=player_list,
        streets=streets, extra_streets=streets[1:],
        hh_content=safe_hh,
    )

    print(f'  ✓ {slug}')
    for orig, label in sorted(mapping.items(), key=lambda x: (x[1] != 'Hero', x[1])):
        marker = ' ← Hero' if label == 'Hero' else ''
        print(f'    {orig:<28} → {label}{marker}')

    if not dry_run:
        tmpl = jinja_env.get_template('review.md.j2')
        content = tmpl.render(**meta)
        CONTENT_DIR.mkdir(parents=True, exist_ok=True)
        (CONTENT_DIR / f'{slug}.md').write_text(content, encoding='utf-8')

    return True


# ═══════════════════════════════════════════════════════════════════════════════
# Point d'entrée
# ═══════════════════════════════════════════════════════════════════════════════

def main() -> None:
    parser = argparse.ArgumentParser(
        description='Génère des reviews poker depuis hand histories PT4',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            'Exemples :\n'
            '  %(prog)s                   # traite txt/*.txt\n'
            '  %(prog)s session.txt       # cherche txt/session.txt\n'
            '  %(prog)s --dry-run         # simulation\n'
            '  %(prog)s --force session   # régénère même si déjà traité'
        )
    )
    parser.add_argument('fichier', nargs='?', help='Fichier .txt (cherché dans txt/ si nom simple)')
    parser.add_argument('--dry-run', '-n', action='store_true', help='Simulation sans écrire')
    parser.add_argument('--force',   '-f', action='store_true', help='Régénère les mains déjà traitées')
    args = parser.parse_args()

    jinja_env = Environment(
        loader=FileSystemLoader(str(TMPL_DIR)),
        trim_blocks=True, lstrip_blocks=True,
    )

    parsers = load_parsers()
    if not parsers:
        sys.exit(f'Aucun parser trouvé dans {PARSERS_DIR}')

    hero_hint = read_hero_name()
    if not hero_hint:
        print('⚠ .hero absent — le Hero sera détecté automatiquement')

    db = load_player_db()
    hero_avatar = process_hero_photo()

    if args.fichier:
        path = Path(args.fichier)
        if not path.is_absolute() and '/' not in args.fichier:
            path = TXT_DIR / args.fichier
        if not path.suffix:
            path = path.with_suffix('.txt')
        files = [path] if path.exists() else []
        if not files:
            sys.exit(f'Fichier introuvable : {path}')
    else:
        files = sorted(TXT_DIR.glob('*.txt'))

    if not files:
        sys.exit('Aucun fichier .txt trouvé dans txt/')

    total_ok = 0
    for fpath in files:
        print(f'\n📄 {fpath.name}')
        text = fpath.read_text(encoding='utf-8', errors='replace')
        cfg = detect_parser(text, parsers)
        if not cfg:
            print(f'  ⚠ Format non reconnu (parsers disponibles : '
                  f'{", ".join(p["name"] for p in parsers)}) — ignoré')
            continue
        print(f'  Format détecté : {cfg["name"]}')

        hands = split_hands(text, cfg)
        print(f'  {len(hands)} main(s) dans le fichier')

        for raw in hands:
            if process_hand(raw, cfg, hero_hint, db, jinja_env,
                            hero_avatar, args.dry_run, args.force):
                total_ok += 1

        if not args.dry_run:
            archive_src(fpath, 'txt')
            print(f'  → {fpath.name} archivé dans archive/txt/')

    if not args.dry_run:
        save_player_db(db)

    print(f'\n{"─" * 52}')
    prefix = '[dry-run] ' if args.dry_run else ''
    print(f'  {prefix}{total_ok} review(s) générée(s)\n')
    if total_ok and not args.dry_run:
        print('  Prochaines étapes :')
        print('  1. build_review.py  — finaliser le brouillon')
        print('  2. deploy.sh        — builder et déployer\n')


if __name__ == '__main__':
    main()
