import Card from "./Card";

function MetricCard({ title, value, subtitle, icon, color = "text-teal-400" }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <div className={`${color} text-3xl mb-2`}>{icon}</div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-sm text-slate-400">{subtitle}</div>
      <div className="text-xs mt-1 text-slate-500">{title}</div>
    </Card>
  );
}

export default MetricCard;
