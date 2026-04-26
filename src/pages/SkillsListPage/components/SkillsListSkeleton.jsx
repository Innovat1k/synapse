const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-slate-800/60 rounded ${className}`} />
);

const SkillsListSkeleton = () => {
  const SKELETON_ROWS = 8;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 p-6 md:p-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <SkeletonPulse className="h-8 w-56" />
        <SkeletonPulse className="h-6 w-12 rounded-lg" />
      </div>

      {/* Toolbar Skeleton (Search, Filter, Button) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <SkeletonPulse className="h-10 w-full rounded-xl" />
          </div>
          {/* Filter Select */}
          <div className="relative w-full sm:w-48">
            <SkeletonPulse className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Add Button */}
        <SkeletonPulse className="h-10 w-full md:w-auto rounded-xl" />
      </div>

      {/* Main Content Area (Table/Card container) */}
      <div className="bg-[#0f1420]/80 backdrop-blur-md rounded-xl border border-slate-800/50 overflow-hidden">
        {/* Desktop Table Header Simulation */}
        <div className="hidden md:grid grid-cols-5 gap-4 p-6 border-b border-slate-800/50 bg-[#1a2332]/40">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={`th-${i}`} className="h-4 w-20" />
          ))}
        </div>

        {/* Rows Simulation */}
        <div className="divide-y divide-slate-800/50">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div
              key={`row-${i}`}
              className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4 items-center"
            >
              {/* Name + Icon */}
              <div className="flex items-center gap-3 col-span-1">
                <SkeletonPulse className="h-8 w-8 rounded-lg shrink-0" />
                <SkeletonPulse className="h-4 w-24" />
              </div>

              {/* Category (Hidden on mobile) */}
              <div className="hidden md:block">
                <SkeletonPulse className="h-4 w-20" />
              </div>

              {/* Progress/Level */}
              <div className="col-span-1">
                <SkeletonPulse className="h-2 w-full rounded-full" />
              </div>

              {/* Status/Badge */}
              <div className="hidden md:block">
                <SkeletonPulse className="h-6 w-16 rounded-full" />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <SkeletonPulse className="h-8 w-8 rounded-lg" />
                <SkeletonPulse className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsListSkeleton;
