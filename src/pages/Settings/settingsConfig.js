// Defines settings section groups and their navigation items (used in sidebar or settings menu)
export const SETTINGS_SECTIONS = [
  {
    group: "Personal",
    items: [
      { id: "account", label: "Account", path: "/settings/account" },
      { id: "general", label: "General", path: "/settings/general" },
    ],
  },
  {
    group: "Application",
    items: [
      { id: "app", label: "App Structure", path: "/settings/app" },
      { id: "tracks", label: "Tracks", path: "/settings/app/tracks" },
      // { id: "categories", label: "Categories", path: "/settings/app/categories" },
    ],
  },
];
