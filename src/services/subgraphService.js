import { getSupabase } from "./supabase.lazy";

export const fetchSubgraph = async (centerSkillId) => {
  if (!centerSkillId) {
    return { nodes: [], links: [] };
  }

  // Fetching the links (UUID friendly)
  const supabase = await getSupabase();
  const { data: directLinks, error: linksError } = await supabase
    .from("synapse_skill_links")
    .select("source_skill_id, target_skill_id")
    .or(
      `source_skill_id.eq.${centerSkillId},target_skill_id.eq.${centerSkillId}`,
    );

  if (linksError) {
    throw linksError;
  }

  const skillIds = new Set([centerSkillId]);

  // Formatting the links
  const links = directLinks.map((link) => {
    skillIds.add(link.source_skill_id);
    skillIds.add(link.target_skill_id);

    return {
      source: link.source_skill_id,
      target: link.target_skill_id,
      relationType:
        link.target_skill_id === centerSkillId ? "prerequisite" : "unlock",
    };
  });

  // Fetching details (Excluding 'status' as it’s not in the DB yet)
  const cleanIds = Array.from(skillIds).filter((id) => !!id);

  const { data: skills, error: skillsError } = await supabase
    .from("synapse_skills")
    .select("skill_id, name, level")
    .in("skill_id", cleanIds);

  if (skillsError) {
    throw skillsError;
  }

  // Final mapping for the GraphView
  const nodes = skills.map((skill) => ({
    id: skill.skill_id,
    label: skill.name,
    level: skill.level,
    status: "available",
    isCenter: skill.skill_id === centerSkillId,
  }));

  return { nodes, links };
};
