import { Avatar } from "radix-ui"; // ✅ Correction d'import
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

function Header({ signOut, user }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-800/50 bg-slate-900/60 backdrop-blur-sm">
      <Link
        to="/"
        className="text-xl md:text-2xl font-bold text-slate-100 uppercase"
      >
        Synapse
      </Link>

      <div className="flex items-center gap-4">
        <button
          aria-label="Search"
          className="text-slate-400 hover:text-slate-200"
        >
          <LuSearch size={24} />
        </button>

        <div className="flex items-center gap-3">
          <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
            <Avatar.Image
              src={"/user-img.jpeg"}
              alt={`Avatar of ${user?.name}`}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback className="flex items-center justify-center bg-slate-700 text-slate-200 font-medium">
              {user?.name && user?.name.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>

          <div className="hidden sm:flex flex-col text-sm">
            <span className="font-bold text-slate-100">{user?.email}</span>
            <p className="text-slate-400">{user?.region}</p>
          </div>

          <button
            onClick={signOut}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs md:text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
