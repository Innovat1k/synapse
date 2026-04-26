import { Link } from "react-router-dom";
import { SETTINGS_SECTIONS } from "./settingsConfig";
import {
  LuShield,
  LuDatabase,
  LuSettings,
  LuLayers,
  LuRoute,
  LuTags,
  LuArrowRight,
} from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ICONS = {
  LuShield,
  LuDatabase,
  LuSettings,
  LuLayers,
  LuRoute,
  LuTags,
};

const SettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Settings</h2>
        <p className="text-slate-500 mt-2">
          Manage your account, data, and application preferences.
        </p>
      </div>

      {/* Quick Action – Export Data (Feature Principale) */}
      <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all duration-200 group">
        <Link to="/settings/personal/data" className="block">
          <div className="flex items-center gap-3 mb-2">
            <LuDatabase className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100">Export Your Data</h3>
          </div>
          <p className="text-slate-400 text-sm">
            Download all your skills and activities as a JSON file.
          </p>
          <div className="flex items-center gap-1 text-cyan-400 text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span>Go to Data & Privacy</span>
            <LuArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* All Sections List */}
      <div className="space-y-8">
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.group}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
              {section.group}
            </h3>
            <div className="grid gap-3">
              {section.items.map((item) => {
                const Icon = ICONS[item.icon];
                const isReady = item.status === "ready";

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                      isReady
                        ? "bg-slate-900/50 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700/50 group"
                        : "bg-slate-900/30 border-slate-800/30 opacity-60 cursor-not-allowed"
                    }`}
                    onClick={(e) => !isReady && e.preventDefault()}
                  >
                    <div
                      className={`p-2.5 rounded-lg transition-colors duration-200 ${
                        isReady
                          ? "bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-cyan-400"
                          : "bg-slate-950 border border-slate-800 text-slate-600"
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-200">
                          {item.label}
                        </h4>
                        {!isReady && (
                          <span className="text-xs font-bold bg-slate-800/50 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm">
                        {item.description}
                      </p>
                    </div>
                    {isReady && (
                      <LuArrowRight
                        className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-200 shrink-0"
                        size={18}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SettingsPage;
