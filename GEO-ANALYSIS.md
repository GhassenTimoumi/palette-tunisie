# GEO / AI-Search Analysis — Palette Tunisie (palette-tunisie.site)

_Analysé le 2026-11-13. Site : static (HTML/CSS/JS) sur Cloudflare Pages / GitHub Pages, FR + AR._
_Cadre (position officielle de Google) : « optimiser pour l'IA générative, c'est toujours du SEO ». Les points ci-dessous sont des **fondamentaux SEO appliqués aux surfaces de recherche IA** (AI Overviews, AI Mode, ChatGPT, Perplexity). `llms.txt` est signalé comme présent mais sans poids de citation prouvé._

## 1. GEO Readiness Score : **73 / 100** — bonne base technique, l'autorité de marque est le vrai écart

| Critère (poids) | Score | Commentaire |
|---|---|---|
| Citabilité (25%) | 18/25 | FAQ partout, définitions, mais réponses pas toujours « front-loadées » dans les 40-60 premiers mots ; 15 meta descriptions encore > 160. |
| Lisibilité structurelle (20%) | 18/20 | H1→H2→H3 propre (accueil : 1×H1, 14×H2, 19×H3), FAQ sur chaque page, 3 tableaux comparatifs, listes. |
| Multi-modal (15%) | 8/15 | Images sur accueil/produits (WebP) ; **guides et pages villes quasi sans images** (−156% de chances de sélection IA). |
| Autorité & marque (20%) | 10/20 | Schéma riche + dates ajoutées, mais **auteur = Organization seulement**, **aucune présence off-site** (LinkedIn/YouTube/Reddit/Wikipedia), `sameAs` vide. |
| Accessibilité technique (20%) | 19/20 | **Contenu 100% rendu côté serveur** (les crawlers IA ne lisent pas le JS — ici tout est en dur). Crawlers IA explicitement autorisés. `llms.txt` présent. |

## 2. Répartition par plateforme (lecture de readiness on-page)
| Plateforme | Score | Logique de citation |
|---|---|---|
| **Google AI Overviews** | ~74 | Fortement corrélé au classement : excellent on-page, mais il faut d'abord **ranker** (site neuf → dépend d'âge/backlinks). |
| **Google AI Mode** (Gemini) | ~64 | Fraîcheur + entités : contenu frais + schéma d'entité OK, mais **autorité d'entité off-site faible**. |
| **ChatGPT** | ~46 | Source surtout Wikipedia/Reddit → **aucune présence** pour l'instant. |
| **Perplexity** | ~44 | Validation communautaire (Reddit) → absente. |

## 3. Accès des crawlers IA (robots.txt) — ✅ CORRIGÉ
Avant : `robots.txt` avait été écrasé par le build en version basique. **Corrigé** : `scripts/build-seo.mjs` ré-émet désormais une version GEO stable. Autorisés explicitement : `GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended` (+ `User-agent: *` Allow). `CCBot` (entraînement) non listé → autorisé par le wildcard ; le bloquer est optionnel.

## 4. llms.txt — ✅ présent
`/llms.txt` (111 mots) : titre, description, liens produits + entreprise. Conforme au format. _Note : preuves actuelles (Mueller, SE Ranking 300k domaines) = pas de levier de citation prouvé ; on le garde car peu coûteux, sans en attendre de ranking._

## 5. Analyse des mentions de marque — ⚠️ LE PLUS GROS LEVIER
Les mentions de marque corrèlent **3× plus** que les backlinks avec la visibilité IA (Ahrefs, 75k marques).
| Signal | Présence Palette Tunisie |
|---|---|
| Wikipedia / Wikidata | ❌ Aucune |
| LinkedIn (page entreprise) | ❌ Aucune |
| YouTube (mentions/chaîne) | ❌ Aucune |
| Reddit / forums | ❌ Aucune |
| Annuaires B2B (TuniBusiness, PACKTEC, Ween…) | ❌ Pas encore (recommandé dans la recherche précédente) |
→ `Organization.sameAs` est vide : à peupler dès que les profils existent.

## 6. Citabilité au niveau du passage
- **Longueur optimale d'un bloc citable : 134-167 mots**, et **~44% des citations viennent des 30% du haut de page** → mettre la réponse directe en haut.
- Points forts : réponses FAQ courtes et autonomes (65 paires Q/R en schéma), définitions dans les guides.
- À améliorer : chaque guide/produit devrait **ouvrir par une définition/réponse de 40-60 mots** (« L'ISPM 15 est… », « Une palette EUR/EPAL est… ») avant le contexte.

## 7. Server-Side Rendering — ✅ EXCELLENT
Tout le contenu éditorial (accueil, 6 produits, 6 guides, 8 pages villes, légal) est **écrit en dur dans le HTML** (le JS ne sert qu'à la langue, la galerie de secours et le formulaire). Les crawlers IA (qui n'exécutent pas JS) voient 100% du contenu. C'est le point le plus important et il est acquis.

## 8. Top 5 des changements à plus fort impact
1. **Construire des signaux de marque off-site** (levier n°1) : créer une **page LinkedIn entreprise**, une **chaîne/vidéos YouTube**, s'inscrire sur **TuniBusiness / PACKTEC / Ween / Tayara**, participer à des discussions sectorielles. Puis **remplir `Organization.sameAs`** avec ces URLs. → gros gain ChatGPT/Perplexity/AI Mode.
2. **Gagner du classement classique** (nourrit AI Overviews) : vérifier **Google Search Console** + **Bing Webmaster**, soumettre `sitemap.xml`, créer la **fiche Google Business Profile** (Mornag), obtenir quelques backlinks B2B tunisiens.
3. **Front-loader les réponses** : ajouter en tête de chaque guide/produit un bloc « réponse directe » de 40-60 mots (définition + fait chiffrable) ; viser des passages autonomes de 134-167 mots.
4. **Multi-modal** : ajouter au moins **1 image pertinente par guide et par page ville** (photo produit/atelier) avec `alt` descriptif + `ImageObject` → +156% de taux de sélection.
5. **Autorité / fraîcheur** : ajouter un **auteur nommé** (Person + credentials) ou un « réviseur technique » réel sur les guides, et instaurer un **rafraîchissement trimestriel** (contenu < 3 mois ≈ 3× plus cité). `dateModified` est déjà en place ✅.

## 9. Recommandations de schéma
- **Déjà en place (solide)** : Organization, WebSite, LocalBusiness, ItemList, FAQPage (×21), BreadcrumbList, Article, Service/areaServed (pages villes), ContactPoint, GeoCoordinates, ImageObject. ✅
- **À ajouter** :
  - **`Person`** comme `author` des `Article` (nom réel + `jobTitle`/`knowsAbout`) — n'inventer personne, utiliser un responsable réel.
  - **`Product`** (+ `offers` en « sur devis » / `priceSpecification` sans prix inventé) sur les 6 pages produits.
  - **`dateModified`** sur Article ✅ (fait) ; l'ajouter aussi lors de chaque mise à jour.
  - Peupler **`sameAs`** (Organization) quand LinkedIn/YouTube existent.
  - Option : **`HowTo`** sur « Comment choisir sa palette ».

## 10. Suggestions de reformatage de contenu
- **Accueil** : meta description raccourcie à ~157 ✅. Ajouter une phrase-définition citable sous le H1 (« Palette Tunisie fabrique des palettes en bois à Mornag (Ben Arous) et livre partout en Tunisie… »).
- **15 pages** ont encore une meta description > 160 caractères (produits + villes) → réécrire à ≤ 155 (gabarit : « Palettes en bois à [Ville] : neuves, EUR/EPAL, export ISPM 15, sur-mesure. Livraison depuis Mornag. Devis sous 2 h. »).
- **Guides** : commencer par « **[Terme] est…** » (définition), puis un fait chiffrable sourcé, puis le développement. Garder les tableaux comparatifs (EUR/EPAL, dimensions, neuve/réemployée) — très cités par l'IA.
- **Pages villes** : ajouter 1-2 faits locaux concrets (zones industrielles desservies) pour l'unicité, sans rien inventer.

---
### Corrigé dans cette passe
- ✅ `robots.txt` GEO restauré + rendu durable (dans `build-seo.mjs`).
- ✅ Meta description de l'accueil ramenée de 259 → ~157 caractères.
- ✅ `dateModified` ajouté aux 6 guides (signal de fraîcheur).

### À faire (hors-site, non automatisable ici)
LinkedIn / YouTube / annuaires / Search Console / Google Business Profile / backlinks — ce sont les leviers décisifs pour « écraser » la recherche et la recherche IA.
