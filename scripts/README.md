# Scripts de développement

## dev-all.js

Script alternatif pour lancer le site web et l'API en parallèle sans utiliser `concurrently`.

### Utilisation

```bash
npm run dev:all:script
```

### Fonctionnalités

- Lance le site web Next.js dans le répertoire actuel
- Lance l'API dans `../api-amifidele`
- Gère l'arrêt propre des deux processus (Ctrl+C)
- Affiche les logs des deux services

### Avantages par rapport à concurrently

- Pas de dépendance supplémentaire
- Plus de contrôle sur la gestion des processus
- Logs personnalisables


