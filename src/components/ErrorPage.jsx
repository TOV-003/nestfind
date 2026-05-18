import { useRouteError, Link } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    console.error(error); // Logs the complete stack trace to the developer tools console

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
                <p className="text-gray-600 mb-4">Something went wrong while rendering this section.</p>s
                <div className="bg-gray-100 p-3 rounded text-left text-sm font-mono text-red-700 wrap-break-word mb-6 overflow-x-auto">
                    {error?.message || error?.statusText || "Unknown Runtime Error"}
                </div>

                <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}

export default ErrorPage;