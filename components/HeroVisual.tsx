'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PremiumImage from './PremiumImage';
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface HeroVisualProps {
    imageUrl?: string;
    alt?: string;
}

export default function HeroVisual({ imageUrl, alt }: HeroVisualProps) {
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



    // Embers Animation
    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true }); // Optimized context
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
                speedY: Math.random() * 1 + 0.2, // Reduced speed
                opacity: Math.random() * 0.5 + 0.2
            };
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 15; i++) { // Reduced count from 30 to 15
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
                ctx.fillStyle = `rgba(255, 100, 50, ${p.opacity})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        // Defer particle start to avoid blocking hydration
        const timer = setTimeout(() => {
            resizeCanvas();
            initParticles();
            animate();
            window.addEventListener('resize', resizeCanvas);
        }, 1000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [prefersReducedMotion]);


    // Spotlight Tracking
    const spotlightX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
    const spotlightY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = event.clientX - rect.left;
        const mouseYPos = event.clientY - rect.top;

        const xPct = (mouseXPos / width) - 0.5;
        const yPct = (mouseYPos / height) - 0.5;

        x.set(xPct);
        y.set(yPct);

        // Update spotlight position (absolute pixels for radial gradient)
        spotlightX.set(mouseXPos);
        spotlightY.set(mouseYPos);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };



    return (
        <div className="w-full h-full" style={{ perspective: 1200 }}>
            <motion.div
                className="relative w-full h-full min-h-[320px] md:min-h-[550px] overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX: prefersReducedMotion ? 0 : rotateX,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Base Layer: The Raw Architectural Cutout (Multiply removes the white background) */}
                <div className="absolute inset-0 z-0">
                    {imageUrl ? (
                        <PremiumImage
                            src={imageUrl}
                            alt={alt || "UrbanClay Architectural Terracotta"}
                            fill
                            className="object-contain"
                            containerClassName="w-full h-full"
                            priority
                        />
                    ) : (
                        <Image
                            src="/images/engineered-facade-masterpiece.png"
                            alt="UrbanClay Engineered Facade Masterpiece"
                            fill
                            className="object-contain mix-blend-multiply"
                            priority
                        />
                    )}
                </div>

                {/* Subtle Embers - Kept for atmospheric depth only */}
                <motion.canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-40 pointer-events-none"
                    style={{ translateZ: "30px", opacity: 0.4 }}
                />
            </motion.div>

            {/* Hidden SVG Filter */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="heatHaze">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="1" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                    </filter>
                </defs>
            </svg>
        </div >
    );
}
