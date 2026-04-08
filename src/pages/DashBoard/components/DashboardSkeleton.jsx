const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-slate-800/60 rounded-md ${className}`} />
);

const CardSkeleton = ({ children, className = "" }) => (
  <div
    className={`bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 ${className}`}
  >
    {children}
  </div>
);

const DashboardSkeleton = () => {
  const SKELETON_ITEMS = {
    goals: 3,
    badges: 8,
    skills: 6,
    timeline: 4,
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <SkeletonPulse className="h-9 w-48" />
        <SkeletonPulse className="h-10 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*---Colomn 1 : Focus & Metrics ---*/}
        <div className="space-y-6">
          <CardSkeleton>
            <SkeletonPulse className="h-6 w-32 mb-6" />
            <div className="flex items-center justify-between mb-8">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-16 ml-auto" />
                <SkeletonPulse className="h-8 w-24 ml-auto" />
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: SKELETON_ITEMS.goals }).map((_, i) => (
                <div key={`goal-${i}`} className="flex gap-2">
                  <SkeletonPulse className="h-5 w-5 rounded-full shrink-0" />
                  <SkeletonPulse className="h-5 w-full" />
                </div>
              ))}
            </div>
          </CardSkeleton>

          <CardSkeleton>
            <SkeletonPulse className="h-6 w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: SKELETON_ITEMS.badges }).map((_, i) => (
                <SkeletonPulse
                  key={`badge-${i}`}
                  className="h-7 w-20 rounded-full"
                />
              ))}
            </div>
          </CardSkeleton>
        </div>

        {/*---Colomn 2 : Skills Grid  ---*/}
        <div className="space-y-6 lg:col-span-1">
          <CardSkeleton className="h-full">
            <div className="flex justify-between items-center mb-8">
              <SkeletonPulse className="h-7 w-40" />
              <SkeletonPulse className="h-10 w-28 rounded-lg" />
            </div>

            {/*Filters */}
            <div className="flex gap-3 mb-8">
              <SkeletonPulse className="h-10 w-36 rounded-xl" />
              <SkeletonPulse className="h-10 w-36 rounded-xl" />
            </div>

            {/*Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: SKELETON_ITEMS.skills }).map((_, i) => (
                <div
                  key={`skill-${i}`}
                  className="p-4 border border-slate-800/50 rounded-xl space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <SkeletonPulse className="h-5 w-28" />
                    <SkeletonPulse className="h-4 w-8" />
                  </div>
                  <SkeletonPulse className="h-1.5 w-full rounded-full opacity-40" />
                </div>
              ))}
            </div>
          </CardSkeleton>
        </div>

        {/* --- Colomn 3 : Timeline & Graph --- */}
        <div className="space-y-6">
          <CardSkeleton>
            <SkeletonPulse className="h-6 w-44 mb-6" />
            <div className="space-y-6">
              {Array.from({ length: SKELETON_ITEMS.timeline }).map((_, i) => (
                <div key={`time-${i}`} className="flex gap-4">
                  <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-2 w-full">
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardSkeleton>

          {/* Graph Placeholder */}
          <CardSkeleton className="h-80 flex flex-col">
            <div className="flex justify-between mb-6">
              <SkeletonPulse className="h-6 w-32" />
              <SkeletonPulse className="h-6 w-10" />
            </div>
            <div className="flex-1 bg-slate-950/40 rounded-xl border border-slate-800/30 flex items-center justify-center">
              <SkeletonPulse className="h-32 w-32 rounded-full opacity-10" />
            </div>
          </CardSkeleton>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
