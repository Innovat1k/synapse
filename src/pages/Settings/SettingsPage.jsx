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
import { containerVariants, itemVariants } from "@shared/utils/animations";

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
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black text-slate-50 uppercase tracking-tight">
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Manage your account, data, and application preferences.
        </p>
      </motion.div>

      {/* Quick Action – Export Data (Feature Principale) */}
      <motion.div variants={itemVariants}>
        <Link to="/settings/personal/data" className="block group">
          <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-cyan-500/20 rounded-lg">
                <LuDatabase className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-base font-bold text-slate-100">
                Export Your Data
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Download all your skills and activities as a JSON file.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span>Go to Data & Privacy</span>
              <LuArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* All Sections List */}
      <motion.div variants={containerVariants} className="space-y-8">
        {SETTINGS_SECTIONS.map((section, sectionIndex) => (
          <motion.div key={section.group} variants={itemVariants}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
              {section.group}
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-3"
            >
              {section.items.map((item) => {
                const Icon = ICONS[item.icon];
                const isReady = item.status === "ready";

                return (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      to={item.path}
                      onClick={(e) => !isReady && e.preventDefault()}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 group ${
                        isReady
                          ? "bg-slate-900/50 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700/50 cursor-pointer"
                          : "bg-slate-900/30 border-slate-800/30 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg border transition-all duration-200 ${
                          isReady
                            ? "bg-slate-950 border-slate-800 text-slate-500 group-hover:text-cyan-400 group-hover:bg-slate-900/50"
                            : "bg-slate-950 border-slate-800 text-slate-600"
                        }`}
                      >
                        {Icon && <Icon size={20} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-100">
                            {item.label}
                          </h4>
                          {!isReady && (
                            <span className="text-xs font-bold bg-slate-800/50 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {isReady && (
                        <LuArrowRight
                          className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200 shrink-0"
                          size={18}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
