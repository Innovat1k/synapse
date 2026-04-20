import { getSupabase } from "./supabase-lazy";

const SKILLS_TABLE = "synapse_skills";

/**
 * SkillService
 * Handles all CRUD operations for the 'skills' table in Supabase.
 * NOTE: Row Level Security (RLS) should be enabled on the table to ensure
 * only the owner can modify their skills, even if the user_id is passed.
 */

// --- 1. READ (Fetching all skills for the current user) ---
export const fetchSkills = async (userId) => {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(SKILLS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  } catch {
    // TODO: log to monitoring service (e.g., Sentry)
    return [];
  }
};

// --- CREATE (Adding a new skill) ---
/**
 * @param {object} skillData - { name, description, type, level }
 */
export const createSkill = async (skillData) => {
  // We rely on RLS policy to automatically set or verify the user_id
  // during the insert operation to ensure security.
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(SKILLS_TABLE)
    .insert(skillData)
    .select();

  if (error) {
    throw error;
  }
  return data[0];
};

// --- UPDATE (Modifying an existing skill) ---
/**
 * @param {string} id - The UUID of the skill to update
 * @param {object} updates - The fields to update { name?, description?, level? }
 */
export const updateSkill = async (id, updates) => {
  // RLS ensures only the owner of the skill with this ID can update it.
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(SKILLS_TABLE)
    .update(updates)
    .eq("skill_id", id)
    .select();

  if (error) {
    throw error;
  }
  return data[0];
};

// --- DELETE (Removing a skill) ---
/**
 * @param {string} id - The UUID of the skill to delete
 */
export const deleteSkill = async (id) => {
  // RLS ensures only the owner of the skill with this ID can delete it.
  const supabase = await getSupabase();
  const { error } = await supabase
    .from(SKILLS_TABLE)
    .delete()
    .eq("skill_id", id);

  if (error) {
    throw error;
  }
  return true;
};

// Deletes all skills associated with a user ID from Supabase
export const deleteUserSkills = async (userId) => {
  if (!userId) return { error: new Error("No user_id provided") };

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("synapse_skills")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
};
