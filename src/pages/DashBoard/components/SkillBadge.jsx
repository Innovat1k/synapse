function SkillBadge({ name, level, color = "bg-slate-800/50 text-slate-200" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {name} <span className="ml-1">Lv.{level}</span>
    </span>
  );
}

export default SkillBadge;
