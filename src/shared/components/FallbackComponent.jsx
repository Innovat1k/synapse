import { LuCircleX, LuInfo } from "react-icons/lu";
import { Link } from "react-router-dom";

const fallback_message = "This page is currently under development.";

function FallbackComponent({ message = fallback_message, type = "info" }) {
  const icons = {
    info: <LuInfo size={32} className="text-slate-500" />,
    error: <LuCircleX size={32} className="text-rose-400" />,
  };

  const containerStyles =
    "flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-slate-800/50 rounded-xl text-center";
  const textStyles = "mt-4 text-slate-400 text-sm leading-relaxed";

  return (
    <div className={containerStyles}>
      <div className="mb-4 p-4 bg-slate-800/40 rounded-lg">{icons[type]}</div>
      <p className={textStyles}>{message}</p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-2.5 font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
      >
        Return back
      </Link>
    </div>
  );
}

export default FallbackComponent;
