import React from 'react';
import Link from 'next/link';
const EntryCard = () => (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 px-4 py-6">
        <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Entry from: January 2, 2024</h2>
            <p className="text-md mt-1">Mood: Sad</p>

            <div className="flex justify-around mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md font-medium">
                    Edit
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-medium">
                    Delete
                </button>
            </div>
        </div>

        <div className="w-11/12 max-w-5xl bg-[#F5DEB3] border rounded-md p-8">
            <p className="text-gray-900 font-handwriting text-5xl leading-snug">
                Rain lashes against the windowpane, mirroring the storm brewing inside me. Empty coffee cup sits cold and forgotten on the table, a monument to the hours I've spent staring out at the gray.  The world feels muted, the colors leached out, replaced by shades of gray and despair.                 That laugh, the one that used to fill this room, is gone. Replaced by an eerie silence, punctuated only by the ticking of the clock, each second a hammer blow against my already shattered heart.  Memories, like ghosts, haunt every corner of this apartment, whispering reminders of what was and what will never be again.

                The joy, the warmth, the easy companionship – all vanished.  Left behind is a hollow shell, a gaping void where happiness once resided.  I try to distract myself, to fill the silence, but nothing works. The music is too loud, the books offer no solace, the TV a cacophony of meaningless noise.

                Loneliness, a suffocating presence, wraps its icy tendrils around me, stealing my breath away.  I long for human touch, for a shoulder to cry on, for someone to hold me and tell me it will be okay. But there's no one.

                The rain continues to fall, washing away any hope of a brighter tomorrow.  And I, adrift in a sea of sorrow, can only wait for the storm to pass, praying that somehow, somewhere, the sun will shine again.            </p>
        </div>


        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-md mt-4">
            <p className="text-lg font-semibold">Need someone to talk to about your feelings?</p>
            <p className="mt-2">
                Echo listens to you attentively and responds with empathy. It doesn’t judge,
                interrupt, or assume—just a space where you can share your thoughts freely.
            </p>
            <Link href="/chat">
                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Talk to Echo
                </button>
            </Link>
        </div>

    </div>
);

export default EntryCard;
