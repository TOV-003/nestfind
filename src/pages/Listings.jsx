import { useEffect, useState } from "react";
import { dataService } from "../api/dataService";
import Layout from "../Layout";
import { FaBath } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";


function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dataService.getListings()
            .then((data) => {
                setListings(data || []);
            })
            .catch((err) => {
                console.error("Error loading properties:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center text-gray-500">Loading listings...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className=" flex flex-col items-center gap-4">
                <h2>All Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
                    {listings.map((el) => {

                        if (loading) {
                            return (
                                <Layout>
                                    <div className="p-8 text-center text-gray-500">Loading listings...</div>
                                </Layout>
                            );
                        }

                        let parsedImages = [];

                        if (typeof el.images === 'string') {

                            parsedImages = el.images
                                .replace(/[{}]/g, '')
                                .split(',')
                                .map(url => url.trim());
                        } else if (Array.isArray(el.images)) {
                            parsedImages = el.images;
                        }

                        const imageSrc = parsedImages.length > 0 ? parsedImages[0] : "";

                        return (
                            <div key={el.id} className=" relative border border-gray-300 rounded-lg p-2 w-4/5  md:w-full h-full flex flex-col items-center gap-4">
                                {imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        className="w-full aspect-square object-cover rounded-lg"
                                        alt={el.title || "Property Image"}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center text-sm text-gray-500">
                                        No Image Available
                                    </div>
                                )}
                                <div className="flex flex-col gap-1 self-start">
                                    <div className="flex flex-row gap-2">
                                        <p className="text-lg font-bold">{el.title}</p>
                                        <h3 className="text-primary w-fit text-xl">₦{el.price?.toLocaleString('en-US')}</h3>
                                    </div>
                                    <p className="text-gray-400">{el.location?.city}, {el.location?.state} state. Listed {(() => {
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
                                    })()}</p>

                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-row items-center gap-1">
                                            <FaHome size={12} className="text-primary" />
                                            <p >{el.type.charAt(0).toUpperCase() + el.type.slice(1)} for {el.listing_type}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            <FaBed size={12} className="text-primary" />
                                            <p>{el.beds} bd</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            <FaBath size={12} className="text-primary" />
                                            <p >{el.baths} ba</p>
                                        </div>

                                    </div>
                                    <p className="text-gray-400 text-sm"><span className="font-bold">Host ID</span>: {el.host_id}</p>

                                </div>
                                <button className="border border-gray-500 p-2 rounded-md bottom-2 right-2 absolute"><FaHeart size={16} className="text-primary" /></button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default Listings;