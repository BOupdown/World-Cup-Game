<div align="center">

# 🏆 World Cup Quiz 2026

### Un mini-jeu mobile addictif sur la Coupe du Monde, inspiré de Block Blast & Tinder

[![Jouer en ligne](https://img.shields.io/badge/▶_JOUER_MAINTENANT-00A550?style=for-the-badge&logoColor=white)](https://boupdown.github.io/World-Cup-Game/)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)

<!-- 👉 Remplace cette ligne par un GIF du gameplay : ![Gameplay](docs/demo.gif) -->

</div>

---

## 🎮 Le concept

Un **quiz football en mode survie infini**. Réponds le plus vite possible : plus tu es rapide, plus tu marques. Enchaîne les bonnes réponses pour activer des multiplicateurs, et bats ton record. Une seule erreur — ou le chrono à zéro — et c'est terminé.

L'expérience est pensée **100% mobile-first** : pas de bouton « question suivante », tout s'enchaîne automatiquement avec feedback haptique, sons et animations fluides.

## ✨ Fonctionnalités

- ♾️ **Mode survie infini** — les questions se recyclent sans limite
- ⚡ **Score de vitesse** — un timer de 10s par question, plus tu réponds vite plus tu gagnes de points
- 🔥 **Multiplicateurs de série** — 3 bonnes réponses → ×2, 6 → ×3
- 🏆 **Meilleur score persistant** — sauvegardé en `localStorage`
- 🎵 **Bande-son générée en temps réel** via le **Web Audio API** — musique, effets et transitions, **zéro fichier audio**
- 📚 **Mode Apprendre** — fiches interactives sur les 23 éditions de la Coupe du Monde (1930 → 2026)
- 📳 **Feedback haptique** sur mobile (vibrations)
- 🎨 **Direction artistique** aux couleurs de la Coupe du Monde (vert / jaune / rouge), trophée FIFA dessiné en SVG

## 🛠️ Stack technique

| Outil | Usage |
|-------|-------|
| **React 18** | UI et gestion d'état |
| **Vite** | Build & dev server |
| **Framer Motion** | Animations, transitions de cartes, micro-interactions |
| **Web Audio API** | Synthèse audio temps réel (musique + SFX) |
| **localStorage** | Persistance du meilleur score |
| **GitHub Actions + Pages** | Déploiement continu |

> 💡 **Le détail technique dont je suis le plus fier :** toute la bande-son est **synthétisée en code** (oscillateurs, enveloppes, réverb) — aucun MP3 n'est chargé. La musique de fond est une boucle mélodique générée note par note.

## 🚀 Lancer en local

```bash
git clone https://github.com/BOupdown/World-Cup-Game.git
cd World-Cup-Game
npm install
npm run dev
```

## 📁 Architecture

```
src/
├── App.jsx              # Routing entre écrans + état global
├── screens/
│   ├── HomeScreen.jsx       # Accueil (trophée SVG, boutons, options)
│   ├── GameScreen.jsx       # Gameplay (timer, score, multiplicateurs)
│   ├── GameOverScreen.jsx   # Score final, record, rangs
│   └── LearnScreen.jsx      # Fiches des 23 éditions
├── components/         # Particules, barres de progression, étoiles
├── hooks/
│   ├── useSound.js          # Moteur audio Web Audio API
│   └── useHaptic.js         # Vibrations mobile
└── data/               # Questions du quiz + données des Coupes du Monde
```

---

<div align="center">

Développé par **[Omar Benzeroual](https://www.linkedin.com/in/omar-benzeroual-50898921b/)**

</div>
