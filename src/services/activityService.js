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

export const fetchActivities = async (userId) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("synapse_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
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

// Deletes all activities associated with a user ID from Supabase
export const deleteUserActivities = async (userId) => {
  if (!userId) return { error: new Error("No user_id provided") };

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("synapse_activities")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
};
