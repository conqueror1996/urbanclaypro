'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SuperBuildBanner() {
    return (
        <section className="w-full bg-[#f4f1ee] text-[#2A1E16] py-24 px-4 border-t border-[var(--line)]">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Subtle Label */}
                    <span className="text-[#7a6f66] text-xs font-bold tracking-[0.2em] uppercase mb-6 block">
                        A Trusted Partner by UrbanClay
                    </span>

                    {/* Strong Headline */}
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-10 text-[#2A1E16]">
                        SuperBuild – Premium Project Execution
                    </h2>

                    {/* Benefit Points */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12 text-left md:text-center max-w-4xl mx-auto">
                        <div className="flex flex-col md:items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-[#e0d8cf] flex items-center justify-center mb-4 text-[var(--terracotta)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Turnkey Construction</h3>
                            <p className="text-sm text-[#5d554f]">End-to-end management from design to handover.</p>
                        </div>
                        <div className="flex flex-col md:items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-[#e0d8cf] flex items-center justify-center mb-4 text-[var(--terracotta)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Material Expertise</h3>
                            <p className="text-sm text-[#5d554f]">Specialized in handling premium clay and natural materials.</p>
                        </div>
                        <div className="flex flex-col md:items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-[#e0d8cf] flex items-center justify-center mb-4 text-[var(--terracotta)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">On-Time Delivery</h3>
                            <p className="text-sm text-[#5d554f]">Strict adherence to project timelines and milestones.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.a
                        href="https://superbuildindia.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#2A1E16] text-[#2A1E16] font-medium hover:bg-[#2A1E16] hover:text-white transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Explore SuperBuild
                        <span className="text-lg">→</span>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
