import { getSupabase } from "./supabase-lazy";

// Fetches user's current focus (top active skill) over last N days via Supabase RPC
export const fetchCurrentFocus = async (userId, options = {}) => {
  const { daysBack = 7 } = options;

  const supabase = await getSupabase();

  const { data, error } = await supabase.rpc("get_current_focus", {
    p_user_id: userId,
    p_days_back: daysBack,
  });

  if (error) {
    throw new Error(`Failed to load current focus: ${error.message}`);
  }

  const result = data?.[0] || null;

  return result;
};
