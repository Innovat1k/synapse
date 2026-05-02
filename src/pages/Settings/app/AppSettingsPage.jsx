import { Link } from "react-router-dom";
import { LuLayers, LuTags, LuChevronRight, LuArrowLeft } from "react-icons/lu";

const APP_SETTINGS = [
  {
    title: "Learning Tracks",
    description:
      "Group skills into thematic tracks to build a structured curriculum.",
    link: "/settings/app/tracks",
    comingSoon: false,
    icon: LuLayers,
  },
  {
    title: "Skill Categories",
    description:
      "Define and customize global categories like frontend, devops, or data.",
    link: "/settings/app/categories",
    comingSoon: true,
    icon: LuTags,
  },
];

export const AppSettingsPage = () => {
  return (
    <div className="m-auto">
      {/* Header */}
      <header className="mb-12 px-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          {/* Back Button – Desktop only (mobile has it in header) */}
          <Link
            to="/settings"
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-400 
                     hover:text-cyan-400 hover:bg-slate-800/50 
                     rounded-lg border border-transparent hover:border-slate-700/50 
                     transition-all group w-fit shrink-0"
            aria-label="Go back to Settings"
          >
            <LuArrowLeft
              className="group-hover:-translate-x-0.5 transition-transform"
              size={18}
            />
            <span className="font-medium hidden sm:inline">Back</span>
          </Link>

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50 capitalize tracking-tight">
              Application Structure
            </h1>
            <p className="text-sm text-slate-400 mt-1 sm:mt-2 max-w-2xl">
              Configure the core model of Synapse by managing how skills and
              tracks are organized.
            </p>
          </div>
        </div>
      </header>

      {/* Settings Cards */}
      <div className="grid gap-4">
        {APP_SETTINGS.map((setting) => {
          const Icon = setting.icon;

          if (setting.comingSoon) {
            return (
              <div
                key={setting.title}
                className="flex items-start sm:items-center gap-4 p-6 rounded-lg bg-slate-900/20 border border-slate-800/40 opacity-60 cursor-not-allowed"
                aria-disabled="true"
                role="group"
                data-testid={`coming-soon-${setting.title.replace(" ", "-").toLowerCase()}`}
              >
                <div className="shrink-0 p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-600">
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-slate-500 text-base">
                      {setting.title}
                    </h2>
                    <span className="text-xs font-bold bg-slate-800/50 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest">
                      Soon
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 leading-snug">
                    {setting.description}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={setting.title}
              to={setting.link}
              className="group flex items-start sm:items-center gap-4 p-6 rounded-lg border transition-all duration-200 bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/70 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              <div className="shrink-0 p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-cyan-400 transition-colors duration-200">
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="font-semibold text-slate-200 text-base">
                    {setting.title}
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-slate-500 leading-snug">
                  {setting.description}
                </p>
              </div>
              <div className="shrink-0">
                <LuChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
