#!/bin/bash
# build_ranges.sh — Installe un fichier de ranges dans le site.
#
# Usage :
#   ./build_ranges.sh                    # sélection interactive dans ranges/
#   ./build_ranges.sh NL2.rm            # cherche ranges/NL2.rm
#   ./build_ranges.sh /chemin/exact.rm  # chemin complet
#   ./build_ranges.sh NL2.rm --no-commit
#   ./build_ranges.sh NL2.rm NL2        # forcer la limite (évite la détection)

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
RANGES_SRC_DIR="$REPO_DIR/ranges"
RANGES_DEST_DIR="$REPO_DIR/poker/static/data/ranges"
RANGES_UI="$REPO_DIR/poker/assets/js/ranges-ui.js"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✖${NC}  $*"; exit 1; }

NO_COMMIT=false
SOURCE_FILE=""
FORCED_LIMIT=""

# ── Parse arguments ────────────────────────────────────────────────────────────
for arg in "$@"; do
    case "$arg" in
        --no-commit) NO_COMMIT=true ;;
        --*)         warn "Option inconnue : $arg" ;;
        *.rm)
            if [[ -z "$SOURCE_FILE" ]]; then
                # Résolution implicite : nom seul → cherche dans ranges/
                if [[ "$arg" != */* && "$arg" != /* ]]; then
                    SOURCE_FILE="$RANGES_SRC_DIR/$arg"
                else
                    SOURCE_FILE="$arg"
                fi
            fi
            ;;
        NL*|PLO*|nl*|plo*)
            FORCED_LIMIT="${arg^^}"
            ;;
    esac
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ZobraK Poker — mise à jour des ranges"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Sélection interactive si aucun fichier fourni ─────────────────────────────
if [[ -z "$SOURCE_FILE" ]]; then
    mapfile -t available < <(find "$RANGES_SRC_DIR" -maxdepth 1 -name "*.rm" 2>/dev/null | sort)

    if [[ ${#available[@]} -eq 0 ]]; then
        fail "Aucun fichier .rm dans ranges/ — placer le fichier dans ce dossier."
    elif [[ ${#available[@]} -eq 1 ]]; then
        SOURCE_FILE="${available[0]}"
        echo "  Fichier : $(basename "$SOURCE_FILE")"
    else
        echo "  Fichiers disponibles dans ranges/ :"
        for i in "${!available[@]}"; do
            echo "    $((i+1))  $(basename "${available[$i]}")"
        done
        echo -n "  Choix [1] : "
        read -r idx
        idx=${idx:-1}
        SOURCE_FILE="${available[$((idx-1))]}"
    fi
fi

# ── Vérifications ──────────────────────────────────────────────────────────────
[[ -f "$SOURCE_FILE" ]] || fail "Fichier introuvable : $SOURCE_FILE"
[[ -f "$RANGES_UI" ]]   || fail "ranges-ui.js introuvable : $RANGES_UI"

# Validation JSON
if command -v python3 &>/dev/null; then
    python3 -c "import json,sys; json.load(open('$SOURCE_FILE'))" 2>/dev/null \
        || warn "Le fichier ne semble pas être du JSON valide — poursuite quand même."
fi

# ── Détection de la limite ─────────────────────────────────────────────────────
if [[ -z "$FORCED_LIMIT" ]]; then
    LIMIT=$(basename "$SOURCE_FILE" | grep -oiE 'NL[0-9]+|PLO[0-9]+' | head -1 | tr '[:lower:]' '[:upper:]')
    if [[ -z "$LIMIT" ]]; then
        echo -n "  Limite (ex: NL2, NL5) : "
        read -r LIMIT
        LIMIT="${LIMIT^^}"
    fi
else
    LIMIT="$FORCED_LIMIT"
fi

TARGET_NAME="ranges_${LIMIT}.rm"
TARGET_PATH="$RANGES_DEST_DIR/$TARGET_NAME"
BACKUP_PATH="$RANGES_DEST_DIR/ranges_${LIMIT}.old"

echo "  Source  : $(basename "$SOURCE_FILE")"
echo "  Limite  : $LIMIT"
echo "  Cible   : $TARGET_NAME"
echo ""

# ── 1. Sauvegarde ──────────────────────────────────────────────────────────────
if [[ -f "$TARGET_PATH" ]]; then
    mv "$TARGET_PATH" "$BACKUP_PATH"
    ok "Sauvegarde → ranges_${LIMIT}.old"
fi

# ── 2. Copie ───────────────────────────────────────────────────────────────────
mkdir -p "$RANGES_DEST_DIR"
cp "$SOURCE_FILE" "$TARGET_PATH"
ok "Copié → $TARGET_NAME"

# ── 3. Mise à jour ranges-ui.js ────────────────────────────────────────────────
NEW_URL="/data/ranges/$TARGET_NAME"
if sed --version &>/dev/null 2>&1; then
    sed -i "s|var RM_FILE_URL = '[^']*';|var RM_FILE_URL = '$NEW_URL';|" "$RANGES_UI"
else
    sed -i '' "s|var RM_FILE_URL = '[^']*';|var RM_FILE_URL = '$NEW_URL';|" "$RANGES_UI"
fi
ok "RM_FILE_URL → $NEW_URL"

# ── 4. Commit optionnel ────────────────────────────────────────────────────────
echo ""
if $NO_COMMIT; then
    echo "  (--no-commit : pas de commit automatique)"
    exit 0
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "Ranges $LIMIT installées"
echo ""
read -rp "Committer et pousser ? [o/N] " REPLY
echo ""

if [[ "${REPLY,,}" == "o" ]]; then
    cd "$REPO_DIR"
    git add "$TARGET_PATH" "$RANGES_UI"
    [[ -f "$BACKUP_PATH" ]] && git add "$BACKUP_PATH"
    git commit -m "Ranges: mise à jour ${LIMIT} → $TARGET_NAME"
    git push origin main
    echo ""
    ok "Poussé. Lancer ./deploy.sh sur le serveur pour déployer."
else
    echo "  Fichiers non commités :"
    echo "    git add $TARGET_PATH $RANGES_UI"
    [[ -f "$BACKUP_PATH" ]] && echo "          $BACKUP_PATH"
fi
echo ""
