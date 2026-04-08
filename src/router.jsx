import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loader from "@shared/components/Loader";
import {
  App,
  AuthLayout,
  SettingsLayout,
  SkillsLayout,
  AppSettingsPage,
  CheckEmailPage,
  DashBoard,
  SkillDetailPage,
  SkillsListPage,
  TracksPage,
  UserAuthPage,
  FallbackComponent,
} from "./lazyComponents.jsx";

// Skeletons
import DashboardSkeleton from "./pages/DashBoard/components/DashboardSkeleton.jsx";
import SkillSkeleton from "./pages/SkillDetailPage/components/SkillSkeleton.jsx";
import SkillsListSkeleton from "./pages/SkillsListPage/components/SkillsListSkeleton.jsx";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <UserAuthPage /> },
      { path: "check-email", element: <CheckEmailPage /> },
    ],
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    ),
    errorElement: <FallbackComponent />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashBoard />
          </Suspense>
        ),
      },
      { path: "/auth/check-email", element: <CheckEmailPage /> },
      {
        path: "/skills",
        element: <SkillsLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SkillsListSkeleton />}>
                <SkillsListPage />
              </Suspense>
            ),
          },
          {
            path: ":skillId",
            element: (
              <Suspense fallback={<SkillSkeleton />}>
                <SkillDetailPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="app" replace /> },
          { path: "app", element: <AppSettingsPage /> },
          { path: "app/tracks", element: <TracksPage /> },
        ],
      },
    ],
  },
]);
