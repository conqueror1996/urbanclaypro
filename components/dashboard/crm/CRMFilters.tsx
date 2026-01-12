'use client';

import React from 'react';
import { Search, TrendingUp, Clock, UserPlus, Filter, X } from 'lucide-react';

interface CRMFiltersProps {
    viewMode: 'pipeline' | 'kanban' | 'contacts' | 'dormant' | 'priority';
    setViewMode: (mode: 'pipeline' | 'kanban' | 'contacts' | 'dormant' | 'priority') => void;
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
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                {/* View Switcher - Text Tabs */}
                <div className="flex items-center gap-6 border-b border-[#e9e2da] w-full md:w-auto pb-px">
                    {[
                        { id: 'kanban', label: 'Board', icon: Filter },
                        { id: 'pipeline', label: 'List', icon: TrendingUp },
                        { id: 'contacts', label: 'Contacts', icon: UserPlus },
                        { id: 'dormant', label: 'Archive', icon: Clock },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id as any)}
                            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold uppercase tracking-wider transition-all relative ${viewMode === mode.id
                                ? 'text-[#2a1e16]'
                                : 'text-[#8c7b70] hover:text-[#2a1e16]'
                                }`}
                        >
                            <mode.icon className="w-3.5 h-3.5" />
                            {mode.label}
                            {viewMode === mode.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b45a3c]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Search Bar - Minimalist */}
                <div className="relative group w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-[#8c7b70] group-focus-within:text-[#2a1e16] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 bg-transparent border-b border-[#e9e2da] outline-none focus:border-[#2a1e16] transition-all text-sm font-medium placeholder-[#8c7b70]/50"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-3 h-3 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Stage Tabs - Clean Pills */}
            {(viewMode === 'pipeline' || viewMode === 'dormant') && (
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === 'all'
                            ? 'bg-[#2a1e16] text-white border-[#2a1e16]'
                            : 'bg-transparent border-[#e9e2da] text-[#8c7b70] hover:border-[#8c7b70]'
                            }`}
                    >
                        All Leads
                    </button>

                    <div className="w-px h-4 bg-[#e9e2da] mx-2" />

                    {stages.map(stage => (
                        <button
                            key={stage.value}
                            onClick={() => setActiveTab(stage.value)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === stage.value
                                ? 'bg-[#2a1e16] text-white border-[#2a1e16]'
                                : 'bg-transparent border-[#e9e2da] text-[#8c7b70] hover:border-[#8c7b70]'
                                }`}
                        >
                            {stage.label}
                            <span className={`ml-2 font-mono opacity-60 ${activeTab === stage.value ? 'text-white' : ''}`}>
                                {leads.filter(l => l.stage === stage.value).length}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
