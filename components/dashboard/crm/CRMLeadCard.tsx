'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, MapPin, TrendingUp, MoreHorizontal, User, Calendar, Truck, Box, Mail } from 'lucide-react';

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={onClick}
            className={`group bg-white rounded-xl p-5 border-b border-[#e9e2da] last:border-0 hover:bg-[#FAF9F6] cursor-pointer transition-all flex flex-col md:flex-row items-center gap-6 ${isOverdue && lead.stage !== 'won' ? 'bg-rose-50/30' : ''
                }`}
        >
            {/* Avatar & Info */}
            <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="w-10 h-10 bg-[#2a1e16] rounded-full flex items-center justify-center text-white font-serif text-sm">
                    {lead.clientName?.charAt(0)}
                </div>
                <div className="min-w-0">
                    <h3 className="font-serif text-base text-[#2a1e16] font-medium truncate">
                        {lead.clientName}
                    </h3>
                    <p className="text-xs text-[#8c7b70] truncate">
                        {lead.company || 'Private Client'} {lead.location && `• ${lead.location}`}
                    </p>
                </div>
            </div>

            {/* Stage Badge */}
            <div className="w-full md:w-auto">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stageInfo?.color}`}>
                    {stageInfo?.label}
                </span>
            </div>

            {/* Financials - Minimal */}
            <div className="flex-1 text-right md:text-left">
                {lead.potentialValue > 0 ? (
                    <span className="font-mono text-sm text-[#2a1e16]">₹{lead.potentialValue.toLocaleString('en-IN')}</span>
                ) : (
                    <span className="text-xs text-gray-400 italic">No Value</span>
                )}
            </div>

            {/* Action / Date */}
            <div className="w-full md:w-auto flex justify-end items-center gap-2">
                <div className="text-right mr-2">
                    {lead.nextFollowUp ? (
                        <p className={`text-xs font-medium flex items-center justify-end gap-2 ${isOverdue && lead.stage !== 'won' ? 'text-rose-600' : 'text-[#8c7b70]'}`}>
                            {new Date(lead.nextFollowUp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            {isOverdue && lead.stage !== 'won' && <Clock className="w-3 h-3" />}
                        </p>
                    ) : (
                        <span className="text-xs text-gray-300">-</span>
                    )}
                </div>

                {lead.email && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${lead.email}`;
                        }}
                        className="w-8 h-8 rounded-full bg-white border border-[#e9e2da] hover:border-[#2a1e16] hover:bg-[#2a1e16] hover:text-white flex items-center justify-center transition-all text-[#8c7b70]"
                        title="Send Email"
                    >
                        <Mail className="w-3.5 h-3.5" />
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`, '_blank');
                    }}
                    className="w-8 h-8 rounded-full bg-white border border-[#e9e2da] hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all text-[#2a1e16]"
                    title="Open WhatsApp"
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}
