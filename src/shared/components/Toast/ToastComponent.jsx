import { useToast } from "./hooks/useToast";
import { useAtomValue } from "jotai";
import { notification_atom } from "@atoms/atoms";
import { LuCircleCheck, LuCircleX, LuX } from "react-icons/lu";
import * as Toast from "@radix-ui/react-toast";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function ToastComponent() {
  const { closeNotif } = useToast();
  const notif = useAtomValue(notification_atom);

  const isError = notif.type === "error";
  const icon = isError ? (
    <LuCircleX className="w-5 h-5" />
  ) : (
    <LuCircleCheck className="w-5 h-5" />
  );
  const colorClasses = isError
    ? "bg-red-600 border-red-700"
    : "bg-emerald-600 border-emerald-700";

  return (
    <>
      <Toast.Viewport className="fixed top-0 right-0 p-4 z-2000 max-w-sm w-full outline-none" />
      <AnimatePresence>
        {notif.isVisible && (
          <Toast.Root asChild open={notif.isVisible} onOpenChange={closeNotif}>
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`
         ${colorClasses} 
          text-slate-100 border-b-4 p-4 rounded-xl shadow-2xl flex items-start space-x-3 cursor-default transition-colors fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-11/12 max-w-lg z-2000 
        `}
            >
              <div className="shrink-0 pt-0.5">{icon}</div>

              <div className="grow">
                <Toast.Title className="font-semibold text-lg capitalize mb-1 text-slate-100">
                  {notif.type || (isError ? "Error" : "Success")}
                </Toast.Title>

                <Toast.Description className="text-sm font-light leading-snug text-slate-300">
                  {notif.message}
                </Toast.Description>
              </div>

              <Toast.Close asChild>
                <button
                  className="shrink-0 ml-4 p-1 rounded-full hover:bg-slate-800/50 transition-colors"
                  aria-label="Close"
                >
                  <LuX className="w-4 h-4 text-slate-400" />
                </button>
              </Toast.Close>
            </motion.div>
          </Toast.Root>
        )}
      </AnimatePresence>
    </>
  );
}

export default ToastComponent;
