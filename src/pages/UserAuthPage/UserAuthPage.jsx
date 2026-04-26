import { Link } from "react-router-dom";
import ButtonSpinner from "@shared/components/ButtonSpinner";
import { LuCircleAlert } from "react-icons/lu";
import { useAtomValue } from "jotai";
import { formDataAtom, isLoginAtom, touchedAtom } from "@atoms/formDataAtom";
import { useAuth } from "./hooks/useAuth";
import { useFormValidation } from "./hooks/useFormValidation";
import { AnimatePresence, motion } from "framer-motion";

function UserAuthPage() {
  const formData = useAtomValue(formDataAtom);
  const touched = useAtomValue(touchedAtom);
  const isLogin = useAtomValue(isLoginAtom);

  const { loader, methods } = useAuth();
  const validation = useFormValidation(formData, isLogin);

  // UI helpers
  const title = isLogin ? "Sign In" : "Sign Up";
  const linkText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const linkActionText = isLogin ? "Sign up" : "Sign in";

  const shouldDisplayError = (field) =>
    touched[field] && validation.errors[field];

  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <div className="p-8 w-full max-w-md bg-[#0f1420]/80 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-2xl shadow-cyan-900/10">
        <div className="relative mb-8 text-center">
          <div
            className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full"
            aria-hidden="true"
          />

          <img
            className="w-24 mx-auto relative drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            src="/logo.svg"
            alt="Synapse Logo"
          />
        </div>

        <h2 className="text-2xl font-bold text-slate-50 text-center mb-8 tracking-tight uppercase">
          {title}
        </h2>

        <form
          className="space-y-5"
          onSubmit={isLogin ? methods.handleSignIn : methods.handleSignUp}
        >
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 bg-[#1a2332]/60 border transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-100 ${
                shouldDisplayError("email")
                  ? "border-rose-500/50 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                  : "border-slate-800/60 focus:border-cyan-400/50"
              }`}
              onBlur={(e) => methods.handleBlur(e)}
              onChange={(e) => methods.handleChange(e)}
              required
              value={formData.email}
              placeholder="Enter your email"
            />
            <AnimatePresence>
              {shouldDisplayError("email") && (
                <motion.p
                  className="flex items-center text-xs text-rose-400 mt-1.5 px-1 space-x-2 font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{validation.errors.email}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 bg-[#1a2332]/60 border transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-100 ${
                shouldDisplayError("password")
                  ? "border-rose-500/50 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                  : "border-slate-800/60 focus:border-cyan-400/50"
              }`}
              onBlur={(e) => methods.handleBlur(e)}
              onChange={(e) => methods.handleChange(e)}
              required
              value={formData.password}
              placeholder="••••••••"
            />
            <AnimatePresence>
              {shouldDisplayError("password") && (
                <motion.p
                  className="flex items-center text-xs text-rose-400 mt-1.5 px-1 space-x-2 font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{validation.errors.password}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Confirm Password Field */}
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`w-full px-4 py-3 bg-[#1a2332]/60 border transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-100 ${
                    shouldDisplayError("confirmPassword")
                      ? "border-rose-500/50 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                      : "border-slate-800/60 focus:border-cyan-400/50"
                  }`}
                  onBlur={(e) => methods.handleBlur(e)}
                  onChange={(e) => methods.handleChange(e)}
                  required
                  value={formData.confirmPassword}
                  placeholder="••••••••"
                />
                <AnimatePresence>
                  {shouldDisplayError("confirmPassword") && (
                    <motion.p
                      className="flex items-center text-xs text-rose-400 mt-1.5 px-1 space-x-2 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>{validation.errors.confirmPassword}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full capitalize bg-linear-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 font-bold shadow-lg shadow-cyan-500/20 disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] mt-4 cursor-pointer"
            disabled={!validation.isValid || loader.isSubmitting}
          >
            {loader.isSubmitting ? (
              <ButtonSpinner
                label={title === "Sign In" ? "Signing in..." : "Signing up..."}
              />
            ) : (
              title
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          {isLogin && (
            <Link
              to="#"
              className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          )}
          <p className="text-sm text-slate-500">
            {linkText}{" "}
            <Link
              to="#"
              onClick={methods.handleToggleAuth}
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all font-bold"
            >
              {linkActionText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserAuthPage;
