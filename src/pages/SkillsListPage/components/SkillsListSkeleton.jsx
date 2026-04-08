const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-slate-800/60 rounded ${className}`} />
);

const SkillsListSkeleton = () => {
  const SKELETON_ROWS = 8;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <SkeletonPulse className="h-8 w-56" />
        <SkeletonPulse className="h-6 w-12 rounded-md" />
      </div>

      {/* Toolbar Skeleton (Search, Filter, Button) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <SkeletonPulse className="h-11.5 w-full rounded-lg" />
          </div>
          {/* Filter Select */}
          <div className="relative w-full sm:w-40">
            <SkeletonPulse className="h-11.5 w-full rounded-lg" />
          </div>
        </div>

        {/* Add Button */}
        <SkeletonPulse className="h-11.5 w-full md:w-40 rounded-lg" />
      </div>

      {/* Main Content Area (Table/Card container) */}
      <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
        {/* Desktop Table Header Simulation */}
        <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b border-slate-800/50 bg-slate-900/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={`th-${i}`} className="h-4 w-20" />
          ))}
        </div>

        {/* Rows Simulation */}
        <div className="divide-y divide-slate-800/50">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div
              key={`row-${i}`}
              className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4 items-center"
            >
              {/* Name + Icon */}
              <div className="flex items-center gap-3 col-span-1">
                <SkeletonPulse className="h-8 w-8 rounded-lg shrink-0" />
                <SkeletonPulse className="h-4 w-24" />
              </div>

              {/* Category (Hidden on very small mobile if needed) */}
              <div className="hidden md:block">
                <SkeletonPulse className="h-4 w-20" />
              </div>

              {/* Progress/Level */}
              <div className="col-span-1">
                <SkeletonPulse className="h-3 w-full rounded-full" />
              </div>

              {/* Status/Badge */}
              <div className="hidden md:block">
                <SkeletonPulse className="h-6 w-16 rounded-full" />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <SkeletonPulse className="h-8 w-8 rounded-md" />
                <SkeletonPulse className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsListSkeleton;
