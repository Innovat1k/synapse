import { Outlet } from "react-router-dom";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import { useAuthRedirect } from "@pages/UserAuthPage/hooks/useAuthRedirect";
import Header from "@shared/components/layout/Header";
import NavBar from "@shared/components/layout/NavBar";
import Loader from "@shared/components/ui/Loader";
import ScrollToTop from "@shared/components/utils/ScrollToTop";
import NetworkStatus from "@shared/components/utils/NetworkStatus/NetworkStatus";
import { useNetworkStatus } from "@shared/components/utils/NetworkStatus/hooks/useNetworkStatus";

function App() {
  const { loader, methods, user } = useAuth();
  useAuthRedirect();
  useNetworkStatus();

  if (loader.isInitialLoading && !loader.isSigningOut) {
    return <Loader />;
  }
  if (loader.isSigningOut) {
    return <Loader />;
  }

  return (
    <>
      <ScrollToTop />
      <NetworkStatus />

      <div className="relative min-h-screen flex flex-col bg-[#0a0e1a] text-slate-50 selection:bg-cyan-500/30">
        <Header signOut={methods.handleSignOut} user={user} />

        <div className="flex flex-1 overflow-hidden relative">
          <NavBar />

          {/* Main Content Area */}
          <main className="flex-1 p-2 md:p-8 pb-28 md:pb-8 md:ml-[20%] overflow-y-auto bg-[#0a0e1a]">
            <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
              <Outlet context={{ methods, user }} />
            </div>
          </main>
        </div>

        {/* Decorative background gradient */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#1e293b_0%,transparent_50%)] opacity-20" />
      </div>
    </>
  );
}

export default App;
