import { getSupabase } from "@services/supabase-lazy";

// Fetches weekly progress data (hours per week) with optional track/skill filters via Supabase RPC
export const fetchWeeklyProgress = async (userId, options = {}) => {
  const { weeksBack = 8, trackId = null, skillId = null } = options;

  const supabase = await getSupabase();

  const { data, error } = await supabase.rpc("get_weekly_progress", {
    p_user_id: userId,
    p_weeks_back: weeksBack,
    p_track_id: trackId,
    p_skill_id: skillId,
  });

  if (error) {
    throw new Error(`Failed to load weekly progress: ${error.message}`);
  }

  return data || [];
};
