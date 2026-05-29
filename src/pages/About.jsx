import Layout from "../Layout";


function About() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">About NestFind</h1>

                <div className="space-y-6 text-lg text-gray-600">
                    <p>
                        NestFind is a comprehensive real estate listing platform designed to bridge the gap between property owners and prospective tenants or buyers.
                        Whether the requirement is for long-term rentals, properties for sale, or unique short-let experiences, the platform provides the tools to discover the ideal space.
                    </p>

                    <p>
                        Property search should be intuitive and transparent. By focusing on a clean user experience and robust search capabilities,
                        NestFind enables users to filter listings by location, amenities, and price, ensuring that the property search process is as efficient as possible.
                    </p>

                    <div className="bg-gray-50 border-l-4 border-primary p-6 mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Project Goal</h2>
                        <p>
                            The goal is to provide a production-quality experience that simplifies real estate discovery. The platform enables hosts to showcase properties with confidence
                            and allows guests to explore listings with clarity.
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">1. Create Your Profile</h3>
                                <p className="text-gray-600">Sign up and choose a role. Register as a Tenant to search, save, and inquire about verified properties, or list as a Host to manage properties and track client inquiries from a centralized dashboard.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">2. Set Your Parameters</h3>
                                <p className="text-gray-600">Use the responsive search framework to filter listings by critical metrics. Filter properties by city location, layout type, price caps, and required amenities.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">3. Save and Monitor Assets</h3>
                                <p className="text-gray-600">Toggle the star icon located in the top-right corner of any property listing card to save it to a profile. Track price updates, active availability status, and location pins directly from a personal dashboard.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">4. Direct Inspection Booking</h3>
                                <p className="text-gray-600">Submit formal inquiry requests directly through the property detail page interface. Inquiries, including preferred inspection dates and contact details, route immediately to the verified host's dashboard for review.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default About;
