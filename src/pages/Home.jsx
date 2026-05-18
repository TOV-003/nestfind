import Layout from "../Layout"
import { useEffect, useState } from "react";
import { dataService } from '../api/dataService';

function Home() {

    const heroIMGs = ["/IMG1.jpg", "/IMG2.jpg", "/IMG3.jpg"];
    const [index, setIndex] = useState(0);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % 3)
        }, 10000);
        return () => clearInterval(timer)
    }, [])

    const [formData, setFormData] = useState({
        location: '',
        type: 'house',
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            ...formData,
            minPrice: formData.minPrice ? Number(formData.minPrice) : null,
            maxPrice: formData.maxPrice ? Number(formData.maxPrice) : null,
            beds: formData.beds ? Number(formData.beds) : null,
            baths: formData.baths ? Number(formData.baths) : null,
        };

        console.log('Submitted Property Criteria:', payload);
    };

    useEffect(() => {
        dataService.getListings()
            .then((data) => {
                setListings(data);
            })
            .catch((err) => {
                console.error("Error loading properties:", err);
            });
    }, []);



    return (
        <Layout>
            <main className="my-12 md:w-3/4 flex flex-col items-center mx-auto gap-8">
                <div className="flex md:flex-row flex-col items-center md:justify-center gap-4 mx-4 md:mx-0">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg">
                        <h1 className="text-xl font-semibold">Find Your Next Home With Next Find</h1>
                        <h3 className="text-sm">Search verified listings, compare neighbourhoods, and save favourites</h3>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="location" className="text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Lagos, Ibadan"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="type" className="text-sm font-medium text-gray-700">
                                Property Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="condo">Studio</option>
                                <option value="duplex">Duplex</option>
                                <option value="townhouse">Land</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">Price Range</span>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={formData.minPrice}
                                    onChange={handleChange}
                                    placeholder="Min Price"
                                    min="0"
                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={formData.maxPrice}
                                    onChange={handleChange}
                                    placeholder="Max Price"
                                    min="0"
                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col gap-1 w-1/2">
                                <label htmlFor="beds" className="text-sm font-medium text-gray-700">
                                    Beds
                                </label>
                                <input
                                    id="beds"
                                    type="number"
                                    name="beds"
                                    value={formData.beds}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <label htmlFor="baths" className="text-sm font-medium text-gray-700">
                                    Baths
                                </label>
                                <input
                                    id="baths"
                                    type="number"
                                    name="baths"
                                    value={formData.baths}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.5"
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm transition-colors"
                        >
                            Search Properties
                        </button>

                    </form>
                    <img key={index} src={heroIMGs[index]} className="w-96 md:w-120 rounded-lg animate-fade-in" alt="Interior Image" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="font-semibold">Featured Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
                        {listings.map((el) => {
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
                                <div key={el.id} className="border border-gray-300 rounded-lg p-2 w-4/5  md:w-full h-100 flex flex-col items-center gap-2">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            className="w-full aspect-square object-cover rounded-lg"
                                            alt={el.title}
                                            onError={(e) => {
                                                e.target.src = "/listing.jpg";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center text-sm text-gray-500">
                                            No Image Available
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 self-start">
                                        <h3 className="text-lg font-semibold">{el.title}</h3>
                                        <p className="text-sm text-gray-500">Host ID: {el.host_id}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="font-semibold">How it Works</h2>
                    <div>
                        <h3>1. Create Your Profile</h3>
                        <p>Sign up and choose your role. Register as a Tenant to search, save, and safely inquire about verified properties, or list as a Host to manage your properties and track client inquiries from a centralized dashboard.</p>
                    </div>
                    <div>
                        <h3>2. Set Your Parameters</h3>
                        <p>Use the responsive search framework to filter listings by critical metrics. Filter properties by city location (e.g., Lagos, Ibadan), layout type (e.g., apartment, duplex, studio), price caps, and required amenities.</p>
                    </div>
                    <div>
                        <h3>3. Save and Monitor Assets</h3>
                        <p>Toggle the star icon located in the top-right corner of any property listing card to save it to your profile. Track price updates, active availability status, and location pins directly from your personal dashboard.</p>
                    </div>
                    <div>
                        <h3>4. Direct Inspection Booking</h3>
                        <p>Submit formal inquiry requests directly through the property detail page interface. Your inquiries, including preferred inspection dates and direct contact details, route immediately to the verified host's dashboard for review.</p>
                    </div>
                </div>

            </main>
        </Layout>
    )
}

export default Home
