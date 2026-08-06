# Configuration de l'authentification API

## Vue d'ensemble

L'API AmiFidele utilise un système d'authentification basé sur un token API. Toutes les requêtes doivent inclure ce token dans le header `x-api-key`.

## Configuration

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
# URL de l'API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Token d'authentification (OBLIGATOIRE)
NEXT_PUBLIC_API_KEY=votre_token_ici
```

### 2. Obtenir le token

Le token doit correspondre à la variable `API_TOKEN_AUTH` configurée dans votre API.

Pour vérifier ou configurer le token dans l'API :
1. Ouvrez le fichier `../api-amifidele/.env`
2. Vérifiez ou définissez la variable `API_TOKEN_AUTH`
3. Utilisez la même valeur dans `NEXT_PUBLIC_API_KEY` de votre `.env.local`

### 3. Exemple de configuration

**Dans `../api-amifidele/.env` :**
```env
API_TOKEN_AUTH=mon_super_token_secret_123
```

**Dans `Amifidele/.env.local` :**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_KEY=mon_super_token_secret_123
```

## Utilisation

Le token est automatiquement inclus dans toutes les requêtes API via le fichier `src/lib/auth.ts`.

Les fonctions suivantes utilisent automatiquement le token :
- `fetchProducts()`
- `fetchProductById()`
- `fetchProductsByCategory()`
- `searchProducts()`

## Sécurité

### Variables d'environnement

- `NEXT_PUBLIC_API_KEY` : Accessible côté client (nécessaire pour les requêtes depuis le navigateur)
- `API_KEY` : Accessible uniquement côté serveur (plus sécurisé mais nécessite des API Routes Next.js)

### Recommandations

1. **Développement** : Utilisez `NEXT_PUBLIC_API_KEY` pour faciliter le développement
2. **Production** : Pour plus de sécurité, considérez :
   - Utiliser des API Routes Next.js pour masquer le token côté serveur
   - Implémenter un système de rotation de tokens
   - Utiliser des tokens avec expiration

## Dépannage

### Erreur 401 (Token manquant)
- Vérifiez que `NEXT_PUBLIC_API_KEY` est défini dans `.env.local`
- Redémarrez le serveur de développement après avoir modifié `.env.local`

### Erreur 403 (Token invalide)
- Vérifiez que le token correspond exactement à `API_TOKEN_AUTH` de l'API
- Vérifiez qu'il n'y a pas d'espaces ou de caractères invisibles

### Le token n'est pas envoyé
- Vérifiez que le fichier `src/lib/auth.ts` est correctement importé
- Vérifiez les logs de la console pour voir les headers envoyés


