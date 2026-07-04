import React from 'react';
import { motion } from 'framer-motion';
import { useLang, t } from '../contexts/LangContext';

import clipetIcon from '../assets/clipet/icon.png';
import clipetShot from '../assets/clipet/og-image.png';

/* ─── Featured desktop software ──────────────────────────────────── */
const CLIPET = {
  name: 'cliPet',
  url: 'https://clipet.sharik.fr/',
  tagline: {
    fr: 'Un chat en pixel art qui vit sur votre Mac',
    en: 'A pixel-art cat that lives on your Mac',
  },
  description: {
    fr: "Compagnon natif macOS qui se balade en bas de votre écran, poursuit votre curseur et garde un œil sur votre presse-papiers. Léger, 100 % local, adorable.",
    en: 'Native macOS companion that strolls along the bottom of your screen, chases your cursor and keeps an eye on your clipboard. Light, fully local, adorable.',
  },
  features: {
    fr: [
      'Chat pixel art animé sur le bureau',
      'Poursuit le curseur & réagit aux fenêtres',
      'Gestionnaire de presse-papiers intégré',
      'Application menu bar native',
      '100 % local — aucune donnée envoyée',
      'Ultra léger & économe en batterie',
    ],
    en: [
      'Animated pixel-art cat on your desktop',
      'Chases the cursor & reacts to windows',
      'Built-in clipboard manager',
      'Native menu-bar app',
      '100% local — no data sent',
      'Ultra light & battery-friendly',
    ],
  },
  tech: ['macOS', 'Swift', 'SwiftUI', 'AppKit'],
};

/* ─── UI strings ─────────────────────────────────────────────────── */
const UI = {
  fr: {
    eyebrow: 'Logiciels de bureau',
    title: 'App Desktop',
    subtitle: 'Applications natives macOS conçues avec Swift & SwiftUI',
    featured: 'À la une',
    visit: 'Visiter le site',
    features: 'Fonctionnalités',
    stack: 'Stack technique',
    new: 'Nouveau',
    ctaTitle: 'Envie de le voir en action ?',
    ctaText: 'Découvrez cliPet sur son site dédié.',
    ctaBtn: 'Ouvrir clipet.sharik.fr',
  },
  en: {
    eyebrow: 'Desktop software',
    title: 'Desktop Apps',
    subtitle: 'Native macOS apps built with Swift & SwiftUI',
    featured: 'Featured',
    visit: 'Visit the site',
    features: 'Features',
    stack: 'Tech stack',
    new: 'New',
    ctaTitle: 'Want to see it in action?',
    ctaText: 'Discover cliPet on its dedicated site.',
    ctaBtn: 'Open clipet.sharik.fr',
  },
};

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

const DesktopPage: React.FC = () => {
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

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-12">

        {/* ── Featured: cliPet ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">{ui.featured}</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#27AE60]">{ui.new}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-3xl shadow-sm overflow-hidden"
          >
            {/* Preview banner */}
            <div className="relative bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
              <img src={clipetShot} alt="cliPet" className="w-full object-cover max-h-[340px]" />
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-5">
                <img src={clipetIcon} alt="cliPet" className="w-[76px] h-[76px] rounded-[18px] shadow-lg flex-shrink-0 object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[24px] font-bold text-[#1D1D1F] dark:text-white tracking-tight leading-tight">{CLIPET.name}</h3>
                  <p className="text-[14px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5">{t(lang, CLIPET.tagline.fr, CLIPET.tagline.en)}</p>
                </div>
                <a href={CLIPET.url} target="_blank" rel="noopener noreferrer"
                  className="hidden sm:flex flex-shrink-0 items-center gap-1.5 bg-[#0071E3] text-white text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-[#0077ED] active:scale-95 transition-all">
                  {ui.visit}<ArrowIcon />
                </a>
              </div>

              {/* Tech chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {CLIPET.tech.map(tech => (
                  <span key={tech} className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#0071E3]/[0.15] text-[#4DB3FF] border border-[#0071E3]/20">{tech}</span>
                ))}
              </div>

              <p className="text-[15px] text-[#3A3A3C] dark:text-[#E5E5EA] leading-[1.6] mb-6">
                {t(lang, CLIPET.description.fr, CLIPET.description.en)}
              </p>

              {/* Features */}
              <h4 className="text-[18px] font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.features}</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                {t(lang, CLIPET.features.fr, CLIPET.features.en).map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#3A3A3C] dark:text-[#EBEBF5]/80 leading-snug">
                    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Mobile visit button */}
              <a href={CLIPET.url} target="_blank" rel="noopener noreferrer"
                className="sm:hidden mt-5 w-full flex items-center justify-center gap-1.5 bg-[#0071E3] text-white text-[14px] font-bold px-5 py-3 rounded-full active:scale-95 transition-all">
                {ui.visit}<ArrowIcon />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── CTA to the dedicated page ── */}
        <section>
          <a href={CLIPET.url} target="_blank" rel="noopener noreferrer"
            className="group block bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-3xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <img src={clipetIcon} alt="cliPet" className="w-14 h-14 rounded-[16px] shadow-sm flex-shrink-0 object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-bold text-[#1D1D1F] dark:text-white tracking-tight">{ui.ctaTitle}</h3>
                <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">{ui.ctaText}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0071E3] group-hover:gap-2.5 transition-all">
                {ui.ctaBtn}<ArrowIcon />
              </span>
            </div>
          </a>
        </section>
      </div>
    </div>
  );
};

export default DesktopPage;
