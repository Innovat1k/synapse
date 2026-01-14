import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../../services/supabase-client";

/**
 * Fetches incoming skill-to-skill links for a given target skill.
 *
 * Retrieves all relationships where the provided `skillId` is the *target*,
 * and includes the name of the *source* skill via a join on `source_skill_id`.
 *
 * Each link represents a directional connection (e.g., "prerequisite", "related").
 *
 * @param {string} skillId - ID of the target skill (links point TO this skill)
 * @returns {import("@tanstack/react-query").UseQueryResult<
 *   Array<{
 *     id: string;
 *     source_skill_id: string;
 *     target_skill_id: string;
 *     type: string;
 *     skill_name: string;
 *   }>,
 *   Error
 * >} React Query result object containing the list of incoming links.
 */

// INCOMING links only (to this skill)
export const useIncomingSkillLinks = (skillId) => {
  return useQuery({
    queryKey: ["synapse-links", "incoming", skillId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("synapse_skill_links")
        .select(
          `
          id,
          source_skill_id,
          target_skill_id,
          type,
          skill:source_skill_id!inner(name)
        `
        )
        .eq("target_skill_id", skillId);

      if (error) throw error;

      return (data ?? []).map((link) => ({
        id: link.id,
        source_skill_id: link.source_skill_id,
        target_skill_id: link.target_skill_id,
        type: link.type,
        skill_name: link.skill?.name || "Unknown skill",
      }));
    },
    enabled: !!skillId,
  });
};

// OUTGOING links only (to this skill)
export const useOutgoingSkillLinks = (skillId) => {
  return useQuery({
    queryKey: ["skill-links", "outgoing", skillId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("synapse_skill_links")
        .select(
          `
          id,
          source_skill_id,
          target_skill_id,
          type,
          skill:target_skill_id!inner(name)
        `
        )
        .eq("source_skill_id", skillId);

      if (error) throw error;
      return (data ?? []).map((link) => ({
        id: link.id,
        source_skill_id: link.source_skill_id,
        target_skill_id: link.target_skill_id,
        type: link.type,
        skill_name: link.skill?.name || "Unknown skill",
      }));
    },
    enabled: !!skillId,
  });
};
