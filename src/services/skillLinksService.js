import { supabase } from "./supabase-client";

/**
 * Fetch incoming skill links (where skillId is the TARGET)
 */
export const fetchIncomingSkillLinks = async (skillId) => {
  console.log("Fetching incoming links for:", skillId);
  const { data, error } = await supabase
    .from("synapse_skill_links")
    .select(
      `
      id,
      source_skill_id,
      target_skill_id,
      type,
      skill:source_skill_id!inner(name)
    `,
    )
    .eq("target_skill_id", skillId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((link) => ({
    id: link.id,
    source_skill_id: link.source_skill_id,
    target_skill_id: link.target_skill_id,
    type: link.type,
    skill_name: link.skill?.name || "Unknown skill",
  }));
};

/**
 * Fetch outgoing skill links (where skillId is the SOURCE)
 */
export const fetchOutgoingSkillLinks = async (skillId) => {
  const { data, error } = await supabase
    .from("synapse_skill_links")
    .select(
      `
      id,
      source_skill_id,
      target_skill_id,
      type,
      skill:target_skill_id!inner(name)
    `,
    )
    .eq("source_skill_id", skillId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((link) => ({
    id: link.id,
    source_skill_id: link.source_skill_id,
    target_skill_id: link.target_skill_id,
    type: link.type,
    skill_name: link.skill?.name || "Unknown skill",
  }));
};

/**
 * Create a new skill link
 */
export const createSkillLink = async ({
  source_skill_id,
  target_skill_id,
  type,
}) => {
  const { data, error } = await supabase
    .from("synapse_skill_links")
    .insert({ source_skill_id, target_skill_id, type })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Check if a direct or reverse link already exists between two skills
 */
export const checkExistingLinks = async (sourceId, targetId) => {
  try {
    const { data: directData, error: directError } = await supabase
      .from("synapse_skill_links")
      .select("id", { count: "exact" })
      .eq("source_skill_id", sourceId)
      .eq("target_skill_id", targetId)
      .limit(1);

    if (directError) {
      throw directError;
    }

    const { data: reverseData, error: reverseError } = await supabase
      .from("synapse_skill_links")
      .select("id", { count: "exact" })
      .eq("source_skill_id", targetId)
      .eq("target_skill_id", sourceId)
      .limit(1);

    if (reverseError) {
      throw reverseError;
    }

    return {
      hasDirectLink: (directData?.length || 0) > 0,
      hasReverseLink: (reverseData?.length || 0) > 0,
      error: null,
    };
  } catch (error) {
    return {
      hasDirectLink: false,
      hasReverseLink: false,
      error,
    };
  }
};

/**
 * Deletes a skill link by its ID.
 * @param {string} linkId - The ID of the link to delete.
 * @returns {Promise<void>}
 */
export const deleteSkillLink = async (linkId) => {
  if (!linkId) {
    throw new Error("Link ID is required");
  }

  const { error } = await supabase
    .from("synapse_skill_links")
    .delete()
    .eq("id", linkId);

  if (error) {
    throw error;
  }
};

/**
 * Fetch ALL skill links (for the global graph view)
 */
export const fetchAllSkillLinks = async () => {
  const { data, error } = await supabase.from("synapse_skill_links").select(`
      id,
      source_skill_id,
      target_skill_id,
      type
    `);

  if (error) {
    throw error;
  }

  return data || [];
};
