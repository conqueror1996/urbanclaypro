'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

interface Dispute {
    _id: string;
    title: string;
    priority: string;
    status: string;
    dateRaised: string;
    relatedTo?: { _type: string; name?: string; contact?: string; title?: string };
}

export default function DisputesDashboard() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDisputes = async () => {
        try {
            const query = `*[_type == "dispute"] {
                _id, title, priority, status, dateRaised,
                relatedTo->{_type, name, contact, title}
            } | order(dateRaised desc)`;
            const data = await client.fetch(query);
            setDisputes(data);
        } catch (error) {
            console.error('Error fetching disputes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-yellow-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Dispute Center</h1>
                    <p className="text-gray-500 mt-1">Resolution tracking for internal and external conflicts.</p>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest block text-center">Open Disputes</span>
                    <span className="text-2xl font-serif text-red-900 block text-center">{disputes.filter(d => d.status === 'open').length}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {disputes.map((d) => (
                        <div key={d._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                            <div className={`w-3 h-12 rounded-full ${getPriorityColor(d.priority)}`} />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-[var(--ink)]">{d.title}</h3>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono uppercase">#{d._id.slice(-4)}</span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Related to: <span className="text-gray-600 font-medium">
                                        {d.relatedTo?.name || d.relatedTo?.contact || d.relatedTo?.title || 'General'}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${d.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {d.status}
                                </span>
                                <p className="text-[10px] text-gray-300 uppercase tracking-widest">{new Date(d.dateRaised).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                    {disputes.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
                            No active disputes. Clear skies!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
