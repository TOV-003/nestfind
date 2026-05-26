import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";
import Fuse from 'fuse.js';
import { useMemo } from "react";
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
    });

    const [query, setQuery] = useState('');

    const fuse = useMemo(() => new Fuse(hosts, {
        keys: ['name'],
        threshold: 0.3
    }), [hosts]);

    const filteredHosts = useMemo(() => {
        return query ? fuse.search(query).map(result => result.item) : hosts;
    }, [query, fuse, hosts]);


    const HostSkeleton = () => (
        <div className="flex flex-col gap-2 items-center border border-gray-300 px-4 py-2 rounded-lg w-full animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-64 w-64 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
    );


    return (
        <Layout>
            <main className="flex flex-col items-center p-4 my-12 mx-auto gap-4">
                <input type="text" placeholder="Search hosts..." className="border border-gray-400 rounded-xl px-4 py-2 text-lg w-3/4" onChange={(e) => setQuery(e.target.value)} />
                <div className="grid md:grid-cols-3 gap-4 place-items-center">
                    {!hosts || hosts.length === 0 ? (
                        [1, 2, 3].map((n) => <HostSkeleton key={n} />)
                    ) : (
                        filteredHosts.map((el) => (
                            <div key={el.id} className="flex flex-col gap-2 items-center border border-gray-300 px-4 py-2 rounded-lg w-full">
                                <h2>Host</h2>
                                <Link to={`/Host/${el?.id}`}>
                                    <img src={el?.avatar} alt="Host" className="w-64 rounded-full aspect-square" />
                                </Link>
                                <p>{el?.name}</p>
                                <p>Member since: {el.joinDate || "Loading..."}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </Layout>
    )
}

export default HostSearch
