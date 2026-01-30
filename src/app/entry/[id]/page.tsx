import Link from "next/link";
import { auth } from "@/app/lib/auth";
import axios from "axios";
import { format } from "date-fns";
import { toast } from 'sonner';
import DeleteButton from "@/app/components/DeleteButon";
import Image from "next/image";
export default async function EntryCard({ params }) {
    const session = await auth();
    let entry = [];
    if (!session) {
        return <p className="text-red-500">Unauthorized - Please log in</p>;
        toast.error("Unauthorized - Please log in");
    }
    try {
        const parID = await params.id;
        const response = await axios.get(`${process.env.BASEURL}/api/entries/${parID}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            withCredentials: true,
        });

        entry = response.data;

        const formattedDate = entry.createdAt
            ? format(new Date(entry.createdAt), "EEE, MMM d, yyyy")
            : "Unknown Date";
        const formattedTime = entry.createdAt
            ? format(new Date(entry.createdAt), "h:mm a")
            : "Unknown Date";

        // const handleDelete = async () => {
        //     "use server";

        //     const confirmDelete = confirm("Are you sure you want to delete this entry?");
        //     if (!confirmDelete) return;

        //     try {
        //         await axios.delete(`${process.env.NEXT_PUBLIC_BASEURL}/api/entries/${entry._id}`, {
        //             headers: { Authorization: `Bearer ${session.accessToken}` },
        //             withCredentials: true,
        //         });

        //         toast.success("Entry deleted successfully!");
        //         redirect("/"); // Redirect after deletion
        //     } catch (err) {
        //         console.error("Error deleting entry:", err);
        //         toast.error("Failed to delete entry");
        //     }
        // };


        return (
            <div className="flex flex-col items-center w-full min-h-screen px-4 py-6">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Entry from: {formattedDate || "Unknown Date"}
                    </h2>
                    <h3 className="text-gray-700">
                        <span className="text-gray-500">at</span> {formattedTime || "Unknown Time"}
                    </h3>
                    <p className="text-md mt-1">🌟 Mood: {entry.mood}</p>

                    <div className="flex justify-around mt-6">
                        <Link href={`/entry/${entry._id}/edit`}>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md font-medium">
                                Edit
                            </button>
                        </Link>
                        <DeleteButton entryId={entry._id} accessToken={session.accessToken} />
                    </div>
                </div>

                <div className="w-11/12 max-w-5xl bg-[#F5DEB3] border rounded-xl p-8">
                    {entry.imgUrl && (
                        <div className="top-10 -right-[-50px] rotate-6">
                            <Image
                                src={entry.imgUrl}
                                width={96}
                                height={96}
                                alt="Uploaded image"
                                className="shadow-lg rounded-lg"
                            />
                            <p className='text-gray-400'> Uploaded image</p>
                        </div>
                    )}
                    <p className="text-gray-900 font-handwriting lg:text-6xl text-3xl leading-snug">{entry.content}</p>
                </div>

                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md mt-4 w-9/12">
                    <p className="text-lg font-semibold">{entry.comment}</p>
                    <p className="mt-2">
                        Echo listens to you attentively and responds with empathy. It doesn’t judge, interrupt, or assume—just a space where you can share your thoughts freely.
                    </p>
                    <Link href={{ pathname: "/chat", query: { entryContent: entry.content } }}>
                        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                            Talk to Echo
                        </button>
                    </Link>
                </div>
            </div>
        );
    } catch (err) {
        console.error("Error fetching entry:", err);
        return <p className="text-red-500 justify-center flex">Error fetching entry</p>;
    }
}
