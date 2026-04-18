// Defines settings section groups and their navigation items (used in sidebar or settings menu)
export const SETTINGS_SECTIONS = [
  {
    group: "Personal",
    items: [
      {
        id: "account",
        label: "Account",
        path: "/settings/personal/account",
        description: "Manage your email, password, and security",
        icon: "LuShield",
        status: "coming-soon",
      },
      {
        id: "data",
        label: "Data & Privacy",
        path: "/settings/personal/data",
        description: "Export or reset your learning data",
        icon: "LuDatabase",
        status: "ready",
      },
      {
        id: "general",
        label: "General",
        path: "/settings/personal/general",
        description: "Preferences and display options",
        icon: "LuSettings",
        status: "coming-soon",
      },
    ],
  },
  {
    group: "Application",
    items: [
      {
        id: "app",
        label: "App Structure",
        path: "/settings/app",
        description: "Configure skills, categories, and organization",
        icon: "LuLayers",
        status: "ready",
      },
      {
        id: "tracks",
        label: "Tracks",
        path: "/settings/app/tracks",
        description: "Manage your learning tracks",
        icon: "LuRoute",
        status: "ready",
      },
      {
        id: "categories",
        label: "Categories",
        path: "/settings/app/categories",
        description: "Define and customize skill categories",
        icon: "LuTags",
        status: "coming-soon",
      },
    ],
  },
];
