import { supabase } from "./supabase-client";

// Fetches all tracks from Supabase, ordered by title
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

// Creates a new track in Supabase and returns the inserted record
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

// Deletes a track from Supabase by its track_id
export const deleteTrack = async (trackId) => {
  const { error } = await supabase
    .from("synapse_tracks")
    .delete()
    .eq("track_id", trackId);

  if (error) {
    throw error;
  }
};
