'use client';

import React, { useState } from 'react';
import { client } from '@/sanity/lib/client';

export default function LeadManager({ onCompose }: { onCompose: (ids: string[]) => void }) {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    React.useEffect(() => {
        const fetchLeads = async () => {
            const data = await client.fetch(`*[_type == "architectLead"] | order(scrapedAt desc)`);
            setLeads(data);
            setLoading(false);
        };
        fetchLeads();
    }, []);

    const toggleSelect = (id: string) => {
        const newSet = new Set(selected);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelected(newSet);
    };

    const toggleAll = () => {
        if (selected.size === leads.length) setSelected(new Set());
        else setSelected(new Set(leads.map(l => l._id)));
    };

    if (loading) return <div className="p-20 text-center text-gray-400">Loading Database...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="text-lg font-bold text-[var(--ink)]">Lead Database</h3>
                    <p className="text-xs text-gray-400 mt-1">{leads.length} architects found</p>
                </div>
                <div className="flex gap-3">
                    {selected.size > 0 && (
                        <button
                            onClick={() => onCompose(Array.from(selected))}
                            className="bg-[var(--terracotta)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#a85638] transition-colors"
                        >
                            Email Selected ({selected.size})
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 font-medium uppercase text-[10px] tracking-widest font-sans">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" checked={selected.size === leads.length && leads.length > 0} onChange={toggleAll} className="rounded border-gray-300 text-[var(--terracotta)] focus:ring-[var(--terracotta)]" />
                            </th>
                            <th className="px-6 py-4">Architect / Firm</th>
                            <th className="px-6 py-4">Engagement</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                        {leads.map((lead) => (
                            <tr key={lead._id} className={`hover:bg-gray-50/80 transition-colors group ${lead.opens > 0 ? 'bg-orange-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <input type="checkbox" checked={selected.has(lead._id)} onChange={() => toggleSelect(lead._id)} className="rounded border-gray-300 text-[var(--terracotta)] focus:ring-[var(--terracotta)]" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-[var(--ink)]">{lead.firmName}</div>
                                    <div className="text-xs text-gray-400">{lead.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {lead.opens > 0 ? (
                                        <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-full w-fit">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            Read {lead.opens > 1 ? `(${lead.opens})` : ''}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-300 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.578-2.9"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18"></path></svg>
                                            Unopened
                                        </div>
                                    )}
                                    {lead.lastOpenedAt && <div className="text-[10px] text-gray-400 mt-1">{new Date(lead.lastOpenedAt).toLocaleDateString()}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs">{lead.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{lead.city}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                                        lead.status === 'contacted' ? 'bg-orange-50 text-orange-600' :
                                            'bg-green-50 text-green-600'
                                        }`}>
                                        {lead.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-20 text-gray-400">
                                    No leads found. Switch to the "Find Leads" tab to start scraping.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
