import { LuCircleX, LuInfo } from "react-icons/lu";
import { Link } from "react-router-dom";

function FallbackComponent({ message, type = "info" }) {
  const icons = {
    info: <LuInfo size={28} className="text-gray-400" />,
    error: <LuCircleX size={28} className="text-red-500" />,
  };

  const fallback_message = "This page is currently under development.";

  const containerStyles =
    "flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md text-center";
  const textStyles = "mt-2 text-gray-600";

  return (
    <div className={containerStyles}>
      <div className="mb-2">{icons[type]}</div>
      <p className={textStyles}>{fallback_message}</p>
      <Link to="/dashboard" className="font-bold text-emerald-600">
        Return back
      </Link>
    </div>
  );
}

export default FallbackComponent;
