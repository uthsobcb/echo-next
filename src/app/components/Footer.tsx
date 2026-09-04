import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="relative bg-white/50 backdrop-blur-md border-t border-gray-200">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-8 lg:py-12">
                <div className="md:flex md:justify-between">
                    <div className="mb-8 md:mb-0">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/assets/logo.png"
                                alt="Echo Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <span className="self-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Echo
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed text-pretty">
                            A private journal for understanding your patterns, connecting memories, and trying gentle changes at your own pace. Open source and self-hostable.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Resources</h2>
                            <ul className="text-gray-600 font-medium space-y-3">
                                <li>
                                    <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                                </li>
                                <li>
                                    <Link href="/guide" className="hover:text-indigo-600 transition-colors">Guide</Link>
                                </li>
                                <li>
                                    <Link href="/growth" className="hover:text-indigo-600 transition-colors">Growth</Link>
                                </li>
                                <li>
                                    <Link href="/space" className="hover:text-indigo-600 transition-colors">Space</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Follow us</h2>
                            <ul className="text-gray-600 font-medium space-y-3">
                                <li>
                                    <Link href="https://github.com/uthsobcb/echo-next" target="_blank" className="hover:text-indigo-600 transition-colors">GitHub</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-indigo-600 transition-colors">Twitter / X</Link>
                                </li>
                                <li>
                                    <Link href="https://discord.gg/B2safuyRYF" target='_blank' className="hover:text-indigo-600 transition-colors">Discord</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
                            <ul className="text-gray-600 font-medium space-y-3">
                                <li>
                                    <Link href="/legal/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="/legal/tnc" className="hover:text-indigo-600 transition-colors">Terms & Use</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-gray-200 sm:mx-auto" />

                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center">
                        © {new Date().getFullYear()} <Link href="/" className="hover:underline">Echo™</Link>. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0 items-center space-x-1 text-sm text-gray-500">
                        <span>Built with ❤️ by</span>
                        <Link href="https://uthsob.dev" target="_blank" className="font-medium text-indigo-600 hover:underline">
                            Uthsob
                        </Link>
                        <span>🇧🇩</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
