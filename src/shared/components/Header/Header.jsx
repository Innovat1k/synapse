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
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b border-slate-800/60 bg-[#0a0e1a]/80 backdrop-blur-md">
      <Link
        to="/"
        className="flex items-center gap-3 group transition-all duration-200 active:scale-95"
      >
        <div className="relative w-9 h-9 flex items-center justify-center">
          <img
            src="/logo-neural.png"
            alt="Synapse Logo"
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          />
        </div>
        <span className="text-xl md:text-2xl font-bold text-slate-50 tracking-tighter uppercase">
          Synapse
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs font-bold text-slate-100 truncate max-w-45">
              {user?.email}
            </span>
            <p className="text-[10px] text-cyan-400 font-medium uppercase tracking-widest">
              {user?.region || "Neural Node"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className={`
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border group
    /* Typo ciselée */
    text-[10px] font-bold uppercase tracking-[0.15em]
    /* Interaction dynamique du curseur */
    ${
      isSigningOut
        ? "bg-slate-800/50 text-slate-500 border-slate-700/30 cursor-not-allowed"
        : "bg-[#1a2332] hover:bg-[#232d3f] text-slate-200 border-blue-800/50 hover:border-rose-500/50 active:scale-95 cursor-pointer shadow-sm"
    }
  `}
          >
            {isSigningOut ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LuLogOut
                size={16}
                className="text-cyan-400 transition-colors duration-300 group-hover:text-rose-400"
              />
            )}
            <span className="text-[10px] font-bold capitalize tracking-[0.15em] transition-colors duration-300 group-hover:text-rose-100">
              {isSigningOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
