import Card from "./Card";

function MetricCard({ title, value, subtitle, icon, color = "text-cyan-400" }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <div className={`${color} text-3xl mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
      <div className="text-xs mt-1 text-gray-500">{title}</div>
    </Card>
  );
}

export default MetricCard;
