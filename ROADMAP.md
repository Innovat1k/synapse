# 🗺️ Synapse Roadmap

> Current version: **v1.0 – Production Ready** 🚀

## ✅ Shipped (v1.0)

- [x] Full authentication flow (Supabase Auth)
- [x] Skills CRUD with modals + validation
- [x] Activity logging (duration, notes, timestamps)
- [x] Dashboard with 6 interactive widgets
- [x] Knowledge graph visualization
- [x] Offline UX (NetworkStatus + disabled write actions)
- [x] Responsive design (mobile + desktop)
- [x] Testing suite (Vitest + RTL)
- [x] Professional README + documentation
- [x] Vercel deployment + web manifest (icons, theme)

---

### Rationale for Adjustment:

The "Log Activity" feature (originally in Phase 5) is crucial for Synapse to start **generating tracking data**. Without it, Dashboard visualizations would be empty, and the "Tracking" value would be absent from the immediate user experience. Integrating "Log Activity" after CRUD operations for skills makes the product actionable and generates the necessary data before tackling more complex features like "Linking."

---

## Phase 1 – Foundation & Authentication

- [x] Supabase authentication (Sign In, Sign Up, Logout).
- [x] Custom form validation + Framer Motion animations.

## Phase 2 – Security & Access

- [x] Protected routes implementation.
- [x] Supabase database setup (defining tables: users, skills, activities).
- [x] Base Dashboard layout.

## Phase 3 – Skill Management

- [x] CRUD for skills (name, category, level 1–5).
- [x] Skill cards/list with add/edit modals.
- [x] Implemented confirmation modal for deletion.

---

## Phase 3.5 – Initial Tracking (NEW PHASE)

- [x] **Implement "Log Activity" interface (modal)**:
  - Allow users to record time/effort spent on a specific skill.
  - Accessible from Dashboard (for "Current Focus") and Skill Management Page (per skill).
  - Store activity data in `activities` table.
  - **Note:** This phase is crucial for generating the data required for all tracking & visualization features (Phase 5).

---

## Phase 4 – Core Synapse (Linking)

- [x] Implement skill linking logic (managing related skill IDs in the database).
- [x] Simple visualization of skill connections.
  - **Note:** This phase, while fundamental to Synapse's unique value, will now build upon the activity data generated in Phase 3.5.

---

## Phase 5 – Tracking & Visualization

- [x] Weekly progress charts (Recharts) on Dashboard.
- [x] Current focus & recent activities timeline widgets on Dashboard.
  - **Note:** These visualizations will now directly leverage the activity data generated in Phase 3.5.

---

## Phase 6 – Polishing & Enhancements (COMPLETED)

- [x] Final UX refinements:
  - [x] Standardized empty states (6 widgets)
  - [x] Offline detection + NetworkStatus component
  - [x] Disabled write actions when offline
  - [x] Responsive filters (grid desktop, stack mobile)
  - [x] Improved error messages + form validation
  - [x] Global mocks for testing (vitest.setup.ts)
- [x] Code quality:
  - [x] Flatten hooks structure (remove nested folders)
  - [x] Card component refactor (title/description/action props)
  - [x] Dashboard.jsx optimization (400+ → 381 lines)
- [x] Documentation:
  - [x] Professional README with features, tech stack, structure
  - [x] ROADMAP with shipped items + future plans

---

## 💡 Future Ideas / Vision (Not Actively Developed)

> This project is currently in a **completed state** (v1.0).  
> The items below represent ideas for future iterations, should development resume.

## 🟡 Planned (v1.1)
### Offline & PWA

- [ ] Service worker for offline caching (true PWA)
- [ ] Background sync for activity logging
- [ ] Install prompt optimization

### UX Enhancements

- [ ] Notification system (bell icon with badge)
- [ ] Track delete guard modal ("X skills will lose their track")
- [ ] Bulk actions (assign track to multiple skills, bulk delete)
- [ ] Better error messages (FK violations, RLS denied)

### Features

- [ ] User profile (name, preferences)
- [ ] Settings page (theme, notifications)
- [ ] More data export format (CSV, ...)
- [ ] Streaks & achievements system

### Technical

- [ ] E2E tests (Playwright or Cypress)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Error tracking (Sentry integration)

---

## ⚪ Future (v2.0+)

- [ ] Mobile app (React Native or PWA enhanced)
- [ ] Dark/Light theme toggle with system preference
- [ ] Collaborative features (share skills, public profiles)
- [ ] AI suggestions (related skills, learning paths)
- [ ] Integrations (GitHub, LinkedIn, Notion)

---

> 💡 **Have an idea?** Open an issue or reach out via [GitHub](https://github.com/Innovat1k/synapse).
