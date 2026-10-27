'use strict';

/**
 * Salon de l'emploi Aéro & Spatial — Synergie, Stade Toulousain (Ernest-Wallon),
 * 30 septembre 2026. One polyvalent CV per exhibitor, French only.
 *
 * Rendered by generate-cv-variants.cjs --set salon
 *   → iCloud Drive/CV/CV Spécifique/Salon Aéro Toulouse 2026/
 *
 * The profile stays generalist on purpose (mobile, web/back-end, CI/CD,
 * embedded): we don't know which trade each company recruits for. Only the
 * hook, the order of skills/bullets and the projects shown change per company.
 */

const { cv, APP_STORE } = require('./cv-variants.cjs');

// ─── Building blocks (facts from the main CV) ────────────────────────────────

const SKILLS = {
  aero:    { cat: 'Domaine aéronautique', tags: 'trajectoire et profils de vol, points de route, météo TAF/METAR, ADS-B, ARINC, carburant & ETA' },
  mobile:  { cat: 'Mobile',              tags: 'Swift, SwiftUI, UIKit, MVVM, MapboxMaps SDK, publication App Store' },
  web:     { cat: 'Web & back-end',      tags: 'React, TypeScript, Node.js, Express, API REST, WebSocket, Python/Flask' },
  data:    { cat: 'Données',             tags: 'PostgreSQL, SQLite, SQL, JSON, modélisation, migrations' },
  cicd:    { cat: 'CI/CD & DevOps',      tags: 'GitHub Actions, fastlane, TestFlight, Docker, Linux, nginx, PM2, HTTPS' },
  embedded:{ cat: 'Embarqué',            tags: 'C, C++, Arduino, capteurs et actionneurs, interface de contrôle' },
  quality: { cat: 'Qualité & méthodes',  tags: 'Agile/Scrum, tests (Jest, XCTest), revues de code, documentation technique' },
  security:{ cat: 'Sécurité',            tags: 'JWT, OAuth 2.0, Sign in with Apple, gestion des secrets' },
};

// Always first in the Skyconseil block: 3 years immersed in aviation.
const AERO_BULLETS = [
  "3 ans sur Guidor, application pour équipages de compagnies aériennes : trajectoire de vol (profils latéral et vertical, points de route, aéroports), météo TAF/METAR, trafic ADS-B, cartographie MapboxMaps.",
  "En contact avec des compagnies clientes, dont British Airways et Japan Airlines : retours des pilotes, besoins opérationnels, suivi des évolutions livrées.",
  "Baigné au quotidien dans les problématiques et le vocabulaire aéro : formats ARINC et échanges avec l'avionique, optimisation verticale, déroutement, consommation carburant, ETA, alertes turbulence.",
];

const BULLETS = {
  guidor: "Fait évoluer Guidor, application aviation en production utilisée par des professionnels : intégration d'un SDK cartographique (annotations dynamiques, tuiles raster).",
  api:    "Consommé et fiabilisé des API REST et des flux de données JSON, avec gestion du cache et des états d'erreur.",
  cicd:   "Automatisé les builds, les tests et la distribution des versions via des pipelines GitHub Actions et fastlane.",
  team:   "Travaillé en équipe Agile/Scrum de 5 personnes : sprints, revues de code, documentation technique interne et client.",
};

const PROJECTS = {
  guidor:    { title: 'Guidor',            sub: 'Projet professionnel · 3 ans · Application pour compagnies aériennes (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps, TAF/METAR, ADS-B, ARINC, CI/CD', appStoreUrl: APP_STORE.guidor },
  jobTracker:{ title: 'Job Tracker',       sub: 'Projet personnel · Application web complète en production',                          tags: 'React, Node.js, Express, PostgreSQL, Docker, tests Jest' },
  infra:     { title: 'Infrastructure personnelle', sub: 'Projet personnel · VPS Linux hébergeant plusieurs services, déployés à chaque push', tags: 'Linux, GitHub Actions, Docker, nginx, PM2, HTTPS, cron, sauvegardes' },
  pipelineIos:{ title: 'Pipeline iOS → TestFlight', sub: 'Projet personnel · Build, signature et envoi TestFlight automatiques',           tags: 'GitHub Actions (macOS), fastlane match, xcodebuild' },
  terrafocus:{ title: 'Terrafocus API',    sub: "Projet personnel · API d'authentification et de données",                             tags: 'Node.js, Express, SQLite, JWT, OAuth 2.0, Sign in with Apple' },
  pixel:     { title: 'Pixel Tactics Server', sub: 'Projet personnel · Serveur de jeu temps réel multi-joueurs',                       tags: 'Node.js, WebSocket, Docker' },
  first5:    { title: 'First5 API',        sub: "Projet personnel · Service Python de collecte et d'exposition de données",           tags: 'Python, Flask, SQL, scripts de collecte' },
  apps:      { title: 'Apps App Store',    sub: 'Projets personnels · Meow-Tube (4.9 ★), easy-Gym, Jeu de Point — publiées seul',       tags: 'Swift, SwiftUI, API tierces', appStoreUrl: APP_STORE.meowTube },
};

const BASE_KEYWORDS = ['ingénieur logiciel','développeur','aéronautique','aviation','spatial','compagnies aériennes','British Airways','Japan Airlines','trajectoire de vol','TAF','METAR','ADS-B','ARINC','avionique','Guidor','Skyconseil','Swift','iOS','React','TypeScript','Node.js','Python','C++','PostgreSQL','API REST','CI/CD','GitHub Actions','fastlane','Docker','Linux','tests','Agile','Scrum','Toulouse','CDI'];

const TAIL = "3 ans d'alternance chez Skyconseil sur Guidor, application de vol pour compagnies aériennes : immergé dans les problématiques aéronautiques et en contact avec des clients comme British Airways et Japan Airlines. Profil polyvalent — mobile, web, back-end, CI/CD, embarqué — disponible dès maintenant en CDI à Toulouse.";

function company(c) {
  return {
    folder: 'CV Spécifique/Salon Aéro Toulouse 2026',
    slug:   c.slug,
    fr: cv('fr', {
      docTitle: `CV Sharik Abubucker — Candidature ${c.name}`,
      title:    `Ingénieur Logiciel polyvalent — Candidature ${c.name}`,
      subtitle: `Aéronautique · ${c.subtitle}`,
      summary:  `${c.hook} ${TAIL}`,
      skills:   ['aero', ...c.skills].slice(0, 6).map((k) => SKILLS[k]),
      jobTitle: 'Développeur Applications Guidor — Alternance 3 ans (aéronautique)',
      bullets:  [...AERO_BULLETS, ...c.bullets.filter((k) => k !== 'guidor').slice(0, 1).map((k) => BULLETS[k])],
      withInternship: true,
      aeroBullet: false, // AERO_BULLETS already cover it
      projects: c.projects.slice(0, 4).map((k) => PROJECTS[k]),
      epitech:  'Spécialisations cybersécurité, cloud et IoT, algorithmique, projets en équipe',
      keywords: [c.name, ...BASE_KEYWORDS, ...c.keywords],
    }),
  };
}

// ─── Exhibitors ──────────────────────────────────────────────────────────────

const VARIANTS = [
  company({
    name: 'Airbus', slug: 'Airbus',
    subtitle: 'Logiciel · Outils numériques · CI/CD · Mobile & Web',
    hook: "Venu au salon pour rencontrer Airbus : les familles A320 et A350 sortent d'ici, à Blagnac, et la transformation numérique de la production et des services aux compagnies demande des développeurs capables de livrer vite et proprement.",
    skills:   ['cicd', 'web', 'mobile', 'data', 'embedded', 'quality'],
    bullets:  ['cicd', 'guidor', 'api', 'team'],
    projects: ['guidor', 'jobTracker', 'infra', 'pipelineIos', 'apps'],
    keywords: ['A320','A350','outils numériques','industrie 4.0','DevOps'],
  }),
  company({
    name: 'Delair', slug: 'Delair',
    subtitle: 'Mobile · Cartographie · Embarqué C++ · Données',
    hook: "Venu au salon pour rencontrer Delair : concevoir à Toulouse des drones professionnels de cartographie et d'inspection, avec la chaîne logicielle qui va du vol jusqu'à la donnée exploitée, recoupe exactement ce que je fais — cartographie mobile, embarqué et traitement de données.",
    skills:   ['mobile', 'embedded', 'web', 'data', 'cicd', 'quality'],
    bullets:  ['guidor', 'api', 'cicd', 'team'],
    projects: ['guidor', 'first5', 'jobTracker', 'infra', 'apps'],
    keywords: ['drone','cartographie','MapboxMaps','géolocalisation','station sol','embarqué'],
  }),
  company({
    name: 'Daher', slug: 'Daher',
    subtitle: 'Outils métiers · Web & back-end · Automatisation · Mobile',
    hook: "Venu au salon pour rencontrer Daher : avionneur (TBM, Kodiak), équipementier et logisticien industriel, Daher a besoin d'outils numériques fiables pour relier production, supply chain et services — c'est le type d'application que je construis de bout en bout.",
    skills:   ['web', 'data', 'cicd', 'mobile', 'embedded', 'quality'],
    bullets:  ['api', 'cicd', 'guidor', 'team'],
    projects: ['jobTracker', 'guidor', 'first5', 'infra', 'apps'],
    keywords: ['TBM','Kodiak','supply chain','logistique','outils métiers','automatisation'],
  }),
  company({
    name: 'ATR', slug: 'ATR',
    subtitle: 'Applications aviation · Mobile · Web · CI/CD',
    hook: "Venu au salon pour rencontrer ATR : leader toulousain de l'avion régional (ATR 42 et 72), ATR accompagne ses compagnies clientes avec des services numériques — et je développe déjà une application utilisée en aviation par des professionnels.",
    skills:   ['mobile', 'web', 'cicd', 'data', 'embedded', 'quality'],
    bullets:  ['guidor', 'api', 'cicd', 'team'],
    projects: ['guidor', 'apps', 'jobTracker', 'pipelineIos', 'infra'],
    keywords: ['ATR 42','ATR 72','avion régional','services aux compagnies','application aviation'],
  }),
  company({
    name: 'Liebherr-Aerospace', slug: 'Liebherr',
    subtitle: 'Embarqué C/C++ · Tests & qualité · CI/CD · Outils',
    hook: "Venu au salon pour rencontrer Liebherr-Aerospace Toulouse : les systèmes de gestion d'air et l'électronique qui y sont conçus exigent un logiciel rigoureux, testé et tracé — une rigueur que j'applique à mes pipelines de tests et à mon expérience embarquée en C++.",
    skills:   ['embedded', 'quality', 'cicd', 'web', 'mobile', 'data'],
    bullets:  ['cicd', 'team', 'guidor', 'api'],
    projects: ['guidor', 'pipelineIos', 'infra', 'jobTracker', 'first5'],
    keywords: ['systèmes de gestion d\'air','électronique','embarqué','C','tests automatisés','qualité logicielle'],
  }),
  company({
    name: 'Safran', slug: 'Safran',
    subtitle: 'Logiciel · CI/CD · Embarqué · Outils numériques',
    hook: "Venu au salon pour rencontrer Safran : motoriste et équipementier de premier rang, présent à Toulouse notamment avec Safran Power Units, Safran conjugue logiciel embarqué exigeant et outils numériques internes — deux terrains où je peux contribuer.",
    skills:   ['cicd', 'embedded', 'web', 'quality', 'mobile', 'data'],
    bullets:  ['cicd', 'guidor', 'api', 'team'],
    projects: ['guidor', 'pipelineIos', 'jobTracker', 'infra', 'apps'],
    keywords: ['motoriste','équipementier','Safran Power Units','logiciel embarqué','DevOps'],
  }),
  company({
    name: 'Collins Aerospace', slug: 'Collins',
    subtitle: 'Avionique · Embarqué C/C++ · CI/CD · Mobile',
    hook: "Venu au salon pour rencontrer Collins Aerospace : équipementier de rang 1 du groupe RTX, de l'avionique aux systèmes d'actionnement, Collins fait du logiciel au cœur de l'avion — et mon alternance se déroule déjà dans le logiciel aéronautique.",
    skills:   ['embedded', 'cicd', 'mobile', 'quality', 'web', 'data'],
    bullets:  ['guidor', 'cicd', 'api', 'team'],
    projects: ['guidor', 'pipelineIos', 'infra', 'jobTracker', 'apps'],
    keywords: ['avionique','RTX','systèmes embarqués','C','tests automatisés'],
  }),
  company({
    name: 'Satys', slug: 'Satys',
    subtitle: 'Outils numériques · Web & back-end · Mobile · Automatisation',
    hook: "Venu au salon pour rencontrer Satys : spécialiste des services aéronautiques (peinture, étanchéité, intérieurs d'avions) sur de nombreux sites, Satys a tout à gagner d'outils numériques qui suivent l'activité des ateliers — ce que je sais concevoir, du web au mobile.",
    skills:   ['web', 'mobile', 'data', 'cicd', 'quality', 'embedded'],
    bullets:  ['api', 'guidor', 'cicd', 'team'],
    projects: ['jobTracker', 'guidor', 'apps', 'infra', 'first5'],
    keywords: ['services aéronautiques','outils métiers','suivi d\'activité','automatisation','application mobile'],
  }),
  company({
    name: 'Derichebourg Aeronautics Services', slug: 'Derichebourg',
    subtitle: 'Ingénierie logicielle · Web · Mobile · CI/CD · Embarqué',
    hook: "Venu au salon pour rencontrer Derichebourg Aeronautics Services : au service des grands programmes aéronautiques, ses missions d'ingénierie demandent des profils qui s'adaptent vite — c'est la force d'un profil polyvalent.",
    skills:   ['web', 'mobile', 'cicd', 'embedded', 'data', 'quality'],
    bullets:  ['guidor', 'cicd', 'api', 'team'],
    projects: ['guidor', 'jobTracker', 'infra', 'apps'],
    keywords: ['ingénierie','prestation','services aéronautiques','polyvalence','consultant'],
  }),
];

module.exports = { VARIANTS };
