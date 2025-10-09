import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "jotai";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FallbackComponent from "./shared/components/FallBackComponent.jsx";
import DashBoard from "./pages/DashBoard/DashBoard.jsx";
import UserAuthPage from "./pages/UserAuthPage/components/UserAuthPage.jsx";
import CheckEmailPage from "./pages/CheckEmailPage/CheckEmailPage.jsx";
import { Toast } from "radix-ui";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <FallbackComponent />,
    children: [
      { index: true, element: <DashBoard /> },
      { path: "/dashboard", element: <DashBoard /> },
      {
        path: "/auth",
        element: <UserAuthPage />,
      },
      { path: "/auth/check-email", element: <CheckEmailPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <Toast.Provider>
        <RouterProvider router={route} />
      </Toast.Provider>
    </Provider>
  </StrictMode>
);
