function Card({ children, className = "", dataTestId }) {
  return (
    <div
      className={`
        bg-[#0f1420]/80 
        backdrop-blur-xl 
        border border-slate-800/50 
        rounded-xl 
        p-6 
        transition-all duration-300 ease-out
        hover:border-cyan-500/30 
        hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]
        hover:-translate-y-0.5
        ${className}
      `}
      data-testid={`${dataTestId}-widget`}
    >
      {/* Subtle top shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/2 to-transparent pointer-events-none rounded-xl" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default Card;
