import { useEffect, useState } from 'react';
import { dataService } from '../api/dataService';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import Layout from '../Layout';
import { Fragment } from "react";
import { FaBath, FaPencilRuler } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import EmptyState from '../components/EmptyState';

export default function Profile() {

    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const url = import.meta.env.VITE_SUPABASE_URL;
    const [listings, setListings] = useState([]);
    const [enquiredListings, setEnquiredListings] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [enquiredIds, setEnquiredIds] = useState([]);
    const [isChecking, setIsChecking] = useState(true);

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

    function logOut() {
        logout();
        navigate('/');

    }

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .then(({ data, error }) => {
                    if (data) {
                        setProfile(data[0]);
                    } else {
                        console.error("Failed to fetch user IDs:", error);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('saved_listings')
                .select('listing_id')
                .eq('user_id', user.id)
                .then(({ data, error }) => {
                    if (data) {
                        const ids = data.map(item => item.listing_id);
                        setSavedIds(ids);
                    } else {
                        console.error("Failed to fetch saved IDs:", error);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('enquiries')
                .select('listing_id')
                .eq('user_id', user.id)
                .then(({ data, error }) => {
                    if (data) {
                        const ids = data.map(item => item.listing_id);
                        setEnquiredIds(ids);
                    } else {
                        console.error("Failed to fetch saved IDs:", error);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if (savedIds.length > 0) {
            Promise.all(savedIds.map(id => dataService.getListingById(id)))
                .then((results) => {
                    setListings(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(results)) return prev;
                        return results;
                    });
                })
                .catch((err) => console.error(err));
        }
    }, [savedIds]);

    useEffect(() => {
        if (enquiredIds.length > 0) {
            Promise.all(enquiredIds.map(id => dataService.getListingById(id)))
                .then((results) => {
                    setEnquiredListings(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(results)) return prev;
                        return results;
                    });
                })
                .catch((err) => console.error(err));
        }
    }, [enquiredIds]);

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

    async function unsave(listingId) {
        await supabase
            .from('saved_listings')
            .delete()
            .eq('user_id', user.id)
            .eq('listing_id', listingId);
    }

    async function triggerUnsave(listingId) {

        setSavedIds(prev => prev.filter(id => id !== listingId));
        await unsave(listingId);
    }

    function toggle() {
        setModal(true);
    }

    if (isChecking) {
        return (
            <Layout>
                <main className="my-12 flex flex-col gap-2 items-center md:items-start justify-center md:flex-row px-4 animate-pulse">
                    <div className="my-12 flex flex-col items-center gap-4 flex-1 text-center">
                        <div className="rounded-full w-32 h-32 bg-gray-200" />
                        <div className="h-6 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2 items-center flex-2 w-full">
                        <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 w-full">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-2 w-4/5 md:w-full h-64 bg-gray-100" />
                            ))}
                        </div>
                        <div className="h-8 w-48 bg-gray-200 rounded my-4" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 w-full">
                            {[1, 2].map((i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-2 w-4/5 md:w-full h-64 bg-gray-100" />
                            ))}
                        </div>
                    </div>
                </main>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className=' my-12 flex flex-col  gap-2 items-center  md:items-start justify-center md:flex-row px-4'>
                <div className='my-12 flex flex-col items-center gap-4 flex-1 text-center'>
                    <img src={profile?.avatar} alt="avatar" className="rounded-full w-32 h-32" />
                    <h1>{profile?.name}</h1>
                    <h2 className='text-lg text-gray-400 font-normal'>{profile?.role === "host" && profile?.role}</h2>
                    <div className='flex flex-wrap gap-2 md:w-3/4 justify-center'>
                        <h1 className='w-full text-lg'>My Activity</h1>
                        <Link to="/Enquiries"><button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">To Enquiries</button></Link>
                        <Link to="/Saved"><button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">To Saved Listings</button></Link>
                        <button className="bg-gray-400 cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={logOut}>Log Out</button>
                        <button className="bg-warning cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={toggle}>Delete My Account</button>
                    </div>

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
                <div className='flex flex-col gap-4 items-center flex-2'>
                    <div className='flex flex-col gap-2'>
                        <h2 id='saved'>Saved Listings</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4'>
                            {listings.length === 0 ? (
                                <EmptyState title="No saved listings found" message="Please try saving some listings." />
                            ) :
                                listings.slice(0, 4).map((el) => {
                                    const listingLocation = el.location || {};
                                    const listingAmenities = el.amenities || {};

                                    return (
                                        <div key={el.id} className="relative border border-gray-300 rounded-lg p-2 w-4/5 md:w-full h-full flex flex-col items-center gap-4">
                                            <Link to={`/listings/${el.id}`} className="w-full">
                                                <img
                                                    src={el.images?.[0] || '/placeholder-property.jpg'}
                                                    className="w-full aspect-video object-cover rounded-xl"
                                                    alt={el.title || "Property Image"}
                                                />
                                            </Link>
                                            <div className="flex flex-col gap-1 self-start px-2 pb-12 w-full">
                                                <div className="flex flex-row justify-between items-start gap-2 w-full">
                                                    <p className="text-lg font-bold">{el.title}</p>
                                                    <h3 className="text-primary font-bold text-lg whitespace-nowrap">
                                                        ₦{el.price?.toLocaleString('en-US')}
                                                        {el.listing_type === 'rent' ? '/yr' : el.listing_type === 'shortlet' ? '/day' : ''}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {listingLocation.city}, {listingLocation.state} state. Listed {(() => {
                                                        if (!el.date_listed) return 'N/A';
                                                        const inputDate = new Date(el.date_listed);
                                                        const currentDate = new Date();
                                                        if (isNaN(inputDate.getTime())) return 'Invalid Date';
                                                        const diffInDays = Math.floor((currentDate - inputDate) / 86400000);
                                                        if (diffInDays < 0) return 'In the future';
                                                        if (diffInDays === 0) return 'Today';
                                                        if (diffInDays === 1) return '1 day ago';
                                                        return `${diffInDays} days ago`;
                                                    })()}
                                                </p>

                                                <div className="flex flex-row gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaHome size={14} className="text-primary" />
                                                        <p className="capitalize">{el.type} for {el.listing_type}</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaBed size={14} className="text-primary" />
                                                        <p>{el.beds} bd</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaBath size={14} className="text-primary" />
                                                        <p>{el.baths} ba</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center gap-1 mt-1 text-sm text-gray-500">
                                                    <FaPencilRuler size={12} className="text-primary" />
                                                    <p>{el.area} sq ft</p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1 mt-2">
                                                    {Object.entries(listingAmenities)
                                                        .filter(([, value]) => value === true)
                                                        .map(([key], index, array) => (
                                                            <Fragment key={key}>
                                                                <p className="text-xs text-gray-500 capitalize">{key}</p>
                                                                {index < array.length - 1 && <span className="text-gray-300 text-xs">|</span>}
                                                            </Fragment>
                                                        ))
                                                    }
                                                </div>
                                                <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Host:</span> {el.host_name ?? 'Unknown Host'}</p>
                                            </div>
                                            <button onClick={() => triggerUnsave(el.id)} className="border border-gray-300 p-2 rounded-md bottom-2 right-2 absolute bg-white cursor-pointer hover:bg-gray-50">
                                                <FaHeart size={16} className={user ? "text-primary" : "text-gray-400"} />
                                            </button>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Link to="/Saved">
                            <button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">View All Saved Listings</button>
                        </Link>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 id='enquiries'>Enquiried Listings</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4'>
                            {
                                enquiredListings.slice(0, 4).map((el) => {
                                    const listingLocation = el.location || {};
                                    const listingAmenities = el.amenities || {};

                                    return (
                                        <div key={el.id} className="relative border border-gray-300 rounded-lg p-2 w-4/5 md:w-full h-full flex flex-col items-center gap-4">
                                            <Link to={`/listings/${el.id}`} className="w-full">
                                                <img
                                                    src={el.images?.[0] || '/placeholder-property.jpg'}
                                                    className="w-full aspect-video object-cover rounded-xl"
                                                    alt={el.title || "Property Image"}
                                                />
                                            </Link>
                                            <div className="flex flex-col gap-1 self-start px-2 pb-12 w-full">
                                                <div className="flex flex-row justify-between items-start gap-2 w-full">
                                                    <p className="text-lg font-bold">{el.title}</p>
                                                    <h3 className="text-primary font-bold text-lg whitespace-nowrap">
                                                        ₦{el.price?.toLocaleString('en-US')}
                                                        {el.listing_type === 'rent' ? '/yr' : el.listing_type === 'shortlet' ? '/day' : ''}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {listingLocation.city}, {listingLocation.state} state. Listed {(() => {
                                                        if (!el.date_listed) return 'N/A';
                                                        const inputDate = new Date(el.date_listed);
                                                        const currentDate = new Date();
                                                        if (isNaN(inputDate.getTime())) return 'Invalid Date';
                                                        const diffInDays = Math.floor((currentDate - inputDate) / 86400000);
                                                        if (diffInDays < 0) return 'In the future';
                                                        if (diffInDays === 0) return 'Today';
                                                        if (diffInDays === 1) return '1 day ago';
                                                        return `${diffInDays} days ago`;
                                                    })()}
                                                </p>

                                                <div className="flex flex-row gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaHome size={14} className="text-primary" />
                                                        <p className="capitalize">{el.type} for {el.listing_type}</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaBed size={14} className="text-primary" />
                                                        <p>{el.beds} bd</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaBath size={14} className="text-primary" />
                                                        <p>{el.baths} ba</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center gap-1 mt-1 text-sm text-gray-500">
                                                    <FaPencilRuler size={12} className="text-primary" />
                                                    <p>{el.area} sq ft</p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1 mt-2">
                                                    {Object.entries(listingAmenities)
                                                        .filter(([, value]) => value === true)
                                                        .map(([key], index, array) => (
                                                            <Fragment key={key}>
                                                                <p className="text-xs text-gray-500 capitalize">{key}</p>
                                                                {index < array.length - 1 && <span className="text-gray-300 text-xs">|</span>}
                                                            </Fragment>
                                                        ))
                                                    }
                                                </div>
                                                <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Host:</span> {el.host_name ?? 'Unknown Host'}</p>
                                            </div>
                                            <button onClick={() => triggerUnsave(el.id)} className="border border-gray-300 p-2 rounded-md bottom-2 right-2 absolute bg-white cursor-pointer hover:bg-gray-50">
                                                <FaHeart size={16} className={user ? "text-primary" : "text-gray-400"} />
                                            </button>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Link to="/Enquiries">
                            <button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">View All Enquiried Listings</button>
                        </Link>
                    </div>
                </div>

            </main>

        </Layout >
    );
}