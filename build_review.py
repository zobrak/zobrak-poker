#!/usr/bin/env python3
"""
build_review.py — Gestionnaire interactif de reviews poker.

  n  Nouvelle review      → traite txt/*.txt via process_review.py
  l  Lister les reviews   → tableau : slug / draft / date / résultat
  a  Archiver / Dépublier → retire du site (draft:true + archive)
  m  Mettre à jour        → re-parse si source disponible dans archive/txt/
  q  Quitter
"""

import sys
import os
import re
import subprocess
import shutil
from datetime import datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML manquant : pip install PyYAML  (ou : source .venv/bin/activate)")

REPO        = Path(__file__).parent.resolve()
CONTENT_DIR = REPO / 'poker' / 'content' / 'review'
ARCHIVE_DIR = REPO / 'archive'
STATIC_DIR  = REPO / 'poker' / 'static'
TXT_DIR     = REPO / 'txt'

GREEN  = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN   = '\033[0;36m'
BOLD   = '\033[1m'
DIM    = '\033[2m'
RED    = '\033[0;31m'
NC     = '\033[0m'


# ═══════════════════════════════════════════════════════════════════════════════
# Frontmatter parsing
# ═══════════════════════════════════════════════════════════════════════════════

def parse_frontmatter(md_path: Path) -> dict:
    """Extrait le bloc YAML entre les deux '---'."""
    text = md_path.read_text(encoding='utf-8', errors='ignore')
    m = re.match(r'^---\n(.*?\n)---\n', text, re.DOTALL)
    if not m:
        return {}
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return {}


def set_draft(md_path: Path, draft: bool) -> None:
    """Modifie le champ draft: dans le frontmatter."""
    text = md_path.read_text(encoding='utf-8')
    value = 'true' if draft else 'false'
    new_text = re.sub(r'^(draft:\s*).*$', rf'\g<1>{value}', text, flags=re.MULTILINE)
    md_path.write_text(new_text, encoding='utf-8')


# ═══════════════════════════════════════════════════════════════════════════════
# Listing des reviews
# ═══════════════════════════════════════════════════════════════════════════════

def list_reviews() -> list[tuple[Path, dict]]:
    """Retourne [(path, frontmatter), ...] triés par date desc."""
    items = []
    for md in sorted(CONTENT_DIR.rglob('*.md'), reverse=True):
        fm = parse_frontmatter(md)
        if fm:
            items.append((md, fm))
    return items


def print_reviews(items: list[tuple[Path, dict]], show_idx: bool = True) -> None:
    if not items:
        print(f'  {YELLOW}Aucune review trouvée.{NC}')
        return

    hdr = f'  {"#":>3}  {"Slug":<42}  {"Draft":^5}  {"Date":^10}  {"Résultat":^8}  {"hand_id":^8}'
    print(f'\n{DIM}{hdr}{NC}')
    print(f'  {"─" * 85}')
    for i, (path, fm) in enumerate(items, 1):
        slug  = path.stem
        draft = fm.get('draft', True)
        date  = str(fm.get('date', '—'))[:10]
        res   = fm.get('params', {}).get('result_bb', '—')
        hid   = fm.get('hand_id', '—')
        res_s = f'{res:+}BB' if isinstance(res, (int, float)) else str(res)
        d_col = f'{YELLOW}true{NC}' if draft else f'{GREEN}false{NC}'
        idx   = f'{i:>3}' if show_idx else '   '
        print(f'  {idx}  {slug:<42}  {d_col}   {date:^10}  {res_s:^8}  {hid:^8}')
    print()


# ═══════════════════════════════════════════════════════════════════════════════
# Actions
# ═══════════════════════════════════════════════════════════════════════════════

def action_nouvelle() -> None:
    """Lance process_review.py sur txt/."""
    txt_files = list(TXT_DIR.glob('*.txt'))
    if not txt_files:
        print(f'\n  {YELLOW}⚠ Aucun fichier .txt dans txt/{NC}')
        print(f'  Déposez votre hand history dans txt/ puis relancez.\n')
        return
    print(f'\n  {DIM}{len(txt_files)} fichier(s) dans txt/ :{NC}')
    for f in txt_files:
        print(f'    • {f.name}')
    print()
    script = REPO / 'process_review.py'
    subprocess.run([sys.executable, str(script)], cwd=str(REPO))
    print()


def action_lister() -> None:
    items = list_reviews()
    print_reviews(items, show_idx=False)


def _select_review(prompt: str = 'Numéro') -> tuple[Path, dict] | None:
    items = list_reviews()
    if not items:
        print(f'\n  {YELLOW}Aucune review.{NC}\n')
        return None
    print_reviews(items)
    try:
        idx = int(input(f'  {BOLD}{prompt} [1-{len(items)}] :{NC} ').strip()) - 1
        if 0 <= idx < len(items):
            return items[idx]
    except (ValueError, EOFError):
        pass
    print(f'  {RED}Sélection invalide.{NC}\n')
    return None


def action_archiver() -> None:
    """Dépublie une review : draft:true + déplace MD + vidéo éventuelle."""
    sel = _select_review('Review à archiver')
    if not sel:
        return
    path, fm = sel

    print(f'\n  {YELLOW}Review sélectionnée :{NC} {path.stem}')
    confirm = input('  Confirmer l\'archivage ? [o/N] : ').strip().lower()
    if confirm != 'o':
        print('  Annulé.\n')
        return

    today = datetime.now().strftime('%Y-%m-%d')

    # Archiver la vidéo si liée
    video_url = fm.get('params', {}).get('video_url', '')
    if video_url:
        video_rel = video_url.lstrip('/')
        video_src = STATIC_DIR / video_rel
        if video_src.exists():
            vdest = ARCHIVE_DIR / 'videos' / today
            vdest.mkdir(parents=True, exist_ok=True)
            shutil.move(str(video_src), str(vdest / video_src.name))
            print(f'  ✓ Vidéo archivée → archive/videos/{today}/{video_src.name}')

    # Archiver le MD
    mdest = ARCHIVE_DIR / 'reviews' / today
    mdest.mkdir(parents=True, exist_ok=True)
    shutil.move(str(path), str(mdest / path.name))
    print(f'  ✓ Review archivée → archive/reviews/{today}/{path.name}')
    print(f'  {DIM}(Rebuild Hugo nécessaire pour refléter la dépublication){NC}\n')


def action_mettre_a_jour() -> None:
    """Re-parse une main si sa source est disponible dans archive/txt/."""
    sel = _select_review('Review à mettre à jour')
    if not sel:
        return
    path, fm = sel

    hand_id = fm.get('hand_id', '')
    src_archive = fm.get('params', {}).get('source_archive', '')

    archive_txt = REPO / src_archive if src_archive else None
    if not archive_txt or not archive_txt.exists():
        # Chercher par hand_id dans archive/txt/
        alt = ARCHIVE_DIR / 'txt' / f'{hand_id}.txt'
        if alt.exists():
            archive_txt = alt
        else:
            print(f'\n  {RED}✖ Source introuvable pour {hand_id}{NC}')
            print(f'  Déposez la hand history originale dans txt/ puis relancez.\n')
            return

    print(f'\n  {CYAN}Source trouvée :{NC} {archive_txt.relative_to(REPO)}')
    print(f'  {YELLOW}La review actuelle sera archivée et régénérée.{NC}')
    confirm = input('  Confirmer ? [o/N] : ').strip().lower()
    if confirm != 'o':
        print('  Annulé.\n')
        return

    # Copier la source dans txt/
    dest_txt = TXT_DIR / f'{hand_id}.txt'
    shutil.copy2(str(archive_txt), str(dest_txt))
    print(f'  ✓ Source copiée → txt/{hand_id}.txt')

    # Régénérer avec --force
    script = REPO / 'process_review.py'
    subprocess.run([sys.executable, str(script), str(dest_txt), '--force'], cwd=str(REPO))
    print()

    # Inviter à finaliser le brouillon
    new_mds = sorted(CONTENT_DIR.rglob(f'*{hand_id}*.md'), reverse=True)
    if new_mds:
        print(f'  {GREEN}Review régénérée :{NC} {new_mds[0].name}')
        print(f'  → Ouvrez ce fichier pour finaliser votre analyse.\n')


# ═══════════════════════════════════════════════════════════════════════════════
# Menu principal
# ═══════════════════════════════════════════════════════════════════════════════

BANNER = f"""{RED}
     ╔═══════════════════════════════════════════╗
     ║  ┌─────┐   ┌─────┐                       ║
     ║  │ A   │   │ A   │   ZobraK PokeR        ║
     ║  │  ♠  │   │  ♥  │                       ║
     ║  │   A │   │   A │   Review Manager      ║
     ║  └─────┘   └─────┘                       ║
     ╚═══════════════════════════════════════════╝
{NC}"""

MENU = f"""  {BOLD}Actions :{NC}
    {CYAN}n{NC}  Nouvelle review       (traite txt/*.txt)
    {CYAN}l{NC}  Lister les reviews
    {CYAN}a{NC}  Archiver / Dépublier
    {CYAN}m{NC}  Mettre à jour          (si source disponible)
    {CYAN}q{NC}  Quitter
"""


def main() -> None:
    print(BANNER)

    actions = {
        'n': action_nouvelle,
        'l': action_lister,
        'a': action_archiver,
        'm': action_mettre_a_jour,
    }

    while True:
        # Résumé rapide
        n_txt   = len(list(TXT_DIR.glob('*.txt')))
        n_rev   = len(list(CONTENT_DIR.rglob('*.md')))
        n_draft = sum(
            1 for md in CONTENT_DIR.rglob('*.md')
            if parse_frontmatter(md).get('draft', True)
        )
        print(f'  {DIM}txt/ : {n_txt} fichier(s) | reviews : {n_rev} ({n_draft} brouillon(s)){NC}\n')
        print(MENU)

        try:
            choice = input(f'  {BOLD}Choix :{NC} ').strip().lower()
        except (EOFError, KeyboardInterrupt):
            print('\n  Au revoir.\n')
            break

        if choice == 'q':
            print('\n  Au revoir.\n')
            break
        elif choice in actions:
            actions[choice]()
        else:
            print(f'  {RED}Choix invalide.{NC}\n')


if __name__ == '__main__':
    main()
