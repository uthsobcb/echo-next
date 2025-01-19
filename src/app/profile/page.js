import { PieChart } from '@mui/x-charts/PieChart';
import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut } from "auth"
const timelineEntries = [
    {
        id: 1,
        title: "Started My Journal Journey",
        date: "2025-01-01",
        mood: "🌟 Happy",
        excerpt: "Excited to start this journey of self-reflection and growth!",
    },
    {
        id: 2,
        title: "A Day of Productivity",
        date: "2025-01-02",
        mood: "💪 Motivated",
        excerpt: "Achieved so much today! Feeling proud of myself.",
    },
    {
        id: 3,
        title: "Reflecting on Challenges",
        date: "2025-01-03",
        mood: "🌧 Reflective",
        excerpt: "Faced some struggles but learned valuable lessons.",
    },
];

const badges = [
    {
        id: 1,
        name: "Echo Sunshine",
        img: "/assets/Echos-Sun.png",
    },
    {
        id: 2,
        name: "Pen Whisperer",
        img: "/assets/badge_1.png",
    },
    {
        id: 3,
        name: "Mindful Scribe",
        img: "/assets/badge_2.png",
    },
    {
        id: 4,
        name: "Thought Architect",
        img: "/assets/badge_3.png",
    },
    {
        id: 5,
        name: "Guardian of Inked Wisdom",
        img: "/assets/badge_4.png",
    }
]

export default async function User() {
    const session = await auth();
    const user = session?.user || null;

    // Find the badge corresponding to the user's badge name
    // const userBadge = badges.find((badge) => badge.name === user?.badge) || badges[0]; // Default to "Echo Sunshine"
    const userBadges = badges.filter((badge) => user?.badges?.includes(badge.name));

    return (
        <>
            <div className='container mx-auto flex flex-col lg:flex-row m-28 gap-10'>
                <div className="border border-black shadow-xl bg-gray-100/60 rounded-lg w-full lg:w-1/3  my-10 p-1 lg:p-6">
                    <div className='flex flex-col items-center align-center'>
                        <img src="https://ui-avatars.com/api/?name=pico" alt="" className='rounded-full w-28 m-4' />
                        <div className='space-y-2 align-center'>
                            <p className="text-lg font-semibold">Name: {user?.name}</p>
                            <p className="text-md text-gray-600">Mail: {user?.email}</p>
                            <p className="text-md text-gray-600">Plan: {user?.subscription}</p>
                            <p className='text-md text-gray-600'>Entries: 35</p>
                            <p className="text-md text-gray-600">
                                Subscription Ends: <span className="font-medium">01/12/2024</span>
                            </p>
                        </div>
                        <h3 className="mt-6 font-bold text-lg text-gray-800">Badges</h3>
                        <div className='flex flex-wrap gap-2 p-4'>
                            {userBadges.length > 0 ? (
                                userBadges.map((badge) => (
                                    <div key={badge.id} className="flex flex-col items-center">
                                        <Image
                                            src={badge.img}
                                            alt={`${badge.name} Badge`}
                                            width={80}
                                            height={80}
                                            className="rounded-full"
                                        />
                                        <p className="text-sm text-gray-700 mt-1">{badge.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No badges earned yet.</p>
                            )}
                            {/* <Image src='/assets/badge_1.png' alt="PenWhishpererBadge" width={112} height={112} className="rounded-full" /> */}
                        </div>
                    </div>
                    <div className='mt-3 justify-between flex'>
                        <button className='bg-green-700 p-2 text-white rounded-md font-semibold'>Update Profile</button>
                        <button className='bg-yellow-700 p-2 text-white rounded-md font-semibold'>Logout</button>
                    </div>
                </div>
                <div className="border border-black shadow-xl bg-gray-200/60 rounded-lg w-2/3  my-10 p-6">
                    <div className="flex flex-col items-center p-8 rounded-lg">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Mood Tracker</h1>
                        <p className="text-lg text-gray-600 mb-6">Mood over the last 7 days</p>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { value: 10, label: "Frustration" },
                                        { value: 15, label: "Lonely" },
                                        { value: 20, label: "Happy" },
                                        { value: 30, label: "Depressed" },
                                        { value: 15, label: "Sad" },
                                        { value: 59, label: "Great" },
                                        { value: 55, label: "Nice" },
                                    ],
                                },
                            ]}
                            width={800}
                            height={200}
                            className="w-full max-w-4xl mb-8"
                        />

                        <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-blue-50 rounded-lg p-6 shadow-md w-full max-w-3xl">

                            <Image src='/assets/logo.png' alt="Echo" width={96} height={96} className="object-contain mb-4" />
                            <p className="text-black text-center text-lg leading-relaxed">
                                <span className="font-semibold text-blue-600">Echo says:</span> It seems
                                you're positive this week! Keep it up and continue focusing on your
                                well-being.
                            </p>
                        </div>
                    </div>
                </div >
                <div>

                </div>

            </div >
            <div className="flex flex-col items-center justify-center">
                <div className="w-full p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Search Your Entries
                    </h2>
                    <div className="flex w-full justify-center items-center m-3">
                        <div className="flex w-1/2 justify-center items-center space-x-4">
                            <input
                                type="text"
                                placeholder="Type to search..."
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            <input
                                type="date"
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>


                    <div className="flex gap-4 overflow-x-auto pb-4 justify-center">
                        <div className="relative border-l-2 border-gray-200">
                            {timelineEntries.map((entry, index) => (
                                <div key={entry.id} className="mb-8 ml-4">
                                    <div className="absolute w-6 h-6 bg-blue-500 rounded-full -left-3.5 border-2 border-white"></div>
                                    `<Link href='/entry/{entry.id}' className="flex items-center gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow-md">
                                            <p className="text-sm text-gray-500">{entry.date}</p>
                                            <h2 className="text-xl font-semibold">{entry.title}</h2>
                                            <p className="text-sm text-gray-700 mt-1">{entry.mood}</p>
                                            <p className="mt-2 text-gray-600">{entry.excerpt}</p>

                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}
