```markdown
# QCM-PLUS Client

## Rôle dans l'architecture

Ce package contient la couche **interface utilisateur** de l’application QCM-PLUS.

### Responsabilités

- Interface intuitive pour répondre à des QCM
- Affichage des résultats et feedback utilisateur
- Communication avec l’API REST backend (via axios)
- Intégration des règles métier partagées (via `logic-qcm-plus`)
- Gestion du style via TailwindCSS

### Architecture hexagonale
```

```
        ┌──────────────┐
        │    CLIENT    │   (React + Vite)
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │    LOGIC     │   (Domaine métier pur)
        └──────────────┘
               │
               ▼
        ┌──────────────┐
        │    BACKEND   │   (API REST Express)
        └──────────────┘
```

---

## Installation

Cloner le projet puis installer les dépendances :

```bash
git clone https://github.com/ton-org/client-qcm-plus.git

cd client-qcm-plus

npm install
```

---

## Lier avec la logique métier (`logic`)

Ce projet dépend du package `logic-qcm-plus`. Pour le relier localement :

### 1. Dans le dossier `logic-qcm-plus` :

```bash
npm link
```

### 2. Puis dans le dossier `client-qcm-plus` :

```bash
npm link logic
```

---

## Démarrage de l’application

```bash
npm run dev
```

Cela lance le serveur Vite à l'adresse :
[http://localhost:5173](http://localhost:5173)

---

## Scripts disponibles

### Analyse du code (lint)

```bash
npm run lint
```

### Correction automatique du lint

```bash
npm run lint:fix
```

### Vérification du formatage

```bash
npm run format:check
```

### Formatage automatique avec Prettier

```bash
npm run format
```

---

## Stack technique

- **React** (avec JSX et TypeScript)
- **Vite** pour le bundling et le développement
- **TailwindCSS** pour le style
- **PrimeReact** pour les composants UI (tableaux, boutons, etc.)
- **Axios** pour les appels HTTP
- **ESLint + Prettier** pour la qualité du code

---

## Bonnes pratiques

- Exécuter `npm run lint` régulièrement
- Utiliser `npm run format` avant chaque commit
- Vérifier le bon lien avec le package `logic` (`npm link logic`)
- Séparer clairement logique métier et affichage
- Ne jamais manipuler l’état métier sans passer par `logic`

---
