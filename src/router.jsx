import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loader from "@shared/components/ui/Loader";
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
  SettingsPage,
  DataPrivacyPage,
} from "./lazyComponents.jsx";

// Skeletons
import DashboardSkeleton from "./pages/DashBoard/components/DashboardSkeleton.jsx";
import SkillSkeleton from "./pages/SkillDetailPage/components/SkillSkeleton.jsx";
import SkillsListSkeleton from "./pages/SkillsListPage/components/SkillsListSkeleton.jsx";
import ComingSoonPage from "./shared/components/utils/ComingSoonPage.jsx";
import SettingsSkeleton from "./pages/Settings/components/SettingsSkeleton.jsx";
import PageTransition from "./shared/components/utils/PageTransition.jsx";
import { AnimatedRoute } from "./shared/components/utils/AnimatedRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <AnimatedRoute>
        <Suspense fallback={<Loader />}>
          <AuthLayout />
        </Suspense>
      </AnimatedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <AnimatedRoute>
            <UserAuthPage />
          </AnimatedRoute>
        ),
      },
      {
        path: "check-email",
        element: (
          <AnimatedRoute>
            <CheckEmailPage />
          </AnimatedRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: (
      <AnimatedRoute>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </AnimatedRoute>
    ),
    errorElement: <FallbackComponent />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "/dashboard",
        element: (
          <AnimatedRoute>
            <Suspense fallback={<DashboardSkeleton />}>
              <DashBoard />
            </Suspense>
          </AnimatedRoute>
        ),
      },
      { path: "/auth/check-email", element: <CheckEmailPage /> },
      {
        path: "/skills",
        element: (
          <AnimatedRoute>
            <SkillsLayout />
          </AnimatedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <AnimatedRoute>
                <Suspense fallback={<SkillsListSkeleton />}>
                  <SkillsListPage />
                </Suspense>
              </AnimatedRoute>
            ),
          },
          {
            path: ":skillId",
            element: (
              <AnimatedRoute>
                <Suspense fallback={<SkillSkeleton />}>
                  <SkillDetailPage />
                </Suspense>
              </AnimatedRoute>
            ),
          },
        ],
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: (
              <AnimatedRoute>
                <Suspense fallback={<SettingsSkeleton />}>
                  <SettingsPage />
                </Suspense>
              </AnimatedRoute>
            ),
          },
          { path: "personal/data", element: <DataPrivacyPage /> },
          {
            path: "personal/account",
            element: <ComingSoonPage feature="Settings" />,
          },
          {
            path: "personal/general",
            element: <ComingSoonPage feature="Settings" />,
          },
          { path: "app", element: <AppSettingsPage /> },
          { path: "app/tracks", element: <TracksPage /> },
          {
            path: "app/categories",
            element: <ComingSoonPage feature="Settings" />,
          },
        ],
      },
      {
        path: "/projects",
        element: (
          <ComingSoonPage
            feature="projects"
            title="Projects"
            description="Organize your skills into projects and track learning goals for each one."
          />
        ),
      },
      {
        path: "/goals",
        element: (
          <ComingSoonPage
            feature="goals"
            title="Goals"
            description="Set learning milestones, track progress, and celebrate achievements."
          />
        ),
      },
      { path: "*", element: <FallbackComponent /> },
    ],
  },
]);
