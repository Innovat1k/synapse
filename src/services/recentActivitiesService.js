import { getSupabase } from "./supabase-lazy";

// Fetches and flattens recent user activities with skill/track details for timeline display
export const fetchRecentActivities = async (userId, limit = 10) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("synapse_activities")
    .select(
      `
      id,
      duration_minutes,
      activity_type,
      logged_at,
      skills:skill_id (
        name,
        level
      ),
      notes,
      tracks:track_id (
        title
      )
    `,
    )
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent activities:", error);
    throw new Error(`Failed to load timeline data: ${error.message}`);
  }

  if (!data) return [];

  // Transform to flattened type for easier consumption
  return data.map((item) => ({
    id: item.id,
    skill_name: item.skills?.name || "Unknown Skill",
    skill_level: item.skills?.level || 0,
    track_title: item.tracks?.title,
    duration_minutes: item.duration_minutes,
    activity_type: item.activity_type,
    logged_at: item.logged_at,
    notes: item.notes,
  }));
};
