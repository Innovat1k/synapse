import { getSupabase } from "./supabase-lazy";

// Fetches dashboard key metrics (hours, sessions, top skill) via Supabase RPC with safe defaults
export const fetchKeyMetrics = async (userId) => {
  const supabase = await getSupabase();

  const { data, error } = await supabase.rpc("get_key_metrics", {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(`Failed to load key metrics: ${error.message}`);
  }

  // RPC returns array with one row
  const result = data?.[0] || {
    hours_this_week: 0,
    skills_practiced: 0,
    total_sessions: 0,
    total_minutes_this_week: 0,
    most_practiced_skill: null,
  };

  return result;
};
