import { getSupabase } from "./supabase-lazy";

// Fetches daily activity summary (hours per day) for last N days via Supabase RPC
export const fetchDailyActivity = async (userId, options = {}) => {
  const { daysBack = 7 } = options;

  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase.rpc("get_daily_activity", {
      p_user_id: userId,
      p_days_back: daysBack,
    });

    if (error) {
      throw new Error(`Failed to load daily activity: ${error.message}`);
    }

    const result = data || [];
    return result;
  } catch (err) {
    throw err;
  }
};
