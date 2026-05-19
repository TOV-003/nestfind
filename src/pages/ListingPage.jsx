import { useParams, Link } from "react-router-dom";
import { dataService } from '../api/dataService';
import { useEffect, useState, Fragment } from "react";
import Layout from "../Layout";
import { FaHome, FaBed, FaBath, FaHeart, FaWifi, FaCar, FaRing, FaGasPump, FaShieldAlt, FaDumbbell, FaChair } from "react-icons/fa";
import ImageCarousel from "../components/ImageCarousel";

function ListingPage() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [host, setHost] = useState(null);

    // const handleRequest = (event) => {
    //     event.preventDefault();
    // }

    useEffect(() => {
        dataService.getListings()
            .then((data) => {
                const allListings = data || [];
                const specificListing = allListings.find((item) => item.id === id);
                setListing(specificListing || null);
                setSimilar(allListings.filter((item) => specificListing?.location.city !== item.location.city && item.id !== id));
            })
            .catch((err) => {
                console.error("Error loading properties:", err);
            })
            .finally(() => { setLoading(false); });


    }, [id]);

    useEffect(() => {
        if (!listing || !listing.host_id) return;
        console.log('Fetching host with ID:', listing.host_id, `${typeof listing.host_id}`);

        dataService.getUserById(listing.host_id)
            .then((data) => {
                setHost(data || null);
                console.log('Host:', data);
            })
            .catch((err) => {
                console.error("Error loading host:", err);
            });
    }, [listing]);


    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center text-gray-500">Loading listing...</div>
            </Layout>
        );
    }

    if (!listing) {
        return (
            <Layout>
                <div className="p-8 text-center text-gray-500">Listing not found.</div>
            </Layout>
        );
    }



    return (
        <Layout>
            <main className="flex flex-col items-center p-4 my-12 mx-auto gap-4">
                <ImageCarousel images={listing.images.slice(1, -1).split(',')} />
                <div className="flex flex-col items-center xl:flex-row justify-center w-[70vw]">
                    <div className="flex flex-col items-start flex-1 p-4 gap-4">
                        <h1 className="text-xl font-semibold">Listing Details</h1>
                        <h2>{listing.title}</h2>
                        <h1 className="text-xl font-semibold">{listing.listing_type}</h1>
                        <h1 className="text-3xl font-semibold text-primary">₦{listing.listing_type === "rent" ? (listing.price?.toLocaleString('en-US') + " per year") : listing.listing_type === "shortlet" ? (listing.price?.toLocaleString('en-US') + " per day") : (listing.price?.toLocaleString('en-US'))}</h1>
                        <p className="text-gray-500">{listing.location.Address}</p>
                        <p className="text-gray-400">{listing.location.city}, {listing.location.state} state</p>
                        <p className="text-gray-400">{new Date(listing.date_listed).toLocaleDateString()}</p>
                        <div className="flex flex-row gap-2">

                            <div className="flex flex-row items-center gap-1">
                                <FaBed size={12} className="text-primary" />
                                <p>{listing.beds} beds</p>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <FaBath size={12} className="text-primary" />
                                <p>{listing.baths} baths</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm"><span className="font-bold">Host ID</span>: {listing.host_id}</p>
                    </div>
                    <div className="w-full h-full bg-primary flex-1">f</div>
                </div>
                <div className="flex flex-col items-center gap-2 border border-gray-300 w-[85vw] xl:w-[70vw] p-4 rounded-lg">
                    <h2>About this property</h2>
                    <p className="text-center">{listing.description}</p>
                </div>
                <div className="flex flex-col items-center gap-2 border border-gray-300 w-[85vw] xl:w-[70vw] p-4 rounded-lg">
                    <h2>Amenities</h2>
                    <div className="text-center">
                        {listing.amenities && Object.entries(listing.amenities)
                            .filter(([, value]) => value === true)
                            .map(([key], index, array) => (
                                <Fragment key={key}>
                                    <div className="flex flex-row items-center gap-2">
                                        {key === "WiFi" ? (<FaWifi />) : key === "Parking" ? (<FaCar />) : key === "Pool" ? (<FaRing />) : key === "Generator" ? (<FaGasPump />) : key === "Security" ? (<FaShieldAlt />) : key === "Gym" ? (<FaDumbbell />) : key === "Furnished" ? (<FaChair />) : null}
                                        <p className="text-sm text-gray-500">{key}</p>
                                    </div>
                                    {index < array.length - 1 && <span className="text-gray-400">|</span>}
                                </Fragment>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-col items-center border border-gray-300 px-4 py-2 rounded-lg">
                    <h2>Host</h2>
                    <div className="flex flex-col items-center gap-2">
                        <img src={host?.avatar} alt="Host Image" className="rounded-lg w-full" />
                        <p>{host?.name}</p>
                        <p>{host?.email}</p>
                        <p className="text-sm text-gray-300">host id: {host?.id}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2>Similar Properties</h2>
                    <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        {similar.slice(0, 3).map((el, index) => {
                            if (loading) {
                                return (
                                    <Layout key={el.id || index}>
                                        <div className="p-8 text-center text-gray-500">Loading listings...</div>
                                    </Layout>
                                );
                            }



                            const listingLocation = typeof el.location === 'string' ? JSON.parse(el.location) : el.location;
                            const listingAmenities = typeof el.amenities === 'string' ? JSON.parse(el.amenities) : el.amenities;

                            return (
                                <div key={el.id} className="relative border border-gray-300 rounded-xl p-2 w-4/5 md:w-full h-full flex flex-col items-center gap-4">
                                    <Link to={`/listings/${el.id}`}>
                                        <img
                                            src={el.images.slice(1, -1).split(',')[0]}
                                            className="w-full aspect-square object-cover rounded-xl"
                                            alt={el.title || "Property Image"}
                                        />
                                    </Link>
                                    <div className="flex flex-col gap-1 self-start">
                                        <div className="flex flex-row gap-2">
                                            <p className="text-xl font-bold">{el.title}</p>
                                            <h3 className="text-primary w-fit text-xl">
                                                ₦{el.price?.toLocaleString('en-US')}
                                                {el.listing_type === 'rent' ? ' per year' : el.listing_type === 'shortlet' ? ' per day' : ''}
                                            </h3>
                                        </div>
                                        <p className="text-gray-400">
                                            {listingLocation?.city}, {listingLocation?.state} state. Listed {(() => {
                                                const standardizedStr = el.date_listed
                                                    .replace(' ', 'T')
                                                    .replace(/([+-]\d{2})$/, '$1:00');

                                                const inputDate = new Date(standardizedStr);
                                                const currentDate = new Date();

                                                if (isNaN(inputDate.getTime())) return 'Invalid Date';

                                                const diffInDays = Math.floor((currentDate - inputDate) / 86400000);

                                                if (diffInDays < 0) return 'In the future';
                                                if (diffInDays === 0) return 'Today';
                                                if (diffInDays === 1) return '1 day ago';

                                                return `${diffInDays} days ago`;
                                            })()}
                                        </p>

                                        <div className="flex flex-row gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <FaHome size={12} className="text-primary" />
                                                <p>{el.type ? el.type.charAt(0).toUpperCase() + el.type.slice(1) : ''} for {el.listing_type}</p>
                                            </div>
                                            <div className="flex flex-row items-center gap-1">
                                                <FaBed size={12} className="text-primary" />
                                                <p>{el.beds} bd</p>
                                            </div>
                                            <div className="flex flex-row items-center gap-1">
                                                <FaBath size={12} className="text-primary" />
                                                <p>{el.baths} ba</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1">
                                            {listingAmenities && Object.entries(listingAmenities)
                                                .filter(([, value]) => value === true)
                                                .map(([key], index, array) => (
                                                    <Fragment key={key}>
                                                        <p className="text-sm text-gray-500">{key}</p>
                                                        {index < array.length - 1 && <span className="text-gray-400">|</span>}
                                                    </Fragment>
                                                ))
                                            }
                                        </div>
                                        <p className="text-gray-400 text-sm"><span className="font-bold">Host ID</span>: {el.host_id}</p>
                                    </div>
                                    <button className="border border-gray-500 p-2 rounded-md bottom-2 right-2 absolute">
                                        <FaHeart size={16} className="text-primary" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* <form onSubmit={handleRequest} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg">
                </form> */}
            </main>
        </Layout>
    );
}

export default ListingPage;