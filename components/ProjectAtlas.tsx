'use client';

import React from 'react';
import { Project } from '@/lib/products';
import ProjectAtlasMapWrapper from './ProjectAtlasMapWrapper';
import { motion } from 'framer-motion';

interface ProjectAtlasProps {
    projects?: Project[];
}

export default function ProjectAtlas({ projects = [] }: ProjectAtlasProps) {
    return (
        <section className="relative py-8 md:py-32 bg-[var(--ink)] overflow-hidden">
            {/* Background Sophistication */}
            <div className="absolute inset-0 z-0">
                {/* Subtle Grainy Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
                
                {/* Deep Radial Glow for Focus */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-[rgba(180,90,60,0.08)] to-transparent pointer-events-none opacity-40 blur-3xl rounded-full"></div>
                
                {/* Side Gradients */}
                <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-black/20 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-center">
                    
                    {/* Left Side: Content Evolution */}
                    <div className="space-y-4 md:space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 md:gap-3 text-[var(--terracotta)] font-black tracking-[0.4em] uppercase text-[8px] md:text-[10px] mb-2 md:mb-8 drop-shadow-sm">
                                <span className="w-4 md:w-8 h-[1px] bg-[var(--terracotta)]/40"></span>
                                Atlas
                            </span>
                            
                            <h2 className="text-2xl md:text-7xl font-serif text-white leading-tight md:leading-[1.05] tracking-tight mb-3 md:mb-8">
                                Building India,<br />
                                <span className="text-white italic">One Brick </span>
                                <span className="text-white">at a Time.</span>
                            </h2>

                            <p className="text-white opacity-90 text-xs md:text-xl max-w-xl leading-relaxed font-light line-clamp-2 md:line-clamp-none">
                                Engineered for India's diverse micro-climates, trusted by elite architects across the subcontinent.
                            </p>
                        </motion.div>

                        {/* Interactive Stats Cards */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex md:grid md:grid-cols-2 gap-3 md:gap-6"
                        >
                            <div className="flex-1 group relative p-3 md:p-8 rounded-lg md:rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md transition-all duration-500">
                                <div className="text-xl md:text-5xl font-serif text-[var(--terracotta)] mb-0.5 md:mb-3">50+</div>
                                <div className="text-[8px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-medium font-sans">Cities</div>
                            </div>
                            
                            <div className="flex-1 group relative p-3 md:p-8 rounded-lg md:rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md transition-all duration-500">
                                <div className="text-xl md:text-5xl font-serif text-[var(--terracotta)] mb-0.5 md:mb-3">600+</div>
                                <div className="text-[8px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-medium font-sans">Projects</div>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="pt-1 flex items-center gap-3 md:gap-6 border-t border-white/5 md:border-t-0"
                        >
                            <div className="hidden md:flex -space-x-3 shrink-0">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[var(--ink)] bg-white/10 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=project-${i}`} alt="Architect Profile" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[7px] md:text-[10px] uppercase tracking-widest text-white/20 md:text-white/30 leading-snug">Trusted by over 150+ Leading Design Studios</span>
                        </motion.div>
                    </div>

                    {/* Right Side: Map Interactivity */}
                    <div className="relative mt-4 md:mt-0">
                        {/* Map Decorative Ring */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/[0.03] rounded-full pointer-events-none md:border-white/[0.05]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/[0.03] rounded-full pointer-events-none hidden md:block"></div>
                        
                        {/* Map Inner Glow */}
                        <div className="absolute inset-0 bg-radial-gradient from-[var(--terracotta)]/5 to-transparent blur-3xl pointer-events-none"></div>
                        
                        <div className="relative group transition-transform duration-700 hover:scale-[1.02]">
                             <ProjectAtlasMapWrapper projects={projects} />
                             
                             {/* Floating Map Intelligence Badges */}
                             <div className="absolute -top-8 -right-4 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full hidden md:flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Global Network Live</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
