#!/bin/bash
# update-ranges.sh — Met à jour le fichier de ranges actif pour une limite donnée.
#
# Usage : ./update-ranges.sh <fichier.rm> <limite>
# Exemple : ./update-ranges.sh ~/Downloads/Ranges_new.rm NL2
#
# Ce que fait le script :
#   1. Copie <fichier.rm> → poker/static/data/ranges/ranges_<limite>.rm
#   2. Renomme l'ancien fichier actif en ranges_<limite>.old (sauvegarde)
#   3. Met à jour RM_FILE_URL dans ranges-ui.js
#   4. Affiche un résumé et propose de committer

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
RANGES_DIR="$REPO_DIR/poker/static/data/ranges"
RANGES_UI="$REPO_DIR/poker/assets/js/ranges-ui.js"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✔${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✖${NC}  $*"; exit 1; }

# ── Usage ─────────────────────────────────────────────────────────────────────
if [[ $# -lt 2 ]]; then
    echo ""
    echo "Usage : $0 <fichier.rm> <limite>"
    echo ""
    echo "  <fichier.rm>  Chemin vers le nouveau fichier Range Manager"
    echo "  <limite>      Identifiant de la limite (ex: NL2, NL5, NL10)"
    echo ""
    echo "Exemples :"
    echo "  $0 ~/Downloads/Ranges_NL2_v4.rm NL2"
    echo "  $0 /tmp/ranges_new.rm NL5"
    echo ""
    exit 1
fi

SOURCE_FILE="$1"
LIMIT="$2"
TARGET_NAME="ranges_${LIMIT}.rm"
TARGET_PATH="$RANGES_DIR/$TARGET_NAME"
BACKUP_NAME="ranges_${LIMIT}.old"
BACKUP_PATH="$RANGES_DIR/$BACKUP_NAME"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ZobraK Poker — mise à jour des ranges"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Vérifications ─────────────────────────────────────────────────────────────
[[ -f "$SOURCE_FILE" ]] || fail "Fichier source introuvable : $SOURCE_FILE"
[[ -f "$RANGES_UI" ]]   || fail "ranges-ui.js introuvable : $RANGES_UI"
[[ -d "$RANGES_DIR" ]]  || fail "Dossier ranges introuvable : $RANGES_DIR"

# Vérifier que le fichier source est du JSON valide
if command -v python3 &>/dev/null; then
    python3 -c "import json,sys; json.load(open('$SOURCE_FILE'))" 2>/dev/null \
        || warn "Le fichier source ne semble pas être du JSON valide — poursuite quand même."
fi

echo "  Source   : $SOURCE_FILE"
echo "  Limite   : $LIMIT"
echo "  Cible    : $TARGET_NAME"
echo "  Backup   : $BACKUP_NAME"
echo ""

# ── 1. Sauvegarde de l'ancien fichier ─────────────────────────────────────────
echo "▶ Sauvegarde de l'ancien fichier…"
if [[ -f "$TARGET_PATH" ]]; then
    mv "$TARGET_PATH" "$BACKUP_PATH"
    ok "Ancien fichier sauvegardé → $BACKUP_NAME"
else
    warn "Aucun fichier actif trouvé pour $LIMIT (pas de sauvegarde)"
fi

# ── 2. Copie du nouveau fichier ────────────────────────────────────────────────
echo ""
echo "▶ Copie du nouveau fichier…"
cp "$SOURCE_FILE" "$TARGET_PATH"
ok "Fichier copié → $TARGET_NAME"

# ── 3. Mise à jour de ranges-ui.js ────────────────────────────────────────────
echo ""
echo "▶ Mise à jour de ranges-ui.js…"
NEW_URL="/data/ranges/$TARGET_NAME"

# Remplace la ligne RM_FILE_URL quelle que soit la valeur actuelle
if grep -q "RM_FILE_URL" "$RANGES_UI"; then
    # Compatible macOS (BSD sed) et Linux (GNU sed)
    if sed --version &>/dev/null 2>&1; then
        # GNU sed
        sed -i "s|var RM_FILE_URL = '[^']*';|var RM_FILE_URL = '$NEW_URL';|" "$RANGES_UI"
    else
        # BSD sed (macOS)
        sed -i '' "s|var RM_FILE_URL = '[^']*';|var RM_FILE_URL = '$NEW_URL';|" "$RANGES_UI"
    fi
    ok "RM_FILE_URL → $NEW_URL"
else
    fail "Variable RM_FILE_URL introuvable dans ranges-ui.js"
fi

# ── 4. Résumé ─────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "Ranges $LIMIT mises à jour"
echo ""
echo "  Nouveau fichier actif : $TARGET_NAME"
[[ -f "$BACKUP_PATH" ]] && echo "  Sauvegarde            : $BACKUP_NAME"
echo ""

# ── 5. Proposition de commit ──────────────────────────────────────────────────
read -rp "Committer et pousser maintenant ? [o/N] " REPLY
echo ""

if [[ "${REPLY,,}" == "o" ]]; then
    cd "$REPO_DIR"
    git add "$TARGET_PATH" "$RANGES_UI"
    [[ -f "$BACKUP_PATH" ]] && git add "$BACKUP_PATH"
    git commit -m "Ranges: mise à jour ${LIMIT} ($(basename "$SOURCE_FILE") → $TARGET_NAME)"
    git push origin main
    echo ""
    ok "Commité et poussé. Lancer ./deploy.sh sur le serveur pour déployer."
else
    echo "  Fichiers modifiés non commités :"
    echo "    git add $TARGET_PATH $RANGES_UI"
    [[ -f "$BACKUP_PATH" ]] && echo "          $BACKUP_PATH"
    echo "    git commit -m \"Ranges: mise à jour $LIMIT\""
    echo "    git push origin main"
fi

echo ""
