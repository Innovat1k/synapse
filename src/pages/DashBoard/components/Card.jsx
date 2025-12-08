function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-5 transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
