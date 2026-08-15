#!/usr/bin/env bash
# Vérification périodique du compte développeur Apple.
#
# Le site interroge déjà Apple à chaud (cache 6 h côté visiteur) : une nouvelle app
# apparaît donc SANS redéploiement. Ce script sert au snapshot embarqué, celui qui
# s'affiche avant que le fetch réponde — il le régénère et ne rebuild/redéploie que
# si la liste d'apps a réellement changé.
#
# Installation (une fois) :
#   crontab -e
#   0 6 * * * /home/ubuntu/myProject/portefolio-linktree.io/portefolio-linktree/mon_portfolio/scripts/appstore-cron.sh >> /tmp/appstore-sync.log 2>&1
#
# Le déploiement écrit dans /var/www/sharik.fr (propriété www-data) : il passe par
# sudo rsync. Sans droit sudo non interactif, le script s'arrête après le build et
# le log le signale — le site reste correct, seul le snapshot embarqué attend le
# prochain déploiement manuel.

set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SNAPSHOT="$PROJECT_DIR/src/data/appstoreSnapshot.json"
WEB_ROOT="${WEB_ROOT:-/var/www/sharik.fr}"

cd "$PROJECT_DIR" || exit 1
echo "── $(date -Is) — sync App Store"

# Empreinte AVANT : la liste des apps, hors horodatage/notes qui bougent tout le temps.
fingerprint() {
  [ -f "$SNAPSHOT" ] || { echo "none"; return; }
  node -e '
    const s = require(process.argv[1]);
    const ids = Object.values(s.storefronts || {})
      .flat()
      .map(a => `${a.trackId}:${a.trackName}`)
      .sort();
    console.log([...new Set(ids)].join("|"));
  ' "$SNAPSHOT"
}

BEFORE="$(fingerprint)"
npm run --silent apps:sync || { echo "sync KO — on garde le snapshot en place"; exit 1; }
AFTER="$(fingerprint)"

if [ "$BEFORE" = "$AFTER" ]; then
  echo "aucun changement d'app — pas de rebuild"
  exit 0
fi

echo "changement détecté → rebuild"
npm run --silent build || { echo "build KO"; exit 1; }

if sudo -n true 2>/dev/null; then
  sudo rsync -a --delete --exclude CNAME "$PROJECT_DIR/dist/" "$WEB_ROOT/"
  echo "déployé dans $WEB_ROOT"
else
  echo "sudo non interactif indisponible — build prêt dans dist/, déploiement à faire à la main"
fi
