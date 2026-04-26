import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "./SettingsSidebar";
import { LuMenu, LuX } from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export const SettingsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900/40 border-r border-slate-800/50 sticky top-0 h-screen shrink-0 overflow-y-auto">
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 px-2 shrink-0">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
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
              className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
              data-testid="mobile-overlay"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 z-60 h-screen w-72 bg-slate-900 border-r border-slate-800/50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800/50 shrink-0">
                <span className="font-semibold text-slate-100">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-800/50"
                  aria-label="Close settings navigation"
                >
                  <LuX size={20} />
                </button>
              </div>
              <div className="p-6">
                <SettingsSidebar onAction={() => setSidebarOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900/60 border-b border-slate-800/50 backdrop-blur-md shrink-0">
          <h1 className="text-base font-semibold text-slate-100">Settings</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-100 transition-colors"
            aria-label="Open settings navigation"
          >
            <LuMenu size={20} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-linear-to-b from-slate-900/20 to-slate-950/20">
            <div className="max-w-4xl mx-auto p-2 sm:p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
