function SkillLinksSkeleton() {
  return (
    <section className="mt-8" data-testid="skill-links-skeleton">
      <h3 className="text-lg font-medium text-slate-200 mb-3 capitalize">
        Synapse connections
      </h3>

      <div className="p-4 bg-slate-900/30 rounded-lg mb-6">
        <h4 className="text-sm font-semibold text-amber-500 flex items-center gap-1 mb-2">
          <div className="w-4 h-4 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-700 rounded animate-pulse w-1/4"></div>
        </h4>
        <div className="flex flex-wrap gap-2 p-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="px-2 py-1 rounded-full bg-slate-800/50 text-slate-700 text-xs font-medium border border-slate-700/50 animate-pulse"
            >
              <span className="opacity-0">Loading…</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillLinksSkeleton;
