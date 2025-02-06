import { ScanText } from "lucide-react"
export default function ScanComponent() {
    return (
        <div className="flex flex-col items-center justify-center relative mt-5">

            <button className="p-3 bg-white/80 rounded-full shadow hover:bg-white transition">
                <ScanText className="w-6 h-6 text-gray-700" />
            </button>
            <p> Scan Handwritten Journal!</p>
        </div>
    )
}
