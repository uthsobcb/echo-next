import { auth } from "auth";
import ProfileEntries from '../profile/Components/ProfileEntries'
import axios from "axios";
import { BookOpenCheck, CalendarDays, Quote } from "lucide-react";
export default async function page() {
    const session = await auth();
    const user = session?.user || null;
    let journalEntries = [];
    if (session) {

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/entries`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            journalEntries = response.data;
        } catch (error) {

            console.log("Error fetching entries:", error.response?.data || error.message);
        }
    }
    return (
        <div className="mt-16 px-6">


            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-8">
                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                    <BookOpenCheck className="w-8 h-8 text-yellow-600" />
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                        Revisit Your Memories
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="text-gray-600 text-base">
                    A quiet space to look back, reflect, and notice how far you've come.
                </p>

                {/* Decorative Divider */}
                <div className="w-16 h-1 bg-yellow-400 rounded-full mt-1 mb-2" />

                {/* Date with Icon */}
                <div className="flex items-center text-sm text-gray-500 gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>
                        Today is{" "}
                        <span className="font-medium text-gray-700">
                            {new Date().toLocaleDateString()}
                        </span>
                    </span>
                </div>

                {/* Optional: Quote of the Day */}
                <div className="mt-4 flex items-start gap-2 border-l-4 border-yellow-300 pl-4 text-sm text-gray-600 italic">
                    <Quote className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <p>
                        "Sometimes you will never know the value of a moment until it becomes a memory." <br />
                        <span className="text-gray-500 text-xs mt-1 block">– Dr. Seuss</span>
                    </p>
                </div>
            </div>
            <div className="border-t border-gray-300 pt-6">
                <ProfileEntries session={session} journalEntries={journalEntries} />
            </div>
        </div>
    )
}
