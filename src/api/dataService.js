import { supabase } from './supabaseClient';

export const dataService = {
    // ==========================================
    // LISTINGS TABLE OPERATIONS
    // ==========================================

    getListings: async () => {

        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('active', true)

        console.log("Listings", data);

        if (error) throw error;
        return data;
    },

    getListingById: async (id) => {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    createListing: async (listingData) => {
        const { data, error } = await supabase
            .from('listings')
            .insert([listingData])
            .select();

        if (error) throw error;
        return data[0];
    },

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

    getUserById: async (userId) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    createUser: async (userData) => {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select();

        if (error) throw error;
        return data[0];
    },

    updateUserSavedListings: async (userId, savedListingsArray) => {
        const stringifiedData = JSON.stringify(savedListingsArray);

        const { data, error } = await supabase
            .from('users')
            .update({ saved_listings: stringifiedData })
            .eq('id', userId)
            .select();

        if (error) throw error;
        return data[0];
    },

    // ==========================================
    // STORAGE BUCKET UPLOAD OPERATIONS
    // ==========================================

    uploadListingImage: async (fileBlob, fileName) => {
        const uniqueFileName = `${Date.now()}_${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from('listings')
            .upload(uniqueFileName, fileBlob, {
                contentType: fileBlob.type || 'image/jpeg',
            });

        if (uploadError) throw uploadError;
        const { data } = supabase.storage
            .from('listings')
            .getPublicUrl(uniqueFileName);

        return data.publicUrl;
    },
    deleteListingImages: async (fileName) => {
        const path = fileName.includes('/')
            ? fileName.split('/').pop()
            : fileName;

        const { error } = await supabase.storage
            .from('listings')
            .remove([path]);

        if (error) throw error;
        return true;
    },

    async uploadUserAvatar(file, originalName) {
        const fileExt = originalName.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        console.log(data);

        if (error) {
            console.error('Upload error:', error.message);
            throw new Error(`Avatar upload failed: ${error.message}`);
        }
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    },
    getEnquiryById: async (id) => {
        const { data, error } = await supabase
            .from('enquiries')
            .select('*')
            .eq('listing_id', id)
            .single();

        if (error) throw error;
        return data;
    },
};