# Carnet de marchés

Blog personnel : notes quotidiennes de lecture de la presse, analyses d'entreprises, et tableau de bord des marchés
(BTC, ETH, SOL, CAC 40, Euro Stoxx 50, DAX, S&P 500, Nasdaq, Dow Jones, Nikkei, EUR/USD, or, Brent) avec un fil d'actualités.

Site statique [Astro](https://astro.build), hébergé **gratuitement** sur GitHub Pages. **Aucune clé d'API n'est nécessaire.**

## Sources de données

| Donnée | Source | Clé ? | Fraîcheur |
|---|---|---|---|
| BTC, ETH, SOL | API publique CoinGecko | Non | En direct dans le navigateur, toutes les 60 s |
| Indices, devises, matières premières, cours des actions analysées | Yahoo Finance (API chart) | Non | À chaque reconstruction (toutes les heures en semaine) |
| Actualités | Flux RSS : Le Figaro, BFM Bourse, Le Monde, Investing.com, CNBC, MarketWatch, CoinDesk | Non | À chaque reconstruction |

Tout se règle dans `src/config.ts` : liste des cryptos, des indices, du bandeau, des flux RSS, devise (EUR/USD).
Si une source est en panne, le site se construit quand même et affiche « — ».

## Mise en ligne (une seule fois, ~5 min)

1. Créez un dépôt sur GitHub (ex. `carnet-marches`) et poussez ce dossier sur la branche `main`.
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
3. Le site est publié à `https://<votre-pseudo>.github.io/carnet-marches/` quelques minutes après chaque modification,
   puis reconstruit automatiquement toutes les heures pour rafraîchir indices et actualités.

## Écrire une note ou une analyse

**Option 1 – éditeur en ligne (recommandé)** : connectez-vous sur [app.pagescms.org](https://app.pagescms.org) avec GitHub,
ouvrez le dépôt : les menus « Notes du jour » et « Analyses » apparaissent avec un formulaire. Enregistrer = publier.
Fonctionne aussi sur téléphone.

**Option 2 – fichier Markdown** : sur GitHub, « Add file » dans `src/content/notes/` (ou `analyses/`), nommé par ex.
`2026-11-03-bce-et-inflation.md` :

```markdown
---
title: "BCE, inflation et luxe"
date: 2026-11-03
sources: ["Les Echos", "Le Figaro"]
tags: ["bce", "luxe"]
resume: "Ce que je retiens de la presse ce matin."
---

Le texte de la note en Markdown…
```

Pour une analyse, ajoutez `entreprise`, `ticker` (symbole Yahoo : `MC.PA`, `AAPL`, `ASML.AS`…), et éventuellement
`secteur`, `avis` (Achat, Renforcer, Conserver, Alléger, Vendre, À surveiller) et `objectif` (cours cible) : le cours,
le graphique 3 mois et le potentiel s'affichent tout seuls. `brouillon: true` cache un article.

Les deux fichiers d'exemple (`src/content/notes/2026-11-02-premiere-note.md`, `src/content/analyses/exemple-analyse.md`)
sont à supprimer quand vous publiez vos premiers vrais articles.

## En local

```bash
npm install
npm run dev     # http://localhost:4321
```
