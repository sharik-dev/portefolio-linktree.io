const BASE = window.location.origin;

const DATA = {
  fr: {
    title: 'Développeur iOS · Ingénieur Logiciel',
    subtitle: 'Mobile · Web · CI/CD · IA',
    summary: 'Alternant développeur iOS chez Skyconseil depuis janvier 2024, je travaille sur Guidor — une application aviation professionnelle intégrant MapboxMaps SDK v10+, UIKit et architecture MVVM. En parallèle, j\'ai publié seul 3 applications sur l\'App Store (4.7 à 4.9 étoiles). Profil full-stack issu d\'une montée en compétences progressive : Swift, React.js, CI/CD, embarqué C++, avec une appétence pour l\'IA mobile et le cloud.',
    sections: {
      skills: 'Compétences Clés',
      experience: 'Expériences Professionnelles',
      projects: 'Projets',
      education: 'Formation',
      languages: 'Langues',
      keywords: 'Mots-clés ATS',
    },
    skills: [
      { cat: 'Mobile iOS', tags: 'Swift, SwiftUI, UIKit, AVFoundation' },
      { cat: 'Architecture', tags: 'MVVM, MVC, Clean Architecture' },
      { cat: 'Cartographie', tags: 'MapboxMaps SDK v10+, filtres JSON' },
      { cat: 'DevOps / CI/CD', tags: 'Git, GitHub Actions, pipelines automatisés, Tests unitaires' },
      { cat: 'Web & Cloud', tags: 'React.js, TypeScript, JavaScript' },
      { cat: 'Embarqué & Méthodes', tags: 'C++, Arduino, Agile/Scrum, REST API' },
    ],
    experiences: [
      {
        logo: `${BASE}/cv-assets/guidor.png`,
        title: 'Développeur Applications iOS — Alternance',
        company: 'Skyconseil',
        badge: 'Alternance',
        period: 'Janvier 2024 – Septembre 2026 · Toulouse, France',
        bullets: [
          'Développé et intégré le MapboxMaps SDK v10+ sur Guidor, application aviation iOS en production : 3 couches météo superposées (METAR, TAF, turbulences), annotations cartographiques dynamiques et tuiles raster.',
          'Implémenté des fonctionnalités UIKit et SwiftUI suivant l\'architecture MVVM au sein d\'une équipe Agile/Scrum de 5 personnes.',
          'Rédigé la documentation technique interne et client couvrant l\'ensemble des modules cartographiques.',
          'Mis en place et maintenu des pipelines CI/CD avec GitHub Actions pour l\'automatisation des builds et des tests unitaires.',
        ],
      },
      {
        logo: `${BASE}/cv-assets/comb.png`,
        title: 'Stagiaire Développeur Embarqué',
        company: 'Le Facteur Humain & Combustible Numérique',
        badge: 'Stage',
        period: 'Juin 2023 – Juillet 2023 · Toulouse, France',
        bullets: [
          'Développé un système de guidage embarqué (projet Guidor) en Arduino et C++, intégrant capteurs, actionneurs et interface de contrôle dans une équipe pluridisciplinaire.',
        ],
      },
    ],
    projects: [
      { title: 'Guidor', sub: 'Projet professionnel · Application aviation iOS en production (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, couches météo METAR/TAF, CI/CD', appStoreUrl: 'https://apps.apple.com/fr/app/guidor/id1072066692' },
      { title: 'Meow-Tube', sub: 'Projet personnel · App Store · 4.9 ★ — YouTube sans pub ni Shorts, sans abonnement (comme Brave pour le web)', tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API', appStoreUrl: 'https://apps.apple.com/fr/app/meow-tube/id6760180650' },
      { title: 'Islamic Daily Quote', sub: 'Projet personnel · App Store · 4.8 ★ — Citations islamiques quotidiennes, multilingue', tags: 'Swift, SwiftUI, Notifications, Mode sombre', appStoreUrl: 'https://apps.apple.com/fr/app/islamic-daily-quote/id6760481474' },
    ],
    education: [
      { title: 'Licence Informatique (BAC+5)', school: 'Epitech', period: 'Août 2023 – Sept. 2026' },
      { title: 'AFP Concepteur Développeur d\'Applications iOS', school: 'Simplon Auvergne-Rhône-Alpes', period: 'Avr. – Juil. 2023' },
      { title: 'BTS Management des Unités Commerciales', school: 'Écoles Billières', period: 'Sept. 2020 – Juil. 2022 · Management, Marketing & Commerce · Reconversion vers l\'informatique' },
    ],
    languages: 'Français — Natif · Malgache — Natif · Anglais — Avancé (B2/C1)',
    keywords: ['Swift', 'iOS', 'SwiftUI', 'UIKit', 'MVVM', 'MapboxMaps', 'Mapbox SDK', 'CI/CD', 'GitHub Actions', 'Tests unitaires', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'AVFoundation', 'React.js', 'TypeScript', 'C++', 'Arduino', 'App Store'],
  },
  en: {
    title: 'iOS Developer · Software Engineer',
    subtitle: 'Mobile · Web · CI/CD · AI',
    summary: 'Work-study iOS developer at Skyconseil since January 2024, building Guidor — a professional aviation app integrating MapboxMaps SDK v10+, UIKit, and MVVM architecture. Independently published 3 apps on the App Store (4.7 to 4.9 stars). Full-stack profile built through progressive skill development: Swift, React.js, CI/CD, embedded C++, with a strong interest in mobile AI and cloud.',
    sections: {
      skills: 'Core Skills',
      experience: 'Professional Experience',
      projects: 'Projects',
      education: 'Education',
      languages: 'Languages',
      keywords: 'Keywords & ATS',
    },
    skills: [
      { cat: 'iOS Mobile', tags: 'Swift, SwiftUI, UIKit, AVFoundation' },
      { cat: 'Architecture', tags: 'MVVM, MVC, Clean Architecture' },
      { cat: 'Mapping & Geospatial', tags: 'MapboxMaps SDK v10+, JSON Filters' },
      { cat: 'DevOps & CI/CD', tags: 'Git, GitHub Actions, Automated Pipelines, Unit Testing' },
      { cat: 'Web & Cloud', tags: 'React.js, TypeScript, JavaScript' },
      { cat: 'Embedded & Methods', tags: 'C++, Arduino, Agile/Scrum, REST API' },
    ],
    experiences: [
      {
        logo: `${BASE}/cv-assets/guidor.png`,
        title: 'iOS Application Developer — Work-Study',
        company: 'Skyconseil',
        badge: 'Work-Study',
        period: 'January 2024 – September 2026 · Toulouse, France',
        bullets: [
          'Developed and integrated MapboxMaps SDK v10+ on Guidor, a production iOS aviation app: 3 stacked weather layers (METAR, TAF, turbulence), dynamic map annotations, and raster tiles.',
          'Implemented UIKit and SwiftUI features following MVVM architecture within a 5-person Agile/Scrum team.',
          'Wrote internal and client-facing technical documentation covering all map modules.',
          'Set up and maintained CI/CD pipelines with GitHub Actions for automated builds and unit testing.',
        ],
      },
      {
        logo: `${BASE}/cv-assets/comb.png`,
        title: 'Embedded Software Development Intern',
        company: 'Le Facteur Humain & Combustible Numérique',
        badge: 'Internship',
        period: 'June 2023 – July 2023 · Toulouse, France',
        bullets: [
          'Built an embedded guidance system (Guidor project) in Arduino and C++, integrating hardware sensors, actuators, and a control interface within a cross-functional team.',
        ],
      },
    ],
    projects: [
      { title: 'Guidor', sub: 'Professional project · Aviation iOS app in production (Skyconseil)', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, METAR/TAF weather layers, CI/CD', appStoreUrl: 'https://apps.apple.com/fr/app/guidor/id1072066692' },
      { title: 'Meow-Tube', sub: 'Personal project · App Store · 4.9 ★ — YouTube without ads or Shorts, no subscription (like Brave for the web)', tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API', appStoreUrl: 'https://apps.apple.com/fr/app/meow-tube/id6760180650' },
      { title: 'Islamic Daily Quote', sub: 'Personal project · App Store · 4.8 ★ — Daily Islamic quotes, multilingual', tags: 'Swift, SwiftUI, Notifications, Dark mode', appStoreUrl: 'https://apps.apple.com/fr/app/islamic-daily-quote/id6760481474' },
    ],
    education: [
      { title: "Master's in Computer Science (BAC+5)", school: 'Epitech', period: 'August 2023 – September 2026' },
      { title: 'Professional Qualification — iOS Application Developer', school: 'Simplon Auvergne-Rhône-Alpes', period: 'April – July 2023' },
      { title: 'BTS Management of Commercial Units', school: 'Écoles Billières', period: 'Sept. 2020 – July 2022 · Management, Marketing & Sales · Career switch into software engineering' },
    ],
    languages: 'French — Native · Malagasy — Native · English — Advanced (B2/C1)',
    keywords: ['Swift', 'iOS', 'SwiftUI', 'UIKit', 'MVVM', 'MapboxMaps', 'Mapbox SDK', 'CI/CD', 'GitHub Actions', 'Unit Testing', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'AVFoundation', 'React.js', 'TypeScript', 'C++', 'Arduino', 'App Store'],
  },
};

function buildPrintHtml(lang: 'fr' | 'en'): string {
  const d = DATA[lang];

  const sec = (title: string) => `
    <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868B;margin:14px 0 5px;padding-bottom:3px;border-bottom:1px solid #E5E5EA">${title}</div>`;

  const expRows = d.experiences.map(e => `
    <div style="margin-bottom:9px">
      <div style="display:flex;align-items:baseline;gap:7px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:600;color:#1D1D1F">${e.title}</span>
        <span style="font-size:10px;color:#6E6E73">· ${e.company}</span>
        <span style="font-size:8.5px;background:rgba(0,113,227,.08);color:#0071E3;padding:1px 5px;border-radius:20px;font-weight:600">${e.badge}</span>
      </div>
      <div style="font-size:9.5px;color:#86868B;margin:1px 0 4px">${e.period}</div>
      <ul style="margin:0;padding-left:13px">
        ${e.bullets.map(b => `<li style="font-size:10px;color:#3A3A3C;margin-bottom:2px;line-height:1.45">${b}</li>`).join('')}
      </ul>
    </div>`).join('');

  const skillRows = d.skills.map(s => `
    <div style="margin-bottom:3px">
      <span style="font-size:9.5px;font-weight:600;color:#1D1D1F">${s.cat} : </span>
      <span style="font-size:9.5px;color:#6E6E73">${s.tags}</span>
    </div>`).join('');

  const projectRows = (d.projects as Array<{ title: string; sub: string; tags: string; appStoreUrl?: string }>).map(p => `
    <div style="margin-bottom:5px">
      <span style="font-size:10px;font-weight:600;color:#1D1D1F">${p.title}</span>
      ${p.appStoreUrl ? `<a href="${p.appStoreUrl}" style="font-size:9px;color:#0071E3;font-weight:600;margin-left:6px;text-decoration:none">App Store ↗</a>` : ''}
      <span style="font-size:9.5px;color:#86868B"> — ${p.sub}</span>
      <div style="font-size:9.5px;color:#6E6E73;margin-top:1px">${p.tags}</div>
    </div>`).join('');

  const eduRows = d.education.map(e => `
    <div style="margin-bottom:5px">
      <div style="font-size:10px;font-weight:600;color:#1D1D1F">${e.title}</div>
      <div style="font-size:9.5px;color:#6E6E73">${e.school} · ${e.period}</div>
    </div>`).join('');

  const keywords = d.keywords.map(k =>
    `<span style="display:inline-block;font-size:9px;background:rgba(0,113,227,.07);color:#0071E3;padding:2px 6px;border-radius:3px;margin:2px 2px 0 0">${k}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>CV Sharik Abubucker</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      color: #1D1D1F;
      background: white;
      padding: 28px 40px;
      max-width: 794px;
      margin: 0 auto;
      line-height: 1.4;
    }
    @media print {
      @page { margin: 0; size: A4; }
      body { padding: 1.2cm 1.6cm; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="border-bottom:2px solid #1D1D1F;padding-bottom:10px;margin-bottom:4px">
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#0071E3;margin-bottom:2px">${d.title}</div>
    <div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#6E6E73;margin-bottom:4px">${d.subtitle}</div>
    <div style="font-size:20px;font-weight:700;color:#1D1D1F;letter-spacing:-.5px">Sharik Abubucker</div>
    <div style="font-size:9.5px;color:#6E6E73;margin-top:4px;line-height:1.8">
      Ville : Toulouse, France &nbsp;|&nbsp;
      Tél : +33 07 50 01 98 34 &nbsp;|&nbsp; Email : sharikmohamed8@gmail.com<br/>
      LinkedIn : Sharik Mohamed &nbsp;|&nbsp;
      GitHub : github.com/sharik-dev &nbsp;|&nbsp;
      Portfolio : sharik.fr
    </div>
  </div>

  <!-- Summary -->
  ${sec(lang === 'fr' ? 'Résumé Professionnel' : 'Professional Summary')}
  <p style="font-size:10px;color:#3A3A3C;line-height:1.5">${d.summary}</p>

  <!-- Skills -->
  ${sec(d.sections.skills)}
  ${skillRows}

  <!-- Experience -->
  ${sec(d.sections.experience)}
  ${expRows}

  <!-- Projects -->
  ${sec(d.sections.projects)}
  <p style="font-size:9.5px;color:#6E6E73;margin:0 0 6px 0">
    ${lang === 'fr'
      ? `Liste exhaustive sur le portfolio : <a href="https://sharik.fr/portefolio" style="color:#0071E3;text-decoration:none">sharik.fr/portefolio</a>`
      : `Full project list on portfolio: <a href="https://sharik.fr/portefolio" style="color:#0071E3;text-decoration:none">sharik.fr/portefolio</a>`
    }
  </p>
  ${projectRows}

  <!-- Education -->
  ${sec(d.sections.education)}
  ${eduRows}

  <!-- Languages -->
  ${sec(d.sections.languages)}
  <p style="font-size:10px;color:#3A3A3C">${d.languages}</p>

  <!-- Keywords -->
  ${sec(d.sections.keywords)}
  <div style="line-height:2">${keywords}</div>

  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;
}

export function buildCvText(lang: 'fr' | 'en'): string {
  const d = DATA[lang];
  const s = d.sections;
  const line = (n = 40) => '─'.repeat(n);

  const skills = d.skills.map(sk => `  ${sk.cat}: ${sk.tags}`).join('\n');
  const exps = d.experiences.map(e =>
    `${e.title} · ${e.company} (${e.badge})\n${e.period}\n${e.bullets.map(b => `  • ${b}`).join('\n')}`
  ).join('\n\n');
  const projs = d.projects.map(p => `${p.title} — ${p.sub}\n  ${p.tags}`).join('\n\n');
  const edu = d.education.map(e => `${e.title}\n${e.school} · ${e.period}`).join('\n\n');

  return [
    d.title,
    'Sharik Mohamed',
    'Ville : Toulouse, France | Email : sharikmohamed8@gmail.com',
    'LinkedIn : linkedin.com/in/sharik-abubucker-393194205 | GitHub : github.com/sharik-dev | Portfolio : sharik.fr',
    '',
    line(),
    s.skills.toUpperCase(),
    line(),
    skills,
    '',
    line(),
    s.experience.toUpperCase(),
    line(),
    exps,
    '',
    line(),
    s.projects.toUpperCase(),
    line(),
    projs,
    '',
    line(),
    s.education.toUpperCase(),
    line(),
    edu,
    '',
    line(),
    s.languages.toUpperCase(),
    line(),
    d.languages,
    '',
    line(),
    s.keywords.toUpperCase(),
    line(),
    d.keywords.join(', '),
  ].join('\n');
}

export function downloadCvAsPdf(lang: 'fr' | 'en', _filename: string): Promise<void> {
  return new Promise((resolve) => {
    const html = buildPrintHtml(lang);
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) {
      alert('Autorise les popups pour télécharger le CV en PDF.');
      resolve();
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Resolve after print dialog closes (or after a delay)
    setTimeout(resolve, 1000);
  });
}
