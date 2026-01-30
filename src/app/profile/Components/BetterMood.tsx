import Image from "next/image";

export default function BetterMood() {
    return (
        <div className="mt-10 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center bg-blue-50 rounded-xl p-5 md:p-6 shadow-md w-full max-w-3xl mx-auto">
                <div className="flex-shrink-0">
                    <Image
                        src="/assets/loved-echo.png"
                        alt="Echo"
                        width={96}
                        height={96}
                        className="object-contain w-20 md:w-24 h-20 md:h-24"
                        priority
                    />
                </div>
                <div className="text-center md:text-left max-w-lg">
                    <p className="text-base md:text-lg leading-relaxed text-gray-800">
                        <span className="font-semibold text-blue-600">Echo says:</span> It seems:{" "}
                        <strong className="text-blue-800">Your positivity is radiating!</strong> Keep sharing your good vibes with
                        the world. Remember, you're unstoppable!
                    </p>
                </div>
            </div>
        </div>
    );
}
