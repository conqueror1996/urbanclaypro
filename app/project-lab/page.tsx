'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectLabInterface from '@/components/ProjectLab/ProjectLabInterface';

export default function ProjectLab() {
    return (
        <div className="min-h-screen bg-[var(--sand)] selection:bg-[var(--terracotta)] selection:text-white flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 md:px-8 py-24 w-full max-w-7xl mx-auto">
                <ProjectLabInterface />
            </main>

            <Footer />
        </div>
    );
}
