# Instructions pour Claude Code — Projet Portfolio Sharik Abubucker

## 🔐 Credentials

Toutes les clés API / secrets sont centralisés dans **`/home/ubuntu/.credentials/credentials.md`**.
Avant de redemander une clé, lis ce fichier. Ne jamais le committer ni l'afficher publiquement.

## CV — Règle de synchronisation OBLIGATOIRE

Le CV existe en **4 endroits distincts** qui doivent toujours être identiques.
**Toute modification du CV doit être appliquée aux 4 fichiers sans exception.**

### Les 4 sources de vérité du CV

| Fichier | Rôle |
|---|---|
| `portefolio-linktree/mon_portfolio/src/assets/cv_markdown/CV_Sharik_french.md` | Aperçu markdown FR + téléchargement texte |
| `portefolio-linktree/mon_portfolio/src/assets/cv_markdown/CV_Sharik_english.md` | Aperçu markdown EN + téléchargement texte |
| `portefolio-linktree/mon_portfolio/src/utils/downloadCvAsPdf.ts` | Génération PDF (objet `DATA`) |
| `portefolio-linktree/mon_portfolio/src/pages/CvPage.tsx` | Preview interactive (onglets Expériences, Formations, Compétences, Langues) |

### Règles de synchronisation

- Modifier le MD français → modifier le MD anglais (traduction équivalente)
- Modifier un MD → répercuter dans `downloadCvAsPdf.ts` (objet `DATA`) ET dans `CvPage.tsx` (objet `DATA`)
- Modifier `downloadCvAsPdf.ts` → répercuter dans les 2 MD et dans `CvPage.tsx`
- Modifier `CvPage.tsx` → répercuter dans les 2 MD et dans `downloadCvAsPdf.ts`
- **Ne jamais modifier un seul fichier sans vérifier les 3 autres**

### Champs à synchroniser systématiquement

- Nom, titre, coordonnées (ville, email, téléphone, LinkedIn, GitHub, portfolio, origine)
- Langues parlées
- Expériences (titres, périodes, bullets)
- Compétences (catégories, technologies — pas de Core ML/Vision sans preuve concrète)
- Projets (titres, descriptions, notes App Store, liens)
- Formation (diplômes, écoles, périodes, contexte)
- Mots-clés ATS

---

## Profil du candidat

**Nom complet :** Sharik Abubucker
**Titre principal :** Ingénieur Logiciel — Développement Mobile, Web & CI/CD
**Spécialité cœur de métier :** Développeur iOS (Swift, SwiftUI, UIKit, MVVM)
**Localisation :** Toulouse, France
**Origine :** Madagascar
**Téléphone :** +33 07 50 01 98 34
**Email :** sharikmohamed8@gmail.com
**LinkedIn :** Sharik Mohamed
**GitHub :** github.com/sharik-dev
**Portfolio :** sharik.fr

## Règles de contenu CV

- Le titre ATS doit rester court et précis — éviter les intitulés trop longs
- Ne jamais mentionner Core ML / Vision / On-device AI sans projet concret associé
- "arabe" ne doit pas apparaître dans les descriptions de projets — utiliser "multilingue"
- Guidor dans la section Projets = **Projet professionnel** (distinct de l'expérience Skyconseil)
- Les liens App Store doivent s'afficher en texte court `[App Store ↗](url)` dans les MD
- Le résumé ne doit pas contenir "reconversion volontaire" — utiliser "montée en compétences progressive"
- Malgache est langue native au même titre que le français

## Page `/portefolio` — liste d'apps DYNAMIQUE

Aucune liste d'apps en dur. Trois origines, fusionnées par `buildApps()` :

| Origine | Source | Mise à jour |
|---|---|---|
| **En ligne** | API iTunes Lookup publique, `artistId 1816768480` (aucune clé, CORS ouvert) | toute seule, à chaud côté visiteur (cache 6 h) + `npm run apps:sync` pour le snapshot |
| **En revue Apple / fiche prête** | App Store Connect → `src/data/ascPending.json` | `npm run apps:pending` (Mac, clé `.p8` de `~/.config/ios-testflight-cicd/`) |
| **En développement** (pas de fiche) | `DEV_APPS` dans `appstoreApps.ts`, écrit à la main | à la main |

```
https://itunes.apple.com/lookup?id=1816768480&entity=software&country=fr&limit=200
```

**Publier une app suffit : elle apparaît toute seule**, et sort de la liste « en
revue » d'elle-même (une entrée de `ascPending.json` dont le `trackId` arrive dans
la réponse iTunes est masquée). Un refus Apple (`REJECTED`) s'affiche « en
développement », jamais « refusé ».

| Fichier | Rôle |
|---|---|
| `src/data/appstoreApps.ts` | Types, fetch live, `CURATION`, `DEV_APPS`, `MANUAL_APPS`, fusion des captures |
| `src/data/appstoreSnapshot.json` | Snapshot iTunes embarqué au build (généré, ne pas éditer) |
| `src/data/ascPending.json` | Apps en attente (généré, ne pas éditer) |
| `src/data/deviceShots.json` + `public/shots/` | Captures de l'appareil 3D (générés, ne pas éditer) |
| `src/hooks/useAppStoreApps.ts` | Hook consommé par `PortfolioPage` |
| `src/components/TabletViewer.tsx` | iPhone / iPad 3D : paysage automatique, défilement des captures |
| `scripts/fetch-appstore-apps.cjs` | `npm run apps:sync` (lancé aussi en `prebuild`) |
| `scripts/fetch-asc-pending.cjs` | `npm run apps:pending` |
| `scripts/sync-device-shots.cjs` | `npm run shots:sync [id…]` |
| `scripts/appstore-cron.sh` | VPS : re-sync, rebuild + déploiement **seulement si** la liste a changé |

### Captures de l'iPhone / iPad 3D — toujours des captures BRUTES

Les captures de l'App Store sont des visuels marketing (texte + téléphone
incliné) : dans l'appareil 3D, cela donne un téléphone dans un téléphone, illisible.
L'appareil 3D montre donc les captures **brutes** de chaque app, que
`npm run shots:sync` va chercher dans le projet de l'app (table `APPS` du script :
fastlane, shotsmith `raw/`, `Design/…`), convertit en WebP ≤ 1800 px et range dans
`public/shots/<id>/`. La fiche détaillée (modale), elle, garde les visuels
marketing de l'App Store, redemandés en haute résolution (`appleImage()` : le CDN
d'Apple sert n'importe quelle taille, l'API ne renvoie qu'une vignette 320 px).

- **Nouvelle app** : ajouter son `trackId` dans `CURATION` (avec un `id`), puis une
  entrée du même `id` dans `APPS` de `sync-device-shots.cjs`, et lancer
  `npm run shots:sync <id>`. Sans cela elle s'affiche quand même, avec ses captures
  App Store sur l'iPhone 3D.
- `rawStoreShots: true` dans `CURATION` : les captures de la fiche sont déjà
  brutes (jeux Godot), elles complètent les locales (onglet iPad).
- **Jeu sans fastlane** : poser des PNG dans `.shots-src/<id>/` (git-ignoré ;
  `icon.png`, sous-dossier `ipad/`), puis `npm run shots:sync <id>`.
- L'onglet iPad n'apparaît que si l'app a de vraies captures iPad.
- `shots:sync` et `apps:pending` ne tournent que sur le Mac ; leurs sorties sont
  versionnées, le build du VPS n'en a pas besoin.

- **`CURATION`** (clé = `trackId`) : `id` stable + copie éditoriale facultative
  (sous-titre/description FR-EN, fonctionnalités, stack, landing page, ordre).
- **`MANUAL_APPS`** : apps d'un autre éditeur (Guidor, Skyconseil).
- **`PITCH`** (clé = `id`) : la phrase FR-EN affichée sous le titre (aperçu 3D et cartes).
  Une app absente retombe sur la première phrase de sa description : en écrire une à chaque nouvelle app.
- FR et EN viennent des storefronts `fr` et `us`.

⚠️ Le CV (les 4 fichiers synchronisés ci-dessus) garde sa liste d'apps écrite à la
main — il n'est pas branché sur ce flux.

## CV par spécialité (iCloud Drive/CV)

Sept CV ciblés, FR + EN, dérivés du CV principal : **Swift, CI-CD, Web, Backend, Cyber, IA, Ingenieur-Logiciel** (ce dernier = profil généraliste architecte full-stack + mobile, dossier `CV Ingénieur Logiciel`).
Ils ne font **pas** partie des 4 fichiers synchronisés ci-dessus : ce sont des déclinaisons.

| Fichier | Rôle |
|---|---|
| `scripts/cv-variants.cjs` | Données des 7 variantes (titre, résumé, compétences, puces, projets, mots-clés) + `COMMON` (coordonnées d'alternance, stage, formation, langues) |
| `scripts/lib/cv-print-html.cjs` | Gabarit HTML partagé avec `generate-cv-pdfs.cjs` (même rendu que le PDF du site) |
| `scripts/generate-cv-variants.cjs` | `npm run cv:variants` → `~/Library/Mobile Documents/com~apple~CloudDocs/CV/CV <X>/CV_Sharik_<X>_<FR|EN>.pdf` |

- Rendu par le Chrome installé en headless (pas besoin de `node_modules`). `--only Web` pour une seule variante, `--out <dir>` pour un autre dossier.
- Le script signale ⚠️ tout CV qui dépasse **une page** : raccourcir alors la variante concernée.
- Si une donnée commune change dans le CV principal (dates, écoles, contact), la reporter dans `COMMON`.
- `COMMON.aeroBullet` ajoute en tête de l'alternance une puce sur l'aéronautique (Guidor, British Airways, Japan Airlines) dans les 7 variantes, volontairement légère car elles servent aussi hors aéro. `aeroBullet: false` la désactive (les CV par entreprise ont leurs propres puces aéro).
- **CV par entreprise** (salon Aéro & Spatial Synergie, 30/09/2026) : `scripts/cv-salon-aero.cjs`, FR seul, profil qui reste polyvalent ; seuls l'accroche, l'ordre des compétences et les projets changent. `node scripts/generate-cv-variants.cjs --set salon` → `iCloud/CV/CV Spécifique/Salon Aéro Toulouse 2026/`.
