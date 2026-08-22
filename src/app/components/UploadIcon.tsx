import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from 'sonner';

export default function UploadIcon({ OnImageUpload }: { OnImageUpload: (url: string) => void }) {
    const uploadImageAction = async () => {
        try {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";

            fileInput.onchange = async () => {
                const file = fileInput.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("image", file);

                const imgbb_api_key = process.env.NEXT_PUBLIC_IMGBB_API;

                try {
                    const response = await axios.post(
                        `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    const imgUrl = response.data.data.url;

                    OnImageUpload(imgUrl);
                    // console.log("File uploaded on imgbb:", imgUrl);
                    toast.success("Image Uploaded Successfully");
                } catch (err) {
                    console.error("Error uploading image:", err);
                }
            };

            fileInput.click();
        } catch (err) {
            console.error("Error initializing upload:", err);
        }
    };

    return (
        <div className="relative flex min-w-0 flex-col items-center text-center">
            <button
                type="button"
                onClick={uploadImageAction}
                aria-label="Attach an image"
                className="flex size-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-sm transition-transform duration-200 active:scale-95 sm:size-14"
            >
                <Upload className="size-5 text-gray-700 sm:size-6" aria-hidden="true" />
            </button>
            <p className="mt-2 text-pretty text-xs font-medium leading-4 text-gray-700 sm:text-sm">Add a photo</p>
        </div>
    );
}
