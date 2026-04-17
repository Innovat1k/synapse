import * as Avatar from "@radix-ui/react-avatar";
import { useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";

function Header({ signOut, user }) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-800/50 bg-slate-900/60 backdrop-blur-sm">
      <Link
        to="/"
        className="text-xl md:text-2xl font-bold text-slate-100 uppercase"
      >
        Synapse
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
            <Avatar.Image
              // src={"/user-img.jpeg"}
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
            onClick={handleLogout}
            disabled={isSigningOut}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs md:text-sm ${
              isSigningOut
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            }`}
          >
            {isSigningOut ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LuLogOut size={18} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
