import Layout from "../layout"
import { useState } from "react";


function Home() {

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

    return (
        <Layout>
            <main className="my-12">
                <div className="flex md:flex-row flex-col items-center gap-4 md:mx-16 mx-4">
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
                    <img src={`IMG1`} />
                </div>
            </main>
        </Layout>
    )
}

export default Home
