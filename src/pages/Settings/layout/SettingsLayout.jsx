import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "./SettingsSidebar";
import { LuMenu, LuX } from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export const SettingsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:block w-64 bg-slate-900/40 border-r border-slate-800/50 sticky top-0 h-screen">
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 px-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Settings
            </h1>
          </div>
          <SettingsSidebar />
        </div>
      </aside>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm"
              data-testid="mobile-overlay"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 z-70 h-full w-72 bg-slate-900 border-r border-slate-800 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-white">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                  aria-label="Close settings navigation"
                >
                  <LuX size={20} />
                </button>
              </div>
              <SettingsSidebar onAction={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        {/*Header Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900/60 border-b border-slate-800/50 backdrop-blur-md">
          <h1 className="text-lg font-semibold">Settings</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-800/50 text-slate-100"
            aria-label="Open settings navigation"
          >
            <LuMenu size={20} />
          </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-slate-900/10">
          <div className="max-w-4xl mx-auto p-4 sm:p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
