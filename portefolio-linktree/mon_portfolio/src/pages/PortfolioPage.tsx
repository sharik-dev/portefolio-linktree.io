import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabletViewer from '../components/TabletViewer';
import { useLang, t } from '../contexts/LangContext';

import screenshotFocusfast from '../assets/images/screenshots/focusfast.png';
import screenshotMapbox from '../assets/images/screenshots/mapbox_weather.png';
import screenshotGuidor from '../assets/images/screenshots/guidor.png';

/* ─── Bilingual app data ─────────────────────────────────────────── */
const APPS = [
  {
    id: 'focusfast',
    name: 'FocusFast',
    subtitle: { fr: 'Application vidéo courte', en: 'Short-Video iOS App' },
    description: { fr: 'Application iOS de type TikTok avec un feed vertical de vidéos courtes. Architecture MVVM avec AVFoundation pour la lecture vidéo haute performance, système de catégories, commentaires/notes et upload vidéo.', en: 'TikTok-style iOS app with a swipeable vertical video feed. MVVM architecture using AVFoundation for high-performance playback, category system, comments/ratings and video upload.' },
    features: { fr: ['Feed vertical de vidéos', 'Architecture MVVM', 'Catégories & filtres', 'Commentaires & notes', 'Upload vidéo'], en: ['Swipeable vertical video feed', 'MVVM Architecture', 'Categories & filters', 'Comments & ratings', 'Video upload'] },
    price: { fr: 'Projet personnel', en: 'Personal project' },
    category: { fr: 'Social & Vidéo', en: 'Social & Video' },
    icon: 'https://cdn-icons-png.flaticon.com/512/6295/6295532.png',
    screenshots: [
      screenshotFocusfast,
      screenshotFocusfast,
      screenshotFocusfast
    ],
    tech: ['Swift', 'MVVM', 'AVFoundation', 'UIKit'],
    featured: true,
    isNew: false,
    rating: 4.8,
  },
  {
    id: 'mapbox-weather',
    name: 'MapboxMaps Weather',
    subtitle: { fr: 'Couches météo multicouches', en: 'Multi-layer weather mapping' },
    description: { fr: 'Intégration de couches météo multiples sur MapboxMaps SDK v10+ pour Skyconseil. Filtres dynamiques, expressions de zoom, gestion de visibilité par piste avec compatibilité SDK legacy et v10+.', en: 'Multiple weather overlay layers on MapboxMaps SDK v10+ for Skyconseil. Dynamic filters, zoom expressions, per-track visibility management with backward compatibility between legacy SDK and v10+.' },
    features: { fr: ['Couches météo multiples', 'Filtres dynamiques JSON', 'Expressions de zoom', 'Compatibilité legacy/v10+', 'Documentation technique'], en: ['Multiple weather layers', 'Dynamic JSON filters', 'Zoom expressions', 'Legacy/v10+ compatibility', 'Technical documentation'] },
    price: { fr: 'Skyconseil – Alternance', en: 'Skyconseil – Work-Study' },
    category: { fr: 'Cartographie & Météo', en: 'Mapping & Weather' },
    icon: 'https://cdn-icons-png.flaticon.com/512/5341/5341569.png',
    screenshots: [
      screenshotMapbox,
      screenshotMapbox,
      screenshotMapbox
    ],
    tech: ['Swift', 'MapboxMaps SDK v10+', 'JSON', 'iOS'],
    featured: true,
    isNew: true,
    rating: 4.9,
  },
  {
    id: 'guidor',
    name: 'Guidor',
    subtitle: { fr: 'Embarqué Arduino & C++', en: 'Embedded Arduino & C++' },
    description: { fr: 'Projet de développement embarqué avec Arduino et C++ réalisé chez Le Facteur Humain & Combustible Numérique. Système de guidage intelligent avec capteurs et interface de contrôle.', en: 'Embedded development project built with Arduino and C++ at Le Facteur Humain & Combustible Numérique. Intelligent guidance system with sensors and a control interface.' },
    features: { fr: ['Développement embarqué', 'Capteurs & actionneurs', 'Interface de contrôle', 'Firmware C++'], en: ['Embedded development', 'Sensors & actuators', 'Control interface', 'C++ firmware'] },
    price: { fr: 'Stage – Le Facteur Humain', en: 'Internship – Le Facteur Humain' },
    category: { fr: 'Embarqué', en: 'Embedded' },
    icon: 'https://cdn-icons-png.flaticon.com/512/2387/2387635.png',
    screenshots: [
      screenshotGuidor,
      screenshotGuidor,
      screenshotGuidor
    ],
    tech: ['C++', 'Arduino', 'Embedded'],
    featured: false,
    isNew: false,
    rating: 4.5,
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
    className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 inline-block w-[156px] mr-4 align-top">
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

const AppModal: React.FC<{ app: typeof APPS[0]; lang: 'fr' | 'en'; ui: typeof UI['fr']; onClose: () => void }> = ({ app, lang, ui, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#1C1C1E] rounded-t-3xl md:rounded-3xl shadow-2xl scrollbar-hide"
    >
      {/* iOS drag handle */}
      <div className="flex justify-center pt-3 pb-1 md:hidden">
        <div className="w-9 h-1 rounded-full bg-[#C7C7CC] dark:bg-[#48484A]" />
      </div>
      <div className="p-5 md:p-7">
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#E8E8ED] dark:bg-[#2C2C2E] flex items-center justify-center text-[#6E6E73] hover:bg-[#D1D1D6] dark:hover:bg-[#3A3A3C] transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <img src={app.icon} alt={app.name} className="w-20 h-20 rounded-[20px] shadow-md flex-shrink-0" />
          <div className="flex-1 min-w-0 pt-1">
            <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-0.5">{app.name}</h2>
            <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mb-2">{t(lang, app.subtitle.fr, app.subtitle.en)}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D]">
                {t(lang, app.category.fr, app.category.en)}
              </span>
              <Stars rating={app.rating} />
            </div>
          </div>
          <span className="flex-shrink-0 mt-1 bg-[#0071E3] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-[#0077ED] transition-colors cursor-pointer">
            {ui.seeMore}
          </span>
        </div>

        {/* Screenshots */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-1 px-1">
          {app.screenshots.map((s, i) => (
            <img key={i} src={s} alt="" className="h-48 md:h-56 rounded-2xl object-cover border border-black/[0.06] dark:border-white/[0.06] flex-shrink-0" />
          ))}
        </div>

        {/* Tech stack chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {app.tech.map(t => (
            <span key={t} className="text-[12px] font-medium px-3 py-1 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3]">{t}</span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-4">
          {t(lang, app.description.fr, app.description.en)}
        </p>

        {/* Features */}
        <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white mb-3">{ui.features}</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {t(lang, app.features.fr, app.features.en).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#6E6E73] dark:text-[#98989D]">
              <span className="text-[#0071E3] font-bold shrink-0 mt-0.5">✓</span>{f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </div>
);

/* ─── Page ────────────────────────────────────────────────────────── */
const PortfolioPage: React.FC = () => {
  const { lang } = useLang();
  const ui = UI[lang];
  const [selectedApp, setSelectedApp] = useState<typeof APPS[0] | null>(null);
  const [tabletIndex, setTabletIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black transition-colors duration-300">

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
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.06] dark:border-white/[0.06] shadow-sm p-6">
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setTabletIndex(i => (i - 1 + APPS.length) % APPS.length)}
                className="w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <div className="flex-1 max-w-[360px]">
                <TabletViewer screenshotUrl={APPS[tabletIndex].screenshots[0]} />
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
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
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