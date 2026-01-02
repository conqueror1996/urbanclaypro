'use client';

import React from 'react';
import { Search, TrendingUp, Clock, UserPlus, Filter, X } from 'lucide-react';

interface CRMFiltersProps {
    viewMode: 'pipeline' | 'contacts' | 'dormant';
    setViewMode: (mode: 'pipeline' | 'contacts' | 'dormant') => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    stages: Array<{ label: string, value: string }>;
    leads: any[];
}

export function CRMFilters({
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    stages,
    leads
}: CRMFiltersProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* View Switcher - More Professional Pills */}
                <div className="flex bg-white p-1 rounded-2xl border border-[#e9e2da]/50 shadow-sm w-full md:w-auto">
                    {[
                        { id: 'pipeline', label: 'Deal Pipeline', icon: TrendingUp },
                        { id: 'dormant', label: 'The Graveyard', icon: Clock },
                        { id: 'contacts', label: 'Global Contacts', icon: UserPlus },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex-1 md:flex-none ${viewMode === mode.id
                                    ? 'bg-[#2a1e16] text-white shadow-lg'
                                    : 'text-[#8c7b70] hover:text-[#2a1e16] hover:bg-[#FAF9F6]'
                                }`}
                        >
                            <mode.icon className="w-3.5 h-3.5" />
                            {mode.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-96 shadow-sm">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7b70] group-focus-within:text-[#b45a3c] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search leads, companies or files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-12 py-3.5 bg-white border border-[#e9e2da]/50 rounded-2xl outline-none focus:border-[#b45a3c]/30 focus:ring-4 focus:ring-[#b45a3c]/5 transition-all text-sm font-medium"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-3 h-3 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Stage Tabs - Only for Pipeline/Dormant */}
            {(viewMode === 'pipeline' || viewMode === 'dormant') && (
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === 'all'
                                ? 'bg-white border-[#2a1e16] text-[#2a1e16] shadow-sm'
                                : 'bg-transparent border-transparent text-[#8c7b70] hover:bg-white/50'
                            }`}
                    >
                        Global Pool
                        <span className="ml-2 opacity-50">({leads.length})</span>
                    </button>

                    <div className="w-px h-6 bg-[#e9e2da] mx-2 hidden md:block" />

                    {stages.map(stage => (
                        <button
                            key={stage.value}
                            onClick={() => setActiveTab(stage.value)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === stage.value
                                    ? 'bg-white border-[#2a1e16] text-[#2a1e16] shadow-sm'
                                    : 'bg-transparent border-transparent text-[#8c7b70] hover:bg-white/50'
                                }`}
                        >
                            {stage.label}
                            <span className="ml-2 font-mono opacity-50">
                                {leads.filter(l => l.stage === stage.value).length}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
