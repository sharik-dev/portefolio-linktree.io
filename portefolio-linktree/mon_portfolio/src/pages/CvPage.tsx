import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useLang, t } from '../contexts/LangContext';
import { downloadCvAsPdf, buildCvText } from '../utils/downloadCvAsPdf';

import cvFrenchUrl from '../assets/cv_markdown/CV_Sharik_french.md';
import cvEnglishUrl from '../assets/cv_markdown/CV_Sharik_english.md';
import epitechLogo from '../assets/formation/epitech.png';
import simplonLogo from '../assets/formation/simplon.png';
import billiereLogo from '../assets/formation/billiere.png';
import combLogo from '../assets/company/comb.png';
import guidorLogo from '../assets/company/guidor.png';

/* ─── CV markdown URLs ────────────────────────────────────────────── */
const CV_URLS = {
  fr: cvFrenchUrl,
  en: cvEnglishUrl,
} as const;

/* ─── Bilingual Data ─────────────────────────────────────────────── */
const DATA = {
  experiences: [
    {
      id: 'skyconseil - guidor',
      title: { fr: 'Développeur Applications iOS', en: 'iOS Application Developer' },
      company: 'Skyconseil',
      badge: { fr: 'Alternance', en: 'Work-Study' },
      period: { fr: 'Janvier 2024 – Septembre 2026 · Toulouse', en: 'January 2024 – September 2026 · Toulouse' },
      current: true,
      description: {
        fr: 'Développement de fonctionnalités iOS UIKIT , codage en C++. Intégration MapboxMaps SDK v10+ : couches météo multiples, annotations, raster,. Rédaction de documentation technique interne et client. Agile/Scrum.',
        en: 'Designed and implemented iOS features following MVVM architecture. Developed complex MapboxMaps SDK integrations: multiple weather overlay layers, zoom-level visibility management, multi-layer track control. Wrote technical documentation. Unit testing, performance optimization, code reviews in Agile sprints.'
      },
      tags: ['Swift', 'iOS', 'MVVM', 'MapboxMaps SDK v10+', 'UIKit', 'CI/CD', 'GitHub Actions', 'Tests unitaires', 'Agile/Scrum'],
      logo: guidorLogo,
    },
    {
      id: 'facteur-humain',
      title: { fr: 'Stagiaire Développeur Embarqué', en: 'Software Development Intern' },
      company: 'Le Facteur Humain & Combustible Numérique',
      badge: { fr: 'Stage', en: 'Internship' },
      period: { fr: 'juin – Juillet 2023 · Toulouse', en: 'June – July 2023 · Toulouse' },
      current: false,
      description: {
        fr: 'Projet Guidor : développement embarqué avec Arduino et C++. Conception d\'un système de guidage avec capteurs, actionneurs et interface de contrôle dans une équipe pluridisciplinaire.',
        en: 'Guidor project: embedded development with Arduino and C++. Built guidance system integrating hardware sensors and control interface within a cross-functional team.'
      },
      tags: ['C++', 'Arduino', 'Embarqué'],
      logo: combLogo,
    }
  ],
  formations: [
    {
      id: 'epitech',
      title: { fr: 'BAC + 5 en Informatique', en: "Master's in Computer Science" },
      school: 'Epitech',
      period: { fr: 'Août 2023 – Septembre 2026', en: 'August 2023 – September 2026' },
      description: {
        fr: 'Formation en informatique couvrant algorithmique, JavaScript, React.js et développement de projets en équipe. Approche par projets pratiques.',
        en: 'Computer science curriculum covering algorithms, JavaScript, React.js and collaborative project development. Project-driven learning approach.'
      },
      logo: epitechLogo,
    },
    {
      id: 'simplon apple program',
      title: { fr: 'AFP Concepteur Développeur d\'Applications IOS', en: 'Professional Qualification in IOS Application Development' },
      school: 'Simplon Auvergne-Rhône-Alpes',
      period: { fr: 'Avril – Juillet 2023', en: 'April – July 2023' },
      description: {
        fr: 'Formation intensive en Swift. Conception et développement d\'applications mobiles iOS.',
        en: 'Intensive training in Swift. iOS mobile application design and development.'
      },
      logo: simplonLogo,
    },
    {
      id: 'Ecoles Billieres',
      title: { fr: 'BTS Management des Unités Commerciales', en: 'BTS Management of Commercial Units' },
      school: 'Ecoles Billieres',
      period: { fr: 'Septembre 2020 – Juillet 2022', en: 'September 2020 – July 2022' },
      description: {
        fr: 'Management et commercial des unités commerciales',
        en: 'Management and commercial of commercial units'
      },
      logo: billiereLogo,
    },
  ],
  skills: {
    fr: [
      { cat: 'Mobile iOS', tags: ['Swift', 'SwiftUI', 'UIKit', 'Core ML', 'Vision', 'On-device AI', 'Image Processing', 'NLP'] },
      { cat: 'Architecture', tags: ['MVVM', 'MVC'] },
      { cat: 'Cartographie', tags: ['MapboxMaps SDK v10+', 'SDK Legacy Mapbox', 'Filtres JSON', 'Expressions de zoom'] },
      { cat: 'DevOps & CI/CD', tags: ['Git', 'GitHub Actions', 'Pipelines automatisés', 'Tests unitaires'] },
      { cat: 'Web & Autres', tags: ['React.js', 'TypeScript', 'JavaScript', 'C++', 'Python', 'Arduino'] },
      { cat: 'Méthodes', tags: ['Agile/Scrum', 'Code Review', 'Documentation technique', 'REST API / JSON'] },
    ],
    en: [
      { cat: 'iOS Mobile', tags: ['Swift', 'SwiftUI', 'UIKit', 'Core ML', 'Vision', 'On-device AI', 'Image Processing', 'NLP'] },
      { cat: 'Architecture', tags: ['MVVM', 'MVC'] },
      { cat: 'Mapping & Geospatial', tags: ['MapboxMaps SDK v10+, v6', 'Legacy Mapbox SDK', 'JSON Filters'] },
      { cat: 'DevOps & CI/CD', tags: ['Git', 'GitHub Actions', 'Automated Pipelines', 'Unit Testing'] },
      { cat: 'Web & Other', tags: ['React.js', 'TypeScript', 'JavaScript', 'C++', 'Python', 'Arduino'] },
      { cat: 'Methodologies', tags: ['Agile/Scrum', 'Code Review', 'Technical Documentation', 'REST API / JSON'] },
    ],
  },
  languages: {
    fr: [{ lang: 'Français', level: 'Natif' }, { lang: 'Anglais', level: 'Avancé (B2/C1)' }],
    en: [{ lang: 'French', level: 'Native' }, { lang: 'English', level: 'Advanced (B2/C1)' }],
  },
};

/* ─── Subcomponents ──────────────────────────────────────────────── */
const ExpandableCard: React.FC<{
  logo: string; title: string; subtitle: string; badge?: string;
  meta: string; description: string; tags: string[]; current?: boolean; logoScale?: string;
}> = ({ logo, title, subtitle, badge, meta, description, tags, current, logoScale }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => setOpen(o => !o)}
      className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 sm:p-5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 relative"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <img src={logo} alt={title} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-black/[0.10] dark:border-white/[0.06] flex-shrink-0 mt-0.5 ${logoScale ? `object-contain scale-75` : 'object-cover'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{title}</h3>
            {current && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#27AE60]">• En cours</span>}
            {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8E8ED] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D]">{badge}</span>}
          </div>
          <p className="text-[13px] font-medium text-[#0071E3]">{subtitle}</p>
          <p className="text-[12px] text-[#86868B] dark:text-[#636366] mt-0.5">{meta}</p>
        </div>
        <span
          className="text-[#86868B] flex-shrink-0 mt-1 transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        className="overflow-hidden"
      >
        <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
          <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-3">{description}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E8E8ED] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.10] dark:border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────── */
type Tab = 'experiences' | 'formations' | 'competences' | 'apercu';

const CvPage: React.FC = () => {
  const { lang } = useLang();
  const [tab, setTab] = useState<Tab>('experiences');
  const [copied, setCopied] = useState(false);
  const [cvContent, setCvContent] = useState('');
  const [cvLoading, setCvLoading] = useState(true);
  const [downloading, setDownloading] = useState<'fr' | 'en' | null>(null);

  /* Fetch the markdown file whenever the language changes */
  useEffect(() => {
    setCvLoading(true);
    fetch(CV_URLS[lang])
      .then(res => res.text())
      .then(text => { setCvContent(text); setCvLoading(false); })
      .catch(() => { setCvContent(''); setCvLoading(false); });
  }, [lang]);

  const ui = {
    fr: { hero: 'Mon CV', sub: 'Ingénieur Logiciel · Développeur iOS · Toulouse', tabs: ['Expériences', 'Formations', 'Compétences', 'Aperçu'], download: 'Télécharger le CV', downloadSub: 'Disponible en français et en anglais', dlFr: 'CV Français', dlEn: 'CV Anglais', copyBtn: 'Copier', copiedBtn: 'Copié !', previewLabel: 'Aperçu brut du CV', previewHint: 'Le contenu switch automatiquement avec la langue sélectionnée.' },
    en: { hero: 'My CV', sub: 'Software Engineer · iOS Developer · Toulouse', tabs: ['Experience', 'Education', 'Skills', 'Preview'], download: 'Download CV', downloadSub: 'Available in French and English', dlFr: 'French CV', dlEn: 'English CV', copyBtn: 'Copy', copiedBtn: 'Copied!', previewLabel: 'Raw CV Preview', previewHint: 'Content switches automatically with the selected language.' },
  }[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCvText(lang)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPdf = async (targetLang: 'fr' | 'en') => {
    setDownloading(targetLang);
    try {
      const name = targetLang === 'fr' ? 'CV_Sharik_Mohamed_FR.pdf' : 'CV_Sharik_Mohamed_EN.pdf';
      await downloadCvAsPdf(targetLang, name);
    } finally {
      setDownloading(null);
    }
  };

  const tabKeys: Tab[] = ['experiences', 'formations', 'competences', 'apercu'];

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-[#000000] transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-4 sm:px-6 pt-12 pb-0 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">
          {lang === 'fr' ? 'Parcours' : 'Career'}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-2">{ui.hero}</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] mb-6">{ui.sub}</p>

        {/* Apple-style segmented control — full width on mobile */}
        <div className="flex sm:inline-flex w-full sm:w-auto bg-[#E8E8ED] dark:bg-[#2C2C2E] rounded-xl p-1 gap-1 mb-0">
          {ui.tabs.map((label, i) => (
            <button
              key={tabKeys[i]}
              onClick={() => setTab(tabKeys[i])}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 rounded-[10px] text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${tab === tabKeys[i]
                ? 'bg-white dark:bg-[#3A3A3C] text-[#1D1D1F] dark:text-white shadow-sm'
                : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">

        {/* Experience */}
        {tab === 'experiences' && (
          <section className="space-y-3">
            {DATA.experiences.map(exp => (
              <ExpandableCard
                key={exp.id}
                logo={exp.logo}
                title={t(lang, exp.title.fr, exp.title.en)}
                subtitle={typeof exp.company === 'string' ? exp.company : t(lang, (exp.company as { fr: string; en: string }).fr, (exp.company as { fr: string; en: string }).en)}
                badge={t(lang, exp.badge.fr, exp.badge.en)}
                meta={t(lang, exp.period.fr, exp.period.en)}
                description={t(lang, exp.description.fr, exp.description.en)}
                tags={exp.tags}
                current={exp.current}
              />
            ))}
          </section>
        )}

        {/* Education */}
        {tab === 'formations' && (
          <section className="space-y-3">
            {DATA.formations.map(f => (
              <ExpandableCard
                key={f.id}
                logo={f.logo}
                title={t(lang, f.title.fr, f.title.en)}
                subtitle={f.school}
                meta={t(lang, f.period.fr, f.period.en)}
                description={t(lang, f.description.fr, f.description.en)}
                tags={[]}
              />
            ))}
          </section>
        )}

        {/* Skills — tags only, no gauges */}
        {tab === 'competences' && (
          <section className="space-y-4">
            {/* Skills groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DATA.skills[lang].map(group => (
                <div key={group.cat} className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
                  <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-3">{group.cat}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map(tag => (
                      <span key={tag} className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-[#E8E8ED] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#E5E5E7] border border-black/[0.10] dark:border-white/[0.06]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
              <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-3">
                {lang === 'fr' ? 'Langues' : 'Languages'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {DATA.languages[lang].map(l => (
                  <div key={l.lang} className="flex items-center gap-2 bg-[#E8E8ED] dark:bg-[#2C2C2E] px-4 py-2 rounded-full border border-black/[0.10] dark:border-white/[0.06]">
                    <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white">{l.lang}</span>
                    <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">— {l.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS keywords */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
              <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-3">
                {lang === 'fr' ? 'Mots-clés' : 'Keywords'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Swift', 'iOS', 'MVVM', 'MapboxMaps', 'AVFoundation', 'CI/CD', 'GitHub Actions', 'SwiftUI', 'UIKit', 'Agile', 'Scrum', 'JSON', 'REST API', 'Git', 'React.js', 'TypeScript', 'C++', 'Arduino', 'Python', 'Clean Architecture'].map(kw => (
                  <span key={kw} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3]">{kw}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Raw Markdown Preview */}
        {tab === 'apercu' && (
          <section className="space-y-4">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-[#0071E3]/[0.06] border border-[#0071E3]/20 rounded-2xl px-5 py-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <div>
                <p className="text-[13px] font-semibold text-[#0071E3] mb-0.5">{ui.previewLabel}</p>
                <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">{ui.previewHint}</p>
              </div>
            </div>

            {/* Markdown viewer */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#E0E0E2] dark:bg-[#2C2C2E]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57] flex-shrink-0" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E] flex-shrink-0" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840] flex-shrink-0" />
                  <span className="ml-2 text-[11px] font-mono text-[#86868B] dark:text-[#636366] hidden sm:block truncate">
                    {lang === 'fr' ? 'CV_Sharik_french.md' : 'CV_Sharik_english.md'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDownloadPdf(lang)}
                    disabled={downloading === lang}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] transition-colors disabled:opacity-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    <span className="hidden sm:inline">{downloading === lang ? '…' : lang === 'fr' ? ui.dlFr : ui.dlEn}</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-200 ${copied
                      ? 'bg-[#34C759] text-white'
                      : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
                      }`}
                  >
                    {copied ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    )}
                    {copied ? ui.copiedBtn : ui.copyBtn}
                  </button>
                </div>
              </div>

              {/* Rendered Markdown */}
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[65vh] scrollbar-hide overflow-x-hidden">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-1 break-words">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-[12px] sm:text-[13px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mt-6 sm:mt-7 mb-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.06] break-words">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#1D1D1F] dark:text-white mt-4 mb-1 break-words flex flex-wrap items-center gap-1">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[12px] sm:text-[13px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-2 break-words">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-[#1D1D1F] dark:text-white">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-[#6E6E73] dark:text-[#98989D] not-italic text-[11px] sm:text-[12px]">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-1.5 mb-3 ml-1">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#6E6E73] dark:text-[#98989D]">
                        <span className="text-[#0071E3] font-bold shrink-0 mt-0.5 text-[10px]">●</span>
                        <span className="break-words min-w-0">{children}</span>
                      </li>
                    ),
                    hr: () => (
                      <hr className="my-4 sm:my-5 border-black/[0.06] dark:border-white/[0.06]" />
                    ),
                    code: ({ children }) => (
                      <code className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#0071E3]/[0.08] text-[#0071E3] font-mono break-all">{children}</code>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0071E3] font-medium hover:underline break-all">{children}</a>
                    ),
                    img: ({ src, alt }) => (
                      <img src={src} alt={alt} className="inline-block rounded-xl object-cover" style={{ maxHeight: alt === 'photo' ? 56 : alt === 'qr' ? 48 : 28, maxWidth: alt === 'photo' ? 56 : alt === 'qr' ? 48 : 28 }} />
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3 -mx-4 sm:mx-0 px-4 sm:px-0">
                        <table className="border-collapse min-w-max text-left">{children}</table>
                      </div>
                    ),
                    td: ({ children }) => (
                      <td className="align-middle py-1.5 sm:py-2 pr-3 sm:pr-4 text-[11px] sm:text-[13px] text-[#6E6E73] dark:text-[#98989D]">{children}</td>
                    ),
                    th: ({ children }) => (
                      <th className="align-middle py-1.5 sm:py-2 pr-3 sm:pr-4 text-[11px] sm:text-[13px] font-semibold text-[#1D1D1F] dark:text-white">{children}</th>
                    ),
                  }}
                >
                  {cvLoading ? '…' : cvContent}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* CV Download section */}
        <section>
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/[0.08] flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></svg>
            </div>
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white mb-1">{ui.download}</h3>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-5">{ui.downloadSub}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleDownloadPdf('fr')}
                disabled={downloading === 'fr'}
                className="inline-flex items-center gap-2 bg-[#0071E3] text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-[#0077ED] transition-colors shadow-sm disabled:opacity-60"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                🇫🇷 {downloading === 'fr' ? '…' : ui.dlFr}
              </button>
              <button
                onClick={() => handleDownloadPdf('en')}
                disabled={downloading === 'en'}
                className="inline-flex items-center gap-2 bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white border border-black/[0.12] dark:border-white/[0.12] px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-[#F5F5F7] dark:hover:bg-[#3A3A3C] transition-colors disabled:opacity-60"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                🇬🇧 {downloading === 'en' ? '…' : ui.dlEn}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CvPage;