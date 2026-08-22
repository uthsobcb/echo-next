import React, { useEffect, useRef, useState } from "react";
import { ScanText, Camera, X, Repeat } from "lucide-react";
import Tesseract from "tesseract.js";

const ScanComponent = ({ onScanComplete }: { onScanComplete: (text: string) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [scannedText, setScannedText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

    useEffect(() => {
        // Get all video input devices
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoInputs = devices.filter(device => device.kind === "videoinput");
            setVideoDevices(videoInputs);

            // Default to back camera if available
            const backCameraIndex = videoInputs.findIndex(device =>
                device.label.toLowerCase().includes("back")
            );

            setCurrentDeviceIndex(backCameraIndex >= 0 ? backCameraIndex : 0);
        });
    }, []);

    const startCamera = async (deviceIndex = currentDeviceIndex) => {
        setIsCameraOpen(true);
        try {
            const constraints = {
                video: {
                    deviceId: videoDevices[deviceIndex]?.deviceId || undefined,
                    facingMode: "environment" // Hint for mobile devices
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const switchCamera = async () => {
        const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
        setCurrentDeviceIndex(nextIndex);

        // Stop current stream
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }

        // Start new camera
        await startCamera(nextIndex);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext("2d");
        if (context) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = canvasRef.current.toDataURL("image/png");
            setCapturedImage(imageData);
            setIsCameraOpen(false);

            // Stop the camera stream
            if (videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        }
    };

    const processImage = async () => {
        if (!capturedImage) return;
        setLoading(true);
        setScannedText(null);

        try {
            const { data } = await Tesseract.recognize(capturedImage, "eng");
            setScannedText(data.text);
            onScanComplete(data.text);
        } catch (error) {
            console.error("OCR error:", error);
            setScannedText("Error scanning text.");
        }

        setLoading(false);
    };

    return (
        <div className="relative flex min-w-0 flex-col items-center text-center">
            <button
                type="button"
                onClick={() => startCamera(currentDeviceIndex)}
                aria-label="Scan a handwritten journal page"
                className="flex size-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-sm transition-transform duration-200 active:scale-95 sm:size-14"
            >
                <ScanText className="size-5 text-gray-700 sm:size-6" aria-hidden="true" />
            </button>
            <p className="mt-2 text-pretty text-xs font-medium leading-4 text-gray-700 sm:text-sm">Scan a page</p>

            {isCameraOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90" role="dialog" aria-modal="true" aria-label="Scan a handwritten page">
                    <video ref={videoRef} className="h-dvh w-full object-cover"></video>

                    <div className="absolute bottom-10 flex gap-4">
                        <button
                            type="button"
                            onClick={captureImage}
                            className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg"
                        >
                            Capture
                        </button>

                        {videoDevices.length > 1 && (
                            <button
                                type="button"
                                onClick={switchCamera}
                                aria-label="Switch camera"
                                className="p-3 bg-gray-700 text-white rounded-full"
                            >
                                <Repeat className="size-6" aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsCameraOpen(false);
                            if (videoRef.current?.srcObject) {
                                const stream = videoRef.current.srcObject as MediaStream;
                                stream.getTracks().forEach((track) => track.stop());
                            }
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full"
                        aria-label="Close camera"
                    >
                        <X className="size-6" aria-hidden="true" />
                    </button>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>

            {scannedText && (
                <div className="w-64 p-3 bg-gray-100 rounded-md shadow-md text-gray-800 text-sm mt-4">
                    <p className="font-medium">Scanned Text:</p>
                    <p className="whitespace-pre-wrap">{scannedText}</p>
                </div>
            )}

            {capturedImage && (
                <button
                    type="button"
                    onClick={processImage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-3"
                    disabled={loading}
                >
                    {loading ? "Scanning..." : "Extract Text"}
                </button>
            )}
        </div>
    );
};

export default ScanComponent;
