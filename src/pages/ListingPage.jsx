import { useParams, Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { useEffect, useState } from "react";
import Layout from "../Layout";
import { FaBed, FaBath, FaWifi, FaCar, FaChair, FaPencilRuler } from "react-icons/fa";
import toast from "react-hot-toast";
import ImageCarousel from "../components/ImageCarousel";
import PropertyMap from "../components/PropertyMap";

function ListingPage() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formModal, setFormModal] = useState(false);
    const [host, setHost] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const { data: listingData, error: listingError } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (listingError) throw listingError;

                setListing(listingData);
                toast.success("Loaded Listing!");

                const { data: hostData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', listingData.host_id)
                    .single();
                setHost(hostData);

                const { data: similarData } = await supabase
                    .from('listings')
                    .select('*')
                    .neq('id', id)
                    .eq('location->>city', listingData.location.city)
                    .limit(3);
                setSimilar(similarData || []);

            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <main className="flex flex-col items-center p-4 my-12 mx-auto gap-4">
                    <div className="w-full aspect-video bg-gray-200 rounded-2xl animate-pulse"></div>
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

    function handleRequest(event) {
        event.preventDefault();
    }

    return (
        <Layout>
            <main className="flex flex-col items-center p-4 my-12 mx-auto gap-4">
                <ImageCarousel images={Array.isArray(listing.images) ? listing.images : listing.images.replace(/[[\]"]/g, '').split(',')} />
                <div className="flex flex-col items-center xl:flex-row justify-center w-full h-full lg:w-[70vw]">
                    <div className="flex flex-col items-start p-4 gap-4 w-full">
                        <h1 className="text-xl font-semibold">Listing Details</h1>
                        <h2>{listing.title}</h2>
                        <h1 className="text-xl font-semibold">{listing.listing_type}</h1>
                        <h1 className="text-3xl font-semibold text-primary">₦{listing.price?.toLocaleString('en-US')}</h1>
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
                            <div className="flex flex-row items-center gap-1">
                                <FaPencilRuler size={12} className="text-primary" />
                                <p className="text-gray-400">{listing.area} sq ft</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full min-h-100 border border-gray-200 rounded-lg overflow-hidden">
                        <PropertyMap addresses={[listing.location.Address]} />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 border border-gray-300 w-[85vw] xl:w-[70vw] p-4 rounded-lg">
                    <h2>About this property</h2>
                    <p className="text-center">{listing.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 place-items-center w-[70vw] gap-4">
                    <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 w-full h-full p-4 rounded-lg">
                        <h2>Amenities</h2>
                        <div className="text-center flex flex-wrap px-4 justify-center items-center gap-2">
                            {listing.amenities && Object.entries(listing.amenities)
                                .filter(([, value]) => value === true)
                                .map(([key]) => (
                                    <div key={key} className="flex flex-row items-center gap-2">
                                        {key === "WiFi" ? <FaWifi /> : key === "Parking" ? <FaCar /> : <FaChair />}
                                        <p className="text-sm text-gray-500 capitalize">{key}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center border border-gray-300 px-4 py-2 rounded-lg flex-1 w-full">
                        <h2>Host</h2>
                        <img src={host?.avatar} alt="Host" className=" h-64 rounded-full object-cover" />
                        <p>{host?.name}</p>
                        <button onClick={() => setFormModal(true)} className="cursor-pointer bg-primary rounded-lg px-4 py-2 text-white font-semibold">Contact Host</button>
                    </div>
                </div>

                {formModal ? (
                    <div
                        onClick={() => setFormModal(false)}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                        <form
                            onSubmit={handleRequest}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg"
                        >
                            <label htmlFor="message">Message:</label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                placeholder="Enter your message here..."
                            ></textarea>

                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                placeholder="Enter your name here..."
                            ></input>

                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                placeholder="Enter your email here..."
                            ></input>

                            <label htmlFor="datetime-local">Preferred Visit Date:</label>
                            <input
                                type="datetime-local"
                                required
                                className="border border-gray-300 p-2 rounded"
                                name="datetime-local"
                                id="datetime-local"
                            />

                            <button
                                type="submit"
                                className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold"
                            >
                                Make Enquiry
                            </button>
                        </form>
                    </div>
                ) : null}

                <div className="flex flex-col items-center gap-2">
                    <h2>Similar Properties</h2>
                    <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-2">
                        {similar.map((el) => (
                            <div key={el.id} className="relative border border-gray-300 rounded-xl p-2 w-full h-full flex flex-col gap-2">
                                <Link to={`/listings/${el.id}`}>
                                    <img src={Array.isArray(el.images) ? el.images[0] : el.images.replace(/[[\]"]/g, '').split(',')[0]} className="w-full aspect-square object-cover rounded-xl" alt={el.title} />
                                </Link>
                                <p className="font-bold">{el.title}</p>
                                <p className="text-primary font-bold">₦{el.price?.toLocaleString()}</p>
                                <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Host ID:</span>{el.host_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default ListingPage;