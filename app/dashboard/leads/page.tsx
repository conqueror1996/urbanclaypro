'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';
import { updateLeadStatus, deleteLead, addAdminNote } from '@/app/actions/manage-lead';
import { generateSalesEmail } from '@/app/actions/generate-draft';
import Image from 'next/image';

// Lead Type Definition
interface Lead {
    _id: string;
    role: string;
    product: string;
    city: string;
    quantity: string;
    timeline: string;
    contact: string;
    notes: string;
    isSerious: boolean;
    seriousness: 'low' | 'medium' | 'high';
    status: 'new' | 'contacted' | 'converted' | 'lost';
    submittedAt: string;
    adminNotes?: Array<{
        _key: string;
        note: string;
        timestamp: string;
        author: string;
    }>;
    productImage?: string; // Resolved client-side
    fulfillmentStatus?: 'pending' | 'shipped' | 'delivered';
    deliveredAt?: string;
}

export default function LeadsDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'date' | 'seriousness'>('date');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            // Fetch leads AND try to resolve product images in one go if possible, 
            // but since product is a string, we might need a separate lookup.
            // For now, simpler GROQ: fetch leads, then we can match images or fetch them.
            // Let's optimize: Fetch leads and all products, then match in JS.
            const query = `{
                "leads": *[_type == "lead"] | order(submittedAt desc),
                "products": *[_type == "product"]{title, "imageUrl": images[0].asset->url}
            }`;

            const data = await client.fetch(query);

            // Map product images to leads
            const leadsWithImages = data.leads.map((lead: any) => {
                // Special handling for Catalogue
                if (lead.product === 'General Catalogue') {
                    return {
                        ...lead,
                        productImage: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' // Generic Catalog/PDF Icon
                    };
                }

                const productMatch = data.products.find((p: any) => p.title === lead.product);
                return {
                    ...lead,
                    productImage: productMatch?.imageUrl
                };
            });

            setLeads(leadsWithImages);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'contacted': return 'bg-yellow-100 text-yellow-700';
            case 'converted': return 'bg-green-100 text-green-700';
            case 'lost': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSeriousnessBadge = (lead: Lead) => {
        if (lead.role === 'Visitor') {
            return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">📥 Download</span>;
        }

        switch (lead.seriousness) {
            case 'high': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">🔥 Hot</span>;
            case 'medium': return <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider">Medium</span>;
            default: return <span className="text-gray-400 text-xs uppercase tracking-wider">Low</span>;
        }
    };

    const sortedLeads = [...leads].sort((a, b) => {
        if (sortBy === 'seriousness') {
            const score = { high: 3, medium: 2, low: 1 };
            // @ts-ignore
            return score[b.seriousness || 'low'] - score[a.seriousness || 'low'];
        }
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        // Optimistic
        setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus as any } : l));
        if (selectedLead && selectedLead._id === leadId) {
            setSelectedLead(prev => prev ? { ...prev, status: newStatus as any } : null);
        }

        try {
            await updateLeadStatus(leadId, newStatus);
        } catch (error) {
            console.error('Failed to update status', error);
            fetchLeads();
        }
    };

    const handleDelete = async (leadId: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        setLeads(prev => prev.filter(l => l._id !== leadId));
        if (selectedLead?._id === leadId) setSelectedLead(null);

        try {
            await deleteLead(leadId);
        } catch (error) {
            console.error('Failed to delete lead', error);
            fetchLeads();
        }
    };

    const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

    const handleGenerateDraft = async () => {
        if (!selectedLead) return;
        setIsGeneratingDraft(true);
        try {
            // @ts-ignore - Lead types are compatible enough for this action
            const res = await generateSalesEmail(selectedLead);
            if (res.success) {
                setNewNote(res.draft);
            }
        } catch (e) {
            console.error("AI Draft failed", e);
        } finally {
            setIsGeneratingDraft(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead || !newNote.trim()) return;

        setIsSavingNote(true);
        const noteText = newNote;
        setNewNote('');

        try {
            const result = await addAdminNote(selectedLead._id, noteText);
            if (result.success && result.note) {
                // Update local state
                const updatedNotes = [...(selectedLead.adminNotes || []), result.note];

                setSelectedLead({ ...selectedLead, adminNotes: updatedNotes });
                setLeads(prev => prev.map(l => l._id === selectedLead._id ? { ...l, adminNotes: updatedNotes } : l));
            }
        } catch (error) {
            console.error('Failed to add note', error);
            alert('Failed to save note');
        } finally {
            setIsSavingNote(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    // Analytics
    const stats = {
        total: leads.length,
        hot: leads.filter(l => l.seriousness === 'high').length,
        // @ts-ignore
        pendingSamples: leads.filter(l => l.role === 'Visitor' || (l.quantity && l.quantity.includes('Sample'))).length
            - leads.filter(l => l.fulfillmentStatus === 'delivered').length
    };

    const filteredLeads = sortedLeads.filter(lead =>
        (lead.contact?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (lead.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (lead.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (lead.product?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 relative">
            {/* Header & Stats */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-[#1a1512]">Sales Leads</h1>
                        <p className="text-gray-500 mt-1">Manage and track incoming quote requests.</p>
                    </div>
                    {/* Search & Sort */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[var(--terracotta)] w-48 transition-all focus:w-64"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setSortBy('date')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${sortBy === 'date' ? 'bg-[var(--terracotta)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Latest
                            </button>
                            <button
                                onClick={() => setSortBy('seriousness')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${sortBy === 'seriousness' ? 'bg-[var(--terracotta)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Hot
                            </button>
                            <div className="w-px bg-gray-200 my-2 mx-1"></div>
                            <button
                                onClick={() => {
                                    const headers = ['Date', 'Name', 'Phone', 'Role', 'City', 'Product', 'Quantity', 'Status', 'Notes'];
                                    const csvContent = [
                                        headers.join(','),
                                        ...leads.map(l => [
                                            new Date(l.submittedAt).toLocaleDateString(),
                                            `"${l.contact?.replace(/"/g, '""')}"`, // Extract name if mixed, usually just contact string
                                            `"${l.contact?.match(/\d+/)?.[0] || ''}"`, // Extract basic phone
                                            `"${l.role}"`,
                                            `"${l.city}"`,
                                            `"${l.product}"`,
                                            `"${l.quantity}"`,
                                            l.status,
                                            `"${l.notes?.replace(/"/g, '""') || ''}"`
                                        ].join(','))
                                    ].join('\n');

                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(blob);
                                    link.setAttribute('download', `urban_clay_leads_${new Date().toISOString().split('T')[0]}.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[var(--terracotta)] transition-colors flex items-center gap-2"
                                title="Download as CSV"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Business Pulse Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pipeline</p>
                        <p className="text-3xl font-serif text-[#1a1512] mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border border-orange-100 shadow-sm">
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Hot Leads 🔥</p>
                        <p className="text-3xl font-serif text-orange-900 mt-1">{stats.hot}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pending Orders</p>
                        <p className="text-3xl font-serif text-blue-900 mt-1">{stats.pendingSamples > 0 ? stats.pendingSamples : 0}</p>
                    </div>
                </div>
            </div>

            {/* List View */}
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead, index) => (
                            <motion.div
                                key={lead._id}
                                layoutId={lead._id}
                                onClick={() => setSelectedLead(lead)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-xl p-6 border transition-all hover:shadow-md cursor-pointer group ${lead.isSerious ? 'border-orange-200 shadow-orange-50' : 'border-gray-100'}`}
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-lg text-[#1a1512] group-hover:text-[var(--terracotta)] transition-colors">{lead.contact}</h3>
                                                    {getSeriousnessBadge(lead)}
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                        {lead.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <span>{lead.role}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{lead.city}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{new Date(lead.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100 group-hover:bg-[var(--sand)]/30 transition-colors">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Product</label>
                                                <p className="font-medium text-sm text-[#1a1512]">{lead.product}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Quantity</label>
                                                <p className="font-medium text-sm text-[#1a1512]">{lead.quantity}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Timeline</label>
                                                <p className="font-medium text-sm text-[#1a1512]">{lead.timeline || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Actions */}
                                    <div className="flex flex-col justify-center items-end gap-3 text-gray-400">
                                        {lead.fulfillmentStatus === 'delivered' ? (
                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">Delivered</span>
                                        ) : null}

                                        <div className="flex items-center gap-3">
                                            <a
                                                href={`https://wa.me/${lead.contact?.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-gray-300 hover:text-[#25D366] transition-colors"
                                                title="WhatsApp"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            </a>
                                            <svg className="w-6 h-6 stroke-1 group-hover:text-[var(--terracotta)] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            {searchTerm ? (
                                <p className="text-gray-500">No leads found matching &quot;<span className="font-bold text-gray-700">{searchTerm}</span>&quot;.</p>
                            ) : (
                                <p className="text-gray-500">No leads found yet.</p>
                            )}
                        </div>
                    )}
                </div >
            )}

            {/* DETAIL SLIDE-OVER */}
            <AnimatePresence>
                {selectedLead && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLead(null)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            layoutId={selectedLead._id}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200"
                        >
                            <div className="p-8 space-y-8">
                                {/* Detail Header */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">#{selectedLead._id.slice(-6)}</span>
                                            {getSeriousnessBadge(selectedLead)}
                                        </div>
                                        <h2 className="text-3xl font-serif text-[#1a1512]">{selectedLead.contact}</h2>
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>{selectedLead.role}</span>
                                            <span>•</span>
                                            <span>{selectedLead.city}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Status Bar */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Status</label>
                                        <select
                                            value={selectedLead.status}
                                            onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium outline-none border border-transparent hover:border-gray-300 focus:border-[var(--terracotta)] ${getStatusColor(selectedLead.status)}`}
                                        >
                                            <option value="new">New Lead</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Deal Won</option>
                                            <option value="lost">Deal Lost</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`https://wa.me/${selectedLead.contact?.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold hover:bg-[#128C7E] transition-colors flex items-center shadow-lg shadow-green-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            WhatsApp
                                        </a>
                                        <button onClick={() => handleDelete(selectedLead._id)} className="text-red-400 text-sm hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                                            Delete Lead
                                        </button>
                                    </div>
                                </div>

                                {/* Deal Intelligence Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Column 1: Requirement Specs */}
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-lg text-[#1a1512] border-b pb-2">Requirement Specs</h3>

                                        {/* Product Card */}
                                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm group">
                                            <div className="h-32 bg-gray-100 relative">
                                                {selectedLead.productImage ? (
                                                    <Image
                                                        src={selectedLead.productImage}
                                                        alt={selectedLead.product}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300">
                                                        <span className="text-4xl text-gray-200 font-serif">?</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-[#1a1512]">{selectedLead.product}</h4>
                                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                                    <span>Qty: <strong>{selectedLead.quantity}</strong></span>
                                                    <span>Time: <strong>{selectedLead.timeline || 'N/A'}</strong></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100">
                                            <label className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2 block">Client Notes</label>
                                            <p className="text-[#1a1512] whitespace-pre-wrap">{selectedLead.notes || "No notes provided."}</p>
                                        </div>
                                    </div>

                                    {/* Column 2: Admin Call Log */}
                                    <div className="bg-gray-50 rounded-xl p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg text-[#1a1512]">Admin Activity Log</h3>
                                            <button
                                                onClick={handleGenerateDraft}
                                                disabled={isGeneratingDraft}
                                                className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:bg-purple-200 transition-colors flex items-center gap-2"
                                            >
                                                {isGeneratingDraft ? (
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                )}
                                                AI Smart Reply
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 max-h-[400px]">
                                            {selectedLead.adminNotes && selectedLead.adminNotes.length > 0 ? (
                                                selectedLead.adminNotes.map((note) => (
                                                    <div key={note._key} className="bg-white p-3 rounded-lg shadow-sm text-sm border border-gray-100 relative group">
                                                        <p className="text-gray-800 whitespace-pre-wrap">{note.note}</p>
                                                        <div className="flex justify-between mt-2 text-[10px] text-gray-400 uppercase tracking-wider items-center">
                                                            <div className="flex gap-2">
                                                                <span>{note.author}</span>
                                                                <span>{new Date(note.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(note.note)}
                                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-opacity"
                                                                title="Copy to clipboard"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-gray-400 text-sm py-10">
                                                    No logs yet. Add your first note below.
                                                </div>
                                            )}
                                        </div>

                                        <form onSubmit={handleAddNote} className="mt-auto">
                                            <textarea
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                placeholder="Log a call, updated quote, or meeting notes..."
                                                className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] bg-white resize-none"
                                                rows={3}
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSavingNote || !newNote.trim()}
                                                className="w-full mt-2 bg-[#1a1512] text-white py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSavingNote ? 'Saving...' : 'Add Log Entry'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div >
    );
}
