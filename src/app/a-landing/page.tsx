import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Brain,
    BriefcaseBusiness,
    Camera,
    Check,
    Compass,
    FileText,
    HeartHandshake,
    Heart,
    KeyRound,
    Leaf,
    LockKeyhole,
    PencilLine,
    Server,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
    ListTodo,
    MessageCircleHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const supportModes = ["Just listen", "Help me reflect", "Help me reframe", "Find a pattern", "Give me a small step", "I need support"];

const growthSteps = [
    {
        icon: PencilLine,
        title: "Write on your terms",
        description: "Choose how Echo responds and whether an entry may inform future patterns. “Just listen” bypasses AI analysis.",
    },
    {
        icon: Brain,
        title: "Review tentative patterns",
        description: "Build an evolving reflection profile that you can confirm, correct, or dismiss at any time.",
    },
    {
        icon: FileText,
        title: "Understand your season",
        description: "Generate weekly or monthly reports with links back to the entries behind each important conclusion.",
    },
    {
        icon: Leaf,
        title: "Try one gentle change",
        description: "Turn a suggestion into a small experiment, check in without pressure, and learn what actually helped.",
    },
];

const privacyPoints = [
    { icon: LockKeyhole, title: "Encrypted at rest", text: "Journal content and generated growth artifacts are encrypted before being stored in the database." },
    { icon: KeyRound, title: "Entry-level consent", text: "You choose which entries may contribute to your profile, constellation, and reports." },
    { icon: Server, title: "Self-hostable", text: "Run Echo, MongoDB, scheduled jobs, and the HTTPS edge on infrastructure you control." },
    { icon: ShieldCheck, title: "Reflection, not diagnosis", text: "Echo frames patterns as hypotheses, avoids clinical claims, and keeps human support in the picture." },
];

const productFeatures = [
    {
        image: "/assets/entry.png",
        icon: Camera,
        title: "A journal that meets you where you are",
        description: "Write freely, scan handwritten pages, use a prompt when you feel stuck, or attach a meaningful image.",
        imageAlt: "Echo journal entry interface with scanning, prompts, and image attachment tools",
    },
    {
        image: "/assets/Analytics.png",
        icon: Brain,
        title: "Mood history you can actually revisit",
        description: "See mood distribution and movement over time, then connect those changes with the memories behind them.",
        imageAlt: "Echo mood tracker showing mood distribution and a seven-day trend",
    },
    {
        image: "/assets/chat.png",
        icon: MessageCircleHeart,
        title: "Reflection when writing alone is not enough",
        description: "Continue a thought in Echo Chat while keeping clear boundaries around what AI can and cannot replace.",
        imageAlt: "Echo chat interface showing a reflective conversation",
    },
];

const useCases = [
    { icon: Users, title: "For students", text: "Untangle academic pressure, capture study commitments, and understand what helps during demanding weeks." },
    { icon: BriefcaseBusiness, title: "For professionals", text: "Reflect on work patterns, protect energy, and keep sight of goals beyond the next deadline." },
    { icon: Heart, title: "For everyday wellbeing", text: "Make space for emotions, notice what restores you, and preserve moments you do not want to lose." },
];

const testimonials = [
    { name: "Shihab", role: "Daily user", quote: "It's fun journaling and chatting with Echo. Very well done!", avatar: "/assets/shihab.png" },
    { name: "Arafath", role: "Student", quote: "The AI insights are so helpful and spot on.", avatar: "/assets/arafath.png" },
    { name: "Evak Chan", role: "Product Hunt feedback", quote: "The feature of tracking mood is fantastic. Through long-term use, users can clearly see the trajectory of their emotional development.", avatar: "https://ph-avatars.imgix.net/7875988/8f14992b-b3b1-4b30-83ca-f683b37d0e8d.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1" },
    { name: "Md Mobashir Hasan", role: "Product Hunt feedback", quote: "Echo feels warm, thoughtful, and real. The mood-based journaling and focus on privacy are amazing.", avatar: "https://ph-avatars.imgix.net/5085015/cfa4d47f-0001-4181-a126-440f48e1368c.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1" },
];

const faqs = [
    {
        question: "Does Echo analyze every journal entry?",
        answer: "No. You choose a response mode for each entry. Selecting “Just listen” saves it without sending it to the configured AI provider and excludes it from future profile and report generation.",
    },
    {
        question: "Can I correct what Echo thinks about me?",
        answer: "Yes. Profile observations are proposals, not permanent labels. You can confirm, rewrite, or dismiss every observation, and refreshed profiles preserve those decisions when the same observation returns.",
    },
    {
        question: "What is the Memory Constellation?",
        answer: "It is a visual map of recurring themes—such as goals, habits, emotions, people, and places—and the tentative relationships between them. It is built only from entries you permit Echo to use.",
    },
    {
        question: "Are the reports medical advice?",
        answer: "No. Reports are personal reflection tools, not diagnosis or treatment. They summarize changes, possible patterns, helpful factors, areas to watch, and optional small experiments.",
    },
    {
        question: "Can I run Echo myself?",
        answer: "Yes. The repository includes a Docker Compose deployment with Caddy, the Next.js application, an authenticated scheduler, and a private MongoDB instance. AI, email, and push providers can be configured separately.",
    },
];

function ProductPreview() {
    return (
        <div className="lg:-translate-y-8" aria-label="Echo application on mobile screens">
            <div className="mb-2 ml-auto w-fit max-w-sm rounded-xl border border-indigo-100 bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-xs font-semibold text-indigo-700 sm:text-sm">Now connected to support modes, Memory Constellation, and growth reports</p>
            </div>
            <Image
                src="/assets/image.png"
                alt="Echo mobile journal, mood tracker, and personal dashboard"
                width={1440}
                height={736}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-auto w-full object-contain"
                priority
            />
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="overflow-hidden bg-white text-slate-950">
            <section className="border-b border-slate-200 bg-slate-50">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                            <Sparkles className="size-4" /> A journal that remembers with you
                        </div>
                        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Understand your patterns without being defined by them.
                        </h1>
                        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600">
                            Echo is a private AI-assisted journal that helps you reflect in the way you need, connect memories over time, and discover small changes that genuinely work for you.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg" className="bg-none bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-sm">
                                <Link href="/register">Start your private journal <ArrowRight className="ml-2 size-4" /></Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/login">I already have an account</Link>
                            </Button>
                        </div>
                        <ul className="mt-8 hidden gap-3 text-sm text-slate-600 sm:grid sm:grid-cols-2">
                            <li className="flex items-center gap-2"><Check className="size-4 text-indigo-600" /> No permanent personality labels</li>
                            <li className="flex items-center gap-2"><Check className="size-4 text-indigo-600" /> Entry-level AI permission</li>
                            <li className="flex items-center gap-2"><Check className="size-4 text-indigo-600" /> Evidence-linked reports</li>
                            <li className="flex items-center gap-2"><Check className="size-4 text-indigo-600" /> Self-hosting available</li>
                        </ul>
                    </div>
                    <ProductPreview />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" aria-labelledby="support-heading">
                <div className="mx-auto grid max-w-4xl items-center gap-6 sm:grid-cols-[auto_1fr]">
                    <Image src="/assets/loved-echo.png" alt="Echo smiling" width={112} height={112} className="mx-auto size-24 object-contain sm:size-28" />
                    <div className="text-center sm:text-left">
                        <p className="text-sm font-semibold text-indigo-700">You choose the relationship</p>
                        <h2 id="support-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Sometimes you want perspective. Sometimes you only want to be heard.</h2>
                        <p className="mt-4 text-pretty text-slate-600">Every entry begins with a clear support mode, so Echo does not assume that advice is always welcome.</p>
                    </div>
                </div>
                <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
                    {supportModes.map((mode, index) => (
                        <span key={mode} className={index === 0 ? "rounded-lg border border-indigo-600 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800" : "rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"}>{mode}</span>
                    ))}
                </div>
                <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                    <div className="flex gap-3"><HeartHandshake className="mt-0.5 size-5 shrink-0 text-indigo-700" /><p className="text-pretty text-sm text-indigo-950"><strong>Just listen means just listen.</strong> The entry is saved without AI analysis and cannot be used in your reflection profile, constellation, or reports.</p></div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-slate-50" aria-labelledby="product-heading">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-semibold text-indigo-700">The real Echo experience</p>
                        <h2 id="product-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">The journal, mood history, and conversation tools are still here.</h2>
                        <p className="mt-4 text-pretty text-slate-600">The new growth system connects the product people already use instead of replacing it with another abstract AI dashboard.</p>
                    </div>
                    <div className="mt-12 grid gap-6 lg:grid-cols-3">
                        {productFeatures.map(feature => (
                            <article key={feature.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="aspect-[4/3] overflow-hidden border-b border-slate-200 bg-slate-100">
                                    <Image src={feature.image} alt={feature.imageAlt} width={900} height={675} sizes="(min-width: 1024px) 33vw, 100vw" className="size-full object-cover object-top" />
                                </div>
                                <div className="p-6">
                                    <feature.icon className="size-6 text-indigo-600" />
                                    <h3 className="mt-4 text-balance text-lg font-semibold text-slate-950">{feature.title}</h3>
                                    <p className="mt-2 text-pretty text-sm leading-6 text-slate-600">{feature.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-700">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2"><ListTodo className="size-4 text-indigo-600" /> Todo extraction</span>
                        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2"><Camera className="size-4 text-indigo-600" /> Handwriting scan</span>
                        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2"><HeartHandshake className="size-4 text-indigo-600" /> Guided reflection</span>
                    </div>
                </div>
            </section>

            <section aria-labelledby="loop-heading">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold text-indigo-700">The Echo growth loop</p>
                        <h2 id="loop-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Reflection that leads somewhere useful.</h2>
                        <p className="mt-4 text-pretty text-slate-600">No feed to maintain and no shame when you miss a day—just a gradual cycle of writing, understanding, trying, and learning.</p>
                    </div>
                    <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {growthSteps.map((step, index) => (
                            <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between"><step.icon className="size-6 text-indigo-600" /><span className="text-sm font-semibold tabular-nums text-slate-400">0{index + 1}</span></div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-950">{step.title}</h3>
                                <p className="mt-2 text-pretty text-sm leading-6 text-slate-600">{step.description}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-16 grid gap-4 md:grid-cols-3">
                        {useCases.map(useCase => (
                            <div key={useCase.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                                <useCase.icon className="size-6 text-indigo-600" />
                                <h3 className="mt-4 font-semibold text-slate-950">{useCase.title}</h3>
                                <p className="mt-2 text-pretty text-sm leading-6 text-slate-600">{useCase.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8" aria-labelledby="constellation-heading">
                <div className="order-2 lg:order-1">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-lg" aria-label="Illustration of connected memory themes">
                        <svg className="absolute inset-0 size-full" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
                            <line x1="50" y1="14" x2="20" y2="33" stroke="#818cf8" strokeWidth="0.55" />
                            <line x1="50" y1="14" x2="79" y2="30" stroke="#475569" strokeWidth="0.45" />
                            <line x1="20" y1="33" x2="39" y2="60" stroke="#818cf8" strokeWidth="0.65" />
                            <line x1="79" y1="30" x2="65" y2="59" stroke="#475569" strokeWidth="0.45" />
                            <line x1="39" y1="60" x2="65" y2="59" stroke="#818cf8" strokeWidth="0.55" />
                        </svg>
                        <span className="absolute left-1/2 top-[12%] -translate-x-1/2 rounded-full border border-indigo-300 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">Creative confidence</span>
                        <span className="absolute left-[9%] top-[40%] rounded-full border border-slate-500 bg-slate-800 px-4 py-3 text-sm font-semibold text-white">Morning ritual</span>
                        <span className="absolute right-[8%] top-[36%] rounded-full border border-slate-500 bg-slate-800 px-4 py-3 text-sm font-semibold text-white">Work pressure</span>
                        <span className="absolute bottom-[12%] left-[25%] rounded-full border border-slate-500 bg-slate-800 px-4 py-3 text-sm font-semibold text-white">Walking</span>
                        <span className="absolute bottom-[13%] right-[20%] rounded-full border border-slate-500 bg-slate-800 px-4 py-3 text-sm font-semibold text-white">Calm</span>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <p className="flex items-center gap-2 text-sm font-semibold text-indigo-700"><Compass className="size-4" /> Memory Constellation</p>
                    <h2 id="constellation-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">See the themes shaping this chapter of your life.</h2>
                    <p className="mt-5 text-pretty leading-7 text-slate-600">Your constellation connects recurring emotions, habits, goals, people, places, and themes. Select a node to understand why Echo connected it—and return to the supporting entries yourself.</p>
                    <ul className="mt-6 space-y-3 text-sm text-slate-700">
                        <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-indigo-600" /> Built only from entries you permit</li>
                        <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-indigo-600" /> Connections are presented as tentative</li>
                        <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-indigo-600" /> Your corrections shape future context</li>
                    </ul>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-slate-50" aria-labelledby="reports-heading">
                <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
                    <div>
                        <p className="text-sm font-semibold text-indigo-700">AI reflection reports</p>
                        <h2 id="reports-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Suggestions grounded in your own story.</h2>
                        <p className="mt-5 text-pretty leading-7 text-slate-600">Reports separate observations from interpretation and show the entries behind key conclusions. Suggestions become optional, measurable experiments—not instructions.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5"><div><p className="text-xs font-semibold uppercase text-indigo-700">Monthly reflection</p><h3 className="mt-1 text-balance text-xl font-semibold">A month of protecting your energy</h3></div><FileText className="size-7 text-indigo-600" /></div>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div><p className="font-semibold text-slate-900">What seemed helpful</p><p className="mt-2 text-pretty text-sm leading-6 text-slate-600">Short walks and quieter mornings appeared alongside calmer entries.</p><span className="mt-2 inline-block text-xs font-medium text-indigo-700 underline underline-offset-2">View 3 supporting entries</span></div>
                            <div><p className="font-semibold text-slate-900">What to preserve</p><p className="mt-2 text-pretty text-sm leading-6 text-slate-600">You kept returning to creative work even during demanding weeks.</p><span className="mt-2 inline-block text-xs font-medium text-indigo-700 underline underline-offset-2">View 2 supporting entries</span></div>
                        </div>
                        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5"><p className="text-xs font-semibold uppercase text-indigo-700">Optional 7-day experiment</p><p className="mt-2 font-semibold text-slate-900">Protect ten quiet minutes before work</p><p className="mt-1 text-pretty text-sm text-slate-600">Try it on three mornings, then record whether it helped. Missing a day does not reset anything.</p></div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" aria-labelledby="voices-heading">
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold text-indigo-700">Early voices</p>
                        <h2 id="voices-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">What people said after trying Echo.</h2>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600" aria-label="Five-star feedback">
                        {[0, 1, 2, 3, 4].map(star => <Star key={star} className="size-5 fill-current" />)}
                    </div>
                </div>
                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {testimonials.map(testimonial => (
                        <figure key={testimonial.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <blockquote className="text-pretty leading-7 text-slate-700">“{testimonial.quote}”</blockquote>
                            <figcaption className="mt-6 flex items-center gap-3">
                                <Image src={testimonial.avatar} alt="" width={48} height={48} sizes="48px" className="size-12 rounded-full object-cover" unoptimized={testimonial.avatar.startsWith("http")} />
                                <div><p className="font-semibold text-slate-950">{testimonial.name}</p><p className="text-sm text-slate-500">{testimonial.role}</p></div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className="border-y border-slate-200 bg-slate-50" aria-labelledby="privacy-heading">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold text-indigo-700">Privacy with honest boundaries</p>
                    <h2 id="privacy-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Your journal should not require blind trust.</h2>
                    <p className="mt-4 text-pretty text-slate-600">Echo gives you visible controls over AI participation and can run on your own infrastructure.</p>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {privacyPoints.map(point => (
                        <div key={point.title} className="rounded-xl border border-slate-200 p-6">
                            <point.icon className="size-6 text-indigo-600" />
                            <h3 className="mt-5 font-semibold text-slate-950">{point.title}</h3>
                            <p className="mt-2 text-pretty text-sm leading-6 text-slate-600">{point.text}</p>
                        </div>
                    ))}
                </div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-slate-50" aria-labelledby="faq-heading">
                <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
                    <h2 id="faq-heading" className="text-balance text-center text-3xl font-bold sm:text-4xl">Questions worth asking</h2>
                    <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
                        {faqs.map(faq => (
                            <details key={faq.question} className="group py-5">
                                <summary className="cursor-pointer text-pretty font-semibold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4">{faq.question}</summary>
                                <p className="mt-3 max-w-3xl text-pretty text-sm leading-6 text-slate-600">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-950">
                <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
                    <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">Build a relationship with your journal—not with an algorithm.</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-300">Start with one honest entry. Decide how Echo should respond. Everything else can grow at your pace.</p>
                    <Button asChild size="lg" className="mt-8 bg-none bg-indigo-500 shadow-sm hover:bg-indigo-400 hover:shadow-sm">
                        <Link href="/register">Begin journaling <ArrowRight className="ml-2 size-4" /></Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
