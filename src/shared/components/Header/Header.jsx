import { Avatar } from "radix-ui"; // ✅ Correction d'import
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

function Header({ signOut, user }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 bg-white">
      <Link
        to="/"
        className="text-xl md:text-2xl font-bold text-gray-800 uppercase"
      >
        Synapse
      </Link>

      <div className="flex items-center gap-4">
        <button
          aria-label="Search"
          className="text-gray-500 hover:text-gray-700"
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
            <Avatar.Fallback className="flex items-center justify-center bg-gray-200 text-gray-600 font-medium">
              {user?.name && user?.name.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>

          <div className="hidden sm:flex flex-col text-sm">
            <span className="font-bold">{user?.email}</span>
            <p className="text-gray-500">{user?.region}</p>
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
