import { useEffect, useState } from 'react';
import { dataService } from '../api/dataService';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import Layout from '../Layout';
import { toast } from 'react-hot-toast';

function Enquiries() {
    const { user, editEnquiry } = useAuth();
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState([]);
    const [listings, setListings] = useState([]);
    const [compiledEnquiries, setCompiledEnquiries] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [isChecking, setIsChecking] = useState(true);
    const [expandedId, setExpandedId] = useState(true);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

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

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('enquiries')
                .select('listing_id')
                .eq('user_id', user.id)
                .then(({ data, error }) => {
                    if (data) {
                        const ids = data.map(item => item.listing_id);
                        setSavedIds(ids);
                        console.log("Fetched saved IDs:", ids);
                    } else {
                        console.error("Failed to fetch saved IDs:", error);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if (savedIds.length > 0) {
            Promise.all(savedIds.map(id => dataService.getListingById(id)))
                .then((results) => {
                    setListings(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(results)) return prev;
                        console.log("Fetched listings for enquiries:", results);
                        return results;
                    });
                })
                .catch((err) => console.error(err));
        }
    }, [savedIds]);

    useEffect(() => {
        function setComp(comped) {
            setCompiledEnquiries(comped)
        }
        if (listings.length > 0 && enquiries.length > 0) {
            const compiled = enquiries.map((enquiry) => {
                const listing = listings.find((l) => l.id === enquiry.listing_id);
                return { ...enquiry, listing };
            });
            setComp(compiled);
            console.log("Compiled enquiries:", compiled);
        }
    }, [listings, enquiries]);

    useEffect(() => {
        if (savedIds.length > 0) {
            Promise.all(savedIds.map(id => dataService.getEnquiryById(id)))
                .then((results) => {
                    setEnquiries(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(results)) return prev;
                        console.log("results", results);

                        return results;
                    });
                })
                .catch((err) => console.error(err));
        }
    }, [savedIds]);

    if (isChecking) {
        return (
            <Layout>
                <main className="flex flex-col gap-2 items-center flex-2 w-full">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 w-full">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-2 w-4/5 md:w-full h-64 bg-gray-100" />
                        ))}
                    </div>
                    <div className="h-8 w-48 bg-gray-200 rounded my-4" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 w-full">
                        {[1, 2].map((i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-2 w-4/5 md:w-full h-64 bg-gray-100" />
                        ))}
                    </div>
                </main>
            </Layout>
        );
    }

    async function handleEditEnquiry(listingId, newDate) {
        try {
            await editEnquiry(listingId, newDate);
            setCompiledEnquiries(prev => prev.map(enq =>
                enq.listing_id === listingId
                    ? { ...enq, date: newDate, responded: false }
                    : enq
            ));

            toast.success("Enquiry Updated Successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update enquiry.");
        }
    }


    return (
        <Layout>
            <main className='flex flex-col gap-2 my-12 items-center px-4'>
                <h2 id='saved'>My Enquiries</h2>
                {console.log(enquiries)}
                <div className='grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        compiledEnquiries.map((el) => {

                            return (
                                <div key={el.user_id + "." + el.listing_id} className="flex flex-col relative rounded-lg border border-gray-300 p-2 w-4/5 md:w-full h-full items-center gap-2">
                                    <div className='flex flex-col items-center '>
                                        <Link to={`/listings/${el.listing.id}`}>
                                            <img
                                                src={el.listing.images?.[0] || '/placeholder-property.jpg'}
                                                className="w-32 aspect-square object-cover rounded-xl"
                                                alt={el.listing.title || "Property Image"}
                                            />
                                        </Link>
                                        <div className="flex flex-col gap-1 items-center px-2 w-full text-center">
                                            <div className="flex flex-col items-center gap-2 w-full">
                                                <p className="text-lg font-bold">{el.listing.title}</p>
                                                <h3 className="text-primary font-bold text-lg whitespace-nowrap">
                                                    ₦{el.listing.price?.toLocaleString('en-US')}
                                                    {el.listing.listing_type === 'rent' ? '/yr' : el.listing.listing_type === 'shortlet' ? '/day' : ''}
                                                </h3>
                                            </div>
                                            <p className="text-gray-400 text-xs mt-2"><span className="font-bold">Host:</span> {el.listing.host_name ?? 'Unknown Host'}</p>
                                        </div>
                                    </div>
                                    <hr className='border-t border-primary w-full' />
                                    <div className='w-4/5 flex flex-col items-start'>
                                        <p className={`${expandedId === el.listing_id ? '' : 'line-clamp-1'} cursor-pointer hover:underline`} onClick={() => toggleExpand(el.listing_id)}>
                                            <span className='font-bold'>Message:</span> {el.message}
                                        </p>
                                        <p><span className='font-bold'>Date:</span> {el.date}</p>
                                        {
                                            (() => {
                                                console.log("Evaluating status for enquiry:", el);
                                                const targetDate = new Date(el.date);
                                                const now = new Date();
                                                targetDate.setHours(0, 0, 0, 0);
                                                now.setHours(0, 0, 0, 0);

                                                if (el.responded) {
                                                    return <p className='text-primary font-bold'>Ready for Visit</p>;
                                                } else if (now > targetDate) {
                                                    return (
                                                        <>
                                                            <p className='text-red-600 font-bold'>Expired - Action Required(Change Date)</p>
                                                            <input
                                                                type="date"
                                                                className="cursor-pointer border border-gray-300 rounded-lg px-2 py-1 text-sm bg-warning font-bold text-white "
                                                                min={new Date().toISOString().split('T')[0]}
                                                                onChange={(e) => {
                                                                    const newDate = e.target.value;
                                                                    if (newDate) {
                                                                        handleEditEnquiry(el.listing_id, newDate);
                                                                    }
                                                                }}
                                                            />
                                                        </>
                                                    );
                                                } else {
                                                    return <p className='text-gray-400 font-bold'>Awaiting Review</p>;
                                                }
                                            })()}

                                    </div>

                                </div>
                            );
                        })
                    }
                </div>
            </main>
        </Layout>
    )
}

export default Enquiries
