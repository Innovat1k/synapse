import { Link, useLocation } from "react-router-dom";
import {
  LuBriefcase,
  LuGraduationCap,
  LuLayoutDashboard,
  LuSettings,
  LuTarget,
} from "react-icons/lu";

function NavBar() {
  const location = useLocation();

  const navigation_menu = [
    { name: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { name: "My Skills", path: "/skills", icon: LuGraduationCap },
    { name: "Projects", path: "/projects", icon: LuBriefcase },
    { name: "Goals", path: "/goals", icon: LuTarget },
    { name: "Settings", path: "/settings", icon: LuSettings },
  ];

  const getIsActive = (currentPath, itemPath) => {
    if (itemPath === "/") {
      return currentPath === "/";
    }
    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  };

  return (
    <>
      {/* 🔹 DESKTOP/TABLET: Left Sidebar */}
      <nav
        className="hidden md:flex md:flex-col md:fixed md:top-18.25 md:left-0 md:w-[20%] md:h-[calc(100vh-73px)] 
                   bg-[#0f1420]/90 border-r border-blue-800/50 backdrop-blur-md p-6 overflow-y-auto z-10 
                   transition-all duration-300"
      >
        <ul className="flex flex-col gap-3">
          {navigation_menu.map((item) => {
            const isActive = getIsActive(location.pathname, item.path);
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg 
                             transition-all duration-200 border border-transparent ${
                               isActive
                                 ? "bg-cyan-500/10 text-cyan-400 font-semibold border-l-2 border-l-cyan-400"
                                 : "text-slate-400 hover:text-slate-200 hover:bg-[#1a2332]"
                             }`}
                >
                  <div
                    className={`text-xl transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-400 group-hover:text-cyan-400"
                    }`}
                  >
                    <Icon />
                  </div>
                  <span className="text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 🔹 MOBILE: Bottom Navbar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 
                   bg-[#0f1420]/95 border-t border-blue-800/50 backdrop-blur-lg 
                   shadow-2xl z-50"
      >
        <ul
          className="flex justify-around items-center h-20 px-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {navigation_menu.map((item) => {
            const isActive = getIsActive(location.pathname, item.path);
            const Icon = item.icon;

            return (
              <li
                key={item.name}
                className="relative flex-1 flex justify-center"
              >
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full 
                             transition-all duration-200 ${
                               isActive
                                 ? "text-cyan-400"
                                 : "text-slate-500 hover:text-slate-400"
                             }`}
                  aria-label={item.name}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={`text-xl transition-transform duration-200 ${
                      isActive
                        ? "scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                        : "scale-100"
                    }`}
                  >
                    <Icon />
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest mt-1 
                               transition-opacity duration-200 ${
                                 isActive ? "opacity-100" : "opacity-70"
                               }`}
                  >
                    {item.name}
                  </span>

                  {isActive && (
                    <div
                      className="absolute -top-1.5 w-7 h-1 bg-cyan-400 rounded-full 
                                 shadow-lg shadow-cyan-400/60"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
