import React from 'react';
import { motion } from 'framer-motion';
import { useLang, t } from '../contexts/LangContext';

import occitanieTrainDesktop from '../assets/web-projects/occitanie-train-desktop.jpg';
import occitanieTrainMobile from '../assets/web-projects/occitanie-train-mobile.jpg';
import clipetIcon from '../assets/clipet/icon.png';
import clipetShot from '../assets/clipet/og-image.png';

/* ─── Web projects ──────────────────────────────────────────────── */
const OCCITANIE_TRAIN_URL = 'https://ia-impact.51-91-125-99.sslip.io/';

type Bi = { fr: string; en: string };
type WebProject = {
  id: string;
  name: string;
  url: string;
  desktop: string;
  mobile?: string;
  icon?: string;
  context: Bi;
  subtitle: Bi;
  description: Bi;
  features: { fr: string[]; en: string[] };
  tech: string[];
  award?: Bi;
};

const WEB_PROJECTS: WebProject[] = [
  {
    id: 'occitanie-train',
    name: 'Occitanie en train',
    url: OCCITANIE_TRAIN_URL,
    desktop: occitanieTrainDesktop,
    mobile: occitanieTrainMobile,
    context: { fr: 'Hackathon « IA for Impact » #2 · Défi SNCF Groupe', en: '“IA for Impact” Hackathon #2 · SNCF Group challenge' },
    subtitle: { fr: 'Le train le plus rapide entre deux lieux d’Occitanie', en: 'The fastest train between two places in Occitanie' },
    description: {
      fr: 'Calculateur d’itinéraires construit à partir des horaires officiels SNCF (open data GTFS) : TER liO, Intercités, TGV et cars régionaux. Carte interactive des gares et des lieux à visiter, idées de sorties scolaires à portée de train, et assistant IA qui calcule les trajets et pilote la carte, à l’écrit ou à la voix.',
      en: 'Route planner built on official SNCF timetables (GTFS open data): liO regional trains, Intercités, TGV and regional coaches. Interactive map of stations and places to visit, school-trip ideas within train reach, and an AI assistant that computes routes and drives the map, by text or voice.',
    },
    features: {
      fr: ['Itinéraires multimodaux (Dijkstra) avec correspondances et marche', 'Carte MapLibre des gares, lignes et lieux par catégorie', 'Générateur de sorties scolaires par niveau et thème', 'Assistant IA avec appels d’outils et dictée vocale'],
      en: ['Multimodal routing (Dijkstra) with transfers and walking links', 'MapLibre map of stations, lines and places by category', 'School-trip generator by grade and theme', 'AI assistant with tool calling and voice dictation'],
    },
    tech: ['React', 'TypeScript', 'MapLibre', 'Three.js', 'Python', 'FastAPI', 'OpenAI'],
    award: { fr: 'Prix Coup de Cœur', en: "Jury's Favourite Award" },
  },
  {
    id: 'clipet',
    name: 'cliPet',
    url: 'https://clipet.sharik.fr/',
    desktop: clipetShot,
    icon: clipetIcon,
    context: { fr: 'App macOS · site dédié', en: 'macOS app · dedicated site' },
    subtitle: { fr: 'Un chat en pixel art qui vit sur votre Mac', en: 'A pixel-art cat that lives on your Mac' },
    description: {
      fr: 'Compagnon natif macOS qui se balade en bas de votre écran, poursuit votre curseur et garde un œil sur votre presse-papiers. Léger, 100 % local, adorable.',
      en: 'Native macOS companion that strolls along the bottom of your screen, chases your cursor and keeps an eye on your clipboard. Light, fully local, adorable.',
    },
    features: {
      fr: ['Chat pixel art animé sur le bureau', 'Poursuit le curseur et réagit aux fenêtres', 'Gestionnaire de presse-papiers intégré', '100 % local, aucune donnée envoyée'],
      en: ['Animated pixel-art cat on your desktop', 'Chases the cursor and reacts to windows', 'Built-in clipboard manager', '100% local, no data sent'],
    },
    tech: ['macOS', 'Swift', 'SwiftUI', 'AppKit'],
  },
];

/* ─── UI strings ─────────────────────────────────────────────────── */
const UI = {
  fr: {
    eyebrow: 'Mes réalisations',
    title: 'Projets web',
    subtitle: 'Sites et applications web, du front React à l’API Python',
    visitSite: 'Voir le site',
  },
  en: {
    eyebrow: 'My work',
    title: 'Web projects',
    subtitle: 'Websites and web apps, from the React front end to the Python API',
    visitSite: 'Visit the site',
  },
};

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

const WebPage: React.FC = () => {
  const { lang } = useLang();
  const ui = UI[lang];

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">{ui.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">{ui.title}</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">{ui.subtitle}</p>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-6">
        {WEB_PROJECTS.map(project => (
          <motion.section key={project.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-3xl shadow-sm overflow-hidden">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="relative block bg-[#F5F5F7] dark:bg-[#2C2C2E] px-4 pt-4 md:px-8 md:pt-8">
              <img src={project.desktop} alt={project.name}
                className="w-full md:w-[85%] rounded-t-xl border border-b-0 border-black/[0.08] dark:border-white/[0.08] shadow-md" />
              {project.mobile && (
                <img src={project.mobile} alt="" loading="lazy"
                  className="hidden md:block absolute right-8 bottom-0 w-[18%] max-h-[90%] object-cover object-top rounded-t-2xl border-[5px] border-b-0 border-[#1D1D1F] shadow-xl" />
              )}
            </a>
            <div className="p-5 md:p-7">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {project.award && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#FF9F0A]">
                    {t(lang, project.award.fr, project.award.en)}
                  </span>
                )}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                  {t(lang, project.context.fr, project.context.en)}
                </span>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  {project.icon && <img src={project.icon} alt="" className="w-12 h-12 rounded-[12px] shadow-sm flex-shrink-0 object-cover" />}
                  <div className="min-w-0">
                  <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">{project.name}</h2>
                  <p className="text-[14px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">{t(lang, project.subtitle.fr, project.subtitle.en)}</p>
                  </div>
                </div>
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 bg-[#0071E3] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#0077ED] active:scale-95 transition-all flex items-center gap-1.5">
                  {ui.visitSite}<ArrowIcon />
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
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default WebPage;
