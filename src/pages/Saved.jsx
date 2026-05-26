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

function Saved() {
    const { user } = useAuth();
    // const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
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

    // useEffect(() => {
    //     if (user?.id) {
    //         supabase
    //             .from('users')
    //             .select('*')
    //             .eq('id', user.id)
    //             .then(({ data, error }) => {
    //                 if (data) {
    //                     setProfile(data[0]);
    //                 } else {
    //                     console.error("Failed to fetch saved IDs:", error);
    //                 }
    //             });
    //     }
    // }, [user]);

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

    if (isChecking) {
        return (
            <Layout>
                <main className="flex flex-col gap-2 items-center flex-2 w-full">
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
                </main>
            </Layout>
        );
    }


    return (
        <Layout>
            <main className='flex flex-col gap-2 my-12 items-center px-4'>
                <h2 id='saved'>Saved Listings</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center gap-4'>
                    {
                        listings.map((el) => {
                            const listingLocation = el.location || {};
                            const listingAmenities = el.amenities || {};

                            return (
                                <div key={el.id} className="relative border border-gray-300 rounded-lg p-2 w-4/5 md:w-full h-full flex flex-col items-center gap-4">
                                    <Link to={`/listings/${el.id}`} className="w-full">
                                        <img
                                            src={el.images?.[0] || '/placeholder-property.jpg'}
                                            className="w-full aspect-square object-cover rounded-xl"
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
            </main>
        </Layout>
    )
}

export default Saved
