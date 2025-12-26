'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';
import { Project } from '@/lib/products';

type ProjectLocation = {
    id: string;
    city: string;
    x: number; // Percentage from left
    y: number; // Percentage from top
    project: {
        name: string;
        details: string;
        image: string; // Fallback URL
        slug: string;
    };
};

// Coordinate mapping for supported cities (Percentage X, Y relative to the SVG viewbox)
const CITY_COORDINATES: Record<string, { x: number, y: number }> = {
    'mumbai': { x: 28, y: 58 },
    'delhi': { x: 42, y: 28 }, // New Delhi
    'new delhi': { x: 42, y: 28 },
    'gurgaon': { x: 41, y: 29 },
    'noida': { x: 43, y: 29 },
    'bangalore': { x: 40, y: 78 },
    'bengaluru': { x: 40, y: 78 },
    'ahmedabad': { x: 25, y: 45 },
    'pune': { x: 32, y: 62 },
    'hyderabad': { x: 45, y: 65 },
    'chennai': { x: 50, y: 80 },
    'jaipur': { x: 35, y: 35 },
    'goa': { x: 30, y: 70 },
    'kolkata': { x: 75, y: 45 },
    'surat': { x: 26, y: 48 },
    'kochi': { x: 38, y: 88 },
    'chandigarh': { x: 40, y: 20 },
    'lucknow': { x: 55, y: 35 }
};

interface ProjectAtlasProps {
    projects?: Project[];
}


// Deterministic random number generator based on string seed
const getDeterministicRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return (Math.abs(hash) % 1000) / 1000; // 0.0 to 1.0
};

export default function ProjectAtlas({ projects = [] }: ProjectAtlasProps) {
    const [activeLocation, setActiveLocation] = useState<string | null>(null);

    // Dynamic Location Generation
    const projectLocations = React.useMemo(() => {
        const mapped: ProjectLocation[] = [];

        // Sort projects by recency or importance if available
        projects.forEach(project => {
            if (!project.location) return;

            // Simple fuzzy matching (lowercase, check if city key is in location string)
            const locationLower = project.location.toLowerCase();
            const cityKey = Object.keys(CITY_COORDINATES).find(city => locationLower.includes(city));

            if (cityKey) {
                // Use deterministic jitter to prevent hydration mismatch
                // We use the slug + axis as seed so the jitter is constant for each project
                const jitterX = (getDeterministicRandom(project.slug + 'x') - 0.5) * 3;
                const jitterY = (getDeterministicRandom(project.slug + 'y') - 0.5) * 3;

                mapped.push({
                    id: project.slug,
                    city: project.location.split(',')[0],
                    x: CITY_COORDINATES[cityKey].x + jitterX,
                    y: CITY_COORDINATES[cityKey].y + jitterY,
                    project: {
                        name: project.title,
                        details: project.type || 'Architectural Project',
                        image: project.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200&auto=format&fit=crop',
                        slug: project.slug
                    }
                });
            }
        });

        // Fallback: If no real projects, use placeholder data for visualization (Demo Mode)
        if (mapped.length === 0) {
            return [
                {
                    id: 'mumbai-demo',
                    city: 'Mumbai',
                    x: 28, y: 58,
                    project: { name: 'Urban Clay Studio', details: 'Headquarters', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80', slug: '#' }
                },
                {
                    id: 'delhi-demo',
                    city: 'New Delhi',
                    x: 42, y: 28,
                    project: { name: 'Diplomat Enclave', details: 'Featured Project', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', slug: '#' }
                }
            ];
        }

        return mapped;
    }, [projects]);

    return (
        <section className="py-10 md:py-24 bg-[#2A1E16] text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-2 block">Project Atlas</span>
                        <h2 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
                            Building India,<br />
                            <span className="text-white/50">One Brick at a Time.</span>
                        </h2>
                        <p className="text-white/60 text-base md:text-lg max-w-md mb-6 md:mb-8 leading-relaxed">
                            From the humid coasts of Chennai to the dry heat of Jaipur, our terracotta products are trusted by architects across the subcontinent for their durability and timeless appeal.
                        </p>

                        <div className="grid grid-cols-2 gap-6 md:gap-8 mb-8 lg:mb-0">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[var(--terracotta)] mb-1">50+</div>
                                <div className="text-xs md:text-sm text-white/40 uppercase tracking-wider">Cities Delivered</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[var(--terracotta)] mb-1">200+</div>
                                <div className="text-xs md:text-sm text-white/40 uppercase tracking-wider">Projects Completed</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-[60%] md:w-full max-w-md mx-auto mt-4 md:mt-0"
                    >
                        {/* India Map SVG */}
                        <svg
                            viewBox="0 0 600 700"
                            className="w-full h-full drop-shadow-2xl filter"
                        >
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4a3b32" />
                                    <stop offset="100%" stopColor="#3A2A22" />
                                </linearGradient>
                            </defs>

                            {/* Connecting Lines (Network Effect) */}
                            <g className="opacity-20">
                                {projectLocations.map((loc, i) => (
                                    projectLocations.slice(i + 1).map((target, j) => (
                                        <motion.line
                                            key={`${loc.id}-${target.id}`}
                                            x1={`${loc.x}%`}
                                            y1={`${loc.y}%`}
                                            x2={`${target.x}%`}
                                            y2={`${target.y}%`}
                                            stroke="url(#lineGradient)"
                                            strokeWidth="0.5"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            whileInView={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                                        />
                                    ))
                                ))}
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="#d97757" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </g>

                            {/* Realistic India Map Path */}
                            <path
                                d="M 221.78 35.68 L 223.63 32.74 L 227.34 32.74 L 230.13 29.34 L 232.91 29.34 L 234.77 26.56 L 238.48 26.56 L 241.26 23.47 L 244.05 23.47 L 246.83 20.37 L 249.61 20.37 L 253.33 17.59 L 261.68 17.59 L 263.53 15.74 L 266.32 15.74 L 269.10 12.64 L 273.74 12.64 L 271.88 17.59 L 271.88 23.47 L 274.67 29.34 L 278.38 31.20 L 282.09 31.20 L 285.80 34.29 L 285.80 37.38 L 283.02 40.16 L 283.02 43.25 L 280.24 46.04 L 280.24 49.13 L 283.02 52.22 L 283.02 55.00 L 285.80 57.79 L 285.80 60.88 L 288.59 63.66 L 291.37 63.66 L 292.30 65.51 L 296.01 65.51 L 299.72 68.60 L 302.51 68.60 L 305.29 71.39 L 308.07 71.39 L 310.86 74.48 L 317.35 74.48 L 320.14 77.26 L 326.63 77.26 L 330.34 80.35 L 343.34 80.35 L 346.12 83.13 L 347.05 83.13 L 349.83 80.35 L 350.76 80.35 L 353.54 77.26 L 356.33 77.26 L 359.11 74.48 L 361.90 74.48 L 364.68 71.39 L 367.46 71.39 L 370.25 68.60 L 373.03 68.60 L 377.67 62.42 L 380.46 62.42 L 383.24 59.33 L 386.03 59.33 L 388.81 56.55 L 391.59 56.55 L 394.38 53.46 L 397.16 53.46 L 399.94 50.36 L 402.73 50.36 L 405.51 53.46 L 408.30 53.46 L 409.22 56.55 L 413.86 56.55 L 416.64 59.33 L 416.64 62.11 L 413.86 64.90 L 411.08 64.90 L 408.30 67.68 L 405.51 67.68 L 402.73 70.47 L 399.94 70.47 L 397.16 73.25 L 394.38 73.25 L 391.59 76.03 L 388.81 76.03 L 386.03 78.82 L 383.24 78.82 L 380.46 81.60 L 377.67 81.60 L 374.89 84.39 L 372.11 84.39 L 369.32 87.17 L 366.54 87.17 L 363.75 89.95 L 360.97 89.95 L 358.19 92.74 L 355.40 92.74 L 352.62 95.52 L 349.83 95.52 L 347.05 98.31 L 344.27 98.31 L 341.48 101.09 L 338.70 101.09 L 335.91 103.87 L 333.13 103.87 L 330.34 106.66 L 327.56 106.66 L 324.78 109.44 L 321.99 109.44 L 319.21 112.23 L 316.42 112.23 L 313.64 115.01 L 310.86 115.01 L 308.07 117.80 L 305.29 117.80 L 302.51 120.58 L 299.72 120.58 L 296.94 123.36 L 294.15 123.36 L 291.37 126.15 L 288.59 126.15 L 285.80 128.93 L 283.02 128.93 L 283.02 131.72 L 280.24 134.50 L 277.45 134.50 L 274.67 137.29 L 271.88 137.29 L 269.10 140.07 L 266.32 140.07 L 263.53 142.85 L 260.75 142.85 L 257.96 145.64 L 255.18 145.64 L 252.40 148.42 L 249.61 148.42 L 246.83 151.21 L 244.05 151.21 L 241.26 153.99 L 238.48 153.99 L 235.70 156.77 L 232.91 156.77 L 230.13 159.56 L 227.34 159.56 L 224.56 162.34 L 221.78 162.34 L 218.99 165.13 L 216.21 165.13 L 213.43 167.91 L 210.64 167.91 L 207.86 170.70 L 205.07 170.70 L 202.29 173.48 L 199.51 173.48 L 196.72 176.26 L 193.94 176.26 L 191.16 179.05 L 188.37 179.05 L 185.59 181.83 L 182.80 181.83 L 180.02 184.62 L 177.24 184.62 L 174.45 187.40 L 171.67 187.40 L 168.89 190.19 L 166.10 190.19 L 163.32 192.97 L 160.54 192.97 L 157.75 195.76 L 154.97 195.76 L 152.18 198.54 L 149.40 198.54 L 146.62 201.32 L 143.83 201.32 L 141.05 204.11 L 138.27 204.11 L 135.48 206.89 L 132.70 206.89 L 129.92 209.68 L 127.13 209.68 L 129.92 212.46 L 132.70 215.25 L 132.70 218.03 L 135.48 220.82 L 135.48 223.60 L 138.27 226.38 L 141.05 229.17 L 141.05 231.95 L 143.83 234.74 L 143.83 237.52 L 146.62 240.30 L 149.40 243.09 L 149.40 245.87 L 152.18 248.66 L 154.97 251.44 L 154.97 254.23 L 157.75 257.01 L 160.54 259.80 L 160.54 262.58 L 166.10 268.15 L 166.10 270.93 L 168.89 273.72 L 171.67 276.50 L 174.45 279.29 L 174.45 282.07 L 177.24 284.86 L 180.02 287.64 L 182.80 290.43 L 182.80 293.21 L 185.59 296.00 L 188.37 298.78 L 191.16 301.56 L 191.16 304.35 L 193.94 307.13 L 196.72 309.92 L 199.51 312.70 L 202.29 315.49 L 202.29 318.27 L 205.07 321.06 L 207.86 323.84 L 210.64 326.63 L 210.64 329.41 L 213.43 332.20 L 216.21 334.98 L 218.99 337.76 L 221.78 340.55 L 221.78 343.33 L 224.56 346.12 L 227.34 348.90 L 230.13 351.69 L 232.91 354.47 L 235.70 357.26 L 235.70 360.04 L 238.48 362.83 L 241.26 365.61 L 244.05 368.40 L 246.83 371.18 L 249.61 373.97 L 252.40 376.75 L 255.18 379.53 L 257.96 382.32 L 257.96 385.10 L 255.18 387.89 L 252.40 387.89 L 249.61 390.67 L 246.83 390.67 L 244.05 387.89 L 241.26 387.89 L 238.48 385.10 L 235.70 385.10 L 232.91 382.32 L 230.13 382.32 L 227.34 379.53 L 224.56 379.53 L 221.78 376.75 L 218.99 376.75 L 216.21 373.97 L 213.43 373.97 L 210.64 371.18 L 207.86 371.18 L 205.07 368.40 L 202.29 368.40 L 199.51 365.61 L 196.72 365.61 L 193.94 362.83 L 191.16 362.83 L 188.37 360.04 L 185.59 360.04 L 182.80 357.26 L 180.02 357.26 L 177.24 354.47 L 174.45 354.47 L 171.67 351.69 L 168.89 351.69 L 166.10 348.90 L 163.32 348.90 L 160.54 346.12 L 157.75 346.12 L 154.97 343.33 L 152.18 343.33 L 149.40 340.55 L 146.62 340.55 L 143.83 337.76 L 141.05 337.76 L 138.27 334.98 L 135.48 334.98 L 132.70 332.20 L 129.92 332.20 L 127.13 329.41 L 124.35 329.41 L 121.57 326.63 L 118.78 326.63 L 116.00 323.84 L 113.22 323.84 L 110.43 321.06 L 107.65 321.06 L 104.87 318.27 L 102.08 318.27 L 99.30 315.49 L 96.52 315.49 L 93.73 312.70 L 90.95 312.70 L 88.17 309.92 L 85.39 309.92 L 82.60 307.13 L 79.82 307.13 L 77.04 304.35 L 74.25 304.35 L 71.47 301.56 L 68.69 301.56 L 65.90 298.78 L 63.12 298.78 L 60.34 296.00 L 57.55 296.00 L 54.77 293.21 L 51.99 293.21 L 49.20 290.43 L 46.42 290.43 L 43.64 287.64 L 40.85 287.64 L 38.07 284.86 L 35.29 284.86 L 32.50 282.07 L 29.72 282.07 L 26.94 279.29 L 24.16 279.29 L 21.37 276.50 L 18.59 276.50 L 15.81 273.72 L 13.02 273.72 L 10.24 270.93 L 7.46 270.93 L 4.67 268.15 L 1.89 268.15 L 1.89 265.37 L 4.67 265.37 L 7.46 262.58 L 10.24 262.58 L 13.02 259.80 L 15.81 259.80 L 18.59 257.01 L 21.37 257.01 L 24.16 254.23 L 26.94 254.23 L 29.72 251.44 L 32.50 251.44 L 35.29 248.66 L 38.07 248.66 L 40.85 245.87 L 43.64 245.87 L 46.42 243.09 L 49.20 243.09 L 51.99 240.30 L 54.77 240.30 L 57.55 237.52 L 60.34 237.52 L 63.12 234.74 L 65.90 234.74 L 68.69 231.95 L 71.47 231.95 L 74.25 229.17 L 77.04 229.17 L 79.82 226.38 L 82.60 226.38 L 85.39 223.60 L 88.17 223.60 L 90.95 220.82 L 93.73 220.82 L 96.52 218.03 L 99.30 215.25 L 99.30 212.46 L 96.52 209.68 L 93.73 209.68 L 90.95 206.89 L 88.17 206.89 L 85.39 204.11 L 82.60 204.11 L 79.82 201.32 L 77.04 201.32 L 74.25 198.54 L 71.47 198.54 L 68.69 195.76 L 65.90 195.76 L 63.12 192.97 L 60.34 192.97 L 57.55 190.19 L 54.77 190.19 L 51.99 187.40 L 49.20 187.40 L 46.42 184.62 L 43.64 184.62 L 40.85 181.83 L 38.07 181.83 L 35.29 179.05 L 32.50 179.05 L 29.72 176.26 L 26.94 176.26 L 24.16 173.48 L 24.16 170.70 L 26.94 167.91 L 29.72 165.13 L 29.72 162.34 L 32.50 159.56 L 35.29 156.77 L 38.07 153.99 L 40.85 151.21 L 43.64 148.42 L 46.42 145.64 L 49.20 142.85 L 51.99 140.07 L 54.77 137.29 L 57.55 137.29 L 60.34 134.50 L 63.12 131.72 L 65.90 128.93 L 68.69 126.15 L 71.47 123.36 L 74.25 120.58 L 77.04 117.80 L 79.82 115.01 L 82.60 115.01 L 85.39 112.23 L 88.17 112.23 L 90.95 109.44 L 93.73 109.44 L 96.52 106.66 L 99.30 106.66 L 102.08 103.87 L 104.87 101.09 L 107.65 98.31 L 110.43 95.52 L 113.22 92.74 L 116.00 89.95 L 118.78 87.17 L 121.57 87.17 L 124.35 84.39 L 127.13 84.39 L 129.92 81.60 L 132.70 81.60 L 135.48 78.82 L 138.27 76.03 L 141.05 76.03 L 143.83 73.25 L 146.62 73.25 L 149.40 70.47 L 152.18 70.47 L 154.97 67.68 L 157.75 67.68 L 160.54 64.90 L 163.32 64.90 L 166.10 62.11 L 168.89 59.33 L 171.67 56.55 L 174.45 53.46 L 177.24 53.46 L 180.02 50.36 L 182.80 50.36 L 185.59 47.58 L 188.37 47.58 L 191.16 44.79 L 193.94 44.79 L 196.72 42.00 L 199.51 42.00 L 202.29 39.21 L 205.07 39.21 L 207.86 36.43 L 210.64 36.43 L 213.43 33.64 L 216.21 33.64 L 218.99 30.85 L 221.78 30.85 L 221.78 35.68 Z"
                                fill="url(#mapGradient)"
                                stroke="#5d4037"
                                strokeWidth="1"
                                className="opacity-90 hover:opacity-100 transition-opacity duration-500"
                            />

                            <path d="M225.5,38.5 L210,20 L230,10 L250,15 L265.5,35.5 Z" fill="url(#mapGradient)" stroke="#5d4037" strokeWidth="1" />
                        </svg>

                        {/* Hotspots */}
                        {projectLocations.map((loc) => (
                            <Link
                                key={loc.id}
                                href={`/projects/${loc.project.slug}`}
                                className="absolute group"
                                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                                onMouseEnter={() => setActiveLocation(loc.id)}
                                onMouseLeave={() => setActiveLocation(null)}
                            >
                                {/* Pulse Effect */}
                                <div className="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-4 cursor-pointer">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--terracotta)] opacity-20 animate-ping duration-[2s]"></span>
                                    <span className="absolute inline-flex h-2/3 w-2/3 rounded-full bg-[var(--terracotta)] opacity-40 animate-pulse"></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d97757] shadow-[0_0_10px_rgba(217,119,87,0.8)] transition-all duration-300 ${activeLocation === loc.id ? 'scale-150 bg-white' : 'group-hover:scale-125'}`}></span>
                                </div>

                                {/* Hover Card */}
                                <AnimatePresence>
                                    {activeLocation === loc.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#1a1a18]/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-4 z-50 pointer-events-none origin-bottom"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 relative">
                                                    <img
                                                        src={loc.project.image}
                                                        alt={loc.project.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]"></span>
                                                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{loc.city}</span>
                                                    </div>
                                                    <h4 className="text-base font-serif text-white leading-tight mb-1 truncate">{loc.project.name}</h4>
                                                    <p className="text-xs text-white/50 leading-snug line-clamp-2">{loc.project.details}</p>
                                                    <div className="mt-2 flex items-center text-[10px] font-medium text-[var(--terracotta)]">
                                                        View Project <span className="ml-1">→</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-[#1a1a18]/95"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
