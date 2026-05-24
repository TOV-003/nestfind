import { useEffect, useState } from 'react';
import { dataService } from '../api/dataService';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

export default function Profile() {

    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

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

    return (
        <Layout>
            <div className='my-12 flex flex-col items-center gap-4'>
                <h1>{profile?.name}</h1>
                <button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={logOut}>Log Out</button>
            </div>
        </Layout >
    );
}