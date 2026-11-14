#!/usr/bin/env node
/**
 * Captures affichées dans l'iPhone / l'iPad 3D du portfolio.
 *
 * Les captures de l'App Store sont des visuels MARKETING (texte + téléphone
 * incliné) : posées sur l'écran d'un téléphone 3D, elles donnent un téléphone
 * dans un téléphone. Ce script va donc chercher les captures BRUTES de chaque
 * app là où son projet les range (fastlane, shotsmith, Design/…), les convertit
 * en WebP et écrit :
 *
 *   public/shots/<id>/<device>-<lang>-<n>.webp   les images servies par le site
 *   public/shots/<id>/icon.webp                  l'icône (apps pas encore sur l'App Store)
 *   src/data/deviceShots.json                    l'index lu par appstoreApps.ts
 *
 *   npm run shots:sync              tout régénérer
 *   npm run shots:sync -- salat     une seule app
 *
 * Mac de dev uniquement : les sources vivent dans ~/Documents. Une source
 * absente n'efface rien — l'entrée précédente de deviceShots.json est gardée —
 * donc le build du VPS (qui n'a pas ces dossiers) n'est pas concerné : les WebP
 * sont versionnés.
 *
 * Une app publiée qui n'est PAS listée ici n'est pas cassée pour autant : le
 * site retombe sur ses captures App Store, en haute résolution.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const DOCS = path.join(os.homedir(), 'Documents');
const PROJECT = path.join(__dirname, '..');
const OUT_DIR = path.join(PROJECT, 'public', 'shots');
const OUT_JSON = path.join(PROJECT, 'src', 'data', 'deviceShots.json');
/** Captures faites à la main (jeux Godot jamais soumis) — dossier git-ignoré. */
const LOCAL_SRC = path.join(PROJECT, '.shots-src');

const MAX_SIDE = 1800;   // plus grand côté, en pixels (jamais agrandi)
const QUALITY = 80;
const ICON_SIDE = 256;

/** Les mêmes fichiers dans deux dossiers de langue. */
const both = (files, en, fr) => ({
  en: files.map(f => `${en}/${f}`),
  fr: files.map(f => `${fr}/${f}`),
});

/**
 * id → { root, icon?, iphone?, ipad? }
 * `root` est relatif à ~/Documents (ou absolu). Chaque appareil donne une liste
 * par langue ; une seule langue suffit, l'autre retombe dessus côté site.
 * Un élément peut être `{ file, crop: [x, y, w, h] }` pour extraire l'écran
 * d'un visuel marketing quand aucune capture brute n'existe.
 */
const APPS = {
  /* ── Publiées ─────────────────────────────────────────────────── */
  meowtube: {
    root: 'IOS/no short video/No short video/store-screenshots/raw',
    iphone: {
      en: ['home_en.png', 'watch_en.png', 'music_en.png', 'library_en.png'],
      fr: ['home_fr.png', 'watch_fr.png', 'music_fr.png', 'library_fr.png'],
    },
  },
  'islamic-daily-quote': {
    root: 'IOS/Islam-Quote/marketing/public/screenshots/en',
    iphone: { en: ['home.png', 'history.png'] },
  },
  'easy-gym': {
    root: 'IOS/easyGym/app-store-screenshots/public/screenshots',
    iphone: both(['promax-01-home.png', 'promax-02-quete.png', 'promax-03-seance.png', 'promax-04-profil.png'], 'en', 'fr'),
  },
  'jeu-de-point': {
    root: 'IOS/jeu de point/fastlane/screenshots/fr-FR',
    iphone: { fr: ['iPhone 17 Pro Max-01_Menu.png', 'iPhone 17 Pro Max-02_Game.png'] },
  },
  vocabulary: {
    root: 'IOS/vocabulary/marketing/assets',
    iphone: { fr: ['iphone/03_aujourdhui.png', 'iphone/02_widgets.png', 'iphone/04_progres.png', 'iphone/06_homewidget.png'] },
    ipad: { fr: ['ipad/03_aujourdhui.png', 'ipad/04_progres.png', 'ipad/02_widgets.png'] },
  },
  'strategic-wars': {
    root: 'godotGame/pixelGame/advance wars/app-store-screenshots/raw',
    iphone: { en: ['03_battle.png', '02_world.png', '01_home.png', '06_units.png'] },
  },
  duobook: {
    root: 'IOS/DuoBook/marketing/raw',
    iphone: both(['iPhone 17 Pro Max-01_Home.png', 'iPhone 17 Pro Max-03_Statistics.png', 'iPhone 17 Pro Max-04_Profile.png'], 'en-US', 'fr-FR'),
    ipad: both(['iPad Pro 13-inch (M5)-01_Home.png', 'iPad Pro 13-inch (M5)-03_Statistics.png'], 'en-US', 'fr-FR'),
  },
  salat: {
    // Captures de la refonte (14/11/2026). 3_quran.png écarté exprès : son fond
    // vient de Pinterest, droits non réglés (QURAN_BACKGROUNDS.md du dépôt Salat).
    root: 'IOS/Salat/fastlane/screenshots_raw/portfolio',
    iphone: both(['1_learn.png', '2_step.png', '4_memorize.png'], 'en-US', 'fr-FR'),
  },
  salsa: {
    root: 'IOS/salsa/marketing/raw',
    iphone: {
      en: ['en-1-home.png', 'en-2-play.png', 'en-3-figure.png', 'en-4-wiki.png'],
      fr: ['fr-1-home.png', 'fr-2-play.png', 'fr-3-figure.png', 'fr-4-wiki.png'],
    },
  },
  wordiko: {
    root: 'IOS/GamifyLearningEnglish/Design/store/raw',
    iphone: both(['1_spy.png', '2_piano.png', '3_bee.png', '4_connect.png'], 'en-US', 'fr-FR'),
  },
  terrafocus: {
    // Pas de capture brute : on extrait l'écran du visuel marketing (téléphone à plat).
    root: 'godotGame/TerraFocus/fastlane/screenshots',
    iphone: {
      en: ['01-focus', '02-task', '03-rhythm'].map(n => ({ file: `en-US/${n}-1290x2796.png`, crop: [184, 838, 922, 1958] })),
      fr: ['01-focus', '02-task', '03-rhythm'].map(n => ({ file: `fr-FR/${n}-1290x2796.png`, crop: [184, 838, 922, 1958] })),
    },
  },

  /* ── En attente de revue App Store ────────────────────────────── */
  'flight-advisor': {
    root: 'IOS/SelfTransfer',
    icon: 'SelfTransfer/Assets.xcassets/AppIcon.appiconset/AppIcon.png',
    iphone: both(['journey.png', 'offers.png', 'map.png', 'tickets.png'], 'Design/screenshots/raw/en', 'Design/screenshots/raw/fr'),
  },
  'lenas-phone': {
    root: 'IOS/LenasPhone',
    icon: 'LenasPhone/Assets.xcassets/AppIcon.appiconset/AppIcon.png',
    iphone: both(['01_lock.png', '04_maya.png', '03_kidnapper.png', '08_board.png'], 'fastlane/screenshots/en-US', 'fastlane/screenshots/fr-FR'),
  },
  'draw-your-family': {
    root: 'IOS/DoodleNest',
    icon: 'DoodleNest/Assets.xcassets/AppIcon.appiconset/icon.png',
    iphone: both(['wall.png', 'studio.png', 'gallery.png', 'garden.png'], 'Design/screenshots/raw/iphone/en', 'Design/screenshots/raw/iphone/fr'),
    ipad: both(['aquarium.png', 'gallery.png', 'wall.png'], 'Design/screenshots/raw/ipad/en', 'Design/screenshots/raw/ipad/fr'),
  },
  'block-gallery': {
    root: 'IOS/BlockGallery',
    icon: 'BlockGallery/Resources/Assets.xcassets/AppIcon.appiconset/icon.png',
    iphone: both(['01_iphone69.png', '02_iphone69.png', '03_iphone69.png', '04_iphone69.png'], 'fastlane/screenshots/en-US', 'fastlane/screenshots/fr-FR'),
    ipad: both(['01_iphone69_ipad.png', '03_iphone69_ipad.png', '02_iphone69_ipad.png'], 'fastlane/screenshots/en-US', 'fastlane/screenshots/fr-FR'),
  },
  'tornado-worlds': {
    root: 'godotGame/tornado',
    icon: 'icon.png',
    iphone: both(['title.png', 'farm.png', 'rivals.png', 'mill.png'], 'app-store-screenshots/raw/iphone/en', 'app-store-screenshots/raw/iphone/fr'),
    ipad: both(['barn.png', 'combo.png', 'title.png'], 'app-store-screenshots/raw/ipad/en', 'app-store-screenshots/raw/ipad/fr'),
  },

  /* ── En développement ─────────────────────────────────────────── */
  empire: {
    root: 'godotGame/calculcard',
    icon: 'icon.png',
    iphone: both(['1_battle.png', '3_title.png', '4_campaign.png', '2_reward.png'], 'fastlane/screenshots/en-US', 'fastlane/screenshots/fr-FR'),
    ipad: both(['1_battle_ipad.png', '3_title_ipad.png'], 'fastlane/screenshots/en-US', 'fastlane/screenshots/fr-FR'),
  },
  'archer-io': {
    root: 'godotGame/archer-io',
    icon: 'icon.png',
    iphone: { en: ['fastlane/screenshots/en-US/1_01_combat.png', 'fastlane/screenshots/en-US/2_02_swarm.png', 'fastlane/screenshots/en-US/3_03_upgrade.png'] },
    ipad: { en: ['fastlane/screenshots/en-US/1_01_combat_ipad.png', 'fastlane/screenshots/en-US/2_02_swarm_ipad.png'] },
  },
};

/* ── Captures locales (.shots-src/<id>/…) ───────────────────────────
 * Dossier libre : `icon.png` (facultatif) + des PNG triés par nom. Un sous-dossier `ipad/`
 * alimente la tablette. Sert aux jeux qui n'ont pas encore de fastlane. */
function localApps() {
  const out = {};
  if (!fs.existsSync(LOCAL_SRC)) return out;
  const images = dir => (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
    .filter(f => /\.(png|jpe?g)$/i.test(f) && !/^icon\./i.test(f))
    .sort();
  for (const id of fs.readdirSync(LOCAL_SRC)) {
    const dir = path.join(LOCAL_SRC, id);
    if (!fs.statSync(dir).isDirectory()) continue;
    const entry = { root: dir };
    const phone = images(dir);
    if (fs.existsSync(path.join(dir, 'icon.png'))) entry.icon = 'icon.png';
    // Jeu sans icône : la vignette est le carré central de sa première capture.
    else if (phone.length) entry.iconFrom = phone[0];
    const pad = images(path.join(dir, 'ipad')).map(f => `ipad/${f}`);
    if (phone.length) entry.iphone = { en: phone };
    if (pad.length) entry.ipad = { en: pad };
    out[id] = entry;
  }
  return out;
}

/* ── Conversion ──────────────────────────────────────────────────── */
function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  return {
    w: Number(/pixelWidth: (\d+)/.exec(out)[1]),
    h: Number(/pixelHeight: (\d+)/.exec(out)[1]),
  };
}

function toWebp(src, dest, { crop, maxSide = MAX_SIDE, quality = QUALITY } = {}) {
  let { w, h } = size(src);
  const args = ['-quiet', '-q', String(quality), '-m', '6'];
  if (crop) {
    args.push('-crop', ...crop.map(String));
    [w, h] = [crop[2], crop[3]];
  }
  const scale = Math.min(1, maxSide / Math.max(w, h));
  if (scale < 1) {
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    args.push('-resize', String(w), String(h));
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  execFileSync('cwebp', [...args, src, '-o', dest]);
  return { w, h };
}

/* ── Main ────────────────────────────────────────────────────────── */
const only = process.argv.slice(2).filter(a => !a.startsWith('-'));
const all = { ...APPS, ...localApps() };

let prev = { apps: {} };
try { prev = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8')); } catch { /* premier passage */ }

const index = { ...prev.apps };
let written = 0;

for (const [id, app] of Object.entries(all)) {
  if (only.length && !only.includes(id)) continue;
  const root = path.isAbsolute(app.root) ? app.root : path.join(DOCS, app.root);
  const entry = { ...(prev.apps[id] || {}) };
  const notes = [];

  if (app.icon) {
    const src = path.join(root, app.icon);
    if (fs.existsSync(src)) {
      toWebp(src, path.join(OUT_DIR, id, 'icon.webp'), { maxSide: ICON_SIDE, quality: 90 });
      entry.icon = `shots/${id}/icon.webp`;
      written++;
    } else notes.push('icône introuvable');
  } else if (app.iconFrom) {
    const src = path.join(root, app.iconFrom);
    const { w, h } = size(src);
    const side = Math.min(w, h);
    toWebp(src, path.join(OUT_DIR, id, 'icon.webp'), {
      crop: [Math.round((w - side) / 2), Math.round((h - side) / 2), side, side],
      maxSide: ICON_SIDE, quality: 90,
    });
    entry.icon = `shots/${id}/icon.webp`;
    written++;
  }

  for (const device of ['iphone', 'ipad']) {
    if (!app[device]) continue;
    const langs = { ...(entry[device] || {}) };
    for (const [lang, items] of Object.entries(app[device])) {
      const jobs = items.map(it => (typeof it === 'string' ? { file: it } : it));
      const missing = jobs.filter(j => !fs.existsSync(path.join(root, j.file)));
      if (missing.length) {
        notes.push(`${device}/${lang} : ${missing.length} source(s) absente(s), entrée précédente gardée`);
        continue;
      }
      langs[lang] = jobs.map((job, i) => {
        const rel = `shots/${id}/${device}-${lang}-${i + 1}.webp`;
        const dims = toWebp(path.join(root, job.file), path.join(PROJECT, 'public', rel), { crop: job.crop });
        written++;
        return { src: rel, ...dims };
      });
    }
    if (Object.keys(langs).length) entry[device] = langs;
  }

  index[id] = entry;
  const count = d => Object.values(entry[d] || {}).reduce((n, l) => Math.max(n, l.length), 0);
  console.log(`${notes.length ? '⚠' : '✓'} ${id} — iPhone ${count('iphone')}, iPad ${count('ipad')}${entry.icon ? ', icône' : ''}${notes.length ? `\n    ${notes.join('\n    ')}` : ''}`);
}

const sorted = Object.fromEntries(Object.keys(index).sort().map(k => [k, index[k]]));
fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedAt: new Date().toISOString(), apps: sorted }, null, 2) + '\n');
console.log(`→ ${written} image(s) écrite(s), index : ${path.relative(process.cwd(), OUT_JSON)}`);
