import { Link, useOutletContext } from "react-router-dom";
import ButtonSpinner from "../../shared/components/ButtonSpinner";
import { LuCircleAlert } from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import {
  formDataAtom,
  isLoginAtom,
  touchedAtom,
} from "../../atoms/formDataAtom";
import { useAuth } from "./hooks/useAuth";
import { useFormValidation } from "./hooks/useFormValidation";

function UserAuthPage() {
  const formData = useAtomValue(formDataAtom);
  const touched = useAtomValue(touchedAtom);
  const isLogin = useAtomValue(isLoginAtom);

  const { loader, methods } = useAuth();
  const validation = useFormValidation(formData, isLogin);

  // UI helpers
  const title = isLogin ? "Sign In" : "Sign Up";
  const buttonText = isLogin ? "Sign In" : "Sign Up";
  const linkText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const linkActionText = isLogin ? "Sign up" : "Sign in";

  //
  const shouldDisplayError = (field) =>
    touched[field] && validation.errors[field];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="p-8 w-full max-w-md bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-xl">
        <img
          className="w-30 mx-auto"
          src="/app-auth-bg.png"
          alt="Synapse Logo"
        />
        <h2 className="text-2xl font-bold text-slate-100 text-center mb-6">
          {title}
        </h2>

        <form
          className="space-y-4"
          onSubmit={isLogin ? methods.handleSignIn : methods.handleSignUp}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`mt-1 w-full p-2.5 bg-slate-800/30 border ${
                shouldDisplayError("email")
                  ? "border-red-500"
                  : "border-slate-600"
              } rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 transition-colors text-slate-100`}
              onBlur={(e) => methods.handleBlur(e)}
              onChange={(e) => methods.handleChange(e)}
              required
              value={formData.email}
            />
            <AnimatePresence>
              {shouldDisplayError("email") && (
                <motion.p
                  className="flex items-center text-sm text-red-400 mt-1 space-x-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LuCircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />{" "}
                  <span>{validation.errors.email}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`mt-1 w-full p-2.5 bg-slate-800/30 border ${
                shouldDisplayError("password")
                  ? "border-red-500"
                  : "border-slate-600"
              } rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 transition-colors text-slate-100`}
              onBlur={(e) => methods.handleBlur(e)}
              onChange={(e) => methods.handleChange(e)}
              required
              value={formData.password}
            />
            <AnimatePresence>
              {shouldDisplayError("password") && (
                <motion.p
                  className="flex items-center text-sm text-red-400 mt-1 space-x-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LuCircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />{" "}
                  <span>{validation.errors.password}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-400"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`mt-1 w-full p-2.5 bg-slate-800/30 border ${
                    shouldDisplayError("confirmPassword")
                      ? "border-red-500"
                      : "border-slate-600"
                  } rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 transition-colors text-slate-100`}
                  onBlur={(e) => methods.handleBlur(e)}
                  onChange={(e) => methods.handleChange(e)}
                  required
                  value={formData.confirmPassword}
                />
                <AnimatePresence>
                  {shouldDisplayError("confirmPassword") && (
                    <motion.p
                      className="flex items-center text-sm text-red-400 mt-1 space-x-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <LuCircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />{" "}
                      <span>{validation.errors.confirmPassword}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-800/50 disabled:cursor-not-allowed"
            disabled={!validation.isValid || loader.isSubmitting}
          >
            {loader.isSubmitting ? <ButtonSpinner /> : buttonText}
          </button>
        </form>

        <div className="mt-4 text-center">
          {isLogin && (
            <Link to="#" className="text-sm text-teal-400 hover:underline">
              Forgot Password?
            </Link>
          )}
          <p className="mt-2 text-sm text-slate-400">
            {linkText}{" "}
            <Link
              to="#"
              onClick={methods.handleToggleAuth}
              className="text-teal-400 hover:underline"
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
