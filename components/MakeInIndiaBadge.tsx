'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MakeInIndiaBadge() {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="fixed bottom-8 left-8 z-[90] hidden lg:flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-[var(--line)] py-3 px-6 rounded-full shadow-2xl group cursor-default"
        >
            <div className="relative w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--terracotta)] animate-[spin_10s_linear_infinity]">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
                </svg>
                <span className="absolute text-[8px] font-black">IN</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--ink)]">Make In India</span>
                <span className="text-[9px] font-medium text-[var(--ink)]/40 uppercase tracking-tighter">Specification Grade</span>
            </div>
            <div className="w-[1px] h-6 bg-[var(--line)] mx-1" />
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-green-700">A1 Fire Rated</span>
            </div>
        </motion.div>
    );
}
