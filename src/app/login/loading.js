const SkeletonLogin = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate-pulse">
                <div className="h-8 w-3/4 bg-gray-300 rounded mx-auto mb-6"></div>

                {/* Email Field Skeleton */}
                <div className="mb-4">
                    <div className="h-5 w-1/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-300 rounded"></div>
                </div>

                {/* Password Field Skeleton */}
                <div className="mb-4">
                    <div className="h-5 w-1/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-300 rounded"></div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-5 bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                </div>

                {/* Login Button Skeleton */}
                <div className="h-10 w-full bg-gray-300 rounded"></div>

                {/* Alternative Login Skeleton */}
                <div className="flex items-center my-4">
                    <div className="h-0.5 w-full bg-gray-300"></div>
                    <span className="px-2 text-gray-400">OR</span>
                    <div className="h-0.5 w-full bg-gray-300"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex justify-center gap-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLogin;
