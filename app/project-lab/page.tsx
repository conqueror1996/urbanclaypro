'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectLabInterface from '@/components/ProjectLab/ProjectLabInterface';

export default function ProjectLab() {
    return (
        <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)] selection:bg-[var(--terracotta)] selection:text-white">
            <Header />

            <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-[90vh]">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ink)]/10 bg-white/50 backdrop-blur-sm mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase opacity-70">Lab Live v1.0</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
                        Project Lab <span className="text-[var(--terracotta)]">AI</span>
                    </h1>
                    <p className="text-lg text-[var(--ink)]/60 max-w-2xl mx-auto">
                        Upload your site context or inspiration. Our AI will analyze structural needs, suggest optimized material palettes, and generate a feasibility report.
                    </p>
                </div>

                <ProjectLabInterface />
            </main>

            <Footer />
        </div>
    );
}
