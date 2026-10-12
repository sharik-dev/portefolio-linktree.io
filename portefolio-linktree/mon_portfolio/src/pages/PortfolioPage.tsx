import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TabletViewer from '../components/TabletViewer';
import { useLang, t } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';

import { useAppStoreApps } from '../hooks/useAppStoreApps';
import type { PortfolioApp } from '../data/appstoreApps';
import hackathonPrize from '../assets/awards/hackathon-ia-for-impact.jpg';
import occitanieTrainDesktop from '../assets/web-projects/occitanie-train-desktop.jpg';
import occitanieTrainMobile from '../assets/web-projects/occitanie-train-mobile.jpg';

/* ─── In-progress projects ───────────────────────────────────────── */
const IN_PROGRESS_APPS = [
  { id: 'localshort', name: 'LocalShort', subtitle: { fr: 'Lecteur de vidéos courtes en local', en: 'Offline short-form video player' }, tech: ['iOS', 'Swift', 'SwiftUI'], done: true },
  { id: 'meowtoon', name: 'meow-Toon', subtitle: { fr: 'Dessin animé interactif', en: 'Interactive cartoon app' }, tech: ['iOS', 'Swift'], done: false },
];

/* ─── Web projects ──────────────────────────────────────────────── */
const OCCITANIE_TRAIN_URL = 'https://ia-impact.51-91-125-99.sslip.io/';

const WEB_PROJECTS = [
  {
    id: 'occitanie-train',
    name: 'Occitanie en train',
    url: OCCITANIE_TRAIN_URL,
    desktop: occitanieTrainDesktop,
    mobile: occitanieTrainMobile,
    context: { fr: 'Hackathon « IA for Impact » #2 · Défi SNCF Groupe', en: '“IA for Impact” Hackathon #2 · SNCF Group challenge' },
    subtitle: { fr: 'Le train le plus rapide entre deux lieux d\u2019Occitanie', en: 'The fastest train between two places in Occitanie' },
    description: {
      fr: 'Calculateur d\u2019itinéraires construit à partir des horaires officiels SNCF (open data GTFS) : TER liO, Intercités, TGV et cars régionaux. Carte interactive des gares et des lieux à visiter, idées de sorties scolaires à portée de train, et assistant IA qui calcule les trajets et pilote la carte, à l\u2019écrit ou à la voix.',
      en: 'Route planner built on official SNCF timetables (GTFS open data): liO regional trains, Intercités, TGV and regional coaches. Interactive map of stations and places to visit, school-trip ideas within train reach, and an AI assistant that computes routes and drives the map, by text or voice.',
    },
    features: {
      fr: ['Itinéraires multimodaux (Dijkstra) avec correspondances et marche', 'Carte MapLibre des gares, lignes et lieux par catégorie', 'Générateur de sorties scolaires par niveau et thème', 'Assistant IA avec appels d\u2019outils et dictée vocale'],
      en: ['Multimodal routing (Dijkstra) with transfers and walking links', 'MapLibre map of stations, lines and places by category', 'School-trip generator by grade and theme', 'AI assistant with tool calling and voice dictation'],
    },
    tech: ['React', 'TypeScript', 'MapLibre', 'Three.js', 'Python', 'FastAPI', 'OpenAI'],
    award: { fr: 'Prix Coup de Cœur', en: "Jury's Favourite Award" },
  },
];

/* ─── Awards ──────────────────────────────────────────────────────── */
const AWARDS = [
  {
    id: 'hackathon-ia-for-impact-2026',
    image: hackathonPrize,
    title: { fr: 'Prix Coup de Cœur', en: "Jury's Favourite Award" },
    event: { fr: 'Hackathon « IA for Impact » #2', en: '“IA for Impact” Hackathon #2' },
    detail: {
      fr: 'Festival du Numérique et de l\u2019Innovation d\u2019Occitanie · La Mêlée × Toulouse INP-N7 · Défi SNCF Groupe, équipe 1',
      en: 'Occitanie Digital & Innovation Festival · La Mêlée × Toulouse INP-N7 · SNCF Group challenge, team 1',
    },
    date: { fr: '9 & 10 octobre 2026', en: 'October 9–10, 2026' },
    projectUrl: OCCITANIE_TRAIN_URL,
  },
];

/* ─── UI strings ─────────────────────────────────────────────────── */
const UI = {
  fr: {
    eyebrow: 'Mes réalisations', title: 'App Mobile',
    subtitle: 'Applications iOS développées avec Swift, SwiftUI, MVVM et Mapbox',
    preview3d: 'Aperçu 3D', hint: '↔ Rotation automatique · Cliquez-glissez',
    details: 'Voir les détails', featured: 'À la une', allProjects: 'Tous les projets',
    getFeatured: 'À la une', getNew: 'Nouveau',
    seeMore: 'Voir', modalClose: 'Fermer',
    features: 'Fonctionnalités', stack: 'Stack technique',
    download: 'Voir le projet', contact: 'Discutons',
    inProgress: 'Projets en cours', comingSoon: 'Bientôt', completed: 'Terminé',
    appStoreDownload: 'Télécharger',
    syncing: 'Synchronisation avec l\u2019App Store…',
    synced: 'Synchronisé avec l\u2019App Store',
    appsCount: 'apps publiées',
    awards: 'Distinctions',
    webProjects: 'Projets web', visitSite: 'Voir le site', seeProject: 'Voir le projet primé',
  },
  en: {
    eyebrow: 'My work', title: 'Mobile Apps',
    subtitle: 'iOS apps built with Swift, SwiftUI, MVVM and Mapbox',
    preview3d: '3D Preview', hint: '↔ Auto-rotate · Click & drag',
    details: 'See details', featured: 'Featured', allProjects: 'All projects',
    getFeatured: 'Featured', getNew: 'New',
    seeMore: 'View', modalClose: 'Close',
    features: 'Features', stack: 'Tech stack',
    download: 'See project', contact: "Let's talk",
    inProgress: 'In progress', comingSoon: 'Coming soon', completed: 'Completed',
    appStoreDownload: 'Download',
    syncing: 'Syncing with the App Store…',
    synced: 'Synced with the App Store',
    appsCount: 'published apps',
    awards: 'Awards',
    webProjects: 'Web projects', visitSite: 'Visit the site', seeProject: 'See the winning project',
  },
};

/* ─── Sub-components ─────────────────────────────────────────────── */
const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24"
        fill={i < Math.floor(rating) ? '#FF9F0A' : '#D1D1D6'}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
    <span className="ml-1 text-[10px] text-[#86868B] dark:text-[#636366]">{rating.toFixed(1)}</span>
  </div>
);

const AppCard: React.FC<{ app: PortfolioApp; lang: 'fr' | 'en'; ui: typeof UI['fr']; onClick: () => void }> = ({ app, lang, ui, onClick }) => (
  <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={onClick}
    className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 inline-block w-[156px] mr-4 align-top">
    <img src={app.icon} alt={t(lang, app.name.fr, app.name.en)} className="w-20 h-20 rounded-[20px] object-cover shadow-sm mb-3 mx-auto" />
    <div className="text-center">
      <div className="flex justify-center gap-1 mb-1.5 flex-wrap">
        {app.featured && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#CC7A00]">{ui.getFeatured}</span>}
        {app.isNew && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#27AE60]">{ui.getNew}</span>}
      </div>
      <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight mb-0.5">{t(lang, app.name.fr, app.name.en)}</h3>
      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] leading-tight mb-2">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
      <Stars rating={app.rating} />
      <p className="text-[11px] text-[#0071E3] font-medium mt-1.5">{t(lang, app.price.fr, app.price.en)}</p>
    </div>
  </motion.div>
);

const AppModal: React.FC<{ app: PortfolioApp; lang: 'fr' | 'en'; ui: typeof UI['fr']; onClose: () => void }> = ({ app, lang, ui, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const hasLanding = 'landingPage' in app && typeof (app as any).landingPage === 'string';
  const hasExternal = 'externalLink' in app && typeof (app as any).externalLink === 'string';
  const hasAppStore = 'appStoreLink' in app && typeof (app as any).appStoreLink === 'string';

  const actionBtn = hasLanding ? (
    <button onClick={() => { onClose(); navigate((app as any).landingPage); }}
      className="flex-shrink-0 bg-[#E5E5EA] dark:bg-[#3A3A3C] text-[#1D1D1F] dark:text-white text-[13px] font-semibold px-5 py-2 rounded-full hover:bg-[#D1D1D6] dark:hover:bg-[#48484A] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5">
      {lang === 'fr' ? 'Visite' : 'Visit'}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
  ) : hasExternal ? (
    <a href={(app as any).externalLink} target="_blank" rel="noopener noreferrer"
      className="flex-shrink-0 bg-[#E5E5EA] dark:bg-[#3A3A3C] text-[#1D1D1F] dark:text-white text-[13px] font-semibold px-5 py-2 rounded-full hover:bg-[#D1D1D6] dark:hover:bg-[#48484A] active:scale-95 transition-all flex items-center gap-1.5">
      {lang === 'fr' ? 'Voir' : 'Visit'}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
    </a>
  ) : null;

  const downloadBtn = hasAppStore ? (
    <a href={(app as any).appStoreLink} target="_blank" rel="noopener noreferrer"
      className="flex-shrink-0 bg-[#0071E3] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#0077ED] active:scale-95 transition-all flex items-center gap-1.5">
      {lang === 'fr' ? 'Télécharger' : 'Download'}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
    </a>
  ) : null;

  const STATS = [
    {
      label: lang === 'fr' ? 'NOTES' : 'RATINGS',
      value: app.rating.toFixed(1),
      sub: <div className="flex justify-center gap-[2px] mt-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill={i < Math.floor(app.rating) ? '#FF9F0A' : theme === 'dark' ? '#3A3A3C' : '#D1D1D6'}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>,
    },
    {
      label: lang === 'fr' ? 'CATÉGORIE' : 'CATEGORY',
      value: t(lang, app.category.fr, app.category.en).split(' & ')[0],
      sub: <span className="text-[10px] text-[#86868B] dark:text-[#636366]">{t(lang, app.category.fr, app.category.en).split(' & ')[1] ?? ''}</span>,
    },
    {
      label: lang === 'fr' ? 'TYPE' : 'TYPE',
      value: t(lang, app.price.fr, app.price.en),
      sub: null,
    },
    {
      label: lang === 'fr' ? 'DÉVELOPPEUR' : 'DEVELOPER',
      value: 'Sharik Dev',
      sub: null,
    },
    {
      label: lang === 'fr' ? 'LANGAGE' : 'LANGUAGE',
      value: app.tech[0] ?? 'Swift',
      sub: app.tech.length > 1 ? <span className="text-[10px] text-[#86868B] dark:text-[#636366]">+{app.tech.length - 1} {lang === 'fr' ? 'autres' : 'more'}</span> : null,
    },
    {
      label: lang === 'fr' ? 'PLATE-FORME' : 'PLATFORM',
      value: 'iOS',
      sub: null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-white dark:bg-[#1C1C1E] rounded-t-[2rem] md:rounded-[2rem] shadow-2xl scrollbar-hide"
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-0 md:hidden">
          <div className="w-10 h-1 rounded-full bg-[#C7C7CC] dark:bg-[#48484A]" />
        </div>

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C] flex items-center justify-center text-[#6E6E73] dark:text-[#98989D] hover:bg-[#D1D1D6] dark:hover:bg-[#48484A] transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-5 pt-5 pb-8 md:px-7 md:pt-6">

          {/* ── Header ── */}
          <div className="flex items-start gap-4 mb-5 pr-8">
            <img src={app.icon} alt={t(lang, app.name.fr, app.name.en)}
              className="w-[88px] h-[88px] rounded-[20px] shadow-xl flex-shrink-0 object-cover" />
            <div className="flex-1 min-w-0">
              <h2 className="text-[22px] font-bold text-[#1D1D1F] dark:text-white tracking-tight leading-tight">{t(lang, app.name.fr, app.name.en)}</h2>
              <p className="text-[14px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5 mb-3">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {actionBtn}
                {downloadBtn}
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-black/[0.08] dark:border-white/[0.08] mb-4" />

          {/* ── Stats strip ── */}
          <div className="flex divide-x divide-black/[0.08] dark:divide-white/[0.08] mb-4 overflow-x-auto scrollbar-hide">
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 min-w-[70px] text-center px-2 py-1">
                <p className="text-[9px] font-semibold text-[#86868B] dark:text-[#636366] uppercase tracking-[0.06em] mb-0.5">{s.label}</p>
                <p className="text-[13px] font-bold text-[#1D1D1F] dark:text-[#E5E5EA] leading-tight truncate">{s.value}</p>
                {s.sub && <div className="mt-0.5">{s.sub}</div>}
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-black/[0.08] dark:border-white/[0.08] mb-5" />

          {/* ── Preview ── */}
          <h3 className="text-[20px] font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">
            {lang === 'fr' ? 'Aperçu' : 'Preview'}
          </h3>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-3 scrollbar-hide">
            {app.screenshots.map((s, i) => (
              <img key={i} src={s} alt=""
                className="h-[260px] md:h-[300px] rounded-2xl object-cover flex-shrink-0 border border-black/[0.06] dark:border-white/[0.06]" />
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-black/[0.08] dark:border-white/[0.08] mt-5 mb-5" />

          {/* ── Tech chips ── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {app.tech.map(tech => (
              <span key={tech}
                className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#0071E3]/[0.15] text-[#4DB3FF] border border-[#0071E3]/20">
                {tech}
              </span>
            ))}
          </div>

          {/* ── Description ── */}
          <p className="text-[15px] text-[#3A3A3C] dark:text-[#E5E5EA] leading-[1.6] mb-5">
            {t(lang, app.description.fr, app.description.en)}
          </p>

          {/* ── Divider ── */}
          <div className="border-t border-black/[0.08] dark:border-white/[0.08] mb-5" />

          {/* ── Features ── */}
          <h3 className="text-[20px] font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.features}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t(lang, app.features.fr, app.features.en).map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#3A3A3C] dark:text-[#EBEBF5]/80 leading-snug">
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

        </div>
      </motion.div>
    </div>
  );
};

/* ─── Page ────────────────────────────────────────────────────────── */
const PortfolioPage: React.FC = () => {
  const { lang } = useLang();
  const ui = UI[lang];
  const { apps: APPS, refreshing } = useAppStoreApps();
  const [selectedApp, setSelectedApp] = useState<PortfolioApp | null>(null);
  const [tabletIndex, setTabletIndex] = useState(0);

  // La liste vient d'Apple : sa taille peut changer entre deux rendus.
  const tabletApp = APPS[Math.min(tabletIndex, Math.max(APPS.length - 1, 0))];

  // « À la une » : uniquement Guidor (projet pro), mis en avant seul.
  const featuredApps = APPS.filter(a => a.id === 'guidor');

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">{ui.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">{ui.title}</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">{ui.subtitle}</p>
        <p className="text-[11px] text-[#86868B] dark:text-[#636366] mt-3 flex items-center justify-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${refreshing ? 'bg-[#FF9F0A] animate-pulse' : 'bg-[#34C759]'}`} />
          {refreshing ? ui.syncing : `${ui.synced} · ${APPS.length} ${ui.appsCount}`}
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-14">

        {/* 3D Tablet */}
        {tabletApp && <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-5">{ui.preview3d}</h2>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.10] dark:border-white/[0.06] shadow-sm p-6">

            {/* Wrapper relatif : flèches centrées sur la hauteur du viewer uniquement */}
            <div className="relative">
              <button
                onClick={() => setTabletIndex(i => (i - 1 + APPS.length) % APPS.length)}
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              <button
                onClick={() => setTabletIndex(i => (i + 1) % APPS.length)}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>

              {/* Viewer centré avec marges latérales pour laisser la place aux flèches */}
              <div className="mx-12 sm:mx-14 flex justify-center">
                <div className="w-full max-w-[340px]">
                  <TabletViewer
                    screenshots={tabletApp.screenshots}
                    landscape={tabletApp.landscape ?? false}
                  />
                </div>
              </div>
            </div>

            {/* Infos app — hors du wrapper pour que top-1/2 des flèches reste sur le viewer */}
            <div className="text-center mt-3">
              <h3 className="font-semibold text-[#1D1D1F] dark:text-white text-[15px]">{t(lang, tabletApp.name.fr, tabletApp.name.en)}</h3>
              <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">{t(lang, tabletApp.subtitle.fr, tabletApp.subtitle.en)}</p>
              <p className="text-[10px] text-[#86868B] mt-1">{ui.hint}</p>
              <button onClick={() => setSelectedApp(tabletApp)}
                className="mt-3 bg-[#0071E3] text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-[#0077ED] transition-colors">
                {ui.details}
              </button>
            </div>
          </div>
        </section>}

        {/* Featured */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.featured}</h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="inline-flex pb-2">
              {featuredApps.map(app => (
                <AppCard key={app.id} app={app} lang={lang} ui={ui} onClick={() => setSelectedApp(app)} />
              ))}
            </div>
          </div>
        </section>

        {/* Web projects */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.webProjects}</h2>
          <div className="space-y-4">
            {WEB_PROJECTS.map(project => (
              <div key={project.id}
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-3xl shadow-sm overflow-hidden">
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  className="relative block bg-[#F5F5F7] dark:bg-[#2C2C2E] px-4 pt-4 md:px-8 md:pt-8">
                  <img src={project.desktop} alt={project.name} loading="lazy"
                    className="w-full md:w-[85%] rounded-t-xl border border-b-0 border-black/[0.08] dark:border-white/[0.08] shadow-md" />
                  <img src={project.mobile} alt="" loading="lazy"
                    className="hidden md:block absolute right-8 bottom-0 w-[18%] max-h-[90%] object-cover object-top rounded-t-2xl border-[5px] border-b-0 border-[#1D1D1F] shadow-xl" />
                </a>
                <div className="p-5 md:p-7">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#FF9F0A]">
                      {t(lang, project.award.fr, project.award.en)}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                      {t(lang, project.context.fr, project.context.en)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">{project.name}</h3>
                      <p className="text-[14px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">{t(lang, project.subtitle.fr, project.subtitle.en)}</p>
                    </div>
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 bg-[#0071E3] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#0077ED] active:scale-95 transition-all flex items-center gap-1.5">
                      {ui.visitSite}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                    </a>
                  </div>
                  <p className="text-[14px] text-[#3A3A3C] dark:text-[#E5E5EA] leading-[1.6] mt-4">{t(lang, project.description.fr, project.description.en)}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                    {t(lang, project.features.fr, project.features.en).map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#3A3A3C] dark:text-[#EBEBF5]/80 leading-snug">
                        <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tech.map(tech => (
                      <span key={tech} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#0071E3]/[0.07] text-[#0071E3]">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.awards}</h2>
          <div className="space-y-4">
            {AWARDS.map(award => (
              <div key={award.id}
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-3xl shadow-sm overflow-hidden md:flex">
                <img src={award.image} alt={`${t(lang, award.title.fr, award.title.en)} — ${t(lang, award.event.fr, award.event.en)}`}
                  className="w-full md:w-1/2 object-cover" loading="lazy" />
                <div className="p-5 md:p-7 flex flex-col justify-center">
                  <span className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#FF9F0A] mb-2">
                    {t(lang, award.date.fr, award.date.en)}
                  </span>
                  <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">{t(lang, award.title.fr, award.title.en)}</h3>
                  <p className="text-[14px] font-medium text-[#0071E3] mt-0.5">{t(lang, award.event.fr, award.event.en)}</p>
                  <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D] mt-2 leading-relaxed">{t(lang, award.detail.fr, award.detail.en)}</p>
                  <a href={award.projectUrl} target="_blank" rel="noopener noreferrer"
                    className="self-start mt-4 text-[13px] font-semibold text-[#0071E3] hover:underline flex items-center gap-1">
                    {ui.seeProject}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All projects */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.allProjects}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {APPS.map(app => (
              <motion.div key={app.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedApp(app)}
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <img src={app.icon} alt={t(lang, app.name.fr, app.name.en)} className="w-14 h-14 rounded-2xl object-cover shadow-sm mb-3" />
                <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{t(lang, app.name.fr, app.name.en)}</h3>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 mb-2">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {app.tech.slice(0, 2).map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0071E3]/[0.07] text-[#0071E3]">{t}</span>
                  ))}
                </div>
                <Stars rating={app.rating} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* In-progress projects */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.inProgress}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {IN_PROGRESS_APPS.map(app => (
              <div key={app.id}
                className={`bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 shadow-sm ${app.done ? '' : 'opacity-80'}`}>
                <div className="w-14 h-14 rounded-2xl mb-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center">
                  {app.done ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9 12h6M12 9v6" />
                    </svg>
                  )}
                </div>
                <div className="mb-1.5">
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${app.done ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-[#0071E3]/10 text-[#0071E3]'}`}>
                    {app.done ? ui.completed : ui.comingSoon}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{app.name}</h3>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 mb-2">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
                <div className="flex flex-wrap gap-1">
                  {app.tech.slice(0, 2).map(tech => (
                    <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0071E3]/[0.07] text-[#0071E3]">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedApp && <AppModal app={selectedApp} lang={lang} ui={ui} onClose={() => setSelectedApp(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;