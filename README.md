# 💼 Synapse: Skill Tracker - Link Your Skills

> A modern web app built with **React & Supabase** to **define, link, track, and visualize** your skills and learning progression.  
> _Helping users connect their learning journey with clarity and insight._

---

## 🧭 Table of Contents

- [📝 Description](#-description)
- [✨ Features](#-features)
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
- ⬜ **Linking Skills:** Define dependencies & related skills (graph-style relationships)
- ⬜ Log activity (time spent, sessions) to track effort
- ⬜ Dashboard with progress charts & activity timelines
- ⬜ User profile management (name, avatar, settings)

---

## 🔧 Technologies Used

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Backend & Auth**: Supabase (Auth + Postgres DB)
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Charts/Graphs**: Recharts (or Chart.js)

---

## 📦 Installation & Usage

```bash
# 1. Clone the repository
git clone https://github.com/<YOUR_USERNAME>/synapse.git
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
├── atoms/                   # Global state management using Jotai atoms
├── pages/                   # App pages, organized by feature
│   ├── UserAuthPage/        # Handles authentication (login/signup)
│   │   ├── components/      # Page-specific UI components
│   │   └── hooks/           # Page-specific hooks (form/API handling)
│   ├── DashboardPage/       # Main dashboard page
│       ├── components/      # Dashboard widgets, charts, etc.
│       └── hooks/           # Dashboard hooks (data fetching/state logic)
├── services/                # API calls, external services, business logic
├── shared/                  # Reusable code across the project
│   ├── __tests__/           # Test helpers
│   ├── components/          # Generic UI components
│   ├── hooks/               # Generic hooks
│   ├── utils/               # Utility functions/helpers
├── App.jsx                  # Main entry point; renders routes & providers
└── main.jsx                 # App bootstrap; mounts <App /> into DOM
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

```

```
