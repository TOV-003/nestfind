import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";
import Layout from "../Layout";

function HostSearch() {

    const [hosts, setHosts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'host')
                .order('name');
            console.log(data);
            if (error) throw error;
            setHosts(data);
        }
        fetchData();
    }, []);

    const getHostJoinDate = async (hostId) => {
        const { data } = await supabase
            .from('user_public_data')
            .select('email_confirmed_at')
            .eq('id', hostId)
            .maybeSingle();

        const formattedDate = data?.email_confirmed_at
            ? new Date(data.email_confirmed_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : null;

        return formattedDate || "N/A";
    };

    const updateHostsWithDates = async () => {
        if (!hosts) return;

        const updatedHosts = await Promise.all(
            hosts.map(async (host) => {
                const joinDate = await getHostJoinDate(host.id);
                return { ...host, joinDate };
            })
        );

        setHosts(updatedHosts);
    };

    useEffect(() => {
        async function fetchJoinDates() {
            await updateHostsWithDates();
        }
        fetchJoinDates();
    })


    return (
        <Layout>
            <main className="flex flex-col items-center p-4 my-12 mx-auto gap-4">
                <div>
                    {
                        hosts.map((el) => (
                            <div key={el.id} className="flex flex-col gap-2 items-center border border-gray-300 px-4 py-2 rounded-lg flex-1 w-full">
                                <h2>Host</h2>
                                <Link to={`/Host/${el?.id}`}>
                                    <img src={el?.avatar} alt="Host" className=" h-64 rounded-full object-cover" />
                                </Link>
                                <p>{el?.name}</p>
                                <p>Member since: {el.joinDate} </p>
                            </div>
                        ))
                    }
                </div>
            </main>
        </Layout>
    )
}

export default HostSearch
