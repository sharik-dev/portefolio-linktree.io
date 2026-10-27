#!/usr/bin/env node
'use strict';

/**
 * Renders one PDF CV per specialisation (scripts/cv-variants.cjs), FR + EN,
 * with the portfolio's own CV template (lib/cv-print-html.cjs).
 *
 * Output: <out>/<variant folder>/CV_Sharik_<slug>_<FR|EN>.pdf
 *   default <out> = iCloud Drive/CV
 *
 * Usage:
 *   node scripts/generate-cv-variants.cjs            # all variants
 *   node scripts/generate-cv-variants.cjs --only Web # one variant (slug)
 *   node scripts/generate-cv-variants.cjs --out ./x  # another output folder
 *   node scripts/generate-cv-variants.cjs --set salon # company CVs (cv-salon-aero.cjs)
 *
 * Uses the installed Chrome in headless mode (no puppeteer / node_modules).
 * On macOS headless Chrome writes the PDF but does not always exit, so we
 * wait for the file to be complete and stop Chrome ourselves.
 */

const fs   = require('fs');
const os   = require('os');
const path = require('path');
const { spawn } = require('child_process');

const { buildPrintHtml } = require('./lib/cv-print-html.cjs');
const SETS = { default: './cv-variants.cjs', salon: './cv-salon-aero.cjs' };

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
};

const ICLOUD  = path.join(os.homedir(), 'Library', 'Mobile Documents', 'com~apple~CloudDocs');
const OUT_DIR = path.resolve(arg('--out') || path.join(ICLOUD, 'CV'));
const ONLY    = arg('--only');
const SET     = arg('--set') || 'default';
if (!SETS[SET]) { console.error(`❌ jeu inconnu : ${SET}`); process.exit(1); }
const { VARIANTS } = require(SETS[SET]);

const CHROME = process.env.CHROMIUM_PATH || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error('❌ Chrome introuvable — définir CHROMIUM_PATH');
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-variants-'));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function renderPdf(html, outPath) {
  const htmlPath = path.join(tmp, 'cv.html');
  const pdfPath  = path.join(tmp, 'cv.pdf');
  // The template's bottom padding alone can spill onto a blank 2nd page.
  fs.writeFileSync(htmlPath, html.replace('</style>', '@media print { body { padding-bottom: 0; } }</style>'));
  fs.rmSync(pdfPath, { force: true });

  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--user-data-dir=${path.join(tmp, 'profile')}`,
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  let exited = false;
  const exit = new Promise((r) => chrome.on('exit', () => { exited = true; r(); }));

  try {
    // Complete = the %%EOF trailer is there (Chrome writes the file in one go).
    for (let waited = 0; ; waited += 200) {
      if (fs.existsSync(pdfPath) && fs.readFileSync(pdfPath).subarray(-1024).includes('%%EOF')) break;
      if (exited && !fs.existsSync(pdfPath)) throw new Error('Chrome a quitté sans produire de PDF');
      if (waited > 60000) throw new Error('Chrome : délai dépassé');
      await sleep(200);
    }
  } finally {
    if (!exited) chrome.kill();
    await exit;
  }
  fs.copyFileSync(pdfPath, outPath);
}

(async () => {
try {
  const list = VARIANTS.filter((v) => !ONLY || v.slug.toLowerCase() === ONLY.toLowerCase());
  if (!list.length) throw new Error(`variante inconnue : ${ONLY}`);

  for (const v of list) {
    const dir = path.join(OUT_DIR, v.folder);
    fs.mkdirSync(dir, { recursive: true });
    for (const lang of ['fr', 'en'].filter((l) => v[l])) {
      const out = path.join(dir, `CV_Sharik_${v.slug}_${lang.toUpperCase()}.pdf`);
      await renderPdf(buildPrintHtml(v[lang], lang), out);
      const pages = (fs.readFileSync(out).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
      console.log(`${pages === 1 ? '✅' : '⚠️ '} ${path.relative(OUT_DIR, out)} (${Math.round(fs.statSync(out).size / 1024)} KB, ${pages} page${pages > 1 ? 's — à raccourcir' : ''})`);
    }
  }
  console.log(`📁 ${OUT_DIR}`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
