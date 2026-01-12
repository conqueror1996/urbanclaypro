'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getDashboardData } from '@/app/actions/dashboard-data';
import Link from 'next/link';
import { Plus, Link as LinkIcon, PenTool, Activity, RefreshCw } from 'lucide-react';
import TrafficPulse from '@/components/TrafficPulse';
import MetadataHealthWidget from '@/components/dashboard/MetadataHealthWidget';

// Dashboard Overview - Real-time business intelligence v2
export default function DashboardPage() {

    const [stats, setStats] = useState({
        total: 0,
        serious: 0,
        new: 0,
        converted: 0,
        abandoned: 0,
        vendors: 0,
        labours: 0,
        stocks: 0,
        disputes: 0,
        avgRating: '0.0'
    });
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [topPartners, setTopPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadData = useCallback(async (showLoading = false) => {
        if (showLoading) setIsRefreshing(true);
        const res = await getDashboardData();
        if (res.success && res.stats) {
            setStats(res.stats);
            setRecentLeads(res.recentLeads);
            if (res.topPartners) setTopPartners(res.topPartners);
            setLastUpdated(new Date());
        }
        setLoading(false);
        setIsRefreshing(false);
    }, []);

    useEffect(() => {
        loadData(); // Initial Load

        // "Lazy Load" / Live Polling effect as requested for better visibility
        const interval = setInterval(() => {
            loadData(true);
        }, 15000); // Check every 15s for new leads

        return () => clearInterval(interval);
    }, [loadData]);


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-[var(--terracotta)]/10 text-[var(--terracotta)]';
            case 'contacted': return 'bg-orange-100/50 text-orange-700';
            case 'converted': return 'bg-emerald-50 text-emerald-700';
            case 'payment_pending': return 'bg-amber-50 text-amber-700 font-bold animate-pulse';
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-[var(--ink)]">Overview</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-500 text-sm">Real-time performance metrics.</p>
                        {isRefreshing && (
                            <span className="text-[10px] bg-[var(--terracotta)]/10 text-[var(--terracotta)] px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></span>
                                Syncing...
                            </span>
                        )}
                        {/* Client-only timestamp to prevent hydration mismatch */}
                        {!isRefreshing && lastUpdated && (
                            <span
                                className="text-[10px] text-gray-300"
                                suppressHydrationWarning
                            >
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => loadData(true)}
                        className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* TRAFFIC FOOTPRINT SECTION */}
            <div className="mb-8">
                <TrafficPulse />
            </div>

            {/* QUICK ACTIONS ROW */}
            {/* QUICK ACTIONS GRID */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Operations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/dashboard/orders/create"
                        className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[var(--terracotta)]/30 hover:shadow-md transition-all flex flex-col gap-3"
                    >
                        <div className="w-10 h-10 bg-[var(--terracotta)]/10 text-[var(--terracotta)] rounded-lg flex items-center justify-center group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-[var(--ink)] block text-sm">Payment Link</span>
                            <span className="text-[10px] text-gray-400">Create & Share</span>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/products"
                        className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[var(--terracotta)]/30 hover:shadow-md transition-all flex flex-col gap-3"
                    >
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-[var(--ink)] block text-sm">Add Product</span>
                            <span className="text-[10px] text-gray-400">Update Catalog</span>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/campaigns"
                        className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[var(--terracotta)]/30 hover:shadow-md transition-all flex flex-col gap-3"
                    >
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <PenTool className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-[var(--ink)] block text-sm">New Campaign</span>
                            <span className="text-[10px] text-gray-400">Marketing Blast</span>
                        </div>
                    </Link>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-[var(--ink)] block text-sm">System Status</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-emerald-600 font-bold">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
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
                {/* NEW: Abandoned Carts / Pending Payments */}
                <Link href="/dashboard/leads?status=payment_pending" className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 hover:border-amber-300 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                    </div>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-2 font-sans">Abandoned Carts</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-4xl font-serif text-amber-900 group-hover:scale-110 transition-transform">{stats.abandoned}</h3>
                        <span className="text-amber-700 bg-amber-50 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Recoverable ⚡</span>
                    </div>
                </Link>
            </div>

            {/* OPERATIONS PULSE */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/dashboard/vendors" className="bg-[var(--sand)]/20 hover:bg-[var(--sand)]/40 p-4 rounded-xl border border-[var(--sand)]/50 transition-all group">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vendors</span>
                        <span className="text-lg font-serif text-[var(--ink)]">{stats.vendors}</span>
                    </div>
                </Link>
                <Link href="/dashboard/labours" className="bg-[var(--sand)]/20 hover:bg-[var(--sand)]/40 p-4 rounded-xl border border-[var(--sand)]/50 transition-all group">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Labour Force</span>
                        <span className="text-lg font-serif text-[var(--ink)]">{stats.labours}</span>
                    </div>
                </Link>
                <Link href="/dashboard/stocks" className="bg-[var(--sand)]/20 hover:bg-[var(--sand)]/40 p-4 rounded-xl border border-[var(--sand)]/50 transition-all group">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</span>
                        <span className="text-lg font-serif text-[var(--ink)]">{stats.stocks}</span>
                    </div>
                </Link>
                <Link href="/dashboard/disputes" className="bg-red-50/50 hover:bg-red-50 p-4 rounded-xl border border-red-100 transition-all group">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Open Disputes</span>
                        <span className="text-lg font-serif text-red-900">{stats.disputes}</span>
                    </div>
                </Link>
                {/* NEW: Customer Feedback Score */}
                <Link href="/dashboard/feedback" className="md:col-span-4 bg-gradient-to-r from-[var(--ink)] to-[#2a2a2a] p-5 rounded-xl shadow-xl shadow-black/10 flex items-center justify-between group relative overflow-hidden">
                    <div className="relative z-10 flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Customer Sentiment</span>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-serif text-white">{stats.avgRating}</span>
                            <span className="text-sm text-emerald-400 font-bold mb-1.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                5.0
                            </span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm font-bold group-hover:bg-white group-hover:text-[var(--ink)] transition-all">View Report →</span>
                    </div>
                    {/* Background Pattern */}
                    <svg className="absolute right-0 top-0 h-full w-auto text-white/5 transform translate-x-1/4" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50" /></svg>
                </Link>
            </div>

            {/* B2B INTELLIGENCE ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* KEY ACCOUNTS WIDGET */}
                <div className="bg-[#2A1E16] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-serif text-[var(--sand)]">Key Accounts</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Top Revenue Partners</p>
                            </div>
                            <span className="bg-white/10 text-white/60 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Whales 🐳</span>
                        </div>
                        <div className="space-y-4">
                            {topPartners.length > 0 ? (
                                topPartners.map((partner: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-[var(--terracotta)]">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-[var(--sand)]">{partner.name}</div>
                                                <div className="text-[10px] text-white/40">{partner.deals} Active Deals</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-serif text-[var(--sand)]">₹{(partner.value / 100000).toFixed(1)}L</div>
                                            <div className="text-[10px] text-white/30">Lifetime</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-white/20 text-xs uppercase tracking-widest font-bold">
                                    No B2B Data Yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* B2B QUICK CALCULATOR */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--ink)] mb-1">Wholesale Estimator</h3>
                        <p className="text-xs text-gray-400 mb-6">Quick quote for bulk inquiries (Tier 2 Pricing)</p>

                        <div className="bg-gray-50/50 rounded-xl p-4 space-y-4 border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Volume (Sq.ft)</span>
                                <input type="number" placeholder="2500" className="w-24 text-right bg-white border border-gray-200 rounded p-1 text-sm font-bold text-[var(--ink)] focus:ring-1 focus:ring-[var(--terracotta)] outline-none" id="quick-calc-vol" onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    const rate = val > 5000 ? 85 : (val > 1000 ? 95 : 110);
                                    const el = document.getElementById('calc-res');
                                    if (el) el.innerText = `₹${(val * rate).toLocaleString('en-IN')}`;
                                    const rateEl = document.getElementById('calc-rate');
                                    if (rateEl) rateEl.innerText = `@ ₹${rate}/sqft`;
                                }} />
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-sm font-bold text-[var(--terracotta)]">Estimate</span>
                                <div className="text-right">
                                    <div className="text-xl font-serif text-[var(--ink)]" id="calc-res">₹0</div>
                                    <div className="text-[10px] text-gray-400" id="calc-rate">@ Base Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                        <Link href="/dashboard/crm" className="flex-1 py-2 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-gray-100 text-center flex items-center justify-center gap-2">
                            Create Deal
                        </Link>
                    </div>
                </div>
            </div>

            {/* CONTENT & LEADS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT LEADS (2/3 Width) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
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
                                <th className="px-6 py-4">Product</th>
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
                                            <div className="text-[10px] text-gray-400 font-normal">{lead.role}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[150px] truncate" title={lead.product}>{lead.product}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                                            {new Date(lead.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">
                                        No leads found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* SEO HEALTH WIDGET (1/3 Width) */}
                <div className="lg:col-span-1 h-full">
                    <MetadataHealthWidget />
                </div>
            </div>
        </div>
    );
}
