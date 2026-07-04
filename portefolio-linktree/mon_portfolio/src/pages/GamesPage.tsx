import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, t } from '../contexts/LangContext';

import jeuDePointScreen1 from '../assets/jeu de point/screenshoot/iPhone 17-01_Menu.png';
import jeuDePointScreen2 from '../assets/jeu de point/screenshoot/iPhone 17-02_Game.png';

/* ─── Games ──────────────────────────────────────────────────────── */
type Game = {
  id: string;
  name: string;
  subtitle: { fr: string; en: string };
  description: { fr: string; en: string };
  features: { fr: string[]; en: string[] };
  icon: string;
  screenshots: string[];
  tech: string[];
  status: 'released' | 'in-progress';
  appStoreLink?: string;
};

const GAMES: Game[] = [
  {
    id: 'jeu-de-point',
    name: 'Jeu de Point',
    subtitle: { fr: 'Jeu de stratégie traditionnel malgache', en: 'Traditional Malagasy strategy game' },
    description: {
      fr: "Un jeu de points traditionnel malgache qui allie simplicité et profondeur stratégique. Placez vos points, créez des connexions intelligentes et anticipez les mouvements de votre adversaire.",
      en: "A traditional Malagasy point-based game combining simplicity and strategic depth. Place your points, create smart connections, and anticipate your opponent's moves.",
    },
    features: {
      fr: ['Jeu de stratégie traditionnel', 'Contrôles intuitifs', 'Interface épurée', 'Parties rapides ou longues', 'Zéro donnée collectée'],
      en: ['Traditional strategy game', 'Intuitive controls', 'Clean interface', 'Quick or lengthy matches', 'Zero data collected'],
    },
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b5/9c/a3/b59ca3fd-fa0a-6ecf-c7b0-89b0beb9a74e/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    screenshots: [jeuDePointScreen1, jeuDePointScreen2],
    tech: ['iOS', 'Swift', 'SwiftUI'],
    status: 'released',
    appStoreLink: 'https://apps.apple.com/fr/app/jeu-de-point/id6761615625',
  },
  {
    id: 'advance-wars',
    name: 'Pixel Tactics',
    subtitle: { fr: 'Tactical au tour par tour en pixel art', en: 'Turn-based pixel-art tactics' },
    description: {
      fr: "Un jeu de tactique au tour par tour inspiré d'Advance Wars, développé avec Godot 4. Factions, unités animées en pixel art, cartes personnalisées, mode classé en ligne et éditeur intégré.",
      en: "A turn-based tactics game inspired by Advance Wars, built with Godot 4. Factions, animated pixel-art units, custom maps, online ranked mode and a built-in editor.",
    },
    features: {
      fr: ['Combat tactique au tour par tour', 'Unités pixel art animées', 'Cartes personnalisées & éditeur', 'Mode classé en ligne (MMR/ELO)', 'Multijoueur Game Center', 'FR / EN'],
      en: ['Turn-based tactical combat', 'Animated pixel-art units', 'Custom maps & editor', 'Online ranked mode (MMR/ELO)', 'Game Center multiplayer', 'FR / EN'],
    },
    icon: '',
    screenshots: [],
    tech: ['Godot 4', 'GDScript', 'iOS'],
    status: 'in-progress',
  },
];

/* ─── UI strings ─────────────────────────────────────────────────── */
const UI = {
  fr: {
    eyebrow: 'Jeux créés',
    title: 'Jeux',
    subtitle: 'Jeux développés avec Swift, SwiftUI et Godot',
    released: 'Disponibles',
    inProgress: 'En développement',
    released_badge: 'Disponible',
    wip_badge: 'En cours',
    details: 'Voir les détails',
    features: 'Fonctionnalités',
    download: 'Télécharger',
    close: 'Fermer',
    preview: 'Aperçu',
  },
  en: {
    eyebrow: 'Games created',
    title: 'Games',
    subtitle: 'Games built with Swift, SwiftUI and Godot',
    released: 'Available',
    inProgress: 'In development',
    released_badge: 'Available',
    wip_badge: 'WIP',
    details: 'See details',
    features: 'Features',
    download: 'Download',
    close: 'Close',
    preview: 'Preview',
  },
};

/* ─── Fallback controller icon (for games without an icon asset) ──── */
const GamePad = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" />
    <line x1="15" y1="12" x2="15.01" y2="12" /><line x1="18" y1="10" x2="18.01" y2="10" />
    <rect x="2" y="6" width="20" height="12" rx="6" />
  </svg>
);

const GameIcon: React.FC<{ game: Game; className?: string; iconSize?: number }> = ({ game, className, iconSize = 28 }) => (
  game.icon
    ? <img src={game.icon} alt={game.name} className={`object-cover ${className}`} />
    : <div className={`flex items-center justify-center bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#86868B] ${className}`}><GamePad size={iconSize} /></div>
);

/* ─── Modal ──────────────────────────────────────────────────────── */
const GameModal: React.FC<{ game: Game; lang: 'fr' | 'en'; ui: typeof UI['fr']; onClose: () => void }> = ({ game, lang, ui, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-white dark:bg-[#1C1C1E] rounded-t-[2rem] md:rounded-[2rem] shadow-2xl scrollbar-hide"
    >
      <div className="flex justify-center pt-3 pb-0 md:hidden">
        <div className="w-10 h-1 rounded-full bg-[#C7C7CC] dark:bg-[#48484A]" />
      </div>
      <button onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C] flex items-center justify-center text-[#6E6E73] dark:text-[#98989D] hover:bg-[#D1D1D6] dark:hover:bg-[#48484A] transition-colors">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="px-5 pt-5 pb-8 md:px-7 md:pt-6">
        <div className="flex items-start gap-4 mb-5 pr-8">
          <GameIcon game={game} className="w-[88px] h-[88px] rounded-[20px] shadow-xl flex-shrink-0" iconSize={40} />
          <div className="flex-1 min-w-0">
            <h2 className="text-[22px] font-bold text-[#1D1D1F] dark:text-white tracking-tight leading-tight">{game.name}</h2>
            <p className="text-[14px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5 mb-3">{t(lang, game.subtitle.fr, game.subtitle.en)}</p>
            {game.appStoreLink && (
              <a href={game.appStoreLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#0071E3] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#0077ED] active:scale-95 transition-all">
                {ui.download}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-black/[0.08] dark:border-white/[0.08] mb-5" />

        {game.screenshots.length > 0 && (
          <>
            <h3 className="text-[20px] font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">{ui.preview}</h3>
            <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-3 scrollbar-hide">
              {game.screenshots.map((s, i) => (
                <img key={i} src={s} alt="" className="h-[260px] md:h-[300px] rounded-2xl object-cover flex-shrink-0 border border-black/[0.06] dark:border-white/[0.06]" />
              ))}
            </div>
            <div className="border-t border-black/[0.08] dark:border-white/[0.08] mt-5 mb-5" />
          </>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          {game.tech.map(tech => (
            <span key={tech} className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#0071E3]/[0.15] text-[#4DB3FF] border border-[#0071E3]/20">{tech}</span>
          ))}
        </div>

        <p className="text-[15px] text-[#3A3A3C] dark:text-[#E5E5EA] leading-[1.6] mb-5">{t(lang, game.description.fr, game.description.en)}</p>

        <div className="border-t border-black/[0.08] dark:border-white/[0.08] mb-5" />

        <h3 className="text-[20px] font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.features}</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t(lang, game.features.fr, game.features.en).map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#3A3A3C] dark:text-[#EBEBF5]/80 leading-snug">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────── */
const GamesPage: React.FC = () => {
  const { lang } = useLang();
  const ui = UI[lang];
  const [selected, setSelected] = useState<Game | null>(null);

  const released = GAMES.filter(g => g.status === 'released');
  const wip = GAMES.filter(g => g.status === 'in-progress');

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">{ui.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">{ui.title}</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">{ui.subtitle}</p>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-12">

        {/* Released */}
        <section>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.released}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {released.map(game => (
              <motion.div key={game.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(game)}
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <GameIcon game={game} className="w-14 h-14 rounded-2xl shadow-sm mb-3" />
                <div className="mb-1.5">
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#27AE60]">{ui.released_badge}</span>
                </div>
                <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{game.name}</h3>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 mb-2">{t(lang, game.subtitle.fr, game.subtitle.en)}</p>
                <div className="flex flex-wrap gap-1">
                  {game.tech.slice(0, 2).map(tech => (
                    <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0071E3]/[0.07] text-[#0071E3]">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* In progress */}
        {wip.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.inProgress}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wip.map(game => (
                <motion.div key={game.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(game)}
                  className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <GameIcon game={game} className="w-14 h-14 rounded-2xl shadow-sm mb-3" />
                  <div className="mb-1.5">
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3]">{ui.wip_badge}</span>
                  </div>
                  <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight">{game.name}</h3>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 mb-2">{t(lang, game.subtitle.fr, game.subtitle.en)}</p>
                  <div className="flex flex-wrap gap-1">
                    {game.tech.slice(0, 2).map(tech => (
                      <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0071E3]/[0.07] text-[#0071E3]">{tech}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <AnimatePresence>
        {selected && <GameModal game={selected} lang={lang} ui={ui} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default GamesPage;
