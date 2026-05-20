import { supabase } from './supabaseClient';

export const dataService = {
    // ==========================================
    // LISTINGS TABLE OPERATIONS
    // ==========================================

    // GET: Fetch all real estate listings
    getListings: async () => {
        const { data, error } = await supabase
            .from('listings')
            .select('*');

        if (error) throw error;
        return data;
    },

    // POST: Insert a new listing row
    createListing: async (listingData) => {
        const { data, error } = await supabase
            .from('listings')
            .insert([listingData])
            .select();

        if (error) throw error;
        return data[0];
    },

    // DELETE: Remove a specific listing record matching an ID
    deleteListing: async (listingId) => {
        const { status, error } = await supabase
            .from('listings')
            .delete()
            .eq('id', listingId);

        if (error) throw error;
        return status; // Returns 204 on success
    },

    // ==========================================
    // USERS TABLE OPERATIONS
    // ==========================================

    // GET: Fetch a single user profile matching an ID
    getUserById: async (userId) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // POST: Insert a new user registration profile record
    createUser: async (userData) => {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select();

        if (error) throw error;
        return data[0];
    },

    // PATCH: Update specific arrays or subfields (saved_listings JSONB)
    updateUserSavedListings: async (userId, savedListingsArray) => {
        const { data, error } = await supabase
            .from('users')
            .update({ saved_listings: savedListingsArray })
            .eq('id', userId)
            .select();

        if (error) throw error;
        return data[0];
    },

    // ==========================================
    // STORAGE BUCKET UPLOAD OPERATIONS
    // ==========================================

    // POST: Uploads a single file to the listings bucket and returns public URL
    uploadListingImage: async (fileBlob, fileName) => {
        const uniqueFileName = `${Date.now()}_${fileName}`;

        // Upload file to 'listings' bucket
        const { error: uploadError } = await supabase.storage
            .from('listings')
            .upload(uniqueFileName, fileBlob, {
                contentType: fileBlob.type || 'image/jpeg',
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
            .from('listings')
            .getPublicUrl(uniqueFileName);

        return data.publicUrl;
    },

    // POST: Uploads a single file to the avatars bucket and returns public URL
    uploadUserAvatar: async (fileBlob, fileName) => {
        const uniqueFileName = `avatar_${Date.now()}_${fileName}`;

        // Upload file to 'avatars' bucket
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(uniqueFileName, fileBlob, {
                contentType: fileBlob.type || 'image/jpeg',
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(uniqueFileName);

        return data.publicUrl;
    }
};