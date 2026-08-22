'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { LockKeyhole, Orbit, Sparkles } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type PhoneMockupProps = {
    src: string;
    alt: string;
    position: string;
    imagePosition?: string;
    priority?: boolean;
};

function PhoneMockup({ src, alt, position, imagePosition = 'object-center', priority = false }: PhoneMockupProps) {
    return (
        <div className={cn('absolute aspect-[9/18.5] rounded-3xl border-2 border-slate-900 bg-slate-900 p-1 shadow-lg sm:border-4', position)}>
            <span className="absolute left-1/2 top-2 z-10 h-1.5 w-9 -translate-x-1/2 rounded-full bg-slate-900 sm:w-10" aria-hidden="true" />
            <div className="relative size-full overflow-hidden rounded-2xl bg-white">
                <Image src={src} alt={alt} fill sizes="(min-width: 640px) 220px, 150px" className={cn('object-cover', imagePosition)} priority={priority} />
            </div>
        </div>
    );
}

export default function ProductPreview() {
    const previewRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(previewRef, { margin: '120px 0px', amount: 0.25 });
    const reduceMotion = useReducedMotion();
    const shouldFloat = isInView && !reduceMotion;

    return (
        <div
            ref={previewRef}
            className="relative isolate mx-auto min-h-[28rem] w-full max-w-3xl overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50 sm:min-h-[34rem] lg:min-h-[32rem]"
            aria-label="Echo shown across three mobile screens"
        >
            <span className="absolute left-6 top-28 size-4 rounded-full bg-amber-300 sm:left-10 sm:top-32" aria-hidden="true" />
            <span className="absolute bottom-16 right-8 size-3 rounded-full bg-indigo-300 sm:right-14" aria-hidden="true" />

            <PhoneMockup
                src="/assets/ui-reflection-phone-v3.png"
                alt="Current Echo reflection displayed on a phone"
                position="bottom-20 left-[10%] w-[32%] -rotate-12 sm:bottom-16 sm:left-[12%] sm:w-[29%]"
            />
            <PhoneMockup
                src="/assets/ui-growth-phone-v3.png"
                alt="Current Echo Memory Constellation displayed on a phone"
                position="bottom-20 right-[10%] w-[32%] rotate-12 sm:bottom-16 sm:right-[12%] sm:w-[29%]"
            />
            <PhoneMockup
                src="/assets/ui-entry-v2.png"
                alt="Current Echo journal privacy choice displayed on a phone"
                imagePosition="object-top"
                position="bottom-14 left-1/2 z-10 w-[38%] -translate-x-1/2 sm:bottom-10 sm:w-[33%]"
                priority
            />

            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: shouldFloat ? [0, -6, 0] : 0 }}
                transition={shouldFloat ? { opacity: { duration: 0.2, ease: 'easeOut' }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } } : { duration: 0.2, ease: 'easeOut' }}
                className="absolute bottom-8 left-3 z-20 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-md sm:bottom-12 sm:left-5 sm:gap-3 sm:px-4 sm:py-3"
            >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><LockKeyhole className="size-5" aria-hidden="true" /></span>
                <span><span className="block text-xs text-slate-500">Private save</span><span className="block text-sm font-semibold text-slate-950">No AI</span></span>
            </motion.div>

            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: shouldFloat ? [0, 6, 0] : 0 }}
                transition={shouldFloat ? { opacity: { duration: 0.2, ease: 'easeOut' }, y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } } : { duration: 0.2, ease: 'easeOut' }}
                className="absolute right-3 top-20 z-20 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-md sm:right-5 sm:top-24 sm:gap-3 sm:px-4 sm:py-3"
            >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><Sparkles className="size-5" aria-hidden="true" /></span>
                <span className="block"><span className="block text-xs text-slate-500">Memory map</span><span className="block text-sm font-semibold tabular-nums text-slate-950">5 themes</span></span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white"><Orbit className="size-5" aria-hidden="true" /></span>
            </motion.div>
        </div>
    );
}
