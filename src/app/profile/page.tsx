import Link from 'next/link';
import Image from 'next/image';
import { auth } from "@/app/lib/auth";
import axios from 'axios';
import ProfileEntries from './Components/ProfileEntries';
import BetterMood from './Components/BetterMood';
import BadMood from './Components/BadMood';
import ErrorPage from '../components/ErrorPage';
import MoodChart from './Components/MoodChart';
import StreakCard from './Components/StreakCard';
import { LogOut } from 'lucide-react'

import type { User as UserInterface } from "@/types/ProfileTypes";

const badges = [
    { id: 1, name: "Echo Sunshine", img: "/assets/Echos-Sun.png" },
    { id: 2, name: "Pen Whisperer", img: "/assets/badge_1.png" },
    { id: 3, name: "Mindful Scribe", img: "/assets/badge_2.png" },
    { id: 4, name: "Thought Architect", img: "/assets/badge_3.png" },
    { id: 5, name: "Guardian of Inked Wisdom", img: "/assets/badge_4.png" }
];
import BadgeModal from './Components/BadgeModal.client';
import SignOutButton from './Components/SignOutButton';

interface MoodData {
    mood: string;
    score: number;
}

interface UserData {
    image?: string;
    name?: string;
    email?: string;
    subscription?: string;
    badge?: string[];
    currentStreak?: number;
    maxStreak?: number;
    totalXp?: number;
}

export default async function User() {
    const session = await auth();
    const user = session?.user || null;
    let moodData: MoodData[] = [];
    let journalEntries: any[] = [];
    let userData: UserData = {};

    if (session) {
        try {
            const moodtracker = await axios.get(`${process.env.BASEURL}/api/mood-tracker`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            moodData = moodtracker.data;

        } catch (error: any) {
            console.error("Error fetching mood data:", error.response?.data || error.message);
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/entries`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            journalEntries = response.data;
        } catch (error: any) {

            console.log("Error fetching entries:", error.response?.data || error.message);
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/profile`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            userData = response.data.user;
        } catch (error: any) {
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

    const entryCount = journalEntries.length;

    const valuesArray = pieChartData.map(({ value }) => value || 0);
    const totalValue = valuesArray.reduce((sum, value) => sum + value, 0);
    // console.log(valuesArray, "and", totalValue);


    const userBadges = badges.filter((badge) => userData?.badge?.includes(badge.name));

    return (
        <div>
            {session ? (
                <>
                    <div className='container mx-auto flex flex-col lg:flex-row max-w-7xl px-4 sm:px-6 lg:px-8 my-16 gap-8'>
                        <div className="bg-white shadow-2xl rounded-2xl w-full lg:w-1/3 overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                                <div className='flex flex-col items-center'>
                                    {userData?.image && (
                                        <div className="relative">
                                            <Image
                                                src={userData.image || "/assets/logo.png"}
                                                height={120}
                                                width={120}
                                                alt={userData.name || "User Profile"}
                                                className='rounded-full border-4 border-white shadow-lg object-cover'
                                            />
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                {userData?.subscription || 'Free'}
                                            </div>
                                        </div>
                                    )}
                                    <h2 className="mt-4 text-2xl font-bold text-white">{userData?.name}</h2>
                                    <p className="text-blue-100">{userData?.email}</p>
                                </div>
                            </div>

                            {/* Profile Stats */}
                            <div className="px-6 py-4">
                                <div className="flex justify-center items-center gap-8 py-4 border-b">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{userBadges.length}</p>
                                        <p className="text-sm text-gray-600">Badges</p>
                                    </div>

                                </div>

                                {/* Badges Section */}
                                <div className="py-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" />
                                        </svg>
                                        Achievements
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {userBadges.length > 0 ? (
                                            <BadgeModal allBadges={badges} earnedBadges={userBadges} />

                                            /* {userBadges.length > 0 ? (
                                                userBadges.map((badge) => (
                                                    <div key={badge.id} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <Image
                                                            src={badge.img}
                                                            alt={`${badge.name} Badge`}
                                                            width={60}
                                                            height={60}
                                                            className="rounded-full shadow-sm"
                                                        />
                                                        <p className="text-sm font-medium text-gray-700 mt-2 text-center">{badge.name}</p>
                                                    </div>
    
                                                )) */
                                        ) : (
                                            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                                                <p className="text-gray-500 text-sm">No badges earned yet.</p>
                                                <p className="text-gray-400 text-xs mt-1">Keep writing to earn badges!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                                    <Link
                                        href={'/profile/edit'}
                                        className='flex items-center justify-center gap-2 bg-blue-600 px-4 py-2.5 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-1 text-center'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit Profile
                                    </Link>
                                    <SignOutButton />
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-2/3 my-10 space-y-8">
                            {/* Streak Card */}
                            <StreakCard
                                entries={journalEntries}
                                currentStreak={userData.currentStreak || 0}
                                maxStreak={userData.maxStreak || 0}
                                totalXp={userData.totalXp || 0}
                            />

                            {/* Mood Tracker */}
                            <div className="border border-gray-300/40 shadow-xl bg-gray-200/60 rounded-3xl p-6">
                                <div className="flex flex-col items-center p-8 rounded-lg text-center">
                                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Mood Tracker</h1>
                                    <div>
                                        <p className="text-lg text-gray-600 mb-6 leading-none">Mood over the 7 days</p>
                                    </div>
                                    <div className="w-full flex">
                                        <MoodChart selectedData={selectedData} />
                                    </div>
                                    {totalValue > 0 ? <BetterMood /> : <BadMood />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProfileEntries session={session} journalEntries={journalEntries} />
                </>
            ) : (
                <ErrorPage />
            )}
        </div>
    );
}
