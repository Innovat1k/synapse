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

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const WeeklyProgress = ({
  data = [],
  isLoading,
  error,
  height = 260,
  onBarClick,
}) => {
  // Normalize data once
  const chartData = useMemo(() => {
    return (data || []).map((item) => ({
      ...item,
      hours: Math.round((item.total_minutes / 60) * 10) / 10,
    }));
  }, [data]);

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
        data-testid="weekly-progress-skeleton"
      >
        <div className="h-full bg-slate-800/40 rounded-lg" />
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
        <p className="text-sm mt-2">Unable to load progress</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <div className="relative mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/50">
            <LuClock className="text-slate-500" size={24} />
          </div>
          <motion.div
            className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full scale-150 opacity-0 group-hover:opacity-100"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">
          No activities logged
        </h3>
        <p className="text-sm text-slate-500">
          Your weekly activity will appear here
        </p>
      </div>
    );
  }

  // Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const d = payload[0].payload;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-bold text-cyan-400">{d.hours}h</p>
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
      data-testid="weekly-progress-chart"
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          {/* Grid (subtle) */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
            opacity={0.3}
          />

          {/* X Axis */}
          <XAxis
            dataKey="week_label"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />

          {/* Y Axis (hidden on small screens via CSS) */}
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
            cursor={{ fill: "rgba(34,211,238,0.08)" }}
          />

          {/* Bars */}
          <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => {
              const isBest = entry.hours === maxValue;

              return (
                <Cell
                  key={index}
                  fill={isBest ? "#06b6d4" : "#0d9488"}
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

export default WeeklyProgress;
