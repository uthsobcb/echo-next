import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UploadIcon({ OnImageUpload }) {
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
        <div className="flex flex-col items-center justify-center relative mt-5">
            <button
                onClick={uploadImageAction}
                className="p-3 bg-white/80 rounded-full shadow hover:bg-white transition"
            >
                <Upload className="w-6 h-6 text-gray-700" />
            </button>
            <p>Attach an image...</p>
        </div>
    );
}
