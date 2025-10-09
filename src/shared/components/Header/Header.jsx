// import { Avatar } from "@radix-ui/react-avatar";
import { Avatar } from "radix-ui";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

function Header() {
  const user = {
    name: "Simon",
    region: "Switzerland",
    avatarUrl: "/user-img",
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
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
              src={user.avatarUrl}
              alt={`Avatar of ${user.name}`}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback className="flex items-center justify-center bg-gray-200 text-gray-600 font-medium">
              {user.name.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>

          <div className="max-sm:hidden flex flex-col text-sm">
            <span className="font-bold">{user.name}</span>
            <p className="text-gray-500">{user.region}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
