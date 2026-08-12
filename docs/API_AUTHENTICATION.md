# Configuration de l'authentification API (site AmiFidele)

## Vue d'ensemble

L'API `api-amifidele` exige un header `x-api-key`.  
**Le site public ne l'envoie plus depuis le navigateur** : les appels passent par le BFF Next.js (`/api/bff/*`), qui ajoute la clé **côté serveur**.

```
Navigateur  →  GET /api/bff/products?...  →  Route Handler Next
                                              ↓ x-api-key
                                         api-amifidele
```

## Configuration

### 1. Fichier `.env.local` (racine Amifidele)

```env
# URL upstream de l'API (serveur uniquement — pas de NEXT_PUBLIC_)
API_URL=http://localhost:4000/api

# Token = valeur de API_TOKEN_AUTH dans api-amifidele/.env
API_TOKEN=votre_token_ici
```

Alias acceptés pour le token : `API_KEY`, `API_TOKEN_AUTH`.  
Alias acceptés pour l'URL : `API_UPSTREAM_URL`.

### 2. Obtenir le token

1. Ouvrir `../api-amifidele/.env`
2. Lire / définir `API_TOKEN_AUTH`
3. Copier la **même** valeur dans `API_TOKEN` du `.env.local` du site

### 3. Exemple

**`api-amifidele/.env` :**
```env
API_TOKEN_AUTH=mon_super_token_secret_123
```

**`Amifidele/.env.local` :**
```env
API_URL=http://localhost:4000/api
API_TOKEN=mon_super_token_secret_123
```

> Ne plus utiliser `NEXT_PUBLIC_API_KEY` ni `NEXT_PUBLIC_API_URL` pour l'auth / l'upstream.

## Utilisation

- Côté client : `fetchProducts()`, etc. appellent `/api/bff/...` **sans** clé.
- Côté serveur (RSC) : même helpers appellent directement `API_URL` avec `x-api-key`.
- BFF : `src/app/api/bff/[...path]/route.ts` — **GET uniquement**, racines autorisées : `products`, `categories`, `brands`, `advertisers`. Sur `products`, `isVisible=true` est forcé.

## Sécurité

| Variable | Portée | Rôle |
|----------|--------|------|
| `API_TOKEN` | Serveur | Clé `x-api-key` |
| `API_URL` | Serveur | Base URL api-amifidele |
| ~~`NEXT_PUBLIC_API_KEY`~~ | Interdit | Exposait la clé dans le bundle |

Vérifications :
1. Sources / bundle client : aucune occurrence de la clé
2. Network (onglet navigateur) : requêtes vers `/api/bff/...` sans header `x-api-key`
3. Produits masqués : non renvoyés via le BFF

## Dépannage

### 500 « Configuration API serveur incomplète »
- Définir `API_TOKEN` (ou `API_KEY`) dans `.env.local`
- Redémarrer `next dev`

### 502 / erreur de communication
- Vérifier que l'API tourne et que `API_URL` est correct

### 401 / 403 depuis le BFF
- Aligner `API_TOKEN` avec `API_TOKEN_AUTH` de l'API

### Ancien `NEXT_PUBLIC_API_KEY` encore présent
- Le supprimer de `.env.local` et du déploiement (Vercel, etc.)
- Rebuild pour purger le bundle
