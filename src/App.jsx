import { Outlet } from "react-router-dom";
import { useAuth } from "./pages/UserAuthPage/hooks/useAuth/useAuth";
import { useAuthRedirect } from "./pages/UserAuthPage/hooks/useAuthRedirect/useAuthRedirect";
import Loader from "./shared/components/Loader";
import Header from "./shared/components/Header/Header";
import NavBar from "./shared/components/NavBar/NavBar";
import ToastComponent from "./shared/components/Toast/components/ToastComponent";

function App() {
  const { isLogin, loader, methods, formData, touched } = useAuth();
  useAuthRedirect();

  const isAuthRoute = location.pathname.startsWith("/auth");

  if (loader.isInitialLoading) {
    return <Loader />;
  }

  return (
    <div className="relative">
      {isAuthRoute ? (
        <Outlet context={{ methods, isLogin, loader, formData, touched }} />
      ) : (
        <>
          <Header />
          <div className="flex">
            <NavBar />
            <main className="flex-1 p-6">
              <Outlet context={{ methods }} />
            </main>
          </div>
        </>
      )}
      <ToastComponent />
    </div>
  );
}

export default App;
