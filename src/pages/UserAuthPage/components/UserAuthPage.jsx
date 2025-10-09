import { Link, useOutletContext } from "react-router-dom";
import ButtonSpinner from "../../../shared/components/ButtonSpinner";
import { LuCircleAlert } from "react-icons/lu";
import { useFormValidation } from "../../../shared/hooks/useFormValidation/useFormValidation";
import { AnimatePresence, motion } from "framer-motion";

function UserAuthPage() {
  const { isLogin, loader, methods, formData, touched } = useOutletContext();
  const validation = useFormValidation(formData, isLogin);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-xl">
        <img
          className="w-30 mx-auto"
          src="/app-auth-bg.png"
          alt="Synapse Logo"
        />
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>

        <form
          className="space-y-4"
          onSubmit={isLogin ? methods.handleSignIn : methods.handleSignUp}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`mt-1 w-full p-2 border ${
                shouldDisplayError("email")
                  ? "border-red-600"
                  : "border-gray-300"
              }  rounded focus:outline-none focus:ring-1 focus:ring-emerald-500`}
              onBlur={(e) => methods.handleBlur(e)}
              onChange={(e) => methods.handleChange(e)}
              required
              value={formData.email}
            />
            <AnimatePresence>
              {shouldDisplayError("email") && (
                <motion.p
                  className="flex items-center text-sm text-red-600 mt-1 space-x-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LuCircleAlert className="w-4 h-4 text-red-600 flex-shrink-0" />{" "}
                  <span>{validation.errors.email}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`mt-1 w-full p-2 border ${
                shouldDisplayError("password")
                  ? "border-red-600"
                  : "border-gray-300"
              }  rounded focus:outline-none focus:ring-1 focus:ring-emerald-500`}
              onBlur={(e) => methods.handleBlur(e)}
              onChange={(e) => methods.handleChange(e)}
              required
              value={formData.password}
            />
            <AnimatePresence>
              {shouldDisplayError("password") && (
                <motion.p
                  className="flex items-center text-sm text-red-600 mt-1 space-x-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LuCircleAlert className="w-4 h-4 text-red-600 flex-shrink-0" />{" "}
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`mt-1 w-full p-2 border ${
                    shouldDisplayError("confirmPassword")
                      ? "border-red-600"
                      : "border-gray-300"
                  } rounded focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                  onBlur={(e) => methods.handleBlur(e)}
                  onChange={(e) => methods.handleChange(e)}
                  required
                  value={formData.confirmPassword}
                />
                <AnimatePresence>
                  {shouldDisplayError("confirmPassword") && (
                    <motion.p
                      className="flex items-center text-sm text-red-600 mt-1 space-x-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <LuCircleAlert className="w-4 h-4 text-red-600 flex-shrink-0" />{" "}
                      <span>{validation.errors.confirmPassword}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
            disabled={!validation.isValid || loader.isSubmitting}
          >
            {loader.isSubmitting ? <ButtonSpinner /> : buttonText}
          </button>
        </form>

        <div className="mt-4 text-center">
          {isLogin && (
            <Link to="#" className="text-sm text-emerald-600 hover:underline">
              Forgot Password?
            </Link>
          )}
          <p className="mt-2 text-sm text-gray-600">
            {linkText}{" "}
            <Link
              to="#"
              onClick={methods.handleToggleAuth}
              className="text-emerald-600 hover:underline"
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
