'use strict';

/**
 * One CV per specialisation, FR + EN — rendered by generate-cv-variants.cjs
 * with the same template as the portfolio's own PDF (lib/cv-print-html.cjs).
 *
 * These are targeted spin-offs of the main CV (the 4 synced files listed in
 * CLAUDE.md). They share its identity, education and languages; only the
 * angle changes: title, summary, skills, bullets, projects, keywords.
 * If a shared fact changes in the main CV (contact, dates, schools), change
 * it in COMMON below too.
 */

// ─── Shared by every variant ─────────────────────────────────────────────────

const APP_STORE = {
  guidor:   'https://apps.apple.com/fr/app/guidor/id1072066692',
  meowTube: 'https://apps.apple.com/fr/app/meow-tube/id6760180650',
  easyGym:  'https://apps.apple.com/fr/app/easy-gym/id6761538853',
  jeuPoint: 'https://apps.apple.com/fr/app/jeu-de-point/id6761615625',
};

const COMMON = {
  fr: {
    sections: { skills: 'Compétences Clés', experience: 'Expériences Professionnelles', projects: 'Projets', education: 'Formation', languages: 'Langues', keywords: 'Mots-clés ATS' },
    company:   'Skyconseil',
    badge:     'Alternance',
    period:    'Janvier 2024 – Septembre 2026 · Toulouse, France',
    internship: {
      title:   'Stagiaire Développeur Embarqué',
      company: 'Le Facteur Humain & Combustible Numérique',
      badge:   'Stage',
      period:  'Juin 2023 – Juillet 2023 · Toulouse, France',
      bullets: ["Développé un système de guidage embarqué en Arduino et C++, intégrant capteurs, actionneurs et interface de contrôle dans une équipe pluridisciplinaire."],
    },
    education: (epitech) => [
      { title: 'Master Informatique (BAC+5, niveau ingénieur)',                  school: 'Epitech',                      period: `Août 2023 – Sept. 2026 · ${epitech}` },
      { title: "AFP Concepteur Développeur d'Applications iOS", school: 'Simplon Auvergne-Rhône-Alpes', period: "Avr. – Juil. 2023 · Swift, conception & développement d'applications iOS natives, méthodes agiles" },
      { title: 'BTS Management des Unités Commerciales',        school: 'Écoles Billières',             period: "Sept. 2020 – Juil. 2022 · Gestion de projet, management d'équipe" },
    ],
    frigos: {
      title:   'Développeur Back-End Java',
      company: 'Les Frigos Solidaires',
      badge:   'Bénévolat',
      period:  '2025 · 6 mois, en parallèle de l\'alternance',
      bullets: ["Développé en Java / Spring Boot l'API REST consommée par l'application de l'association, au sein d'une petite équipe de développeurs bénévoles."],
    },
    languages: 'Français — Natif · Malgache — Natif · Anglais — Avancé (B2/C1)',
    aeroBullet: "3 ans immergé dans l'aéronautique sur Guidor, application de vol pour compagnies aériennes, en contact avec des clients comme British Airways et Japan Airlines (trajectoire, météo TAF/METAR, ADS-B).",
  },
  en: {
    sections: { skills: 'Core Skills', experience: 'Professional Experience', projects: 'Projects', education: 'Education', languages: 'Languages', keywords: 'Keywords & ATS' },
    company:   'Skyconseil',
    badge:     'Work-Study',
    period:    'January 2024 – September 2026 · Toulouse, France',
    internship: {
      title:   'Embedded Software Development Intern',
      company: 'Le Facteur Humain & Combustible Numérique',
      badge:   'Internship',
      period:  'June 2023 – July 2023 · Toulouse, France',
      bullets: ['Built an embedded guidance system in Arduino and C++, integrating hardware sensors, actuators and a control interface within a cross-functional team.'],
    },
    education: (epitech) => [
      { title: "Master's in Computer Science (BAC+5, engineering level)",                  school: 'Epitech',                      period: `August 2023 – September 2026 · ${epitech}` },
      { title: 'Professional Qualification — iOS Application Developer', school: 'Simplon Auvergne-Rhône-Alpes', period: 'April – July 2023 · Swift, native iOS application design & development, agile methods' },
      { title: 'BTS Management of Commercial Units',                     school: 'Écoles Billières',             period: 'Sept. 2020 – July 2022 · Project management, team management' },
    ],
    frigos: {
      title:   'Java Back-End Developer',
      company: 'Les Frigos Solidaires',
      badge:   'Volunteer',
      period:  '2025 · 6 months, alongside the work-study',
      bullets: ["Built in Java / Spring Boot the REST API behind the non-profit's application, within a small team of volunteer developers."],
    },
    languages: 'French — Native · Malagasy — Native · English — Advanced (B2/C1)',
    aeroBullet: '3 years immersed in aviation on Guidor, an in-flight app for airlines, working with clients such as British Airways and Japan Airlines (flight path, TAF/METAR weather, ADS-B).',
  },
};

// Builds DATA[lang] in the exact shape lib/cv-print-html.cjs expects.
function cv(lang, v) {
  const c = COMMON[lang];
  const experiences = [
    // Aviation stays visible in every variant, lightly: one bullet, first.
    { title: v.jobTitle, company: c.company, badge: c.badge, period: c.period, bullets: v.aeroBullet === false ? v.bullets : [c.aeroBullet, ...v.bullets] },
    ...(v.extraExperiences || []),
  ];
  if (v.withInternship) experiences.push(c.internship);
  return {
    docTitle:  v.docTitle,
    title:     v.title,
    subtitle:  v.subtitle,
    summary:   v.summary,
    sections:  c.sections,
    skills:    v.skills,
    experiences,
    projects:  v.projects,
    education: c.education(v.epitech),
    languages: c.languages,
    keywords:  v.keywords,
  };
}

// ─── Variants ────────────────────────────────────────────────────────────────
// `folder` is the sub-folder of iCloud Drive/CV, `slug` the file-name part.

const VARIANTS = [

  // ── Swift / iOS ────────────────────────────────────────────────────────────
  {
    folder: 'CV Swift', slug: 'Swift',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Développeur iOS Swift',
      title:    'Développeur iOS · Swift / SwiftUI',
      subtitle: 'iOS · SwiftUI · UIKit · MVVM · App Store',
      summary:  "Développeur iOS en alternance chez Skyconseil depuis janvier 2024, je fais évoluer Guidor, application aviation professionnelle en production (UIKit, SwiftUI, MVVM, MapboxMaps SDK). En parallèle, j'ai conçu, publié et maintenu seul plusieurs applications sur l'App Store, de la maquette à la fiche store, dont Meow-Tube (4.9 ★). Je maîtrise tout le cycle de vie d'une app iOS : architecture, tests, signature, TestFlight et publication.",
      skills: [
        { cat: 'Langages & UI',  tags: 'Swift 5/6, SwiftUI, UIKit, Combine, async/await, Swift Concurrency' },
        { cat: 'Architecture',   tags: 'MVVM, MVC, Clean Architecture, injection de dépendances, Swift Package Manager' },
        { cat: 'Frameworks',     tags: 'AVFoundation, MapKit, MapboxMaps SDK v6 → v11, WidgetKit, StoreKit, Core Data, SwiftData' },
        { cat: 'Réseau & données', tags: 'URLSession, API REST, JSON/Codable, cache, Sign in with Apple' },
        { cat: 'Qualité',        tags: 'XCTest, tests UI, Instruments, gestion mémoire, accessibilité, i18n' },
        { cat: 'Livraison',      tags: 'Xcode, fastlane (match, snapshot, deliver), TestFlight, App Store Connect, GitHub Actions' },
      ],
      jobTitle: 'Développeur Applications iOS — Alternance',
      bullets: [
        "Développé et intégré le MapboxMaps SDK v10+ sur Guidor, application aviation iOS : annotations cartographiques dynamiques et tuiles raster.",
        "Implémenté des fonctionnalités UIKit et SwiftUI suivant l'architecture MVVM au sein d'une équipe Agile/Scrum de 5 personnes.",
        "Migré des écrans UIKit vers SwiftUI et modernisé le code réseau avec async/await, en gardant la compatibilité des versions iOS supportées.",
      ],
      withInternship: true,
      projects: [
        { title: 'Guidor',       sub: 'Projet professionnel · Application aviation iOS en production (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, CI/CD', appStoreUrl: APP_STORE.guidor },
        { title: 'Meow-Tube',    sub: 'Projet personnel · 4.9 ★ — YouTube sans pub ni Shorts, sans abonnement',    tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API', appStoreUrl: APP_STORE.meowTube },
        { title: 'DuoBook',      sub: 'Projet personnel — Suivi de lecture gamifié avec séries quotidiennes',       tags: 'SwiftUI, SwiftData, WidgetKit, design system maison' },
        { title: 'easy-Gym',     sub: 'Projet personnel — Sport à domicile pour tous niveaux, sans équipement',     tags: 'Swift, SwiftUI, iOS', appStoreUrl: APP_STORE.easyGym },
        { title: 'Jeu de Point', sub: 'Projet personnel — Jeu de stratégie traditionnel malgache',                  tags: 'Swift, SwiftUI, iOS', appStoreUrl: APP_STORE.jeuPoint },
      ],
      epitech: 'Développement mobile natif, algorithmique, architecture logicielle, projets en équipe',
      keywords: ['Swift','iOS','SwiftUI','UIKit','Combine','async/await','MVVM','MVC','Clean Architecture','AVFoundation','MapKit','MapboxMaps','WidgetKit','StoreKit','Core Data','SwiftData','XCTest','Instruments','fastlane','TestFlight','App Store Connect','Xcode','Swift Package Manager','REST API','JSON','Git','Agile','Scrum','développeur iOS','développeur mobile','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — iOS Swift Developer',
      title:    'iOS Developer · Swift / SwiftUI',
      subtitle: 'iOS · SwiftUI · UIKit · MVVM · App Store',
      summary:  'Work-study iOS developer at Skyconseil since January 2024, evolving Guidor, a professional aviation app in production (UIKit, SwiftUI, MVVM, MapboxMaps SDK). Independently designed, shipped and maintained several App Store apps from mockup to store listing, including Meow-Tube (4.9 ★). I own the full lifecycle of an iOS app: architecture, testing, code signing, TestFlight and release.',
      skills: [
        { cat: 'Languages & UI',  tags: 'Swift 5/6, SwiftUI, UIKit, Combine, async/await, Swift Concurrency' },
        { cat: 'Architecture',    tags: 'MVVM, MVC, Clean Architecture, dependency injection, Swift Package Manager' },
        { cat: 'Frameworks',      tags: 'AVFoundation, MapKit, MapboxMaps SDK v6 → v11, WidgetKit, StoreKit, Core Data, SwiftData' },
        { cat: 'Networking & Data', tags: 'URLSession, REST APIs, JSON/Codable, caching, Sign in with Apple' },
        { cat: 'Quality',         tags: 'XCTest, UI tests, Instruments, memory management, accessibility, i18n' },
        { cat: 'Delivery',        tags: 'Xcode, fastlane (match, snapshot, deliver), TestFlight, App Store Connect, GitHub Actions' },
      ],
      jobTitle: 'iOS Application Developer — Work-Study',
      bullets: [
        'Developed and integrated MapboxMaps SDK v10+ on Guidor, a production iOS aviation app: dynamic map annotations and raster tiles.',
        'Implemented UIKit and SwiftUI features following MVVM architecture within a 5-person Agile/Scrum team.',
        'Migrated UIKit screens to SwiftUI and modernised networking code with async/await while keeping supported iOS versions compatible.',
      ],
      withInternship: true,
      projects: [
        { title: 'Guidor',       sub: 'Professional project · Aviation iOS app in production (Skyconseil)',       tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, CI/CD', appStoreUrl: APP_STORE.guidor },
        { title: 'Meow-Tube',    sub: 'Personal project · 4.9 ★ — YouTube without ads or Shorts, no subscription', tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API', appStoreUrl: APP_STORE.meowTube },
        { title: 'DuoBook',      sub: 'Personal project — Gamified reading tracker with daily streaks',            tags: 'SwiftUI, SwiftData, WidgetKit, custom design system' },
        { title: 'easy-Gym',     sub: 'Personal project — Home workout for all fitness levels, no equipment',      tags: 'Swift, SwiftUI, iOS', appStoreUrl: APP_STORE.easyGym },
        { title: 'Jeu de Point', sub: 'Personal project — Traditional Malagasy strategy game',                     tags: 'Swift, SwiftUI, iOS', appStoreUrl: APP_STORE.jeuPoint },
      ],
      epitech: 'Native mobile development, algorithms, software architecture, team projects',
      keywords: ['Swift','iOS','SwiftUI','UIKit','Combine','async/await','MVVM','MVC','Clean Architecture','AVFoundation','MapKit','MapboxMaps','WidgetKit','StoreKit','Core Data','SwiftData','XCTest','Instruments','fastlane','TestFlight','App Store Connect','Xcode','Swift Package Manager','REST API','JSON','Git','Agile','Scrum','iOS Developer','Mobile Developer','work-study','Toulouse'],
    }),
  },

  // ── Swift / iOS, sans apps perso : hackathon SNCF + bénévolat à la place ──
  {
    folder: 'CV Swift Sans Apps', slug: 'Swift-Sans-Apps',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Développeur iOS Swift',
      title:    'Développeur iOS · Swift / SwiftUI',
      subtitle: 'iOS · SwiftUI · UIKit · MVVM · App Store',
      summary:  "Développeur iOS en alternance chez Skyconseil depuis janvier 2024, je fais évoluer Guidor, application aviation professionnelle en production (UIKit, SwiftUI, MVVM, MapboxMaps SDK). En octobre 2026, mon équipe a remporté le Prix Coup de Cœur du hackathon « IA for Impact » sur le défi SNCF Groupe. En 2025, j'ai aussi développé en bénévole une API Java / Spring Boot pour l'association Les Frigos Solidaires. Je maîtrise tout le cycle de vie d'une app iOS : architecture, tests, signature, TestFlight et publication.",
      skills: [
        { cat: 'Langages & UI',  tags: 'Swift 5/6, SwiftUI, UIKit, Combine, async/await, Swift Concurrency' },
        { cat: 'Architecture',   tags: 'MVVM, MVC, Clean Architecture, injection de dépendances, Swift Package Manager' },
        { cat: 'Frameworks',     tags: 'AVFoundation, MapKit, MapboxMaps SDK v6 → v11, WidgetKit, StoreKit, Core Data, SwiftData' },
        { cat: 'Réseau & données', tags: 'URLSession, API REST, JSON/Codable, cache, Sign in with Apple, Java / Spring Boot' },
        { cat: 'Qualité',        tags: 'XCTest, tests UI, Instruments, gestion mémoire, accessibilité, i18n' },
        { cat: 'Livraison',      tags: 'Xcode, fastlane (match, snapshot, deliver), TestFlight, App Store Connect, GitHub Actions' },
      ],
      jobTitle: 'Développeur Applications iOS — Alternance',
      bullets: [
        "Développé et intégré le MapboxMaps SDK v10+ sur Guidor, application aviation iOS : annotations cartographiques dynamiques et tuiles raster.",
        "Implémenté des fonctionnalités UIKit et SwiftUI suivant l'architecture MVVM au sein d'une équipe Agile/Scrum de 5 personnes.",
        "Migré des écrans UIKit vers SwiftUI et modernisé le code réseau avec async/await, en gardant la compatibilité des versions iOS supportées.",
      ],
      extraExperiences: [COMMON.fr.frigos],
      withInternship: true,
      projects: [
        { title: 'Guidor',              sub: 'Projet professionnel · Application aviation iOS en production (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, CI/CD', appStoreUrl: APP_STORE.guidor },
        { title: 'Occitanie en train',  sub: 'Hackathon « IA for Impact » #2, défi SNCF Groupe · Prix Coup de Cœur (La Mêlée × Toulouse INP-N7, oct. 2026) — itinéraires sur les horaires SNCF, carte interactive et assistant IA à la voix', tags: 'React, TypeScript, MapLibre, Python, FastAPI, IA (appels d\'outils)' },
      ],
      epitech: 'Développement mobile natif, algorithmique, architecture logicielle, projets en équipe',
      keywords: ['Swift','iOS','SwiftUI','UIKit','Combine','async/await','MVVM','MVC','Clean Architecture','AVFoundation','MapKit','MapboxMaps','WidgetKit','StoreKit','Core Data','SwiftData','XCTest','Instruments','fastlane','TestFlight','App Store Connect','Xcode','Swift Package Manager','REST API','JSON','Java','Spring Boot','hackathon','SNCF','Git','Agile','Scrum','développeur iOS','développeur mobile','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — iOS Swift Developer',
      title:    'iOS Developer · Swift / SwiftUI',
      subtitle: 'iOS · SwiftUI · UIKit · MVVM · App Store',
      summary:  "Work-study iOS developer at Skyconseil since January 2024, evolving Guidor, a professional aviation app in production (UIKit, SwiftUI, MVVM, MapboxMaps SDK). In October 2026 my team won the Jury's Favourite Award at the “IA for Impact” hackathon on the SNCF Group challenge. In 2025 I also volunteered as a Java / Spring Boot API developer for the non-profit Les Frigos Solidaires. I own the full lifecycle of an iOS app: architecture, testing, code signing, TestFlight and release.",
      skills: [
        { cat: 'Languages & UI',  tags: 'Swift 5/6, SwiftUI, UIKit, Combine, async/await, Swift Concurrency' },
        { cat: 'Architecture',    tags: 'MVVM, MVC, Clean Architecture, dependency injection, Swift Package Manager' },
        { cat: 'Frameworks',      tags: 'AVFoundation, MapKit, MapboxMaps SDK v6 → v11, WidgetKit, StoreKit, Core Data, SwiftData' },
        { cat: 'Networking & Data', tags: 'URLSession, REST APIs, JSON/Codable, caching, Sign in with Apple, Java / Spring Boot' },
        { cat: 'Quality',         tags: 'XCTest, UI tests, Instruments, memory management, accessibility, i18n' },
        { cat: 'Delivery',        tags: 'Xcode, fastlane (match, snapshot, deliver), TestFlight, App Store Connect, GitHub Actions' },
      ],
      jobTitle: 'iOS Application Developer — Work-Study',
      bullets: [
        'Developed and integrated MapboxMaps SDK v10+ on Guidor, a production iOS aviation app: dynamic map annotations and raster tiles.',
        'Implemented UIKit and SwiftUI features following MVVM architecture within a 5-person Agile/Scrum team.',
        'Migrated UIKit screens to SwiftUI and modernised networking code with async/await while keeping supported iOS versions compatible.',
      ],
      extraExperiences: [COMMON.en.frigos],
      withInternship: true,
      projects: [
        { title: 'Guidor',             sub: 'Professional project · Aviation iOS app in production (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, CI/CD', appStoreUrl: APP_STORE.guidor },
        { title: 'Occitanie en train', sub: "“IA for Impact” Hackathon #2, SNCF Group challenge · Jury's Favourite Award (La Mêlée × Toulouse INP-N7, Oct. 2026) — routing on SNCF timetables, interactive map and voice AI assistant", tags: 'React, TypeScript, MapLibre, Python, FastAPI, AI (tool calling)' },
      ],
      epitech: 'Native mobile development, algorithms, software architecture, team projects',
      keywords: ['Swift','iOS','SwiftUI','UIKit','Combine','async/await','MVVM','MVC','Clean Architecture','AVFoundation','MapKit','MapboxMaps','WidgetKit','StoreKit','Core Data','SwiftData','XCTest','Instruments','fastlane','TestFlight','App Store Connect','Xcode','Swift Package Manager','REST API','JSON','Java','Spring Boot','hackathon','SNCF','Git','Agile','Scrum','iOS Developer','Mobile Developer','work-study','Toulouse'],
    }),
  },

  // ── CI/CD / DevOps ─────────────────────────────────────────────────────────
  {
    folder: 'CV CI-CD', slug: 'CI-CD',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Ingénieur DevOps CI/CD',
      title:    'Ingénieur DevOps · CI/CD',
      subtitle: 'GitHub Actions · fastlane · Docker · Linux · Cloud',
      summary:  "En alternance chez Skyconseil depuis janvier 2024, j'automatise les builds, les tests et la distribution des versions de Guidor, application aviation en production. À titre personnel, j'administre un VPS Linux qui héberge plusieurs services en production, tous déployés automatiquement à chaque push (GitHub Actions, SSH, nginx, PM2, Docker), et j'ai monté une chaîne iOS complète qui signe et envoie une app sur TestFlight sans ouvrir Xcode. Je vise un poste DevOps / Platform où fiabilité et automatisation priment.",
      skills: [
        { cat: 'CI/CD',            tags: 'GitHub Actions (runners Linux & macOS), pipelines multi-étapes, secrets, cache, artefacts, cron' },
        { cat: 'Mobile CI',        tags: 'fastlane (match, gym, pilot, deliver), xcodebuild, signature de code, TestFlight, App Store Connect API' },
        { cat: 'Conteneurs',       tags: 'Docker, Docker Compose, images multi-stage, registres' },
        { cat: 'Systèmes & réseau', tags: 'Linux (Ubuntu), Bash, SSH, nginx (reverse proxy), HTTPS/Let\'s Encrypt, PM2, systemd' },
        { cat: 'Observabilité',    tags: 'journalctl, logs applicatifs, health checks, alertes, sauvegardes automatisées' },
        { cat: 'Qualité',          tags: 'Tests unitaires et d\'intégration (Jest, XCTest), lint, revues de code, Git flow' },
      ],
      jobTitle: 'Développeur Applications — Alternance (CI/CD)',
      bullets: [
        "Automatisé les builds, les tests et la distribution des versions de Guidor via des pipelines GitHub Actions sur runners macOS.",
        "Industrialisé la signature et la publication iOS avec fastlane (match, gym, pilot) : une version testable sur TestFlight à chaque merge.",
        "Fiabilisé la chaîne de livraison (cache des dépendances, tests bloquants, versioning automatique) au sein d'une équipe Agile/Scrum de 5 personnes.",
        "Rédigé la documentation des pipelines et des procédures de release pour l'équipe et le client.",
      ],
      withInternship: false,
      projects: [
        { title: 'Pipeline iOS → TestFlight',   sub: 'Projet personnel — Build, signature et envoi TestFlight automatiques à chaque git push', tags: 'GitHub Actions (macOS), fastlane match, App Store Connect API, xcodebuild' },
        { title: 'Infrastructure personnelle',  sub: 'Projet personnel — VPS Linux hébergeant plusieurs applications en production',          tags: 'Ubuntu, nginx, PM2, systemd, Docker, HTTPS/Let\'s Encrypt, cron, sauvegardes' },
        { title: 'sharik.fr',                   sub: 'Projet personnel — Déploiement continu du portfolio : build Vite puis SCP/SSH à chaque push', tags: 'GitHub Actions, secrets, SSH, nginx, sync App Store planifiée' },
        { title: 'Job Tracker',                 sub: 'Projet personnel — Application web conteneurisée, en production',                     tags: 'Docker Compose, Node.js, PostgreSQL, tests Jest en CI' },
        { title: 'AREA',                        sub: 'Projet Epitech — Plateforme d\'automatisation web + mobile + API livrée par docker-compose', tags: 'Docker Compose, GitHub Actions, microservices, tests automatisés' },
        { title: 'Guidor',                      sub: 'Projet professionnel · Application aviation iOS en production (Skyconseil)',           tags: 'CI/CD GitHub Actions, fastlane, Swift', appStoreUrl: APP_STORE.guidor },
      ],
      epitech: 'Spécialisations cloud et IoT, administration système, DevOps, projets en équipe',
      keywords: ['CI/CD','DevOps','GitHub Actions','fastlane','fastlane match','TestFlight','App Store Connect','xcodebuild','Docker','Docker Compose','Linux','Ubuntu','Bash','SSH','nginx','PM2','systemd','HTTPS','Let\'s Encrypt','cron','monitoring','logs','Jest','XCTest','tests automatisés','Git','déploiement continu','intégration continue','Agile','Scrum','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — DevOps CI/CD Engineer',
      title:    'DevOps Engineer · CI/CD',
      subtitle: 'GitHub Actions · fastlane · Docker · Linux · Cloud',
      summary:  'Work-study developer at Skyconseil since January 2024, automating builds, tests and release distribution for Guidor, a production aviation app. On my own, I run a Linux VPS hosting several production services, all deployed automatically on every push (GitHub Actions, SSH, nginx, PM2, Docker), and I built a full iOS pipeline that signs and ships an app to TestFlight without opening Xcode. Looking for a DevOps / Platform role where reliability and automation come first.',
      skills: [
        { cat: 'CI/CD',            tags: 'GitHub Actions (Linux & macOS runners), multi-stage pipelines, secrets, caching, artifacts, cron' },
        { cat: 'Mobile CI',        tags: 'fastlane (match, gym, pilot, deliver), xcodebuild, code signing, TestFlight, App Store Connect API' },
        { cat: 'Containers',       tags: 'Docker, Docker Compose, multi-stage images, registries' },
        { cat: 'Systems & Network', tags: 'Linux (Ubuntu), Bash, SSH, nginx (reverse proxy), HTTPS/Let\'s Encrypt, PM2, systemd' },
        { cat: 'Observability',    tags: 'journalctl, application logs, health checks, alerting, automated backups' },
        { cat: 'Quality',          tags: 'Unit & integration tests (Jest, XCTest), linting, code review, Git flow' },
      ],
      jobTitle: 'Application Developer — Work-Study (CI/CD)',
      bullets: [
        'Automated builds, tests and release distribution for Guidor through GitHub Actions pipelines on macOS runners.',
        'Industrialised iOS signing and publishing with fastlane (match, gym, pilot): a TestFlight build on every merge.',
        'Hardened the delivery chain (dependency caching, blocking tests, automatic versioning) within a 5-person Agile/Scrum team.',
        'Documented pipelines and release procedures for the team and the client.',
      ],
      withInternship: false,
      projects: [
        { title: 'iOS → TestFlight pipeline',  sub: 'Personal project — Automatic build, signing and TestFlight upload on every git push', tags: 'GitHub Actions (macOS), fastlane match, App Store Connect API, xcodebuild' },
        { title: 'Personal infrastructure',    sub: 'Personal project — Linux VPS hosting several production applications',               tags: 'Ubuntu, nginx, PM2, systemd, Docker, HTTPS/Let\'s Encrypt, cron, backups' },
        { title: 'sharik.fr',                  sub: 'Personal project — Continuous deployment of the portfolio: Vite build then SCP/SSH on push', tags: 'GitHub Actions, secrets, SSH, nginx, scheduled App Store sync' },
        { title: 'Job Tracker',                sub: 'Personal project — Containerised web application in production',                     tags: 'Docker Compose, Node.js, PostgreSQL, Jest tests in CI' },
        { title: 'AREA',                       sub: 'Epitech project — Web + mobile + API automation platform shipped with docker-compose', tags: 'Docker Compose, GitHub Actions, microservices, automated tests' },
        { title: 'Guidor',                     sub: 'Professional project · Aviation iOS app in production (Skyconseil)',                 tags: 'GitHub Actions CI/CD, fastlane, Swift', appStoreUrl: APP_STORE.guidor },
      ],
      epitech: 'Cloud & IoT specialisation, system administration, DevOps, team projects',
      keywords: ['CI/CD','DevOps','GitHub Actions','fastlane','fastlane match','TestFlight','App Store Connect','xcodebuild','Docker','Docker Compose','Linux','Ubuntu','Bash','SSH','nginx','PM2','systemd','HTTPS','Let\'s Encrypt','cron','monitoring','logging','Jest','XCTest','test automation','Git','continuous deployment','continuous integration','Agile','Scrum','work-study','Toulouse'],
    }),
  },

  // ── Web (front-end / full-stack) ───────────────────────────────────────────
  {
    folder: 'CV Web', slug: 'Web',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Développeur Web',
      title:    'Développeur Web · Front-End / Full-Stack',
      subtitle: 'React · TypeScript · Vite · Node.js · UI/UX',
      summary:  "Développeur web, je construis des interfaces React/TypeScript soignées, rapides et responsives, et les API qui les alimentent. Mon portfolio sharik.fr, Job Tracker et le tableau de bord Marvin tournent en production et je les fais évoluer seul. En alternance chez Skyconseil depuis janvier 2024, je développe une application professionnelle en production au sein d'une équipe Agile de 5 personnes, avec une forte attention portée à l'UX et à la qualité du code.",
      skills: [
        { cat: 'Front-End',     tags: 'React 19, TypeScript, JavaScript ES6+, Vite, React Router, HTML5, CSS3, Tailwind CSS' },
        { cat: 'UI & animation', tags: 'Framer Motion, Three.js / React Three Fiber, responsive, accessibilité, design systems' },
        { cat: 'Données & API', tags: 'API REST, fetch/SSE temps réel, cache localStorage, Node.js, Express' },
        { cat: 'Qualité',       tags: 'ESLint, Jest, tests de composants, revues de code, Lighthouse, SEO' },
        { cat: 'Internationalisation', tags: 'i18n multilingue, détection de langue navigateur, contenus FR/EN' },
        { cat: 'Mise en ligne', tags: 'GitHub Actions, nginx, nom de domaine, HTTPS, déploiement continu' },
      ],
      jobTitle: 'Développeur Applications — Alternance',
      bullets: [
        "Développé des écrans et fonctionnalités d'une application professionnelle aviation en production, du parcours utilisateur à la mise en ligne.",
        "Consommé et fiabilisé des API REST et flux JSON, avec gestion du cache et des états de chargement et d'erreur.",
        "Réalisé des outils web internes (tableaux de suivi, documentation interactive) en React et TypeScript pour l'équipe.",
        "Travaillé en équipe Agile/Scrum de 5 personnes : sprints, revues de code, documentation technique interne et client.",
      ],
      withInternship: false,
      projects: [
        { title: 'sharik.fr',   sub: 'Projet personnel — Portfolio, blog et CV générés depuis une même source, liste d\'apps App Store dynamique', tags: 'React 19, TypeScript, Vite, Tailwind, Framer Motion, Three.js' },
        { title: 'Job Tracker', sub: 'Projet personnel — Application web de suivi et d\'automatisation de candidatures, en production',          tags: 'React, Vite, Node.js, Express, PostgreSQL, SSE temps réel' },
        { title: 'Marvin',      sub: 'Projet personnel — Tableau de bord personnel (sport, nutrition, agenda) connecté à Google',               tags: 'SPA JavaScript, FastAPI, Google OAuth, Google Calendar API' },
        { title: 'dave',        sub: 'Projet personnel — Éditeur vidéo à timeline dans le navigateur, rendu programmatique',                     tags: 'React, TypeScript, Vite, Remotion, API Node' },
        { title: 'AREA',        sub: 'Projet Epitech — Plateforme d\'automatisation type IFTTT : client web, client mobile et API',               tags: 'React, TypeScript, Node.js, OAuth2, Docker Compose' },
      ],
      epitech: 'JavaScript, React.js, développement web full-stack, algorithmique, projets en équipe',
      keywords: ['React','React.js','TypeScript','JavaScript','Vite','HTML','CSS','Tailwind CSS','Framer Motion','Three.js','React Three Fiber','Node.js','Express','API REST','SSE','responsive','accessibilité','SEO','i18n','Jest','ESLint','GitHub Actions','nginx','front-end','full-stack','développeur web','UI/UX','Agile','Scrum','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — Web Developer',
      title:    'Web Developer · Front-End / Full-Stack',
      subtitle: 'React · TypeScript · Vite · Node.js · UI/UX',
      summary:  'Web developer building polished, fast and responsive React/TypeScript interfaces, and the APIs behind them. My portfolio sharik.fr, Job Tracker and the Marvin dashboard run in production and I evolve them on my own. Work-study developer at Skyconseil since January 2024, building a professional production app within a 5-person Agile team, with a strong focus on UX and code quality.',
      skills: [
        { cat: 'Front-End',     tags: 'React 19, TypeScript, JavaScript ES6+, Vite, React Router, HTML5, CSS3, Tailwind CSS' },
        { cat: 'UI & Motion',   tags: 'Framer Motion, Three.js / React Three Fiber, responsive design, accessibility, design systems' },
        { cat: 'Data & APIs',   tags: 'REST APIs, fetch/SSE real-time, localStorage caching, Node.js, Express' },
        { cat: 'Quality',       tags: 'ESLint, Jest, component tests, code review, Lighthouse, SEO' },
        { cat: 'Internationalisation', tags: 'Multilingual i18n, browser language detection, FR/EN content' },
        { cat: 'Shipping',      tags: 'GitHub Actions, nginx, domains, HTTPS, continuous deployment' },
      ],
      jobTitle: 'Application Developer — Work-Study',
      bullets: [
        'Built screens and features of a professional aviation app in production, from user journey to release.',
        'Consumed and hardened REST APIs and JSON feeds, handling caching, loading and error states.',
        'Built internal web tools (tracking dashboards, interactive documentation) in React and TypeScript for the team.',
        'Worked in a 5-person Agile/Scrum team: sprints, code reviews, internal and client-facing technical documentation.',
      ],
      withInternship: false,
      projects: [
        { title: 'sharik.fr',   sub: 'Personal project — Portfolio, blog and CVs generated from one source, live App Store app list', tags: 'React 19, TypeScript, Vite, Tailwind, Framer Motion, Three.js' },
        { title: 'Job Tracker', sub: 'Personal project — Job application tracking & automation web app, in production',             tags: 'React, Vite, Node.js, Express, PostgreSQL, real-time SSE' },
        { title: 'Marvin',      sub: 'Personal project — Personal dashboard (sport, nutrition, calendar) connected to Google',        tags: 'JavaScript SPA, FastAPI, Google OAuth, Google Calendar API' },
        { title: 'dave',        sub: 'Personal project — In-browser timeline video editor with programmatic rendering',               tags: 'React, TypeScript, Vite, Remotion, Node API' },
        { title: 'AREA',        sub: 'Epitech project — IFTTT-like automation platform: web client, mobile client and API',           tags: 'React, TypeScript, Node.js, OAuth2, Docker Compose' },
      ],
      epitech: 'JavaScript, React.js, full-stack web development, algorithms, team projects',
      keywords: ['React','React.js','TypeScript','JavaScript','Vite','HTML','CSS','Tailwind CSS','Framer Motion','Three.js','React Three Fiber','Node.js','Express','REST API','SSE','responsive design','accessibility','SEO','i18n','Jest','ESLint','GitHub Actions','nginx','front-end','full-stack','Web Developer','UI/UX','Agile','Scrum','work-study','Toulouse'],
    }),
  },

  // ── Back-End ───────────────────────────────────────────────────────────────
  {
    folder: 'CV Backend', slug: 'Backend',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Développeur Back-End',
      title:    'Développeur Back-End',
      subtitle: 'Node.js · Python / FastAPI · PostgreSQL · API REST',
      summary:  "Développeur back-end, je conçois des API, modélise les données et exploite moi-même les services que j'écris, sur un serveur Linux que j'administre. Plusieurs de mes services tournent en production : Job Tracker (Node/Express/PostgreSQL), l'API d'authentification Terrafocus, le back-end FastAPI de Marvin et un serveur de jeu temps réel en WebSocket. En alternance chez Skyconseil depuis janvier 2024, je consomme et fiabilise des API REST et des flux de données au sein d'une équipe Agile de 5 personnes.",
      skills: [
        { cat: 'Langages & frameworks', tags: 'Node.js, Express, Python, FastAPI, Flask, TypeScript, C/C++' },
        { cat: 'API',             tags: 'REST, WebSocket, SSE, OpenAPI/Swagger, Pydantic, pagination, versioning' },
        { cat: 'Données',         tags: 'PostgreSQL, SQLite, SQLAlchemy, SQL, modélisation, migrations, index' },
        { cat: 'Auth & sécurité', tags: 'JWT, OAuth 2.0 (Google), Sign in with Apple, cookies HttpOnly, gestion des secrets' },
        { cat: 'Exploitation',    tags: 'Linux, Docker, nginx, PM2, systemd, cron, logs, sauvegardes' },
        { cat: 'Qualité',         tags: 'Tests unitaires et d\'intégration (Jest, pytest), revues de code, documentation' },
      ],
      jobTitle: 'Développeur Applications — Alternance',
      bullets: [
        "Consommé et fiabilisé des API REST et des flux de données JSON dans une application aviation en production, avec gestion du cache et des erreurs.",
        "Conçu des services internes de préparation et de validation des données cartographiques consommées par l'application.",
        "Automatisé les builds, les tests et la distribution des versions via des pipelines GitHub Actions.",
      ],
      withInternship: true,
      projects: [
        { title: 'Job Tracker',          sub: 'Projet personnel — Suivi et automatisation de candidatures, en production', tags: 'Node.js, Express, PostgreSQL, Docker, SSE temps réel, tests Jest' },
        { title: 'Marvin',               sub: 'Projet personnel — Back-end d\'un tracker de vie : sport, nutrition, agenda, coach algorithmique', tags: 'Python, FastAPI, SQLAlchemy, SQLite, JWT, Google OAuth, systemd' },
        { title: 'Terrafocus API',       sub: 'Projet personnel — API d\'authentification et de données pour une app mobile', tags: 'Node.js, Express, SQLite, JWT, OAuth 2.0, Sign in with Apple, nginx' },
        { title: 'Pixel Tactics Server', sub: 'Projet personnel — Serveur de jeu temps réel multi-joueurs',                    tags: 'Node.js, WebSocket, Docker, Google OAuth' },
        { title: 'MyTeams / Zappy',      sub: 'Projets Epitech — Serveurs réseau multi-clients (protocole maison, sockets, select)', tags: 'C, C++, TCP, protocoles binaires' },
      ],
      epitech: 'Programmation réseau, bases de données, cloud, algorithmique, projets en équipe',
      keywords: ['back-end','Node.js','Express','Python','FastAPI','Flask','TypeScript','API REST','WebSocket','SSE','OpenAPI','PostgreSQL','SQLite','SQLAlchemy','SQL','JWT','OAuth 2.0','Docker','Linux','nginx','PM2','systemd','Jest','pytest','C','C++','microservices','GitHub Actions','Agile','Scrum','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — Back-End Developer',
      title:    'Back-End Developer',
      subtitle: 'Node.js · Python / FastAPI · PostgreSQL · REST APIs',
      summary:  'Back-end developer designing APIs, modelling data and running the services I write myself on a Linux server I administer. Several of my services are in production: Job Tracker (Node/Express/PostgreSQL), the Terrafocus authentication API, the FastAPI back-end of Marvin and a real-time WebSocket game server. Work-study developer at Skyconseil since January 2024, consuming and hardening REST APIs and data feeds within a 5-person Agile team.',
      skills: [
        { cat: 'Languages & Frameworks', tags: 'Node.js, Express, Python, FastAPI, Flask, TypeScript, C/C++' },
        { cat: 'APIs',            tags: 'REST, WebSocket, SSE, OpenAPI/Swagger, Pydantic, pagination, versioning' },
        { cat: 'Data',            tags: 'PostgreSQL, SQLite, SQLAlchemy, SQL, data modelling, migrations, indexing' },
        { cat: 'Auth & Security', tags: 'JWT, OAuth 2.0 (Google), Sign in with Apple, HttpOnly cookies, secrets management' },
        { cat: 'Operations',      tags: 'Linux, Docker, nginx, PM2, systemd, cron, logging, backups' },
        { cat: 'Quality',         tags: 'Unit & integration tests (Jest, pytest), code review, documentation' },
      ],
      jobTitle: 'Application Developer — Work-Study',
      bullets: [
        'Consumed and hardened REST APIs and JSON data feeds in a production aviation app, handling caching and errors.',
        'Designed internal services that prepare and validate the map data consumed by the app.',
        'Automated builds, tests and release distribution through GitHub Actions pipelines.',
        'Worked in a 5-person Agile/Scrum team: sprints, code reviews, internal and client-facing technical documentation.',
      ],
      withInternship: true,
      projects: [
        { title: 'Job Tracker',          sub: 'Personal project — Job application tracking & automation, in production', tags: 'Node.js, Express, PostgreSQL, Docker, real-time SSE, Jest tests' },
        { title: 'Marvin',               sub: 'Personal project — Life-tracker back-end: sport, nutrition, calendar, algorithmic coach', tags: 'Python, FastAPI, SQLAlchemy, SQLite, JWT, Google OAuth, systemd' },
        { title: 'Terrafocus API',       sub: 'Personal project — Authentication and data API for a mobile app',          tags: 'Node.js, Express, SQLite, JWT, OAuth 2.0, Sign in with Apple, nginx' },
        { title: 'Pixel Tactics Server', sub: 'Personal project — Real-time multiplayer game server',                     tags: 'Node.js, WebSocket, Docker, Google OAuth' },
        { title: 'MyTeams / Zappy',      sub: 'Epitech projects — Multi-client network servers (custom protocol, sockets, select)', tags: 'C, C++, TCP, binary protocols' },
      ],
      epitech: 'Network programming, databases, cloud, algorithms, team projects',
      keywords: ['back-end','Node.js','Express','Python','FastAPI','Flask','TypeScript','REST API','WebSocket','SSE','OpenAPI','PostgreSQL','SQLite','SQLAlchemy','SQL','JWT','OAuth 2.0','Docker','Linux','nginx','PM2','systemd','Jest','pytest','C','C++','microservices','GitHub Actions','Agile','Scrum','work-study','Toulouse'],
    }),
  },

  // ── Cybersécurité ──────────────────────────────────────────────────────────
  {
    folder: 'CV Cyber', slug: 'Cyber',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Cybersécurité',
      title:    'Ingénieur Cybersécurité · Développement Sécurisé',
      subtitle: 'AppSec · OWASP · Pentest · Durcissement Linux',
      summary:  "Formé à la cybersécurité à Epitech (spécialisation), je l'applique au quotidien en développeur : authentification, gestion des secrets, durcissement des serveurs que j'exploite en production et revue de code orientée sécurité. En alternance chez Skyconseil depuis janvier 2024 sur une application aviation professionnelle, j'ai contribué à la sécurisation des échanges et de la chaîne de livraison. Je recherche un poste en sécurité applicative (AppSec / DevSecOps) ou en audit.",
      skills: [
        { cat: 'Sécurité applicative', tags: 'OWASP Top 10, injections SQL/XSS/CSRF, contrôle d\'accès, revue de code sécurité' },
        { cat: 'Offensif',        tags: 'Pentest web, Burp Suite, Nmap, Metasploit, Wireshark, CTF (web, crypto, forensics)' },
        { cat: 'Auth & crypto',   tags: 'JWT, OAuth 2.0, Sign in with Apple, TLS, hachage (bcrypt), Keychain, chiffrement' },
        { cat: 'Durcissement',    tags: 'Linux, SSH par clé sur port dédié, pare-feu (ufw), fail2ban, nginx, HTTPS/Let\'s Encrypt' },
        { cat: 'DevSecOps',       tags: 'Secrets GitHub Actions, audit de dépendances (npm audit, Dependabot), moindre privilège' },
        { cat: 'Développement',   tags: 'Python, Bash, C, Node.js, Swift — scripts d\'audit et d\'automatisation' },
      ],
      jobTitle: 'Développeur Applications — Alternance',
      bullets: [
        "Sécurisé les échanges d'une application aviation en production : HTTPS, stockage des jetons dans le Keychain, validation des données entrantes.",
        "Protégé la chaîne de livraison : secrets chiffrés dans GitHub Actions, certificats de signature centralisés (fastlane match), accès minimaux.",
        "Mené des revues de code orientées sécurité et suivi les vulnérabilités des dépendances tierces.",
        "Travaillé en équipe Agile/Scrum de 5 personnes et documenté les pratiques de sécurité pour l'équipe et le client.",
      ],
      withInternship: false,
      projects: [
        { title: 'Audit & pentest web',     sub: 'Projet Epitech — Audit d\'une application web vulnérable, rapport et plan de remédiation', tags: 'OWASP Top 10, Burp Suite, Nmap, injections, élévation de privilèges' },
        { title: 'CTF & Root-Me',           sub: 'Epitech & personnel — Épreuves web, cryptographie, réseau et forensics',            tags: 'Wireshark, Python, Bash, analyse de trafic, stéganographie' },
        { title: 'Infrastructure durcie',   sub: 'Projet personnel — VPS Linux exposé en production, services isolés',                 tags: 'SSH par clé, ufw, fail2ban, nginx, HTTPS, sauvegardes, journaux' },
        { title: 'Terrafocus API',          sub: 'Projet personnel — API d\'authentification multi-fournisseur en production',         tags: 'JWT, OAuth 2.0, Sign in with Apple, nginx, gestion des secrets' },
        { title: 'Marvin',                  sub: 'Projet personnel — Application privée : accès restreint, sessions sécurisées',       tags: 'FastAPI, cookies HttpOnly, JWT, Google OAuth, liste d\'autorisation' },
        { title: 'Guidor',                  sub: 'Projet professionnel · Application aviation iOS en production (Skyconseil)',          tags: 'Swift, Keychain, HTTPS, CI/CD sécurisée', appStoreUrl: APP_STORE.guidor },
      ],
      epitech: 'Spécialisation cybersécurité : sécurité réseau et web, pentest, cryptographie, cloud et IoT',
      keywords: ['cybersécurité','sécurité applicative','AppSec','DevSecOps','OWASP','OWASP Top 10','pentest','test d\'intrusion','Burp Suite','Nmap','Metasploit','Wireshark','CTF','Root-Me','cryptographie','TLS','JWT','OAuth 2.0','Linux','durcissement','SSH','fail2ban','pare-feu','nginx','gestion des secrets','revue de code','Python','Bash','GitHub Actions','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — Cybersecurity',
      title:    'Cybersecurity Engineer · Secure Development',
      subtitle: 'AppSec · OWASP · Pentesting · Linux Hardening',
      summary:  'Trained in cybersecurity at Epitech (specialisation), I apply it daily as a developer: authentication, secrets management, hardening the servers I run in production and security-focused code review. Work-study developer at Skyconseil since January 2024 on a professional aviation app, where I helped secure data exchange and the delivery chain. Looking for an application security (AppSec / DevSecOps) or audit role.',
      skills: [
        { cat: 'Application Security', tags: 'OWASP Top 10, SQL injection/XSS/CSRF, access control, security code review' },
        { cat: 'Offensive',        tags: 'Web pentesting, Burp Suite, Nmap, Metasploit, Wireshark, CTF (web, crypto, forensics)' },
        { cat: 'Auth & Crypto',    tags: 'JWT, OAuth 2.0, Sign in with Apple, TLS, hashing (bcrypt), Keychain, encryption' },
        { cat: 'Hardening',        tags: 'Linux, key-only SSH on a dedicated port, firewall (ufw), fail2ban, nginx, HTTPS/Let\'s Encrypt' },
        { cat: 'DevSecOps',        tags: 'GitHub Actions secrets, dependency audits (npm audit, Dependabot), least privilege' },
        { cat: 'Development',      tags: 'Python, Bash, C, Node.js, Swift — audit and automation scripts' },
      ],
      jobTitle: 'Application Developer — Work-Study',
      bullets: [
        'Secured data exchange in a production aviation app: HTTPS, Keychain token storage, input validation.',
        'Protected the delivery chain: encrypted GitHub Actions secrets, centralised signing certificates (fastlane match), minimal access.',
        'Ran security-focused code reviews and tracked vulnerabilities in third-party dependencies.',
        'Worked in a 5-person Agile/Scrum team and documented security practices for the team and the client.',
      ],
      withInternship: false,
      projects: [
        { title: 'Web audit & pentest',   sub: 'Epitech project — Audit of a vulnerable web app, report and remediation plan', tags: 'OWASP Top 10, Burp Suite, Nmap, injections, privilege escalation' },
        { title: 'CTF & Root-Me',         sub: 'Epitech & personal — Web, cryptography, network and forensics challenges',   tags: 'Wireshark, Python, Bash, traffic analysis, steganography' },
        { title: 'Hardened infrastructure', sub: 'Personal project — Internet-facing Linux VPS in production, isolated services', tags: 'Key-only SSH, ufw, fail2ban, nginx, HTTPS, backups, logs' },
        { title: 'Terrafocus API',        sub: 'Personal project — Multi-provider authentication API in production',          tags: 'JWT, OAuth 2.0, Sign in with Apple, nginx, secrets management' },
        { title: 'Marvin',                sub: 'Personal project — Private app: restricted access, secure sessions',          tags: 'FastAPI, HttpOnly cookies, JWT, Google OAuth, allow-list' },
        { title: 'Guidor',                sub: 'Professional project · Aviation iOS app in production (Skyconseil)',          tags: 'Swift, Keychain, HTTPS, secured CI/CD', appStoreUrl: APP_STORE.guidor },
      ],
      epitech: 'Cybersecurity specialisation: network & web security, pentesting, cryptography, cloud & IoT',
      keywords: ['cybersecurity','application security','AppSec','DevSecOps','OWASP','OWASP Top 10','pentesting','penetration testing','Burp Suite','Nmap','Metasploit','Wireshark','CTF','Root-Me','cryptography','TLS','JWT','OAuth 2.0','Linux','hardening','SSH','fail2ban','firewall','nginx','secrets management','code review','Python','Bash','GitHub Actions','work-study','Toulouse'],
    }),
  },

  // ── IA ─────────────────────────────────────────────────────────────────────
  {
    folder: 'CV IA', slug: 'IA',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Développeur IA',
      title:    'Développeur IA · Intégration LLM',
      subtitle: 'LLM · Agents · MCP · Python · Automatisation',
      summary:  "Développeur orienté IA appliquée, j'intègre des modèles de langage dans de vrais produits : agents outillés, serveurs MCP, génération de contenu et automatisation de bout en bout. J'ai construit Marvin, un assistant personnel dont le back-end FastAPI est exposé à des agents LLM via un serveur MCP, et plusieurs pipelines de génération (images, voix, vidéo) pilotés par API. En alternance chez Skyconseil depuis janvier 2024, j'utilise l'IA pour accélérer le développement et la documentation d'une application aviation en production.",
      skills: [
        { cat: 'LLM & API',       tags: 'Claude (Anthropic), Mistral, Gemini, OpenAI — prompt engineering, tool use, sorties structurées JSON' },
        { cat: 'Agents',          tags: 'Model Context Protocol (MCP), agents outillés, orchestration multi-agents, Claude Code' },
        { cat: 'Données & RAG',   tags: 'Embeddings, recherche sémantique, découpage de documents, base de connaissances Markdown' },
        { cat: 'IA générative',   tags: 'Génération d\'images, synthèse vocale (ElevenLabs), transcription (Whisper), vidéo programmatique' },
        { cat: 'Python & back-end', tags: 'Python, FastAPI, Pydantic, Node.js, jobs planifiés, API REST' },
        { cat: 'Algorithmique',   tags: 'Reconnaissance de tracés (template matching), IA de jeu, heuristiques, algorithmes de décision' },
      ],
      jobTitle: 'Développeur Applications — Alternance',
      bullets: [
        "Intégré des assistants IA au flux de l'équipe : génération de tests, revue de code et documentation technique d'une application aviation en production.",
        "Automatisé la rédaction de documentation et de notes de version à partir de l'historique Git et des tickets.",
        "Développé des fonctionnalités UIKit/SwiftUI en MVVM au sein d'une équipe Agile/Scrum de 5 personnes.",
      ],
      withInternship: false,
      projects: [
        { title: 'Marvin',               sub: 'Projet personnel — Assistant personnel piloté par agents LLM via un serveur MCP (100+ outils)', tags: 'Python, FastAPI, MCP, Mistral, Claude, Google Calendar API' },
        { title: 'Pipeline vidéo IA',    sub: 'Projet personnel — Du script au mp4 : voix off, sous-titres mot à mot, images générées',       tags: 'LLM, ElevenLabs, Whisper, Gemini, Remotion, React' },
        { title: 'Job Tracker',          sub: 'Projet personnel — Tri et rédaction assistés par LLM des candidatures, en production',          tags: 'Node.js, API LLM, PostgreSQL, sorties structurées' },
        { title: 'Reconnaissance de sorts', sub: 'Projet personnel (jeu) — Reconnaît un symbole dessiné au doigt avec un score de confiance', tags: 'Template matching, normalisation géométrique, GDScript' },
        { title: 'IA de jeu',            sub: 'Projets Epitech & personnels — Adversaires IA pour jeux de stratégie et de cartes',             tags: 'Minimax, heuristiques, simulation, moteur déterministe' },
      ],
      epitech: 'Algorithmique, intelligence artificielle, cloud, projets en équipe',
      keywords: ['intelligence artificielle','IA','IA générative','LLM','Claude','Anthropic','Mistral','Gemini','OpenAI','prompt engineering','agents','agents IA','MCP','Model Context Protocol','tool use','RAG','embeddings','Python','FastAPI','Pydantic','Node.js','Whisper','ElevenLabs','automatisation','API REST','algorithmique','minimax','Agile','alternance','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — AI Developer',
      title:    'AI Developer · LLM Integration',
      subtitle: 'LLMs · Agents · MCP · Python · Automation',
      summary:  'Applied-AI developer integrating language models into real products: tool-using agents, MCP servers, content generation and end-to-end automation. I built Marvin, a personal assistant whose FastAPI back-end is exposed to LLM agents through an MCP server, plus several API-driven generation pipelines (images, voice, video). Work-study developer at Skyconseil since January 2024, using AI to speed up development and documentation of a production aviation app.',
      skills: [
        { cat: 'LLMs & APIs',     tags: 'Claude (Anthropic), Mistral, Gemini, OpenAI — prompt engineering, tool use, structured JSON output' },
        { cat: 'Agents',          tags: 'Model Context Protocol (MCP), tool-using agents, multi-agent orchestration, Claude Code' },
        { cat: 'Data & RAG',      tags: 'Embeddings, semantic search, document chunking, Markdown knowledge base' },
        { cat: 'Generative AI',   tags: 'Image generation, text-to-speech (ElevenLabs), transcription (Whisper), programmatic video' },
        { cat: 'Python & Back-End', tags: 'Python, FastAPI, Pydantic, Node.js, scheduled jobs, REST APIs' },
        { cat: 'Algorithms',      tags: 'Gesture recognition (template matching), game AI, heuristics, decision algorithms' },
      ],
      jobTitle: 'Application Developer — Work-Study',
      bullets: [
        "Brought AI assistants into the team's workflow: test generation, code review and technical documentation of a production aviation app.",
        'Automated documentation and release notes from Git history and tickets.',
        'Built UIKit/SwiftUI features in MVVM within a 5-person Agile/Scrum team.',
      ],
      withInternship: false,
      projects: [
        { title: 'Marvin',            sub: 'Personal project — Personal assistant driven by LLM agents through an MCP server (100+ tools)', tags: 'Python, FastAPI, MCP, Mistral, Claude, Google Calendar API' },
        { title: 'AI video pipeline', sub: 'Personal project — From script to mp4: voice-over, word-level subtitles, generated images',    tags: 'LLM, ElevenLabs, Whisper, Gemini, Remotion, React' },
        { title: 'Job Tracker',       sub: 'Personal project — LLM-assisted triage and writing of job applications, in production',       tags: 'Node.js, LLM API, PostgreSQL, structured output' },
        { title: 'Spell recognition', sub: 'Personal project (game) — Recognises a finger-drawn symbol with a confidence score',           tags: 'Template matching, geometric normalisation, GDScript' },
        { title: 'Game AI',           sub: 'Epitech & personal projects — AI opponents for strategy and card games',                       tags: 'Minimax, heuristics, simulation, deterministic engine' },
      ],
      epitech: 'Algorithms, artificial intelligence, cloud, team projects',
      keywords: ['artificial intelligence','AI','generative AI','LLM','Claude','Anthropic','Mistral','Gemini','OpenAI','prompt engineering','agents','AI agents','MCP','Model Context Protocol','tool use','RAG','embeddings','Python','FastAPI','Pydantic','Node.js','Whisper','ElevenLabs','automation','REST API','algorithms','minimax','Agile','work-study','Toulouse'],
    }),
  },
  // ── Ingénieur logiciel (full-stack + mobile, Guidor first) ─────────────────
  // Achievement-led: figures in the bullets, no tech line under projects.
  {
    folder: 'CV Ingénieur Logiciel', slug: 'Ingenieur-Logiciel',
    fr: cv('fr', {
      docTitle: 'CV Sharik Abubucker — Ingénieur Architecte Logiciel',
      title:    'Ingénieur Architecte Logiciel · Full-Stack & Mobile',
      subtitle: 'iOS / Swift · Java / Spring Boot · React / TypeScript · Node.js',
      summary:  "Ingénieur logiciel (Master Epitech, niveau ingénieur). En alternance chez Skyconseil depuis janvier 2024, je fais évoluer Guidor, application iOS de vol utilisée par plus de 6 000 pilotes : j'ai contribué à sa v2, avec une refonte visuelle, la migration Mapbox v6 → v11 et la modernisation d'un code de plus de 10 ans. En 2025, j'ai aussi développé en bénévole une API Java / Spring Boot pour Les Frigos Solidaires. À titre personnel, j'ai publié 8 apps sur l'App Store (+2 000 téléchargements), livrées par mes propres pipelines CI/CD.",
      skills: [
        { cat: 'Mobile',         tags: 'Swift, SwiftUI, UIKit, MVVM, async/await, MapboxMaps SDK, SwiftData, XCTest' },
        { cat: 'Back-End',       tags: 'Java, Spring Boot, Node.js, Express, Python, FastAPI, API REST, PostgreSQL, JWT' },
        { cat: 'Front-End',      tags: 'React, TypeScript, Vite, Tailwind CSS' },
        { cat: 'Livraison',      tags: 'Git, GitHub Actions, fastlane, TestFlight, Docker, Linux, nginx, Agile/Scrum' },
      ],
      jobTitle: 'Ingénieur Logiciel iOS — Guidor',
      aeroBullet: false,
      bullets: [
        "Guidor : application de vol utilisée par plus de 6 000 pilotes de 2 compagnies aériennes (British Airways, Japan Airlines) — trajectoire, météo TAF/METAR, trafic ADS-B.",
        "Contribué à la v2, livrée en production à tous les pilotes, au sein d'une équipe de 2-3 développeurs iOS : refonte visuelle de la quasi-totalité des interfaces.",
        "Migré le MapboxMaps SDK de la v6 à la v11, un chantier qui a touché l'ensemble de l'application (cartes, annotations, tuiles raster).",
        "Refactoré un code legacy de plus de 10 ans vers MVVM, SwiftUI et async/await, dans une équipe Agile/Scrum passée de 5 à 10 personnes.",
      ],
      extraExperiences: [COMMON.fr.frigos],
      withInternship: true,
      projects: [
        { title: 'Guidor',         sub: 'Projet professionnel · Application iOS de vol, +6 000 pilotes (Skyconseil)', appStoreUrl: APP_STORE.guidor },
        { title: '8 apps publiées', sub: 'Projets personnels · Publiées seul, +2 000 téléchargements (Meow-Tube 4.9 ★, DuoBook…)', appStoreUrl: APP_STORE.meowTube },
      ],
      epitech: 'Architecture logicielle, développement full-stack et mobile, cloud, projets en équipe',
      keywords: ['ingénieur logiciel','architecte logiciel','architecture logicielle','full-stack','mobile','iOS','Swift','SwiftUI','UIKit','MVVM','async/await','Mapbox','refactoring','code legacy','Java','Spring Boot','API REST','Node.js','Python','FastAPI','PostgreSQL','React','TypeScript','Docker','Linux','GitHub Actions','fastlane','CI/CD','Agile','Scrum','Toulouse'],
    }),
    en: cv('en', {
      docTitle: 'CV Sharik Abubucker — Software Architect Engineer',
      title:    'Software Architect Engineer · Full-Stack & Mobile',
      subtitle: 'iOS / Swift · Java / Spring Boot · React / TypeScript · Node.js',
      summary:  "Software engineer (Epitech Master's, engineering level). Work-study at Skyconseil since January 2024, evolving Guidor, an iOS in-flight app used by 6,000+ pilots: I contributed to its v2, with a visual redesign, the Mapbox v6 → v11 migration and the modernisation of a 10+-year-old codebase. In 2025 I also volunteered as a Java / Spring Boot API developer for Les Frigos Solidaires. On my own, I have shipped 8 App Store apps (2,000+ downloads), delivered through my own CI/CD pipelines.",
      skills: [
        { cat: 'Mobile',         tags: 'Swift, SwiftUI, UIKit, MVVM, async/await, MapboxMaps SDK, SwiftData, XCTest' },
        { cat: 'Back-End',       tags: 'Java, Spring Boot, Node.js, Express, Python, FastAPI, REST APIs, PostgreSQL, JWT' },
        { cat: 'Front-End',      tags: 'React, TypeScript, Vite, Tailwind CSS' },
        { cat: 'Delivery',       tags: 'Git, GitHub Actions, fastlane, TestFlight, Docker, Linux, nginx, Agile/Scrum' },
      ],
      jobTitle: 'iOS Software Engineer — Guidor',
      aeroBullet: false,
      bullets: [
        'Guidor: in-flight app used by 6,000+ pilots at 2 airlines (British Airways, Japan Airlines) — flight path, TAF/METAR weather, ADS-B traffic.',
        'Contributed to v2, shipped to every pilot, within a team of 2-3 iOS developers: visual redesign of nearly every screen.',
        'Migrated MapboxMaps SDK from v6 to v11, a change that touched the whole app (maps, annotations, raster tiles).',
        'Refactored a 10+-year-old legacy codebase towards MVVM, SwiftUI and async/await, in an Agile/Scrum team that grew from 5 to 10 people.',
      ],
      extraExperiences: [COMMON.en.frigos],
      withInternship: true,
      projects: [
        { title: 'Guidor',          sub: 'Professional project · iOS in-flight app, 6,000+ pilots (Skyconseil)', appStoreUrl: APP_STORE.guidor },
        { title: '8 published apps', sub: 'Personal projects · Shipped solo, 2,000+ downloads (Meow-Tube 4.9 ★, DuoBook…)', appStoreUrl: APP_STORE.meowTube },
      ],
      epitech: 'Software architecture, full-stack and mobile development, cloud, team projects',
      keywords: ['software engineer','software architect','software architecture','full-stack','mobile','iOS','Swift','SwiftUI','UIKit','MVVM','async/await','Mapbox','refactoring','legacy code','Java','Spring Boot','REST API','Node.js','Python','FastAPI','PostgreSQL','React','TypeScript','Docker','Linux','GitHub Actions','fastlane','CI/CD','Agile','Scrum','Toulouse'],
    }),
  },
];

module.exports = { VARIANTS, cv, APP_STORE };
