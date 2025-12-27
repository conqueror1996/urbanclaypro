'use client';

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

export default function CampaignReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            // Sort by Opens, then conversions, then date
            const data = await client.fetch(`
                *[_type == "architectLead" && (status == "contacted" || status == "replied" || opens > 0)] | order(hasRequestedSample desc, opens desc, lastOpenedAt desc) {
                    _id, firmName, name, email, city, status, opens, lastOpenedAt, scrapedAt, hasRequestedSample, convertedAt
                }
            `);
            setReports(data);
            setLoading(false);
        };
        fetchReports();
    }, []);

    if (loading) return <div className="p-20 text-center text-gray-400">Loading Analytics...</div>;

    const totalOpens = reports.reduce((acc, curr) => acc + (curr.opens || 0), 0);
    const uniqueOpens = reports.filter(r => r.opens > 0).length;
    const totalConversions = reports.filter(r => r.hasRequestedSample).length;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Total Sent</h4>
                    <p className="text-4xl font-serif mt-2 text-[var(--ink)]">{reports.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Unique Opens</h4>
                    <p className="text-4xl font-serif mt-2 text-green-600">{uniqueOpens}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {reports.length > 0 ? Math.round((uniqueOpens / reports.length) * 100) : 0}% Open Rate
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-b-4 border-b-[var(--terracotta)]">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Sample Orders</h4>
                    <p className="text-4xl font-serif mt-2 text-[var(--terracotta)]">{totalConversions}</p>
                    <p className="text-xs text-gray-400 mt-1 font-bold">
                        {reports.length > 0 ? ((totalConversions / reports.length) * 100).toFixed(1) : 0}% Conversion
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Interactions</h4>
                    <p className="text-4xl font-serif mt-2 text-blue-600">{totalOpens}</p>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[var(--ink)]">Campaign Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-400 font-medium uppercase text-[10px] tracking-widest font-sans">
                            <tr>
                                <th className="px-6 py-4">Recipient</th>
                                <th className="px-6 py-4">Engagement Status</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4">City</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                            {reports.map((lead) => (
                                <tr key={lead._id} className={`hover:bg-gray-50/80 transition-colors ${lead.opens > 0 ? 'bg-orange-50/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[var(--ink)]">{lead.firmName}</div>
                                        <div className="font-mono text-xs text-gray-400">{lead.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.opens > 0 ? (
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                </div>
                                                <span className="text-green-700 font-bold">Opened {lead.opens} times</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Delivered (Unopened)</span>
                                        )}
                                        {lead.hasRequestedSample && (
                                            <div className="mt-2 text-[10px] bg-orange-100 text-[var(--terracotta)] font-bold px-2 py-1 rounded inline-flex items-center gap-1 uppercase tracking-tighter shadow-sm border border-orange-200">
                                                🔥 Sample Requested
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {lead.lastOpenedAt
                                            ? new Date(lead.lastOpenedAt).toLocaleString()
                                            : 'Waiting...'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{lead.city}</span>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-20 text-gray-400">
                                        No active campaigns found. Send your first blast!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
