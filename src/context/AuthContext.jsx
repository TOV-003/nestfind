import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { AuthContext } from './AuthContextObject';


export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(function () {
        async function getInitialSession() {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        }

        getInitialSession();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(function (event, session) {
            setUser(session?.user ?? null);
        });

        return function () {
            subscription.unsubscribe();
        };
    }, []);

    async function login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }

    async function logout() {
        await supabase.auth.signOut();
    }

    async function signUp(email, password, userData) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: userData.name,
                    role: userData.role,
                    avatar: userData.avatar,
                    phone: userData.phone
                }
            }
        });

        if (error) throw error;
        return data;
    }

    async function addEnquiry(message, name, email, date, listing_id, created_at) {
        const { data, error } = await supabase
            .from('enquiries')
            .insert({ message, name, email, date, listing_id, user_id: user.id, created_at });
        if (error) {
            if (error.code === '23505') {
                alert("You have already sent an enquiry for this listing on this date.");
            }
            throw error;
        }

        return data;
    }

    async function respondEnquiry(listing_id, date) {
        const { data, error } = await supabase
            .from('enquiries')
            .update({
                responded: true
            })
            .eq('user_id', user.id)
            .eq('listing_id', listing_id)
            .eq('date', date)
            .select();

        if (error) throw error;

        return data;
    }



    async function deleteEnquiry(message, name, email, date, listing_id) {
        const { data, error } = await supabase
            .from('enquiries')
            .delete()
            .eq('message', message)
            .eq('name', name)
            .eq('email', email)
            .eq('date', date)
            .eq('listing_id', listing_id)
            .eq('user_id', user.id);
        if (error) {
            throw error;
        }

        return data;
    }

    async function editEnquiry(id, newDate) {
        const { data, error } = await supabase
            .from('enquiries')
            .update({ date: newDate })
            .eq('listing_id', id)
            .eq('user_id', user.id)
            .select();

        if (error) throw error;
        return data;
    }

    async function createListing(listingData) {
        const { data, error } = await supabase
            .from('listings')
            .insert([listingData])
            .select();

        if (error) throw error;
        return data[0];
    }

    async function deleteListing(id) {
        const { data, error } = await supabase
            .from('listings')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    }

    async function cleanupCloudinaryImages(imageUrls) {
        if (!imageUrls || !Array.isArray(imageUrls)) return;

        await Promise.all(
            imageUrls.map(async (imageUrl) => {
                const publicId = imageUrl.split('/').pop().split('.')[0];

                try {
                    await fetch(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                public_id: publicId,
                                api_key: import.meta.env.VITE_CLOUDINARY_API_KEY
                            })
                        }
                    );
                } catch (error) {
                    console.error(error, " Cloudinary cleanup failed for:", publicId);
                }
            })
        );
    }

    async function editListing(id, updates) {
        const { data, error } = await supabase
            .from('listings')
            .update(updates)
            .eq('id', id)
            .eq('host_id', user.id)
            .select();

        if (error) throw error;
        console.log("Supabase Update Response:", data);
        if (!data || data.length === 0) {
            throw new Error("No record found to update. Check your host_id or permissions.");
        }
        return data[0];
    }

    async function toggleActive(id, isActive) {
        const { data, error } = await supabase
            .from('listings')
            .update({ active: !isActive })
            .eq('id', id)
            .eq('host_id', user.id)
            .select();

        if (error) throw error;
        console.log("Supabase Update Response:", data);
        if (!data || data.length === 0) {
            throw new Error("No record found to update. Check your host_id or permissions.");
        }
        return data[0];
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, signUp, addEnquiry, editEnquiry, respondEnquiry, deleteEnquiry, createListing, deleteListing, cleanupCloudinaryImages, editListing, toggleActive }}>
            {children}
        </AuthContext.Provider>
    );


}

