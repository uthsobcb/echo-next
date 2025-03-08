import Image from "next/image";

export default function BetterMood() {
    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center bg-blue-50 rounded-xl p-4 md:p-6 shadow-md w-full max-w-xl mx-auto">
                <Image
                    src='/assets/loved-echo.png'
                    alt="Echo"
                    width={96}
                    height={96}
                    className="object-contain w-20 md:w-24 h-20 md:h-24"
                />
                <p className="text-black text-center md:text-left text-base md:text-lg leading-relaxed">
                    <span className="font-semibold text-blue-600">Echo says:</span> It seems:- { }
                    <strong>Your positivity is radiating!</strong> Keep sharing your good vibes with the world.
                    Remember, you're unstoppable!
                </p>
            </div>
        </div>
    )
}
