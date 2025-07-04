```markdown
# QCM-PLUS Client

## Rôle dans l'architecture

Ce package contient la couche **interface utilisateur** de l’application QCM-PLUS.

### Responsabilités

- UI/UX : pages et composants React
- Communication avec l’API REST backend (via axios)
- Utilisation des types et validations partagés (logic-qcm-plus)
- Gestion du style via TailwindCSS

### Architecture hexagonale

```

```
            ┌─────────────┐ ┌──────────────┐
            │    CLIENT    ─────▶ BACK
            │    (React)        (Express)
            └─────────────┘ └─────┬────────┘
                          │
                          │
                          ▼
                  ┌─────────────────┐
                  │     LOGIC
                  │   (Métier pur)
                  └─────────────────┘
```

````

## Installation

```bash
npm install
````

## Scripts disponibles

### Lancer le linter

```bash
npm run lint
```

Analyse les fichiers `.ts` et `.tsx` dans `src/` avec ESLint.

---

### Corriger automatiquement les erreurs de lint

```bash
npm run lint:fix
```

---

### Vérifier la conformité du formatage

```bash
npm run format:check
```

Vérifie que les fichiers `.ts` et `.tsx` respectent le format Prettier.

---

### Formater automatiquement le code

```bash
npm run format
```

Applique le format Prettier aux fichiers `.ts` et `.tsx`.

---

## Configuration technique

* React avec TypeScript
* TailwindCSS pour le style
* Vite comme bundler et serveur de développement
* ESLint configuré avec les plugins React, TypeScript et Prettier
* Axios pour les requêtes API

## Bonnes pratiques

* Exécuter régulièrement `npm run lint` pour détecter les erreurs de code
* Utiliser `npm run lint:fix` pour corriger rapidement
* Formater le code avec `npm run format` avant chaque commit

---
