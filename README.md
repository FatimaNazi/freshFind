# FreshFind 🌿

> **Discover Local Markets & Fresh Seasonal Produce Across Karachi**  
> Built for the **Aptech TechWiz Global Tech Competition** &bull; Track: *Web Innovation Unleashed*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Live Demo & Pages](#-live-demo--pages)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Datasets](#-datasets)
- [Meet the Project Team](#-meet-the-project-team)
- [Competition Context](#-competition-context)
- [License](#-license)

---

## 🌟 Overview

**FreshFind** is an intuitive, fast, and responsive web platform designed to connect consumers with authentic local farmers' markets and fresh seasonal agricultural produce across Karachi, Sindh.

By combining real-time geolocation, interactive maps, nutritional guidance, seasonal crop calendars, and an AI-powered conversational assistant, FreshFind empowers families, chefs, and health-conscious shoppers to discover local vendors, shop seasonally, and support regional farmers.

---

## ✨ Key Features

### 1. 🗺️ Interactive Farmers Market Explorer
- **Interactive Leaflet / OpenStreetMap**: Detailed view of major Karachi market hubs (DHA, Clifton, Gulshan-e-Iqbal, Bahadurabad, Tariq Road, Saddar, North Nazimabad, Malir, Korangi).
- **Haversine Distance Calculator**: Computes precise distance (in kilometers) from user's current GPS coordinates to each market.
- **Filtering & Search**: Instant real-time filtering by zone, weekday, timing, and produce categories.
- **Turn-by-Turn Navigation**: One-click deep links to Google Maps directions.

### 2. 🥦 Produce Guide & Seasonal Calendar
- **Extensive Catalog**: Detailed breakdown of fresh vegetables, fruits, dairy, and spices.
- **Seasonal Availability Engine**: Month-by-month tracking of peak harvest seasons (Winter, Spring, Summer, Autumn) in Sindh.
- **Nutritional Profiles & Storage Tips**: Health benefits, shelf-life advice, and culinary suggestions for each item.
- **Related Produce Recommendations**: Dynamic item cross-linking on produce detail pages.

### 3. 🤖 Intelligent Assistant (FreshFind Chatbot)
- Built-in floating chat assistant with simulated NLP and instant suggestions.
- Answers user queries regarding market hours, cheapest locations, seasonal produce, and platform navigation.

### 4. ⭐ Bookmarks & Personal Notes
- **Persistent Bookmarks**: Save favorite markets and produce items locally (`localStorage`).
- **Interactive Notes Modal**: Add custom personal shopping reminders and notes with tags.

### 5. 📤 Export & Social Sharing
- **Document Export**: Download customized market information sheets and produce guides as formatted text files.
- **Social Sharing**: Share market cards directly via WhatsApp, Twitter, Facebook, or copy links to clipboard.

### 6. 🔐 Simulated Authentication System
- Clean, responsive modal dialog for **Sign In** and **Sign Up**.
- Client-side form validation, password visibility toggles, and session state persistence.

---

## 🧭 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero section, quick area finder, highlights, seasonal banner, and feature previews |
| `/markets` | **Markets Directory** | Searchable grid of Karachi markets with filters and bookmarks |
| `/market/:id` | **Market Detail** | Full market profile, interactive Leaflet map, available produce, and export options |
| `/produce` | **Produce Guide** | Catalog of fruits, vegetables, dairy, and spices |
| `/produce/:id` | **Produce Detail** | Nutrition facts, storage guide, seasonal status, and related produce cards |
| `/seasonal` | **Seasonal Calendar** | Seasonal crop matrix across Karachi and Sindh farming belts |
| `/bookmarks` | **Bookmarks** | Saved markets, saved produce items, and personal notes |
| `/about` | **About Us** | Mission statement, platform background, and the 5-member project team |
| `/contact` | **Contact** | Inquiry form, interactive contact location, FAQ accordion |
| `/feedback` | **Feedback** | User rating submission, suggestions, and feedback reviews |

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool / Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/) (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`)
- **UI Framework & Icons**: [Bootstrap 5.3](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Mapping & Geodata**: [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`, `useContext`) + React Context API (`ModalContext`)
- **Storage**: Browser `localStorage` (bookmarks, personal notes, auth state)
- **Styling**: Modern CSS3 custom properties (design tokens, glassmorphism, responsive cards)

---

## 📂 Project Architecture

```
freshfind/
├── public/
│   └── assets/
│       ├── Images/               # Optimized produce and market imagery
│       │   └── team/             # Team member high-resolution headshots
│       ├── markets.json          # Market coordinates, timings, and produce list
│       ├── products.json         # Produce nutritional details and categories
│       ├── seasonal.json         # Seasonal calendar metadata
│       └── chatbot-data.json     # Chatbot intents and predefined responses
├── src/
│   ├── components/               # Modular UI components
│   │   ├── Navbar.jsx            # Responsive navigation bar with search & auth buttons
│   │   ├── Footer.jsx            # Balanced multi-column footer with live clock & branding
│   │   ├── MarketCard.jsx        # Reusable market card with distance & bookmarking
│   │   ├── ProduceCard.jsx       # Produce showcase card
│   │   ├── SeasonalCard.jsx      # Seasonal produce preview card
│   │   ├── Chatbot.jsx           # Floating interactive AI assistant
│   │   ├── AuthModal.jsx         # Login & registration modal with validation
│   │   ├── ShareModal.jsx        # Social media & link sharing dialog
│   │   ├── NoteModal.jsx         # Custom shopping notes dialog
│   │   ├── Breadcrumb.jsx        # Dynamic breadcrumb navigation
│   │   ├── ScrollToTop.jsx       # Route change scroll reset
│   │   └── Toast.jsx             # Notification toasts
│   ├── context/
│   │   └── ModalContext.jsx      # Global modal state provider (Auth, Share, Notes)
│   ├── pages/                    # 10 application page views
│   │   ├── Home.jsx
│   │   ├── Markets.jsx
│   │   ├── MarketDetail.jsx
│   │   ├── Produce.jsx
│   │   ├── ProduceDetail.jsx
│   │   ├── Seasonal.jsx
│   │   ├── SeasonalDetail.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Feedback.jsx
│   ├── styles/
│   │   └── style.css             # Unified CSS styles and theme variables
│   ├── utils/
│   │   ├── distance.js           # Haversine formula calculation
│   │   ├── exportDoc.js          # File download utilities
│   │   ├── produceMeta.js        # Produce category mapping
│   │   └── storage.js           # LocalStorage helpers
│   ├── App.jsx                   # Root application layout
│   └── main.jsx                  # React application entry point
├── index.html                    # Root HTML template with Leaflet & Bootstrap CDN
├── package.json                  # Dependencies and scripts
└── vite.config.js                # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FatimaNazi/freshFind.git
   cd freshFind
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: `http://localhost:3000` (or the port specified by Vite).

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static assets will be output to the `dist/` directory.

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 👥 Meet the Project Team

FreshFind was developed by a team of passionate developers for the **Aptech TechWiz Global Tech Competition**:

| Member | Role | Key Contributions |
|---|---|---|
| **Noman Ali Qazi** | **Project Manager** | Project architecture, milestones, requirements alignment, and user journey strategy. |
| **Sufiyan ALi** | **Frontend Developer** | React migration, responsive layout architecture, search filtering, and state management. |
| **Abdul Rehman** | **UI/UX Designer** | Visual branding, color token system, component hierarchies, and interactive modals. |
| **Abdul Basit** | **Analyzer (Data Architect)** | Geodata structuring, market coordinate validation, and Haversine distance integration. |
| **Shahbaz Khan** | **Content & Research** | Agricultural seasonal crop research in Sindh, produce taxonomy, and assistant Q&A datasets. |

---

## 🏆 Competition Context

This project was built following the requirements outlined in the **Aptech TechWiz Global Tech Competition** under the **Web Innovation Unleashed** category. It represents a complete client-side Single Page Application (SPA) designed to solve real-world community access to fresh food and sustainable agriculture.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
