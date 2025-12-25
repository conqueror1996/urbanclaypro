'use client';

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/write-client';

const TEMPLATES = {
    'architect': {
        subject: "Quick favor re: [Project Name] credits / Urban Clay",
        body: `Hi [Name],\n\nHope you’re doing great! We’re currently updating our portfolio and listing [Project Name] as a featured case study on our new website.\n\nWhile we’re at it, could you check if "Urban Clay" is tagged as the material supplier on your own website's project page? It helps us a lot with our digital presence.\n\nHere is the link to use: https://urbanclay.in\n\nLet me know if you need any high-res photos of the terracotta work—we captured some great shots specifically of the cladding details that you're welcome to use.\n\nBest,\n[Your Name]`
    },
    'directory': {
        subject: "Listing Update for Urban Clay",
        body: `Name: Urban Clay\nCategory: Building Materials / Cladding Supplier\nDescription: Urban Clay is India's premier manufacturer of sustainable terracotta cladding, wirecut bricks, and architectural jaalis. We supply eco-friendly clay facade solutions to architects and builders across Mumbai, Delhi, Bangalore, and nationwide.\nWebsite: https://urbanclay.in\nKeywords: Terracotta tiles, exposed wirecut bricks, clay jaali, facade cladding.`
    }
};

export default function BacklinkManager() {
    const [links, setLinks] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
            const data = await client.fetch(`*[_type == "backlink"] | order(_createdAt desc)`);
            setLinks(data);
        };
        fetchLinks();
    }, [isAdding]);

    const addLink = async () => {
        if (!newDomain) return;
        await writeClient.create({ _type: 'backlink', domain: newDomain, notes: newNote });
        setIsAdding(false);
        setNewDomain('');
        setNewNote('');
    };

    const updateStatus = async (id: string, status: string) => {
        // Optimistic update
        setLinks(links.map(l => l._id === id ? { ...l, status } : l));
        await writeClient.patch(id).set({ status }).commit();
    };

    const copyTemplate = (type: 'architect' | 'directory') => {
        const text = TEMPLATES[type].body;
        navigator.clipboard.writeText(text);
        alert('Template copied to clipboard!');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-[#1a1512]">Backlink Outreach</h2>
                    <p className="text-gray-500 mt-1">Manage your off-page SEO and digital PR campaigns.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-[var(--terracotta)] text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-[#a85638] transition-colors"
                >
                    + Add Opportunity
                </button>
            </div>

            {/* Quick Templates */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => copyTemplate('architect')}>
                    <h3 className="font-bold text-blue-900 mb-2">Architect Template 📋</h3>
                    <p className="text-sm text-blue-700">Click to copy the outreach email for architects asking for credit/link.</p>
                </div>
                <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors" onClick={() => copyTemplate('directory')}>
                    <h3 className="font-bold text-purple-900 mb-2">Directory Listing 📋</h3>
                    <p className="text-sm text-purple-700">Click to copy standard consistent NAP (Name, Address, Phone) details.</p>
                </div>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100 mb-6">
                    <h3 className="font-bold mb-4">New Target</h3>
                    <div className="grid gap-4">
                        <input
                            placeholder="Domain (e.g. archdaily.com)"
                            className="w-full border p-2 rounded"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                        />
                        <textarea
                            placeholder="Notes / Point of Contact"
                            className="w-full border p-2 rounded"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={addLink} className="bg-black text-white px-4 py-2 rounded">Save Target</button>
                            <button onClick={() => setIsAdding(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pipeline Board */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Target Website</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Notes</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {links.length > 0 ? links.map(link => (
                            <tr key={link._id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-[var(--ink)]">{link.domain}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={link.status || 'pending'}
                                        onChange={(e) => updateStatus(link._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-none focus:ring-0 cursor-pointer
                                            ${link.status === 'published' ? 'bg-green-100 text-green-700' :
                                                link.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                                    link.status === 'rejected' ? 'bg-red-50 text-red-500' :
                                                        'bg-gray-100 text-gray-500'}`}
                                    >
                                        <option value="pending">To Contact</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="published">Link Live</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{link.notes || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <a href={`https://${link.domain}`} target="_blank" className="text-[var(--terracotta)] hover:underline text-sm font-bold">Visit Site →</a>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-gray-400">No outreach targets yet. Add competitors or magazines!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
