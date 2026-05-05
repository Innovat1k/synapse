# 💼 Synapse: Skill Tracker - Link Your Skills

> A modern web app built with **React & Supabase** to **define, link, track, and visualize** your skills and learning progression.  
> _Helping users connect their learning journey with clarity and insight._

---

## 🧭 Table of Contents

- [📝 Description](#-description)
- [✨ Features](#-features)
- [🌐 Offline Support](#-offline-support)
- [🔧 Technologies Used](#-technologies-used)
- [📦 Installation & Usage](#-installation--usage)
- [🔐 Environment Variables](#-environment-variables)
- [🗂️ Project Structure](#-project-structure)
- [🧱 Roadmap](#-roadmap)
- [🤝 Contributions](#-contributions)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## 📝 Description

**Synapse** is a personal skill tracker that lets users:

- Create and manage skills
- **Link related skills** (the core “Synapse” feature)
- Log progress and activities
- Visualize learning through interactive charts

The goal is to build a **solid, intuitive, and visually appealing web app**, while showcasing full-stack development skills using modern tools: **React**, **Supabase**, **Tailwind CSS**, and data visualization libraries.

---

## ✨ Features

- ✅ **Authentication & Security:** Sign In / Sign Up / Logout flows completed
- ✅ **UX Polish:** Custom form validation + **Framer Motion** animations
- ✅ **Protected routes:** Secure access to main app
- ✅ **CRUD Skills:** Create, Read, Update, Delete skills (name, category, level 1–5)
- ✅ **Linking Skills:** Define dependencies & related skills (graph-style relationships)
- ✅ **Log activity** (time spent, sessions) to track effort
- ✅ **Dashboard** with progress charts & activity timelines (6 interactive widgets)
- ✅ **Offline UX:** Network status indicator + disabled write actions when offline
- ✅ **Responsive Design:** Mobile-first layout (filters stack, buttons adapt)
- ✅ **Empty States:** 6 standardized widgets with hover animations (Framer Motion)
- ✅ **Error Handling:** Clear feedback for Supabase errors + real-time form validation
- ✅ **Global State:** Jotai atoms for network status + UI flags
- ✅ **Testing:** Vitest + React Testing Library (hooks + components)
- ✅ **Data Management:** User data export and format

---

## 🌐 Offline Support

Synapse detects network status and adapts the UI accordingly:

- 📶 **Network Indicator**: Banner appears when offline (top-center, animated)
- 🔒 **Write Actions Disabled**: Add/Edit/Delete/Log buttons are disabled when offline
- 👁️ **Read Actions Active**: Navigation, filters, and view operations remain functional
- ♻️ **Auto-Retry**: React Query automatically retries failed requests when back online

> Note: Full offline caching (service worker) is planned for v1.1.

---

## 🔧 Technologies Used

| **Frontend** | React 19 + Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **State Management** | Jotai (atoms) + React Query (server state) |
| **Backend & Auth** | Supabase (Auth + Postgres + RLS) |
| **Routing** | React Router DOM v7 |
| **Charts/Graphs** | React Flow |
| **Testing** | Vitest + React Testing Library + userEvent + Mock Service Worker for integration tests |
| **Icons** | React Icons (Lucide) |
| **Fonts** | Sora (@fontsource/sora) |

---

## 📦 Installation & Usage

```bash
# 1. Clone the repository
git clone https://github.com/Innovat1k/synapse.git
cd synapse

# 2. Install dependencies
npm install

# 3. Run the app in development mode
npm run dev

# 4. Build for production
npm run build
```

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```bash
VITE_API_KEY=<your_api_key>
VITE_BASE_URL=<your_supabase_url>
```

> Replace with your own Supabase project keys.

---

## 🗂️ Project Structure

```bash
src/
├── atoms/                  # Jotai atoms (global state: network, UI flags)
├── pages/                  # App pages by feature
│   ├── UserAuthPage/       # Authentication (login/signup)
│   │   ├── components/     # Page-specific UI components
│   │   └── hooks/          # Auth hooks (form/API handling)
│   ├── DashboardPage/      # Main dashboard
│       ├── components/     # Widgets, charts, filters
│       └── hooks/          # Data fetching + state logic
├── features/               # Feature-based modules (skills, activities, tracks)
│   ├── skills/
│   ├── activities/
│   └── tracks/
├── services/               # Supabase API calls + business logic
├── shared/
│   ├── components/
│   │   ├── ui/             # Primitives: Button, Card, Modal, Loader
│   │   ├── layout/         # Header, NavBar, Sidebar
│   │   └── utils/          # NetworkStatus, ScrollToTop, Fallback
│   ├── hooks/              # Reusable hooks (useNetworkStatus, useIsOnline)
│   ├── utils/              # Helpers, formatters, validators
│   └── __tests__/          # Test utilities + global mocks
├── App.jsx                 # Main entry + providers + NetworkStatus
└── main.jsx                # Bootstrap + font imports
```

---

## 🗺️ Roadmap

Planned features and improvements are listed in [ROADMAP.md](./ROADMAP.md).

---

## 🤝 Contributions

🙅‍♂️ **No direct contributions** (pull requests) are accepted at this time.

You can still:

- Open issues for bugs or feature requests
- Share feedback or ideas via GitHub Discussions
- Reach out on social media or by email

Thanks for your interest and support!

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to **fork, modify, and use** it for your own projects, but **please do not submit pull requests**.

See the [LICENSE](./LICENSE) file for full details.

---

## 👤 Author

**Heïdi Al Ihmid Jeremia** – [Innovat1k](https://github.com/Innovat1k)
Open to **collaboration, feedback, or freelance opportunities**. Reach out anytime!

Built with ❤️ using React, Supabase, and Tailwind CSS

```

```
