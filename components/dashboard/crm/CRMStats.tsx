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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#e9e2da]/40">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
            >
                <div className="flex items-center gap-2 text-[#8c7b70] mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Pipeline Value</span>
                </div>
                <h3 className="text-4xl font-serif text-[#2a1e16] tracking-tight">₹{stats.totalValue.toLocaleString('en-IN', { notation: 'compact', maximumFractionDigits: 1 })}</h3>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Live Valuation
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-1"
            >
                <div className="flex items-center gap-2 text-[#8c7b70] mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Active Deals</span>
                </div>
                <h3 className="text-4xl font-serif text-[#2a1e16] tracking-tight">{stats.hotLeads}</h3>
                <p className="text-xs text-[#8c7b70] font-medium">Serious Opportunities</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-1"
            >
                <div className="flex items-center gap-2 text-[#8c7b70] mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Action Required</span>
                </div>
                <h3 className="text-4xl font-serif text-[#2a1e16] tracking-tight">{stats.actionToday}</h3>
                <p className="text-xs text-sky-600 font-medium">Pending Follow-ups</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onViewDormant}
                className="space-y-1 cursor-pointer group"
            >
                <div className="flex items-center gap-2 text-[#8c7b70] mb-2 group-hover:text-amber-600 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Dormant</span>
                </div>
                <h3 className="text-4xl font-serif text-[#2a1e16] group-hover:text-amber-600 transition-colors tracking-tight">{stats.dormantCount}</h3>
                <p className="text-xs text-[#8c7b70] group-hover:text-amber-600/70 font-medium flex items-center gap-1">
                    Needs Revival <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
