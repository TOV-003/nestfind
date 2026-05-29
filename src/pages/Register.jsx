import { useState, useEffect } from 'react';
import Layout from '../Layout';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        password2: '',
        role: '',
        phone: '',
        avatar: '',
    });
    const [loading, setLoading] = useState(false);
    const { signUp, user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        if (user) {
            if (user.user_metadata?.role === "host") {
                navigate('/Dashboard');
            } else if (user.user_metadata?.role === "user") {
                navigate('/Profile');
            }
        }
    }, [user, navigate]);

    async function handleSubmit(event) {
        event.preventDefault();

        if (formData.password !== formData.password2) {
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);

        const fileInput = document.getElementById('avatar');
        const file = fileInput.files[0];
        let avatarUrl = "";

        if (file) {
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

            const data = await response.json();
            avatarUrl = data.secure_url;
        }

        try {

            await signUp(formData.email, formData.password, {
                name: formData.name,
                role: formData.role,
                avatar: avatarUrl,
                phone: formData.phone
            });
            alert('Check your email for confirmation');
            console.log('Registration successful, user ID:', formData.name);
            toast.success('Account created successfully!');
            navigate('/Login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <main className="my-12 md:w-3/4 flex flex-col items-center mx-auto gap-8 px-2">
                <div className="flex lg:flex-row flex-col items-center lg:justify-center gap-4 mx-4 lg:mx-0 w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full border border-gray-300 bg-white p-6 rounded-lg">
                        <h1 className="text-xl font-semibold">Create Your Profile</h1>
                        <h3 className="text-sm">Sign up to get instant verification and start tracking your real estate listings</h3>

                        <div>
                            <label htmlFor="avatar" className="text-sm font-medium text-gray-700">Profile Picture</label>
                            <input type="file" name="avatar" id="avatar" accept="image/*" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm cursor-pointer" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor='name' className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                id='name'
                                name='name'
                                type="text"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                            />
                        </div>

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
                            <label htmlFor='phone' className="text-sm font-medium text-gray-700">Phone Number(+234**********)</label>
                            <input
                                id='phone'
                                name='phone'
                                type="tel"
                                placeholder="e.g. +234..."
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
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

                        <div className="flex flex-col gap-1">
                            <label htmlFor='password2' className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                id='password2'
                                name='password2'
                                type="password"
                                placeholder="••••••••"
                                value={formData.password2}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor='role' className="text-sm font-medium text-gray-700">Select Role</label>
                            <select
                                id='role'
                                name='role'
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100"
                            >
                                <option value="user">User</option>
                                <option value="host">Host</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default Register;