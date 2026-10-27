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

## Apps publiées sur l'App Store — liste DYNAMIQUE

La page `/portefolio` ne contient plus de liste d'apps en dur. Elle lit le compte
développeur Apple (`artistId 1816768480`) via l'API iTunes Lookup publique — aucune
clé, aucune auth, CORS ouvert :

```
https://itunes.apple.com/lookup?id=1816768480&entity=software&country=fr&limit=200
```

**Publier une app sur l'App Store suffit : elle apparaît toute seule** (nom, icône,
description, captures, note, catégorie, prix), et les métadonnées des apps existantes
se mettent à jour d'elles-mêmes.

| Fichier | Rôle |
|---|---|
| `src/data/appstoreApps.ts` | Types, fetch live (cache localStorage 6 h), fallback snapshot, `CURATION`, `MANUAL_APPS` |
| `src/data/appstoreSnapshot.json` | Snapshot embarqué au build — premier rendu instantané + secours si Apple ne répond pas (généré, ne pas éditer) |
| `src/hooks/useAppStoreApps.ts` | Hook consommé par `PortfolioPage` |
| `scripts/fetch-appstore-apps.cjs` | `npm run apps:sync` (lancé aussi en `prebuild`) — régénère le snapshot |
| `scripts/appstore-cron.sh` | Vérification périodique : re-sync, rebuild + déploiement **seulement si** la liste d'apps a changé |

Trois couches, de la moins à la plus prioritaire : snapshot → fetch live → `CURATION`.

- **`CURATION`** (clé = `trackId` App Store) : la copie éditoriale faite main
  (sous-titre/description FR-EN, fonctionnalités, captures locales, stack, landing
  page, ordre d'affichage). Chaque champ est facultatif et écrase Apple.
- Une app **absente de `CURATION` s'affiche quand même** : sous-titre et
  fonctionnalités sont déduits de la description App Store, captures et icône
  viennent d'Apple. Ajouter une entrée `CURATION` ne sert qu'à soigner le rendu.
- **`MANUAL_APPS`** : les apps hors de ce compte développeur (Guidor, publiée par
  Skyconseil) — elles restent écrites en dur.
- FR et EN viennent des storefronts `fr` et `us` : le nom, la description et le prix
  sont donc déjà bilingues côté Apple.

Apps du compte au 15/08/2026 (générées, pour référence) : Meow-Tube, Islamic Daily
Quote, easy-Gym / FitGame, online strategy dot war, Vocabulaire Anglais Widget,
Strategic wars / Military Strategic War 2026, DuoBook / Addicted to Reading.
Hors compte : Guidor (Skyconseil). LocalShort et meow-Toon restent dans
`IN_PROGRESS_APPS` (pas sur l'App Store).

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
