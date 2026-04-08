import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
