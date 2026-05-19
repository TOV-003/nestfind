
import Layout from "../Layout"
import { useEffect, useState } from "react";
import { dataService } from '../api/dataService';
import { Fragment } from "react";
import { FaBath } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';


function Home() {

    const heroIMGs = ["/IMG1.jpg", "/IMG2.jpg", "/IMG3.jpg"];
    const [index, setIndex] = useState(0);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const localStates = [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "FCT",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara"
    ];
    const localCities = [
        "Aba",
        "Abakaliki",
        "Abeokuta",
        "Aboh",
        "Abuja",
        "Ado Ekiti",
        "Afikpo",
        "Agbor",
        "Aguata",
        "Agulu",
        "Ahoada",
        "Akure",
        "Ankpa",
        "Asaba",
        "Awka",
        "Badagry",
        "Bauchi",
        "Beli",
        "Benin City",
        "Bida",
        "Birnin Kebbi",
        "Biu",
        "Calabar",
        "Damaturu",
        "Daura",
        "Dere",
        "Dutse",
        "Ede",
        "Effurun",
        "Eket",
        "Enugu",
        "Epe",
        "Funtua",
        "Gashua",
        "Gboko",
        "Gombe",
        "Gusau",
        "Hadejia",
        "Ibadan",
        "Idah",
        "Ife",
        "Ifon",
        "Ijebu-Ode",
        "Ikeja",
        "Ikenne",
        "Ikorodu",
        "Ikot Ekpene",
        "Ila Orangun",
        "Ilesa",
        "Ilorin",
        "Inisa",
        "Iseyin",
        "Iwo",
        "Jalingo",
        "Jimeta",
        "Jos",
        "Kaduna",
        "Kafanchan",
        "Kano",
        "Katsina",
        "Keffi",
        "Koko",
        "Kontagora",
        "Lafia",
        "Lagos",
        "Lokoja",
        "Madalla",
        "Maiduguri",
        "Makurdi",
        "Minna",
        "Mubi",
        "Nasarawa",
        "New Bussa",
        "Nnewi",
        "Nningi",
        "Nsukka",
        "Obudu",
        "Offa",
        "Ogale",
        "Ogbomosho",
        "Ogoja",
        "Okene",
        "Okigwe",
        "Okitipupa",
        "Okrika",
        "Ondo",
        "Onitsha",
        "Oron",
        "Orlu",
        "Oshogbo",
        "Otite",
        "Otukpo",
        "Owerri",
        "Owo",
        "Oyo",
        "Port Harcourt",
        "Potiskum",
        "Sagamu",
        "Saki",
        "Sapele",
        "Sokoto",
        "Suleja",
        "Ugep",
        "Umuahia",
        "Uromi",
        "Uyo",
        "Warri",
        "Wukari",
        "Yenagoa",
        "Yola",
        "Zaria"
    ];

    const allCities = listings.map(el => el.location?.city).filter(Boolean);
    const cityCounts = allCities.reduce((acc, city) => {
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});
    const top6Cities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(entry => entry[0]);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % 3)
        }, 10000);
        return () => clearInterval(timer)
    }, [])

    const [formData, setFormData] = useState({
        location: '',
        type: '',
        listing_type: '',
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

    async function handleSubmit(event) {
        event.preventDefault();

        const rawPayload = {
            maxPrice: formData.maxPrice ? Number(formData.maxPrice) : null,
            beds: formData.beds ? Number(formData.beds) : null,
            baths: formData.baths ? Number(formData.baths) : null,
            listing_type: formData.listing_type,
            type: formData.type,
            state: formData.state,
            city: formData.city,
        };
        const filteredPayload = Object.fromEntries(
            Object.entries(rawPayload).filter(([, value]) => {
                return value !== null && value !== undefined && value !== '' && value !== 'all';
            })
        );

        console.log('Submitted Property Criteria:', filteredPayload);
        navigate('/listings', { state: { criteria: filteredPayload } });
    }


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




    return (
        <Layout>
            <main className="my-12 md:w-3/4 flex flex-col items-center mx-auto gap-8">
                <div className="flex lg:flex-row flex-col items-center lg:justify-center gap-4 mx-4 lg:mx-0">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg">
                        <h1 className="text-xl font-semibold">Find Your Next Home With Next Find</h1>
                        <h3 className="text-sm">Search verified listings, compare neighbourhoods, and save favourites</h3>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City/Town
                            </label>
                            <input
                                list="cities"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Lagos, Ibadan"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <datalist id="cities">
                                {localCities.map((city) => (
                                    <option key={city} value={city} />
                                ))}
                            </datalist>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="state" className="text-sm font-medium text-gray-700">
                                State
                            </label>
                            <input
                                list="states"
                                id="state"
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="e.g. Lagos, Rivers"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <datalist id="states">
                                {localStates.map((state) => (
                                    <option key={state} value={state} />
                                ))}
                            </datalist>
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

                        <div className="flex gap-1">
                            <div className="flex gap-2 flex-col w-1/2">
                                <span className="text-sm font-medium text-gray-700">Max Price</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={formData.maxPrice}
                                    onChange={handleChange}
                                    placeholder="Max Price"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div className="flex gap-2 flex-col w-1/2">
                                <label htmlFor="type" className="text-sm font-medium text-gray-700">
                                    Listing Type
                                </label>
                                <select
                                    id="listing_type"
                                    name="listing_type"
                                    value={formData.listing_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="rent">Rent</option>
                                    <option value="sale">Sale</option>
                                    <option value="shortlet">Short Let</option>
                                </select>
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
                    <img key={index} src={heroIMGs[index]} className="w-96  lg:w-120 rounded-lg animate-fade-in" alt="Interior Image" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="font-semibold">Featured Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center">
                        {listings.slice(0, 9).map((el) => {

                            if (loading) {
                                return (
                                    <Layout>
                                        <div className="p-8 text-center text-gray-500">Loading listings...</div>
                                    </Layout>
                                );
                            }

                            return (
                                <div key={el.id} className=" relative border border-gray-300 rounded-lg p-2 w-4/5  md:w-full h-full flex flex-col items-center gap-4">

                                    <Link to={`/listings/${el.id}`}>
                                        <img
                                            src={el.images.slice(1, -1).split(',')[0]}
                                            className="w-full aspect-square object-cover rounded-xl"
                                            alt={el.title || "Property Image"}
                                        />
                                    </Link>
                                    <div className="flex flex-col gap-1 self-start">
                                        <div className="flex flex-row gap-2">
                                            <p className="text-lg font-bold">{el.title}</p>
                                            <h3 className="text-primary w-fit text-xl">₦{el.price?.toLocaleString('en-US')}{el.listing_type === 'rent' ? ' per year' : el.listing_type === 'shortlet' ? ' per day' : ''}</h3>
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
                                        <div className="flex flex-wrap items-center gap-1">
                                            {Object.entries(el.amenities)
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
                                    <button className="border border-gray-500 p-2 rounded-md bottom-2 right-2 absolute"><FaHeart size={16} className="text-primary" /></button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-6">
                    <h2 className="font-semibold">How It Works</h2>
                    <div className="flex flex-col items-center px-2 md:px-0 gap-4 text-center">
                        <h3>1. Create Your Profile</h3>
                        <p>Sign up and choose your role. Register as a Tenant to search, save, and safely inquire about verified properties, or list as a Host to manage your properties and track client inquiries from a centralized dashboard.</p>
                    </div>
                    <div className="flex flex-col items-center px-2 md:px-0 gap-4 text-center">
                        <h3>2. Set Your Parameters</h3>
                        <p>Use the responsive search framework to filter listings by critical metrics. Filter properties by city location (e.g., Lagos, Ibadan), layout type (e.g., apartment, duplex, studio), price caps, and required amenities.</p>
                    </div>
                    <div className="flex flex-col items-center px-2 md:px-0 gap-4 text-center">
                        <h3>3. Save and Monitor Assets</h3>
                        <p>Toggle the star icon located in the top-right corner of any property listing card to save it to your profile. Track price updates, active availability status, and location pins directly from your personal dashboard.</p>
                    </div>
                    <div className="flex flex-col items-center px-2 md:px-0 gap-4 text-center">
                        <h3>4. Direct Inspection Booking</h3>
                        <p>Submit formal inquiry requests directly through the property detail page interface. Your inquiries, including preferred inspection dates and direct contact details, route immediately to the verified host's dashboard for review.</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2>Popular Cities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
                        {top6Cities.map((el, index) => (
                            <div key={index} className="flex flex-col items-baseline bg-linear-to-br from-white to-primary text-white font-semibold pt-8 pb-1 px-12 rounded-lg">
                                <h2>{el}</h2>
                            </div>
                        ))}
                    </div>
                </div>


            </main>
        </Layout >
    )
}

export default Home
