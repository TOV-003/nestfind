import { useEffect, useState } from 'react';
import { dataService } from '../api/dataService';
import { useParams } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Link } from 'react-router-dom';
import { FaBath, FaPencilRuler } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { Fragment } from "react";
import EmptyState from '../components/EmptyState';
import Layout from '../Layout';

export default function Host() {

    const [profile, setProfile] = useState(null);
    const [hostListings, setHostListings] = useState([]);
    const [totalEnquiries, setTotalEnquiries] = useState(0);
    const { id } = useParams();

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

    useEffect(() => {
        const fetchListingsWithCounts = async () => {

            const { data: listings, error: listingsError } = await supabase
                .from('listings')
                .select('*')
                .eq('host_id', id)
                .order('date_listed', { ascending: false });

            if (listingsError) {
                console.error("Failed to fetch host listings:", listingsError);
                return;
            }
            const listingIds = listings.map(l => l.id);
            const { data: enquiries, error: enquiriesError } = await supabase
                .from('enquiries')
                .select('listing_id')
                .in('listing_id', listingIds);


            if (enquiriesError) {
                console.error("Error fetching enquiries:", enquiriesError);
                setHostListings(listings);
                return;
            }
            const listingsWithCounts = listings.map(listing => ({
                ...listing,
                enquiryCount: enquiries.filter(e => String(e.listing_id) === String(listing.id)).length
            }));

            setHostListings(listingsWithCounts);
            console.log("Fetched host listings:", listingsWithCounts);
            const totalEnquiries = enquiries.length;
            setTotalEnquiries(totalEnquiries);
            console.log("Total enquiries:", totalEnquiries);

        };
        fetchListingsWithCounts();
    }, [id]);




    return (
        <Layout>
            <main className='flex flex-col gap-4 items-center my-12 px-4'>
                <div className='flex  flex-col items-center  gap-4 '>
                    <div className='flex flex-col items-center gap-4'>
                        <img src={profile?.avatar} alt="avatar" className="rounded-full w-32 h-32" />
                        <h1>{profile?.name}</h1>
                        <h2 className='text-lg text-gray-400 font-normal'>{profile?.role === "host" && profile?.role.toUpperCase()}</h2>
                        <a href="mailto:email@example.com"><h2 className='text-lg text-gray-400 font-normal'>{profile?.email}</h2></a>
                    </div>
                    <div className='flex  gap-4 justify-center'>
                        <p className='px-2 py-1 border border-gray-400 text-gray-400 rounded-lg'>Total Listings: {hostListings.length}</p>
                        <p className='px-2 py-1 border border-gray-400 text-gray-400 rounded-lg'>Total Enquiries: {totalEnquiries}</p>
                    </div>
                </div>
                <h2 className='text-xl text-gray-400 font-normal'>{profile?.name}'s Listings</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4'>
                    {hostListings.length === 0 ? (
                        <EmptyState title="No listings found" message="Please try searching for a different host." />
                    ) :
                        hostListings.map((el) => {
                            const listingLocation = el.location || {};
                            const listingAmenities = el.amenities || {};

                            return (
                                <div key={el.id} className="relative border border-gray-300 rounded-lg p-2 w-4/5 md:w-full h-full flex flex-col items-center gap-4 justify-between">
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
                                        <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Built in </span> {el.year_built ?? 'Unknown Year'}</p>
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
                                        <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Enquiries:</span> {el.enquiryCount ?? 0}</p>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

            </main>

        </Layout >
    );
}