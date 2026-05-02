import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { LuMenu, LuX, LuArrowLeft } from "react-icons/lu";
import { SettingsSidebar } from "./SettingsSidebar";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// SUB-NAV – Desktop only, fixed, always visible on main page
const SettingsSubNav = () => {
  const location = useLocation();
  const isMainSettingsPage = location.pathname === "/settings";

  if (!isMainSettingsPage) {return null;}

  const sections = [
    { group: "Home", id: "home" },
    { group: "Personal", id: "personal" },
    { group: "Application", id: "application" },
  ];

  return (
    <div className="fixed top-24 right-6 md:right-8 z-30 hidden md:block">
      <div className="bg-[#0f1420]/95 backdrop-blur-md border border-slate-800/50 rounded-xl shadow-xl p-1">
        <nav className="flex gap-1" aria-label="Settings navigation">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 
                       hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200"
            >
              {section.group}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export const SettingsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isMainSettingsPage = location.pathname === "/settings";

  return (
    <div className="flex flex-col min-h-full bg-[#0a0e1a] text-slate-100">
      {/*  MOBILE DRAWER + OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-[#0a0e1a]/80 backdrop-blur-sm"
              data-testid="mobile-overlay"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 z-50 h-screen w-72 bg-[#0f1420] border-r border-slate-800/50 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800/50 shrink-0">
                <span className="font-semibold text-slate-50">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-[#1a2332]"
                  aria-label="Close settings navigation"
                >
                  <LuX size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6">
                <SettingsSidebar onAction={() => setSidebarOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/*  MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/*  MOBILE HEADER – Navigation ONLY */}
        <header className="md:hidden fixed top-14 left-0 right-0 z-40 flex items-center justify-between p-4 bg-[#0f1420]/60 border-b border-slate-800/50 backdrop-blur-md shrink-0">
          {/* Left: Back OR Hamburger */}
          <div className="flex items-center gap-3">
            {!isMainSettingsPage ? (
              <Link
                to="/settings"
                className="p-2 -ml-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
                aria-label="Back to Settings"
              >
                <LuArrowLeft size={20} />
              </Link>
            ) : (
              // Mobile Menu Button (main page)
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 m-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-100 transition-all duration-200 active:scale-95"
                aria-label="Open settings navigation"
              >
                <LuMenu size={20} />
              </button>
            )}
          </div>

          {!isMainSettingsPage && (
            <h1 className="text-sm font-bold uppercase tracking-tight text-slate-50">
              Settings
            </h1>
          )}

          {/* Right: Spacer for balance */}
          <div className="w-10" />
        </header>

        {/*  SUB-NAV FIXED (Desktop only) */}
        <SettingsSubNav />

        {/*  CONTENT AREA – With mobile header offset */}
        <div className="flex-1 md:mt-0 mt-16">
          <div className="min-h-full bg-linear-to-b from-[#0f1420]/20 to-[#0a0e1a]/20">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-0">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
