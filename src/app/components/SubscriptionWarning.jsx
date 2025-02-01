import { AlertCircle } from "lucide-react";
import Link from "next/link";
const SubscriptionWarning = () => {
    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white border border-red-400 shadow-md rounded-lg text-center">
            <AlertCircle className="text-red-500 mx-auto" size={40} />

            <h2 className="text-lg font-semibold text-gray-800 mt-2">
                You're not subscribed!
            </h2>
            <p className="text-gray-600 mt-2">
                Subscribe to unlock unlimited journaling and AI chat.
            </p>
            <Link href="/subscribe"
                className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
                Subscribe Now
            </Link>
        </div>
    );
};

export default SubscriptionWarning;
