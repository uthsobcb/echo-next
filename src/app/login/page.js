'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { login } from '../action';
import { useRouter } from "next/navigation";

export default function Login() {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(e) {

        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);

            const response = await login(formData);

            if (!!response.error) {
                console.log(response.error);
            } else {
                router.push("/entry");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit} className="p-12">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Login
                            </p>
                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                    placeholder="pico@mail.com"
                                    type="email"
                                    id='email'
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                    placeholder="••••••••"
                                    type="password"
                                    id='password'
                                    required
                                />
                            </div>
                            <div className="flex items-start">
                                <div className="ml-3 text-sm">
                                    <label className="font-light text-gray-500">
                                        <Link
                                            href="/forgot-password"
                                            className="font-medium text-primary-600 hover:underline text-primary-500"
                                        >
                                            Forgot Password
                                        </Link>
                                        ?
                                    </label>
                                </div>
                            </div>

                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-800 text-white"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login!'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
