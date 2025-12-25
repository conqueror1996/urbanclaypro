'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our Audit Data
interface AuditItem {
    id: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'Content' | 'Technical' | 'Backlinks' | 'UX';
    page: string;
    issue: string;
    action: string;
    status: 'pending' | 'in-progress' | 'resolved';
}

const MOCK_AUDIT_DATA: AuditItem[] = [
    {
        id: '1',
        priority: 'high',
        category: 'Content',
        page: 'Home Page',
        issue: 'Low Keyword Density',
        action: 'Add 300-word intro text referencing "Terracotta Tiles India".',
        status: 'pending'
    },
    {
        id: '2',
        priority: 'medium',
        category: 'Technical',
        page: '/projects',
        issue: 'H1 Tag Hierarchy',
        action: 'Change H1 to "Architectural Projects" instead of dynamic project title.',
        status: 'pending'
    },
    {
        id: '3',
        priority: 'high',
        category: 'Content',
        page: '/mumbai',
        issue: 'Duplicate Content Risk',
        action: 'Rewrite hero description to be 100% unique for Mumbai region.',
        status: 'in-progress'
    },
    {
        id: '4',
        priority: 'critical',
        category: 'Backlinks',
        page: 'Global',
        issue: 'Low Domain Authority',
        action: 'Start outreach campaign to Interior Design Blogs.',
        status: 'pending'
    },
    {
        id: '5',
        priority: 'high',
        category: 'Technical',
        page: '/guide',
        issue: 'Content Not Indexable',
        action: 'Add hidden HTML text summary for "Selection Guide" animation.',
        status: 'pending'
    }
];

export default function SeoAuditWidget() {
    const [items, setItems] = useState(MOCK_AUDIT_DATA);
    const [filter, setFilter] = useState('all');

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    const resolveItem = (id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item));
    };

    const activeItems = items.filter(i => i.status !== 'resolved');
    const resolvedCount = items.length - activeItems.length;
    const progress = Math.round((resolvedCount / items.length) * 100);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col h-[540px]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div>
                    <h3 className="font-serif text-[var(--ink)] text-lg flex items-center gap-2">
                        <span>SEO Auditor</span>
                        {activeItems.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                {activeItems.length} Issues
                            </span>
                        )}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Live recommendations engine</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{progress}% Fixed</span>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-2">
                <AnimatePresence>
                    {activeItems.length > 0 ? (
                        activeItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getPriorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-500 border border-gray-100 px-2 py-0.5 rounded">
                                            {item.category}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => resolveItem(item.id)}
                                        className="text-gray-300 hover:text-emerald-500 transition-colors"
                                        title="Mark as Resolved"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                </div>
                                <h4 className="font-bold text-[var(--ink)] text-sm mb-1">{item.issue}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                    <span className="font-semibold text-gray-400">Page: {item.page}</span> — {item.action}
                                </p>
                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={item.page.startsWith('/') ? item.page : '/'} target="_blank" className="text-[10px] font-bold text-[var(--terracotta)] uppercase tracking-wider hover:underline flex items-center gap-1">
                                        Inspect Page
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900">All Optimized!</h4>
                            <p className="text-xs text-gray-500 mt-1">Your site is in peak SEO condition.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <Link href="/dashboard/seo" className="w-full py-2 bg-[var(--ink)] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Open Full SEO Suite
                </Link>
            </div>
        </div>
    );
}
