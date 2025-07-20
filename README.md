# QCM-PLUS Client

## Rôle dans l'architecture

### Présentation

client-qcm-plus est l’interface utilisateur de l’application QCM-PLUS, développée en React + TypeScript avec Vite et TailwindCSS.

Elle consomme l’API REST exposée par le backend (back-qcm-plus) et s’appuie sur les règles métier du domaine pur (logic-qcm-plus).

### Responsabilités

- Interface interactive de réponse aux QCM
- Navigation entre les écrans (React Router DOM)
- Affichage des résultats, feedback utilisateur
- Communication avec l’API backend (Axios)
- Application des règles métier (logic-qcm-plus)
- Design UI avec TailwindCSS + PrimeReact

### Architecture hexagonale

```
        ┌──────────────┐
        │    CLIENT    │   (React + Vite)
        └──────┬───────┘
               │ HTTP requests
               ▼
        ┌──────────────┐
        │    BACKEND   │   (API REST Express)
        └──────┬───────┘
               │ uses
               ▼
        ┌──────────────┐
        │    LOGIC     │   (Domaine métier pur)
        └──────────────┘
```

---

## Installation

Cloner le projet puis installer les dépendances :

```bash
git clone https://github.com/MarysaR/client-qcm-plus.git

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
npm link logic-qcm-plus
```

---

## Démarrage de l'application

```bash
npm run dev
```

Cela lance le serveur Vite à l'adresse :
[http://localhost:5173](http://localhost:5173)

---

## Scripts disponibles

### Développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

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

### Créer une branche avec convention

```bash
npm run create:branch
```

---

## Stack technique

### Dépendances principales

- **React 19.1.0** (avec JSX et TypeScript)
- **React Router DOM 7.7.0** pour la navigation
- **Vite 7.0.1** pour le bundling et le développement
- **TailwindCSS 4.1.11** pour le style
- **PrimeReact 10.9.6** pour les composants UI (tableaux, boutons, etc.)
- **PrimeIcons 7.0.0** pour les icônes
- **Axios 1.10.0** pour les appels HTTP

### Outils de développement

- **TypeScript 5.8.3** pour le typage statique
- **ESLint 9.30.1 + Prettier 3.6.2** pour la qualité du code
- **PostCSS 8.5.6 + Autoprefixer 10.4.21** pour le CSS
- **@vitejs/plugin-react 4.6.0** pour l'intégration React/Vite

---

## Docker

### Build de l’image

```bash
npm run build
```

Puis, dans le dossier du projet :

```bash
docker build -t client-qcm-plus .
```

### Lancer le conteneur

```bash
docker run --rm -p 5173:5173 client-qcm-plus
```

> L'application est alors accessible à l'adresse [http://localhost:5173](http://localhost:5173)

## Bonnes pratiques

- Utiliser `npm run create:branch` pour créer des branches valides
- Exécuter `npm run lint` régulièrement
- Utiliser `npm run format` avant chaque commit
- Vérifier le bon lien avec le package `logic-qcm-plus` (`npm link logic-qcm-plus`)
- Utiliser `npm run create:branch` pour créer des branches avec convention
- Séparer clairement logique métier et affichage
- Ne jamais manipuler l'état métier sans passer par `logic-qcm-plus`

---
