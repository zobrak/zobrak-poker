#!/bin/bash
# deploy.sh — Gestion & déploiement ZobraK Poker
# Usage : ./deploy.sh [--all] [--no-pull]
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
HUGO_DIR="$REPO_DIR/poker"
DEST="/var/www/poker"
BRANCH="main"
VIDEOS_SRC="$REPO_DIR/videos"
TXT_DIR="$REPO_DIR/txt"
RANGES_DIR="$REPO_DIR/ranges"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

ok()   { echo -e "  ${GREEN}✔${NC}  $*"; }
warn() { echo -e "  ${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "  ${RED}✖${NC}  $*"; exit 1; }
hdr()  { echo -e "\n${BOLD}  ▶ $*${NC}"; }

# ── Environnement Python ───────────────────────────────────────────────────────
VENV="$REPO_DIR/.venv"
if [[ -d "$VENV" ]]; then
    # shellcheck source=/dev/null
    source "$VENV/bin/activate" 2>/dev/null || true
fi
PYTHON="${VIRTUAL_ENV:+python}"; PYTHON="${PYTHON:-python3}"

# ── Vérification du fichier .hero ─────────────────────────────────────────────
ensure_hero() {
    local hero_file="$REPO_DIR/.hero"
    [[ -f "$hero_file" ]] && return
    echo ""
    warn "Fichier .hero introuvable."
    # En mode non-interactif (--all / pipe), on ne bloque pas
    if [[ ! -t 0 ]]; then
        warn "Mode non-interactif — .hero non créé. Lancez : echo 'VotrePseudo' > .hero"
        return
    fi
    read -rp "  ➤  Entrez votre pseudo exact sur PokerStars : " hero_name
    if [[ -z "$hero_name" ]]; then
        warn "Pseudo non renseigné — .hero non créé."
        return
    fi
    printf '%s\n' "$hero_name" > "$hero_file"
    ok "Créé → .hero : $hero_name"
}

# ── ASCII Art ──────────────────────────────────────────────────────────────────
show_banner() {
    echo -e "${RED}"
    cat << 'BANNER'
     ╔═══════════════════════════════════════════╗
     ║  ┌─────┐   ┌─────┐                       ║
     ║  │ A   │   │ A   │   ZobraK PokeR        ║
     ║  │  ♠  │   │  ♥  │                       ║
     ║  │   A │   │   A │   gestion &           ║
     ║  └─────┘   └─────┘   déploiement         ║
     ╚═══════════════════════════════════════════╝
BANNER
    echo -e "${NC}"
}

# ── Listing de fichiers ────────────────────────────────────────────────────────
list_dir() {
    local dir="$1" exts="$2"
    local files=()
    for ext in $exts; do
        while IFS= read -r f; do
            [[ -n "$f" ]] && files+=("$(basename "$f")")
        done < <(find "$dir" -maxdepth 1 -name "*.$ext" 2>/dev/null | sort)
    done
    if [[ ${#files[@]} -gt 0 ]]; then
        printf '%s\n' "${files[@]}"
    fi
}

# ── Actions ────────────────────────────────────────────────────────────────────

do_pull() {
    hdr "Git pull…"
    git -C "$REPO_DIR" fetch origin "$BRANCH"
    LOCAL=$(git -C "$REPO_DIR" rev-parse HEAD)
    REMOTE=$(git -C "$REPO_DIR" rev-parse "origin/$BRANCH")
    if [[ "$LOCAL" == "$REMOTE" ]]; then
        warn "Déjà à jour — redéploiement quand même."
    fi
    git -C "$REPO_DIR" pull origin "$BRANCH"
    ok "$(git -C "$REPO_DIR" log -1 --format='%h %s')"
}

do_build() {
    hdr "Build Hugo…"
    command -v hugo &>/dev/null || fail "hugo non trouvé (apt install hugo)"
    OUT=$(hugo -s "$HUGO_DIR" --minify --destination "$DEST" 2>&1)
    echo "$OUT" | grep -E "Pages|Total|Error" | sed 's/^/    /' || true
    echo "$OUT" | grep -qi "error" && fail "Erreur Hugo :\n$OUT"
    chown -R www-data:www-data "$DEST" 2>/dev/null || true
    chmod -R 755 "$DEST" 2>/dev/null || true
    ok "Build → $DEST"
}

do_videos() {
    hdr "Copie des vidéos…"
    if [[ ! -d "$VIDEOS_SRC" ]] || [[ -z "$(find "$VIDEOS_SRC" \( -name "*.webm" -o -name "*.mp4" -o -name "*.ogg" \) 2>/dev/null | head -1)" ]]; then
        warn "Aucune vidéo dans videos/"
        return
    fi
    mkdir -p "$DEST/videos"
    cp -r "$VIDEOS_SRC"/. "$DEST/videos/"
    chown -R www-data:www-data "$DEST/videos" 2>/dev/null || true
    ok "videos/ (avec sous-dossiers) → $DEST/videos/"
}

do_ranges() {
    hdr "Mise à jour des ranges…"
    mapfile -t rms < <(list_dir "$RANGES_DIR" "rm")
    if [[ ${#rms[@]} -eq 0 ]]; then
        warn "Aucun fichier .rm dans ranges/"
        return
    fi

    local chosen
    if [[ ${#rms[@]} -eq 1 ]]; then
        chosen="${rms[0]}"
        echo -e "  ${DIM}→ $(basename "$chosen")${NC}"
    else
        echo ""
        for i in "${!rms[@]}"; do
            echo "    $((i+1))  ${rms[$i]}"
        done
        echo -n "  Choix [1] : "
        read -r idx
        idx=${idx:-1}
        chosen="${rms[$((idx-1))]}"
    fi

    "$REPO_DIR/build_ranges.sh" "$RANGES_DIR/$chosen" --no-commit
}

do_reviews() {
    hdr "Génération reviews depuis txt/…"
    command -v "$PYTHON" &>/dev/null || { warn "python3 non trouvé"; return; }
    mapfile -t txts < <(list_dir "$TXT_DIR" "txt")
    if [[ ${#txts[@]} -eq 0 ]]; then
        warn "Aucun fichier .txt dans txt/ — utilisez build_review.py pour gérer les reviews"
        return
    fi
    "$PYTHON" "$REPO_DIR/process_review.py"
}

do_mime() {
    local SNIPPET="/etc/lighttpd/conf-available/99-mime-extra.conf"
    [[ -f "$SNIPPET" ]] && return
    cat > "$SNIPPET" << 'MIMEEOF'
# Types MIME supplémentaires
mimetype.assign += (
  ".webm"  => "video/webm",
  ".wasm"  => "application/wasm",
  ".avif"  => "image/avif",
  ".woff2" => "font/woff2"
)
MIMEEOF
    if [[ -d /etc/lighttpd/conf-enabled ]]; then
        ln -sf "$SNIPPET" /etc/lighttpd/conf-enabled/99-mime-extra.conf 2>/dev/null || true
    elif [[ -f /etc/lighttpd/lighttpd.conf ]]; then
        grep -q "99-mime-extra" /etc/lighttpd/lighttpd.conf \
            || echo 'include "/etc/lighttpd/conf-available/99-mime-extra.conf"' \
               >> /etc/lighttpd/lighttpd.conf 2>/dev/null || true
    fi
    ok "MIME types ajoutés (.webm → video/webm…)"
}

do_reload() {
    hdr "Lighttpd…"
    do_mime
    if systemctl is-active --quiet lighttpd 2>/dev/null; then
        service lighttpd force-reload
        ok "Lighttpd rechargé"
    else
        warn "Lighttpd non actif"
    fi
}

# ── Exécution d'une sélection ──────────────────────────────────────────────────
run_actions() {
    local sel="$1"
    declare -A run=()

    if [[ -z "$sel" ]]; then
        run=([1]=1 [2]=1 [3]=1 [4]=1 [5]=1 [6]=1)
    else
        for n in $sel; do run[$n]=1; done
    fi

    # Ordre logique : pull → ranges → reviews → build → vidéos → reload
    [[ ${run[1]:-} ]] && do_pull
    [[ ${run[4]:-} ]] && do_ranges
    [[ ${run[5]:-} ]] && do_reviews
    [[ ${run[2]:-} ]] && do_build
    [[ ${run[3]:-} ]] && do_videos
    [[ ${run[6]:-} ]] && do_reload

    echo ""
    echo -e "  ${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${BOLD}${GREEN}  ✔  Terminé${NC}"
    echo -e "  ${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# ── Menu interactif ────────────────────────────────────────────────────────────
show_menu() {
    local ranges txts videos commit
    mapfile -t _r < <(list_dir "$RANGES_DIR" "rm")
    mapfile -t _t < <(list_dir "$TXT_DIR" "txt")
    mapfile -t _v < <(list_dir "$VIDEOS_SRC" "webm mp4 ogg")

    local r_info="${#_r[@]} fichier(s)"; [[ ${#_r[@]} -gt 0 ]] && r_info+=" : ${_r[*]}"
    local t_info="${#_t[@]} fichier(s)"; [[ ${#_t[@]} -gt 0 ]] && t_info+=" : ${_t[*]}"
    local v_info="${#_v[@]} fichier(s)"; [[ ${#_v[@]} -gt 0 ]] && v_info+=" : ${_v[*]}"

    commit=$(git -C "$REPO_DIR" log -1 --format='%h %s' 2>/dev/null || echo '—')

    echo -e "  ${DIM}Dépôt  : $commit${NC}"
    echo ""
    echo -e "  ${CYAN}ranges/${NC}  $r_info"
    echo -e "  ${CYAN}txt/   ${NC}  $t_info"
    echo -e "  ${CYAN}videos/${NC}  $v_info"
    echo ""
    echo -e "  ${BOLD}Actions :${NC}"
    echo "    1  Git pull"
    echo "    2  Build Hugo → $DEST"
    echo "    3  Copier vidéos → $DEST/videos/"
    echo "    4  Mettre à jour ranges"
    echo "    5  Générer reviews depuis txt/"
    echo "    6  Recharger Lighttpd"
    echo ""
    echo -e -n "  ${BOLD}Sélection${NC} ${DIM}[Entrée = tout | ex: 1 2 6]${NC} : "
}

# ── Point d'entrée ─────────────────────────────────────────────────────────────
show_banner
ensure_hero

case "${1:-}" in
    --all)
        run_actions ""
        ;;
    --no-pull)
        run_actions "2 3 4 5 6"
        ;;
    *)
        # Non-interactif (pipe/redirection)
        if [[ ! -t 0 ]]; then
            run_actions ""
            exit 0
        fi
        show_menu
        read -r SELECTION
        run_actions "$SELECTION"
        ;;
esac
