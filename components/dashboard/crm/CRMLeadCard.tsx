'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, MapPin, TrendingUp, MoreHorizontal, User } from 'lucide-react';

interface CRMLeadCardProps {
    lead: any;
    onClick: () => void;
    isOverdue: boolean;
    getDealHealth: (date: string) => { label: string, color: string, bg: string };
    stages: any[];
}

export function CRMLeadCard({ lead, onClick, isOverdue, getDealHealth, stages }: CRMLeadCardProps) {
    const health = getDealHealth(lead.lastContactDate);
    const stageInfo = stages.find(s => s.value === (lead.stage || 'new'));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={onClick}
            className={`group bg-white rounded-3xl p-6 border transition-all hover:shadow-2xl hover:shadow-black/[0.03] cursor-pointer relative overflow-hidden flex flex-col md:flex-row items-center gap-8 ${isOverdue && lead.stage !== 'won' ? 'border-rose-100 bg-rose-50/10' : 'border-[#e9e2da]/60'
                }`}
        >
            {/* Status Indicator Strip */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 ${stageInfo?.color.split(' ')[0] || 'bg-gray-100'}`} />

            {/* Avatar & Health */}
            <div className="flex items-center gap-5 w-full md:w-1/3">
                <div className="relative shrink-0">
                    <div className="w-14 h-14 bg-[#2a1e16] rounded-2xl flex items-center justify-center text-white font-serif text-xl shadow-lg ring-4 ring-white transition-transform group-hover:scale-105">
                        {lead.clientName?.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-white shadow-sm flex items-center justify-center ${health.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${health.color.replace('text-', 'bg-')}`} />
                    </div>
                </div>
                <div className="min-w-0">
                    <h3 className="font-serif text-lg text-[#2a1e16] font-medium truncate group-hover:text-[#b45a3c] transition-colors">
                        {lead.clientName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#8c7b70] font-bold uppercase tracking-wider">
                        <span className="truncate">{lead.company || 'Direct Client'}</span>
                        <span className="text-gray-300">•</span>
                        <span>{health.label}</span>
                    </div>
                </div>
            </div>

            {/* Financials & Progress */}
            <div className="flex-1 grid grid-cols-2 gap-10 w-full md:w-auto px-6 border-l border-[#e9e2da]/40">
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest">Est. Valuation</p>
                    <p className="font-serif text-lg text-[#2a1e16] font-medium">₹{lead.potentialValue?.toLocaleString('en-IN') || 'TBD'}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest">Active Stage</p>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest border inline-block ${stageInfo?.color}`}>
                        {stageInfo?.label}
                    </span>
                </div>
            </div>

            {/* Milestones & Actions */}
            <div className="flex-1 flex items-center justify-between w-full md:w-auto pl-6 border-l border-[#e9e2da]/40">
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest">Context Milestone</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        {lead.nextFollowUp ? (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isOverdue && lead.stage !== 'won' ? 'bg-rose-100 text-rose-700' : 'bg-[#FAF9F6] text-[#2a1e16]'
                                }`}>
                                <Clock className="w-3 h-3" />
                                {new Date(lead.nextFollowUp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </div>
                        ) : (
                            <span className="text-[10px] text-gray-300 italic">No pending follow-ups</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`, '_blank');
                        }}
                        className="w-10 h-10 bg-[#FAF9F6] hover:bg-[#b45a3c] hover:text-white text-[#2a1e16] rounded-xl flex items-center justify-center transition-all border border-[#e9e2da]/40"
                    >
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 bg-[#FAF9F6] text-[#8c7b70] rounded-xl flex items-center justify-center hover:bg-[#2a1e16] hover:text-white transition-all border border-[#e9e2da]/40">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
