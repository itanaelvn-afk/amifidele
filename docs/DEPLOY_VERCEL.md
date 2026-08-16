# Déployer le site AmiFidele (Vercel + domaine)

Architecture : **site sur Vercel**, **API sur le NAS** (`api.amifidele.fr`).  
Détail API : repo [`api-amifidele`](https://github.com/itanaelvn-afk/api-amifidele) → `docs/NAS_DEPLOY.md`.

## Statut (16/08/2026)

| Élément | État |
|---------|------|
| Site prod Vercel | OK — https://amifidele.vercel.app |
| Domaines Vercel attachés | `amifidele.fr`, `www.amifidele.fr` |
| Env Production | `SITE_URL`, `API_URL`, `API_TOKEN`, `FORMSPREE_FORM_ID` |
| API NAS HTTPS | OK — `https://api.amifidele.fr/health` |
| DNS LWS `@` / `www` → `76.76.21.21` | En place côté zone ; **apex `https://amifidele.fr` pas encore fiable / accessible** (cache DNS, parking résiduel, ou vérif Vercel à finaliser) |
| Smoke domaine complet | **Bloqué** tant que l’apex n’affiche pas le site |

En attendant l’apex : utiliser **https://amifidele.vercel.app** (et éventuellement `www` si déjà résolu vers Vercel) pour les tests fonctionnels.

Routes catégories (`/chat`, `/chien`, …) : `dynamicParams` + fallback `NAV_ROOT_CATEGORIES` pour éviter les 404 si l’API était down au build. Après mise à jour API, préférer un redeploy prod.

Filtres listing : un `200` BFF avec `products: []` peut être **légitime** (feuille taxo sans produits, ex. `chat/hygiene`, `chat/jouets`, `chat/sante`). Ce n’est pas une panne réseau.

## 1. Prérequis

- Compte [Vercel](https://vercel.com) (Hobby OK pour setup ; **Pro** avant MEP affiliation)
- Repo GitHub `amifidele` connecté
- API NAS joignable en HTTPS (`GET https://api.amifidele.fr/health` → 200)

## 2. Projet Vercel

1. **Add New Project** → importer `amifidele`
2. Framework : Next.js (détecté)
3. Root Directory : `.` (si le dépôt = dossier site) ou `Amifidele` si monorepo
4. Build : `next build` / Output : défaut Next

### Variables d’environnement (Production)

| Name | Value |
|------|--------|
| `SITE_URL` | `https://amifidele.fr` (cible go-live ; OK même si DNS apex pas encore OK) |
| `API_URL` | `https://api.amifidele.fr/api` |
| `API_TOKEN` | même secret que `API_TOKEN_AUTH` (NAS) |
| `FORMSPREE_FORM_ID` | optionnel |

Ne jamais préfixer la clé API avec `NEXT_PUBLIC_`.

[`vercel.json`](../vercel.json) déclare le framework Next. Un redirect www → apex pourra être réactivé **après** validation de l’apex (éviter de forcer www vers un apex encore inaccessible).

## 3. Domaine (Vercel + LWS)

1. Vercel → **Settings → Domains** → `amifidele.fr` + `www.amifidele.fr`
2. Chez **LWS** (zone DNS, garder NS LWS) :

| Host | Type | Cible |
|------|------|--------|
| `@` | A | `76.76.21.21` |
| `www` | A | `76.76.21.21` |
| `api` | A / DDNS | IP publique box → NAS |

3. Vérifier : `npx vercel domains verify amifidele.fr`  
4. Attendre propagation ; plus de parking LWS sur `@`.

URL temporaire (en attendant DNS apex) : https://amifidele.vercel.app

## 4. CLI (optionnel)

```bash
cd Amifidele   # ou racine du repo site
npx vercel login
npx vercel link
npx vercel env add SITE_URL production
# … API_URL, API_TOKEN
npx vercel --prod
```

## 5. Smoke test

Quand l’apex répond le site AmiFidele (plus parking) :

```bash
npm run smoke:domaine
```

Checklist go-live domaine :

- [ ] `https://amifidele.fr` : Accueil AmiFidele (plus parking LWS)
- [ ] `https://www.amifidele.fr` accessible / redirect cohérent
- [ ] Listing / PDP via BFF
- [ ] `https://api.amifidele.fr/health` → 200
- [ ] Certificats valides
- [ ] US Notion « Configurer le domaine » → Done
