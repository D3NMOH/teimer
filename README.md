<p align="center">
  <img src="src/assets/teimer.svg" width="300" alt="Teimer Logo">
</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=for-the-badge&logo=vue.js" alt="Vue.js"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite" alt="Vite"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  <a href="https://pinia.vuejs.org/"><img src="https://img.shields.io/badge/Pinia-2.x-ffe467?style=for-the-badge&logo=pinia" alt="Pinia"></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-Backend-fbf0df?style=for-the-badge&logo=bun" alt="Bun"></a>
</p>

<p align="center">
  <strong>Teimer</strong> is a high-performance, aesthetically pleasing timer application designed for productivity, fitness, and complex workflows. It doesn't just track time; it manages your momentum through intelligent <strong>Timer Chains</strong>.
</p>

---

## ✨ Key Features

- ⛓️ **Timer Chains**: Create sequences of timers that follow each other automatically. Perfect for HIIT workouts, Pomodoro, or multi-step cooking.
- 🎨 **Dynamic Theme Engine**:
  - Adaptive Dark and Light modes.
  - Curated color presets.
  - **Custom RGB/Hex Color Picker** with automatic harmonic shade generation.
- 📱 **Adaptive UI**:
  - **Focus Mode**: A stunningly large vertical/horizontal display for single timers.
  - **Grid Mode**: A flexible, responsive grid for managing multiple timers at once.
- 🌍 **Internationalization**: Full support for English, Russian, Ukrainian, and German.
- 💾 **Cloud Synchronization**: Your timers and chain sequences are securely backed up and synced across all your devices via a custom **Bun + SQLite** backend.
- 🔐 **Instant Auth**: Fast and secure authentication with email verification and password reset to keep your data private.
- ⚡ **Performance**: Built with Vite and Vue 3 for near-instant load times and zero-lag interactions.

---

## 🚀 Tech Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Backend**: [Bun](https://bun.sh/) + [Hono](https://hono.dev/) + [bun:sqlite](https://bun.sh/docs/api/sqlite)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with modern Flexbox & Grid layouts and `clamp()` for fluid typography.
- **Icons**: [Vue Icons](https://github.com/KalimahApps/vue-icons)
- **Localization**: [Vue I18n](https://vue-i18n.intlify.dev/)

---

## 🛠️ Project Setup

### Installation

```bash
# Using npm
npm install

# Using bun
bun install
```

### Development

```bash
# Using npm
npm run dev

# Using bun
bun dev
```

### Production

```bash
# Using npm
npm run build

# Using bun
bun run build
```

---

## 🎨 Aesthetic Design Principles

Teimer follows a **Premium Minimalist** design philosophy:

- **Glassmorphism**: Subtle backgrounds and blur effects for depth.
- **Micro-interactions**: Spring-based animations and smooth transitions.
- **Dynamic Letter Spacing**: Typography that adapts to the size of your timer for maximum readability.
- **Color Harmony**: Accent colors that propagate through the entire UI, from buttons to progress bars.

---

## 📄 License

Created with ❤️ by [d3nmoh](https://github.com/d3nmoh).
