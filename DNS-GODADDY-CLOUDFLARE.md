# Déplacer le DNS de palette-tunisie.site (GoDaddy → Cloudflare) + brancher Cloudflare Pages

État actuel (vérifié) : le domaine utilise les nameservers GoDaddy `ns11.domaincontrol.com` / `ns12.domaincontrol.com` et affiche la page parkée GoDaddy. On va confier le DNS à Cloudflare.

---

## Étape 1 — Ajouter le domaine à Cloudflare (récupérer les 2 nameservers)
1. Connecte-toi sur **https://dash.cloudflare.com** (crée un compte gratuit si besoin).
2. **Add a site / Ajouter un site** → saisis `palette-tunisie.site` → **Continue**.
3. Choisis le plan **Free** → Continue.
4. Cloudflare scanne le DNS existant. Comme le domaine n'a pas encore de vrais enregistrements (juste la page parkée GoDaddy), tu peux continuer — on ajoutera le site Pages après.
5. Cloudflare affiche **2 nameservers** qui te sont attribués, par ex. :
   - `xxxx.ns.cloudflare.com`
   - `yyyy.ns.cloudflare.com`
   **Garde ces deux valeurs** (elles sont uniques à ton compte).

## Étape 2 — Changer les nameservers chez GoDaddy
1. Va sur **https://dcc.godaddy.com/control/portfolio** (ou GoDaddy → **My Products → Domains**).
2. Clique sur `palette-tunisie.site` → ouvre les paramètres du domaine.
3. Section **Nameservers / Serveurs de noms** → **Change / Modifier**.
4. Choisis **« I'll use my own nameservers »** (Utiliser mes propres serveurs de noms / Custom).
5. **Supprime** les nameservers GoDaddy et **saisis les 2 nameservers Cloudflare** de l'étape 1.
6. **Save / Enregistrer**. (GoDaddy peut demander une confirmation par email.)

> Astuce : si GoDaddy propose « Connecter à Cloudflare » ou un bouton d'aide, ignore et fais le changement manuel ci-dessus — c'est le plus fiable.

## Étape 3 — Attendre l'activation
- La propagation prend de **quelques minutes à ~24 h** (souvent < 1 h).
- Cloudflare t'envoie un email **« palette-tunisie.site is now active »** et le statut passe à **Active** dans le dashboard.
- Dans Cloudflare → **SSL/TLS** : laisse le mode sur **Full** (automatique avec Pages). HTTPS est fourni gratuitement.

## Étape 4 — Brancher le site (Cloudflare Pages)
Si le projet Pages n'existe pas encore :
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → autorise GitHub → choisis le dépôt **`palette-tunisie`**.
2. **Framework preset = None**, **Build command = (vide)**, **Build output directory = `/`** → **Save and Deploy**.
   → Le site est en ligne sur `palette-tunisie.pages.dev`.

Puis attache le domaine :
3. Dans le projet Pages → **Custom domains → Set up a domain** → saisis `palette-tunisie.site` → **Continue → Activate domain**.
   Comme le DNS est maintenant chez Cloudflare, l'enregistrement (CNAME proxifié vers `palette-tunisie.pages.dev`) est **créé automatiquement**.
4. Ajoute aussi **`www.palette-tunisie.site`** de la même façon.
5. (Option) Redirige `www` → apex (ou l'inverse) : Cloudflare → **Rules → Redirect Rules** → crée une règle 301.

## Vérifier
- `https://palette-tunisie.site` et `https://www.palette-tunisie.site` chargent le site en HTTPS.
- Dans un terminal : `dig +short NS palette-tunisie.site` doit renvoyer les nameservers **…ns.cloudflare.com** (plus domaincontrol.com).

## Après la mise en ligne
- `js/config.js` est déjà réglé sur `https://palette-tunisie.site` → rien à refaire côté SEO.
- **Email** : tu n'as pas d'email sur ce domaine pour l'instant (le formulaire utilise contact@sg-palette.com). Si un jour tu ajoutes des emails `@palette-tunisie.site`, il faudra recréer les enregistrements **MX** dans Cloudflare (le DNS est désormais géré là, plus chez GoDaddy).
- **Google Search Console** : ajoute la propriété `palette-tunisie.site` et soumets `https://palette-tunisie.site/sitemap.xml`.
- (Option) Active **Cloudflare Web Analytics** (gratuit, sans cookies) pour mesurer le trafic.
