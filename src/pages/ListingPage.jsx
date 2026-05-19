import { useParams, Link } from "react-router-dom";
import { dataService } from '../api/dataService';
import { useEffect, useState, Fragment } from "react";
import Layout from "../Layout";
import { FaHome, FaBed, FaBath, FaHeart, FaWifi, FaCar, FaRing, FaGasPump, FaShieldAlt, FaDumbbell, FaChair, FaPencilRuler } from "react-icons/fa";
import ImageCarousel from "../components/ImageCarousel";
import toast from "react-hot-toast";

function ListingPage() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formModal, setFormModal] = useState(false);
    const [host, setHost] = useState(null);

    const handleRequest = (event) => {
        event.preventDefault();
    }

    useEffect(() => {
        dataService.getListings()
            .then((data) => {
                const allListings = data || [];
                const specificListing = allListings.find((item) => item.id === id);
                toast.success("Loaded Listing!");
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
                <main className="flex flex-col items-center p-4 my-12 mx-auto gap-4">
                    <div className="w-full aspect-video bg-gray-200 rounded-2xl animate-pulse"></div>

                    <div className="flex flex-col items-center xl:flex-row justify-center w-full lg:w-[70vw] gap-4">
                        <div className="flex flex-col items-start flex-1 p-4 gap-4 w-full">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                            <div className="flex flex-row gap-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                        <div className="w-full flex-1 h-64 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="flex flex-col items-center gap-2 border border-gray-300 w-[85vw] xl:w-[70vw] p-4 rounded-lg">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center w-[70vw] gap-4">
                        <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 w-full h-full p-4 rounded-lg">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20 mb-3"></div>
                            <div className="flex flex-wrap px-4 justify-center items-center gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 items-center border border-gray-300 px-4 py-4 rounded-lg flex-1 w-full">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                            <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-40 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                        <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="relative border border-gray-300 rounded-xl p-2 w-4/5 md:w-full flex flex-col gap-4">
                                    <div className="w-full aspect-square bg-gray-200 rounded-xl animate-pulse"></div>

                                    <div className="flex flex-col gap-3 px-2 w-full">
                                        <div className="flex flex-row gap-2">
                                            <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
                                            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                        </div>

                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>

                                        <div className="flex flex-row gap-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                        </div>

                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                    </div>

                                    <div className="absolute bottom-2 right-2 bg-gray-200 w-10 h-10 rounded-md animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
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
                <div className="flex flex-col items-center xl:flex-row justify-center w-full lg:w-[70vw]">
                    <div className="flex flex-col items-start flex-1 p-4 gap-4">
                        <h1 className="text-xl font-semibold">Listing Details</h1>
                        <h2>{listing.title}</h2>
                        <h1 className="text-xl font-semibold">{listing.listing_type}</h1>
                        <h1 className="text-3xl font-semibold text-primary">₦{listing.listing_type === "rent" ? (listing.price?.toLocaleString('en-US') + " per year") : listing.listing_type === "shortlet" ? (listing.price?.toLocaleString('en-US') + " per day") : (listing.price?.toLocaleString('en-US'))}</h1>
                        <p className="text-gray-500">{listing.location.Address}</p>
                        <p className="text-gray-400">{listing.location.city}, {listing.location.state} state</p>
                        <p className="text-gray-400">{new Date(listing.date_listed).toLocaleDateString()}</p>
                        <p className="text-gray-400">{listing.enquiries.length} enquiries</p>
                        <div className="flex flex-row gap-2">

                            <div className="flex flex-row items-center gap-1">
                                <FaBed size={12} className="text-primary" />
                                <p>{listing.beds} beds</p>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <FaBath size={12} className="text-primary" />
                                <p>{listing.baths} baths</p>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <FaPencilRuler size={12} className="text-primary" />
                                <p className="text-gray-400">{listing.area} square feet</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm"><span className="font-bold">Host ID</span>: {listing.host_id}</p>
                    </div>
                    <div className="w-full h-full bg-primary flex-1">f</div>
                </div>
                <div className="flex flex-col items-center gap-2 border border-gray-300 w-[85vw] xl:w-[70vw] p-4 rounded-lg">
                    <h2>About this property</h2>
                    <p className="text-center">{listing.description.slice(0, 256)}{listing.description.length > 256 && '...'} {listing.description.length > 256 && <button onClick={(e) => e.target.parentElement.innerHTML = listing.description} className="text-primary font-semibold hover:underline">Read More</button>}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 place-items-center w-[70vw] gap-4">
                    <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 w-full h-full p-4 rounded-lg">
                        <h2>Amenities</h2>
                        <div className="text-center flex flex-wrap px-4 justify-center items-center gap-2">
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
                    <div className="flex flex-col gap-2 items-center border border-gray-300 px-4 py-2 rounded-lg flex-1 w-full">
                        <h2>Host</h2>
                        <div className="flex flex-col items-center gap-2">
                            <img src={host?.avatar} alt="Host Image" className="rounded-lg w-full" />
                            <p>{host?.name}</p>
                            <p>{host?.email}</p>
                            <p className="text-sm text-gray-300">host id: {host?.id}</p>
                        </div>
                        <button onClick={() => setFormModal(true)} className="bg-primary rounded-lg cursor-pointer px-4 py-2 text-white font-semibold">Contact Host</button>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2>Similar Properties</h2>
                    <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-2">
                        {similar.slice(0, 3).map((el) => {



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
                {formModal ?
                    (<div onClick={() => setFormModal(false)} className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <form onSubmit={handleRequest} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg">
                            <label for="message">Message:</label>
                            <textarea name="message" id="message" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="Enter your message here..."></textarea>
                            <label for="name">Name:</label>
                            <input type="text" name="name" id="name" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="Enter your name here..."></input>
                            <label for="email">Email:</label>
                            <input type="email" name="email" id="email" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="Enter your email here..."></input>
                            <label for="datetime-local">Preferred Visit Date:</label>
                            <input
                                type="datetime-local"
                                required
                                className="border border-gray-300 p-2 rounded"
                                name="datetime-local"
                                id="datetime-local"
                            />
                            <button type="submit" className="bg-primary rounded-lg px-4 py-2 text-white font-semibold">Make Enquiry</button>
                        </form>
                    </div>) :
                    (null)}
            </main>
        </Layout>
    );
}

export default ListingPage;