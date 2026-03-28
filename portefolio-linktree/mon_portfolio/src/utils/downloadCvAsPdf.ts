import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BASE = window.location.origin;

const DATA = {
  fr: {
    title: 'Ingénieur Logiciel — Développement Mobile, Web & CI/CD',
    summary: 'Alternant développeur iOS chez Skyconseil depuis janvier 2024, je travaille sur Guidor — une application aviation professionnelle intégrant MapboxMaps SDK v10+, UIKit et architecture MVVM. En parallèle, j\'ai publié seul 3 applications sur l\'App Store (4.7 à 4.9 étoiles). Profil polyvalent issu d\'une reconversion volontaire : Swift, React.js, CI/CD, embarqué C++, avec une appétence pour l\'IA mobile et le cloud.',
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
      { cat: 'Cartographie', tags: 'MapboxMaps SDK v10+, SDK legacy, filtres JSON, expressions de zoom' },
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
      { title: 'Guidor', sub: 'Application aviation professionnelle iOS · En production jusqu\'en sept. 2026', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, couches météo METAR/TAF, CI/CD' },
      { title: 'Meow-Tube', sub: 'Application iOS sans publicité ni Shorts · App Store · 4.9 ★', tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API' },
      { title: 'LocalShort', sub: 'Lecteur de vidéos courtes hors ligne · App Store · 4.7 ★', tags: 'Swift, SwiftUI, AVFoundation, lecture locale, zéro donnée transmise' },
      { title: 'Islamic Daily Quote', sub: 'Citation islamique quotidienne multilingue · App Store · 4.8 ★', tags: 'Swift, SwiftUI, Notifications, Mode sombre, arabe + traductions' },
    ],
    education: [
      { logo: `${BASE}/cv-assets/epitech.png`, title: 'Licence Informatique (BAC+5)', school: 'Epitech', period: 'Août 2023 – Sept. 2026' },
      { logo: `${BASE}/cv-assets/simplon.png`, title: 'AFP Concepteur Développeur d\'Applications iOS', school: 'Simplon Auvergne-Rhône-Alpes', period: 'Avr. – Juil. 2023' },
      { logo: `${BASE}/cv-assets/billiere.png`, title: 'BTS Management des Unités Commerciales', school: 'Écoles Billières', period: 'Sept. 2020 – Juil. 2022 · Reconversion vers l\'informatique' },
    ],
    languages: 'Français — Natif · Anglais — Avancé (B2/C1)',
    keywords: ['Swift', 'iOS', 'SwiftUI', 'UIKit', 'MVVM', 'MapboxMaps', 'Mapbox SDK', 'CI/CD', 'GitHub Actions', 'Tests unitaires', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'AVFoundation', 'React.js', 'TypeScript', 'C++', 'Arduino', 'App Store'],
  },
  en: {
    title: 'Software Engineer — Mobile, Web & CI/CD',
    summary: 'Work-study iOS developer at Skyconseil since January 2024, building Guidor — a professional aviation app integrating MapboxMaps SDK v10+, UIKit, and MVVM architecture. Independently published 3 apps on the App Store (4.7 to 4.9 stars). Versatile engineer from a deliberate career switch: Swift, React.js, CI/CD, embedded C++, with a strong interest in mobile AI and cloud.',
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
      { cat: 'Mapping & Geospatial', tags: 'MapboxMaps SDK v10+, Legacy Mapbox SDK, JSON Filters, Zoom Expressions' },
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
      { title: 'Guidor', sub: 'Professional aviation iOS app · In production through Sept. 2026', tags: 'Swift, UIKit, SwiftUI, MVVM, MapboxMaps SDK v10+, METAR/TAF weather layers, CI/CD' },
      { title: 'Meow-Tube', sub: 'Ad-free, Shorts-free iOS video app · App Store · 4.9 ★', tags: 'Swift, SwiftUI, MVVM, AVFoundation, YouTube Data API' },
      { title: 'LocalShort', sub: 'Offline short-form video player · App Store · 4.7 ★', tags: 'Swift, SwiftUI, AVFoundation, local playback, zero data transmitted' },
      { title: 'Islamic Daily Quote', sub: 'Daily multilingual Islamic quote app · App Store · 4.8 ★', tags: 'Swift, SwiftUI, Notifications, Dark mode, Arabic + multilingual translations' },
    ],
    education: [
      { logo: `${BASE}/cv-assets/epitech.png`, title: "Master's in Computer Science (BAC+5)", school: 'Epitech', period: 'August 2023 – September 2026' },
      { logo: `${BASE}/cv-assets/simplon.png`, title: 'Professional Qualification — iOS Application Developer', school: 'Simplon Auvergne-Rhône-Alpes', period: 'April – July 2023' },
      { logo: `${BASE}/cv-assets/billiere.png`, title: 'BTS Management of Commercial Units', school: 'Écoles Billières', period: 'Sept. 2020 – July 2022 · Deliberate career switch into software engineering' },
    ],
    languages: 'French — Native · English — Advanced (B2/C1)',
    keywords: ['Swift', 'iOS', 'SwiftUI', 'UIKit', 'MVVM', 'MapboxMaps', 'Mapbox SDK', 'CI/CD', 'GitHub Actions', 'Unit Testing', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'AVFoundation', 'React.js', 'TypeScript', 'C++', 'Arduino', 'App Store'],
  },
};

function buildHtml(lang: 'fr' | 'en'): string {
  const d = DATA[lang];
  const sec = (title: string) =>
    `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#86868B;margin:22px 0 8px;padding-bottom:5px;border-bottom:1px solid rgba(0,0,0,.08)">${title}</div>`;

  const expRows = d.experiences.map(e => `
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
      <img src="${e.logo}" width="36" height="36" style="border-radius:8px;object-fit:cover;flex-shrink:0;margin-top:2px" crossorigin="anonymous"/>
      <div style="flex:1">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:600;color:#1D1D1F">${e.title}</span>
          <span style="font-size:12px;color:#6E6E73">· ${e.company}</span>
          <span style="font-size:10px;background:rgba(0,113,227,.08);color:#0071E3;padding:1px 7px;border-radius:20px;font-weight:600">${e.badge}</span>
        </div>
        <div style="font-size:11px;color:#86868B;margin:2px 0 6px">${e.period}</div>
        <ul style="margin:0;padding-left:16px">
          ${e.bullets.map(b => `<li style="font-size:12px;color:#6E6E73;margin-bottom:3px">${b}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  const skillRows = (() => {
    const half = Math.ceil(d.skills.length / 2);
    const rows = [d.skills.slice(0, half), d.skills.slice(half)];
    return rows.map(row =>
      `<div style="display:flex;gap:0;margin-bottom:6px">
        ${row.map(s => `
          <div style="flex:1;padding-right:12px">
            <div style="font-size:11px;font-weight:600;color:#1D1D1F;margin-bottom:2px">${s.cat}</div>
            <div style="font-size:11px;color:#6E6E73">${s.tags}</div>
          </div>
        `).join('')}
      </div>`
    ).join('');
  })();

  const eduRows = d.education.map(e => `
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
      <img src="${e.logo}" width="36" height="36" style="border-radius:8px;object-fit:cover;flex-shrink:0" crossorigin="anonymous"/>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600;color:#1D1D1F">${e.title}</div>
        <div style="font-size:11px;color:#6E6E73">${e.school} · <em style="font-style:normal;color:#86868B">${e.period}</em></div>
      </div>
    </div>
  `).join('');

  const projectRows = d.projects.map(p => `
    <div style="margin-bottom:8px">
      <span style="font-size:12px;font-weight:600;color:#1D1D1F">${p.title}</span>
      <span style="font-size:11px;color:#86868B"> — ${p.sub}</span>
      <div style="font-size:11px;color:#6E6E73;margin-top:2px">${p.tags}</div>
    </div>
  `).join('');

  const keywords = d.keywords.map(k =>
    `<span style="display:inline-block;font-size:10px;background:rgba(0,113,227,.07);color:#0071E3;padding:2px 8px;border-radius:4px;margin:2px 3px 2px 0;font-family:monospace">${k}</span>`
  ).join('');

  return `
    <div style="display:flex;align-items:flex-start;gap:18px;margin-bottom:4px">
      <img src="${BASE}/cv-assets/pfp.png" width="80" height="80" style="border-radius:14px;object-fit:cover;flex-shrink:0" crossorigin="anonymous"/>
      <div style="flex:1">
        <div style="font-size:22px;font-weight:700;color:#1D1D1F;margin-bottom:2px">Sharik Mohamed</div>
        <div style="font-size:13px;color:#6E6E73;margin-bottom:6px">${d.title}</div>
        <div style="font-size:11px;color:#86868B;line-height:1.8">
          📍 Toulouse, France &nbsp;·&nbsp; 📧 sharikmohamed8@gmail.com<br/>
          🔗 linkedin.com/in/sharik-abubucker-393194205 &nbsp;·&nbsp; 💻 github.com/sharik-dev &nbsp;·&nbsp; 🌐 sharik.fr
        </div>
      </div>
      <img src="${BASE}/cv-assets/qrCode.png" width="70" height="70" style="border-radius:8px;flex-shrink:0" crossorigin="anonymous"/>
    </div>

    ${sec(d.sections.skills)}
    ${skillRows}

    ${sec(d.sections.experience)}
    ${expRows}

    ${sec(d.sections.projects)}
    ${projectRows}

    ${sec(d.sections.education)}
    ${eduRows}

    ${sec(d.sections.languages)}
    <div style="font-size:12px;color:#6E6E73;margin-bottom:8px">${d.languages}</div>

    ${sec(d.sections.keywords)}
    <div style="line-height:2">${keywords}</div>
  `;
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
    d.keywords.join(' · '),
  ].join('\n');
}

export async function downloadCvAsPdf(lang: 'fr' | 'en', filename: string): Promise<void> {
  const container = document.createElement('div');
  container.innerHTML = buildHtml(lang);
  container.style.cssText = [
    'width:794px',
    'padding:48px 56px',
    'background:white',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
    'line-height:1.55',
    'color:#1D1D1F',
    'position:fixed',
    'top:-99999px',
    'left:-99999px',
    'box-sizing:border-box',
  ].join(';');

  document.body.appendChild(container);

  await Promise.all(
    Array.from(container.querySelectorAll('img')).map(
      img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    )
  );

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, allowTaint: false, logging: false });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/png');

    // Scale to fit exactly one page (width-first, clamp height if needed)
    const ratio = canvas.width / canvas.height;
    let finalW = pageW;
    let finalH = pageW / ratio;
    if (finalH > pageH) {
      finalH = pageH;
      finalW = pageH * ratio;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, finalW, finalH);
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
