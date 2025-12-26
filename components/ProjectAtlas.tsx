import React from 'react';
import { Project } from '@/lib/products';
import ProjectAtlasMapWrapper from './ProjectAtlasMapWrapper';

interface ProjectAtlasProps {
    projects?: Project[];
}

export default function ProjectAtlas({ projects = [] }: ProjectAtlasProps) {
    return (
        <section className="py-10 md:py-24 bg-[#2A1E16] text-white overflow-hidden relative">
            {/* Background Texture - Static CSS is cheaper than JS */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Text Content - Rendered Server Side for SEO */}
                    <div>
                        <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-2 block animate-fade-in-up">Project Atlas</span>
                        <h2 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight animate-fade-in-up delay-100">
                            Building India,<br />
                            <span className="text-white/50">One Brick at a Time.</span>
                        </h2>
                        <p className="text-white/60 text-base md:text-lg max-w-md mb-6 md:mb-8 leading-relaxed animate-fade-in-up delay-200">
                            From the humid coasts of Chennai to the dry heat of Jaipur, our terracotta products are trusted by architects across the subcontinent for their durability and timeless appeal.
                        </p>

                        <div className="grid grid-cols-2 gap-6 md:gap-8 mb-8 lg:mb-0 animate-fade-in-up delay-300">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[var(--terracotta)] mb-1">50+</div>
                                <div className="text-xs md:text-sm text-white/40 uppercase tracking-wider">Cities Delivered</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[var(--terracotta)] mb-1">200+</div>
                                <div className="text-xs md:text-sm text-white/40 uppercase tracking-wider">Projects Completed</div>
                            </div>
                        </div>
                    </div>

                    {/* Map Container - Lazy Loaded */}
                    <ProjectAtlasMapWrapper projects={projects} />
                </div>
            </div>
        </section>
    );
}
