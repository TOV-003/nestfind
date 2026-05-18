import axios from 'axios';

export const USERS_API_URL = import.meta.env.VITE_SUPABASE_URL_USERS;
export const LISTINGS_API_URL = import.meta.env.VITE_SUPABASE_URL_LISTINGS;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseApi = axios.create({
    headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
    },
});