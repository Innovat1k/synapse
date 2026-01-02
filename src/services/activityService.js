import { supabase } from "./supabase-client";

const TABLE = "synapse_activities";

// --- Fetching all activities for a specific skill ---
export const fetchActivitiesBySkill = async (skillId) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("skill_id", skillId)
      .order("logged_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    return [];
  }
};

// --- Adding activity ---
export const createActivity = async (activityData) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(activityData)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};

export const updateActivity = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error updating activity:", error.message);
    throw error;
  }
};

// --- Removing activity ---
export const deleteActivity = async (id) => {
  try {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting activity:", error.message);
    throw error;
  }
};

// --- Removing activities from a skill ---
export const purgeActivitiesBySkill = async (skillId) => {
  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("skill_id", skillId); // ✅ Filtre avant de supprimer

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error when purging activities:", error); // ✅ Typo corrigée
    throw error; // ✅ Lance l'erreur pour que le composant la gère
  }
};
