# Monitoring performances & uptime — AmiFidele

Stack V1 (choisie le 22/08/2026) :

| Besoin | Outil | Pourquoi |
|--------|--------|----------|
| Uptime site + API | **UptimeRobot** (plan free) | Gratuit, 5 min, alertes e-mail, sans cookie sur le site |
| Core Web Vitals (lab) | **`npm run audit:lighthouse`** | Déjà en place |
| Mesure d'audience site | **Google Analytics 4** | Consentement CMP requis ; prod uniquement |
| Déploiements / erreurs build | **Dashboard Vercel** | Projet déjà hébergé là |
| Check manuel rapide | **`npm run smoke:uptime`** | Site `/`, `/produits` + `api/health` |

Pas de Vercel Analytics / Speed Insights (dépose des scripts/cookies côté navigateur — remplacé par GA4 derrière CMP).

## Google Analytics 4

| Élément | Détail |
|---------|--------|
| Outil | Google Analytics 4 (gtag.js) |
| Chargement | Production uniquement + consentement catégorie « Mesure d'audience » |
| Variable | `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Vercel Production) |
| Dashboard | https://analytics.google.com — propriété **AmiFidele** |
| Compte | compte Google utilisé à la création de la propriété (voir éditeur) |
| Événements custom | `affiliate_click` (clic vers marchand) |
| Page views | Uniquement via `AnalyticsPageView` (`send_page_view: false` à l'init gtag) |

### Créer / configurer GA4

1. [Google Analytics](https://analytics.google.com) → Admin → Créer une propriété **AmiFidele** (fuseau Europe/Paris).
2. Flux Web → URL `https://amifidele.fr` → noter le **Measurement ID** (`G-…`).
3. Vercel → Settings → Environment Variables → Production : `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-…`
4. Redéployer le site prod.

### Vérifier en prod

1. Navigation privée → refuser analytics → pas de requête `googletagmanager.com`.
2. Accepter analytics → Realtime dans GA4 affiche la session (~30 s).
3. Naviguer `/`, `/produits`, fiche produit → page views (une seule par route).
4. Clic « Acheter » / « Voir chez le marchand » → événement `affiliate_click`.

```powershell
npm run audit:ga
```

## Accès

| Service | URL | Compte |
|---------|-----|--------|
| UptimeRobot | https://dashboard.uptimerobot.com | créé via e-mail `contact@amifidele.fr` |
| Google Analytics 4 | https://analytics.google.com | propriété AmiFidele — compte Google éditeur |
| Vercel | https://vercel.com/dashboard | compte projet AmiFidele |
| Rapports Lighthouse locaux | `reports/lighthouse/` (gitignoré) | machine de dev |

## Monitors UptimeRobot (cibles)

1. `https://amifidele.fr/` — site apex
2. `https://amifidele.fr/produits` — catalogue
3. `https://api.amifidele.fr/health` — API NAS

Intervalle free : **5 minutes**. Alerte : e-mail `contact@amifidele.fr`.

### Créer / recrée un monitor (agentic, sans API key)

```powershell
cd "d:\Itanael\Documents\Projet\Site Web Comparatif\Amifidele"
node scripts/setup-uptime-monitor.mjs https://amifidele.fr/ contact@amifidele.fr
node scripts/setup-uptime-monitor.mjs https://amifidele.fr/produits contact@amifidele.fr
node scripts/setup-uptime-monitor.mjs https://api.amifidele.fr/health contact@amifidele.fr
```

Puis : ouvrir la boîte `contact@amifidele.fr` → mail UptimeRobot → **Activate**.

Deep-link navigateur (si besoin) :

`https://uptimerobot.com/quick-start?url=https://amifidele.fr/&email=contact@amifidele.fr`

## Contrôles manuels

```powershell
# Uptime rapide
npm run smoke:uptime

# Domaine (redirect www, parking DNS, API)
npm run smoke:domaine

# Scores Lighthouse (PowerShell)
$env:LH_MODE="local"
npm run audit:lighthouse
```

## Seuils V1 (alertes / revue)

| Métrique | Seuil OK | Action si hors seuil |
|----------|----------|----------------------|
| Uptime site / API | up | UptimeRobot envoie l’e-mail ; vérifier Vercel + NAS |
| Perf Lighthouse mobile `/` et `/produits` | ≥ 90 | Relancer audit, regarder LCP/CLS |
| CLS | ≤ 0,1 | Revoir skeletons / images |
| SEO Lighthouse | = 100 | Vérifier H1, meta, JSON-LD |

## Runbook downtime

1. Lire l’e-mail UptimeRobot (quel monitor : site ou API).
2. `npm run smoke:uptime` depuis la machine de dev.
3. **Site down** → Vercel → Deployments (build failed / rollback) ; DNS LWS si besoin.
4. **API down** → NAS / `api.amifidele.fr` (voir `api-amifidele/docs/NAS_DEPLOY.md`).
5. Après rétablissement : confirmer e-mail « up » UptimeRobot + `smoke:uptime`.

## Revue hebdo (5 min)

- Dashboard UptimeRobot : 100 % up ?
- Un run `audit:lighthouse` si changement front important.
- Noter toute dégradation dans le rituel hebdo Notion.
