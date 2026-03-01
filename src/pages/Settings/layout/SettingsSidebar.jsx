import { Link, useLocation } from "react-router-dom";
import { SETTINGS_SECTIONS } from "../settingsConfig";

export const SettingsSidebar = ({ onAction }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col" data-testid="settings-sidebar">
      {SETTINGS_SECTIONS.map((group) => (
        <div key={group.group} className="mb-8 last:mb-0">
          <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-600 mb-3 px-3">
            {group.group}
          </h3>
          <nav className="space-y-1">
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => onAction?.()}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-teal-500/10 text-teal-400 font-semibold shadow-[inset_0_0_10px_rgba(45,212,191,0.05)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 w-1 h-4 bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                  )}

                  <span
                    className={`${isActive ? "translate-x-2" : "group-hover:translate-x-1"} transition-transform duration-300`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
};
