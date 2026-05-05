// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const Card = ({
  children,
  className = "",
  dataTestId,
  title,
  description,
  action,
}) => {
  return (
    <motion.div
      className={`
        relative
        bg-[#0f1420]/80 
        backdrop-blur-xl 
        border border-slate-800/50 
        rounded-xl 
        p-6 
        transition-all duration-300 ease-out
        hover:border-cyan-500/30 
        hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]
        hover:-translate-y-0.5
        group
        ${className}
      `}
      data-testid={`${dataTestId}-widget`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle top shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/2 to-transparent pointer-events-none rounded-xl" />

      <div className="relative z-10">
        {/* 🔹 Header – Titre + Description + Action */}
        {(title || action) && (
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="text-sm font-bold text-slate-100 tracking-tight capitalize">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-slate-500">{description}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
