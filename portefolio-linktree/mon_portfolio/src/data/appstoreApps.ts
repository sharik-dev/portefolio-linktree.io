/**
 * Apps App Store — source de vérité DYNAMIQUE.
 *
 * La liste n'est plus écrite en dur : elle vient du compte développeur Apple,
 * via l'API iTunes Lookup publique (aucune clé, aucune auth, CORS ouvert) :
 *
 *   https://itunes.apple.com/lookup?id=<ARTIST_ID>&entity=software&country=fr
 *
 * Publier une nouvelle app sur l'App Store la fait donc apparaître toute seule
 * sur le portfolio (nom, icône, description, captures, note, catégorie, prix),
 * et les métadonnées des apps existantes se mettent à jour à chaque refresh.
 *
 * Trois couches, de la moins à la plus prioritaire :
 *   1. `appstoreSnapshot.json` — snapshot embarqué au build (`npm run apps:sync`),
 *      affiché immédiatement et utilisé en fallback si Apple ne répond pas.
 *   2. Le fetch live (avec cache localStorage de 6 h) — la vraie donnée fraîche.
 *   3. `CURATION` — le contenu éditorial fait main (copie FR/EN, fonctionnalités,
 *      captures locales, landing page…) qui écrase Apple app par app.
 *
 * Une app absente de `CURATION` s'affiche quand même : tout est déduit d'Apple.
 * `MANUAL_APPS` sert aux projets qui ne sont pas sur ce compte (ex. Guidor,
 * publié par Skyconseil).
 */

import snapshot from './appstoreSnapshot.json';

import guidorLogo from '../assets/guidor/logo.png';
import guidorImg1 from '../assets/guidor/imageApp.png';
import guidorImg2 from '../assets/guidor/imageApp2.png';
import meowTubeHome from '../assets/meowTube/AppHomePage.png';
import meowTubeSecond from '../assets/meowTube/AppSecondPage.png';
import islamicScreen1 from '../assets/islamic daily quote/firstImage.png';
import islamicScreen2 from '../assets/islamic daily quote/second image.png';
import islamicScreen3 from '../assets/islamic daily quote/thirst image.png';
import jeuDePointScreen1 from '../assets/jeu de point/screenshoot/iPhone 17-01_Menu.png';
import jeuDePointScreen2 from '../assets/jeu de point/screenshoot/iPhone 17-02_Game.png';
import easyGymScreen1 from '../assets/easygym/screen1.png';
import easyGymScreen2 from '../assets/easygym/screen2.png';
import easyGymScreen3 from '../assets/easygym/screen3.png';

/* ─── Compte développeur ─────────────────────────────────────────── */
export const APPLE_ARTIST_ID = '1816768480';
const STOREFRONTS = ['fr', 'us'] as const;
const CACHE_KEY = 'appstore:apps:v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;   // 6 h
const NEW_FOR_DAYS = 120;

/* ─── Types ──────────────────────────────────────────────────────── */
export interface Bilingual<T = string> { fr: T; en: T }

export interface PortfolioApp {
  id: string;
  trackId?: number;
  name: Bilingual;
  subtitle: Bilingual;
  description: Bilingual;
  features: Bilingual<string[]>;
  price: Bilingual;
  category: Bilingual;
  icon: string;
  screenshots: string[];
  tech: string[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  ratingCount: number;
  landscape?: boolean;
  landingPage?: string;
  externalLink?: string;
  appStoreLink?: string;
  updatedAt?: string;
}

/** Ligne iTunes (sous-ensemble des champs conservés par le script de sync). */
interface ITunesApp {
  trackId: number;
  trackName?: string;
  description?: string;
  primaryGenreName?: string;
  price?: number;
  formattedPrice?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  artworkUrl512?: string;
  artworkUrl100?: string;
  screenshotUrls?: string[];
  ipadScreenshotUrls?: string[];
  releaseDate?: string;
  currentVersionReleaseDate?: string;
  trackViewUrl?: string;
}

type StorefrontData = Partial<Record<(typeof STOREFRONTS)[number], ITunesApp[]>>;

/** Ce qu'on peut forcer app par app, par-dessus les données Apple. */
interface Curation {
  id: string;
  order?: number;
  name?: Bilingual;
  subtitle?: Bilingual;
  description?: Bilingual;
  features?: Bilingual<string[]>;
  price?: Bilingual;
  category?: Bilingual;
  icon?: string;
  screenshots?: string[];
  tech?: string[];
  featured?: boolean;
  landscape?: boolean;
  landingPage?: string;
  externalLink?: string;
}

/* ─── Contenu éditorial (facultatif, par trackId App Store) ──────── */
export const CURATION: Record<number, Curation> = {
  6760180650: {
    id: 'meowtube',
    order: 1,
    name: { fr: 'Meow-Tube', en: 'Meow-Tube' },
    subtitle: { fr: 'Vidéo sans distraction, axé productivité', en: 'Distraction-free, productivity-first video' },
    description: {
      fr: "Application iOS de consultation de contenu multimédia type YouTube, sans Shorts, sans publicités et sans timer de temps passé. Conçue pour une consommation saine et productive de vidéos.",
      en: 'iOS app for browsing YouTube-style content — no Shorts, no ads, no screen-time tracking. Built for focused, healthy video consumption.',
    },
    features: {
      fr: ['Zéro publicité', 'Sans vidéos courtes', 'Aucun suivi du temps', 'Interface épurée', 'Axé productivité'],
      en: ['Zero ads', 'No short-form content', 'No time tracking', 'Clean interface', 'Productivity focused'],
    },
    price: { fr: 'Projet personnel', en: 'Personal project' },
    category: { fr: 'Productivité & Vidéo', en: 'Productivity & Video' },
    screenshots: [meowTubeHome, meowTubeSecond],
    tech: ['Swift', 'SwiftUI', 'AVFoundation', 'iOS'],
    landingPage: '/meowtube',
  },
  6760481474: {
    id: 'islamic-daily-quote',
    order: 2,
    name: { fr: 'Islamic Daily Quote', en: 'Islamic Daily Quote' },
    subtitle: { fr: 'Citation islamique quotidienne', en: 'Daily Islamic quote' },
    description: {
      fr: "Application iOS proposant chaque jour une citation islamique tirée du Coran ou des Hadiths, en plusieurs langues. Conçue pour le bien-être spirituel et la pratique quotidienne.",
      en: 'iOS app offering a new Islamic quote every day from the Quran or Hadiths, in multiple languages. Designed for spiritual wellness and daily practice.',
    },
    features: {
      fr: ['Citation quotidienne (Coran & Hadiths)', 'Traduction multilingue', 'Interface épurée & apaisante', 'Notifications journalières', 'Partage de citations', 'Mode sombre'],
      en: ['Daily quote (Quran & Hadiths)', 'Multilingual translation', 'Clean & calming interface', 'Daily notifications', 'Share quotes', 'Dark mode'],
    },
    price: { fr: 'Projet personnel', en: 'Personal project' },
    category: { fr: 'Spiritualité & Bien-être', en: 'Spirituality & Wellness' },
    screenshots: [islamicScreen1, islamicScreen2, islamicScreen3],
    tech: ['Swift', 'SwiftUI', 'iOS'],
    landingPage: '/islamic-daily-quote',
  },
  6761538853: {
    id: 'easy-gym',
    order: 3,
    subtitle: { fr: 'Sport à domicile pour tous niveaux', en: 'Home workout for all fitness levels' },
    features: {
      fr: ['Exercices pour tous les niveaux', 'Aucun équipement requis', 'Suivi des séries, reps & repos', 'Ciblage musculaire détaillé', 'Routines simples à suivre', 'Mode sombre'],
      en: ['Exercises for all levels', 'No equipment required', 'Sets, reps & rest tracking', 'Detailed muscle targeting', 'Easy-to-follow routines', 'Dark mode'],
    },
    category: { fr: 'Forme & Bien-être', en: 'Health & Fitness' },
    screenshots: [easyGymScreen1, easyGymScreen2, easyGymScreen3],
    tech: ['Swift', 'SwiftUI', 'iOS'],
  },
  6761615625: {
    id: 'jeu-de-point',
    order: 4,
    subtitle: { fr: 'Jeu de points traditionnel malgache', en: 'Traditional Malagasy strategy game' },
    features: {
      fr: ['Jeu de stratégie traditionnel', 'Contrôles intuitifs', 'Interface épurée', 'Parties rapides ou longues', 'Zéro donnée collectée'],
      en: ['Traditional strategy game', 'Intuitive controls', 'Clean interface', 'Quick or lengthy matches', 'Zero data collected'],
    },
    category: { fr: 'Jeux & Stratégie', en: 'Games & Strategy' },
    screenshots: [jeuDePointScreen1, jeuDePointScreen2],
    tech: ['Swift', 'SwiftUI', 'iOS'],
  },
};

/* ─── Apps hors compte perso (publiées par un autre éditeur) ─────── */
export const MANUAL_APPS: PortfolioApp[] = [
  {
    id: 'guidor',
    name: { fr: 'Guidor', en: 'Guidor' },
    subtitle: { fr: 'Application aviation professionnelle', en: 'Professional aviation app' },
    description: {
      fr: "Guidor est une application aviation professionnelle destinée aux pilotes de ligne et opérateurs de vol. Elle analyse la route et l'environnement en temps réel pour optimiser la planification et améliorer la sécurité à chaque phase du vol.",
      en: 'Guidor is a professional aviation app designed for airline pilots and flight operators. It analyzes the route and surrounding environment in real time to optimize flight planning and improve safety at every stage of the flight.',
    },
    features: {
      fr: ['Visualisation route & profil vertical', 'Météo aviation (METAR, TAF, turbulences)', 'Mises à jour en temps réel (Wi-Fi bord)', 'Optimisation de route & altitude', 'Alertes turbulences & météo dangereuse', 'Intégration standards ARINC & avionique'],
      en: ['Route & vertical profile visualization', 'Aviation weather (METAR, TAF, turbulence)', 'Real-time updates (onboard Wi-Fi)', 'Route & altitude optimization', 'Turbulence & dangerous weather alerts', 'ARINC avionics integration'],
    },
    price: { fr: 'Application professionnelle', en: 'Professional application' },
    category: { fr: 'Aviation & Navigation', en: 'Aviation & Navigation' },
    icon: guidorLogo,
    screenshots: [guidorImg1, guidorImg2],
    tech: ['iOS', 'Swift', 'Aviation APIs', 'ARINC'],
    featured: true,
    isNew: false,
    rating: 4.8,
    ratingCount: 0,
    landscape: true,
    externalLink: 'https://www.guidor.fr/',
    appStoreLink: 'https://apps.apple.com/fr/app/guidor/id1072066692',
  },
];

/* ─── Dérivation depuis les métadonnées Apple ────────────────────── */
const BULLET = /^\s*[-–—•*✓✅▪●]\s+/;

/** Découpe la description App Store en fonctionnalités courtes. */
function deriveFeatures(description?: string): string[] {
  if (!description) return [];
  const lines = description.split('\n').map(l => l.trim()).filter(Boolean);

  const bullets = lines
    .filter(l => BULLET.test(l))
    .map(l => l.replace(BULLET, '').trim())
    .filter(l => l.length > 2 && l.length <= 90);
  if (bullets.length) return bullets.slice(0, 6);

  // Pas de puces : on retombe sur les premières phrases courtes.
  return (description.match(/[^.!?\n]+[.!?]?/g) || [])
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length <= 90)
    .slice(0, 4);
}

/** Sous-titre : première phrase de la description, tronquée. */
function deriveSubtitle(description?: string, genre?: string): string {
  const first = (description || '').split('\n').map(s => s.trim()).find(Boolean);
  if (!first) return genre || 'iOS';
  const sentence = (first.match(/^[^.!?]+[.!?]?/) || [first])[0].trim();
  const clean = sentence.replace(/[.!?]$/, '');
  return clean.length > 92 ? `${clean.slice(0, 89).trimEnd()}…` : clean;
}

function isRecent(raw: ITunesApp): boolean {
  const date = raw.releaseDate || raw.currentVersionReleaseDate;
  if (!date) return false;
  const ms = Date.now() - new Date(date).getTime();
  return ms >= 0 && ms < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;
}

function priceLabel(raw?: ITunesApp, fallback = 'Gratuit'): string {
  if (!raw) return fallback;
  if (!raw.price) return fallback;
  return raw.formattedPrice || fallback;
}

/** Une ligne iTunes (fr + us) + sa curation éventuelle → carte du portfolio. */
function toPortfolioApp(fr: ITunesApp | undefined, us: ITunesApp | undefined): PortfolioApp | null {
  const base = fr || us;
  if (!base) return null;
  const en = us || fr!;
  const c = CURATION[base.trackId];

  const appleScreens = (base.screenshotUrls?.length ? base.screenshotUrls : base.ipadScreenshotUrls) || [];

  return {
    id: c?.id || `app-${base.trackId}`,
    trackId: base.trackId,
    name: c?.name || { fr: base.trackName || '', en: en.trackName || base.trackName || '' },
    subtitle: c?.subtitle || {
      fr: deriveSubtitle(base.description, base.primaryGenreName),
      en: deriveSubtitle(en.description, en.primaryGenreName),
    },
    description: c?.description || {
      fr: base.description || '',
      en: en.description || base.description || '',
    },
    features: c?.features || {
      fr: deriveFeatures(base.description),
      en: deriveFeatures(en.description),
    },
    price: c?.price || {
      fr: priceLabel(base, 'Gratuit'),
      en: priceLabel(en, 'Free'),
    },
    category: c?.category || {
      fr: base.primaryGenreName || 'iOS',
      en: en.primaryGenreName || base.primaryGenreName || 'iOS',
    },
    icon: c?.icon || base.artworkUrl512 || base.artworkUrl100 || '',
    screenshots: c?.screenshots?.length ? c.screenshots : appleScreens.slice(0, 5),
    tech: c?.tech || ['Swift', 'SwiftUI', 'iOS'],
    featured: c?.featured ?? true,
    isNew: isRecent(base),
    rating: base.averageUserRating || 0,
    ratingCount: base.userRatingCount || 0,
    landscape: c?.landscape,
    landingPage: c?.landingPage,
    externalLink: c?.externalLink,
    appStoreLink: base.trackViewUrl,
    updatedAt: base.currentVersionReleaseDate,
  };
}

function byId(list?: ITunesApp[]): Map<number, ITunesApp> {
  return new Map((list || []).map(a => [a.trackId, a]));
}

/** Assemble les storefronts bruts en cartes triées (curation d'abord, puis les plus récentes). */
export function buildApps(data: StorefrontData): PortfolioApp[] {
  const frById = byId(data.fr);
  const usById = byId(data.us);
  const ids = new Set<number>([...frById.keys(), ...usById.keys()]);

  const apps = [...ids]
    .map(id => toPortfolioApp(frById.get(id), usById.get(id)))
    .filter((a): a is PortfolioApp => a !== null);

  const rank = (a: PortfolioApp) => CURATION[a.trackId ?? -1]?.order ?? Number.MAX_SAFE_INTEGER;
  const released = (a: PortfolioApp) => new Date(a.updatedAt || 0).getTime();
  apps.sort((a, b) => rank(a) - rank(b) || released(b) - released(a));

  return [...apps, ...MANUAL_APPS];
}

/* ─── Récupération (live → cache → snapshot) ─────────────────────── */
const SNAPSHOT = snapshot as unknown as { generatedAt?: string; storefronts: StorefrontData };

/** Les apps du snapshot embarqué : disponibles immédiatement, sans réseau. */
export function snapshotApps(): PortfolioApp[] {
  return buildApps(SNAPSHOT.storefronts || {});
}

function readCache(): StorefrontData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; storefronts: StorefrontData };
    if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.storefronts;
  } catch {
    return null;
  }
}

function writeCache(storefronts: StorefrontData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), storefronts }));
  } catch { /* quota / mode privé : le cache est optionnel */ }
}

async function fetchStorefront(country: string): Promise<ITunesApp[]> {
  const url =
    `https://itunes.apple.com/lookup?id=${APPLE_ARTIST_ID}` +
    `&entity=software&country=${country}&limit=200`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iTunes ${country} → HTTP ${res.status}`);
  const body = await res.json();
  return (body.results || []).filter(
    (r: { wrapperType?: string; kind?: string }) => r.wrapperType === 'software' || r.kind === 'software',
  );
}

/**
 * Apps du compte développeur, fraîches.
 * Cache localStorage de 6 h → un refresh au plus toutes les 6 h par visiteur.
 * En cas d'échec réseau, retombe silencieusement sur le snapshot du build.
 */
export async function fetchAppStoreApps(force = false): Promise<PortfolioApp[]> {
  if (!force) {
    const cached = readCache();
    if (cached) return buildApps(cached);
  }

  try {
    const [fr, us] = await Promise.all(STOREFRONTS.map(c => fetchStorefront(c)));
    const storefronts: StorefrontData = { fr, us };
    if (!fr.length && !us.length) return snapshotApps();
    writeCache(storefronts);
    return buildApps(storefronts);
  } catch {
    return snapshotApps();
  }
}
