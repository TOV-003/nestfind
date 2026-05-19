import { useState } from 'react';
import Layout from '../Layout';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        console.log('Submitted Form Data:', formData);
    }

    return (
        <Layout>
            <main className="my-36 md:w-3/4 flex flex-col items-center mx-auto gap-8 px-2">
                <div className="flex lg:flex-row flex-col items-center lg:justify-center gap-4 mx-4 lg:mx-0 w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg">
                        <h1 className="text-xl font-semibold">Login</h1>

                        <div className="flex flex-col gap-1">
                            <label htmlFor='email' className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id='email'
                                name='email'
                                type="email"
                                placeholder="e.g. user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                autoComplete='email'
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor='password' className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                id='password'
                                name='password'
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 w-full bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                        >
                            Log In
                        </button>
                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default Login;