# Chibugbog POS — Kainan Counter

> *Point of Sale system for Chibugbog, the Filipino Boodle Fight restaurant.*

A lightweight, static POS system built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, deployable directly to GitHub Pages.

---

## ⚡ Live Link - CHIBUGBOG POS
🌐 **https://emil-yan.github.io/ESER_POINT-OF-SALES-SYSTEM-PROJECT/**

---

## ⚡ Live Link - CHIBUGBOG Landing Page with 2D Game
🌐 **https://emil-yan.github.io/ESER_DEVELOPING-A-RESTAURANT-LANDING-PAGE-WITH-INTERACTIVE-GAME---ACTIVITY/**

---

## Folder Structure

---

```
chibugbog-pos/
├── index.html       ← HTML structure and layout only
├── css/
│   └── style.css    ← All styles: design tokens, components, responsive rules
├── js/
│   └── pos.js       ← All POS logic: menu data, order state, payment, toasts
└── README.md
```

Each file has a single responsibility. To change the look, edit `css/style.css`. To change menu items or business logic, edit `js/pos.js`. The HTML in `index.html` is never touched for routine updates.

---

## Features

- **Menu panel** — dynamically built from the `MENU` data object in `pos.js`; add or remove items by editing one place
- **Order list** — live-updating with slide-in animation; supports quantity adjustment (+ / −) and individual item removal
- **Running total** — item count and total recalculate on every change
- **Payment** — cash input with real-time change calculation; Pay! button stays disabled until sufficient cash is entered
- **Toast notifications** — slide-up feedback on item add and successful payment
- **Responsive** — single-column stacked layout on screens narrower than 780 px

---

## Menu Items

| Item | Price |
|---|---|
| 🍖 Lechon Paksiw Bowl | ₱99 |
| 🦐 Sugpo sa Gata | ₱149 |
| 🐟 Inihaw na Bangus | ₱129 |
| 🍳 Tapsilog Royale | ₱119 |
| 🥘 Kare-Kare Pata | ₱169 |
| 🍗 Adobo Flakes Rice | ₱89 |
| 🥩 Crispy Bagnet | ₱159 |
| 🐷 Longsilog Hamonado | ₱109 |
| 🥤 Salabat Lemonade | ₱59 |
| 🍹 Buko Pandan Shake | ₱79 |

To add a new item, open `js/pos.js` and add an entry to the `MENU` constant:

```js
const MENU = {
  // existing items...
  'Sinigang na Baboy': { price: 139, image: 'images/your-photo.jpg' },
};
```

No other files need to change.

---

## Design System

Defined as CSS custom properties in `css/style.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0d0702` | Page background |
| `--surface` | `#1a0e05` | Panel backgrounds |
| `--surface2` | `#2a1505` | Card / input backgrounds |
| `--border` | `#3a2010` | All borders |
| `--accent` | `#e8a020` | Chibugbog gold — primary accent |
| `--accent2` | `#c4956a` | Warm tan — secondary / hover glow |
| `--green` | `#6dbb30` | Change amount indicator |
| `--text` | `#f5e6c8` | Cream — primary text |
| `--muted` | `#7a5530` | Labels, hints, placeholders |

**Fonts** (loaded from Google Fonts):
- **Bebas Neue** — display headings, item names, totals, Pay button
- **Lora** *(italic)* — taglines, panel subtitles, prices, empty state
- **Barlow Condensed** — UI body text, labels

---

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to the `main` branch, root `/`
4. GitHub will publish it at `https://<username>.github.io/<repo>/`

No build step, no dependencies, no `node_modules`.

---

## Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, flexbox, keyframe animations
- **Vanilla JavaScript** — DOM manipulation, event listeners, no libraries

*Part of the Chibugbog web project — see the restaurant landing page repo for the full site and Bugbog Kainan game.*
