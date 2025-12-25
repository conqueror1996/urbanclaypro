'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Labour {
    _id: string;
    name: string;
    trade: string;
    phone?: string;
    dailyRate?: number;
    status: string;
    currentSite?: { name: string };
    address?: string;
}

export default function LabourDashboard() {
    const [labours, setLabours] = useState<Labour[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLabour, setSelectedLabour] = useState<Labour | null>(null);

    const fetchLabours = async () => {
        setLoading(true);
        try {
            const query = `*[_type == "labour"] {
                _id, name, trade, phone, dailyRate, status,
                currentSite->{name}
            } | order(name asc)`;
            const data = await client.fetch(query);
            setLabours(data);
        } catch (error) {
            console.error('Error fetching labours:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabours();
    }, []);

    const filteredLabours = labours.filter(labour =>
        labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        labour.trade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Labour Force</h1>
                    <p className="text-gray-500 mt-1">Manage skilled workers and site assignments.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search labours..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] w-64 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLabours.map((labour) => (
                        <motion.div
                            key={labour._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedLabour(labour)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group"
                        >
                            <div className={`absolute top-0 right-0 w-2 h-full ${labour.status === 'available' ? 'bg-emerald-400' : 'bg-orange-400'
                                }`} />

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-inner group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                    👷
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--ink)]">{labour.name}</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{labour.trade}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Daily Rate:</span>
                                    <span className="font-mono font-bold text-[var(--ink)]">₹{labour.dailyRate || '--'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`capitalize font-medium ${labour.status === 'available' ? 'text-emerald-600' : 'text-orange-600'
                                        }`}>{labour.status.replace('_', ' ')}</span>
                                </div>
                                {labour.currentSite && (
                                    <div className="mt-4 p-2 bg-[var(--sand)]/50 rounded-lg text-xs text-[var(--ink)] flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        Currently at: <span className="font-bold">{labour.currentSite.name}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
