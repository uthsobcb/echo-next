import Image from "next/image";
import Link from "next/link";
function getRandomMessage() {
    const messages = [
        "Your mood is a bit cloudy. That’s okay—every storm runs out of rain.",
        "Everyone has rough days. Be gentle with yourself and take a breath.",
        "It’s okay not to be okay. Progress isn’t linear, and you’re not alone.",
        "Today might feel heavy, but brighter moments are ahead.",
        "You’re doing your best. That’s enough. Don’t forget to rest too.",
        "That’s okay—every storm runs out of rain. Lean on your support system, and remember better days are ahead.",
        "Even on the darkest days, the sun is still shining behind the clouds.",

        "Take it one breath at a time—slow and steady is still progress.",

        "You don’t have to figure it all out today. Just take the next small step.",

        "Healing isn’t a straight line. Be proud of every effort you make.",

        "You're not falling behind—you’re finding your own pace.",

        "Rest is not a weakness. It’s part of how you grow stronger.",

        "Some days surviving is thriving—don’t discount your strength.",

        "You’ve made it through hard times before. You will again.",

        "It’s okay to pause. You’re allowed to catch your breath.",

        "You are more resilient than you feel right now.",

        "Feelings are visitors—they come and go. They don’t define you.",

        "You matter, even on the days when it’s hard to believe it.",

        "This moment doesn’t define your whole story.",
        "Courage isn’t always loud—sometimes it’s just getting out of bed.",
        "You’re not alone. Someone cares, even if it doesn’t feel like it today.",


    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

export default function BadMood() {
    const message = getRandomMessage();
    return (
        <div className="mt-10 lg:px-4">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center bg-blue-50 rounded-xl p-5 shadow-md w-full max-w-3xl mx-auto">
                <div className="flex-shrink-0">
                    <Image
                        src="/assets/frustated-echo.png"
                        alt="Echo"
                        width={96}
                        height={96}
                        className="object-contain w-20 md:w-24 h-20 md:h-24"
                        priority
                    />
                </div>
                <div className="text-center md:text-left max-w-lg text-gray-800">
                    <p className="text-base md:text-lg leading-relaxed">
                        <span className="font-semibold text-blue-600">Echo says:</span> It seems:{" "}
                        <strong className="text-blue-800">Your mood is a bit cloudy.</strong> {" "} <br />{message}
                    </p>

                    <Link href="/chat">
                        <button className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                            Talk to Echo About It?
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
