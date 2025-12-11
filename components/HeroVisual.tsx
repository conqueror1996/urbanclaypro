'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface HeroVisualProps {
    imageUrl?: string;
}

export default function HeroVisual({ imageUrl }: HeroVisualProps) {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Mouse Tracking for Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics-based motion
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    // Calculate rotation: Move mouse right -> rotateY positive (right side goes "in" or "out"?)
    // Let's make it follow the mouse: Mouse Right -> Right side tips DOWN (away).
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = event.clientX - rect.left;
        const mouseYPos = event.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Embers Animation
    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 20,
                size: Math.random() * 2 + 0.5,
                speedY: Math.random() * 1 + 0.2,
                opacity: Math.random() * 0.5 + 0.2
            };
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 30; i++) {
                particles.push(createParticle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.y -= p.speedY;
                p.opacity -= 0.002;

                if (p.y < -10 || p.opacity <= 0) {
                    particles[index] = createParticle();
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 100, 50, ${p.opacity})`; // Orange/Ember color
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [prefersReducedMotion]);

    return (
        <div className="w-full h-full" style={{ perspective: 1000 }}> {/* Perspective container for 3D effect */}
            <motion.div
                className="relative w-full h-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-[#e6d5c9]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX: prefersReducedMotion ? 0 : rotateX,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Heat Haze SVG Filter Definition */}
                <svg className="absolute w-0 h-0">
                    <defs>
                        <filter id="heatHaze">
                            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="1" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                        </filter>
                    </defs>
                </svg>

                {/* Image Layer */}
                <div className="absolute inset-0 z-0 transform transition-transform duration-500 hover:scale-105"> {/* Subtle zoom on hover */}
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Premium Terracotta Product"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        // Fallback: Photo Tile Grid
                        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-[#d6cbb8]">
                            {[...Array(16)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`relative overflow-hidden rounded-sm ${[0, 5, 10, 15].includes(i) ? 'bg-[#b45a3c]' :
                                        [1, 6, 11, 12].includes(i) ? 'bg-[#c06a4a]' :
                                            'bg-[#a1887f]'
                                        }`}
                                >
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/clay.png')]"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Heat Haze Overlay */}
                {!prefersReducedMotion && (
                    <div
                        className="absolute inset-x-0 bottom-0 h-1/3 z-10 pointer-events-none opacity-30"
                        style={{ backdropFilter: 'blur(1px)', filter: 'url(#heatHaze)' }}
                    ></div>
                )}

                {/* Embers Canvas - Moved forward in Z space for depth */}
                <motion.canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{ translateZ: "40px" }} // Parallax separation
                />

                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 z-10 pointer-events-none mix-blend-overlay"></div>
            </motion.div>
        </div>
    );
}
