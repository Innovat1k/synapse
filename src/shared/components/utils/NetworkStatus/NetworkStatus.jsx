import { LuWifi, LuWifiOff } from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useIsOnline } from "./hooks/useNetworkStatus";

export const NetworkStatus = () => {
  const isOnline = useIsOnline();

  if (isOnline) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-3 sm:px-4"
      >
        {/* Main Status Card */}
        <div
          className="
          flex items-center gap-3 sm:gap-4
          px-4 sm:px-5 py-3 sm:py-4
          bg-[#0f1420]/95 
          border border-rose-500/30
          rounded-lg
          shadow-lg shadow-rose-500/10
          backdrop-blur-md
          ring-1 ring-rose-500/20
        "
        >
          {/* Alert Icon with pulse */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 animate-pulse bg-rose-500/20 rounded-full blur-sm" />
            <div className="relative p-2 bg-rose-500/15 rounded-lg border border-rose-500/30">
              <LuWifiOff className="text-rose-400" size={18} />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-50 leading-tight capitalize">
              Offline Mode
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
              No internet connection. Changes will sync when back online.
            </p>
          </div>

          {/* Retry Indicator (optional) */}
          <motion.div
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 rounded-md border border-rose-500/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-rose-400/80">
              Retry
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NetworkStatus;
