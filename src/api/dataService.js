import { supabaseApi, USERS_API_URL, LISTINGS_API_URL } from './supabaseClient';

const STORAGE_UPLOAD_URL = import.meta.env.VITE_SUPABASE_STORAGE_UPLOAD_URL;
const STORAGE_PUBLIC_BASE_URL = import.meta.env.VITE_SUPABASE_STORAGE_URL;
const AVATAR_UPLOAD_URL = import.meta.env.VITE_SUPABASE_AVATAR_UPLOAD_URL;
const AVATAR_PUBLIC_BASE_URL = import.meta.env.VITE_SUPABASE_AVATAR_PUBLIC_URL;

export const dataService = {
    // ==========================================
    // LISTINGS TABLE OPERATIONS (GET, POST, DELETE)
    // ==========================================

    // GET: Fetch all real estate listings from the database
    getListings: async () => {
        // Safe check: If the base URL string already contains select parameters, use it cleanly.
        const url = LISTINGS_API_URL.includes('select=')
            ? LISTINGS_API_URL
            : `${LISTINGS_API_URL}?select=*`;

        const response = await supabaseApi.get(url);
        return response.data;
    },

    // POST: Insert a new listing row (e.g., containing structural jsonb values)
    createListing: async (listingData) => {
        // Stripe out any lingering query params for clean write actions
        const baseUrl = LISTINGS_API_URL.split('?')[0];
        const response = await supabaseApi.post(baseUrl, listingData, {
            headers: { 'Prefer': 'return=representation' }
        });
        return response.data[0];
    },

    // DELETE: Remove a specific listing record from the table matching an ID
    deleteListing: async (listingId) => {
        const baseUrl = LISTINGS_API_URL.split('?')[0];
        const response = await supabaseApi.delete(`${baseUrl}?id=eq.${listingId}`);
        return response.status; // Returns standard HTTP status 204 (No Content) on success
    },

    // ==========================================
    // USERS TABLE OPERATIONS (GET, POST, PATCH)
    // ==========================================

    // GET: Fetch a single user profile from the database matching an ID
    getUserById: async (userId) => {
        const baseUrl = USERS_API_URL.split('?')[0];
        const queryUrl = `${baseUrl}?id=eq.${userId}&select=*`;
        const response = await supabaseApi.get(queryUrl);
        return response?.data[0];
    },

    // POST: Insert a new user registration profile record
    createUser: async (userData) => {
        const baseUrl = USERS_API_URL.split('?')[0];
        const response = await supabaseApi.post(baseUrl, userData, {
            headers: { 'Prefer': 'return=representation' }
        });
        return response.data[0];
    },

    // PATCH: Update specific arrays or subfields (e.g., modifying the saved_listings JSONB field)
    updateUserSavedListings: async (userId, savedListingsArray) => {
        const baseUrl = USERS_API_URL.split('?')[0];
        const response = await supabaseApi.patch(
            `${baseUrl}?id=eq.${userId}`,
            { saved_listings: savedListingsArray },
            { headers: { 'Prefer': 'return=representation' } }
        );
        return response.data[0];
    },

    // ==========================================
    // STORAGE BUCKET UPLOAD OPERATIONS
    // ==========================================

    // POST: Uploads a single compressed file blob and returns its public bucket URL
    uploadListingImage: async (fileBlob, fileName) => {
        // Inject a unique timestamp string wrapper to prevent filename collisions inside the bucket
        const uniqueFileName = `${Date.now()}_${fileName}`;

        const response = await supabaseApi.post(
            `${STORAGE_UPLOAD_URL}/${uniqueFileName}`,
            fileBlob,
            {
                headers: {
                    // Explicitly define binary stream metadata matching payload formatting
                    'Content-Type': fileBlob.type || 'image/jpeg',
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            // Constructs the standard accessible URL linking to your public asset storage location
            return `${STORAGE_PUBLIC_BASE_URL}/${uniqueFileName}`;
        }
        throw new Error(`Upload transaction failed for target file reference: ${fileName}`);
    },

    uploadUserAvatar: async (fileBlob, fileName) => {
        const uniqueFileName = `avatar_${Date.now()}_${fileName}`;

        const response = await supabaseApi.post(
            `${AVATAR_UPLOAD_URL}/${uniqueFileName}`,
            fileBlob,
            {
                headers: {
                    'Content-Type': fileBlob.type || 'image/jpeg',
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            return `${AVATAR_PUBLIC_BASE_URL}/${uniqueFileName}`;
        }
        throw new Error('Avatar image upload failed');
    }
};