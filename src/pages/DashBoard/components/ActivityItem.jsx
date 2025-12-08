function ActivityItem({ text, time }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
      <div>
        <p className="text-slate-300">{text}</p>
        <p className="text-slate-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}

export default ActivityItem;
