'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AccessModal from './AccessModal';
import SampleModal from './SampleModal';

export default function Architects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    return (
        <section id="architects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
            <motion.div
                className="relative rounded-[2.5rem] bg-[#2A1E16] text-white overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#b45a3c] opacity-10 blur-[100px] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f4f1ee] opacity-5 blur-[80px] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 p-6 md:p-16 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-4 md:mb-6 border border-white/10">
                            Professional Resources
                        </span>
                        <h3 className="text-2xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
                            For Architects & <br className="hidden md:block" /> Designers
                        </h3>
                        <p className="text-sm md:text-lg text-white/70 mb-8 md:mb-10 leading-relaxed max-w-md mx-auto lg:mx-0">
                            Streamline your workflow with our comprehensive technical library. Download high-res textures, BIM objects, and detailed specification sheets.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-secondary border-none shadow-lg hover:shadow-xl w-full sm:w-auto py-3 md:py-4 text-sm md:text-base"
                            >
                                Access Technical Library
                            </button>
                            <motion.button
                                onClick={() => setIsSampleModalOpen(true)}
                                className="px-8 py-3 md:py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-medium backdrop-blur-sm w-full sm:w-auto text-sm md:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Order Sample Box
                            </motion.button>
                        </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative h-full min-h-[400px] bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-sm overflow-hidden group">
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>

                        {/* Floating Cards Container */}
                        <div className="absolute inset-0 flex items-center justify-center">

                            {/* Card 1: PDF (Back) */}
                            <motion.div
                                className="absolute w-48 h-64 bg-white rounded-xl shadow-2xl p-4 transform -rotate-12 -translate-x-16 translate-y-4 border border-gray-200"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                            >
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 mb-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="h-2 w-20 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 w-12 bg-gray-200 rounded mb-6"></div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                                    <div className="h-1.5 w-3/4 bg-gray-100 rounded"></div>
                                </div>
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400">PDF</div>
                            </motion.div>

                            {/* Card 2: DWG (Middle) */}
                            <motion.div
                                className="absolute w-48 h-64 bg-[#2A1E16] rounded-xl shadow-2xl p-4 transform rotate-6 translate-x-12 -translate-y-8 border border-white/10"
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                                </div>
                                <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                                <div className="h-2 w-16 bg-white/20 rounded mb-6"></div>
                                <div className="border border-white/10 rounded p-2 mb-2">
                                    <div className="grid grid-cols-2 gap-1">
                                        <div className="h-8 border border-white/10 rounded"></div>
                                        <div className="h-8 border border-white/10 rounded"></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-white/40">DWG</div>
                            </motion.div>

                            {/* Card 3: BIM (Front) */}
                            <motion.div
                                className="absolute w-48 h-64 bg-white rounded-xl shadow-2xl p-4 transform -rotate-3 z-10 border border-gray-200"
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            >
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <div className="h-2 w-28 bg-gray-800 rounded mb-2"></div>
                                <div className="h-2 w-16 bg-gray-300 rounded mb-6"></div>
                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 mb-2">
                                    <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400">BIM</div>
                            </motion.div>

                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#b45a3c] text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 whitespace-nowrap z-20"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="font-bold">500+</span> Assets Available
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <SampleModal isOpen={isSampleModalOpen} onClose={() => setIsSampleModalOpen(false)} />
        </section>
    );
}
