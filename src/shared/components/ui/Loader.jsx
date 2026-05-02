function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="flex gap-3 p-4 rounded-xl bg-slate-900/90 shadow-2xl shadow-slate-950/50 border border-slate-800/50">
        {/* First point : Cyan */}
        <div
          className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/30"
          style={{ animationDelay: "0s" }}
        ></div>

        {/* Second point : Blue (main color) */}
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/30"
          style={{ animationDelay: "0.2s" }}
        ></div>

        {/* Third point : Purple */}
        <div
          className="w-3 h-3 bg-violet-400 rounded-full animate-pulse shadow-lg shadow-violet-400/30"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}

export default Loader;
