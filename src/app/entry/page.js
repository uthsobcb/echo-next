'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import JournalPrompt from '@/app/components/JournalPrompt';
import ScanComponent from '@/app/components/ScanComponent';
import UploadIcon from '@/app/components/UploadIcon';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 30,
    p: 4,
    borderRadius: '15px',
};

const Entry = () => {
    // const dateandtime = new Date().toLocaleString();
    const [open, setOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [mood, setMood] = useState(null);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    // console.log("From parent", imgUrl)
    const handleOpen = async () => {
        setOpen(true);

        if (!journalEntry.trim()) {
            setError('Please write something before submitting.');
            toast.info('Please write something before submitting.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/mood', {
                content: journalEntry,
                imgUrl: imageUrl,
            });

            setMood(response.data.mood);
            setComment(response.data.comment);
            setScore(response.data.score);

            toast.success('Sucessfully Stored!');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while analyzing your mood.');
            toast.error('Failed to enter', err.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const numericScore = !isNaN(score) && typeof score === 'number' ? score : 0;

    return (

        <div className="flex flex-col items-center justify-center h-screen mt-16 m-6 p-8">

            <h1 className="text-7xl font-handwriting text-gray-800">Journal Entry</h1>
            <div className="flex items-center justify-center space-x-4 mb-10 z-20">
                <ScanComponent />
                <JournalPrompt />
                <UploadIcon OnImageUpload={setImageUrl} />
            </div>
            <div className="w-full relative sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-5xl bg-[#F5DEB3] border rounded-lg shadow-lg p-5">
                {imageUrl && (
                    <div className="top-10 -right-[-50px] rotate-6">
                        <Image
                            src={imageUrl}
                            width={96}
                            height={96}
                            alt="Uploaded image"
                            unoptimized
                            className="shadow-lg rounded-lg"
                        />
                        <p className='text-gray-400'> Uploaded image</p>
                    </div>
                )}

                <textarea
                    className="w-full h-[75vh] border-none bg-transparent text-gray-900 placeholder-gray-400 font-handwriting lg:text-6xl text-4xl  overflow-auto focus:outline-none"
                    placeholder="How was your day? What's on your mind? Jot down your thoughts here..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                ></textarea>
                {error && <p className="text-red-600 mt-2">{error}</p>}
                <button
                    className="mt-4 px-6 py-2 bg-black/40 text-white font-semibold rounded-lg hover:bg-black transition duration-300"
                    onClick={handleOpen}
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : 'Enter Entry'}
                </button>
                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <div className="flex justify-center flex-col items-center">

                            {loading ? (
                                <Image
                                    src="/assets/loading.png"
                                    alt="Logo"
                                    width={96}
                                    height={96}
                                    className="object-contain mb-4"
                                />
                            ) : (

                                numericScore < 0 ? (
                                    <Image
                                        src="/assets/echo-sad.png"
                                        alt="Sad Echo"
                                        width={96}
                                        height={96}
                                        className="object-contain mb-4"
                                    />
                                ) : (
                                    <Image
                                        src="/assets/loved-echo.png"
                                        alt="Happy Echo"
                                        width={96}
                                        height={96}
                                        className="object-contain mb-4"
                                    />
                                )
                            )}


                            {loading ? (
                                <p className="text-xl font-semibold text-gray-800">Analyzing your mood...</p>
                            ) : mood ? (
                                <p className="text-xl font-semibold text-gray-800">
                                    Echo thinks you're feeling <span className="text-blue-600">{mood}</span>.
                                </p>
                            ) : (
                                <p className="text-xl font-semibold text-red-600">Failed to analyze mood.</p>
                            )}
                            <p className="text-lg text-gray-600">
                                Comment: { }
                                {comment || 'Echo analyzing...'}
                                <br />
                                <Link href="/chat" className="text-blue-600">Talk To Echo about your feelings??</Link>
                            </p>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default Entry;
