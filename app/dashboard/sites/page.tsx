'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

interface Site {
    _id: string;
    name: string;
    client: string;
    location: string;
    status: string;
    startDate: string;
    expectedCompletion: string;
}

export default function SitesDashboard() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSites = async () => {
        try {
            const query = `*[_type == "site"] | order(startDate desc)`;
            const data = await client.fetch(query);
            setSites(data);
        } catch (error) {
            console.error('Error fetching sites:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSites();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'paused': return 'bg-orange-50 text-orange-600 border-orange-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[var(--ink)]">Ongoing Sites</h1>
                <p className="text-gray-500 mt-1">Track site progress and resource allocation.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {sites.map((site) => (
                        <div key={site._id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-[var(--ink)]">{site.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(site.status)}`}>
                                        {site.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Client</label>
                                        <p className="font-medium text-[var(--ink)]">{site.client || '--'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Location</label>
                                        <p className="font-medium text-[var(--ink)]">{site.location || '--'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Timeline</label>
                                        <p className="text-xs text-gray-500">
                                            {site.startDate ? new Date(site.startDate).toLocaleDateString() : '??'} → {site.expectedCompletion ? new Date(site.expectedCompletion).toLocaleDateString() : '??'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center md:border-l md:pl-6">
                                <button className="px-6 py-2 bg-[var(--terracotta)] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 transition-all active:scale-95">
                                    Site Audit
                                </button>
                            </div>
                        </div>
                    ))}
                    {sites.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
                            No ongoing sites found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
