import {
  LuCalendarCheck,
  LuGoal,
  LuLayoutDashboard,
  LuSettings,
  LuStar,
} from "react-icons/lu";

function NavBar() {
  const navigation_menu = [
    { name: "Dashboard", icon: <LuLayoutDashboard /> },
    { name: "My Skills", icon: <LuCalendarCheck /> },
    { name: "Projects", icon: <LuStar /> },
    { name: "Goals", icon: <LuGoal /> },
    { name: "Settings", icon: <LuSettings /> },
  ];

  return (
    <div className="border-4 border-emerald-700 max-sm:fixed max-sm:w-[100vw] md:w-[20%] md:h-[100vh] max-sm:bottom-0 flex max-sm:justify-between max-sm:px-5 md:flex-col md:gap-3">
      {navigation_menu.map((nav, index) => (
        <button
          className="flex flex-col md:flex-row items-center md:gap-2"
          key={index}
        >
          {nav.icon}
          <span>{nav.name}</span>
        </button>
      ))}
    </div>
  );
}

export default NavBar;
