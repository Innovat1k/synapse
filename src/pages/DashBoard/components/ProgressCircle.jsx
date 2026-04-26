const LEVEL_COLORS = {
  1: "#3b82f6", // Blue - Beginner
  2: "#06b6d4", // Cyan - Learning
  3: "#22c55e", // Green - Intermediate
  4: "#eab308", // Yellow - Advanced
  5: "#a855f7", // Purple - Expert/Master
};

const ProgressCircle = ({ value, level = 1, size = 100, strokeWidth = 10 }) => {
  // Dynamic color depending on the level
  const color = LEVEL_COLORS[level] || LEVEL_COLORS[1];

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Percentage in center */}
      <span className="absolute text-xl font-bold text-slate-100">
        {Math.round(value)}%
      </span>
    </div>
  );
};

export default ProgressCircle;
