#!/bin/bash
# deploy.sh — Déploiement du site ZobraK Poker
# Usage : ./deploy.sh [--no-pull]
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
HUGO_DIR="$REPO_DIR/poker"
DEST="/var/www/poker"
BRANCH="main"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✔${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✖${NC}  $*"; exit 1; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ZobraK Poker — déploiement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Git pull ───────────────────────────────────────────────────
if [[ "${1:-}" != "--no-pull" ]]; then
    echo ""
    echo "▶ Mise à jour du dépôt…"
    git -C "$REPO_DIR" fetch origin "$BRANCH"
    LOCAL=$(git -C "$REPO_DIR" rev-parse HEAD)
    REMOTE=$(git -C "$REPO_DIR" rev-parse "origin/$BRANCH")
    if [[ "$LOCAL" == "$REMOTE" ]]; then
        warn "Déjà à jour ($BRANCH). Redéploiement quand même."
    fi
    git -C "$REPO_DIR" pull origin "$BRANCH"
    ok "Dépôt mis à jour"
fi

# ── 2. Hugo build ─────────────────────────────────────────────────
echo ""
echo "▶ Build Hugo…"
command -v hugo &>/dev/null || fail "hugo non trouvé. Installer : apt install hugo"
BUILD_OUT=$(hugo -s "$HUGO_DIR" --minify --destination "$DEST" 2>&1)
echo "$BUILD_OUT" | grep -E "Pages|Total|Error" || true
echo "$BUILD_OUT" | grep -qi "error" && fail "Erreur Hugo :\n$BUILD_OUT"
ok "Build terminé"

# ── 3. Permissions ────────────────────────────────────────────────
echo ""
echo "▶ Permissions…"
chown -R www-data:www-data "$DEST"
chmod -R 755 "$DEST"
ok "Permissions appliquées"

# ── 4. MIME types Lighttpd (webm, wasm…) ─────────────────────────
echo ""
echo "▶ MIME types Lighttpd…"
LIGHTTPD_CONF=""
for f in /etc/lighttpd/lighttpd.conf /etc/lighttpd/conf-available/lighttpd.conf; do
    [[ -f "$f" ]] && LIGHTTPD_CONF="$f" && break
done

if [[ -n "$LIGHTTPD_CONF" ]]; then
    MIME_SNIPPET="/etc/lighttpd/conf-available/99-mime-extra.conf"
    if [[ ! -f "$MIME_SNIPPET" ]]; then
        cat > "$MIME_SNIPPET" << 'MIMEEOF'
# Types MIME supplémentaires
mimetype.assign += (
  ".webm" => "video/webm",
  ".wasm" => "application/wasm",
  ".avif" => "image/avif",
  ".woff2" => "font/woff2"
)
MIMEEOF
        # Activer le snippet si conf-enabled existe
        if [[ -d /etc/lighttpd/conf-enabled ]]; then
            ln -sf "$MIME_SNIPPET" /etc/lighttpd/conf-enabled/99-mime-extra.conf 2>/dev/null || true
        else
            # Inclure depuis le conf principal si pas déjà présent
            grep -q "99-mime-extra" "$LIGHTTPD_CONF" \
                || echo 'include "/etc/lighttpd/conf-available/99-mime-extra.conf"' >> "$LIGHTTPD_CONF"
        fi
        ok "MIME types ajoutés (webm, wasm, avif, woff2)"
    else
        ok "MIME types déjà configurés"
    fi
else
    warn "Fichier de conf Lighttpd non trouvé — ajouter manuellement : .webm => video/webm"
fi

# ── 5. Reload Lighttpd ────────────────────────────────────────────
echo ""
echo "▶ Rechargement Lighttpd…"
if systemctl is-active --quiet lighttpd; then
    service lighttpd force-reload
    ok "Lighttpd rechargé"
else
    warn "Lighttpd n'est pas actif"
fi

# ── 5. Résumé ─────────────────────────────────────────────────────
echo ""
COMMIT=$(git -C "$REPO_DIR" log -1 --format="%h %s")
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "Déployé : $COMMIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
