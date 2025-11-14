# 🗺️ Wisecho Roadmap - ADJUSTED

This document outlines the planned features and improvements for upcoming versions of Synapse.

### Rationale for Adjustment:
The "Log Activity" feature (originally in Phase 5) is crucial for Synapse to start **generating tracking data**. Without it, Dashboard visualizations would be empty, and the "Tracking" value would be absent from the immediate user experience. Integrating "Log Activity" after CRUD operations for skills makes the product actionable and generates the necessary data before tackling more complex features like "Linking."

---

## Phase 1 – Foundation & Authentication

- [X] Supabase authentication (Sign In, Sign Up, Logout).
- [X] Custom form validation + Framer Motion animations.

## Phase 2 – Security & Access

- [X] Protected routes implementation.
- [X] Supabase database setup (defining tables: users, skills, activities).
- [X] Base Dashboard layout.

## Phase 3 – Skill Management

- [X] CRUD for skills (name, category, level 1–5).
- [X] Skill cards/list with add/edit modals.
- [X] Implemented confirmation modal for deletion.
- [ ] **(Reported to Phase 6)** Pagination for skill list.

---

## **Phase 3.5 – Initial Tracking (NEW PHASE)**

- [ ] **Implement "Log Activity" interface (modal)**:
    - Allow users to record time/effort spent on a specific skill.
    - Accessible from Dashboard (for "Current Focus") and Skill Management Page (per skill).
    - Store activity data in `activities` table.
    - **Note:** This phase is crucial for generating the data required for all tracking & visualization features (Phase 5).

---

## Phase 4 – Core Synapse (Linking)

- [ ] Implement skill linking logic (managing related skill IDs in the database).
- [ ] Simple visualization of skill connections.
    - **Note:** This phase, while fundamental to Synapse's unique value, will now build upon the activity data generated in Phase 3.5.

---

## Phase 5 – Tracking & Visualization

- [ ] Weekly progress charts (Recharts) on Dashboard.
- [ ] Current focus & recent activities timeline widgets on Dashboard.
    - **Note:** These visualizations will now directly leverage the activity data generated in Phase 3.5.

---

## Phase 6 – Polishing & Enhancements

- [ ] User profile (name, avatar) and Settings page.
- [ ] Dark mode toggle & final UX refinements.
- [ ] **(Moved from Phase 3)** Implement pagination for skill list.