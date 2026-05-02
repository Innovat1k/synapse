import { Link } from "react-router-dom";
import {
  LuShield,
  LuDatabase,
  LuSettings,
  LuLayers,
  LuRoute,
  LuTags,
  LuArrowRight,
} from "react-icons/lu";
import { SETTINGS_SECTIONS } from "./settingsConfig";
import { containerVariants, itemVariants } from "@shared/utils/animations";

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
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER – Desktop + Mobile (identical) */}
      <motion.div variants={itemVariants} id="home" className="space-y-3 px-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-50 capitalize">
          Settings
        </h1>
        <p className="text-sm leading-relaxed text-slate-400 max-w-2xl">
          Manage your account, data, and application preferences.
        </p>
      </motion.div>

      {/* QUICK ACTION – Export Data */}
      <motion.div variants={itemVariants}>
        <Link
          to="/settings/personal/data"
          className="block group"
          aria-label="Export your data as JSON file"
        >
          <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
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

      {/* SECTIONS */}
      <motion.div variants={containerVariants} className="space-y-12 pt-4">
        {SETTINGS_SECTIONS.map((section) => (
          <motion.section
            key={section.group}
            variants={itemVariants}
            id={section.group.toLowerCase().replace(/\s+/g, "-")}
            className="scroll-mt-64"
          >
            {/* Section Header */}
            <div className="px-1 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {section.group}
              </h2>
            </div>

            {/* Section Items */}
            <motion.div variants={containerVariants} className="grid gap-3">
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
                      aria-label={`${item.label}${!isReady ? " (coming soon)" : ""}`}
                      aria-disabled={!isReady}
                    >
                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all duration-200 shrink-0 ${
                          isReady
                            ? "bg-slate-950 border-slate-800 text-slate-500 group-hover:text-cyan-400"
                            : "bg-slate-950 border-slate-800 text-slate-600"
                        }`}
                      >
                        {Icon && <Icon size={20} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-slate-100">
                            {item.label}
                          </h3>
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

                      {/* Arrow */}
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
          </motion.section>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
