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

const SettingsHome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <p className="text-slate-400 mt-1">
          Manage your account, data, and application preferences.
        </p>
      </div>

      {/* Quick Action – Export Data (Feature Principale) */}
      <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors group">
        <Link to="/settings/personal/data" className="block">
          <div className="flex items-center gap-3 mb-2">
            <LuDatabase className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100">Export Your Data</h3>
          </div>
          <p className="text-slate-400 text-sm">
            Download all your skills and activities as a JSON file.
          </p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Go to Data & Privacy</span>
            <LuArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* All Sections List */}
      <div className="space-y-6">
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.group}>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
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
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isReady
                        ? "bg-slate-900/50 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700 group"
                        : "bg-slate-900/30 border-slate-800/30 opacity-60 cursor-not-allowed"
                    }`}
                    onClick={(e) => !isReady && e.preventDefault()}
                  >
                    <div
                      className={`p-2.5 rounded-lg ${
                        isReady
                          ? "bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-teal-400"
                          : "bg-slate-950 border border-slate-800 text-slate-600"
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-medium text-slate-200">
                          {item.label}
                        </h4>
                        {!isReady && (
                          <span className="text-[9px] font-bold bg-slate-800 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
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
                        className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all"
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

export default SettingsHome;
