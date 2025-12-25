'use client';

import React, { useEffect, useState } from 'react';
import { scanWebsitePages, SeoCheckResult } from '@/lib/seo-scanner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SeoHistoryChart from '@/components/dashboard/SeoHistoryChart';
import { client } from '@/sanity/lib/client';

export default function SeoDashboard() {
    const router = useRouter();
    const [pages, setPages] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState<any | null>(null);

    useEffect(() => {
        const load = async () => {
            // Parallel Fetch: Live Scan + History
            const [data, historyData] = await Promise.all([
                scanWebsitePages(),
                client.fetch(`*[_type == "seoSnapshot"] | order(date desc)[0..29] { date, score }`)
            ]);

            setPages(data);
            setHistory(historyData);
            if (data.length > 0) setSelectedPage(data[0]);
            setLoading(false);

            // Calculate Aggregates & Log Snapshot
            const totalScore = data.reduce((acc: number, p: any) => acc + (p?.score || 0), 0) / (data.length || 1);
            const passed = data.reduce((acc: number, p: any) => acc + (p?.checks?.filter((c: any) => c.status === 'pass').length || 0), 0);
            const warnings = data.reduce((acc: number, p: any) => acc + (p?.checks?.filter((c: any) => c.status === 'warning').length || 0), 0);
            const failed = data.reduce((acc: number, p: any) => acc + (p?.checks?.filter((c: any) => c.status === 'fail').length || 0), 0);

            // Simple "Once per session/day" check using sessionStorage
            if (!sessionStorage.getItem('seo_logged_today')) {
                fetch('/api/seo/snapshot', {
                    method: 'POST',
                    body: JSON.stringify({
                        score: Math.round(totalScore),
                        details: { passed, warnings, failed, totalPages: data.length }
                    })
                });
                sessionStorage.setItem('seo_logged_today', 'true');
            }
        };
        load();
    }, []);

    const [isFixing, setIsFixing] = useState<string | null>(null);

    const handleFix = async (checkId: string) => {
        if (!selectedPage) return;

        // 1. Static Pages -> Manual Instruction
        if (!selectedPage.id || selectedPage.type === 'Page') {
            alert(`Static Page Detected.\n\nPlease edit 'app${selectedPage.url === '/' ? '/page.tsx' : selectedPage.url + '/page.tsx'}' manually to fix this.`);
            return;
        }

        // 2. Dynamic Pages -> Magic Fix ID
        if (confirm("✨ SEO Auto-Fix\n\nAttempt to automatically fix this issue using smart content generation?")) {
            setIsFixing(checkId);
            try {
                const res = await fetch('/api/seo/fix', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        docId: selectedPage.id,
                        issueId: checkId,
                        keyword: selectedPage.focusKeyword || 'Terracotta',
                        currentMeta: selectedPage.meta
                    })
                });

                const json = await res.json();
                if (json.success) {
                    // Wait for Sanity propagation (2.5s)
                    await new Promise(r => setTimeout(r, 2500));

                    // Re-scan
                    const data = await scanWebsitePages();
                    setPages(data);
                    const updatedPage = data.find((p: any) => p.url === selectedPage.url);
                    if (updatedPage) setSelectedPage(updatedPage);

                    // Force UI update
                    setIsFixing(null);
                } else {
                    alert("Fix Failed: " + json.error);
                    setIsFixing(null);
                }
            } catch (e) {
                alert("Error connecting to Fixer AI");
            } finally {
                setIsFixing(null);
            }
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 border-emerald-500';
        if (score >= 50) return 'text-amber-500 border-amber-500';
        return 'text-red-500 border-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-emerald-50';
        if (score >= 50) return 'bg-amber-50';
        return 'bg-red-50';
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                <p className="text-gray-400 font-mono text-xs animate-pulse">Running Deep SEO Scan...</p>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-8 overflow-hidden">

            {/* LEFT: Page List */}
            <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-[#1a1512]">Monitored Pages</h3>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-mono">{pages.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {pages.map((page) => (
                        <div
                            key={page.url}
                            onClick={() => setSelectedPage(page)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedPage?.url === page.url ? 'border-[var(--terracotta)] bg-orange-50/50' : 'border-gray-100 bg-white'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{page.type}</span>
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${getScoreColor(page.score).replace('text', 'bg').replace('border', 'text-white')}`}>
                                    {page.score}/100
                                </span>
                            </div>
                            <h4 className="font-medium text-sm text-[#1a1512] line-clamp-1">{page.meta.title}</h4>
                            <p className="text-xs text-gray-400 font-mono mt-1 truncate">{page.url}</p>
                        </div>
                    ))}
                </div>
                {/* History Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <SeoHistoryChart data={history} />
                </div>
            </div>

            {/* RIGHT: Detail Inspector (RankMath Style) */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                {selectedPage ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-serif font-bold text-[#1a1512]">SEO Analysis</h2>
                                    <a href={selectedPage.url} target="_blank" className="text-xs text-gray-400 hover:text-[var(--terracotta)] flex items-center gap-1">
                                        Open Page <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Focus Keyword:</span>
                                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{selectedPage.focusKeyword || 'General'}</span>
                                </div>
                                <p className="text-sm text-gray-500 max-w-xl">{selectedPage.meta.title}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold ${getScoreColor(selectedPage.score)}`}>
                                    {selectedPage.score}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8">

                            {/* Meta Preview */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Google Snippet Preview</h4>
                                    <span className="text-[10px] text-gray-300 font-mono">Real-time Live Scan</span>
                                </div>
                                <div className="font-sans mb-4">
                                    <div className="text-blue-700 text-lg hover:underline cursor-pointer truncate">{selectedPage.meta.title}</div>
                                    <div className="text-green-700 text-xs mb-1">https://urbanclay.in{selectedPage.url}</div>
                                    <div className="text-gray-600 text-sm leading-snug">{selectedPage.meta.description || 'No description provided.'}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-3 mt-3">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">H1 Tag</span>
                                        <div className="text-xs font-mono bg-white p-2 rounded border border-gray-100 truncate" title={selectedPage.meta.h1}>
                                            {selectedPage.meta.h1 || <span className="text-red-400">Missing</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Canonical</span>
                                        <div className="text-xs font-mono bg-white p-2 rounded border border-gray-100 truncate text-gray-500" title={selectedPage.meta.canonical}>
                                            {selectedPage.meta.canonical || <span className="text-amber-400">Missing</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Health Metrics */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-1">Readability</span>
                                    <span className="text-2xl font-serif font-bold text-blue-900">{selectedPage.meta.readabilityScore}/100</span>
                                    <span className="text-[10px] text-blue-600 mt-1">Flesch Scale</span>
                                </div>
                                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider mb-1">Word Count</span>
                                    <span className="text-2xl font-serif font-bold text-purple-900">{selectedPage.meta.wordCount}</span>
                                    <span className="text-[10px] text-purple-600 mt-1">Words</span>
                                </div>
                                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider mb-1">Link Profile</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-serif font-bold text-orange-900">{selectedPage.meta.internalLinks}</span>
                                        <span className="text-xs text-orange-400">/</span>
                                        <span className="text-xl font-serif font-bold text-orange-900">{selectedPage.meta.externalLinks}</span>
                                    </div>
                                    <span className="text-[10px] text-orange-600 mt-1">Int / Ext</span>
                                </div>
                            </div>

                            {/* Checklist */}
                            <h3 className="font-serif text-xl border-b border-gray-100 pb-2 mb-4">Focus Details</h3>
                            <div className="space-y-3">
                                {selectedPage.checks.map((check: any) => (
                                    <div key={check.id} className="flex gap-4 items-start p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${check.status === 'pass' ? 'bg-emerald-100 text-emerald-600' :
                                            check.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {check.status === 'pass' && <svg className="w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            {check.status === 'warning' && <span className="text-xs font-bold">!</span>}
                                            {check.status === 'fail' && <span className="text-xs font-bold">✕</span>}
                                        </div>
                                        <div>
                                            <h5 className={`text-sm font-bold ${check.status === 'pass' ? 'text-gray-700' :
                                                check.status === 'warning' ? 'text-amber-700' : 'text-red-700'
                                                }`}>{check.message}</h5>
                                            <p className="text-xs text-gray-400 mt-0.5 font-light">{check.label}</p>
                                        </div>
                                        {check.status !== 'pass' && (
                                            <button
                                                onClick={() => handleFix(check.id)}
                                                disabled={isFixing === check.id}
                                                className={`ml-auto text-[10px] font-bold uppercase tracking-wider border border-gray-200 px-2 py-1 rounded transition-colors ${isFixing === check.id ? 'bg-gray-100 text-gray-400 cursor-wait' : 'hover:bg-black hover:text-white'
                                                    }`}
                                            >
                                                {isFixing === check.id ? 'Fixing...' : 'Fix It ✨'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Select a page to analyze</div>
                )}
            </div>
        </div>
    );
}
