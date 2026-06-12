import React, { useState } from 'react';
import { useLang, t } from '../contexts/LangContext';

// ── Produits ────────────────────────────────────────────────────────────────
// Pour ajouter un produit : ajouter une entrée ici. `url` = lien d'achat
// (Gumroad, Lemon Squeezy, lien Notion…). Sans `url`, le produit s'affiche
// en « Bientôt disponible ».
interface Product {
  id: string;
  emoji: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  category: { fr: string; en: string };
  price: string;          // ex. '9 €' ou 'Gratuit'
  url?: string;
  badge?: { fr: string; en: string };
}

const PRODUCTS: Product[] = [
  {
    id: 'productivity-os',
    emoji: '🗂️',
    name: { fr: 'Productivity OS', en: 'Productivity OS' },
    description: {
      fr: 'Un espace Notion tout-en-un pour organiser tâches, projets, objectifs et notes au même endroit.',
      en: 'An all-in-one Notion workspace to organize tasks, projects, goals and notes in one place.',
    },
    category: { fr: 'Productivité', en: 'Productivity' },
    price: '—',
  },
  {
    id: 'finance-tracker',
    emoji: '💰',
    name: { fr: 'Finance Tracker', en: 'Finance Tracker' },
    description: {
      fr: 'Suivez vos dépenses, budgets et abonnements avec des tableaux de bord clairs dans Notion.',
      en: 'Track your spending, budgets and subscriptions with clean dashboards in Notion.',
    },
    category: { fr: 'Finances', en: 'Finance' },
    price: '—',
  },
  {
    id: 'job-hunt-kit',
    emoji: '🎯',
    name: { fr: 'Job Hunt Kit', en: 'Job Hunt Kit' },
    description: {
      fr: 'Pipeline de candidatures, suivi des entretiens et préparation — tout pour votre recherche d\'emploi.',
      en: 'Application pipeline, interview tracking and prep — everything for your job search.',
    },
    category: { fr: 'Carrière', en: 'Career' },
    price: '—',
  },
];

const StorePage: React.FC = () => {
  const { lang } = useLang();
  const [filter, setFilter] = useState<string | null>(null);

  const categories = [...new Set(PRODUCTS.map(p => p.category[lang]))];
  const visible = filter ? PRODUCTS.filter(p => p.category[lang] === filter) : PRODUCTS;

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">Store</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">
          {t(lang, 'Templates Notion', 'Notion Templates')}
        </h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">
          {t(lang,
            'Des templates pensés pour s\'organiser simplement et efficacement.',
            'Templates designed to get organized simply and efficiently.')}
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
              filter === null
                ? 'bg-[#0071E3] text-white'
                : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.10] dark:border-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            {t(lang, 'Tout', 'All')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(f => (f === cat ? null : cat))}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                filter === cat
                  ? 'bg-[#0071E3] text-white'
                  : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.10] dark:border-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(p => (
            <div
              key={p.id}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.10] dark:border-white/[0.06] shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[24px]">
                  {p.emoji}
                </div>
                {p.badge && (
                  <span className="text-[11px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-1 rounded-full">
                    {p.badge[lang]}
                  </span>
                )}
              </div>

              <p className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-1">
                {p.category[lang]}
              </p>
              <h3 className="font-semibold text-[#1D1D1F] dark:text-white text-[17px] mb-2">
                {p.name[lang]}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#6E6E73] dark:text-[#98989D] flex-1 mb-5">
                {p.description[lang]}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white">{p.price}</span>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0071E3] text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-[#0077ED] transition-colors"
                  >
                    {t(lang, 'Obtenir', 'Get it')}
                  </a>
                ) : (
                  <span className="text-[13px] font-medium text-[#86868B] bg-[#F5F5F7] dark:bg-[#2C2C2E] px-5 py-2 rounded-full cursor-default">
                    {t(lang, 'Bientôt disponible', 'Coming soon')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note de contact */}
        <p className="text-center text-[13px] text-[#86868B] mt-12">
          {t(lang, 'Une question ou une demande de template sur mesure ?', 'A question or a custom template request?')}{' '}
          <a href="mailto:sharikmohamed8@gmail.com" className="text-[#0071E3] hover:underline">
            sharikmohamed8@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default StorePage;
