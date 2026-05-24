import { useEffect, useState } from 'react';
import { dataService } from '../api/dataService';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import Layout from '../Layout';

export default function Profile() {

    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const url = import.meta.env.VITE_SUPABASE_URL;

    useEffect(() => {
        if (!user) {
            navigate('/Login');
        }
    }, [user, navigate]);

    function logOut() {
        logout();
        navigate('/');

    }

    useEffect(() => {
        if (user?.id) {
            dataService.getUserById(user.id)
                .then((data) => {
                    setProfile(data);
                })
                .catch((err) => {
                    console.error("Failed to fetch profile:", err);
                });
        }
    }, [user]);
    console.log(profile);

    async function deleteMyAccount() {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Full URL being fetched:", `${url}/functions/v1/delete-user`);

        if (!session || !session.access_token) {
            console.error("No session or token found!");
            throw new Error('No active session found.');
        }

        try {
            const response = await fetch(`${url}/functions/v1/delete-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) throw new Error('Could not delete account');
            try {
                await supabase.auth.signOut();
            } catch (authErr) {
                console.warn("Session already revoked or user deleted:", authErr);
            }

            return true;
        } catch (err) {
            console.error('Network or Server Error:', err);
            throw err;
        }
    }

    function toggle() {
        setModal(true);
    }

    return (
        <Layout>
            <div className='my-12 flex flex-col items-center gap-4'>
                <h1>{profile?.name}</h1>
                <button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={logOut}>Log Out</button>
                <button className="bg-warning cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={toggle}>Delete My Account</button>
                {modal ? (
                    <div
                        onClick={() => setModal(false)}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await deleteMyAccount();
                                    navigate('/');
                                } catch (err) {
                                    console.error("Delete failed:", err);
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg"
                        >
                            <label>
                                <p>Are you sure you want to delete your account?</p>
                                <p>This action cannot be undone.</p>
                            </label>
                            <button
                                type="submit"
                                className="bg-error cursor-pointer rounded-lg px-4 py-2 text-white font-semibold"
                            >
                                Delete Account
                            </button>
                        </form>
                    </div>
                ) : null}
            </div>
        </Layout >
    );
}