const SettingsSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 bg-slate-800/60 rounded w-32 mb-2" />
        <div className="h-4 bg-slate-800/60 rounded w-96" />
      </div>

      {/* Quick Action Card */}
      <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-800/60 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-slate-800/60 rounded w-48" />
            <div className="h-4 bg-slate-800/60 rounded w-full" />
            <div className="h-10 bg-slate-800/60 rounded w-40" />
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Personal Section */}
        <div>
          <div className="h-4 bg-slate-800/60 rounded w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800/50"
              >
                <div className="w-10 h-10 bg-slate-800/60 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-800/60 rounded w-32" />
                  <div className="h-4 bg-slate-800/60 rounded w-64" />
                </div>
                <div className="w-5 h-5 bg-slate-800/60 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Application Section */}
        <div>
          <div className="h-4 bg-slate-800/60 rounded w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800/50"
              >
                <div className="w-10 h-10 bg-slate-800/60 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-800/60 rounded w-32" />
                  <div className="h-4 bg-slate-800/60 rounded w-64" />
                </div>
                <div className="w-5 h-5 bg-slate-800/60 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;
