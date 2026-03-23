import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TabletViewer from '../components/TabletViewer';
import { useLang, t } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';

import guidorLogo from '../assets/guidor/logo.png';
import guidorImg1 from '../assets/guidor/imageApp.png';
import guidorImg2 from '../assets/guidor/imageApp2.png';
import meowTubeIcon from '../assets/meowTube/appLogo.png';
import meowTubeHome from '../assets/meowTube/AppHomePage.png';
import meowTubeSecond from '../assets/meowTube/AppSecondPage.png';
import localShortIcon from '../assets/localShort/logo.png';
import localShortScreen1 from '../assets/localShort/screen1.PNG';
import localShortScreen2 from '../assets/localShort/screen2.PNG';
import islamicIcon from '../assets/islamic daily quote/logo.png';
import islamicScreen1 from '../assets/islamic daily quote/firstImage.png';
import islamicScreen2 from '../assets/islamic daily quote/second image.png';
import islamicScreen3 from '../assets/islamic daily quote/thirst image.png';

/* ─── Bilingual app data ─────────────────────────────────────────── */
const APPS = [
  {
    id: 'guidor',
    name: 'Guidor',
    subtitle: { fr: 'Application aviation professionnelle', en: 'Professional aviation app' },
    description: { fr: 'Guidor est une application aviation professionnelle destinée aux pilotes de ligne et opérateurs de vol. Elle analyse la route et l\'environnement en temps réel pour optimiser la planification et améliorer la sécurité à chaque phase du vol.', en: 'Guidor is a professional aviation app designed for airline pilots and flight operators. It analyzes the route and surrounding environment in real time to optimize flight planning and improve safety at every stage of the flight.' },
    features: { fr: ['Visualisation route & profil vertical', 'Météo aviation (METAR, TAF, turbulences)', 'Mises à jour en temps réel (Wi-Fi bord)', 'Optimisation de route & altitude', 'Alertes turbulences & météo dangereuse', 'Intégration standards ARINC & avionique'], en: ['Route & vertical profile visualization', 'Aviation weather (METAR, TAF, turbulence)', 'Real-time updates (onboard Wi-Fi)', 'Route & altitude optimization', 'Turbulence & dangerous weather alerts', 'ARINC avionics integration'] },
    price: { fr: 'Application professionnelle', en: 'Professional application' },
    category: { fr: 'Aviation & Navigation', en: 'Aviation & Navigation' },
    icon: guidorLogo,
    screenshots: [guidorImg1, guidorImg2],
    tech: ['iOS', 'Swift', 'Aviation APIs', 'ARINC'],
    featured: true,
    isNew: false,
    rating: 4.8,
    externalLink: 'https://www.guidor.fr/',
  },
  {
    id: 'meowtube',
    name: 'Meow-Tube',
    subtitle: { fr: 'Vidéo sans distraction, axé productivité', en: 'Distraction-free, productivity-first video' },
    description: { fr: 'Application iOS de consultation de contenu multimédia type YouTube, sans Shorts, sans publicités et sans timer de temps passé. Conçue pour une consommation saine et productive de vidéos.', en: 'iOS app for browsing YouTube-style content — no Shorts, no ads, no screen-time tracking. Built for focused, healthy video consumption.' },
    features: { fr: ['Zéro publicité', 'Sans vidéos courtes', 'Aucun suivi du temps', 'Interface épurée', 'Axé productivité'], en: ['Zero ads', 'No short-form content', 'No time tracking', 'Clean interface', 'Productivity focused'] },
    price: { fr: 'Projet personnel', en: 'Personal project' },
    category: { fr: 'Productivité & Vidéo', en: 'Productivity & Video' },
    icon: meowTubeIcon,
    screenshots: [meowTubeHome, meowTubeSecond],
    tech: ['Swift', 'SwiftUI', 'AVFoundation', 'iOS'],
    featured: true,
    isNew: true,
    rating: 4.9,
    landingPage: '/meowtube',
  },
  {
    id: 'localshort',
    name: 'LocalShort',
    subtitle: { fr: 'Lecteur de vidéos courtes en local', en: 'Offline short-form video player' },
    description: { fr: 'LocalShort est une application iOS permettant de consulter vos vidéos courtes (TikTok, Reels, Shorts) stockées localement sur votre appareil. Sans connexion, sans algorithme, avec un respect total de votre vie privée.', en: 'LocalShort is an iOS app for browsing your short-form videos (TikTok, Reels, Shorts) stored locally on your device. No internet, no algorithm, with total privacy.' },
    features: { fr: ['Lecture hors ligne totale', 'Zéro donnée transmise', 'Import depuis la galerie', 'Interface fluide & rapide', 'Lecture en boucle', 'Aucun algorithme'], en: ['Fully offline playback', 'Zero data transmitted', 'Import from gallery', 'Smooth & fast interface', 'Loop playback', 'No algorithm'] },
    price: { fr: 'Projet personnel', en: 'Personal project' },
    category: { fr: 'Vidéo & Productivité', en: 'Video & Productivity' },
    icon: localShortIcon,
    screenshots: [localShortScreen1, localShortScreen2],
    tech: ['Swift', 'SwiftUI', 'AVFoundation', 'iOS'],
    featured: true,
    isNew: true,
    rating: 4.7,
    landingPage: '/local-short',
  },
  {
    id: 'islamic-daily-quote',
    name: 'Islamic Daily Quote',
    subtitle: { fr: 'Citation islamique quotidienne', en: 'Daily Islamic quote' },
    description: { fr: 'Application iOS proposant chaque jour une citation islamique tirée du Coran ou des Hadiths, en arabe et en plusieurs langues. Conçue pour le bien-être spirituel et la pratique quotidienne.', en: 'iOS app offering a new Islamic quote every day from the Quran or Hadiths, in Arabic and multiple languages. Designed for spiritual wellness and daily practice.' },
    features: { fr: ['Citation quotidienne (Coran & Hadiths)', 'Arabe + traduction multilingue', 'Interface épurée & apaisante', 'Notifications journalières', 'Partage de citations', 'Mode sombre'], en: ['Daily quote (Quran & Hadiths)', 'Arabic + multilingual translation', 'Clean & calming interface', 'Daily notifications', 'Share quotes', 'Dark mode'] },
    price: { fr: 'Projet personnel', en: 'Personal project' },
    category: { fr: 'Spiritualité & Bien-être', en: 'Spirituality & Wellness' },
    icon: islamicIcon,
    screenshots: [islamicScreen1, islamicScreen2, islamicScreen3],
    tech: ['Swift', 'SwiftUI', 'iOS'],
    featured: true,
    isNew: true,
    rating: 4.8,
    landingPage: '/islamic-daily-quote',
  },
];

/* ─── UI strings ─────────────────────────────────────────────────── */
const UI = {
  fr: {
    eyebrow: 'Mes réalisations', title: 'App Portfolio',
    subtitle: 'Applications iOS et projets développés avec Swift, MVVM et Mapbox',
    preview3d: 'Aperçu 3D', hint: '↔ Rotation automatique · Cliquez-glissez',
    details: 'Voir les détails', featured: 'À la une', allProjects: 'Tous les projets',
    getFeatured: 'À la une', getNew: 'Nouveau',
    seeMore: 'Voir', modalClose: 'Fermer',
    features: 'Fonctionnalités', stack: 'Stack technique',
    download: 'Voir le projet', contact: 'Discutons',
  },
  en: {
    eyebrow: 'My work', title: 'App Portfolio',
    subtitle: 'iOS apps & projects built with Swift, MVVM and Mapbox',
    preview3d: '3D Preview', hint: '↔ Auto-rotate · Click & drag',
    details: 'See details', featured: 'Featured', allProjects: 'All projects',
    getFeatured: 'Featured', getNew: 'New',
    seeMore: 'View', modalClose: 'Close',
    features: 'Features', stack: 'Tech stack',
    download: 'See project', contact: "Let's talk",
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

const AppCard: React.FC<{ app: typeof APPS[0]; lang: 'fr' | 'en'; ui: typeof UI['fr']; onClick: () => void }> = ({ app, lang, ui, onClick }) => (
  <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={onClick}
    className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 inline-block w-[156px] mr-4 align-top">
    <img src={app.icon} alt={app.name} className="w-20 h-20 rounded-[20px] object-cover shadow-sm mb-3 mx-auto" />
    <div className="text-center">
      <div className="flex justify-center gap-1 mb-1.5 flex-wrap">
        {app.featured && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#CC7A00]">{ui.getFeatured}</span>}
        {app.isNew && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#27AE60]">{ui.getNew}</span>}
      </div>
      <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight mb-0.5">{app.name}</h3>
      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] leading-tight mb-2">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
      <Stars rating={app.rating} />
      <p className="text-[11px] text-[#0071E3] font-medium mt-1.5">{t(lang, app.price.fr, app.price.en)}</p>
    </div>
  </motion.div>
);

const AppModal: React.FC<{ app: typeof APPS[0]; lang: 'fr' | 'en'; ui: typeof UI['fr']; onClose: () => void }> = ({ app, lang, ui, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const hasLanding = 'landingPage' in app && typeof (app as any).landingPage === 'string';
  const hasExternal = 'externalLink' in app && typeof (app as any).externalLink === 'string';

  const actionBtn = hasLanding ? (
    <button onClick={() => { onClose(); navigate((app as any).landingPage); }}
      className="flex-shrink-0 bg-[#E60000] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#CC0000] active:scale-95 transition-all cursor-pointer">
      {lang === 'fr' ? 'Découvrir' : 'Discover'}
    </button>
  ) : hasExternal ? (
    <a href={(app as any).externalLink} target="_blank" rel="noopener noreferrer"
      className="flex-shrink-0 bg-[#0071E3] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#0077ED] active:scale-95 transition-all">
      {lang === 'fr' ? 'Voir' : 'Visit'}
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
            <img src={app.icon} alt={app.name}
              className="w-[88px] h-[88px] rounded-[20px] shadow-xl flex-shrink-0 object-cover" />
            <div className="flex-1 min-w-0">
              <h2 className="text-[22px] font-bold text-[#1D1D1F] dark:text-white tracking-tight leading-tight">{app.name}</h2>
              <p className="text-[14px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5 mb-3">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
              {actionBtn}
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
  const [selectedApp, setSelectedApp] = useState<typeof APPS[0] | null>(null);
  const [tabletIndex, setTabletIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">{ui.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">{ui.title}</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">{ui.subtitle}</p>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-14">

        {/* 3D Tablet */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-5">{ui.preview3d}</h2>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.10] dark:border-white/[0.06] shadow-sm p-6">
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setTabletIndex(i => (i - 1 + APPS.length) % APPS.length)}
                className="w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <div className="flex-1 max-w-[360px]">
                <TabletViewer
                  screenshots={APPS[tabletIndex].screenshots}
                  landscape={APPS[tabletIndex].id === 'guidor'}
                />
                <div className="text-center mt-3">
                  <h3 className="font-semibold text-[#1D1D1F] dark:text-white text-[15px]">{APPS[tabletIndex].name}</h3>
                  <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">{t(lang, APPS[tabletIndex].subtitle.fr, APPS[tabletIndex].subtitle.en)}</p>
                  <p className="text-[10px] text-[#86868B] mt-1">{ui.hint}</p>
                  <button onClick={() => setSelectedApp(APPS[tabletIndex])}
                    className="mt-3 bg-[#0071E3] text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-[#0077ED] transition-colors">
                    {ui.details}
                  </button>
                </div>
              </div>
              <button onClick={() => setTabletIndex(i => (i + 1) % APPS.length)}
                className="w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.featured}</h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="inline-flex pb-2">
              {APPS.filter(a => a.featured).map(app => (
                <AppCard key={app.id} app={app} lang={lang} ui={ui} onClick={() => setSelectedApp(app)} />
              ))}
            </div>
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
                <img src={app.icon} alt={app.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm mb-3" />
                <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{app.name}</h3>
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
      </div>

      <AnimatePresence>
        {selectedApp && <AppModal app={selectedApp} lang={lang} ui={ui} onClose={() => setSelectedApp(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;