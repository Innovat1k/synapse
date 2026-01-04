import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "jotai";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import FallbackComponent from "./shared/components/FallBackComponent.jsx";
import DashBoard from "./pages/DashBoard/DashBoard.jsx";
import UserAuthPage from "./pages/UserAuthPage/components/UserAuthPage.jsx";
import CheckEmailPage from "./pages/CheckEmailPage/CheckEmailPage.jsx";
import SkillsLayout from "./layouts/SkillsLayout.jsx";
import SkillsListPage from "./pages/SkillsListPage/SkillsListPage.jsx";
import SkillDetailPage from "./pages/SkillDetailPage/SkillDetailPage.jsx";
import { Toast } from "radix-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <FallbackComponent />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashBoard /> },
      {
        path: "/auth",
        element: <UserAuthPage />,
      },
      { path: "/auth/check-email", element: <CheckEmailPage /> },
      {
        path: "/skills",
        element: <SkillsLayout />,
        children: [
          { index: true, element: <SkillsListPage /> },
          { path: ":skillId", element: <SkillDetailPage /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Toast.Provider>
          <RouterProvider router={route} />
        </Toast.Provider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
