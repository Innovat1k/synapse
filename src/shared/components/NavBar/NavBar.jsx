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
    { name: "Dashboard", path: "/dashboard", icon: <LuLayoutDashboard /> },
    { name: "My Skills", path: "/skills", icon: <LuGraduationCap /> },
    { name: "Projects", path: "/projects", icon: <LuBriefcase /> },
    { name: "Goals", path: "/goals", icon: <LuTarget /> },
    { name: "Settings", path: "/settings", icon: <LuSettings /> },
  ];

  return (
    <>
      {/* Desktop/Tablet: left sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:top-[73px] md:left-0 md:w-[20%] md:h-[calc(100vh-73px)] md:bg-slate-900/60 md:border-r md:border-slate-800/50 md:backdrop-blur-sm md:p-4 md:overflow-y-auto z-10">
        <ul className="flex flex-col gap-5">
          {navigation_menu.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg
              ${
                location.pathname === item.path
                  ? "text-teal-400 font-bold bg-slate-800/50 border border-slate-700/50"
                  : "text-slate-400 hover:text-teal-400 hover:bg-slate-800/30"
              }`}
              >
                <div className="text-xl">{item.icon}</div>
                <span className="text-base">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: bottom navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/60 border-t border-slate-800/50 backdrop-blur-sm shadow-lg z-20">
        <ul
          className="flex justify-around items-center h-16 px-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {navigation_menu.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex flex-col items-center justify-center w-12 h-full
              ${
                location.pathname === item.path
                  ? "text-teal-400"
                  : "text-slate-400"
              }`}
                aria-label={item.name}
              >
                <div className="text-xl">{item.icon}</div>
                <span className="text-[10px] mt-1">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
