# CI locale — AmiFidele (site public)

## Commandes

```powershell
cd Amifidele
npm ci
npm run lint
npm run typecheck
npm run build
```

Variables utiles pour le build (optionnel en local si `.env.local` existe) :

| Variable | Exemple CI |
|----------|------------|
| `SITE_URL` | `https://amifidele.fr` |
| `API_URL` | `https://api.amifidele.fr/api` |
| `API_TOKEN` | jeton réel en local ; placeholder en CI |

## GitHub Actions

Fichier : `.github/workflows/ci.yml`

Sur chaque push / PR vers `main` : **lint → typecheck → build**.

### Bloquer le merge si la CI échoue

1. Repo GitHub → **Settings → Branches → Add branch ruleset** (ou Branch protection)
2. Branch : `main`
3. Activer **Require status checks to pass**
4. Cocher le check **`lint-typecheck-build`**

Sans cette règle, la CI reste **informative** (visible sur la PR, mais merge possible même en rouge).

## Autres repos

| Repo | CI | Commandes locales |
|------|----|-------------------|
| `api-amifidele` | lint + `npm test` | voir README API → Tests & CI |
| `dashboard-amifidele` | *(pas encore — lint bloque le build)* | nettoyer ESLint puis ajouter CI |
| `AwinFetcher` | typecheck | `npm run typecheck` |
