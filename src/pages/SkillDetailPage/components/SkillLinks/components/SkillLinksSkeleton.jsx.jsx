export default function SkillLinksSkeleton() {
  return (
    <section className="my-8" data-testid="skill-links-skeleton">
      <h3 className="text-lg font-medium text-slate-200 mb-3">
        Skill Connections
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Column 1 */}
        <div className="flex-1 min-w-0">
          <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/30 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 bg-slate-800/50 rounded-full"></div>
              <div className="h-6 w-24 bg-slate-800/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex-1 min-w-0">
          <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/30 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-28 bg-slate-800/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
