#!/usr/bin/env node
/**
 * Apps PAS ENCORE publiées : celles qui attendent la revue Apple, et celles
 * dont la fiche est prête mais pas encore soumise.
 *
 * L'API iTunes publique (fetch-appstore-apps.cjs) ne voit que ce qui est en
 * ligne. Ce script interroge App Store Connect avec la clé .p8 du compte et
 * écrit `src/data/ascPending.json` : nom, sous-titre, description (fr + en),
 * état, icône et captures de la fiche en préparation.
 *
 *   npm run apps:pending
 *
 * Mac de dev uniquement : la clé est lue dans ~/.config/ios-testflight-cicd/
 * (jamais copiée dans le dépôt). Sans clé, le script s'arrête sans toucher au
 * JSON — le build du VPS garde donc la dernière liste versionnée.
 *
 * Une app qui passe en ligne sort d'elle-même : le site masque toute entrée
 * dont le trackId apparaît dans la réponse iTunes.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const OUT = path.join(__dirname, '..', 'src', 'data', 'ascPending.json');
const CONFIG = path.join(os.homedir(), '.config', 'ios-testflight-cicd', 'config.env');
const LOCALES = { fr: ['fr-FR', 'fr-CA'], en: ['en-US', 'en-GB'] };

/** États App Store Connect → ce que le portfolio affiche. Un refus reste « en développement ». */
const REVIEW = new Set(['WAITING_FOR_REVIEW', 'IN_REVIEW', 'PENDING_DEVELOPER_RELEASE', 'PENDING_APPLE_RELEASE', 'PROCESSING_FOR_DISTRIBUTION', 'READY_FOR_REVIEW', 'ACCEPTED']);
const LIVE = new Set(['READY_FOR_DISTRIBUTION', 'READY_FOR_SALE']);

function readConfig() {
  if (!fs.existsSync(CONFIG)) return null;
  const env = {};
  for (const line of fs.readFileSync(CONFIG, 'utf8').split('\n')) {
    const m = line.match(/^(?:export )?([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env.ASC_KEY_ID && env.ASC_ISSUER_ID && env.ASC_KEY_P8_PATH ? env : null;
}

function token(env) {
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'ES256', kid: env.ASC_KEY_ID, typ: 'JWT' });
  const body = b64({ iss: env.ASC_ISSUER_ID, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' });
  const keyPath = env.ASC_KEY_P8_PATH.replace(/^~|^\$HOME/, os.homedir());
  const sig = crypto.sign('sha256', Buffer.from(`${head}.${body}`), { key: fs.readFileSync(keyPath, 'utf8'), dsaEncoding: 'ieee-p1363' });
  return `${head}.${body}.${sig.toString('base64url')}`;
}

(async () => {
  const env = readConfig();
  if (!env) {
    console.error('Clé App Store Connect introuvable — ascPending.json laissé tel quel.');
    process.exit(0);
  }
  const auth = { Authorization: `Bearer ${token(env)}` };
  const get = async p => {
    const res = await fetch(`https://api.appstoreconnect.apple.com${p}`, { headers: auth });
    if (!res.ok) throw new Error(`ASC ${p.split('?')[0]} → HTTP ${res.status}`);
    return res.json();
  };
  const pick = (byLocale, lang) => LOCALES[lang].map(l => byLocale[l]).find(Boolean);
  /** `{w}x{h}bb.{f}` → URL publique du CDN, bornée à `box` px. */
  const cdn = (asset, box) => asset?.templateUrl
    ? asset.templateUrl.replace('{w}', box).replace('{h}', box).replace('{f}', 'webp')
    : undefined;

  const apps = (await get('/v1/apps?limit=200&fields[apps]=name,bundleId')).data;
  const pending = [];

  for (const app of apps) {
    const versions = (await get(`/v1/apps/${app.id}/appStoreVersions?limit=10&fields[appStoreVersions]=versionString,appStoreState,appVersionState,createdDate`)).data;
    const state = v => v.attributes.appVersionState || v.attributes.appStoreState;
    if (!versions.length || versions.some(v => LIVE.has(state(v)))) continue;   // déjà en ligne → iTunes s'en charge
    const version = versions[0];

    const infos = await get(`/v1/apps/${app.id}/appInfos?include=appInfoLocalizations,primaryCategory&limit[appInfoLocalizations]=50`);
    const infoByLocale = {};
    for (const inc of infos.included || []) {
      if (inc.type === 'appInfoLocalizations') infoByLocale[inc.attributes.locale] = inc.attributes;
    }
    const category = (infos.included || []).find(i => i.type === 'appCategories')?.id;

    const locs = (await get(`/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations?limit=50`)).data;
    const descByLocale = Object.fromEntries(locs.map(l => [l.attributes.locale, l]));

    const text = field => {
      const fr = pick(infoByLocale, 'fr')?.[field];
      const en = pick(infoByLocale, 'en')?.[field];
      return fr || en ? { fr: fr || en, en: en || fr } : undefined;
    };
    const desc = lang => pick(descByLocale, lang)?.attributes.description || '';
    const description = desc('fr') || desc('en') ? { fr: desc('fr') || desc('en'), en: desc('en') || desc('fr') } : undefined;

    // Fiche vide (app créée mais jamais remplie) : rien à montrer.
    if (!description && !text('subtitle')) continue;

    // Captures de la fiche, par langue et par famille d'appareil.
    const screenshots = {};
    for (const lang of ['fr', 'en']) {
      const loc = pick(descByLocale, lang) || pick(descByLocale, lang === 'fr' ? 'en' : 'fr');
      if (!loc) continue;
      const sets = await get(`/v1/appStoreVersionLocalizations/${loc.id}/appScreenshotSets?include=appScreenshots&limit[appScreenshots]=10&fields[appScreenshots]=imageAsset,assetDeliveryState`);
      const shotById = new Map((sets.included || []).map(s => [s.id, s]));
      for (const set of sets.data) {
        const device = /IPAD/.test(set.attributes.screenshotDisplayType) ? 'ipad' : /IPHONE/.test(set.attributes.screenshotDisplayType) ? 'iphone' : null;
        if (!device) continue;
        const urls = (set.relationships.appScreenshots?.data || [])
          .map(ref => cdn(shotById.get(ref.id)?.attributes.imageAsset, 1400))
          .filter(Boolean);
        screenshots[device] = screenshots[device] || {};
        // Plusieurs tailles d'iPhone peuvent exister : on garde le jeu le plus fourni.
        if (urls.length > (screenshots[device][lang]?.length || 0)) screenshots[device][lang] = urls;
      }
    }

    const builds = await get(`/v1/builds?filter[app]=${app.id}&limit=1&sort=-uploadedDate&fields[builds]=iconAssetToken`);
    const icon = cdn(builds.data[0]?.attributes.iconAssetToken, 512);

    pending.push({
      trackId: Number(app.id),
      bundleId: app.attributes.bundleId,
      status: REVIEW.has(state(version)) ? 'review' : 'dev',
      submittedAt: version.attributes.createdDate,
      name: text('name') || { fr: app.attributes.name, en: app.attributes.name },
      subtitle: text('subtitle'),
      description,
      category,
      icon,
      screenshots,
    });
    console.log(`✓ ${app.attributes.name} — ${state(version)}`);
  }

  pending.sort((a, b) => (a.status === b.status ? 0 : a.status === 'review' ? -1 : 1) || String(b.submittedAt).localeCompare(String(a.submittedAt)));
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), apps: pending }, null, 2) + '\n');
  console.log(`→ ${pending.length} app(s) en attente : ${path.relative(process.cwd(), OUT)}`);
})().catch(err => {
  console.error(`✗ ${err.message} — ascPending.json laissé tel quel.`);
  process.exit(0);
});
