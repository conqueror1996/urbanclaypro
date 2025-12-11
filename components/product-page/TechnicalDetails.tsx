'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/products';
import { motion, AnimatePresence } from 'framer-motion';

interface TechnicalDetailsProps {
    product: Product;
}

export default function TechnicalDetails({ product }: TechnicalDetailsProps) {
    const [activeTab, setActiveTab] = useState('specs');

    const tabs = [
        { id: 'specs', label: 'Specifications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'install', label: 'Installation', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { id: 'care', label: 'Care', icon: 'M12 2a1 1 0 011 1v1.323l3.954 1.582a1 1 0 01.63 1.18l-.574 2.147a1 1 0 01-1.18.63L13 9.404V15a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5.596l-2.83 1.46a1 1 0 01-1.18-.63l-.574-2.148a1 1 0 01.63-1.18L10 5.323V3a1 1 0 011-1h1z' }
    ];

    return (
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#F0EBE6]">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                {/* HEADLINE */}
                <div className="md:w-1/3 space-y-8">
                    <div>
                        <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-3 block flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-[var(--terracotta)]"></span>
                            Technical Data
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif text-[#2A1E16] mb-4 leading-tight">Engineered for <br />Performance</h2>
                        <p className="text-[#9C8C74] text-sm leading-relaxed">
                            Our terracotta is fired at 1150°C to ensure maximum strength, low water absorption, and lifetime durability.
                        </p>
                    </div>

                    {/* Download Card */}
                    {product.resources?.technicalSheets && product.resources.technicalSheets[0] ? (
                        <a
                            href={product.resources.technicalSheets[0].fileUrl}
                            target="_blank"
                            className="block bg-[#FAF8F6] p-6 rounded-2xl border border-[#EBE5E0] hover:border-[var(--terracotta)] transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
                            </div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-[#EBE5E0] text-[var(--terracotta)]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2A1E16] text-sm mb-1">Detailed Spec Sheet</h4>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">PDF • 2.4 MB</p>
                                    <span className="text-xs font-bold text-[var(--terracotta)] underline decoration-2 underline-offset-4 group-hover:text-[#a85638]">Download Now</span>
                                </div>
                            </div>
                        </a>
                    ) : (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Spec Sheet Coming Soon</span>
                        </div>
                    )}
                </div>

                {/* TABS & CONTENT */}
                <div className="md:w-2/3">
                    <div
                        className="flex flex-wrap sm:flex-nowrap gap-2 bg-[#F5F2EF] p-1.5 rounded-xl mb-10 w-full sm:w-fit overflow-x-auto overscroll-x-contain"
                        data-lenis-prevent
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-white text-[#2A1E16] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className={`w-4 h-4 ${activeTab === tab.id ? 'text-[var(--terracotta)]' : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'specs' && (
                                <motion.div
                                    key="specs"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8"
                                >
                                    {Object.entries(product.specs || {}).map(([key, value]) => (
                                        <div key={key} className="flex flex-col border-b border-[#F0EBE6] pb-3 last:border-0 sm:last:border-0 last:pb-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[var(--terracotta)]/40"></span>
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <span className="font-serif text-lg text-[#2A1E16]">
                                                {typeof value === 'string' ? value : JSON.stringify(value)}
                                            </span>
                                        </div>
                                    ))}
                                    {(!product.specs || Object.keys(product.specs).length === 0) && (
                                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl">
                                            <p className="text-gray-400 italic">Technical data is being updated.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'install' && (
                                <motion.div
                                    key="install"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-[#FAF8F6] p-6 rounded-2xl border border-[#F0EBE6] flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white border border-[#EBE5E0] flex items-center justify-center font-bold text-[var(--terracotta)] shadow-sm shrink-0">1</div>
                                        <div>
                                            <h4 className="font-bold text-[#2A1E16] mb-1">Surface Prep</h4>
                                            <p className="text-sm text-[#5d554f]">Ensure substrate is dry, cured for 14+ days, and free from loose particles.</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#FAF8F6] p-6 rounded-2xl border border-[#F0EBE6] flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white border border-[#EBE5E0] flex items-center justify-center font-bold text-[var(--terracotta)] shadow-sm shrink-0">2</div>
                                        <div>
                                            <h4 className="font-bold text-[#2A1E16] mb-1">Adhesive Application</h4>
                                            <p className="text-sm text-[#5d554f]">Use C2TE/S1 grade polymer-modified adhesive with a 6mm notched trowel.</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#FAF8F6] p-6 rounded-2xl border border-[#F0EBE6] flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white border border-[#EBE5E0] flex items-center justify-center font-bold text-[var(--terracotta)] shadow-sm shrink-0">3</div>
                                        <div>
                                            <h4 className="font-bold text-[#2A1E16] mb-1">Grouting</h4>
                                            <p className="text-sm text-[#5d554f]">Wait 24 hours before grouting. maintain 5-10mm joints for optimal finish.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'care' && (
                                <motion.div
                                    key="care"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="grid sm:grid-cols-2 gap-6"
                                >
                                    <div className="bg-white border border-[#EBE5E0] p-6 rounded-2xl hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-full bg-[#E5F6FD] text-[#0284C7] flex items-center justify-center mb-4 text-xl">💧</div>
                                        <h4 className="font-bold text-[#2A1E16] mb-2">Cleaning</h4>
                                        <p className="text-sm text-[#5d554f]">Simple water wash is sufficient. Neutral pH detergents can be used for tough stains.</p>
                                    </div>
                                    <div className="bg-white border border-[#EBE5E0] p-6 rounded-2xl hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4 text-xl">🛡️</div>
                                        <h4 className="font-bold text-[#2A1E16] mb-2">Protection</h4>
                                        <p className="text-sm text-[#5d554f]">Apply a breathable hydrophobic sealer every 5-7 years for exterior facades.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
