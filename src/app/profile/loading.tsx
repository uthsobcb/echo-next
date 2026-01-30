
export default function loading() {
    return (
        <div className='container mx-auto flex flex-col lg:flex-row m-28 gap-10'>
            <div className="border border-black shadow-xl bg-gray-100/60 rounded-lg w-full lg:w-1/3 my-10 p-1 lg:p-6 animate-pulse">
                <div className='flex flex-col items-center align-center'>
                    <div className="rounded-full bg-gray-300 h-28 w-28 m-4"></div>

                    <div className='space-y-2 align-center text-center w-full'>
                        <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto"></div>
                        <div className="h-4 w-2/3 bg-gray-300 rounded mx-auto"></div>
                        <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
                        <div className="h-4 w-1/3 bg-gray-300 rounded mx-auto"></div>
                    </div>

                    <h3 className="mt-6 font-bold text-lg text-gray-800">Badges</h3>
                    <div className='flex flex-wrap justify-center gap-2 p-4'>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="rounded-full bg-gray-300 h-20 w-20"></div>
                                <div className="h-4 w-12 bg-gray-300 rounded mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className='mt-3 flex justify-between flex-wrap gap-2'>
                    <div className='bg-gray-300 h-10 w-full sm:w-1/2 rounded-md'></div>
                    <div className='bg-gray-300 h-10 w-full sm:w-1/2 rounded-md'></div>
                </div>
            </div>

            {/* Mood Tracker Section Skeleton */}
            <div className="border border-black shadow-xl bg-gray-200/60 rounded-lg w-full lg:w-2/3 my-10 p-6 animate-pulse">
                <div className="flex flex-col items-center p-8 rounded-lg text-center">
                    <div className="h-10 w-3/4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 w-2/3 bg-gray-300 rounded mb-6"></div>

                    {/* Chart Skeleton */}
                    <div className="w-full flex justify-center">
                        <div className="w-full sm:max-w-lg lg:max-w-4xl h-40 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
