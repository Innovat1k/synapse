export default function SkillLinksSkeleton() {
  return (
    <section className="my-8" data-testid="skill-links-skeleton">
      {/* Label Squelette */}
      <div className="h-5 bg-slate-800/60 rounded w-32 mb-4 animate-pulse" />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Column 1 - Incoming Links Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/50 animate-pulse">
            {/* Title placeholder */}
            <div className="h-3 bg-slate-700/50 rounded w-1/3 mb-4"></div>

            {/* Pills placeholders */}
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-24 bg-slate-800/40 rounded-lg border border-slate-700/20"></div>
              <div className="h-7 w-32 bg-slate-800/40 rounded-lg border border-slate-700/20"></div>
              <div className="h-7 w-20 bg-slate-800/40 rounded-lg border border-slate-700/20"></div>
            </div>
          </div>
        </div>

        {/* Column 2 - Outgoing Links Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/50 animate-pulse">
            {/* Title placeholder */}
            <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-4"></div>

            {/* Pills placeholders */}
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-28 bg-slate-800/40 rounded-lg border border-slate-700/20"></div>
              <div className="h-7 w-24 bg-slate-800/40 rounded-lg border border-slate-700/20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
