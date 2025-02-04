import Image from "next/image";
import Link from "next/link";

export default function BetterMood() {
    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-blue-50 rounded-lg p-6 shadow-md w-full max-w-3xl">
                <Image src='/assets/loved-echo.png' alt="Echo" width={96} height={96} className="object-contain mb-4 md:mb-0" />
                <p className="text-black text-center text-lg leading-relaxed">
                    <span className="font-semibold text-blue-600">Echo says:</span> It seems:- { }
                    <strong>Your positivity is radiating!</strong> Keep sharing your good vibes with the world.
                    Remember, you’re unstoppable!
                    <br />

                </p>
            </div>
        </div>
    )
}
