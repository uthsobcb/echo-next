'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function BadgeModal({ allBadges = [], earnedBadges = [] }) {
    const [selectedBadge, setSelectedBadge] = useState(null);
    const earnedNames = new Set((earnedBadges || []).map(b => b.name));

    const closeModal = () => setSelectedBadge(null);

    const shareUrl =
        typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
    const shareText = selectedBadge
        ? encodeURIComponent(`I just earned the "${selectedBadge.name}" badge!`)
        : '';

    return (
        <>
            {allBadges.map((badge) => {
                const earned = earnedNames.has(badge.name);
                return (
                    <div
                        key={badge.id}
                        onClick={earned ? () => setSelectedBadge(badge) : undefined}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${earned
                            ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                            : 'bg-gray-100 opacity-60'
                            }`}
                    >
                        <Image
                            src={badge.img}
                            alt={`${badge.name} Badge`}
                            width={60}
                            height={60}
                            className={`rounded-full shadow-sm transition-all duration-200 ${earned ? '' : 'grayscale opacity-60'
                                }`}
                        />

                        <p className="text-sm font-medium text-gray-700 mt-2 text-center">{badge.name}</p>
                    </div>
                );
            })}

            {selectedBadge && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedBadge.img}
                                alt={selectedBadge.name}
                                className="w-20 h-20 rounded-full mb-4"
                            />
                            <h3 className="text-lg font-semibold mb-2">{selectedBadge.name}</h3>
                            <p className="text-sm text-gray-600 mb-4 text-center">
                                You've earned this badge! Share it:
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-blue-500 text-white px-3 py-2 rounded"
                                >
                                    Twitter
                                </a>
                                <a
                                    href={`https://www.reddit.com/submit?title=${shareText}&url=${shareUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-orange-500 text-white px-3 py-2 rounded"
                                >
                                    Reddit
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-blue-700 text-white px-3 py-2 rounded"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
