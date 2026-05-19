import { useEffect, useState } from "react";
import { Fragment } from "react";
import { dataService } from "../api/dataService";
import Layout from "../Layout";
import { FaBath } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";



function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

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


    const [formData, setFormData] = useState({
        location: '',
        type: '',
        listing_type: '',
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: '',
        amenities: {
            wifi: false,
            parking: false,
            pool: false,
            generator: false,
            security: false,
            gym: false,
            furnished: false
        }

    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                amenities: {
                    ...prevData.amenities,
                    [name]: checked // Writes true or false directly
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
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
                let allListings = data || [];
                const filteredCriteria = location.state?.criteria;
                if (filteredCriteria) {
                    allListings = allListings.filter((item) => {
                        if (filteredCriteria.type && item.type !== filteredCriteria.type) {
                            return false;
                        }
                        if (filteredCriteria.listing_type && item.listing_type !== filteredCriteria.listing_type) {
                            return false;
                        }
                        if (filteredCriteria.beds && item.beds !== filteredCriteria.beds) {
                            return false;
                        }
                        if (filteredCriteria.baths && item.baths !== filteredCriteria.baths) {
                            return false;
                        }
                        const loc = typeof item.location === 'string' ? JSON.parse(item.location) : item.location;
                        if (filteredCriteria.city && loc?.city?.toLowerCase() !== filteredCriteria.city.toLowerCase()) {
                            return false;
                        }
                        if (filteredCriteria.state && loc?.state?.toLowerCase() !== filteredCriteria.state.toLowerCase()) {
                            return false;
                        }
                        if (filteredCriteria.maxPrice && item.price > filteredCriteria.maxPrice) {
                            return false;
                        }

                        return true;
                    });
                }
                setListings(allListings);
            })
            .catch((err) => {
                console.error("Error loading properties:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.state?.criteria]);

    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center text-gray-500">Loading listings...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className=" flex flex-col items-center gap-4 my-12 mx-auto px-4">
                <div className="flex flex-col xl:flex-row xl:justify-center items-center xl:items-start gap-2 w-full">
                    <div className="flex flex-col h-full items-start gap-2 w-fit md:w-[60vw] xl:w-fit xl:pl-12 xl:pr-2 pl-2 pr-2">
                        <h3 className="text-xl font-bold">Filters</h3>
                        <p className="text-sm text-gray-400">Refine your search bto find the perfect home.</p>
                        <div>APPLIED FILTERS</div>
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-wrap xl:flex-col gap-4 w-full">
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
                                        name="type"
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

                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(formData.amenities).map((el) => (
                                    <div key={el} className="flex justify-start">
                                        <label className="flex items-center gap-2 cursor-pointer capitalize text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                name={el}
                                                checked={formData.amenities[el]}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            {el}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm transition-colors"

                            >
                                Apply Filters
                            </button>

                        </form>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center">
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
                                <div key={el.id} className=" relative border border-gray-300 rounded-xl p-2 w-4/5  md:w-full h-full flex flex-col items-center gap-4">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            className="w-full aspect-square object-cover rounded-xl"
                                            alt={el.title || "Property Image"}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center text-sm text-gray-500">
                                            No Image Available
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 self-start">
                                        <div className="flex flex-row gap-2">
                                            <p className="text-xl font-bold">{el.title}</p>
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
                                                <p>{el.type.charAt(0).toUpperCase() + el.type.slice(1)} for {el.listing_type}</p>
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

            </main>
        </Layout>
    );
}

export default Listings;