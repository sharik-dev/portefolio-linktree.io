import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BASE = window.location.origin;

const DATA = {
  fr: {
    title: 'Ingénieur Logiciel · Développeur iOS',
    summary: 'Ingénieur logiciel spécialisé en développement iOS, avec une expertise en architecture MVVM, intégration MapboxMaps SDK et CI/CD. Capable de concevoir des applications mobiles robustes, documentées et testées, dans un environnement Agile.',
    sections: {
      skills: 'Compétences Clés',
      experience: 'Expériences Professionnelles',
      projects: 'Projets',
      education: 'Formation',
      languages: 'Langues',
      keywords: 'Mots-clés ATS',
    },
    skills: [
      { cat: 'Mobile iOS', tags: 'Swift · SwiftUI · UIKit · AVFoundation · Core ML · Vision' },
      { cat: 'Architecture', tags: 'MVVM · MVC · Clean Architecture' },
      { cat: 'Cartographie', tags: 'MapboxMaps v10+ · SDK legacy · filtres JSON' },
      { cat: 'DevOps / CI/CD', tags: 'Git · GitHub Actions · pipelines automatisés · Tests unitaires' },
      { cat: 'Web & Autres', tags: 'React.js · TypeScript · JavaScript · C++ · Python · Arduino' },
      { cat: 'Méthodes', tags: 'Agile/Scrum · Code Review · Documentation · REST API' },
    ],
    experiences: [
      {
        logo: `${BASE}/cv-assets/guidor.png`,
        title: 'Développeur Applications iOS',
        company: 'Skyconseil',
        badge: 'Alternance',
        period: 'Janvier 2024 – Présent · Toulouse, France',
        bullets: [
          'Développement de fonctionnalités iOS (UIKit, MVVM) et intégration du MapboxMaps SDK v10+ : couches météo multiples, annotations cartographiques et tuiles raster.',
          'Rédaction de documentation technique à destination des équipes internes et des clients.',
          'Travail en méthodologie Agile/Scrum.',
        ],
      },
      {
        logo: `${BASE}/cv-assets/comb.png`,
        title: 'Stagiaire Développeur Embarqué',
        company: 'Le Facteur Humain & Combustible Numérique',
        badge: 'Stage',
        period: 'Juin 2023 – Juillet 2023 · Toulouse, France',
        bullets: [
          'Projet Guidor : développement embarqué avec Arduino et C++. Conception d\'un système de guidage avec capteurs, actionneurs et interface de contrôle dans une équipe pluridisciplinaire.',
        ],
      },
    ],
    projects: [
      { title: 'FocusFast', sub: 'Application iOS vidéo courte (type TikTok)', tags: 'Swift · MVVM · AVFoundation · Feed vertical · Catégories · Upload vidéo' },
      { title: 'MapboxMaps Weather Layers', sub: 'Intégration multicouches météo (Skyconseil)', tags: 'MapboxMaps v10+ · filtres JSON · expressions de zoom · SDK legacy' },
    ],
    education: [
      { logo: `${BASE}/cv-assets/epitech.png`, title: 'Licence Informatique (BAC+5)', school: 'Epitech', period: 'Août 2023 – Sept. 2026' },
      { logo: `${BASE}/cv-assets/simplon.png`, title: 'AFP Concepteur Développeur d\'Applications iOS', school: 'Simplon Auvergne-Rhône-Alpes', period: 'Avr. – Juil. 2023' },
      { logo: `${BASE}/cv-assets/billiere.png`, title: 'BTS Management des Unités Commerciales', school: 'Écoles Billières', period: 'Sept. 2020 – Juil. 2022' },
    ],
    languages: 'Français — Natif · Anglais — Avancé (B2/C1)',
    keywords: ['Swift', 'iOS', 'MVVM', 'Mapbox', 'Core ML', 'Vision', 'CI/CD', 'Tests unitaires', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'SwiftUI', 'UIKit', 'React.js', 'C++', 'Arduino'],
  },
  en: {
    title: 'Software Engineer · iOS Developer',
    summary: 'Software Engineer specialized in iOS development with expertise in MVVM architecture, MapboxMaps SDK integration, and CI/CD pipelines. Experienced in building production-grade mobile applications with clean architecture and on-device AI.',
    sections: {
      skills: 'Core Skills',
      experience: 'Professional Experience',
      projects: 'Projects',
      education: 'Education',
      languages: 'Languages',
      keywords: 'Keywords & ATS',
    },
    skills: [
      { cat: 'iOS Mobile', tags: 'Swift · SwiftUI · UIKit · AVFoundation · Core ML · Vision' },
      { cat: 'Architecture', tags: 'MVVM · MVC · Clean Architecture' },
      { cat: 'Mapping & Geospatial', tags: 'MapboxMaps SDK v10+ · Legacy Mapbox SDK · JSON Filters' },
      { cat: 'DevOps & CI/CD', tags: 'Git · GitHub Actions · Automated Pipelines · Unit Testing' },
      { cat: 'Web & Other', tags: 'React.js · TypeScript · JavaScript · C++ · Python · Arduino' },
      { cat: 'Methodologies', tags: 'Agile/Scrum · Code Review · Technical Documentation · REST API' },
    ],
    experiences: [
      {
        logo: `${BASE}/cv-assets/guidor.png`,
        title: 'iOS Application Developer',
        company: 'Skyconseil',
        badge: 'Work-Study',
        period: 'January 2024 – Present · Toulouse, France',
        bullets: [
          'Built iOS features (UIKit, MVVM) and integrated MapboxMaps SDK v10+: multiple weather overlay layers, map annotations, and raster tiles.',
          'Wrote technical documentation for internal teams and clients.',
          'Worked in an Agile/Scrum environment.',
        ],
      },
      {
        logo: `${BASE}/cv-assets/comb.png`,
        title: 'Embedded Software Development Intern',
        company: 'Le Facteur Humain & Combustible Numérique',
        badge: 'Internship',
        period: 'June 2023 – July 2023 · Toulouse, France',
        bullets: [
          'Contributed to the Guidor project: embedded development with Arduino and C++. Built a guidance system integrating hardware sensors and a control interface within a cross-functional team.',
        ],
      },
    ],
    projects: [
      { title: 'FocusFast', sub: 'iOS Short-Video Application (TikTok-style)', tags: 'Swift · MVVM · AVFoundation · Vertical Feed · Categories · Video Upload' },
      { title: 'MapboxMaps Weather Layers', sub: 'Multi-layer weather integration (Skyconseil)', tags: 'MapboxMaps v10+ · JSON Filters · Zoom Expressions · Legacy SDK' },
    ],
    education: [
      { logo: `${BASE}/cv-assets/epitech.png`, title: "Master's in Computer Science (BAC+5)", school: 'Epitech', period: 'August 2023 – September 2026' },
      { logo: `${BASE}/cv-assets/simplon.png`, title: 'Professional Qualification – iOS Application Developer', school: 'Simplon Auvergne-Rhône-Alpes', period: 'April – July 2023' },
      { logo: `${BASE}/cv-assets/billiere.png`, title: 'BTS Management of Commercial Units', school: 'Écoles Billières', period: 'September 2020 – July 2022' },
    ],
    languages: 'French — Native · English — Advanced (B2/C1)',
    keywords: ['Swift', 'iOS', 'MVVM', 'Mapbox', 'Core ML', 'Vision', 'CI/CD', 'Unit Testing', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'SwiftUI', 'UIKit', 'React.js', 'C++', 'Arduino'],
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
    'Sharik Mohamed',
    d.title,
    '📍 Toulouse, France · 📧 sharikmohamed8@gmail.com',
    '🔗 linkedin.com/in/sharik-abubucker-393194205 · 💻 github.com/sharik-dev · 🌐 sharik.fr',
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
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    let remaining = imgH;
    let offset = 0;
    pdf.addImage(imgData, 'PNG', 0, offset, imgW, imgH);
    remaining -= pageH;
    while (remaining > 0) {
      offset -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, offset, imgW, imgH);
      remaining -= pageH;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
