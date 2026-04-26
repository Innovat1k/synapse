import { Link } from "react-router-dom";
import { LuMailCheck } from "react-icons/lu";

function CheckEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0e1a] p-4">
      <div className="p-8 w-full max-w-md bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50 shadow-2xl shadow-slate-950/50 text-center">
        <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-8 shadow-lg shadow-cyan-500/20">
          <LuMailCheck className="w-10 h-10 text-cyan-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-50 mb-4 tracking-tight">
          Check Your Email
        </h2>

        {/* Body content */}
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          A confirmation link has been sent to your email address. Please click
          the link in the email to activate your account.
        </p>

        {/* Helper Note */}
        <div className="p-3 bg-[#1a2332]/50 rounded-lg mb-8 border border-slate-800/50">
          <p className="text-xs text-slate-500 font-regular italic">
            You may close this window. Once verified, return to the login page.
          </p>
        </div>

        <Link
          to="/auth"
          className="w-full inline-block bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all duration-200 active:scale-95"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}

export default CheckEmailPage;
