import { LuClock } from "react-icons/lu";
import { motion } from "framer-motion";

const ComingSoonPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-100 text-center"
    >
      <div className="p-4 bg-slate-800/50 rounded-2xl mb-4">
        <LuClock className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Coming Soon</h3>
      <p className="text-slate-500 text-sm max-w-sm">
        This settings page is under construction. Check back later for updates.
      </p>
    </motion.div>
  );
};

export default ComingSoonPage;
