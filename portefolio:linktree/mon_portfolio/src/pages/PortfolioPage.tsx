import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabletViewer from '../components/TabletViewer';

interface AppInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  screenshots: string[];
  features: string[];
  tech: string[];
  price: string;
  category: string;
  featured?: boolean;
  isNew?: boolean;
  rating: number;
}

const apps: AppInfo[] = [
  {
    id: 'focusfast',
    name: 'FocusFast',
    subtitle: 'Application vidéo courte',
    description: 'Application iOS de type TikTok avec un feed vertical de vidéos courtes. Architecture MVVM avec AVFoundation pour la lecture vidéo haute performance, système de catégories, commentaires/notes et upload vidéo.',
    icon: 'https://cdn-icons-png.flaticon.com/512/6295/6295532.png',
    screenshots: [
      'https://img.freepik.com/free-vector/gradient-mindfulness-app-interface_23-2149099708.jpg',
      'https://img.freepik.com/free-vector/gradient-mindfulness-app-screens_23-2149099694.jpg',
      'https://img.freepik.com/free-vector/gradient-meditation-app-interface_23-2149116595.jpg'
    ],
    features: ['Feed vertical de vidéos', 'Architecture MVVM', 'Catégories & filtres', 'Commentaires & notes', 'Upload vidéo'],
    tech: ['Swift', 'MVVM', 'AVFoundation', 'UIKit'],
    price: 'Projet personnel',
    category: 'Social & Vidéo',
    featured: true,
    rating: 4.8
  },
  {
    id: 'mapbox-weather',
    name: 'MapboxMaps Weather',
    subtitle: 'Couches météo multicouches',
    description: 'Intégration de couches météo multiples sur MapboxMaps SDK v10+ pour Skyconseil. Filtres dynamiques, expressions de zoom, gestion de visibilité par piste avec compatibilité SDK legacy et v10+.',
    icon: 'https://cdn-icons-png.flaticon.com/512/5341/5341569.png',
    screenshots: [
      'https://img.freepik.com/free-vector/dashboard-user-panel-template_23-2148627015.jpg',
      'https://img.freepik.com/free-vector/crypto-dashboard-concept_23-2148627011.jpg',
      'https://img.freepik.com/free-vector/dashboard-template-gradient-style_23-2148627124.jpg'
    ],
    features: ['Couches météo multiples', 'Filtres dynamiques JSON', 'Expressions de zoom', 'Compatibilité legacy/v10+', 'Documentation technique'],
    tech: ['Swift', 'MapboxMaps SDK v10+', 'JSON', 'iOS'],
    price: 'Skyconseil – Alternance',
    category: 'Cartographie & Météo',
    featured: true,
    isNew: true,
    rating: 4.9
  },
  {
    id: 'guidor',
    name: 'Guidor',
    subtitle: 'Embarqué Arduino & C++',
    description: 'Projet de développement embarqué avec Arduino et C++ réalisé chez Le Facteur Humain & Combustible Numérique. Système de guidage intelligent avec capteurs et interface de contrôle.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2387/2387635.png',
    screenshots: [
      'https://img.freepik.com/free-vector/app-dashboard-tasks-dark-mode_23-2148703295.jpg',
      'https://img.freepik.com/free-vector/application-mobile-statistics-dashboard_23-2148607159.jpg',
      'https://img.freepik.com/free-vector/application-mobile-control-dashboard_23-2148607161.jpg'
    ],
    features: ['Développement embarqué', 'Capteurs & actionneurs', 'Interface de contrôle', 'Firmware C++'],
    tech: ['C++', 'Arduino', 'Embarqué'],
    price: 'Stage – Le Facteur Humain',
    category: 'Embarqué',
    isNew: false,
    rating: 4.5
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? '#FF9F0A' : '#D1D1D6'}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
    <span className="ml-1 text-[11px] text-[#86868B] dark:text-[#636366]">{rating.toFixed(1)}</span>
  </div>
);

const AppCard: React.FC<{ app: AppInfo; onClick: () => void }> = ({ app, onClick }) => (
  <motion.div
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 inline-block w-[160px] mr-4 align-top"
  >
    <img src={app.icon} alt={app.name} className="w-20 h-20 rounded-[18px] object-cover shadow-sm mb-3 mx-auto" />
    <div className="text-center">
      <div className="flex justify-center gap-1 mb-1">
        {app.featured && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#CC7A00]">À la une</span>}
        {app.isNew && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#27AE60]">Nouveau</span>}
      </div>
      <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight mb-0.5">{app.name}</h3>
      <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] leading-tight mb-2">{app.subtitle}</p>
      <StarRating rating={app.rating} />
      <p className="text-[11px] text-[#0071E3] font-medium mt-1.5">{app.price}</p>
    </div>
  </motion.div>
);

const AppModal: React.FC<{ app: AppInfo; onClose: () => void }> = ({ app, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 400 }}
      className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1C1C1E] rounded-t-3xl md:rounded-3xl shadow-2xl scrollbar-hide"
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1 md:hidden">
        <div className="w-9 h-1 rounded-full bg-[#C7C7CC] dark:bg-[#48484A]" />
      </div>

      <div className="p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#E8E8ED] dark:bg-[#2C2C2E] flex items-center justify-center text-[#6E6E73] hover:bg-[#D1D1D6] dark:hover:bg-[#3A3A3C] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src={app.icon} alt={app.name} className="w-20 h-20 rounded-[18px] shadow-md" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-0.5">{app.name}</h2>
            <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mb-2">{app.subtitle}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D]">{app.category}</span>
              <StarRating rating={app.rating} />
            </div>
          </div>
          <button className="flex-shrink-0 bg-[#0071E3] text-white text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-[#0077ED] transition-colors">
            Voir
          </button>
        </div>

        {/* Screenshots */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {app.screenshots.map((s, i) => (
            <img key={i} src={s} alt={`Screenshot ${i + 1}`} className="h-52 rounded-2xl object-cover border border-black/[0.06] dark:border-white/[0.06] flex-shrink-0" />
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {app.tech.map(t => (
            <span key={t} className="text-[12px] font-medium px-3 py-1 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3]">{t}</span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-4">{app.description}</p>

        {/* Features */}
        <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-white mb-3">Fonctionnalités</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {app.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#6E6E73] dark:text-[#98989D]">
              <span className="text-[#0071E3] font-bold mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </div>
);

const PortfolioPage: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<AppInfo | null>(null);
  const [tabletIndex, setTabletIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[13px] font-semibold text-[#0071E3] uppercase tracking-widest mb-2">Mes réalisations</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">App Portfolio</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">
          Applications iOS et projets développés avec Swift, MVVM et Mapbox
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-14">

        {/* 3D Tablet Carousel */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-6">Aperçu 3D</h2>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.06] dark:border-white/[0.06] shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setTabletIndex(i => (i - 1 + apps.length) % apps.length)}
                className="w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              <div className="flex-1 max-w-[380px]">
                <TabletViewer screenshotUrl={apps[tabletIndex].screenshots[0]} />
                <div className="text-center mt-4">
                  <h3 className="font-semibold text-[#1D1D1F] dark:text-white">{apps[tabletIndex].name}</h3>
                  <p className="text-sm text-[#6E6E73] dark:text-[#98989D]">{apps[tabletIndex].subtitle}</p>
                  <p className="text-[11px] text-[#86868B] mt-1">↔ Rotation automatique · Cliquez-glissez</p>
                  <button
                    onClick={() => setSelectedApp(apps[tabletIndex])}
                    className="mt-3 bg-[#0071E3] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#0077ED] transition-colors"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>

              <button
                onClick={() => setTabletIndex(i => (i + 1) % apps.length)}
                className="w-10 h-10 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">À la une</h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="inline-flex pb-2">
              {apps.filter(a => a.featured).map(app => (
                <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} />
              ))}
            </div>
          </div>
        </section>

        {/* All projects */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">Tous les projets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {apps.map(app => (
              <motion.div
                key={app.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedApp(app)}
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={app.icon} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm mb-3" />
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{app.name}</h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5 mb-2">{app.subtitle}</p>
                <StarRating rating={app.rating} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedApp && <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;