'use client';

import React, { useState } from 'react';
import LeadScraper from '@/components/dashboard/campaigns/LeadScraper';
import LeadManager from '@/components/dashboard/campaigns/LeadManager';
import EmailComposer from '@/components/dashboard/campaigns/EmailComposer';
import CampaignReports from '@/components/dashboard/campaigns/CampaignReports';

export default function CampaignsPage() {
    const [activeTab, setActiveTab] = useState<'leads' | 'scrape' | 'email' | 'reports'>('leads');
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-[var(--ink)]">Email Campaigns</h2>
                    <p className="text-gray-500 mt-1">Acquire, Manage, and Market to Architects.</p>
                </div>
                {/* Tabs */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab('scrape')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'scrape' ? 'bg-[var(--ink)] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Find Leads
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-[var(--ink)] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Manage Database
                    </button>
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'email' ? 'bg-[var(--ink)] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Compose Email
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-2"></div>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-[var(--ink)] text-white shadow-md' : 'text-[var(--terracotta)] bg-orange-50 hover:bg-orange-100'}`}
                    >
                        Sent & Analytics
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {activeTab === 'scrape' && (
                    <LeadScraper onLeadsAdded={() => setActiveTab('leads')} />
                )}

                {activeTab === 'leads' && (
                    <LeadManager
                        onCompose={(leads) => {
                            setSelectedLeads(leads);
                            setActiveTab('email');
                        }}
                    />
                )}

                {activeTab === 'email' && (
                    <EmailComposer initialRecipients={selectedLeads} />
                )}

                {activeTab === 'reports' && (
                    <CampaignReports />
                )}
            </div>
        </div>
    );
}
