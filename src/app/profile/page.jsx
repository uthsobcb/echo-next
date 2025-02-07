import { PieChart } from '@mui/x-charts/PieChart';
import { ResponsiveChartContainer } from '@mui/x-charts';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from "auth";
import SignOut from '../components/SignOut';
import axios from 'axios';
import { format } from 'date-fns';
import ProfileEntries from './Components/ProfileEntries';
import BetterMood from './Components/BetterMood';
import BadMood from './Components/BadMood';
import ErrorPage from '../components/ErrorPage';
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
    let journalEntries = [];
    let userData = [];

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

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/entries`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            journalEntries = response.data;
        } catch (error) {

            console.log("Error fetching entries:", error.response?.data || error.message);
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/profile`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            userData = response.data.user;
        } catch (error) {
            console.log("Error fetching entries:", error.response?.data || error.message);
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
            value: Math.abs(score) || 10
        }))
        : [];
    // console.log(last7DaysData);


    const valuesArray = pieChartData.map(({ value }) => value || 0);
    const totalValue = valuesArray.reduce((sum, value) => sum + value, 0);
    // console.log(valuesArray, "and", totalValue);


    const userBadges = badges.filter((badge) => userData?.badge?.includes(badge.name));

    return (
        <>
            {session ? (
                <>
                    <div className='container mx-auto flex flex-col lg:flex-row m-28 gap-10'>
                        <div className="border border-black shadow-xl bg-gray-100/60 rounded-lg w-full lg:w-1/3 my-10 p-1 lg:p-6">
                            <div className='flex flex-col items-center align-center'>
                                {userData?.image && (
                                    <Image src={userData.image} height={120} width={128} alt={userData?.name} className='rounded-full m-4' />
                                )}
                                <div className='space-y-2 align-center text-center'>
                                    <p className="text-lg font-semibold break-words">Name: {userData?.name}</p>
                                    <p className="text-md text-gray-600 break-words">Mail: {userData?.email}</p>
                                    <p className="text-md text-gray-600">Plan: {userData?.subscription}</p>
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
                                <Link href={'/profile/edit'} className='bg-green-700 px-4 py-2 text-white rounded-md font-semibold w-full sm:w-auto text-center' >
                                    Update Profile
                                </Link>
                                <SignOut />
                            </div>
                        </div>
                        <div className="border border-black shadow-xl bg-gray-200/60 rounded-lg w-full lg:w-2/3 my-10 p-6">
                            <div className="flex flex-col items-center p-8 rounded-lg text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">Mood Tracker</h1>
                                <div>
                                    <p className="text-lg text-gray-600 mb-6 leading-none">Mood over the 7 days</p>
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
                                <div className="w-full flex">

                                    <PieChart
                                        series={[
                                            {
                                                data: selectedData,
                                            },
                                        ]}
                                        width={800}
                                        height={200}
                                        className="w-full sm:max-w-lg lg:max-w-4xl"
                                    />


                                </div>

                                {totalValue > 0 ? <BetterMood /> : <BadMood />}
                            </div>
                        </div>
                    </div>
                    <ProfileEntries session={session} journalEntries={journalEntries} />
                </>
            ) : (
                <ErrorPage />
            )}
        </>

    );
}
