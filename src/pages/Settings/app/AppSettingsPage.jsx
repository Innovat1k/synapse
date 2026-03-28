import { Link } from "react-router-dom";
import { LuLayers, LuTags, LuChevronRight } from "react-icons/lu";

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
    <div className="max-w-3xl mx-auto pb-6">
      {/* Header */}
      <header className="mb-8 md:mb-10 px-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-50 mb-3">
          Application Structure
        </h1>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Configure the core model of Synapse by managing how skills and tracks
          are organized.
        </p>
      </header>

      {/* Settings Cards */}
      <div className="grid gap-3 md:gap-4">
        {APP_SETTINGS.map((setting) => {
          const Icon = setting.icon;

          if (setting.comingSoon) {
            return (
              <div
                key={setting.title}
                className="flex items-start sm:items-center gap-4 p-4 md:p-5 rounded-2xl bg-slate-900/20 border border-slate-800/40 opacity-50 cursor-not-allowed"
                aria-disabled="true"
                role="group"
                data-testid={`coming-soon-${setting.title.toLowerCase().replace(/ /g, "-")}`}
              >
                <div className="shrink-0 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5 sm:pt-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-slate-500 text-base">
                      {setting.title}
                    </h2>
                    <span className="text-[9px] font-bold bg-slate-800 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
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
              className="group flex items-start sm:items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all bg-slate-900/40 border-slate-800/60 hover:border-slate-700 active:scale-[0.98] shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <div className="shrink-0 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-teal-400 transition-colors">
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5 sm:pt-0">
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
                <LuChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
