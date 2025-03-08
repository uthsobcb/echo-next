import Image from "next/image";
import Link from "next/link";

export default function BadMood() {
    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center bg-blue-50 rounded-xl p-4 md:p-6 shadow-md w-full max-w-xl mx-auto">
                <Image
                    src='/assets/frustated-echo.png'
                    alt="Echo"
                    width={96}
                    height={96}
                    className="object-contain w-20 md:w-24 h-20 md:h-24"
                />
                <div className="text-black text-center md:text-left text-base md:text-lg leading-relaxed">
                    <span className="font-semibold text-blue-600">Echo says:</span> It seems:- { }
                    <strong>Your mood is a bit cloudy.</strong> That's okay—every storm runs out of rain.
                    Lean on your support system, and remember better days are ahead.

                    <Link href="/chat">
                        <button className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                            Talk to Echo About It?
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
