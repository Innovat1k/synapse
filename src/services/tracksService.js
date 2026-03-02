import { supabase } from "./supabase-client";

export const fetchTracks = async () => {
  const { data, error } = await supabase
    .from("synapse_tracks")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }
  return data;
};

export const createTrack = async (trackData) => {
  const { data, error } = await supabase
    .from("synapse_tracks")
    .insert(trackData)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const deleteTrack = async (trackId) => {
  const { error } = await supabase
    .from("synapse_tracks")
    .delete()
    .eq("track_id", trackId);

  if (error) throw error;
};
