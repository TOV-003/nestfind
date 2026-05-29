import { FiInbox } from 'react-icons/fi'; // Using react-icons for a clean aesthetic

function EmptyState({ title, message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center lg:col-span-2">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6">
                <FiInbox className="w-10 h-10 bg-primary text-white" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm">{message}</p>
        </div>
    );
}

export default EmptyState;

// Example usage in your Enquiries.jsx:
// {compiledEnquiries.length === 0 && (
//     <EmptyState
//         title="No enquiries yet"
//         message="When you send an enquiry for a property, it will appear here for your review."
//     />
// )}