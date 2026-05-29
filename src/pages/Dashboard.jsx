import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaBath, FaPencilRuler } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { Fragment } from "react";
import Layout from '../Layout';
import { supabase } from '../api/supabaseClient';
import { toast } from 'react-hot-toast';
import { Chart } from '../components/Chart';
import EmptyState from '../components/EmptyState';


function Dashboard() {

    const [isChecking, setIsChecking] = useState(true);
    const { user, logout, createListing, deleteListing, editListing, toggleActive } = useAuth();
    const navigate = useNavigate();
    const [hostListings, setHostListings] = useState([]);
    const [enquiryDates, setEnquiryDates] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [profile, setProfile] = useState(null);
    const [modal, setModal] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const url = import.meta.env.VITE_SUPABASE_URL;
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        listing_type: '',
        price: '',
        location: {
            "city": "",
            "state": "",
            "Address": ""
        },
        images: [],
        beds: '',
        baths: '',
        date_listed: new Date().toISOString().replace('T', ' ').slice(0, 19) + '+00',
        amenities: {
            "Gym": false,
            "Pool": false,
            "WiFi": false,
            "Parking": false,
            "Security": false,
            "Furnished": false,
            "Generator": false
        },
        description: '',
        area: '',
    });

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

    function logOut() {
        logout();
        navigate('/');

    }

    async function deleteMyAccount() {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Full URL being fetched:", `${url}/functions/v1/delete-user`);

        if (!session || !session.access_token) {
            console.error("No session or token found!");
            throw new Error('No active session found.');
        }

        try {
            const response = await fetch(`${url}/functions/v1/delete-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) throw new Error('Could not delete account');
            try {
                await supabase.auth.signOut();
            } catch (authErr) {
                console.warn("Session already revoked or user deleted:", authErr);
            }

            return true;
        } catch (err) {
            console.error('Network or Server Error:', err);
            throw err;
        }
    }

    function toggle() {
        setModal(true);
    }

    function toggleUpload() {
        setUploadModal(true);
    }


    async function handleCreateListing(event) {
        event.preventDefault();
        console.log("Submitting formData:", formData);
        setUploading(true);

        const fileInput = document.getElementById('avatar');
        const files = Array.from(fileInput.files);
        let avatarUrls = [];

        if (files.length >= 3 && files.length <= 6) {
            const uploadPromises = files.map(async (file) => {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );

                    if (!response.ok) throw new Error("Upload failed");

                    const data = await response.json();
                    return data.secure_url;
                } catch (error) {
                    console.error("Single image upload failed:", error);
                    return null;
                }
            });

            const results = await Promise.all(uploadPromises);
            avatarUrls = results.filter(url => url !== null);

            if (avatarUrls.length === 0) {
                throw new Error("No images were uploaded successfully.");
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            images: avatarUrls
        }));

        try {

            await createListing({
                ...formData,
                images: avatarUrls,
                host_id: user?.id,
                host_name: user?.user_metadata?.name,
            });
            toast.success('Listing created successfully!');
            setUploadModal(false);
            setRefresh((prev) => !prev);
            setUploading(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function removeListing(id) {
        await deleteListing(id);
        toast.success('Listing deleted successfully!');
        setDeleteModal(false);
        setRefresh((prev) => !prev);
    }

    function toggleDelete() {
        setDeleteModal(true);
    }

    async function editListings(id, updates) {
        setUploading(true);
        try {
            await editListing(id, updates);
            toast.success('Listing updated successfully!');
            setEditModal(false);
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update listing.");
        } finally {
            setUploading(false);
        }
    }

    async function toggleActiveListing(id, isActive) {
        await toggleActive(id, isActive);
        toast.success('Listing updated successfully!');
        setRefresh((prev) => !prev);
    }

    function toggleEdit() {
        setEditModal(true);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAmenityChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            amenities: {
                ...prevData.amenities,
                [name]: checked
            }
        }));
    };

    const handleLocationChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            location: {
                ...prevData.location,
                [name]: value
            }
        }));
    };

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .then(({ data, error }) => {
                    if (data) {
                        setProfile(data[0]);
                    } else {
                        console.error("Failed to fetch user IDs:", error);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        const fetchListingsWithCounts = async () => {
            if (!user?.id) return;

            const { data: listings, error: listingsError } = await supabase
                .from('listings')
                .select('*')
                .eq('host_id', user.id);

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

            const { data: enquiriesDates, error: enquiriesDatesError } = await supabase
                .from('enquiries')
                .select('listing_id, created_at')
                .in('listing_id', listingIds);

            if (enquiriesDatesError) {
                console.error("Error fetching enquiries:", enquiriesDatesError);
                return;
            }

            const enquiryDates = enquiriesDates;
            setEnquiryDates(enquiryDates);
            console.log("Enquiry Dates:", enquiryDates);
        };



        fetchListingsWithCounts();
    }, [user, refresh]);

    const getListingEnquiryData = () => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return hostListings.map(listing => {
            const enquiriesInLast30Days = enquiryDates.filter(enq => {
                const isMatch = String(enq.listing_id) === String(listing.id);
                const enquiryDate = new Date(enq.created_at);
                return isMatch && enquiryDate >= thirtyDaysAgo && enquiryDate <= today;
            }).length;

            return {
                name: listing.title,
                amount: enquiriesInLast30Days
            };
        });
    };



    return (
        <Layout>
            <main className=' my-12 flex flex-col  gap-2 items-center  md:items-start justify-center md:flex-row px-4'>
                <div className='my-12 flex flex-col items-center gap-4 flex-1 text-center'>
                    <img src={profile?.avatar} alt="avatar" className="rounded-full w-32 h-32" />
                    <h1>{profile?.name}</h1>
                    <h2 className='text-lg text-gray-400 font-normal'>{profile?.role === "host" && profile?.role}</h2>
                    <div className='flex flex-wrap gap-2 md:w-3/4 justify-center'>
                        <h1 className='w-full text-lg'>My Activity</h1>
                        <Link to="/Enquiries"><button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">My Enquiries</button></Link>
                        <Link to="/Saved"><button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">To Saved Listings</button></Link>
                        <h1 className='w-full text-lg'>Manage Listings</h1>
                        <Link to="/UserEnquiries"><button className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">To User Enquiries</button></Link>
                        <button className="bg-blue-800 cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={toggleUpload}>Create Listing</button>
                        {uploadModal &&
                            <div
                                onClick={() => setUploadModal(false)}
                                className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 overflow-y-auto"
                            >
                                <form onSubmit={handleCreateListing} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white my-12 p-6 rounded-lg" onClick={(e) => e.stopPropagation()}>
                                    <label>
                                        <p>Title</p>
                                        <input type="text" value={formData.title} onChange={handleChange} name="title" id="title" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. New Apartment" />
                                    </label>
                                    <label>
                                        <p>Type</p>
                                        <select name="type" value={formData.type} id="type" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white">
                                            <option value="" disabled>Select Property Type</option>
                                            <option value="house">House</option>
                                            <option value="apartment">Apartment</option>
                                            <option value="studio">Studio</option>
                                            <option value="duplex">Duplex</option>
                                        </select>
                                    </label>
                                    <label>
                                        <p>Listing Type</p>
                                        <select name="listing_type" value={formData.listing_type} id="listing_type" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white">
                                            <option value="" disabled>Select Listing Type</option>
                                            <option value="rent">Rent</option>
                                            <option value="sale">Sale</option>
                                            <option value="shortlet">Short Let</option>
                                        </select>
                                    </label>
                                    <label>
                                        <p>Price</p>
                                        <input type="number" value={formData.price} onChange={handleChange} name="price" id="price" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. 100000" />
                                    </label>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="city" className="text-sm font-medium text-gray-700">City/Town</label>
                                        <input
                                            list="localCities"
                                            id="city"
                                            name="city"
                                            value={formData.location.city}
                                            onChange={handleLocationChange}
                                            placeholder="e.g. Lagos, Ibadan"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                            required
                                        />
                                        <datalist id="localCities">
                                            {localCities.map((city) => <option key={city} value={city} />)}
                                        </datalist>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="state-id" className="text-sm font-medium text-gray-700">State</label>
                                        <input
                                            list="localStatesList"
                                            id="state-id"
                                            name="state"
                                            value={formData.location.state}
                                            onChange={handleLocationChange}
                                            placeholder="e.g. Lagos, Rivers"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                            required
                                        />
                                        <datalist id="localStatesList">
                                            {localStates.map((state) => <option key={state} value={state} />)}
                                        </datalist>
                                    </div>
                                    <label>
                                        <p>Address</p>
                                        <input type="text" value={formData.location.Address} name="Address" id="address" required onChange={handleLocationChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. Lagos, Nigeria" />
                                    </label>
                                    <label>
                                        <p>Images (Minimum of 3, Maximum of 6, No larger than 1mb)</p>
                                        <input type="file" name="images" multiple id="avatar" accept="image/*" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. Lagos, Nigeria" />
                                    </label>
                                    <label>
                                        <p>Beds</p>
                                        <input type="number" value={formData.beds} onChange={handleChange} name="beds" id="beds" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. 2" />
                                    </label>
                                    <label>
                                        <p>Baths</p>
                                        <input type="number" value={formData.baths} onChange={handleChange} name="baths" id="baths" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. 2" />
                                    </label>
                                    <label>
                                        <p>Area (sq ft)</p>
                                        <input type="number" value={formData.area} onChange={handleChange} name="area" id="area" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. 100" />
                                    </label>
                                    <div className='flex flex-wrap justify-center gap-2'>
                                        {['Gym', 'Pool', 'WiFi', 'Parking', 'Security', 'Furnished', 'Generator'].map((amenity) => (
                                            <div key={amenity} className='flex gap-2 w-fit'>
                                                <label htmlFor={amenity.toLowerCase()} className="font-medium text-gray-700">
                                                    {amenity}
                                                </label>
                                                <input
                                                    type="checkbox"
                                                    name={amenity}
                                                    value={amenity.toLowerCase()}
                                                    id={amenity.toLowerCase()}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                                    checked={formData.amenities[amenity] || false}
                                                    onChange={handleAmenityChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <label>
                                        <p>Description</p>
                                        <textarea name="description" value={formData.description} id="description" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. This is a description of the property"></textarea>
                                    </label>

                                    <button type="submit" className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">{uploading ? 'Uploading...' : 'Create Listing'}</button>
                                </form>
                            </div>
                        }
                        <button className="bg-gray-400 cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={logOut}>Log Out</button>
                        <button className="bg-warning cursor-pointer rounded-lg px-4 py-2 text-white font-semibold" onClick={toggle}>Delete My Account</button>
                    </div>
                    {modal ? (
                        <div
                            onClick={() => setModal(false)}
                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        >
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await deleteMyAccount();
                                        navigate('/');
                                    } catch (err) {
                                        console.error("Delete failed:", err);
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg"
                            >
                                <label>
                                    <p>Are you sure you want to delete your account?</p>
                                    <p>This action cannot be undone.</p>
                                </label>
                                <button
                                    type="submit"
                                    className="bg-error cursor-pointer rounded-lg px-4 py-2 text-white font-semibold"
                                >
                                    Delete Account
                                </button>
                            </form>
                        </div>
                    ) : null}
                </div>
                <div className='flex flex-col gap-4 items-center flex-2'>
                    <div className='flex flex-col gap-2 items-center md:items-start justify-center'>
                        <h2 id='saved'>My Listings</h2>
                        <div className='flex items-center gap-4 flex-wrap md:justify-start justify-center'>
                            <p className='px-2 py-1 border border-gray-400 text-gray-400 rounded-lg'>Total Listings: {hostListings.length}</p>
                            <p className='px-2 py-1 border border-gray-400 text-gray-400 rounded-lg'>Active Listings: {hostListings.filter(listing => listing.active).length}</p>
                            <p className='px-2 py-1 border border-gray-400 text-gray-400 rounded-lg'>Inactive Listings: {hostListings.filter(listing => !listing.active).length}</p>
                            <p className='px-2 py-1 border border-gray-400 text-gray-400 rounded-lg'>Total Enquiries: {hostListings.reduce((total, listing) => total + (listing.enquiryCount || 0), 0)}</p>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4'>
                            {console.log("Host Listings IDs:", hostListings)}
                            {hostListings.length === 0 ? (
                                <EmptyState title="No listings found" message="Please try creating new listings." />
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
                                            <div className='flex items-center flex-wrap justify-center gap-2'>
                                                <button onClick={() => {
                                                    toggleDelete();
                                                    setActiveId(el.id)
                                                }
                                                } className='bg-error px-4 py-2 font-bold text-white rounded-lg cursor-pointer'>Delete Listing</button>
                                                {deleteModal &&
                                                    <div
                                                        onClick={() => setModal(false)}
                                                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                                    >
                                                        <form
                                                            onSubmit={async (e) => {
                                                                e.preventDefault();
                                                                await removeListing(activeId);
                                                                navigate('/dashboard');
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg"
                                                        >
                                                            <label>
                                                                <p>Are you sure you want to delete this listing?</p>
                                                                <p>This action cannot be undone.</p>
                                                            </label>
                                                            <button
                                                                type="submit"
                                                                className="bg-error cursor-pointer rounded-lg px-4 py-2 text-white font-semibold"
                                                            >
                                                                Delete Listing
                                                            </button>
                                                        </form>
                                                    </div>
                                                }
                                                <button onClick={() => toggleActiveListing(el.id, el.active)} className={`${el.active ? "bg-warning" : "bg-green-800"} px-4 py-2 font-bold text-white rounded-lg cursor-pointer`}>{el.active ? 'Deactivate' : 'Activate'} Listing</button>
                                                <button onClick={() => {
                                                    toggleEdit();
                                                    setActiveId(el.id)
                                                }
                                                } className='bg-primary px-4 py-2 font-bold text-white rounded-lg cursor-pointer'>Edit Listing</button>
                                                {


                                                    editModal &&
                                                    <div
                                                        onClick={() => setEditModal(false)}
                                                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                                    >
                                                        <form
                                                            onSubmit={async (e) => {
                                                                e.preventDefault();
                                                                await editListings(activeId, {
                                                                    title: formData.title,
                                                                    listing_type: formData.listing_type,
                                                                    price: formData.price,
                                                                    amenities: formData.amenities,
                                                                    description: formData.description,
                                                                });
                                                                navigate('/dashboard');
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg"
                                                        >
                                                            <label>
                                                                <p>New Title</p>
                                                                <input type="text" value={formData.title} onChange={handleChange} name="title" id="title" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. New Apartment" />
                                                            </label>
                                                            <label>
                                                                <p>New Type</p>
                                                                <select name="type" value={formData.type} id="type" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white">
                                                                    <option value="" disabled>Select Property Type</option>
                                                                    <option value="house">House</option>
                                                                    <option value="apartment">Apartment</option>
                                                                    <option value="studio">Studio</option>
                                                                    <option value="duplex">Duplex</option>
                                                                </select>
                                                            </label>
                                                            <label>
                                                                <p>New Listing Type</p>
                                                                <select name="listing_type" value={formData.listing_type} id="listing_type" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white">
                                                                    <option value="" disabled>Select Listing Type</option>
                                                                    <option value="rent">Rent</option>
                                                                    <option value="sale">Sale</option>
                                                                    <option value="shortlet">Short Let</option>
                                                                </select>
                                                            </label>
                                                            <label>
                                                                <p>New Price</p>
                                                                <input type="number" value={formData.price} onChange={handleChange} name="price" id="price" required className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. 100000" />
                                                            </label>
                                                            <div className='flex flex-wrap justify-center gap-2'>
                                                                {['Gym', 'Pool', 'WiFi', 'Parking', 'Security', 'Furnished', 'Generator'].map((amenity) => (
                                                                    <div key={amenity} className='flex gap-2 w-fit'>
                                                                        <label htmlFor={amenity.toLowerCase()} className="font-medium text-gray-700">
                                                                            {amenity}
                                                                        </label>
                                                                        <input
                                                                            type="checkbox"
                                                                            name={amenity}
                                                                            id={amenity.toLowerCase()}
                                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                                                            checked={formData.amenities[amenity] || false}
                                                                            onChange={handleAmenityChange}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <label>
                                                                <p>New Description</p>
                                                                <textarea name="description" value={formData.description} id="description" required onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="e.g. This is a description of the property"></textarea>
                                                            </label>

                                                            <button type="submit" className="bg-primary cursor-pointer rounded-lg px-4 py-2 text-white font-semibold">{uploading ? 'Uploading...' : 'Update Listing'}</button>

                                                        </form>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="w-full h-px bg-primary my-4 rounded-full" />
                        {hostListings.length === 0 ? null : <Chart data={getListingEnquiryData()} />}
                    </div>
                </div>

            </main>

        </Layout >
    )
}

export default Dashboard
