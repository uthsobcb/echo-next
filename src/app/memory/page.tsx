import { auth } from "@/app/lib/auth";
import ProfileEntries from '../profile/Components/ProfileEntries'
import axios from "axios";
import { BookOpenCheck, CalendarDays, Quote } from "lucide-react";
export default async function page() {
    const session = await auth();
    const user = session?.user || null;
    let journalEntries = [];
    if (session) {

        try {
            const response = await axios.get(`${process.env.BASEURL}/api/entries`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            journalEntries = response.data;
        } catch (error: any) {

            console.log("Error fetching entries:", error.response?.data || error.message);
        }
    }
    const today = new Date().toLocaleDateString();
    return (
        <div className="mt-16 px-6">
            <div className="max-w-5xl px-4 sm:px-6 md:px-8 items-center mx-auto">
                <div className="bg-white/90 rounded-3xl shadow-md border border-gray-200 p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <BookOpenCheck className="w-8 h-8 text-yellow-600" />
                            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                Revisit Your Memories
                            </h1>
                        </div>

                        <p className="text-gray-600 text-base mb-3">
                            A quiet space to look back, reflect, and notice how far you've come.
                        </p>

                        <div className="w-16 h-1 bg-indigo-400 rounded-full mt-2" />
                    </div>

                    <div className="flex flex-col justify-start gap-6">
                        <div className="flex items-center gap-3">
                            <CalendarDays className="w-5 h-5 text-gray-400" />
                            <span className="text-xl font-semibold text-yellow-600">
                                Today: {today}
                            </span>
                        </div>

                        <div className="flex items-start gap-2 border-l-4 border-indigo-300 pl-4 text-sm text-gray-600 italic">
                            <Quote className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <p>
                                "Sometimes you will never know the value of a moment until it becomes a memory." <br />
                                <span className="text-gray-500 text-xs mt-1 block">– Dr. Seuss</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-300 pt-6 mt-4">
                <ProfileEntries session={session} journalEntries={journalEntries} />
            </div>
        </div >
    )
}
