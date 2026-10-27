#!/usr/bin/env node
'use strict';

/**
 * Generates PDF CVs using the exact same DATA + buildPrintHtml as
 * src/utils/downloadCvAsPdf.ts — so the output is pixel-identical to the
 * portfolio's own PDF download.
 *
 * Usage:
 *   node scripts/generate-cv-pdfs.cjs          # generate once
 *   node scripts/generate-cv-pdfs.cjs --watch  # watch + auto-regenerate
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT        = path.join(__dirname, '..');
const OUT_DIR     = path.join(ROOT, 'public', 'cv-generated');
const SOURCE_FILE = path.join(ROOT, 'src', 'utils', 'downloadCvAsPdf.ts');
const CHROMIUM    = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';
const WATCH_MODE  = process.argv.includes('--watch');
const PORTFOLIO_ROOT = ROOT;
const WEB_ROOT       = '/var/www/sharik.fr';

// ─── Data (mirrors downloadCvAsPdf.ts DATA — keep in sync) ───────────────────

const DATA = {
  fr: {
    title:    'Développeur iOS · Ingénieur Logiciel',
    subtitle: 'Mobile · Web · CI/CD · IA',
    summary:  "Alternant développeur iOS chez Skyconseil depuis janvier 2024, je travaille sur Guidor — une application aviation professionnelle intégrant MapboxMaps SDK v10+, UIKit et architecture MVVM. En parallèle, j'ai publié plusieurs applications sur l'App Store. Profil full-stack issu d'une montée en compétences progressive : Swift, React.js, CI/CD, avec une appétence pour l'IA mobile et le cloud.",
    sections: { skills: 'Compétences Clés', experience: 'Expériences Professionnelles', projects: 'Projets', education: 'Formation', languages: 'Langues', keywords: 'Mots-clés ATS' },
    skills: [
      { cat: 'Mobile iOS',     tags: 'Swift, SwiftUI, UIKit, AVFoundation' },
      { cat: 'Architecture',   tags: 'MVVM, MVC, Clean Architecture' },
      { cat: 'Cartographie',   tags: 'MapboxMaps SDK v10+, filtres JSON' },
      { cat: 'DevOps / CI/CD', tags: 'Git, GitHub Actions, pipelines automatisés, Tests unitaires' },
      { cat: 'Web & Cloud',    tags: 'React.js, TypeScript, JavaScript' },
    ],
    experiences: [
      {
        title:   'Développeur Applications iOS — Alternance',
        company: 'Skyconseil',
        badge:   'Alternance',
        period:  'Janvier 2024 – Septembre 2026 · Toulouse, France',
        bullets: [
          "Développé et intégré le MapboxMaps SDK v10+ sur Guidor, application aviation iOS : annotations cartographiques dynamiques et tuiles raster.",
          "Implémenté des fonctionnalités UIKit et SwiftUI suivant l'architecture MVVM au sein d'une équipe Agile/Scrum de 5 personnes.",
          "Rédigé la documentation technique interne et client couvrant l'ensemble des modules cartographiques.",
        ],
      },
      {
        title:   'Stagiaire Développeur Embarqué',
        company: 'Le Facteur Humain & Combustible Numérique',
        badge:   'Stage',
        period:  'Juin 2023 – Juillet 2023 · Toulouse, France',
        bullets: [
          "Développé un système de guidage embarqué (projet Guidor) en Arduino et C++, intégrant capteurs, actionneurs et interface de contrôle dans une équipe pluridisciplinaire.",
        ],
      },
    ],
    projects: [
      { title: 'Guidor',              sub: 'Projet professionnel · Application aviation iOS en production (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, CI/CD',     appStoreUrl: 'https://apps.apple.com/fr/app/guidor/id1072066692' },
      { title: 'Meow-Tube',           sub: 'Projet personnel · 4.9 ★ — YouTube sans pub ni Shorts, sans abonnement',    tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API',         appStoreUrl: 'itms-apps://apps.apple.com/fr/app/meow-tube/id6760180650' },
      { title: 'easy-Gym',            sub: 'Projet personnel — Sport à domicile pour tous niveaux, sans équipement',    tags: 'Swift, SwiftUI, iOS',                                          appStoreUrl: 'itms-apps://apps.apple.com/fr/app/easy-gym/id6761538853?l=en-GB' },
      { title: 'Jeu de Point',        sub: 'Projet personnel — Jeu de stratégie traditionnel malgache',                 tags: 'Swift, SwiftUI, iOS',                                          appStoreUrl: 'itms-apps://apps.apple.com/fr/app/jeu-de-point/id6761615625' },
    ],
    education: [
      { title: 'Master Informatique (BAC+5, niveau ingénieur)',                    school: 'Epitech',                       period: 'Août 2023 – Sept. 2026 · Spécialisations cybersécurité, cloud et IoT, algorithmique, JavaScript, React.js et projets en équipe' },
      { title: "AFP Concepteur Développeur d'Applications iOS",   school: 'Simplon Auvergne-Rhône-Alpes',  period: "Avr. – Juil. 2023 · Swift, conception & développement d'applications iOS natives, méthodes agiles" },
      { title: 'BTS Management des Unités Commerciales',          school: 'Écoles Billières',               period: "Sept. 2020 – Juil. 2022 · Gestion de projet, management d'équipe" },
    ],
    languages: 'Français — Natif · Malgache — Natif · Anglais — Avancé (B2/C1)',
    keywords: ['Swift','iOS','SwiftUI','UIKit','MVVM','MVC','MapboxMaps','Mapbox SDK','MapboxMaps v10','CI/CD','GitHub Actions','Tests unitaires','Agile','Scrum','JSON','REST API','Git','AVFoundation','React.js','TypeScript','JavaScript','C++','Arduino','App Store','développeur iOS','ingénieur logiciel','architecture mobile','aviation','alternance','Toulouse'],
  },
  en: {
    title:    'iOS Developer · Software Engineer',
    subtitle: 'Mobile · Web · CI/CD · AI',
    summary:  'Work-study iOS developer at Skyconseil since January 2024, building Guidor — a professional aviation app integrating MapboxMaps SDK v10+, UIKit, and MVVM architecture. Independently published several apps on the App Store. Full-stack profile built through progressive skill development: Swift, React.js, CI/CD, with a strong interest in mobile AI and cloud.',
    sections: { skills: 'Core Skills', experience: 'Professional Experience', projects: 'Projects', education: 'Education', languages: 'Languages', keywords: 'Keywords & ATS' },
    skills: [
      { cat: 'iOS Mobile',          tags: 'Swift, SwiftUI, UIKit, AVFoundation' },
      { cat: 'Architecture',        tags: 'MVVM, MVC, Clean Architecture' },
      { cat: 'Mapping & Geospatial',tags: 'MapboxMaps SDK v10+, JSON Filters' },
      { cat: 'DevOps & CI/CD',      tags: 'Git, GitHub Actions, Automated Pipelines, Unit Testing' },
      { cat: 'Web & Cloud',         tags: 'React.js, TypeScript, JavaScript' },
    ],
    experiences: [
      {
        title:   'iOS Application Developer — Work-Study',
        company: 'Skyconseil',
        badge:   'Work-Study',
        period:  'January 2024 – September 2026 · Toulouse, France',
        bullets: [
          'Developed and integrated MapboxMaps SDK v10+ on Guidor, a production iOS aviation app: dynamic map annotations and raster tiles.',
          'Implemented UIKit and SwiftUI features following MVVM architecture within a 5-person Agile/Scrum team.',
          'Wrote internal and client-facing technical documentation covering all map modules.',
        ],
      },
      {
        title:   'Embedded Software Development Intern',
        company: 'Le Facteur Humain & Combustible Numérique',
        badge:   'Internship',
        period:  'June 2023 – July 2023 · Toulouse, France',
        bullets: [
          'Built an embedded guidance system (Guidor project) in Arduino and C++, integrating hardware sensors, actuators, and a control interface within a cross-functional team.',
        ],
      },
    ],
    projects: [
      { title: 'Guidor',              sub: 'Professional project · Aviation iOS app in production (Skyconseil)',    tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, CI/CD',    appStoreUrl: 'https://apps.apple.com/fr/app/guidor/id1072066692' },
      { title: 'Meow-Tube',           sub: 'Personal project · 4.9 ★ — YouTube without ads or Shorts, no subscription', tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API',   appStoreUrl: 'itms-apps://apps.apple.com/fr/app/meow-tube/id6760180650' },
      { title: 'easy-Gym',            sub: 'Personal project — Home workout for all fitness levels, no equipment',  tags: 'Swift, SwiftUI, iOS',                                        appStoreUrl: 'itms-apps://apps.apple.com/fr/app/easy-gym/id6761538853?l=en-GB' },
      { title: 'Jeu de Point',        sub: 'Personal project — Traditional Malagasy strategy game',                 tags: 'Swift, SwiftUI, iOS',                                        appStoreUrl: 'itms-apps://apps.apple.com/fr/app/jeu-de-point/id6761615625' },
    ],
    education: [
      { title: "Master's in Computer Science (BAC+5, engineering level)",                  school: 'Epitech',                      period: 'August 2023 – September 2026 · Specializations in cybersecurity, cloud and IoT, algorithms, JavaScript, React.js and team projects' },
      { title: 'Professional Qualification — iOS Application Developer', school: 'Simplon Auvergne-Rhône-Alpes', period: 'April – July 2023 · Swift, native iOS application design & development, agile methods' },
      { title: 'BTS Management of Commercial Units',                     school: 'Écoles Billières',              period: 'Sept. 2020 – July 2022 · Project management, team management' },
    ],
    languages: 'French — Native · Malagasy — Native · English — Advanced (B2/C1)',
    keywords: ['Swift','iOS','SwiftUI','UIKit','MVVM','MVC','MapboxMaps','Mapbox SDK','MapboxMaps v10','CI/CD','GitHub Actions','Unit Testing','Agile','Scrum','JSON','REST API','Git','AVFoundation','React.js','TypeScript','JavaScript','C++','Arduino','App Store','iOS Developer','Software Engineer','mobile architecture','aviation','work-study','Toulouse'],
  },
};

// ─── HTML builder (shared with generate-cv-variants.cjs) ─────────────────────

const { buildPrintHtml } = require('./lib/cv-print-html.cjs');


// ─── PDF generation ───────────────────────────────────────────────────────────

async function generateAll() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });

  try {
    for (const [key, lang] of [['french', 'fr'], ['english', 'en']]) {
      const html = buildPrintHtml(DATA[lang], lang, { atsNote: true });
      const page = await browser.newPage();
      await page.emulateMediaType('print');
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      await page.close();

      const outPath = path.join(OUT_DIR, `CV_Sharik_${key}.pdf`);
      fs.writeFileSync(outPath, pdfBuf);
      console.log(`✅ CV_Sharik_${key}.pdf (${Math.round(pdfBuf.length / 1024)} KB)`);
    }
  } finally {
    await browser.close();
  }
}

// ─── Redeploy portfolio to /var/www/sharik.fr ─────────────────────────────────

async function redeploy() {
  console.log('🔨 Building portfolio…');
  try {
    execSync('npm run build', { cwd: PORTFOLIO_ROOT, stdio: 'inherit' });
    execSync(`cp -r dist/. ${WEB_ROOT}/`, { cwd: PORTFOLIO_ROOT, stdio: 'inherit' });
    console.log(`🚀 Deployed → ${WEB_ROOT}`);
  } catch (e) {
    console.error('❌ Redeploy failed:', e.message);
  }
}

// ─── Watch mode ───────────────────────────────────────────────────────────────

async function main() {
  console.log(`📄 CV PDF Generator — mode: ${WATCH_MODE ? 'watch' : 'once'}`);
  await generateAll();

  if (!WATCH_MODE) return;

  let debounce = null;
  const onChange = (filename) => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(async () => {
      console.log(`\n🔄 ${filename} changed — regenerating PDFs…`);
      await generateAll().catch(console.error);
      await redeploy();
    }, 500);
  };

  // Watch the TypeScript source (canonical data) for changes
  fs.watch(SOURCE_FILE, (_, filename) => onChange(filename || 'downloadCvAsPdf.ts'));

  console.log(`👀 Watching ${SOURCE_FILE} for changes…`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
