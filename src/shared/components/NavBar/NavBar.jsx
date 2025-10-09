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
    { name: "Dashboard", path: "/", icon: <LuLayoutDashboard /> },
    { name: "My Skills", path: "/my-skills", icon: <LuGraduationCap /> },
    { name: "Projects", path: "/projects", icon: <LuBriefcase /> },
    { name: "Goals", path: "/goals", icon: <LuTarget /> },
    { name: "Settings", path: "/settings", icon: <LuSettings /> },
  ];

  return (
    <nav className="fixed w-full bottom-0 md:relative md:w-[20%] md:h-screen md:top-0 bg-white shadow-xl md:shadow-none p-4">
      <ul className="flex justify-around items-center md:flex-col md:justify-start md:items-start md:gap-5">
        {navigation_menu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex flex-col items-center md:flex-row md:gap-3 p-2 rounded-lg 
                ${
                  location.pathname === item.path
                    ? "text-emerald-600 font-bold"
                    : "text-gray-600 hover:text-emerald-600"
                }`}
            >
              <div className="text-xl md:text-2xl">{item.icon}</div>
              <span className="text-sm md:text-base">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
