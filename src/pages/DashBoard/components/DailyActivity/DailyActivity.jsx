import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LuClock, LuCircleAlert } from "react-icons/lu";

const DailyActivity = ({
  data = [],
  isLoading,
  error,
  height = 220,
  onBarClick,
}) => {
  // Normalize data
  const chartData = useMemo(() => {
    return (data || []).map((item) => ({
      ...item,
      hours: Math.round((item.total_minutes / 60) * 10) / 10,
    }));
  }, [data]);

  // Compute scale + max
  const { maxY, maxValue } = useMemo(() => {
    if (!chartData.length) {
      return { maxY: 1, maxValue: 0 };
    }

    const maxValue = Math.max(...chartData.map((d) => d.hours));
    const maxY = Math.ceil(maxValue);

    return { maxY, maxValue };
  }, [chartData]);

  if (isLoading) {
    return (
      <div
        className="w-full animate-pulse"
        style={{ height }}
        data-testid="daily-activity-skeleton"
      >
        <div className="h-full bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-6 text-slate-400"
        style={{ height }}
      >
        <LuCircleAlert size={24} />
        <p className="text-sm mt-2">Unable to load daily activity</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-6 text-slate-500"
        style={{ height }}
      >
        <LuClock size={24} />
        <p className="text-sm mt-2">No activities this week</p>
        <p className="text-xs opacity-70 mt-1">
          Your daily progress will appear here
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) {return null;}

    const d = payload[0].payload;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-bold text-teal-400">{d.hours}h</p>
        <p className="text-xs text-slate-500">
          {d.activities_count} session{d.activities_count > 1 && "s"}
        </p>
      </div>
    );
  };

  return (
    <div
      className="w-full"
      style={{ height }}
      data-testid="daily-activity-chart"
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
            opacity={0.3}
          />

          {/* X Axis */}
          <XAxis
            dataKey="day_label"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />

          {/* Y Axis */}
          <YAxis
            className="hidden sm:block"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={[0, maxY]}
            tickFormatter={(v) => `${v}h`}
            tickCount={4}
            width={30}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(20,184,166,0.08)" }}
          />

          {/* Bars */}
          <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => {
              const isBest = entry.hours === maxValue;

              return (
                <Cell
                  key={index}
                  fill={isBest ? "#14b8a6" : "#0f766e"}
                  opacity={isBest ? 1 : 0.6}
                  style={{
                    transition: "all 0.25s ease",
                    cursor: onBarClick ? "pointer" : "default",
                  }}
                  onClick={() => onBarClick?.(entry)}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyActivity;
