function SkillSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-5 md:px-6 py-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-3"></div>
            <div className="h-4 w-32 bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-10 bg-slate-800 rounded-full animate-pulse"></div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 sm:p-5 mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 md:mb-5">
            <div className="h-6 w-20 bg-teal-400/20 border border-teal-400/40 rounded-full animate-pulse"></div>
            <div className="h-6 w-28 bg-slate-800/50 border border-slate-700/50 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-800 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Tags placeholder */}
        <div className="my-6">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-slate-800/40 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Activities skeleton */}
        <div className="space-y-3 pt-4">
          <div className="h-5 w-32 bg-slate-800 rounded animate-pulse mb-3"></div>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-800/40 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillSkeleton;
