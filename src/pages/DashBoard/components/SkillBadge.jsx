function SkillBadge({ name, level, color = "bg-purple-600" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${color} text-white`}
    >
      {name} <span className="ml-1">Lv.{level}</span>
    </span>
  );
}

export default SkillBadge;
