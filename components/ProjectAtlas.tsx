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

const LOCATIONS: ProjectLocation[] = [
    {
        id: 'mumbai',
        city: 'Mumbai',
        x: 28,
        y: 58,
        project: {
            name: 'Bhairavi Residence',
            details: '2,500 sq.ft Wirecut Bricks',
            image: 'https://images.unsplash.com/photo-1625234127926-79357039031b?q=80&w=200&auto=format&fit=crop',
            slug: 'bhairavi-residence'
        }
    },
    {
        id: 'delhi',
        city: 'New Delhi',
        x: 42,
        y: 28,
        project: {
            name: 'Diplomat Enclave',
            details: '12,000 Cladding Tiles',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
            slug: 'diplomat-enclave'
        }
    },
    {
        id: 'bangalore',
        city: 'Bangalore',
        x: 40,
        y: 78,
        project: {
            name: 'Tech Park Lobby',
            details: 'Custom Linear Bricks',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200&auto=format&fit=crop',
            slug: 'tech-park-lobby'
        }
    },
    {
        id: 'ahmedabad',
        city: 'Ahmedabad',
        x: 25,
        y: 45,
        project: {
            name: 'IIM New Wing',
            details: 'Exposed Brick Facade',
            image: 'https://images.unsplash.com/photo-1590333748338-d629e4564ad9?q=80&w=200&auto=format&fit=crop',
            slug: 'iim-new-wing'
        }
    },
    {
        id: 'pune',
        city: 'Pune',
        x: 32,
        y: 62,
        project: {
            name: 'Courtyard House',
            details: 'Terracotta Jaali Screens',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop',
            slug: 'courtyard-cafe'
        }
    },
    {
        id: 'hyderabad',
        city: 'Hyderabad',
        x: 45,
        y: 65,
        project: {
            name: 'Hillside Villa',
            details: 'Antique Grey Cladding',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=200&auto=format&fit=crop',
            slug: 'hillside-villa'
        }
    },
    {
        id: 'chennai',
        city: 'Chennai',
        x: 50,
        y: 80,
        project: {
            name: 'Coastal Retreat',
            details: 'Weather-proof Facade',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop',
            slug: 'coastal-retreat'
        }
    },
    {
        id: 'jaipur',
        city: 'Jaipur',
        x: 35,
        y: 35,
        project: {
            name: 'Heritage Hotel',
            details: 'Traditional Brickwork',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=200&auto=format&fit=crop',
            slug: 'heritage-hotel'
        }
    }
];

interface ProjectAtlasProps {
    projects?: Project[];
}

export default function ProjectAtlas({ projects = [] }: ProjectAtlasProps) {
    const [activeLocation, setActiveLocation] = useState<string | null>(null);

    // Merge static locations with dynamic project data
    const locationsWithData = LOCATIONS.map(loc => {
        const matchingProject = projects.find(p => p.slug === loc.project.slug);
        return {
            ...loc,
            project: {
                ...loc.project,
                image: matchingProject?.imageUrl || loc.project.image,
                name: matchingProject?.title || loc.project.name,
                // Use dynamic description if available, else fallback
                details: matchingProject?.description ? matchingProject.description.substring(0, 40) + '...' : loc.project.details
            }
        };
    });

    return (
        <section className="py-16 md:py-24 bg-[#2A1E16] text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">Project Atlas</span>
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                            Building India,<br />
                            <span className="text-white/50">One Brick at a Time.</span>
                        </h2>
                        <p className="text-white/60 text-lg max-w-md mb-8 leading-relaxed">
                            From the humid coasts of Chennai to the dry heat of Jaipur, our terracotta products are trusted by architects across the subcontinent for their durability and timeless appeal.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-3xl font-bold text-[var(--terracotta)] mb-1">50+</div>
                                <div className="text-sm text-white/40 uppercase tracking-wider">Cities Delivered</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[var(--terracotta)] mb-1">200+</div>
                                <div className="text-sm text-white/40 uppercase tracking-wider">Projects Completed</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full max-w-lg mx-auto"
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
                                {locationsWithData.map((loc, i) => (
                                    locationsWithData.slice(i + 1).map((target, j) => (
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

                            {/* Map Path - High Fidelity Simplified */}
                            <path
                                d="M225.5,38.5 L245.5,45.5 L265.5,35.5 L285.5,55.5 L275.5,75.5 L295.5,85.5 L325.5,85.5 L345.5,105.5 L335.5,125.5 L355.5,135.5 L345.5,155.5 L325.5,165.5 L315.5,185.5 L305.5,215.5 L295.5,245.5 L285.5,275.5 L275.5,305.5 L265.5,345.5 L245.5,395.5 L225.5,445.5 L205.5,495.5 L185.5,525.5 L165.5,505.5 L145.5,465.5 L125.5,425.5 L115.5,385.5 L105.5,345.5 L95.5,305.5 L85.5,265.5 L75.5,225.5 L85.5,195.5 L105.5,175.5 L95.5,155.5 L85.5,135.5 L105.5,115.5 L125.5,105.5 L135.5,85.5 L145.5,75.5 Z"
                                fill="url(#mapGradient)"
                                stroke="#5d4037"
                                strokeWidth="1"
                                className="opacity-90 hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Kashmir Top */}
                            <path d="M225.5,38.5 L210,20 L230,10 L250,15 L265.5,35.5 Z" fill="url(#mapGradient)" stroke="#5d4037" strokeWidth="1" />

                            {/* North East */}
                            <path d="M355.5,135.5 L380,130 L400,140 L390,160 L370,170 L345.5,155.5 Z" fill="url(#mapGradient)" stroke="#5d4037" strokeWidth="1" />

                        </svg>

                        {/* Hotspots */}
                        {locationsWithData.map((loc) => (
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
