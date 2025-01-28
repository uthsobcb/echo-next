import { PieChart } from '@mui/x-charts/PieChart';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from "auth";
import SignOut from '../components/SignOut';
import axios from 'axios';
import { format } from 'date-fns';
import ProfileEntries from './ProfileEntries';

const badges = [
    { id: 1, name: "Echo Sunshine", img: "/assets/Echos-Sun.png" },
    { id: 2, name: "Pen Whisperer", img: "/assets/badge_1.png" },
    { id: 3, name: "Mindful Scribe", img: "/assets/badge_2.png" },
    { id: 4, name: "Thought Architect", img: "/assets/badge_3.png" },
    { id: 5, name: "Guardian of Inked Wisdom", img: "/assets/badge_4.png" }
];

export default async function User() {
    const session = await auth();
    const user = session?.user || null;
    let moodData = [];

    if (session) {
        try {
            const moodtracker = await axios.get(`${process.env.BASEURL}/api/mood-tracker`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            moodData = moodtracker.data;
        } catch (error) {
            console.error("Error fetching mood data:", error.response?.data || error.message);
        }
    }

    const pieChartData = Array.isArray(moodData)
        ? moodData.map(({ mood, score }) => ({
            label: mood,
            value: score || 8
        }))
        : [];

    const selectedData = Array.isArray(moodData)
        ? moodData.slice(-7).map(({ mood, score }) => ({
            label: mood,
            value: score || 20
        }))
        : [];
    // console.log(last7DaysData);


    const valuesArray = pieChartData.map(({ value }) => value || 0);
    const totalValue = valuesArray.reduce((sum, value) => sum + value, 0);
    // console.log(valuesArray, "and", totalValue);


    const overallComment = totalValue > 50 ? "You're doing great!" : "You can do better!";

    const userBadges = badges.filter((badge) => user?.badge?.includes(badge.name));

    return (
        <>
            <div className='container mx-auto flex flex-col lg:flex-row m-28 gap-10'>
                <div className="border border-black shadow-xl bg-gray-100/60 rounded-lg w-full lg:w-1/3 my-10 p-1 lg:p-6">
                    <div className='flex flex-col items-center align-center'>
                        {user?.image && (
                            <Image src={user.image} height={120} width={128} alt={user?.name} className='rounded-full m-4' />
                        )}
                        <div className='space-y-2 align-center text-center'>
                            <p className="text-lg font-semibold break-words">Name: {user?.name}</p>
                            <p className="text-md text-gray-600 break-words">Mail: {user?.email}</p>
                            <p className="text-md text-gray-600">Plan: {user?.subscription}</p>
                            <p className="text-md text-gray-600">
                                Entries Left: <span className="font-medium">Unlimited</span>
                            </p>
                        </div>
                        <h3 className="mt-6 font-bold text-lg text-gray-800">Badges</h3>
                        <div className='flex flex-wrap justify-center gap-2 p-4'>
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
                                        <p className="text-sm text-gray-700 mt-1 text-center">{badge.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No badges earned yet.</p>
                            )}
                        </div>
                    </div>
                    <div className='mt-3 flex justify-between flex-wrap gap-2'>
                        <button className='bg-green-700 px-4 py-2 text-white rounded-md font-semibold w-full sm:w-auto text-center'>
                            Update Profile
                        </button>
                        <SignOut />
                    </div>
                </div>
                <div className="border border-black shadow-xl bg-gray-200/60 rounded-lg w-full lg:w-2/3 my-10 p-6">
                    <div className="flex flex-col items-center p-8 rounded-lg text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Mood Tracker</h1>
                        <div>
                            <p className="text-lg text-gray-600 mb-6 leading-none">Mood over the last</p>
                            {/* <select
                                id="mood-range"
                                className="text-lg text-gray-600 border rounded-md px-3 py-1 h-10"
                                defaultValue={7}
                            >
                                {[7, 15, 21, 30].map((day) => (
                                    <option key={day} value={day}>
                                        {day} days
                                    </option>
                                ))}
                            </select>*/}
                        </div>
                        <div className="w-full flex justify-center">
                            <PieChart
                                series={[
                                    {
                                        data: pieChartData,
                                    },
                                ]}
                                width={600}
                                height={200}
                                className="w-full max-w-[90%] sm:max-w-lg lg:max-w-4xl"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-blue-50 rounded-lg p-6 shadow-md w-full max-w-3xl">
                            <Image src='/assets/logo.png' alt="Echo" width={96} height={96} className="object-contain mb-4 md:mb-0" />
                            <p className="text-black text-center text-lg leading-relaxed">
                                <span className="font-semibold text-blue-600">Echo says:</span> It seems:- { }
                                {overallComment}

                                <br />
                                <Link href="/chat">
                                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                                        Talk to Echo
                                    </button>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ProfileEntries session={session} />
        </>
    );
}
