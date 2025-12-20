'use client';

import React from 'react';

interface LuxuryFilterProps {
    tabs: Array<{ name: string }>;
    activeTab: string;
    onTabChange: (tabName: string) => void;
}

export default function LuxuryFilter({ tabs, activeTab, onTabChange }: LuxuryFilterProps) {
    return (
        <div className="mb-16 md:mb-24">
            {/* Desktop: Invisible Elegance */}
            <div className="hidden md:block">
                <div className="max-w-5xl mx-auto">
                    {/* Minimal Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-[1px] bg-[var(--terracotta)]"></div>
                            <h3 className="text-xs font-light uppercase tracking-[0.3em] text-[#2A1E16]/40">
                                Refine
                            </h3>
                        </div>
                        <button className="text-xs font-light text-[var(--terracotta)] hover:text-[#a85638] transition-colors tracking-wider">
                            Clear All
                        </button>
                    </div>

                    {/* Pill-Style Filters */}
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Category Pills */}
                        <div className="flex items-center gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => onTabChange(tab.name)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-light tracking-wide transition-all duration-300 ${activeTab === tab.name
                                            ? 'bg-[#2A1E16] text-white shadow-lg'
                                            : 'bg-white text-[#2A1E16]/60 hover:text-[#2A1E16] hover:shadow-md border border-[#e9e2da]'
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-8 bg-[#e9e2da]"></div>

                        {/* Series Filter */}
                        <div className="relative group">
                            <button className="px-5 py-2.5 rounded-full text-sm font-light tracking-wide text-[#2A1E16]/60 hover:text-[#2A1E16] bg-white border border-[#e9e2da] hover:border-[var(--terracotta)]/30 hover:shadow-md transition-all duration-300 flex items-center gap-2">
                                <span>Series</span>
                                <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Color Filter */}
                        <div className="relative group">
                            <button className="px-5 py-2.5 rounded-full text-sm font-light tracking-wide text-[#2A1E16]/60 hover:text-[#2A1E16] bg-white border border-[#e9e2da] hover:border-[var(--terracotta)]/30 hover:shadow-md transition-all duration-300 flex items-center gap-2">
                                <span>Color</span>
                                <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Budget Filter */}
                        <div className="relative group">
                            <button className="px-5 py-2.5 rounded-full text-sm font-light tracking-wide text-[#2A1E16]/60 hover:text-[#2A1E16] bg-white border border-[#e9e2da] hover:border-[var(--terracotta)]/30 hover:shadow-md transition-all duration-300 flex items-center gap-2">
                                <span>Budget</span>
                                <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Indicator */}
                    <div className="mt-6 flex items-center gap-2">
                        <span className="text-xs font-light text-[#2A1E16]/30 tracking-wider">Showing:</span>
                        <span className="text-xs font-light text-[var(--terracotta)] tracking-wider">{activeTab}</span>
                    </div>
                </div>
            </div>

            {/* Mobile: Clean & Minimal */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-light uppercase tracking-[0.25em] text-[#2A1E16]/40">
                        Filter
                    </h3>
                    <button className="text-xs font-light text-[var(--terracotta)] tracking-wider">
                        Clear
                    </button>
                </div>

                {/* Category Tabs - Mobile */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => onTabChange(tab.name)}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-light tracking-wide transition-all ${activeTab === tab.name
                                    ? 'bg-[#2A1E16] text-white'
                                    : 'bg-white text-[#2A1E16]/60 border border-[#e9e2da]'
                                }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Other Filters - Mobile */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="px-3 py-2.5 rounded-lg text-xs font-light text-[#2A1E16]/60 bg-white border border-[#e9e2da] text-center">
                        Series
                    </button>
                    <button className="px-3 py-2.5 rounded-lg text-xs font-light text-[#2A1E16]/60 bg-white border border-[#e9e2da] text-center">
                        Color
                    </button>
                    <button className="px-3 py-2.5 rounded-lg text-xs font-light text-[#2A1E16]/60 bg-white border border-[#e9e2da] text-center">
                        Budget
                    </button>
                </div>
            </div>
        </div>
    );
}
