'use client';

import React, { useState } from 'react';
import { ImportLeads } from '@/app/actions/campaigns';

export default function LeadScraper({ onLeadsAdded }: { onLeadsAdded: () => void }) {
    const [city, setCity] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const startScrape = async () => {
        if (!city) return;
        setIsScraping(true);
        setLogs([]);
        setProgress(0);

        // REAL SCRAPE EXECUTION
        setLogs(prev => [...prev, `Initializing Deep Search...`]);
        setLogs(prev => [...prev, `Targeting directory listings for ${city}...`]);
        setProgress(30);

        try {
            const { RealArchitectScraper } = await import('@/app/actions/scrape-architects');
            const result = await RealArchitectScraper(city);

            setProgress(70);

            if (result.success) {
                setLogs(prev => [...prev, `✅ Scrape Successful.`]);
                setLogs(prev => [...prev, `Found ${result.count} firms.`]);
                if (result.leads) {
                    result.leads.forEach((l: any) => {
                        setLogs(prev => [...prev, `+ Added: ${l.firmName}`]);
                    });
                }
            } else {
                setLogs(prev => [...prev, `❌ Error: ${result.error}`]);
            }
        } catch (e) {
            setLogs(prev => [...prev, `❌ System Error: ${e}`]);
        }

        setProgress(100);
        await new Promise(r => setTimeout(r, 1000));
        setIsScraping(false);
        onLeadsAdded();
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Control Panel */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="w-16 h-16 bg-[var(--terracotta)]/10 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-2xl font-serif text-[var(--ink)] mb-2">Lead Bot 2.0</h3>
                <p className="text-gray-500 mb-8">Target a city to auto-discover active architectural firms, verify their emails, and add them to your database.</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 block">Target City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Hyderabad"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)]"
                        />
                    </div>
                    <button
                        onClick={startScrape}
                        disabled={isScraping || !city}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isScraping ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[var(--terracotta)] text-white hover:bg-[#a85638] shadow-lg shadow-orange-900/20'
                            }`}
                    >
                        {isScraping ? 'Bot Running...' : 'Start Scraping'}
                    </button>
                    {!isScraping && (
                        <p className="text-center text-xs text-gray-300">
                            For bulk scrapes, run: <code className="bg-gray-100 px-1 rounded text-gray-500">node scripts/architect-bot.js</code>
                        </p>
                    )}
                </div>
            </div>

            {/* Terminal View */}
            <div className="bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-sm relative">
                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-white/30 text-xs ml-2">bot_terminal — node</span>
                </div>
                <div className="p-6 text-green-400 flex-1 overflow-y-auto space-y-2">
                    <p className="text-white/50">$ waiting for command...</p>
                    {logs.map((log, i) => (
                        <p key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-blue-400 mr-2">➜</span>
                            {log}
                        </p>
                    ))}
                    {isScraping && (
                        <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1 align-middle"></span>
                    )}
                    {!isScraping && logs.length > 0 && <p className="text-white/50">$ done. 2 leads added.</p>}
                </div>
                {/* Progress Bar */}
                {isScraping && (
                    <div className="h-1 bg-white/10 w-full mt-auto">
                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>
        </div>
    );
}
