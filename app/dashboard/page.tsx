'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import TrafficPulse from '@/components/TrafficPulse';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total: 0,
        serious: 0,
        new: 0,
        converted: 0
    });
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all leads to update stats
                const query = `*[_type == "lead"] | order(submittedAt desc)`;
                const leads = await client.fetch(query);

                setStats({
                    total: leads.length,
                    serious: leads.filter((l: any) => l.isSerious).length,
                    new: leads.filter((l: any) => l.status === 'new').length,
                    converted: leads.filter((l: any) => l.status === 'converted').length,
                });

                setRecentLeads(leads.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-[var(--terracotta)]/10 text-[var(--terracotta)]';
            case 'contacted': return 'bg-orange-100/50 text-orange-700';
            case 'converted': return 'bg-emerald-50 text-emerald-700';
            case 'lost': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-20">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-[var(--ink)]">Overview</h2>
                    <p className="text-gray-500 mt-1">Welcome back, Admin. Here's your real-time performance.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.location.reload()} className="bg-[var(--terracotta)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-900/10 hover:bg-[#a85638] transition-colors">Refresh Data</button>
                </div>
            </div>

            {/* TRAFFIC FOOTPRINT SECTION */}
            <div className="mb-8">
                <TrafficPulse />
            </div>

            {/* REAL SALES STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 font-sans">Total Leads</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-4xl font-serif text-[var(--ink)]">{stats.total}</h3>
                        <span className="text-[var(--ink)] bg-gray-100 text-xs px-2 py-1 rounded-full font-bold">All Time</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 font-sans">Serious Clients</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-4xl font-serif text-[var(--ink)]">{stats.serious}</h3>
                        <span className="text-[var(--terracotta)] bg-[var(--terracotta)]/10 text-xs px-2 py-1 rounded-full font-bold">High Value</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 font-sans">Unread / New</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-4xl font-serif text-[var(--ink)]">{stats.new}</h3>
                        <span className="text-red-600 bg-red-50 text-xs px-2 py-1 rounded-full font-bold">Action Needed</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 font-sans">Deals Won</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-4xl font-serif text-[var(--ink)]">{stats.converted}</h3>
                        <span className="text-emerald-700 bg-emerald-50 text-xs px-2 py-1 rounded-full font-bold">Converted</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100/50 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h3 className="font-bold text-[var(--ink)] text-lg">Recent Inquiries</h3>
                        <p className="text-xs text-gray-400 mt-1">Latest activity from the website</p>
                    </div>
                    <Link href="/dashboard/leads" className="text-xs text-[var(--terracotta)] font-bold uppercase tracking-wider hover:underline">View All Leads</Link>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-gray-400 font-medium uppercase text-[10px] tracking-widest font-sans">
                        <tr>
                            <th className="px-8 py-4">Customer</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Interest</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentLeads.length > 0 ? (
                            recentLeads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4 font-bold text-[var(--ink)]">
                                        {lead.contact}
                                        {lead.isSerious && <span className="ml-2 text-xs">🔥</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{lead.role}</td>
                                    <td className="px-6 py-4 text-gray-500">{lead.product}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                                        {new Date(lead.submittedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">
                                    No leads found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
