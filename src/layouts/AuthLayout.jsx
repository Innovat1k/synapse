import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
      <div className="w-full max-w-md p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
