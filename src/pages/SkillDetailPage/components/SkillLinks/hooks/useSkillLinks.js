import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSkillLink,
  fetchIncomingSkillLinks,
  fetchOutgoingSkillLinks,
} from "../../../../../services/skillLinksService";

/**
 * Fetches incoming skill-to-skill links for a given target skill.
 *
 * Retrieves all relationships where the provided `skillId` is the *target*,
 * and includes the name of the *source* skill via a join on `source_skill_id`.
 *
 * Each link represents a directional connection (e.g., "prerequisite", "related").
 *
 * @param {string | null} skillId - ID of the target skill (links point TO this skill)
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
export const useIncomingSkillLinks = (skillId) => {
  return useQuery({
    queryKey: ["skill-links", "incoming", skillId],
    queryFn: () => fetchIncomingSkillLinks(skillId),
    enabled: !!skillId,
  });
};

/**
 * Fetches outgoing skill-to-skill links for a given source skill.
 *
 * Retrieves all relationships where the provided `skillId` is the *source*,
 * and includes the name of the *target* skill via a join on `target_skill_id`.
 *
 * @param {string | null} skillId - ID of the source skill (links point FROM this skill)
 * @returns {import("@tanstack/react-query").UseQueryResult<
 *   Array<{
 *     id: string;
 *     source_skill_id: string;
 *     target_skill_id: string;
 *     type: string;
 *     skill_name: string;
 *   }>,
 *   Error
 * >} React Query result object containing the list of outgoing links.
 */
export const useOutgoingSkillLinks = (skillId) => {
  return useQuery({
    queryKey: ["skill-links", "outgoing", skillId],
    queryFn: () => fetchOutgoingSkillLinks(skillId),
    enabled: !!skillId,
  });
};

/**
 * Creates a new directional link between two skills (e.g., prerequisite, related).
 *
 * Prevents self-links (source ≠ target) and automatically invalidates
 * both incoming and outgoing link queries to keep the UI in sync.
 *
 * @returns {import("@tanstack/react-query").UseMutationResult<
 *   { id: string; source_skill_id: string; target_skill_id: string; type: string },
 *   Error,
 *   { sourceSkillId: string; targetSkillId: string; type: string }
 * >} React Query mutation object for creating a skill link.
 */
export const useCreateSkillLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sourceSkillId, targetSkillId, type }) => {
      if (sourceSkillId === targetSkillId) {
        throw new Error("Cannot link a skill to itself");
      }
      return await createSkillLink({
        source_skill_id: sourceSkillId,
        target_skill_id: targetSkillId,
        type,
      });
    },
    onSuccess: (_, { sourceSkillId, targetSkillId }) => {
      queryClient.invalidateQueries({
        queryKey: ["skill-links", "incoming", targetSkillId],
      });
      queryClient.invalidateQueries({
        queryKey: ["skill-links", "outgoing", sourceSkillId],
      });
    },
  });
};
