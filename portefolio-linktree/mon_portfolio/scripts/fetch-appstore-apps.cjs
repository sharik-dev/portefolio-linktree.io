#!/usr/bin/env node
/**
 * Snapshot des apps publiées sur l'App Store par le compte développeur.
 *
 * Interroge l'API iTunes Lookup publique (aucune clé, aucune auth) pour l'artistId
 * du compte, dans les deux storefronts utilisés par le site (fr + us), et écrit
 * `src/data/appstoreSnapshot.json`.
 *
 * Ce snapshot est le FALLBACK embarqué dans le build : le site refait le même
 * appel à chaud (cf. src/data/appstoreApps.ts) et n'utilise le snapshot que si
 * le réseau/Apple ne répond pas. Le régénérer garde le rendu initial à jour.
 *
 *   npm run apps:sync        (lancé aussi automatiquement avant `npm run build`)
 */

const fs = require('fs');
const path = require('path');

const ARTIST_ID = process.env.APPLE_ARTIST_ID || '1816768480';
const STOREFRONTS = ['fr', 'us'];
const OUT = path.join(__dirname, '..', 'src', 'data', 'appstoreSnapshot.json');

// Champs conservés — le reste de la réponse iTunes est du bruit (100+ clés).
const KEEP = [
  'trackId', 'trackName', 'artistId', 'artistName', 'sellerName',
  'description', 'primaryGenreName', 'genres',
  'price', 'formattedPrice', 'currency',
  'averageUserRating', 'userRatingCount',
  'artworkUrl512', 'artworkUrl100',
  'screenshotUrls', 'ipadScreenshotUrls',
  'version', 'releaseDate', 'currentVersionReleaseDate',
  'trackViewUrl', 'minimumOsVersion',
];

function slim(app) {
  const out = {};
  for (const k of KEEP) if (app[k] !== undefined) out[k] = app[k];
  return out;
}

async function fetchStorefront(country) {
  const url =
    `https://itunes.apple.com/lookup?id=${ARTIST_ID}` +
    `&entity=software&country=${country}&limit=200`;
  const res = await fetch(url, { headers: { 'User-Agent': 'sharik.fr portfolio sync' } });
  if (!res.ok) throw new Error(`iTunes ${country} → HTTP ${res.status}`);
  const body = await res.json();
  return (body.results || [])
    .filter(r => r.wrapperType === 'software' || r.kind === 'software')
    .map(slim);
}

(async () => {
  const snapshot = { artistId: ARTIST_ID, generatedAt: new Date().toISOString(), storefronts: {} };

  for (const country of STOREFRONTS) {
    try {
      const apps = await fetchStorefront(country);
      snapshot.storefronts[country] = apps;
      console.log(`✓ ${country} — ${apps.length} apps`);
    } catch (err) {
      console.error(`✗ ${country} — ${err.message}`);
      // Storefront injoignable : on garde l'ancien contenu plutôt que de l'écraser.
      try {
        const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
        if (prev.storefronts?.[country]) {
          snapshot.storefronts[country] = prev.storefronts[country];
          console.log(`  → conservation du snapshot précédent (${prev.storefronts[country].length} apps)`);
        }
      } catch { /* pas de snapshot précédent */ }
    }
  }

  if (!Object.values(snapshot.storefronts).some(a => a && a.length)) {
    console.error('Aucune donnée récupérée et aucun snapshot précédent — abandon.');
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log(`→ ${path.relative(process.cwd(), OUT)}`);
})();
