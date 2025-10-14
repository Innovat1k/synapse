import { Outlet } from "react-router-dom";
import { useAuth } from "./pages/UserAuthPage/hooks/useAuth/useAuth";
import { useAuthRedirect } from "./pages/UserAuthPage/hooks/useAuthRedirect/useAuthRedirect";
import Loader from "./shared/components/Loader";
import Header from "./shared/components/Header/Header";
import NavBar from "./shared/components/NavBar/NavBar";
import ToastComponent from "./shared/components/Toast/components/ToastComponent";

function App() {
  const { isLogin, loader, methods, formData, touched, user } = useAuth();
  useAuthRedirect();

  const isAuthRoute = window.location.pathname.startsWith("/auth");

  if (loader.isInitialLoading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {isAuthRoute ? (
        <Outlet context={{ methods, isLogin, loader, formData, touched }} />
      ) : (
        <>
          <Header signOut={methods.handleSignOut} user={user} />
          <div className="flex flex-1 overflow-hidden">
            <NavBar />
            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-0 md:ml-[20%] overflow-y-auto">
              <Outlet context={{ methods, user }} />
            </main>
          </div>
        </>
      )}
      <ToastComponent />
    </div>
  );
}

export default App;
