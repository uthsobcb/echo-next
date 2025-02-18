import React, { useRef, useState } from "react";
import { ScanText, Camera, X } from "lucide-react";
import Tesseract from "tesseract.js";

const ScanComponent = ({ onScanComplete }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [scannedText, setScannedText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
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
                const stream = videoRef.current.srcObject;
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
        <div className="flex flex-col items-center justify-center relative mt-5">
            {/* Scan Button */}
            <button
                onClick={startCamera}
                className="p-3 bg-white/80 rounded-full shadow hover:bg-white transition"
            >
                <ScanText className="w-6 h-6 text-gray-700" />
            </button>
            <p> Scan Handwritten Journal!</p>

            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
                    <video ref={videoRef} className="w-full h-full object-cover"></video>

                    <button
                        onClick={captureImage}
                        className="absolute bottom-10 px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg"
                    >
                        Capture
                    </button>

                    <button
                        onClick={() => setIsCameraOpen(false)}
                        className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full"
                    >
                        <X className="w-6 h-6" />
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
