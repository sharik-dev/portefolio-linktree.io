# Instructions pour Claude Code — Projet Portfolio Sharik Abubucker

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

## Apps publiées sur l'App Store

| App | Note | Lien |
|---|---|---|
| Guidor | — | https://apps.apple.com/fr/app/guidor/id1072066692 |
| Meow-Tube | 4.9 ★ | https://apps.apple.com/fr/app/meow-tube/id6760180650 |
| LocalShort | 4.7 ★ | sharik.fr/local-short |
| Islamic Daily Quote | 4.8 ★ | https://apps.apple.com/fr/app/islamic-daily-quote/id6760481474 |
