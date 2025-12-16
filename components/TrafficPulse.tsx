'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTrafficStats } from '@/app/actions/analytics';
import { TrafficReport } from '@/lib/analytics-service';

export default function TrafficPulse() {
    const [stats, setStats] = useState<TrafficReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTrafficStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load traffic stats", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const MetricCard = ({ label, value, delay, highlight = false }: { label: string, value: number | string, delay: number, highlight?: boolean }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`
                relative p-6 rounded-2xl border backdrop-blur-sm overflow-hidden
                ${highlight
                    ? 'bg-[var(--terracotta)] text-white border-transparent shadow-lg shadow-orange-900/20'
                    : 'bg-white border-[#e9e2da] text-[#2A1E16]'}
            `}
        >
            <div className="relative z-10">
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-white/80' : 'text-gray-400'}`}>
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-serif font-bold">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                    {highlight && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                    )}
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${highlight ? 'bg-black' : 'bg-[var(--terracotta)]'}`} />
        </motion.div>
    );

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-serif text-[#1a1512]">Footprint Tracker</h2>
                    <p className="text-sm text-gray-500">Real-time visitor snapshots across time</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    {stats.isDemo ? (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            Demo Mode
                        </span>
                    ) : (
                        <div className="flex items-center gap-2 text-[var(--terracotta)]">
                            <span className="w-2 h-2 bg-[var(--terracotta)] rounded-full animate-pulse" />
                            Live Data
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    label="Today"
                    value={stats.today}
                    delay={0}
                    highlight
                />
                <MetricCard
                    label="Yesterday"
                    value={stats.yesterday}
                    delay={0.1}
                />
                <MetricCard
                    label="1 Month Ago"
                    value={stats.lastMonth}
                    delay={0.2}
                />
                <MetricCard
                    label="3 Months Ago"
                    value={stats.threeMonthsAgo}
                    delay={0.3}
                />
                <MetricCard
                    label="8 Months Ago"
                    value={stats.eightMonthsAgo}
                    delay={0.4}
                />
            </div>

            {/* Helper Message for Demo Mode to guide user to Real Data */}
            {stats.isDemo && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col gap-2 text-xs text-gray-500">
                    {stats.error && (
                        <div className="p-2 bg-red-50 text-red-600 border border-red-100 rounded mb-2">
                            <strong>Connection Error:</strong> {stats.error}
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p><span className="font-bold text-gray-700">Viewing Simulated Data.</span> To connect real Google Analytics feed:</p>
                    </div>
                    <code className="bg-white p-2 border rounded text-xs text-gray-600 block overflow-x-auto">
                        GA_PROPERTY_ID=your_id<br />
                        GA_CLIENT_EMAIL=your_email<br />
                        GA_PRIVATE_KEY="your_key"
                    </code>
                    <p className="text-[10px] text-gray-500 italic border-t border-gray-100 pt-2 mt-1">
                        ⚠️ <strong>Server Restart Required:</strong> If you just added these variables, stop and restart your server (<code className="bg-gray-100 px-1">npm run dev</code>) to load them.
                    </p>
                </div>
            )}
        </div>
    );
}
