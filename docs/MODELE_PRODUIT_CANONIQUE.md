# Modèle produit AmiFidele — Phase 1 (offre canonique)

**Statut** : validé (07/08/2026) — reste à livrer le CRUD Dashboard des mappings  
**Source de vérité Notion** : [Décisions data](https://app.notion.com/p/3b4361f81bbe81d49b18d221c4d6ba77)  
**Epic** : [Migration modèle Mongo multi-sources](https://app.notion.com/p/3b4361f81bbe81e0a92cedbec1ec84ff)  
**US ops mappings** : [CRUD category_mappings + file des non mappés](https://app.notion.com/p/3b5361f81bbe81d38fc5d0ba9035ca44)

Ce document fige le contrat de données **offre** (Phase 1), le mapping Awin → canonique, et la proposition de **`category_mappings`** à valider.

---

## 1. Principes validés

1. Mongo = source de vérité AmiFidele. AwinFetcher (et futurs fetchers) = adaptateurs.
2. Phase 1 : **1 document = 1 offre** (une annonce d’un marchand pour un produit source).
3. **Pas de dump plat CSV** (~90 colonnes) dans `products`. Mapping à l’ingestion uniquement.
4. Phase 2 (plus tard) : regroupement multi-offres par EAN / fingerprint.

---

## 2. Identifiant produit (validé)

| Champ | Règle | Exemple |
|-------|--------|---------|
| `_id` | `{feedId}_{aw_product_id}` | `102667_42409477801` |
| `source` | Enum string | `"awin"` \| `"amazon"` \| `"manual"` |
| `sourceProductId` | ID natif source | `"42409477801"` (Awin) |
| `feedId` | ID du feed (Awin) | `"102667"` |

**Pourquoi ce choix**
- Compatible avec les IDs Mongo actuels (`89880_36640916409`, `102667_42409477801`).
- Le préfixe `awin:` + séparateur `:` est **abandonné**.
- La distinction multi-sources se fait via le champ **`source`**, pas via le format de `_id`.

**Exemples**

```json
{ "_id": "102667_42409477801", "source": "awin", "sourceProductId": "42409477801", "feedId": "102667" }
{ "_id": "89880_36640916409", "source": "awin", "sourceProductId": "36640916409", "feedId": "89880" }
```

> Amazon (futur) : `_id` propre à Amazon (ex. ASIN) + `source: "amazon"`. Pas de collision avec Awin tant que les namespaces d’IDs restent distincts ; si doute, préfixer côté Amazon plus tard.

---

## 3. Contrat offre canonique

```json
{
  "_id": "102667_42409477801",
  "source": "awin",
  "sourceProductId": "42409477801",
  "feedId": "102667",
  "advertiserId": "111580",
  "merchant": { "id": "111580", "name": "Vivara FR" },
  "brandId": "ObjectId(…)",
  "categoryId": "autre",
  "name": "Pack de 4 demi-noix de coco - avec vers de farine | Vivara | …",
  "description": "…",
  "price": {
    "amount": 8.09,
    "currency": "EUR",
    "delivery": 5.99,
    "old": 8.99
  },
  "images": {
    "main": "https://…",
    "thumb": "https://…"
  },
  "links": {
    "affiliate": "https://www.awin1.com/pclick.php?…",
    "merchant": "https://www.vivara.fr/…"
  },
  "ean": "5051054254753",
  "unitPrice": { "amount": 7.37, "unit": "€/kg" },
  "packSize": "12 kg",
  "inStock": true,
  "isVisible": true,
  "lastSeenAt": "ISO-8601",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Champs optionnels (affichés seulement s’ils sont présents)

| Champ | Affichage UI | Source Awin typique |
|-------|--------------|---------------------|
| `unitPrice` | Prix au kg / litre | `base_price` + `custom_2` |
| `packSize` | Contenance / format | `custom_3` |
| `price.old` | Ancien prix / promo | `product_price_old` |
| `price.delivery` | Frais de port | `delivery_cost` |
| `images.thumb` | Miniature | `aw_thumb_url` |

Si absents → **omettre** le champ (pas de `null` obligatoire côté UI).

---

## 4. Mapping Awin → canonique

| Canonique | Colonne Awin | Notes |
|-----------|--------------|-------|
| `_id` | `{data_feed_id}_{aw_product_id}` | |
| `source` | constant | `"awin"` |
| `sourceProductId` | `aw_product_id` | |
| `feedId` | `data_feed_id` | |
| `advertiserId` | `merchant_id` | MID Awin |
| `merchant.id` / `name` | `merchant_id` / `merchant_name` | |
| `brandId` | via `brand_id` / `brand_name` | Collection `brands` |
| `categoryId` | via `category_mappings` | Voir §5 |
| `name` | `product_name` | |
| `description` | `description` | |
| `price.amount` | `search_price` | **Pas** `display_price` (texte) |
| `price.currency` | `currency` | |
| `price.delivery` | `delivery_cost` | |
| `price.old` | `product_price_old` | Souvent vide MaxiZoo |
| `images.main` | `merchant_image_url` | Fallback `aw_image_url` |
| `images.thumb` | `aw_thumb_url` | |
| `links.affiliate` | `aw_deep_link` | |
| `links.merchant` | `merchant_deep_link` | |
| `ean` | `ean` | |
| `unitPrice.amount` | `base_price` | Si rempli |
| `unitPrice.unit` | `custom_2` | ex. `€/kg`, `€/l` |
| `packSize` | `custom_3` | ex. `12 kg` |
| `inStock` | `in_stock` / `stock_status` | Normaliser bool |
| `isVisible` | règles AmiFidele | Hors feed |
| `lastSeenAt` | horodatage sync | |

### Exemples validés

**Vivara** — Pack demi-noix de coco  
- Feed/Mongo `_id` : `102667_42409477801`  
- `merchant_id` 111580 · EAN `5051054254753` · prix 8.09 EUR  

**MaxiZoo** — Hill's Prescription Diet c/d Urinary Stress  
- Feed/Mongo `_id` : `89880_36640916409`  
- `merchant_product_id` 1489088 · `merchant_category` : `VET > Chat > Urinary`

---

## 5. Catégories & `category_mappings` (validé)

### 5.1 Taxonomie AmiFidele V1 (déjà figée)

Profondeur max 2.

| slug | Label |
|------|--------|
| `chien` | Chien |
| `chien/nourriture` | Nourriture |
| `chien/colliers-laisses` | Colliers & laisses |
| `chien/couchages` | Couchages |
| `chien/hygiene` | Hygiène |
| `chien/education` | Éducation |
| `chien/jouets` | Jouets |
| `chien/sante` | Santé |
| `chat` | Chat |
| `chat/nourriture` | Nourriture |
| `chat/litieres` | Litières |
| `chat/griffoirs` | Griffoirs |
| `chat/hygiene` | Hygiène |
| `chat/jouets` | Jouets |
| `chat/sante` | Santé |
| `accessoires-connectes` | Connecté |
| `accessoires-connectes/cameras` | Caméras |
| `accessoires-connectes/traceurs-gps` | Traceurs GPS |
| `accessoires-connectes/distributeurs` | Distributeurs |
| `autre` | Autre (fallback) |

### 5.2 Principe de mapping (validé)

1. Le feed envoie un **libellé marchand** (pas notre taxo).
2. On stocke une ligne dans `category_mappings` : `sourceKey` → `categoryId`.
3. Le produit ne conserve que `categoryId`.

**Champ source prioritaire** : `merchant_category` (présent à ~100 % sur Vivara **et** MaxiZoo).

**Enrichissement Vivara** : quand `merchant_category` est trop vague (`Pets`, `Garden & Leisure`), utiliser  
`merchant_product_category_path` comme clé (plus précis).

**Format de `sourceKey`**

```text
{field}:{valeur_exacte_du_feed}
```

Exemples :
- `merchant_category:VET > Chat > Urinary`
- `merchant_product_category_path:Nourriture Pour Oiseaux > Noix de coco`

### 5.3 Schéma document `category_mappings`

```json
{
  "_id": "ObjectId ou slug stable",
  "source": "awin",
  "sourceKey": "merchant_category:VET > Chat > Urinary",
  "categoryId": "chat/sante",
  "confidence": 0.9,
  "notes": "VET urinary → santé chat",
  "isActive": true
}
```

Règles runtime AwinFetcher :
1. Construire la clé la plus spécifique disponible.
2. Chercher un mapping `isActive` dans Mongo.
3. Sinon → `categoryId = "autre"` **et** upsert dans la file des non mappés (voir §5.6).

### 5.4 Rapprochement initial — MaxiZoo (`merchant_category`) — **validé 2026-08-07**

> Basée sur le top Mongo (~9.6k produits). Seed de démarrage ; l’édition courante se fait ensuite via Dashboard.

| sourceKey | categoryId proposé | conf. | n (approx.) |
|-----------|-------------------|-------|-------------|
| `merchant_category:Chien > Nourriture pour chien > Croquettes pour chiens` | `chien/nourriture` | 0.95 | 865 |
| `merchant_category:Chien > Nourriture pour chien > Nourriture humide pour chien` | `chien/nourriture` | 0.95 | 1412 |
| `merchant_category:Chien > Nourriture pour chien > Friandises et boissons` | `chien/nourriture` | 0.85 | 540 |
| `merchant_category:Chat > Nourriture pour chat > Croquettes pour chat` | `chat/nourriture` | 0.95 | 578 |
| `merchant_category:Chat > Nourriture pour chat > Nourriture humide pour chat` | `chat/nourriture` | 0.95 | 2214 |
| `merchant_category:Chat > Nourriture pour chat > Friandises` | `chat/nourriture` | 0.85 | 274 |
| `merchant_category:Chat > Hygiène et soin > Litière pour chat` | `chat/litieres` | 0.95 | 105 |
| `merchant_category:Chat > Hygiène et soin > Accessoires de litière pour chat` | `chat/litieres` | 0.8 | 36 |
| `merchant_category:Chat > Hygiène et soin > Toilette et bac à litière` | `chat/litieres` | 0.8 | 34 |
| `merchant_category:Chat > Grattoirs > Arbres à chat` | `chat/griffoirs` | 0.95 | 46 |
| `merchant_category:Chat > Grattoirs > Planches à griffer et griffoirs` | `chat/griffoirs` | 0.95 | 46 |
| `merchant_category:Chat > Jouets pour chat > *` (plusieurs) | `chat/jouets` | 0.9 | ~140 |
| `merchant_category:Chien > Aller en promenade > Colliers` | `chien/colliers-laisses` | 0.95 | 85 |
| `merchant_category:Chien > Aller en promenade > Laisses` | `chien/colliers-laisses` | 0.95 | 148 |
| `merchant_category:Chien > Aller en promenade > Harnais pour chien` | `chien/colliers-laisses` | 0.95 | 123 |
| `merchant_category:Chien > Couchages pour chien > *` | `chien/couchages` | 0.9 | ~126 |
| `merchant_category:Chien > Jouets pour chien > *` | `chien/jouets` | 0.9 | ~270 |
| `merchant_category:Chien > Entretien et hygiène > *` | `chien/hygiene` | 0.85 | ~90 |
| `merchant_category:Chien > Entraînement du chien > *` | `chien/education` | 0.85 | ~23+ |
| `merchant_category:VET > Chat > *` | `chat/sante` | 0.9 | ~350+ |
| `merchant_category:VET > Chien > *` | `chien/sante` | 0.9 | ~350+ |
| `merchant_category:Petits animaux > *` | `autre` | 0.5 | — |
| `merchant_category:Oiseaux > *` | `autre` | 0.5 | — |
| `merchant_category:Jardin et bassin > *` | `autre` | 0.5 | — |

**Exemple concret MaxiZoo**

```
Feed  → merchant_category = "VET > Chat > Urinary"
Map   → sourceKey = "merchant_category:VET > Chat > Urinary"
      → categoryId = "chat/sante"
Produit → { "categoryId": "chat/sante" }
Site  → filtre / fil d’Ariane « Chat › Santé »
```

### 5.5 Vivara — fallback path (validé)

`merchant_category` seul est **insuffisant** (`Pets`, `Garden & Leisure`).  
Utiliser `merchant_product_category_path` :

| sourceKey | categoryId | conf. | Commentaire |
|-----------|------------|-------|-------------|
| `merchant_product_category_path:Nourriture Pour Oiseaux > *` | `autre` | 0.5 | Hors taxo V1 (oiseaux) — à remapper via Dashboard si taxo étendue |
| `merchant_product_category_path:Mangeoires pour oiseaux > *` | `autre` | 0.5 | Idem |
| `merchant_category:Pets` | `autre` | 0.2 | Trop vague — ne pas s’y fier seul |
| `merchant_category:Garden & Leisure` | `autre` | 0.2 | Trop vague |

**Décision** : pas de branche oiseaux en V1 pour l’instant. Vivara hors chien/chat → `autre`, puis correction dans la file Dashboard quand on étendra la taxo ou qu’on décidera de masquer.

### 5.6 Exploitation : table vivante (validé)

Les futurs feeds grossiront `autre` si on ne peut pas éditer les mappings facilement.

| Couche | Rôle |
|--------|------|
| Mongo `category_mappings` | Source de vérité runtime |
| Mongo `category_unmatched` | `sourceKey` inconnues : `count`, `lastSeenAt`, **`productIds`** (rapprochement ops — pas sur `products`) |
| Dashboard CRUD | Créer / éditer / désactiver mappings ; traiter la file |
| Doc / seed | Contrat + import initial MaxiZoo uniquement |

**Flux**
1. Nouveau feed → `sourceKey` inconnue → produit en `autre` + upsert file (`$addToSet` du `_id` produit).
2. Admin Dashboard assigne `categoryId` → crée/active le mapping **et** `updateMany` sur les `productIds` rattachés.
3. Entrée retirée de la file. Les prochains syncs utilisent le mapping.

US backlog : [CRUD category_mappings + file des non mappés](https://app.notion.com/p/3b5361f81bbe81d38fc5d0ba9035ca44).

### 5.7 Checklist (état)

- [x] Format `sourceKey` = `{field}:{valeur}`
- [x] Priorité `merchant_category` puis fallback path Vivara
- [x] Rapprochement MaxiZoo §5.4 validé
- [x] Vivara / oiseaux → `autre` en V1 + correction via Dashboard
- [x] Friandises → `*/nourriture` (V1)
- [x] VET → `*/sante`
- [x] Édition via Dashboard (pas uniquement doc) — US créée
- [ ] Support wildcard préfixe en runtime (optionnel Phase 1.1)
- [x] Seed taxo V1 + mappings MaxiZoo (`api-amifidele`: `npm run seed:taxonomy`, 08/08/2026)
- [x] UI Dashboard CRUD mappings

---

## 6. Collections cibles

| Collection | Rôle |
|------------|------|
| `products` | Offres canoniques |
| `brands` | Marques unifiées |
| `categories` | Arbre V1 |
| `category_mappings` | Feed → `categoryId` |
| `category_unmatched` | File ops : `sourceKey` + `productIds` à reclasser |
| `history` | Optionnel : seulement si prix / stock / visibilité change |

---

## 7. Hors scope Phase 1

- Regroupement multi-offres par EAN
- AmazonFetcher (sauf POC isolé)
- Ratings Awin (vides sur les feeds actuels)
- Réécriture des anciennes catégories Mongo numériques

---

## 8. Coexistence upsert AwinFetcher ↔ éditions Dashboard

> Analyse US [Analyse coexistence upsert ↔ Dashboard](https://app.notion.com/p/3b7361f81bbe812fbacee18a0fb5d9f8) — 2026-08-12.  
> Décision : **garder `manualOverrides` sticky en Phase 1.x** ; US UI « clear override » découpée ; couche `product_edits` différée Phase 2.

### 8.1 État actuel

| Couche | Comportement |
|--------|----------------|
| AwinFetcher | `$set` large du document canonique à chaque sync (`mapAwinRowToCanonical`). Avant `$set`, `stripOverriddenFields` retire les champs flaggés dans `manualOverrides`. |
| API Dashboard (`PUT`) | `mergeManualOverrides` : si `categoryId` / `isVisible` / `name` / `description` / `brandId` change, le flag correspondant passe à `true` (sticky, jamais auto-clear). |
| Masquage auto 15j | Ne touche **pas** les produits avec `manualOverrides.isVisible: true`. |
| Reprocess mapping | `updateMany` catégorie ignore les produits avec `manualOverrides.categoryId: true`. |
| Dashboard UI | Badge « Protégé contre le feed » en lecture seule — **pas** de clear / unlock. |

Champs protégés aujourd’hui : `categoryId`, `isVisible`, `name`, `description`, `brandId`.

### 8.2 Tableau propriétaire des champs

| Champ | Propriétaire | Règle |
|-------|--------------|--------|
| `_id`, `source`, `sourceProductId`, `feedId`, `advertiserId` | **Feed** | Identité ; jamais édités côté BO (sauf création `manual`). |
| `merchant` | **Feed** | Issu de l’annonceur / feed. |
| `price.*`, `inStock`, `images.*`, `links.*`, `ean`, `unitPrice`, `packSize`, `lastSeenAt` | **Feed** | Doivent rester à jour à chaque sync. Pas d’override sticky Phase 1. |
| `updatedAt` | **Système** | Toujours rafraîchi par le sync / l’API. |
| `createdAt` | **Système** | `$setOnInsert` uniquement. |
| `name`, `description` | **Merge** | Feed par défaut ; sticky Dashboard si édité (`manualOverrides`). |
| `brandId` | **Merge** | Feed (findOrCreate) par défaut ; sticky si changé au BO. |
| `categoryId` | **Merge** | Mapping feed → taxo par défaut ; sticky si classé au BO (y compris hors reprocess file). |
| `isVisible` | **Merge** | Sync remet `true` si présent dans le feed ; masquage auto 15j ; sticky si admin a forcé. |
| `manualOverrides` | **Dashboard** | Métadonnée de protection ; jamais écrite par AwinFetcher. |

### 8.3 Limites de `manualOverrides` sticky

1. **Pas de clear UI** — une fois flaggé, le champ reste protégé jusqu’à intervention manuelle Mongo / future US.
2. **Pas de granularité prix / stock / images** — volontaire : ces champs restent feed-owned (comparateur à jour).
3. **Pas de diff** — on ne sait pas *quelle* valeur éditoriale vs feed (seulement « protégé »).
4. **Produits `source: manual`** — pas d’upsert Awin ; overrides inutiles mais inoffensifs.
5. **Nom / description feed qui s’améliorent** — si override sticky, on ne récupère jamais la version feed (trade-off accepté Phase 1).

### 8.4 Alternatives évaluées

| Option | Verdict Phase 1 |
|--------|-----------------|
| **`manualOverrides` sticky (actuel)** | **Retenu** — simple, déjà en prod, couvre les cas éditoriaux critiques. |
| Verrou produit entier (`locked: true`) | Trop grossier : bloquerait prix/stock/images. |
| `$setOnInsert` sélectif seul | Insuffisant : ne protège pas les updates sync. |
| Couche `product_edits` (overlay) | Propre à long terme, mais coût élevé (lecture merge, UI, sync). **Phase 2**. |
| Pipeline update Mongo complexe | Surdimensionné tant que le volume d’éditions BO reste faible. |

### 8.5 Cas limites (règles figées)

| Cas | Règle |
|-----|--------|
| Masquage auto 15j vs override `isVisible` | Override gagne : produit reste visible (ou masqué) selon le BO. |
| Reprocess mapping vs override `categoryId` | Override gagne : la file/mapping ne réécrit pas. |
| Produit créé manuellement (`source: manual`) | Pas d’AwinFetcher ; CRUD Dashboard libre. |
| Champ feed non overridable modifié au BO (ex. prix) | Non supporté Phase 1 : le prochain sync **réécrase** (comportement voulu). |

### 8.6 Recommandation & découpage

- **Phase 1.x (maintenir)** : ownership ci-dessus + `manualOverrides` pour les 5 champs merge.
- **US d’implémentation suivante (petite)** : Dashboard — clear / unlock par champ (retire le flag → prochain sync reprend la main).
- **Phase 2** : si Amazon + volume d’éditions ↑ → évaluer `product_edits` ou merge à la lecture ; pas avant.

---

## 9. Prochaines étapes

1. ~~Valider ce doc + table `category_mappings`~~ ✅
2. ~~Seed MaxiZoo §5.4 + taxo V1~~ ✅
3. ~~Adapter AwinFetcher (contrat canonique + resolve catégorie)~~ ✅
4. ~~Livrer US Dashboard/API : CRUD mappings + file non mappés~~ ✅
5. ~~Migrer products (purge dump plat)~~ **annulée** — reimport
6. ~~Adapter API + projections listing~~ ✅
7. ~~Adapter le site au contrat~~ ✅
8. ~~Ops : colonnes Awin minimales~~ ✅
9. ~~Couper historique sync + index Mongo listing~~ ✅ (08/2026)
10. **Prochaine** — US UI clear `manualOverrides` (Phase 1.x) ; puis BFF clé API / schéma marques

---

## Journal

| Date / heure (Europe/Paris) | Changement |
|-----------------------------|------------|
| 2026-08-12 16:00 | §8 Coexistence upsert ↔ Dashboard : ownership champs, limites sticky, reco Phase 1.x vs Phase 2. |
| 2026-08-09 20:15 | US migration products annulée (reimport). AwinFetcher : download limité aux colonnes canoniques. |
| 2026-08-09 17:30 | `manualOverrides` : éditions Dashboard protégées contre l’upsert AwinFetcher (categoryId, isVisible, name, description, brandId) |
| 2026-08-09 13:15 | `category_unmatched.productIds` + reprocess immédiat à l’assignation Dashboard (1 correction → N produits) |
| 2026-08-09 11:30 | API CRUD `category-mappings` + file unmatched ; UI Dashboard `/admin/category-mappings` |
| 2026-08-08 15:00 | Seed taxo V1 (20) + 138 mappings ; AwinFetcher écriture canonique + resolve catégories |
| 2026-08-07 20:54 | Validation rapprochement MaxiZoo. Ops mappings = Mongo + Dashboard + file `autre`. US backlog créée. |
| 2026-08-07 20:41 | `_id` = `{feedId}_{productId}` + `source`. Ajout `unitPrice` / `packSize`. Abandon `awin:…:…`. |
| 2026-08-07 20:07 | Création doc + analyse CSV (première proposition). |
| 2026-08-06 | Principes / taxo V1 figés dans Décisions data (process). |
