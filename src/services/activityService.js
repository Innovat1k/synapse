import { getSupabase } from "./supabase-lazy";

const TABLE = "synapse_activities";

// --- Fetching all activities for a specific skill ---
export const fetchActivitiesBySkill = async (skillId) => {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("skill_id", skillId)
      .order("logged_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  } catch {
    // TODO: log to monitoring service (e.g., Sentry)
    return [];
  }
};

// --- Adding activity ---
export const createActivity = async (activityData) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(activityData)
    .select();

  if (error) {
    throw error;
  }
  return data[0];
};

// --- Updating activity ---
export const updateActivity = async (id, updates) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }
  return data[0];
};

// --- Removing activity ---
export const deleteActivity = async (id) => {
  const supabase = await getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    throw error;
  }
  return true;
};

// --- Removing all activities for a skill ---
export const purgeActivitiesBySkill = async (skillId) => {
  const supabase = await getSupabase();
  const { error } = await supabase.from(TABLE).delete().eq("skill_id", skillId);

  if (error) {
    throw error;
  }
  return true;
};
