import { Upload } from "lucide-react"
export default function UploadIcon() {
    return (
        <div className="flex flex-col items-center justify-center relative mt-5">
            <button className="p-3 bg-white/80 rounded-full shadow hover:bg-white transition">
                <Upload className="w-6 h-6 text-gray-700" />
            </button>
            <p> Attach a image...</p>
        </div>
    )
}
