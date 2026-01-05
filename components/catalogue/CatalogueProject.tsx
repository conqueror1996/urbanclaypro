import React from 'react';
import { Project } from '@/lib/types';

interface CatalogueProjectProps {
    project: Project;
    index: number;
}

export default function CatalogueProject({ project, index }: CatalogueProjectProps) {
    const pageNum = index.toString().padStart(3, '0');

    // Choose the best image (Main > Gallery[0] > Fallback)
    const displayImage = project.imageUrl || (project.gallery && project.gallery[0]);

    // Format Image URL for quality
    const finalImage = displayImage && displayImage.startsWith('http')
        ? (displayImage.includes('?') ? `${displayImage}&w=1800&q=90&auto=format` : `${displayImage}?w=1800&q=90&auto=format`)
        : '/images/menu-exposed.jpg';

    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] relative overflow-hidden flex flex-col font-sans">

            {/* FULL BLEED IMAGE (Top 70%) */}
            <div className="h-[75%] w-full relative bg-neutral-200 overflow-hidden">
                <img
                    src={finalImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for text readability if needed, though we put text below */}
            </div>

            {/* CONTENT (Bottom 30%) */}
            <div className="h-[25%] p-12 flex flex-col justify-between relative">
                {/* Background Texture for bottom part */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] mb-2">
                            Project Showcase
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif leading-[0.95] max-w-2xl mb-2">
                            {project.title}
                        </h2>
                        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                            {project.location} • {project.type}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-[10px] font-mono text-neutral-400 block mb-2">REF.{project.slug.slice(0, 3).toUpperCase()}-{pageNum}</span>
                    </div>
                </div>

                {/* Footer / Products Used */}
                <div className="relative z-10 pt-6 border-t border-black/10 flex items-end justify-between">
                    <div>
                        {project.productsUsed && project.productsUsed.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-400">Featured Products:</span>
                                <div className="flex gap-4">
                                    {project.productsUsed.map((p, i) => (
                                        <span key={i} className="text-sm font-serif border-b border-black/20 pb-0.5">
                                            {p.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="text-[200px] leading-[0] font-serif font-bold text-black/5 absolute -bottom-16 -right-8 pointer-events-none">
                        *
                    </span>
                </div>
            </div>
        </div>
    );
}
