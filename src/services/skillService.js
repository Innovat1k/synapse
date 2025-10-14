import { supabase } from "./supabase-client";

const SKILLS_TABLE = 'skills';

/**
 * SkillService
 * Handles all CRUD operations for the 'skills' table in Supabase.
 * NOTE: Row Level Security (RLS) should be enabled on the table to ensure 
 * only the owner can modify their skills, even if the user_id is passed.
 */

// --- 1. READ (Fetching all skills for the current user) ---
export const fetchSkills = async () => {
    console.log("Fetching skills...");
    try {
        // We rely on RLS (Row Level Security) on the 'skills' table 
        // to automatically filter records based on the current user's ID (auth.uid()).
        const { data, error } = await supabase
            .from(SKILLS_TABLE)
            .select('*')
            .order('created_at', { ascending: false }); // Latest skills first

        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('Error fetching skills:', error.message);
        // Returns an empty array in case of error
        return []; 
    }
};


// --- 2. CREATE (Adding a new skill) ---
/**
 * @param {object} skillData - { name, description, type, level }
 */
export const createSkill = async (skillData) => {
    console.log("Creating new skill:", skillData.name);
    try {
        // We rely on RLS policy to automatically set or verify the user_id 
        // during the insert operation to ensure security.
        const { data, error } = await supabase
            .from(SKILLS_TABLE)
            .insert(skillData)
            .select(); // Return the newly created record

        if (error) throw error;

        return data[0]; // Returns the new skill object

    } catch (error) {
        console.error('Error creating skill:', error.message);
        throw error; 
    }
};


// --- 3. UPDATE (Modifying an existing skill) ---
/**
 * @param {string} id - The UUID of the skill to update
 * @param {object} updates - The fields to update { name?, description?, level? }
 */
export const updateSkill = async (id, updates) => {
    console.log(`Updating skill ID ${id}`);
    try {
        // RLS ensures only the owner of the skill with this ID can update it.
        const { data, error } = await supabase
            .from(SKILLS_TABLE)
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        
        return data[0];

    } catch (error) {
        console.error('Error updating skill:', error.message);
        throw error;
    }
};


// --- 4. DELETE (Removing a skill) ---
/**
 * @param {string} id - The UUID of the skill to delete
 */
export const deleteSkill = async (id) => {
    console.log(`Deleting skill ID ${id}`);
    try {
        // RLS ensures only the owner of the skill with this ID can delete it.
        const { error } = await supabase
            .from(SKILLS_TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        return true; // Success

    } catch (error) {
        console.error('Error deleting skill:', error.message);
        throw error;
    }
};
