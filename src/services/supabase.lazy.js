export const getSupabase = async () => {
  const mod = await import("./supabase-client.js");
  return mod.supabase;
};
