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

    const MetricCard = ({ label, value, delay, highlight = false, subtext }: { label: string, value: number | string, delay: number, highlight?: boolean, subtext?: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`
                relative p-6 rounded-2xl border backdrop-blur-sm overflow-hidden flex flex-col justify-between
                ${highlight
                    ? 'bg-[var(--terracotta)] text-white border-transparent shadow-lg shadow-orange-900/20 col-span-2'
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
                {subtext && <p className={`text-[10px] mt-1 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{subtext}</p>}
            </div>

            {/* Decorative */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${highlight ? 'bg-black' : 'bg-[var(--terracotta)]'}`} />
        </motion.div>
    );

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    // Health Score Logic for Color
    const getHealthColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 70) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-serif text-[#1a1512]">Site Health & Pulse</h2>
                    <p className="text-sm text-gray-500">Real-time performance and traffic diagnostics</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${stats.errorCount > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {stats.errorCount > 0 ? 'System Alert' : 'System Healthy'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

                {/* HERO: SITE HEALTH SCORE */}
                <div className="lg:col-span-2 bg-white border border-[#e9e2da] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent" />
                    <div className="relative z-10 text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Site Health Score</p>
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={351.86}
                                    strokeDashoffset={351.86 - (351.86 * stats.healthScore) / 100}
                                    className={`${getHealthColor(stats.healthScore)} transition-all duration-1000`}
                                />
                            </svg>
                            <span className={`absolute text-4xl font-bold font-serif ${getHealthColor(stats.healthScore)}`}>
                                {stats.healthScore}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            Based on Performance (LCP) & Stability
                        </p>
                    </div>
                </div>

                {/* SEO HERO */}
                <div className="lg:col-span-2 bg-[#1a1512] border border-transparent rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-white shadow-lg">
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-4">SEO Health</p>
                    <div className="text-center mb-4">
                        <span className="text-5xl font-serif font-bold text-[var(--terracotta)]">{stats.seoScore}</span>
                        <span className="text-sm text-white/40 ml-1">/ 100</span>
                    </div>
                    <div className="w-full flex justify-between px-8 text-xs text-center">
                        <div>
                            <span className="block font-bold text-white text-lg">{stats.organicCount}</span>
                            <span className="text-white/40">Organic Visits</span>
                        </div>
                        <div>
                            <span className={`block font-bold text-lg ${stats.avgLcp < 2500 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {(stats.avgLcp / 1000).toFixed(1)}s
                            </span>
                            <span className="text-white/40">Load Time</span>
                        </div>
                    </div>
                </div>

                {/* Performance Metric */}
                <MetricCard
                    label="Avg LCP Speed"
                    value={`${(stats.avgLcp / 1000).toFixed(2)}s`}
                    delay={0.1}
                    subtext={stats.avgLcp < 2500 ? "Excellent Speed" : "Needs Optimization"}
                />

                {/* Error Metric */}
                <MetricCard
                    label="Issues Detected"
                    value={stats.errorCount}
                    delay={0.2}
                    subtext="Recent JavaScript Errors"
                    highlight={stats.errorCount > 0}
                />

                {/* TRAFFIC HERO */}
                <MetricCard
                    label="Today's Traffic"
                    value={stats.today}
                    delay={0.3}
                    highlight={stats.errorCount === 0}
                    subtext={`vs Yesterday: ${stats.yesterday}`}
                />
            </div>

            {/* Recent Errors Log (Only show if errors exist) */}
            {stats.recentErrors && stats.recentErrors.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <h4 className="text-sm font-bold text-red-800 mb-2">Recent System Errors</h4>
                    <ul className="space-y-1">
                        {stats.recentErrors.map((err: string, i: number) => (
                            <li key={i} className="text-xs text-red-600 font-mono break-all">• {err}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
