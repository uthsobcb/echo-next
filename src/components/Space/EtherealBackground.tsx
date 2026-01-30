"use client";

import React, { useEffect, useRef } from "react";

const EtherealBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        // Configuration for the "Aura" waves (Light Mode)
        const waves = [
            { amplitude: 150, frequency: 0.002, speed: 0.01, color: "hsla(260, 100%, 70%, 0.15)" },
            { amplitude: 100, frequency: 0.001, speed: -0.015, color: "hsla(280, 100%, 70%, 0.2)" },
            { amplitude: 120, frequency: 0.0015, speed: 0.008, color: "hsla(180, 100%, 70%, 0.15)" },
            { amplitude: 180, frequency: 0.0008, speed: -0.01, color: "hsla(320, 100%, 70%, 0.12)" }
        ];

        let offset = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const render = () => {
            // Bright base
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle gradient overlay
            const topG = ctx.createLinearGradient(0, 0, 0, canvas.height);
            topG.addColorStop(0, "rgba(240, 249, 255, 1)"); // slate-50
            topG.addColorStop(1, "rgba(255, 255, 255, 1)");
            ctx.fillStyle = topG;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            offset += 0.05;

            waves.forEach((wave, i) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);

                for (let x = 0; x < canvas.width; x += 5) {
                    const y = canvas.height / 2 +
                        Math.sin(x * wave.frequency + offset * wave.speed + i) * wave.amplitude +
                        Math.cos(x * 0.0005 + offset * 0.002) * (wave.amplitude / 2);

                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();

                const gradient = ctx.createLinearGradient(0, canvas.height / 2 - wave.amplitude, 0, canvas.height);
                gradient.addColorStop(0, wave.color);
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

                ctx.fillStyle = gradient;
                ctx.fill();
            });

            // Add soft floating light orbs
            ctx.globalCompositeOperation = "multiply";
            for (let i = 0; i < 15; i++) {
                const x = (Math.sin(offset * 0.08 + i) * 0.5 + 0.5) * canvas.width;
                const y = (Math.cos(offset * 0.04 + i * 2) * 0.5 + 0.5) * canvas.height;
                const size = Math.sin(offset * 0.15 + i) * 10 + 30;

                const g = ctx.createRadialGradient(x, y, 0, x, y, size);
                g.addColorStop(0, "rgba(79, 70, 229, 0.05)"); // indigo base
                g.addColorStop(1, "transparent");

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = "source-over";

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener("resize", resize);
        resize();
        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
        />
    );
};

export default EtherealBackground;
