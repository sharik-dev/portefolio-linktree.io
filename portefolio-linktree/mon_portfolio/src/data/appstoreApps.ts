/**
 * Apps du portfolio — source de vérité DYNAMIQUE.
 *
 * Trois origines, fusionnées dans `buildApps()` :
 *
 *   1. EN LIGNE — le compte développeur Apple, via l'API iTunes Lookup publique
 *      (aucune clé, CORS ouvert). Publier une app la fait apparaître toute seule.
 *        https://itunes.apple.com/lookup?id=<ARTIST_ID>&entity=software&country=fr
 *      Snapshot embarqué (`appstoreSnapshot.json`) → fetch live (cache 6 h).
 *
 *   2. EN ATTENTE — `ascPending.json`, généré par `npm run apps:pending` depuis
 *      App Store Connect : les apps en revue chez Apple et les fiches prêtes
 *      mais pas encore soumises. Une entrée disparaît d'elle-même dès que son
 *      trackId arrive dans la réponse iTunes.
 *
 *   3. EN DÉVELOPPEMENT — `DEV_APPS`, écrit à la main : les projets qui n'ont
 *      pas encore de fiche App Store.
 *
 * Par-dessus, deux couches éditoriales :
 *   - `CURATION` (clé = trackId) : identifiant stable, stack, copie soignée.
 *     Facultatif : une app absente s'affiche quand même, tout est déduit d'Apple.
 *   - `deviceShots.json` (`npm run shots:sync`) : les captures BRUTES montrées
 *     dans l'iPhone / l'iPad 3D. Sans entrée, le site prend les captures de la
 *     fiche App Store, en haute résolution.
 *
 * `MANUAL_APPS` sert aux apps publiées par un autre éditeur (Guidor, Skyconseil).
 */

import snapshot from './appstoreSnapshot.json';
import pendingData from './ascPending.json';
import shotsData from './deviceShots.json';

import guidorLogo from '../assets/guidor/logo.png';
import guidorImg1 from '../assets/guidor/imageApp.png';
import guidorImg2 from '../assets/guidor/imageApp2.png';
import localShortLogo from '../assets/localShort/logo.png';

/* ─── Compte développeur ─────────────────────────────────────────── */
export const APPLE_ARTIST_ID = '1816768480';
const STOREFRONTS = ['fr', 'us'] as const;
const CACHE_KEY = 'appstore:apps:v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;   // 6 h
const NEW_FOR_DAYS = 120;

/* ─── Types ──────────────────────────────────────────────────────── */
export interface Bilingual<T = string> { fr: T; en: T }

export type AppStatus = 'live' | 'review' | 'dev';
export type DeviceKind = 'iphone' | 'ipad';

/** Une capture posée sur l'écran de l'appareil 3D. `w`/`h` inconnus pour une URL Apple. */
export interface Shot { src: string; w?: number; h?: number }
export type DeviceShots = Partial<Record<DeviceKind, Bilingual<Shot[]>>>;

export interface PortfolioApp {
  id: string;
  trackId?: number;
  /** live = sur l'App Store · review = en attente de revue Apple · dev = pas encore soumis. */
  status: AppStatus;
  name: Bilingual;
  subtitle: Bilingual;
  description: Bilingual;
  features: Bilingual<string[]>;
  price: Bilingual;
  category: Bilingual;
  icon: string;
  /** Galerie de la fiche détaillée (visuels marketing de l'App Store quand ils existent). */
  screenshots: Bilingual<string[]>;
  /** Captures brutes pour l'appareil 3D, par appareil puis par langue. */
  device: DeviceShots;
  tech: string[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  ratingCount: number;
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
  tech?: string[];
  featured?: boolean;
  landingPage?: string;
  externalLink?: string;
  /** Les captures de la fiche App Store sont brutes (pas de texte ni de cadre) : utilisables dans l'appareil 3D. */
  rawStoreShots?: boolean;
}


const SWIFT = ['Swift', 'SwiftUI', 'iOS'];
const GODOT = ['Godot', 'GDScript', 'iOS'];

/* ─── Contenu éditorial (facultatif, par trackId App Store) ────────
 * `id` sert de clé vers deviceShots.json : le garder stable. */
export const CURATION: Record<number, Curation> = {
  6760180650: {
    id: 'meowtube',
    order: 1,
    subtitle: { fr: 'Vidéo et musique, sans les Shorts', en: 'Video and music, minus the Shorts' },
    description: {
      fr: "Navigateur iOS pour les sites de vidéo, de musique et les réseaux sociaux, qui retire les flux infinis : les vidéos courtes sont bloquées avant de s'afficher. On regarde, on écoute, on garde le contact, sans défilement sans fin.",
      en: 'iOS browser for video, music and social sites that removes the endless feeds: short videos are blocked before they show up. You still watch, listen and keep in touch, without the doomscrolling.',
    },
    features: {
      fr: ['Vidéos courtes bloquées', 'Lecture en arrière-plan', 'Lecteur de musique', 'Bibliothèque et favoris', 'Image dans l’image'],
      en: ['Short videos blocked', 'Background playback', 'Music player', 'Library and favourites', 'Picture in picture'],
    },
    category: { fr: 'Divertissement & Productivité', en: 'Entertainment & Productivity' },
    tech: ['Swift', 'SwiftUI', 'WebKit', 'AVFoundation'],
    landingPage: '/meowtube',
  },
  6760481474: {
    id: 'islamic-daily-quote',
    order: 2,
    subtitle: { fr: 'Citation islamique quotidienne', en: 'Daily Islamic quote' },
    description: {
      fr: "Application iOS proposant chaque jour une citation islamique tirée du Coran ou des Hadiths, en plusieurs langues. Conçue pour le bien-être spirituel et la pratique quotidienne.",
      en: 'iOS app offering a new Islamic quote every day from the Quran or Hadiths, in multiple languages. Designed for spiritual wellness and daily practice.',
    },
    features: {
      fr: ['Citation quotidienne (Coran & Hadiths)', 'Traduction multilingue', 'Interface épurée & apaisante', 'Notifications journalières', 'Partage de citations', 'Mode sombre'],
      en: ['Daily quote (Quran & Hadiths)', 'Multilingual translation', 'Clean & calming interface', 'Daily notifications', 'Share quotes', 'Dark mode'],
    },
    category: { fr: 'Spiritualité & Bien-être', en: 'Spirituality & Wellness' },
    tech: ['Swift', 'SwiftUI', 'WidgetKit'],
    landingPage: '/islamic-daily-quote',
  },
  6761538853: {
    id: 'easy-gym',
    order: 3,
    subtitle: { fr: 'Le sport à domicile, en quêtes', en: 'Home workouts, turned into quests' },
    features: {
      fr: ['Exercices pour tous les niveaux', 'Aucun équipement requis', 'Suivi des séries, reps & repos', 'Ciblage musculaire détaillé', 'Quêtes et progression par niveaux'],
      en: ['Exercises for all levels', 'No equipment required', 'Sets, reps & rest tracking', 'Detailed muscle targeting', 'Quests and level progression'],
    },
    category: { fr: 'Forme & Bien-être', en: 'Health & Fitness' },
    tech: SWIFT,
  },
  6761615625: {
    id: 'jeu-de-point',
    order: 4,
    subtitle: { fr: 'Jeu de points traditionnel malgache', en: 'Traditional Malagasy strategy game' },
    features: {
      fr: ['Jeu de stratégie traditionnel', 'Contre l’IA, à deux ou en ligne', 'Contrôles intuitifs', 'Parties rapides ou longues', 'Zéro donnée collectée'],
      en: ['Traditional strategy game', 'Versus AI, local or online', 'Intuitive controls', 'Quick or lengthy matches', 'Zero data collected'],
    },
    category: { fr: 'Jeux & Stratégie', en: 'Games & Strategy' },
    tech: SWIFT,
  },
  6781363751: {
    id: 'vocabulary',
    subtitle: { fr: 'Un mot d\u2019anglais par heure, en widget', en: 'One English word an hour, as a widget' },
    tech: ['Swift', 'SwiftUI', 'WidgetKit'],
  },
  6791636773: {
    id: 'duobook',
    subtitle: { fr: 'Lire ses PDF chaque jour, en série', en: 'Read your PDFs every day, on a streak' },
    tech: SWIFT,
  },
  6798837070: {
    id: 'salat',
    subtitle: { fr: 'Apprendre la prière, étape par étape', en: 'Learn the prayer, step by step' },
    tech: ['Swift', 'SwiftUI', 'AVFoundation'],
  },
  6819831893: { id: 'salsa', tech: ['Swift', 'SwiftUI', 'AVFoundation'] },
  6824072258: { id: 'wordiko', tech: SWIFT },
  6786755599: {
    id: 'strategic-wars',
    subtitle: { fr: 'Tactique au tour par tour, en 3D', en: 'Turn-based tactics, in 3D' },
    tech: GODOT,
  },
  6801350476: {
    id: 'last-soldier',
    subtitle: { fr: 'Runner de foule : une armée au pouce', en: 'Crowd runner: an army under your thumb' },
    tech: GODOT,
    rawStoreShots: true,
  },
  6796000489: {
    id: 'magic-tower',
    subtitle: { fr: 'Dessine tes sorts, vise, tire', en: 'Draw your spells, aim, release' },
    tech: GODOT,
    rawStoreShots: true,
  },
  6798384489: {
    id: 'clutch-lab',
    subtitle: { fr: 'Entraîneur de jeux compétitifs', en: 'Competitive game trainer' },
    tech: GODOT,
    rawStoreShots: true,
  },
  6794597550: {
    id: 'terrafocus',
    subtitle: { fr: 'Minuteur de concentration qui fait revivre une île', en: 'A focus timer that brings an island back to life' },
    tech: GODOT,
  },

  /* Apps en attente (ascPending.json) : même table, elles gardent leur id une fois en ligne. */
  6834720283: { id: 'flight-advisor', tech: ['Swift', 'SwiftUI', 'ActivityKit', 'CoreLocation'] },
  6822303078: { id: 'lenas-phone', tech: ['Swift', 'SwiftUI', 'AVFoundation'] },
  6834633674: { id: 'draw-your-family', tech: ['Swift', 'SwiftUI', 'WidgetKit', 'CloudKit'] },
  6834604507: { id: 'block-gallery', tech: ['Swift', 'SwiftUI', 'StoreKit'] },
  6832665507: { id: 'rabbit-party', tech: GODOT },
  6831931944: { id: 'tornado-worlds', tech: GODOT },
  6797798139: { id: 'empire', tech: GODOT },
};

/* ─── Captures locales (deviceShots.json) ────────────────────────── */
type LocalShots = { icon?: string } & Partial<Record<DeviceKind, Partial<Bilingual<Shot[]>>>>;
const LOCAL_SHOTS = (shotsData as unknown as { apps: Record<string, LocalShots> }).apps || {};

/** Chemin de `public/` → URL servie (le site peut vivre sous un sous-dossier). */
const asset = (rel: string) => `${import.meta.env.BASE_URL}${rel}`;

/** Une langue manquante retombe sur l'autre. */
function bothLangs<T>(v?: Partial<Bilingual<T[]>>): Bilingual<T[]> | undefined {
  const fr = v?.fr?.length ? v.fr : v?.en;
  const en = v?.en?.length ? v.en : v?.fr;
  return fr?.length && en?.length ? { fr, en } : undefined;
}

function localDevice(id: string): DeviceShots {
  const entry = LOCAL_SHOTS[id];
  const out: DeviceShots = {};
  for (const kind of ['iphone', 'ipad'] as const) {
    const shots = bothLangs(entry?.[kind]);
    if (shots) {
      out[kind] = {
        fr: shots.fr.map(s => ({ ...s, src: asset(s.src) })),
        en: shots.en.map(s => ({ ...s, src: asset(s.src) })),
      };
    }
  }
  return out;
}

/**
 * Captures brutes d'une app pour l'appareil 3D, dans la langue demandée —
 * pour les pages d'atterrissage, qui n'ont pas besoin de toute la liste.
 */
export function deviceShotsFor(id: string, lang: 'fr' | 'en', kind: DeviceKind = 'iphone'): Shot[] {
  return localDevice(id)[kind]?.[lang] || [];
}

const localIcon = (id: string) => (LOCAL_SHOTS[id]?.icon ? asset(LOCAL_SHOTS[id].icon!) : undefined);

/**
 * Ce que montre l'appareil 3D. Les captures locales (brutes) passent d'abord.
 * Celles de la fiche App Store sont le plus souvent des visuels marketing — un
 * téléphone dessiné dans le téléphone 3D : on ne les mélange aux captures
 * locales que si la curation les déclare brutes (`rawStoreShots`). Une app sans
 * aucune capture locale montre quand même sa fiche, sur un seul appareil.
 */
function mergeDevice(id: string, store: DeviceShots, rawStore = false): DeviceShots {
  const local = localDevice(id);
  if (rawStore) return { ...store, ...local };
  if (local.iphone || local.ipad) return local;
  if (store.iphone) return { iphone: store.iphone };
  return store.ipad ? { ipad: store.ipad } : {};
}

/**
 * Le CDN d'Apple sert n'importe quelle taille : la réponse iTunes pointe sur une
 * vignette (320×480, floue en plein écran), on redemande la même image bornée à
 * `box` pixels, en WebP.
 */
export function appleImage(url: string | undefined, box: number): string {
  if (!url) return '';
  return url.replace(/\/\d+x\d+[a-z]*(-\d+)?\.(jpg|jpeg|png|webp)$/i, `/${box}x${box}bb.webp`);
}

const toShots = (urls: string[] | undefined, box: number): Shot[] =>
  (urls || []).slice(0, 5).map(u => ({ src: appleImage(u, box) }));

/* ─── Apps hors compte perso (publiées par un autre éditeur) ─────── */
export const MANUAL_APPS: PortfolioApp[] = [
  {
    id: 'guidor',
    status: 'live',
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
    screenshots: { fr: [guidorImg1, guidorImg2], en: [guidorImg1, guidorImg2] },
    device: {
      ipad: {
        fr: [{ src: guidorImg1, w: 1581, h: 1100 }, { src: guidorImg2, w: 1581, h: 1100 }],
        en: [{ src: guidorImg1, w: 1581, h: 1100 }, { src: guidorImg2, w: 1581, h: 1100 }],
      },
    },
    tech: ['iOS', 'Swift', 'Aviation APIs', 'ARINC'],
    featured: true,
    isNew: false,
    rating: 4.8,
    ratingCount: 0,
    externalLink: 'https://www.guidor.fr/',
    appStoreLink: 'https://apps.apple.com/fr/app/guidor/id1072066692',
  },
];

/* ─── Projets sans fiche App Store (écrits à la main) ──────────────
 * `id` = dossier de deviceShots.json (icône + captures). Un projet sans
 * capture reste listé, mais n'entre pas dans l'aperçu 3D. */
interface DevApp {
  id: string;
  name: string;
  subtitle: Bilingual;
  description: Bilingual;
  features: Bilingual<string[]>;
  category: Bilingual;
  tech: string[];
  icon?: string;
  landingPage?: string;
}

const GAMES_ACTION: Bilingual = { fr: 'Jeux & Action', en: 'Games & Action' };
const GAMES_STRATEGY: Bilingual = { fr: 'Jeux & Stratégie', en: 'Games & Strategy' };

export const DEV_APPS: DevApp[] = [
  {
    id: 'archer-io',
    name: 'Archer.io',
    subtitle: { fr: 'Roguelite d’arène à tir automatique', en: 'Auto-shooting arena roguelite' },
    description: {
      fr: "Roguelite d'action en portrait, jouable au pouce : on glisse pour se déplacer, le héros tire tout seul sur l'ennemi le plus proche. Plusieurs joueurs partagent la même arène et farment les mêmes monstres ; chaque niveau offre une amélioration au choix parmi trois.",
      en: 'Portrait action roguelite played with one thumb: slide to move, the hero fires on its own at the nearest enemy. Several players share the same arena and farm the same monsters; every level offers one upgrade out of three.',
    },
    features: {
      fr: ['Déplacement au pouce, tir automatique', 'Une amélioration parmi trois à chaque niveau', 'Arène partagée entre joueurs', '3D stylisée'],
      en: ['One-thumb movement, auto-fire', 'Pick one of three upgrades per level', 'Arena shared between players', 'Stylised 3D'],
    },
    category: GAMES_ACTION,
    tech: GODOT,
  },
  {
    id: 'castle-siege',
    name: 'Castle Siege',
    subtitle: { fr: 'Tower defense autour d’une maison qui vole', en: 'Tower defense around a flying house' },
    description: {
      fr: "Une maison sur pattes à défendre au centre d'une île : des squelettes sortent de quatre portails par vagues sans fin. Le mage lance ses sorts à la première personne, puis bascule en vue de haut pour poser murs, arbalètes, mortiers et teslas — et peut faire décoller la maison pour la repositionner.",
      en: 'A walking house to defend at the heart of an island: skeletons pour out of four portals in endless waves. The mage casts spells in first person, then switches to a top-down view to place walls, crossbows, mortars and teslas — and can lift the house off the ground to reposition it.',
    },
    features: {
      fr: ['Sorts à la première personne', 'Construction en vue de haut', 'Vagues sans fin, quatre portails', 'La maison se déplace en vol'],
      en: ['First-person spellcasting', 'Top-down building', 'Endless waves, four portals', 'The house relocates by flying'],
    },
    category: GAMES_STRATEGY,
    tech: GODOT,
  },
  {
    id: 'bastion',
    name: 'Bastion',
    subtitle: { fr: 'Tower defense coopératif à deux rôles', en: 'Two-role co-op tower defense' },
    description: {
      fr: "Un seul monde, vu de deux façons. L'un joue la Lame : au sol, épée, roulade et endurance. L'autre joue l'Architecte : caméra libre au-dessus du champ, il bâtit murs, arbalètes, mortiers et teslas et lâche des troupes. Douze vagues de squelettes convergent vers le Bastion.",
      en: 'One world, seen two ways. One player is the Blade: on the ground, sword, dodge roll and stamina. The other is the Architect: a free camera above the field, building walls, crossbows, mortars and teslas and dropping troops. Twelve waves of skeletons converge on the Bastion.',
    },
    features: {
      fr: ['Deux rôles asymétriques en coop', 'Combat à l’épée, roulade et endurance', 'Construction de défenses en direct', 'Hôte autoritatif, réplication à 15 Hz'],
      en: ['Two asymmetric co-op roles', 'Sword combat with dodge roll and stamina', 'Live defence building', 'Authoritative host, 15 Hz replication'],
    },
    category: GAMES_STRATEGY,
    tech: [...GODOT, 'ENet'],
  },
  {
    id: 'hook-wars',
    name: 'Hook Wars',
    subtitle: { fr: 'Arène 5 contre 5 au grappin', en: '5v5 chain-hook arena' },
    description: {
      fr: "Deux blocs de terrain séparés par un vide, cinq joueurs de chaque côté. On lance une chaîne à travers l'abîme : elle accroche le premier corps touché et le traîne au-dessus du vide. Un hook, une élimination. La manche atteinte est le score.",
      en: 'Two slabs of ground split by a void, five players on each side. Throw a chain across the gap: it hooks the first body it touches and drags it over the abyss. One hook, one elimination. The round you reach is your score.',
    },
    features: {
      fr: ['Pouce gauche pour bouger, droit pour viser', 'Un hook = une élimination', 'Manches de plus en plus dures', 'Caméra de MOBA en paysage'],
      en: ['Left thumb moves, right thumb aims', 'One hook = one elimination', 'Rounds keep getting harder', 'Landscape MOBA camera'],
    },
    category: GAMES_ACTION,
    tech: GODOT,
  },
  {
    id: 'terra-beasts',
    name: 'Terra Beasts',
    subtitle: { fr: 'RPG de capture avec de vrais animaux', en: 'Creature-collecting RPG with real animals' },
    description: {
      fr: "Douze bêtes bien réelles — vache, cheval, renard, loup, alpaga… — cinq éléments en anneau, et un globe terrestre pour les capturer. Monde 3D vu de haut au joystick, combats au tour par tour, et une rareté par bête qui lui donne un pelage et des gènes uniques.",
      en: 'Twelve very real beasts — cow, horse, fox, wolf, alpaca… — five elements in a ring, and a globe to capture them. A top-down 3D world on a joystick, turn-based battles, and a rarity per beast that gives it a unique coat and genes.',
    },
    features: {
      fr: ['Douze animaux riggés et animés', 'Combat au tour par tour', 'Raretés, pelages et gènes', 'Rendu cel-shadé à gros contour'],
      en: ['Twelve rigged, animated animals', 'Turn-based battles', 'Rarities, coats and genes', 'Cel-shaded look with bold outlines'],
    },
    category: { fr: 'Jeux & RPG', en: 'Games & RPG' },
    tech: GODOT,
  },
  {
    id: 'void-eater',
    name: 'Void Eater',
    subtitle: { fr: 'Un trou noir qui avale la ville', en: 'A black hole that swallows the city' },
    description: {
      fr: "On pilote un trou noir posé sur la chaussée d'une ville générée en code. Tout ce qui est plus petit que lui est happé et tombe dedans : la masse avalée est à la fois le score, le rayon et la catégorie d'objets avalables. Quatre trous adverses jouent en même temps ; deux minutes, la plus grosse masse gagne.",
      en: 'You steer a black hole sitting on the streets of a code-generated city. Anything smaller gets pulled in and falls: swallowed mass is at once the score, the radius and the class of objects you can eat. Four rival holes play at the same time; two minutes, biggest mass wins.',
    },
    features: {
      fr: ['Ville entièrement procédurale', 'Quatre adversaires qui chassent et fuient', 'Un trou peut avaler un trou', 'Parties de deux minutes'],
      en: ['Fully procedural city', 'Four rivals that hunt and flee', 'A hole can swallow a hole', 'Two-minute matches'],
    },
    category: GAMES_ACTION,
    tech: GODOT,
  },
  {
    id: 'recall',
    name: 'Recall',
    subtitle: { fr: 'Cartes mémoire à répétition espacée', en: 'Spaced-repetition memory cards' },
    description: {
      fr: "Application de mémorisation par répétition espacée, dans une interface pixel : des cartes à revoir chaque jour, un objectif quotidien, une bibliothèque par catégories et des statistiques de rétention.",
      en: 'Spaced-repetition memorisation app with a pixel interface: cards to review every day, a daily goal, a library sorted by category and retention statistics.',
    },
    features: {
      fr: ['Révisions planifiées automatiquement', 'Objectif quotidien et série', 'Bibliothèque par catégories', 'Statistiques de rétention'],
      en: ['Automatically scheduled reviews', 'Daily goal and streak', 'Library by category', 'Retention statistics'],
    },
    category: { fr: 'Éducation & Productivité', en: 'Education & Productivity' },
    tech: ['Swift', 'SwiftUI', 'SwiftData', 'WidgetKit'],
  },
  {
    id: 'localshort',
    name: 'LocalShort',
    subtitle: { fr: 'Lecteur de vidéos courtes en local', en: 'Offline short-form video player' },
    description: {
      fr: 'Lecteur de vidéos courtes pour ses propres fichiers : la bibliothèque reste sur l’appareil, sans compte ni flux en ligne.',
      en: 'Short-form video player for your own files: the library stays on the device, with no account and no online feed.',
    },
    features: {
      fr: ['Bibliothèque 100 % locale', 'Lecture verticale plein écran', 'Aucun compte'],
      en: ['Fully local library', 'Full-screen vertical playback', 'No account'],
    },
    category: { fr: 'Vidéo', en: 'Video' },
    tech: SWIFT,
    icon: localShortLogo,
  },
  {
    id: 'meowtoon',
    name: 'meow-Toon',
    subtitle: { fr: 'Navigateur avec bloqueur de pubs et traduction', en: 'Browser with ad blocker and translation' },
    description: {
      fr: 'Navigateur iOS pensé pour la vidéo : bloqueur de publicités, favoris sur l\u2019écran d\u2019accueil, boutons flottants réglables et traduction du texte à l\u2019écran par reconnaissance de caractères.',
      en: 'iOS browser built for video: ad blocker, favourites on the start page, adjustable floating buttons and on-screen text translation through character recognition.',
    },
    features: {
      fr: ['Bloqueur de publicités', 'Favoris sur la page d\u2019accueil', 'Boutons flottants réglables', 'Traduction du texte à l\u2019écran (OCR)'],
      en: ['Ad blocker', 'Favourites on the start page', 'Adjustable floating buttons', 'On-screen text translation (OCR)'],
    },
    category: { fr: 'Utilitaires', en: 'Utilities' },
    tech: ['Swift', 'SwiftUI', 'WebKit', 'Translation'],
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
  const id = c?.id || `app-${base.trackId}`;

  // Sans capture iPhone (app iPad seule), la galerie prend celles de l'iPad.
  const gallery = (raw: ITunesApp) =>
    (raw.screenshotUrls?.length ? raw.screenshotUrls : raw.ipadScreenshotUrls || [])
      .slice(0, 6)
      .map(u => appleImage(u, 1400));

  return {
    id,
    trackId: base.trackId,
    status: 'live',
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
    screenshots: { fr: gallery(base), en: gallery(en) },
    device: mergeDevice(id, {
      iphone: bothLangs({ fr: toShots(base.screenshotUrls, 1800), en: toShots(en.screenshotUrls, 1800) }),
      ipad: bothLangs({ fr: toShots(base.ipadScreenshotUrls, 1800), en: toShots(en.ipadScreenshotUrls, 1800) }),
    }, c?.rawStoreShots),
    tech: c?.tech || SWIFT,
    featured: c?.featured ?? true,
    isNew: isRecent(base),
    rating: base.averageUserRating || 0,
    ratingCount: base.userRatingCount || 0,
    landingPage: c?.landingPage,
    externalLink: c?.externalLink,
    appStoreLink: base.trackViewUrl,
    updatedAt: base.currentVersionReleaseDate,
  };
}

/* ─── Apps en attente (App Store Connect) ────────────────────────── */
interface PendingApp {
  trackId: number;
  status: 'review' | 'dev';
  submittedAt?: string;
  name: Bilingual;
  subtitle?: Bilingual;
  description?: Bilingual;
  category?: string;
  icon?: string;
  screenshots?: Partial<Record<DeviceKind, Partial<Bilingual<string[]>>>>;
}

const PENDING = ((pendingData as unknown as { apps?: PendingApp[] }).apps || []);

/** Catégories App Store Connect (identifiants) → libellés. */
const ASC_CATEGORY: Record<string, Bilingual> = {
  GAMES: { fr: 'Jeux', en: 'Games' },
  TRAVEL: { fr: 'Voyages', en: 'Travel' },
  ENTERTAINMENT: { fr: 'Divertissement', en: 'Entertainment' },
  EDUCATION: { fr: 'Éducation', en: 'Education' },
  PRODUCTIVITY: { fr: 'Productivité', en: 'Productivity' },
  LIFESTYLE: { fr: 'Style de vie', en: 'Lifestyle' },
  HEALTH_AND_FITNESS: { fr: 'Forme et santé', en: 'Health & Fitness' },
  UTILITIES: { fr: 'Utilitaires', en: 'Utilities' },
  BOOKS: { fr: 'Livres', en: 'Books' },
  MUSIC: { fr: 'Musique', en: 'Music' },
  PHOTO_AND_VIDEO: { fr: 'Photo et vidéo', en: 'Photo & Video' },
  SOCIAL_NETWORKING: { fr: 'Réseaux sociaux', en: 'Social Networking' },
};

const STATUS_PRICE: Record<'review' | 'dev', Bilingual> = {
  review: { fr: 'En revue', en: 'In review' },
  dev: { fr: 'En cours', en: 'In progress' },
};

/** Le premier paragraphe d'une description de fiche : l'accroche. */
const lead = (text: string) => text.split(/\n\s*\n/)[0].trim();

function pendingToApp(p: PendingApp): PortfolioApp {
  const c = CURATION[p.trackId];
  const id = c?.id || `app-${p.trackId}`;
  const description = p.description || { fr: '', en: '' };
  const storeShots = (kind: DeviceKind) => bothLangs(p.screenshots?.[kind]);
  const marketing = storeShots('iphone') || storeShots('ipad');
  const device = mergeDevice(id, {
    iphone: bothLangs({ fr: storeShots('iphone')?.fr.map(src => ({ src })), en: storeShots('iphone')?.en.map(src => ({ src })) }),
    ipad: bothLangs({ fr: storeShots('ipad')?.fr.map(src => ({ src })), en: storeShots('ipad')?.en.map(src => ({ src })) }),
  });
  const raw = device.iphone || device.ipad;

  return {
    id,
    trackId: p.trackId,
    status: p.status,
    name: c?.name || p.name,
    subtitle: c?.subtitle || p.subtitle || { fr: deriveSubtitle(description.fr), en: deriveSubtitle(description.en) },
    description: c?.description || description,
    features: c?.features || { fr: deriveFeatures(description.fr), en: deriveFeatures(description.en) },
    price: STATUS_PRICE[p.status],
    category: c?.category || ASC_CATEGORY[p.category || ''] || { fr: 'iOS', en: 'iOS' },
    icon: c?.icon || localIcon(id) || p.icon || '',
    screenshots: marketing
      ? { fr: marketing.fr.slice(0, 6), en: marketing.en.slice(0, 6) }
      : { fr: (raw?.fr || []).map(s => s.src), en: (raw?.en || []).map(s => s.src) },
    device,
    tech: c?.tech || SWIFT,
    featured: false,
    isNew: false,
    rating: 0,
    ratingCount: 0,
    landingPage: c?.landingPage,
    updatedAt: p.submittedAt,
  };
}

function devToApp(d: DevApp): PortfolioApp {
  const device = localDevice(d.id);
  const raw = device.iphone || device.ipad;
  return {
    id: d.id,
    status: 'dev',
    name: { fr: d.name, en: d.name },
    subtitle: d.subtitle,
    description: d.description,
    features: d.features,
    price: STATUS_PRICE.dev,
    category: d.category,
    icon: d.icon || localIcon(d.id) || '',
    screenshots: { fr: (raw?.fr || []).map(s => s.src), en: (raw?.en || []).map(s => s.src) },
    device,
    tech: d.tech,
    featured: false,
    isNew: false,
    rating: 0,
    ratingCount: 0,
    landingPage: d.landingPage,
  };
}

/** L'accroche d'une description longue (fiche App Store) — pour les cartes et l'aperçu. */
export const descriptionLead = lead;

function byId(list?: ITunesApp[]): Map<number, ITunesApp> {
  return new Map((list || []).map(a => [a.trackId, a]));
}

/**
 * Assemble tout le portfolio : apps en ligne (curation d'abord, puis les plus
 * récentes), Guidor, puis les apps en revue et les projets en développement.
 */
export function buildApps(data: StorefrontData): PortfolioApp[] {
  const frById = byId(data.fr);
  const usById = byId(data.us);
  const ids = new Set<number>([...frById.keys(), ...usById.keys()]);

  const live = [...ids]
    .map(id => toPortfolioApp(frById.get(id), usById.get(id)))
    .filter((a): a is PortfolioApp => a !== null);

  const rank = (a: PortfolioApp) => CURATION[a.trackId ?? -1]?.order ?? Number.MAX_SAFE_INTEGER;
  const released = (a: PortfolioApp) => new Date(a.updatedAt || 0).getTime();
  live.sort((a, b) => rank(a) - rank(b) || released(b) - released(a));

  // Une app passée en ligne quitte la liste d'attente toute seule.
  const pending = PENDING.filter(p => !ids.has(p.trackId)).map(pendingToApp);
  const taken = new Set([...live, ...pending].map(a => a.id));
  const dev = DEV_APPS.filter(d => !taken.has(d.id)).map(devToApp);

  const byStatus = (s: AppStatus) => [...pending, ...dev].filter(a => a.status === s);
  return [...live, ...MANUAL_APPS, ...byStatus('review'), ...byStatus('dev')];
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
