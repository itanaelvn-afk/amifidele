# AmiFidele - Comparateur de produits pour animaux de compagnie

Site web de comparatif de produits destiné aux propriétaires d'animaux de compagnie, avec intégration de liens affiliés et de produits provenant de l'API api-amifidele.

## 🚀 Fonctionnalités

- **Comparaison de produits** : Comparez facilement les produits pour vos animaux
- **Intégration API** : Récupération dynamique des produits depuis l'API api-amifidele
- **Liens affiliés** : Gestion automatique des liens affiliés vers les revendeurs
- **Interface moderne** : Design attractif et responsive optimisé pour les propriétaires d'animaux
- **Recherche et filtres** : Recherchez et filtrez les produits par catégorie
- **Produits recommandés** : Mise en avant des meilleurs produits selon les notes

## 📋 Prérequis

- Node.js 18+ 
- npm, yarn, pnpm ou bun

## 🛠️ Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd Amifidele
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.local.example .env.local
```

4. Éditez `.env.local` (voir aussi `.env.example`) :
```env
# URL upstream (serveur uniquement)
API_URL=http://localhost:4000/api

# Token = API_TOKEN_AUTH de api-amifidele (serveur uniquement)
API_TOKEN=votre_token_ici

# Formulaire de contact (Formspree) — ID après /f/ dans l’URL du formulaire
FORMSPREE_FORM_ID=xxxxxxxx
```

> ⚠️ **Important** : ne plus mettre la clé dans une variable `NEXT_PUBLIC_*`. Le navigateur passe par `/api/bff/*` (voir `docs/API_AUTHENTICATION.md`).

### Formulaire de contact (Formspree)

- Page : `/contact` → composant `ContactForm` → `POST /api/contact`
- Le serveur relaie vers Formspree avec `FORMSPREE_FORM_ID` (jamais exposé au client)
- Sans ID : en **dev** l’envoi est simulé ; en **prod** → erreur + fallback `contact@amifidele.fr`
- Détail du flux : commentaires en tête de `src/app/api/contact/route.ts`

## 🎯 Configuration de l'API

Le site est configuré pour fonctionner avec l'API `api-amifidele`. 

### Structure attendue de l'API

L'API doit retourner des produits au format suivant :

```json
{
  "id": 1,
  "name": "Nom du produit",
  "category": "Alimentation",
  "price": 45.99,
  "rating": 4.8,
  "image": "https://...",
  "description": "Description du produit",
  "features": ["Caractéristique 1", "Caractéristique 2"],
  "brand": "Marque",
  "affiliateLinks": [
    {
      "retailer": "Zooplus",
      "url": "https://...",
      "price": 45.99
    }
  ]
}
```

### Endpoints attendus

- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Récupère un produit par ID
- `GET /api/products?category=:category` - Filtre par catégorie
- `GET /api/products/search?q=:query` - Recherche de produits

Si votre API a une structure différente, vous pouvez adapter les fonctions dans `src/lib/api.ts`.

## 🚀 Démarrage

### Option 1 : Lancer le site web uniquement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### Option 2 : Lancer le site web ET l'API en même temps (recommandé)

```bash
npm run dev:all
# ou
yarn dev:all
# ou
pnpm dev:all
```

Cette commande lance automatiquement :
- Le site web Next.js sur [http://localhost:3000](http://localhost:3000)
- L'API sur le port 4000 (configuré dans `../api-amifidele/src/server.js`)

Les deux services démarrent en parallèle avec des logs colorés pour les distinguer :
- **WEB** (bleu) : Logs du site web Next.js
- **API** (vert) : Logs de l'API

> 💡 **Astuce** : `.env.local` doit contenir `API_URL` et `API_TOKEN` (voir `.env.example`). Le navigateur appelle `/api/bff/*`, pas l'API directement.

### Autres commandes disponibles

- `npm run dev:api` - Lance uniquement l'API
- `npm run dev:all:script` - Alternative utilisant un script Node.js personnalisé

## 📁 Structure du projet

```
src/
├── app/              # Pages Next.js
├── components/        # Composants React
│   ├── ui/           # Composants UI réutilisables
│   └── ...
├── lib/              # Utilitaires et services
│   ├── api.ts        # Service API
│   └── utils/        # Utilitaires
└── hooks/            # Hooks React personnalisés
```

## 🎨 Personnalisation

### Couleurs et thème

Les couleurs sont définies dans `src/app/globals.css`. Vous pouvez modifier les variables CSS pour personnaliser le thème.

### Produits mockés

En cas d'erreur de connexion à l'API, le site utilise automatiquement des produits mockés définis dans `src/components/products.ts`.

## 📦 Build pour production

```bash
npm run build
npm start
```

Déploiement **Vercel + domaine** `amifidele.fr` : voir [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md).  
API NAS : repo `api-amifidele` → `docs/NAS_DEPLOY.md`.

## 🔧 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Lucide React** - Icônes
- **Radix UI** - Composants UI accessibles

## 📝 Notes

- Les liens affiliés s'ouvrent dans un nouvel onglet avec `noopener,noreferrer` pour la sécurité
- Le site utilise le cache Next.js pour optimiser les performances
- En cas d'erreur API, les produits mockés sont affichés automatiquement

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

[Votre licence ici]
