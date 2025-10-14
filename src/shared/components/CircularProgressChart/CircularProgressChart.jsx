function CircularProgressChart({
  value,
  label,
  size = 100,
  strokeWidth = 10,
  color = "#3b82f6",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset: offset }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-xl font-bold text-gray-800">{value}%</span>
      {label && (
        <span className="absolute top-full mt-2 text-xs text-gray-500">
          {label}
        </span>
      )}
    </div>
  );
}

export default CircularProgressChart;
