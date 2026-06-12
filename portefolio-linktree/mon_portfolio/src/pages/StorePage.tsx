import React, { useState } from 'react';
import { useLang, t } from '../contexts/LangContext';

// ── Produits ────────────────────────────────────────────────────────────────
// Pour ajouter un produit : ajouter une entrée ici. `url` = lien d'achat
// (Gumroad, Lemon Squeezy, lien Notion…). Sans `url`, le produit s'affiche
// en « Bientôt disponible ».
type CategoryKey = 'canva' | 'notion' | 'course' | 'ebook' | 'saas';

const CATEGORIES: Record<CategoryKey, { fr: string; en: string }> = {
  canva:  { fr: 'Templates Canva',  en: 'Canva Templates' },
  notion: { fr: 'Templates Notion', en: 'Notion Templates' },
  course: { fr: 'Mini-cours vidéo', en: 'Video Mini-courses' },
  ebook:  { fr: 'Ebooks',           en: 'Ebooks' },
  saas:   { fr: 'SaaS',             en: 'SaaS' },
};

interface Product {
  id: string;
  emoji: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  category: CategoryKey;
  price: string;          // ex. '9 €' ou 'Gratuit'
  url?: string;
  badge?: { fr: string; en: string };
}

const PRODUCTS: Product[] = [
  {
    id: 'canva-social-pack',
    emoji: '🎨',
    name: { fr: 'Pack Réseaux Sociaux', en: 'Social Media Pack' },
    description: {
      fr: 'Templates Canva prêts à l\'emploi pour vos posts, stories et carrousels.',
      en: 'Ready-to-use Canva templates for your posts, stories and carousels.',
    },
    category: 'canva',
    price: '—',
  },
  {
    id: 'notion-productivity-os',
    emoji: '🗂️',
    name: { fr: 'Productivity OS', en: 'Productivity OS' },
    description: {
      fr: 'Un espace Notion tout-en-un pour organiser tâches, projets, objectifs et notes au même endroit.',
      en: 'An all-in-one Notion workspace to organize tasks, projects, goals and notes in one place.',
    },
    category: 'notion',
    price: '—',
  },
  {
    id: 'course-ios-basics',
    emoji: '🎬',
    name: { fr: 'Mini-cours : créer son app iOS', en: 'Mini-course: build your iOS app' },
    description: {
      fr: 'Un mini-cours vidéo pas à pas pour créer et publier votre première app sur l\'App Store.',
      en: 'A step-by-step video mini-course to build and ship your first app to the App Store.',
    },
    category: 'course',
    price: '—',
  },
  {
    id: 'ebook-app-store-launch',
    emoji: '📕',
    name: { fr: 'Ebook : réussir son lancement App Store', en: 'Ebook: nail your App Store launch' },
    description: {
      fr: 'Un guide ultra spécialisé : ASO, screenshots, pricing et stratégie de lancement.',
      en: 'An ultra-specialized guide: ASO, screenshots, pricing and launch strategy.',
    },
    category: 'ebook',
    price: '—',
  },
  {
    id: 'saas-coming-soon',
    emoji: '🚀',
    name: { fr: 'SaaS — en préparation', en: 'SaaS — in the works' },
    description: {
      fr: 'Des outils en ligne par abonnement, conçus pour des besoins précis. Premier lancement à venir.',
      en: 'Subscription web tools built for specific needs. First launch coming soon.',
    },
    category: 'saas',
    price: '—',
  },
];

// ── Prestations freelance ───────────────────────────────────────────────────
interface Service {
  id: string;
  emoji: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
}

const SERVICES: Service[] = [
  {
    id: 'ios-dev',
    emoji: '📱',
    name: { fr: 'Développement iOS', en: 'iOS Development' },
    description: {
      fr: 'Conception et développement d\'apps natives en Swift / SwiftUI, de l\'idée jusqu\'à la publication sur l\'App Store.',
      en: 'Design and development of native Swift / SwiftUI apps, from idea to App Store release.',
    },
  },
  {
    id: 'web-tools',
    emoji: '🛠️',
    name: { fr: 'Sites & outils pour commerces et entreprises', en: 'Websites & tools for businesses' },
    description: {
      fr: 'Sites vitrines, outils métier et applications web sur mesure, adaptés à votre activité.',
      en: 'Showcase websites, business tools and custom web applications tailored to your activity.',
    },
  },
  {
    id: 'ai-management',
    emoji: '🤖',
    name: { fr: 'IA pour la gestion', en: 'AI for management' },
    description: {
      fr: 'Intégration de l\'IA dans vos processus de gestion : automatisation des tâches répétitives, tri et synthèse de documents, aide à la décision.',
      en: 'AI integration into your management workflows: automating repetitive tasks, document triage and summaries, decision support.',
    },
  },
  {
    id: 'ai-support',
    emoji: '💬',
    name: { fr: 'SAV assisté par IA', en: 'AI-powered customer support' },
    description: {
      fr: 'Mise en place d\'assistants IA pour votre support client : réponses automatiques pertinentes, escalade vers un humain quand il le faut.',
      en: 'AI assistants for your customer support: relevant automated answers, with human escalation when needed.',
    },
  },
  {
    id: 'internal-tools',
    emoji: '📊',
    name: { fr: 'Outils internes', en: 'Internal tools' },
    description: {
      fr: 'Dashboards, automatisations et petits outils internes pour faire gagner du temps à vos équipes.',
      en: 'Dashboards, automations and small internal tools that save your teams time.',
    },
  },
  {
    id: 'claude-setup',
    emoji: '⚙️',
    name: { fr: 'Setup Claude & architecture serveur', en: 'Claude setup & server architecture' },
    description: {
      fr: 'Déploiement de Claude dans votre entreprise (API, Claude Code, agents) avec l\'architecture serveur qui va avec : hébergement, sécurité, accès.',
      en: 'Deploying Claude in your company (API, Claude Code, agents) with the right server architecture: hosting, security, access.',
    },
  },
];

const StorePage: React.FC = () => {
  const { lang } = useLang();
  const [filter, setFilter] = useState<CategoryKey | null>(null);

  const visible = filter ? PRODUCTS.filter(p => p.category === filter) : PRODUCTS;

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 text-center">
        <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">Store</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-3">
          {t(lang, 'Produits digitaux', 'Digital Goods')}
        </h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">
          {t(lang,
            'Templates Canva & Notion, mini-cours vidéo, ebooks ultra spécialisés et SaaS.',
            'Canva & Notion templates, video mini-courses, ultra-specialized ebooks and SaaS.')}
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
          {(Object.keys(CATEGORIES) as CategoryKey[]).map(key => (
            <button
              key={key}
              onClick={() => setFilter(f => (f === key ? null : key))}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                filter === key
                  ? 'bg-[#0071E3] text-white'
                  : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.10] dark:border-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              {CATEGORIES[key][lang]}
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
                {CATEGORIES[p.category][lang]}
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

        {/* Freelance */}
        <section className="mt-16">
          <p className="text-[12px] font-semibold text-[#0071E3] uppercase tracking-[0.12em] mb-2">Freelance</p>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-2">
            {t(lang, 'Mes prestations', 'My services')}
          </h2>
          <p className="text-[14px] text-[#6E6E73] dark:text-[#98989D] mb-8 max-w-xl">
            {t(lang,
              'J\'accompagne commerces et entreprises sur le développement et l\'intégration de l\'IA, de A à Z.',
              'I help businesses with development and AI integration, end to end.')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(s => (
              <div
                key={s.id}
                className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.10] dark:border-white/[0.06] shadow-sm p-6 flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[24px] mb-4">
                  {s.emoji}
                </div>
                <h3 className="font-semibold text-[#1D1D1F] dark:text-white text-[17px] mb-2">
                  {s.name[lang]}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#6E6E73] dark:text-[#98989D] flex-1 mb-5">
                  {s.description[lang]}
                </p>
                <a
                  href={`mailto:sharikmohamed8@gmail.com?subject=${encodeURIComponent(t(lang, 'Demande freelance — ', 'Freelance request — ') + s.name[lang])}`}
                  className="self-start bg-[#0071E3] text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-[#0077ED] transition-colors"
                >
                  {t(lang, 'Me contacter', 'Contact me')}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Note de contact */}
        <p className="text-center text-[13px] text-[#86868B] mt-12">
          {t(lang, 'Une question ou une demande sur mesure ?', 'A question or a custom request?')}{' '}
          <a href="mailto:sharikmohamed8@gmail.com" className="text-[#0071E3] hover:underline">
            sharikmohamed8@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default StorePage;
