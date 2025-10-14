// Mocked Progress chart to be replaced with real chart on Phase 5
function WeeklyProgressChart() {
  const data = [
    { day: "M", hours: 5 },
    { day: "Tu", hours: 7 },
    { day: "W", hours: 6 },
    { day: "Th", hours: 8 },
    { day: "F", hours: 5 },
    { day: "Sa", hours: 10 },
    { day: "Su", hours: 9 },
  ];

  const maxHours = Math.max(...data.map((d) => d.hours));
  const width = 300;
  const height = 120;
  const padding = 20;

  const getX = (i) => padding + (i * (width - 2 * padding)) / (data.length - 1);
  const getY = (hours) =>
    height - padding - (hours / maxHours) * (height - 2 * padding);

  const pathData = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.hours)}`)
    .join(" ");
  return (
    <div className="relative">
      <h3 className="text-sm font-medium mb-2">Weekly Progress</h3>
      <div className="text-xs text-gray-500 mb-2">Planned for Phase 5</div>

      <svg width={width} height={height} className="bg-gray-900. rounded">
        {/* Y Axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="1"
        />
        {/* X Axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="1"
        />

        {/* Horizontal grid */}
        {[0, 10, 20, 30].map((val, i) => (
          <line
            key={i}
            x1={padding}
            y1={height - padding - (val / 30) * (height - 2 * padding)}
            x2={width - padding}
            y2={height - padding - (val / 30) * (height - 2 * padding)}
            stroke="#374151"
            strokeWidth="0.5"
            strokeDasharray="4"
          />
        ))}

        {/* Progress line */}
        <path
          d={pathData}
          fill="none"
          stroke="#00ffaa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.hours)}
            r="4"
            fill="#00ffaa"
            stroke="#000"
            strokeWidth="1"
          />
        ))}

        {/* Daily label */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - padding + 15}
            textAnchor="middle"
            className="text-xs fill-gray-400"
          >
            {d.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default WeeklyProgressChart;
