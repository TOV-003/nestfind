import { useState } from 'react';
import Layout from '../Layout';
import { supabase } from '../api/supabaseClient';
import toast from 'react-hot-toast';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            toast.success('Successfully logged in!');
            console.log('Authentication successful:', data);
        } catch (error) {
            console.error('Authentication error:', error.message);
            toast.error(error.message || 'Failed to authenticate user.');
        } finally {
            setLoading(false);
        }
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
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
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
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default Login;