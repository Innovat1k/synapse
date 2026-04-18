import React from "react";

// Layouts
export const SkillsLayout = React.lazy(
  () => import("@layouts/SkillsLayout.jsx"),
);

export const SettingsLayout = React.lazy(() =>
  import("@pages/Settings/layout/SettingsLayout.jsx").then((module) => ({
    default: module.SettingsLayout,
  })),
);

export const AuthLayout = React.lazy(() => import("./layouts/AuthLayout.jsx"));

export const App = React.lazy(() => import("./App.jsx"));

// Pages
export const DashBoard = React.lazy(
  () => import("@pages/DashBoard/DashBoard.jsx"),
);

export const SkillsListPage = React.lazy(
  () => import("@pages/SkillsListPage/SkillsListPage.jsx"),
);

export const UserAuthPage = React.lazy(
  () => import("@pages/UserAuthPage/UserAuthPage.jsx"),
);

export const CheckEmailPage = React.lazy(
  () => import("@pages/CheckEmailPage/CheckEmailPage.jsx"),
);

export const SkillDetailPage = React.lazy(
  () => import("@pages/SkillDetailPage/SkillDetailPage.jsx"),
);

export const AppSettingsPage = React.lazy(() =>
  import("@pages/Settings/app/AppSettingsPage.jsx").then((module) => ({
    default: module.AppSettingsPage,
  })),
);

export const TracksPage = React.lazy(() =>
  import("@pages/Settings/app/tracks/TracksPage.jsx").then((module) => ({
    default: module.TracksPage,
  })),
);

export const SettingsPage = React.lazy(
  () => import("@pages/Settings/SettingsPage.jsx"),
);

export const FallbackComponent = React.lazy(
  () => import("@shared/components/FallBackComponent.jsx"),
);
