import axios from "axios";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default async function EditEntryPage({ params }) {
    const session = await auth();
    if (!session) {
        return <p className="text-red-500">Unauthorized - Please log in</p>;
    }

    let entry;
    try {
        const response = await axios.get(`${process.env.BASEURL}/api/entries/${params.id}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            withCredentials: true,
        });
        entry = response.data;
    } catch (error) {
        return <p className="text-red-500">Error fetching entry.</p>;
        toast.error("Error fetching entry.");
    }
    const formattedDate = entry.createdAt
        ? format(new Date(entry.createdAt), "EEE, MMM d, yyyy")
        : "Unknown Date";
    const formattedTime = entry.createdAt
        ? format(new Date(entry.createdAt), "EEE, h:mm a")
        : "Unknown Date";

    async function updateEntry(formData) {
        "use server";
        const id = formData.get("id")?.toString();
        const content = formData.get("content")?.toString();
        if (!id || !content) {
            throw new Error("Missing id or content");
        }
        await axios.patch(
            `${process.env.BASEURL}/api/entries/${id}`,
            { content },
            {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            }
        );
        redirect(`/entry/${id}`);
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 px-4 py-6">
            <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Edit Entry from: {formattedDate || "Unknown Date"}
                </h2>
                <h3 className="text-gray-700">
                    <span className="text-gray-500">at</span> {formattedTime || "Unknown Time"}
                </h3>
                <p className="text-md mt-1">🌟 Mood: {entry.mood}</p>

                {/* <p className="text-gray-900 font-handwriting lg:text-6xl text-3xl leading-snug">{entry.content}</p> */}
            </div>

            <div className="w-11/12 max-w-5xl bg-[#F5DEB3] border rounded-md p-8">
                <form
                    action={updateEntry}
                    className="px-8 pt-6 pb-8 w-full"
                >
                    <input type="hidden" name="id" value={entry._id} />
                    <div className="mb-4">
                        <label
                            htmlFor="content"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            You can edit your entry content only from below:
                        </label>
                        <textarea
                            className="w-full border-none bg-transparent text-gray-900 placeholder-gray-400 font-handwriting lg:text-6xl text-4xl  overflow-auto focus:outline-none cursor-text" id="content"
                            name="content"
                            defaultValue={entry.content}
                            rows={5}
                            placeholder="Edit your entry content..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
