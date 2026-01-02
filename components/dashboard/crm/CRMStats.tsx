'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Clock, DollarSign, Users, Target } from 'lucide-react';

interface CRMStatsProps {
    stats: {
        totalValue: number;
        hotLeads: number;
        actionToday: number;
        dormantCount: number;
    };
    onViewDormant: () => void;
}

export function CRMStats({ stats, onViewDormant }: CRMStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-[#e9e2da]/50 shadow-sm group hover:border-[#b45a3c]/30 transition-all"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest">Pipeline Value</p>
                </div>
                <h3 className="text-3xl font-serif text-[#2a1e16]">₹{stats.totalValue.toLocaleString('en-IN')}</h3>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                    <TrendingUp className="w-3 h-3" />
                    Live Valuation
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#2a1e16] p-6 rounded-2xl shadow-xl shadow-black/10 group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-xl text-orange-400 group-hover:rotate-12 transition-transform">
                            <Target className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">High Velocity</p>
                    </div>
                    <h3 className="text-3xl font-serif text-white">{stats.hotLeads}</h3>
                    <p className="mt-2 text-[10px] text-white/40 font-bold uppercase tracking-wider">Serious Opportunities</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-[#e9e2da]/50 shadow-sm group hover:border-[#b45a3c]/30 transition-all"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-sky-50 rounded-xl text-sky-600 group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest">Agenda: Today</p>
                </div>
                <h3 className="text-3xl font-serif text-[#2a1e16]">{stats.actionToday}</h3>
                <p className="mt-2 text-[10px] text-sky-600 font-bold uppercase tracking-wider">Follow-ups Pending</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onViewDormant}
                className="bg-white p-6 rounded-2xl border border-[#e9e2da]/50 shadow-sm group hover:border-amber-400/50 cursor-pointer hover:shadow-lg transition-all"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:animate-pulse">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest">Dormant Assets</p>
                </div>
                <h3 className="text-3xl font-serif text-[#2a1e16]">{stats.dormantCount}</h3>
                <p className="mt-2 text-[10px] text-amber-600 font-bold uppercase tracking-wider underline flex items-center gap-2">
                    Revival Needed <ArrowRight className="w-3 h-3" />
                </p>
            </motion.div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}
