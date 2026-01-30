"use client";

import React, { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
    width?: number;
    height?: number;
    revealThreshold?: number;
    onReveal?: () => void;
    brushSize?: number;
    children: React.ReactNode;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
    width = 320,
    height = 220,
    revealThreshold = 0.5,
    onReveal,
    brushSize = 40,
    children
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const particles = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Create an Iridescent/Holographic Foil Gradient (Brighter for light mode)
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#c7d2fe");    // Indigo 200
        gradient.addColorStop(0.2, "#e9d5ff");  // Purple 200
        gradient.addColorStop(0.4, "#fecdd3");  // Rose 200
        gradient.addColorStop(0.6, "#99f6e4");  // Teal 200
        gradient.addColorStop(0.8, "#bfdbfe");  // Blue 200
        gradient.addColorStop(1, "#c7d2fe");    // Indigo 200

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some "magical shimmer" texture
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 40; i++) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Pattern overlay (subtle grain)
        ctx.globalCompositeOperation = "overlay";
        for (let i = 0; i < 500; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = brushSize;
    }, [width, height, brushSize]);

    // Particle system (Magical trails)
    useEffect(() => {
        const canvas = particleCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.current = particles.current.filter(p => p.life > 0);
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                const size = p.size * p.life;

                ctx.fillStyle = p.color.replace("0.5", (p.life * 0.6).toString());
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (isRevealed) return;
        setIsDrawing(true);
        const { x, y } = getPos(e);
        scratch(x, y);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || isRevealed) return;
        const { x, y } = getPos(e);
        scratch(x, y);
    };

    const handleEnd = () => {
        setIsDrawing(false);
        checkReveal();
    };

    const scratch = (x: number, y: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Magical trailing particles (More saturated for light mode)
        for (let i = 0; i < 2; i++) {
            particles.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                size: Math.random() * 6 + 2,
                color: `hsla(${Math.random() * 360}, 80%, 60%, 0.5)`
            });
        }
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || isRevealed || !canvas) return;

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let clearPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) clearPixels++;
        }

        if (clearPixels / (width * height) >= revealThreshold) {
            setIsRevealed(true);
            triggerBurst();
            onReveal?.();
        }
    };

    const triggerBurst = () => {
        for (let i = 0; i < 40; i++) {
            particles.current.push({
                x: width / 2,
                y: height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1.5,
                size: Math.random() * 10 + 2,
                color: `hsla(${Math.random() * 360}, 100%, 70%, 0.5)`
            });
        }
    };

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl border border-slate-200" style={{ width, height }}>
            {/* The hidden content (Dark text for light mode) */}
            <div className="absolute inset-0 flex items-center justify-center bg-white p-6 text-center select-none">
                {children}
            </div>

            {/* Particle canvas */}
            <canvas
                ref={particleCanvasRef}
                width={width}
                height={height}
                className="absolute inset-0 pointer-events-none z-10"
            />

            {/* The canvas overlay */}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={`absolute inset-0 cursor-crosshair transition-all duration-1000 ease-out z-20 ${isRevealed ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"}`}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            />

            {/* Gloss shine effect */}
            {!isRevealed && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/40 to-white/0 z-30 opacity-60" />
            )}
        </div>
    );
};

export default ScratchCard;
