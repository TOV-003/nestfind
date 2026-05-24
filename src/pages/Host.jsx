import { useEffect, useState } from 'react';
import { dataService } from '../api/dataService';
import { useParams } from 'react-router-dom';
import Layout from '../Layout';

export default function Host() {

    const [profile, setProfile] = useState(null);
    const { id } = useParams();
    // const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dataService.getUserById(id)
                .then((data) => {
                    setProfile(data);
                })
                .catch((err) => {
                    console.error("Failed to fetch profile:", err);
                });
        }
    }, [id]);
    console.log(profile);



    return (
        <Layout>
            <div className='my-12 flex flex-col items-center gap-4'>
                <img src={profile?.avatar} alt="avatar" className="rounded-full w-32 h-32" />
                <h1>{profile?.name}</h1>
                <h2 className='text-lg text-gray-400 font-normal'>{profile?.role === "host" && profile?.role}</h2>
                <h2 className='text-lg text-gray-400 font-normal'>{profile?.email}</h2>
            </div>
        </Layout >
    );
}