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

    async function addEnquiry(message, name, email, date, listing_id) {
        const { data, error } = await supabase
            .from('enquiries')
            .insert({ message, name, email, date, listing_id, user_id: user.id });
        if (error) {
            if (error.code === '23505') {
                alert("You have already sent an enquiry for this listing on this date.");
            }
            throw error;
        }

        return data;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, signUp, addEnquiry }}>
            {children}
        </AuthContext.Provider>
    );
}

