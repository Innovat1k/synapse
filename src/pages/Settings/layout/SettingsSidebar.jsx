import { NavLink } from "react-router-dom";
import { SETTINGS_SECTIONS } from "../settingsConfig";
import {
  LuDatabase,
  LuLayers,
  LuShield,
  LuSettings,
  LuRoute,
  LuTags,
} from "react-icons/lu";

const ICONS = {
  LuShield,
  LuDatabase,
  LuSettings,
  LuLayers,
  LuRoute,
  LuTags,
};

export const SettingsSidebar = ({ onAction }) => {
  return (
    <nav className="space-y-8" data-testid="settings-sidebar">
      {SETTINGS_SECTIONS.map((section) => (
        <div key={section.group}>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 px-2">
            {section.group}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const Icon = ICONS[item.icon];
              const isReady = item.status === "ready";

              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onAction}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400"
                          : isReady
                            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            : "text-slate-600 cursor-not-allowed"
                      }`
                    }
                  >
                    {Icon && <Icon size={18} />}
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {!isReady && (
                      <span className="text-xs text-slate-600 font-medium">
                        Soon
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
