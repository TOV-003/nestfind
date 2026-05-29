import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../context/useAuth';
import EmptyState from '../components/EmptyState';
import Layout from '../Layout';

function UserEnquiries() {

    const { user, respondEnquiry } = useAuth();
    const navigate = useNavigate();
    const [compiledEnquiries, setCompiledEnquiries] = useState([]);
    const [isChecking, setIsChecking] = useState(true);
    const [expandedId, setExpandedId] = useState(true);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isChecking && !user) {
            navigate('/Login');
        }
    }, [user, isChecking, navigate]);


    useEffect(() => {
        if (!user?.id) return;

        const fetchHostEnquiries = async () => {
            const { data: userListings } = await supabase
                .from('listings')
                .select('id, title, images, price, listing_type')
                .eq('host_id', user.id);

            if (userListings && userListings.length > 0) {
                const listingIds = userListings.map(l => l.id);

                const { data: enquiries } = await supabase
                    .from('enquiries')
                    .select('*')
                    .in('listing_id', listingIds);

                if (enquiries) {
                    const combined = enquiries.map(enq => ({
                        ...enq,
                        listing: userListings.find(l => l.id === enq.listing_id)
                    }));
                    setCompiledEnquiries(combined);
                }
            }
            setIsChecking(false);
        };

        fetchHostEnquiries();
    }, [user]);

    if (isChecking) {
        return (
            <Layout>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-100 p-4 flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                ))}
            </Layout>
        )
    }
    return (
        <Layout>
            <main className='flex flex-col gap-4 my-12 items-center px-4 w-full max-w-4xl mx-auto'>
                <h2 className='text-2xl font-bold self-start'>Enquiries Received</h2>

                <div className='w-full border border-gray-200 rounded-lg overflow-hidden'>
                    {
                        compiledEnquiries.length === 0 ? (
                            <EmptyState title="No enquiries found" message="No one has made an enquiry for any of your listings, Yet." />
                        ) :
                            compiledEnquiries.map((enq) => (
                                <div key={`${enq.user_id}+${enq.listing?.id}`} className="border-b border-gray-100 last:border-b-0">
                                    <div
                                        className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleExpand(enq.listing_id)}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <Link to={`/listings/${enq.listing?.id}`}>
                                                <img
                                                    src={enq.listing?.images?.[0] || '/placeholder-property.jpg'}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                    alt="Property"
                                                />
                                            </Link>
                                            <div>
                                                <p className="font-bold text-sm">{enq.listing?.title}</p>
                                                <p className="text-xs text-gray-500">From: {enq.name || 'Guest'}</p>
                                                <p className="text-xs text-gray-500">{enq.email}</p>
                                                <p className="text-xs text-gray-500">Date: {new Date(enq.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 md:mt-0 flex-1 md:px-4">
                                            <p className={`text-sm text-gray-700 ${expandedId === enq.listing_id ? '' : 'line-clamp-3'}`}>
                                                {enq.message}
                                            </p>
                                        </div>

                                        <div className="mt-2 md:mt-0 text-xs font-bold md:w-24 text-right">
                                            {enq.responded ? <button className="bg-primary text-white px-4 py-2 rounded-lg">Responded</button>
                                                :
                                                <button
                                                    onClick={async () => {
                                                        await respondEnquiry(enq.listing_id, enq.date);
                                                        setCompiledEnquiries(prev => prev.map(enqItem =>
                                                            (enqItem.user_id === enq.user_id && enqItem.listing_id === enq.listing_id)
                                                                ? { ...enqItem, responded: true }
                                                                : enqItem
                                                        ));
                                                    }}
                                                    className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                                                >
                                                    Agree
                                                </button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                </div>
            </main>
        </Layout>
    )
}

export default UserEnquiries
