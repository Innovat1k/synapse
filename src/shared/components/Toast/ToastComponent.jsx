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
    ? "bg-rose-600 border-rose-700/50"
    : "bg-cyan-600 border-cyan-700/50";

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
          text-white border-b-4 p-4 rounded-lg shadow-xl flex items-start gap-3 cursor-default transition-all fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm z-2000 
        `}
            >
              <div className="shrink-0 pt-0.5 flex-none">{icon}</div>

              <div className="flex-1 min-w-0">
                <Toast.Title className="font-bold text-base capitalize mb-1 text-white">
                  {notif.type || (isError ? "Error" : "Success")}
                </Toast.Title>

                <Toast.Description className="text-sm font-medium leading-snug text-white/90">
                  {notif.message}
                </Toast.Description>
              </div>

              <Toast.Close asChild>
                <button
                  className="shrink-0 ml-4 p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 flex-none"
                  aria-label="Close"
                >
                  <LuX className="w-4 h-4 text-white/80 hover:text-white" />
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
