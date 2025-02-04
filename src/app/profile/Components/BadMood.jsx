import Image from "next/image";
import Link from "next/link";

export default function BadMood() {
    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-blue-50 rounded-lg p-6 shadow-md w-full max-w-3xl">
                <Image src='/assets/frustated-echo.png' alt="Echo" width={96} height={96} className="object-contain mb-4 md:mb-0" />
                <p className="text-black text-center text-lg leading-relaxed">
                    <span className="font-semibold text-blue-600">Echo says:</span> It seems:- { }
                    <strong>Your mood is a bit cloudy.</strong> That’s okay—every storm runs out of rain.
                    Lean on your support system, and remember better days are ahead.

                    <br />
                    <Link href="/chat">
                        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                            Talk to Echo About It?
                        </button>
                    </Link>
                </p>
            </div>

        </div>
    )
}
