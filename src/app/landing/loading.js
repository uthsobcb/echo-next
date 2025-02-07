const SkeletonLandingPage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center animate-pulse">
            {/* Hero Section Skeleton */}
            <section className="text-center py-20 px-6 max-w-3xl">
                <div className="h-12 w-3/4 bg-gray-300 rounded mx-auto"></div>
                <div className="h-5 w-4/5 bg-gray-300 rounded mx-auto mt-4"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded mx-auto mt-2"></div>

                {/* Button Skeleton */}
                <div className="h-10 w-48 bg-gray-300 rounded-lg mx-auto mt-6"></div>
            </section>

            {/* Content Sections Skeleton */}
            <div className="flex flex-col md:flex-row bg-gray-50 rounded-xl w-full max-w-5xl">
                {/* Left Section Skeleton */}
                <section className="py-16 px-6 md:w-1/2 text-center">
                    <div className="max-w-lg mx-auto">
                        <div className="h-8 w-3/4 bg-gray-300 rounded mx-auto"></div>
                        <div className="h-4 w-full bg-gray-300 rounded mt-6"></div>
                        <div className="h-4 w-4/5 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 w-3/5 bg-gray-300 rounded mt-2"></div>
                    </div>
                </section>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-gray-300 self-stretch mx-4"></div>

                {/* Right Section Skeleton */}
                <section className="py-16 px-6 md:w-1/2">
                    <div className="max-w-lg mx-auto">
                        <div className="h-8 w-3/4 bg-gray-300 rounded mx-auto"></div>

                        <div className="mt-8 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
                                    <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SkeletonLandingPage;
