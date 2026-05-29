import { useEffect, useState } from "react";
import { Fragment } from "react";
import { dataService } from "../api/dataService";
import Layout from "../Layout";
import { FaBath, FaPencilRuler } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { supabase } from '../api/supabaseClient';


function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState(null);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('default');
    const { user } = useAuth();
    const [savedIds, setSavedIds] = useState([]);

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('saved_listings')
                .select('listing_id')
                .eq('user_id', user.id)
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Supabase Error:", error);
                        return;
                    }
                    if (data) {
                        setSavedIds(data.map(item => item.listing_id));
                    }
                });
        } else {
            function revert() {
                setSavedIds([]);
            }
            revert();
        }
    }, [user?.id]);

    const localStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
        "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
        "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
        "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
        "Yobe", "Zamfara"
    ];

    const localCities = [
        "Aba", "Abakaliki", "Abeokuta", "Aboh", "Abuja", "Ado Ekiti", "Afikpo", "Agbor",
        "Aguata", "Agulu", "Ahoada", "Akure", "Ankpa", "Asaba", "Awka", "Badagry", "Bauchi",
        "Beli", "Benin City", "Bida", "Birnin Kebbi", "Biu", "Calabar", "Damaturu", "Daura",
        "Dere", "Dutse", "Ede", "Effurun", "Eket", "Enugu", "Epe", "Funtua", "Gashua", "Gboko",
        "Gombe", "Gusau", "Hadejia", "Ibadan", "Idah", "Ife", "Ifon", "Ijebu-Ode", "Ikeja",
        "Ikenne", "Ikorodu", "Ikot Ekpene", "Ila Orangun", "Ilesa", "Ilorin", "Inisa", "Iseyin",
        "Iwo", "Jalingo", "Jimeta", "Jos", "Kaduna", "Kafanchan", "Kano", "Katsina", "Keffi",
        "Koko", "Kontagora", "Lafia", "Lagos", "Lokoja", "Madalla", "Maiduguri", "Makurdi",
        "Minna", "Mubi", "Nasarawa", "New Bussa", "Nnewi", "Nningi", "Nsukka", "Obudu", "Offa",
        "Ogale", "Ogbomosho", "Ogoja", "Okene", "Okigwe", "Okitipupa", "Okrika", "Ondo",
        "Onitsha", "Oron", "Orlu", "Oshogbo", "Otite", "Otukpo", "Owerri", "Owo", "Oyo",
        "Port Harcourt", "Potiskum", "Sagamu", "Saki", "Sapele", "Sokoto", "Suleja", "Ugep",
        "Umuahia", "Uromi", "Uyo", "Warri", "Wukari", "Yenagoa", "Yola", "Zaria"
    ];

    const [formData, setFormData] = useState({
        city: '',
        state: '',
        type: 'house',
        listing_type: 'rent',
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

    useEffect(() => {
        function applyFiltersFromState() {
            if (location.state?.criteria) {
                const criteria = location.state.criteria;
                setActiveFilters(criteria);
                setFormData((prev) => ({
                    ...prev,
                    city: criteria.city || '',
                    state: criteria.state || '',
                    type: criteria.type || 'house',
                    listing_type: criteria.listing_type || 'rent',
                    maxPrice: criteria.maxPrice || '',
                    beds: criteria.beds || '',
                    baths: criteria.baths || '',
                    amenities: {
                        wifi: criteria.amenities?.wifi || false,
                        parking: criteria.amenities?.parking || false,
                        pool: criteria.amenities?.pool || false,
                        generator: criteria.amenities?.generator || false,
                        security: criteria.amenities?.security || false,
                        gym: criteria.amenities?.gym || false,
                        furnished: criteria.amenities?.furnished || false
                    }
                }));
            } else {
                setActiveFilters(null);
                setFormData({
                    city: '',
                    state: '',
                    type: 'house',
                    listing_type: 'rent',
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
            }
        }
        applyFiltersFromState();
    }, [location.state?.criteria]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                amenities: {
                    ...prevData.amenities,
                    [name]: checked
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const activeAmenities = Object.fromEntries(
            Object.entries(formData.amenities).filter(([, checked]) => checked === true)
        );

        const rawPayload = {
            ...formData,
            maxPrice: formData.maxPrice ? Number(formData.maxPrice) : null,
            beds: formData.beds ? Number(formData.beds) : null,
            baths: formData.baths ? Number(formData.baths) : null,
            listing_type: formData.listing_type,
            type: formData.type,
            state: formData.state,
            city: formData.city,
            amenities: Object.keys(activeAmenities).length > 0 ? activeAmenities : null,
        };

        const filteredPayload = Object.fromEntries(
            Object.entries(rawPayload).filter(([, value]) => {
                return value !== null && value !== undefined && value !== '' && value !== 'all';
            })
        );

        navigate('/listings', { state: { criteria: filteredPayload } });
    }

    function handleRemoveFilter(filterKey) {
        const updatedFilters = { ...activeFilters, [filterKey]: null };
        if (filterKey === 'city' || filterKey === 'state') updatedFilters[filterKey] = '';

        setActiveFilters(updatedFilters);
        navigate('/listings', { state: { criteria: updatedFilters } }, { replace: true });
    }

    function handleRemoveAmenity(amenityKey) {
        if (!activeFilters?.amenities) return;

        const updatedAmenities = { ...activeFilters.amenities };
        delete updatedAmenities[amenityKey];

        const hasRemainingAmenities = Object.keys(updatedAmenities).length > 0;

        const updatedFilters = {
            ...activeFilters,
            amenities: hasRemainingAmenities ? updatedAmenities : null
        };

        setActiveFilters(updatedFilters);
        navigate('/listings', { state: { criteria: updatedFilters } }, { replace: true });
    }

    function handleClearAllFilters() {
        setActiveFilters(null);
        setFormData({
            city: '',
            state: '',
            type: 'house',
            listing_type: 'rent',
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
        navigate('/listings', { state: null }, { replace: true });
    }

    function handleLoadMore() {
        setPage((prev) => prev + 1);
    }

    function handleSort(event) {
        const { value } = event.target;
        setSort(value);
    }

    async function save(listingId) {
        await supabase
            .from('saved_listings')
            .insert({ user_id: user.id, listing_id: listingId });
    }

    async function unsave(listingId) {
        await supabase
            .from('saved_listings')
            .delete()
            .eq('user_id', user.id)
            .eq('listing_id', listingId);
    }

    async function handleToggle(listingId) {
        if (!user) return;

        const isCurrentlySaved = savedIds.includes(listingId);

        if (isCurrentlySaved) {
            setSavedIds(prev => prev.filter(id => id !== listingId));
            await unsave(listingId);
        } else {
            setSavedIds(prev => [...prev, listingId]);
            await save(listingId);
        }
    }

    useEffect(() => {
        function triggerLoading() {
            setLoading(true);
        }
        triggerLoading();
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

                        const loc = item.location;
                        if (filteredCriteria.city && loc?.city?.toLowerCase() !== filteredCriteria.city.toLowerCase()) {
                            return false;
                        }
                        if (filteredCriteria.state && loc?.state?.toLowerCase() !== filteredCriteria.state.toLowerCase()) {
                            return false;
                        }
                        if (filteredCriteria.maxPrice && item.price > filteredCriteria.maxPrice) {
                            return false;
                        }

                        if (filteredCriteria.amenities) {
                            const itemAmenities = item.amenities || {};
                            const matchesAllChecked = Object.keys(filteredCriteria.amenities).every((amenityKey) => {
                                return Object.entries(itemAmenities).some(
                                    ([key, val]) => key.toLowerCase() === amenityKey.toLowerCase() && val === true
                                );
                            });

                            if (!matchesAllChecked) {
                                return false;
                            }
                        }
                        return true;
                    });
                }
                toast.success("Loaded Listings!");
                setListings(allListings);
            })
            .catch((err) => {
                console.error("Error loading properties:", err);
                toast.error("Failed to load listings");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.state?.criteria]);

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col xl:flex-row xl:justify-center items-center xl:items-start gap-2 w-full my-12">
                    <div className="flex flex-col h-full items-start gap-2 w-fit md:w-[60vw] xl:w-fit xl:pl-12 xl:pr-2 pl-2 pr-2">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
                        <form className="flex flex-col md:flex-wrap xl:flex-col gap-4 w-full">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                                    <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
                                </div>
                            ))}
                        </form>
                    </div>
                    <div className="flex-col flex items-center gap-8 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center w-full">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="relative border border-gray-300 rounded-xl p-2 w-full flex flex-col gap-4 h-100 animate-pulse bg-gray-50" />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className="flex flex-col items-center gap-4 my-12 mx-auto px-4 w-full">
                <div className="flex flex-col xl:flex-row xl:justify-center items-center xl:items-start gap-6 w-full">

                    <div className="flex flex-col h-full items-start gap-2 w-full md:w-[60vw] xl:w-75 xl:shrink-0 px-2">
                        <h3 className="text-xl font-bold">Filters</h3>
                        <p className="text-sm text-gray-400">Refine your search to find the perfect home.</p>

                        {activeFilters && Object.entries(activeFilters).some(([, val]) => val !== null && val !== '') && (
                            <div className="flex flex-wrap items-center gap-2 my-2 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
                                <span className="text-sm font-semibold text-gray-600 mr-2">Active Filters:</span>
                                {Object.entries(activeFilters).map(([key, value]) => {
                                    if (value === null || value === '' || value === 'all') return null;

                                    if (key === 'amenities' && typeof value === 'object') {
                                        return Object.keys(value).map((amenityKey) => (
                                            <div key={`amenity-${amenityKey}`} className="flex items-center gap-2 bg-primary text-white text-sm font-light px-3 py-1.5 rounded-lg">
                                                <span className="capitalize">{amenityKey}</span>
                                                <button type="button" onClick={() => handleRemoveAmenity(amenityKey)} className="text-white hover:text-gray-500 font-bold cursor-pointer">X</button>
                                            </div>
                                        ));
                                    }

                                    let displayLabel = `${key}: ${value}`;
                                    if (key === 'maxPrice') displayLabel = `Max Price: ₦${Number(value).toLocaleString()}`;
                                    if (key === 'listing_type') displayLabel = `Type: ${value}`;

                                    return (
                                        <div key={key} className="flex items-center gap-2 bg-primary text-white text-sm font-light px-3 py-1.5 rounded-lg">
                                            <span className="capitalize">{displayLabel}</span>
                                            <button type="button" onClick={() => handleRemoveFilter(key)} className="text-white hover:text-gray-500 font-bold cursor-pointer">X</button>
                                        </div>
                                    );
                                })}
                                <button onClick={handleClearAllFilters} className="text-xs text-error hover:text-red-800 font-medium cursor-pointer underline">Clear All</button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700">City/Town</label>
                                <input list="cities" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Lagos, Ibadan" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                                <datalist id="cities">
                                    {localCities.map((city) => <option key={city} value={city} />)}
                                </datalist>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="state" className="text-sm font-medium text-gray-700">State</label>
                                <input list="states" id="state" type="text" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Lagos, Rivers" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                                <datalist id="states">
                                    {localStates.map((state) => <option key={state} value={state} />)}
                                </datalist>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="type" className="text-sm font-medium text-gray-700">Property Type</label>
                                <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white">
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="condo">Studio</option>
                                    <option value="duplex">Duplex</option>
                                    <option value="townhouse">Land</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex gap-1 flex-col w-1/2">
                                    <label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">Max Price</label>
                                    <input type="number" id="maxPrice" name="maxPrice" value={formData.maxPrice} onChange={handleChange} placeholder="Max Price" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                                </div>

                                <div className="flex gap-1 flex-col w-1/2">
                                    <label htmlFor="listing_type" className="text-sm font-medium text-gray-700">Listing Type</label>
                                    <select id="listing_type" name="listing_type" value={formData.listing_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white">
                                        <option value="rent">Rent</option>
                                        <option value="sale">Sale</option>
                                        <option value="shortlet">Short Let</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex flex-col gap-1 w-1/2">
                                    <label htmlFor="beds" className="text-sm font-medium text-gray-700">Beds</label>
                                    <input id="beds" type="number" name="beds" value={formData.beds} onChange={handleChange} min="1" placeholder="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                                </div>
                                <div className="flex flex-col gap-1 w-1/2">
                                    <label htmlFor="baths" className="text-sm font-medium text-gray-700">Baths</label>
                                    <input id="baths" type="number" name="baths" value={formData.baths} onChange={handleChange} min="1" placeholder="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-2">
                                {Object.keys(formData.amenities).map((el) => (
                                    <div key={el} className="flex justify-start">
                                        <label className="flex items-center gap-2 cursor-pointer capitalize text-sm text-gray-600">
                                            <input type="checkbox" name={el} checked={formData.amenities[el]} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                            {el}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="w-full bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">Apply Filters</button>
                        </form>
                    </div>

                    <div className="flex-col flex items-center gap-8 w-full">
                        <div className="flex flex-col items-center md:flex-row md:justify-between gap-4 w-full px-4">
                            <p>Showing 1 to {page * 9 > listings.length ? listings.length : page * 9} of {listings.length} listings</p>
                            <div className="flex flex-row justify-between items-center gap-4">
                                <p>Sort</p>
                                <select name="sort" id="sort" onChange={handleSort} className="border border-gray-500 text-gray-500 px-4 py-2 rounded-lg bg-white">
                                    <option value="default">Default</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="date-desc">Date: Newest to Oldest</option>
                                    <option value="date-asc">Date: Oldest to Newest</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center w-full">
                            {(() => {
                                let sortedListings = [...listings];

                                if (sort === 'price') {
                                    sortedListings.sort((a, b) => (a.price || 0) - (b.price || 0));
                                } else if (sort === 'price-desc') {
                                    sortedListings.sort((a, b) => (b.price || 0) - (a.price || 0));
                                } else if (sort === 'date-desc') {
                                    sortedListings.sort((a, b) => new Date(b.date_listed) - new Date(a.date_listed));
                                } else if (sort === 'date-asc') {
                                    sortedListings.sort((a, b) => new Date(a.date_listed) - new Date(b.date_listed));
                                }

                                return sortedListings.slice(0, page * 9).map((el) => {
                                    const listingLocation = el.location;
                                    const listingAmenities = el.amenities;

                                    return (
                                        <div key={el.id} className="relative border border-gray-300 rounded-xl p-2 w-full h-full flex flex-col items-center gap-4">
                                            <Link to={`/listings/${el.id}`} className="w-full">
                                                <img
                                                    src={Array.isArray(el.images) ? el.images[0] : el.images}
                                                    className="w-full aspect-square object-cover rounded-xl"
                                                    alt={el.title || "Property Image"}
                                                />
                                            </Link>
                                            <div className="flex flex-col gap-1 self-start w-full px-2 pb-12">
                                                <div className="flex flex-row justify-between items-start gap-2 w-full">
                                                    <p className="text-lg font-bold">{el.title}</p>
                                                    <h3 className="text-primary font-bold text-lg whitespace-nowrap">
                                                        ₦{el.price?.toLocaleString('en-US')}
                                                        {el.listing_type === 'rent' ? '/yr' : el.listing_type === 'shortlet' ? '/day' : ''}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {listingLocation?.city}, {listingLocation?.state} state. Listed {(() => {
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
                                                        <p className="capitalize">{el.type === "apartment" ? "Apt" : el.type} for {el.listing_type === "shortlet" ? "STR" : el.listing_type}</p>
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
                                                    {listingAmenities && Object.entries(listingAmenities)
                                                        .filter(([, value]) => value === true)
                                                        .map(([key], index, array) => (
                                                            <Fragment key={key}>
                                                                <p className="text-xs text-gray-500 capitalize">{key}</p>
                                                                {index < array.length - 1 && <span className="text-gray-300 text-xs">|</span>}
                                                            </Fragment>
                                                        ))
                                                    }
                                                </div>
                                                <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Host:</span>{el.host_name || 'Unknown Host'}</p>
                                            </div>
                                            <button onClick={() => handleToggle(el.id)} className="border border-gray-300 p-2 rounded-md bottom-2 right-2 absolute bg-white cursor-pointer hover:bg-gray-50">
                                                <FaHeart size={16} className={savedIds.includes(el.id) ? "text-primary" : "text-gray-400"} />
                                            </button>
                                        </div>
                                    );
                                });
                            })()}
                        </div>

                        {listings.length > page * 9 && (
                            <button className="bg-primary text-white px-6 py-2 w-fit rounded-lg cursor-pointer font-medium mt-4" onClick={handleLoadMore}>Load More</button>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default Listings;