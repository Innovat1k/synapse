import { supabase } from "./supabase-client";

const SKILLS_TABLE = "synapse_skills";

/**
 * SkillService
 * Handles all CRUD operations for the 'skills' table in Supabase.
 * NOTE: Row Level Security (RLS) should be enabled on the table to ensure
 * only the owner can modify their skills, even if the user_id is passed.
 */

// --- 1. READ (Fetching all skills for the current user) ---
export const fetchSkills = async () => {
  try {
    // We rely on RLS (Row Level Security) on the 'skills' table
    // to automatically filter records based on the current user's ID (auth.uid()).
    const { data, error } = await supabase
      .from(SKILLS_TABLE)
      .select("*")
      .order("created_at", { ascending: false }); // Latest skills first

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching skills:", error.message);
    return [];
  }
};

// --- CREATE (Adding a new skill) ---
/**
 * @param {object} skillData - { name, description, type, level }
 */
export const createSkill = async (skillData) => {
  try {
    // We rely on RLS policy to automatically set or verify the user_id
    // during the insert operation to ensure security.
    const { data, error } = await supabase
      .from(SKILLS_TABLE)
      .insert(skillData)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error creating skill:", error.message);
    throw error;
  }
};

// --- UPDATE (Modifying an existing skill) ---
/**
 * @param {string} id - The UUID of the skill to update
 * @param {object} updates - The fields to update { name?, description?, level? }
 */
export const updateSkill = async (id, updates) => {
  try {
    // RLS ensures only the owner of the skill with this ID can update it.
    const { data, error } = await supabase
      .from(SKILLS_TABLE)
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error updating skill:", error.message);
    throw error;
  }
};

// --- DELETE (Removing a skill) ---
/**
 * @param {string} id - The UUID of the skill to delete
 */
export const deleteSkill = async (id) => {
  try {
    // RLS ensures only the owner of the skill with this ID can delete it.
    const { error } = await supabase.from(SKILLS_TABLE).delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting skill:", error.message);
    throw error;
  }
};
