'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterState } from '@/hooks/useProductFilter';

interface FilterBarProps {
    filters: FilterState;
    options: {
        colors: string[];
        applications: string[];
        series: string[];
        sizes: string[];
    };
    actions: {
        setCategory: (c: string) => void;
        toggleColor: (c: string) => void;
        toggleApplication: (a: string) => void;
        setSeries: (s: string | null) => void;
        setSize: (s: string | null) => void;
        setSearchTerm: (t: string) => void;
    };
    categories: string[];
    productCount: number;
}

// Visual mapping for colors
const COLOR_MAP: Record<string, string> = {
    'Red': '#b45a3c',
    'Beige': '#e6d5c9',
    'Grey': '#8d8d8d',
    'Black': '#2A1E16',
    'White': '#ffffff',
    'Terracotta': '#C17A5F',
    'Brown': '#5d554f',
    'Antique': '#a89f91',
    'Multicolor': 'linear-gradient(135deg, #b45a3c 0%, #2A1E16 100%)'
};

export default function FilterBar({ filters, options, actions, categories, productCount }: FilterBarProps) {

    // Derived: Normalize options for better display
    const visibleApplications = options.applications.slice(0, 5); // Show top 5, rest in dropdown if needed

    return (
        <div className="mb-12 sticky top-20 z-30 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:backdrop-blur-none transition-all">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. CATEGORY TABS (The Context) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 gap-2">
                        <button
                            onClick={() => actions.setCategory('All')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                ${filters.category === 'All'
                                    ? 'bg-[#2A1E16] text-white shadow-lg'
                                    : 'bg-white text-[#2A1E16]/60 border border-[#line] hover:border-[#2A1E16]'}`}
                        >
                            All Materials
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => actions.setCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0
                                    ${filters.category === cat
                                        ? 'bg-[#2A1E16] text-white shadow-lg transform scale-105'
                                        : 'bg-white text-[#2A1E16]/60 border border-[#line] hover:border-[#2A1E16] hover:text-[#2A1E16]'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Results Count (Desktop) */}
                    <div className="hidden md:block text-xs font-bold uppercase tracking-widest text-[#2A1E16]/40">
                        {productCount} Result{productCount !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* 2. THE WORKBENCH (Smart Filters) */}
                {/* Only visible if standard categories are selected, or always? Always is better for power users. */}
                <div className="border-t border-b border-[var(--line)]/50 py-5 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 animate-fade-in">

                    {/* A. Tone Selector */}
                    {options.colors.length > 0 && (
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C8C74] block">Tone</span>
                            <div className="flex flex-wrap gap-2">
                                {options.colors.map(color => {
                                    // fuzzy match color map
                                    const bgStyle = Object.entries(COLOR_MAP).find(([k, v]) => color.toLowerCase().includes(k.toLowerCase()))?.[1] || color;
                                    const isSelected = filters.colors.includes(color);

                                    return (
                                        <button
                                            key={color}
                                            onClick={() => actions.toggleColor(color)}
                                            className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-all relative group
                                                ${isSelected ? 'ring-2 ring-[var(--terracotta)] ring-offset-2 scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'}
                                            `}
                                            style={{ background: bgStyle }}
                                            title={color}
                                            aria-label={`Select ${color}`}
                                        >
                                            {isSelected && (
                                                <motion.svg
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                    className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </motion.svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* B. Application Chips */}
                    {options.applications.length > 0 && (
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C8C74] block">Application</span>
                            <div className="flex flex-wrap gap-2">
                                {visibleApplications.map(app => {
                                    const isSelected = filters.applications.includes(app);
                                    return (
                                        <button
                                            key={app}
                                            onClick={() => actions.toggleApplication(app)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                                                ${isSelected
                                                    ? 'bg-[#2A1E16] text-white border-[#2A1E16] shadow-md'
                                                    : 'bg-transparent text-[#5d554f] border-[#EBE5E0] hover:border-[#2A1E16]'}`}
                                        >
                                            {app}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* C. Progressive Dropdowns (Series / Size) */}
                    {(options.series.length > 0 || options.sizes.length > 0) && (
                        <div className="space-y-3 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C8C74] block">Refine</span>
                            <div className="flex flex-wrap gap-3">
                                {/* Series */}
                                {options.series.length > 0 && (
                                    <div className="relative group">
                                        <select
                                            value={filters.series || ''}
                                            onChange={(e) => actions.setSeries(e.target.value || null)}
                                            className="appearance-none pl-4 pr-10 py-1.5 bg-transparent border-b border-[#EBE5E0] text-sm font-serif text-[#2A1E16] focus:outline-none focus:border-[var(--terracotta)] hover:border-[#2A1E16] transition-colors cursor-pointer min-w-[120px]"
                                        >
                                            <option value="">All Collections</option>
                                            {options.series.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <svg className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                )}

                                {/* Size */}
                                {options.sizes.length > 0 && (
                                    <div className="relative group">
                                        <select
                                            value={filters.size || ''}
                                            onChange={(e) => actions.setSize(e.target.value || null)}
                                            className="appearance-none pl-4 pr-10 py-1.5 bg-transparent border-b border-[#EBE5E0] text-sm font-serif text-[#2A1E16] focus:outline-none focus:border-[var(--terracotta)] hover:border-[#2A1E16] transition-colors cursor-pointer min-w-[120px]"
                                        >
                                            <option value="">Any Size</option>
                                            {options.sizes.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <svg className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Filters Summary (Chips to remove) */}
                {(filters.colors.length > 0 || filters.applications.length > 0 || filters.series || filters.size) && (
                    <div className="flex gap-2 flex-wrap items-center animate-fade-in-up">
                        <span className="text-xs text-gray-400 mr-2">Calculated:</span>

                        {filters.colors.map(c => (
                            <button key={c} onClick={() => actions.toggleColor(c)} className="flex items-center text-[10px] uppercase font-bold bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                {c} <span className="ml-1 text-gray-400">×</span>
                            </button>
                        ))}
                        {filters.applications.map(a => (
                            <button key={a} onClick={() => actions.toggleApplication(a)} className="flex items-center text-[10px] uppercase font-bold bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                {a} <span className="ml-1 text-gray-400">×</span>
                            </button>
                        ))}
                        {filters.series && (
                            <button onClick={() => actions.setSeries(null)} className="flex items-center text-[10px] uppercase font-bold bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                {filters.series} <span className="ml-1 text-gray-400">×</span>
                            </button>
                        )}
                        {filters.size && (
                            <button onClick={() => actions.setSize(null)} className="flex items-center text-[10px] uppercase font-bold bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                                {filters.size} <span className="ml-1 text-gray-400">×</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
