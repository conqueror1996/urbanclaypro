'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';
import { updateLeadStatus, deleteLead, addAdminNote } from '@/app/actions/manage-lead';
import { generateSalesEmail } from '@/app/actions/generate-draft';
import Image from 'next/image';

// Lead Type Definition (Updated with all Schema Fields)
interface Lead {
    _id: string;
    role: string;
    firmName?: string; // New
    product: string;
    city: string;
    quantity: string;
    timeline: string;
    contact: string;
    email?: string; // New
    address?: string; // New
    notes: string;
    requirement?: string; // New
    isSerious: boolean;
    seriousness: 'low' | 'medium' | 'high';
    status: 'new' | 'contacted' | 'converted' | 'lost';
    submittedAt: string;
    isSampleRequest?: boolean; // New
    sampleItems?: string[]; // New
    fulfillmentStatus?: 'pending' | 'processing' | 'shipped' | 'delivered';
    shippingInfo?: { courier?: string; trackingNumber?: string }; // New
    adminNotes?: Array<{
        _key: string;
        note: string;
        timestamp: string;
        author: string;
    }>;
    productImage?: string; // Resolved client-side
}

export default function LeadsDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'date' | 'seriousness'>('date');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

    // Quote Calculator State
    const [showQuoteCalc, setShowQuoteCalc] = useState(false);
    const [quotePrice, setQuotePrice] = useState('120'); // Default base price
    const [quoteResult, setQuoteResult] = useState('');
    const [trafficCount, setTrafficCount] = useState(0); // New traffic stats

    // Pagination & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Showing 8 items per page

    const fetchLeads = async () => {
        setLoading(true);
        try {
            // Updated Query to fetch ALL fields AND Footprint count
            const query = `{
                "leads": *[_type == "lead"] | order(submittedAt desc) {
                    _id, role, firmName, product, city, quantity, timeline,
                    contact, email, address, notes, requirement,
                    isSerious, status, submittedAt,
                    isSampleRequest, sampleItems, fulfillmentStatus, shippingInfo,
                    adminNotes
                },
                "products": *[_type == "product"]{title, "imageUrl": images[0].asset->url},
                "footprintsCount": count(*[_type == "footprint"])
            }`;
            const data = await client.fetch(query);

            // Map product images to leads
            const leadsWithImages = data.leads.map((lead: any) => {
                let img = '/images/catalogue-icon.png';
                if (lead.product !== 'General Catalogue') {
                    const productMatch = data.products.find((p: any) => p.title === lead.product);
                    if (productMatch) img = productMatch.imageUrl;
                }
                return { ...lead, productImage: img };
            });

            setLeads(leadsWithImages);
            // Store footprint count in a new state variable or just use a ref/temp for now. 
            // Better to add to stats object.
            setTrafficCount(data.footprintsCount || 0);

        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateQuote = () => {
        if (!selectedLead) return;
        const qty = parseInt((selectedLead.quantity || '0').toString().replace(/[^0-9]/g, '') || '0');
        const price = parseInt(quotePrice);
        const subtotal = qty * price;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        const text = `*Quick Estimate for ${selectedLead.product}*\n\nHi ${selectedLead.contact?.split(' ')[0] || 'there'},\nThanks for your enquiry. Here is a preliminary cost for ${qty} units:\n\n- Base Rate: ₹${price}/unit\n- Material Cost: ₹${subtotal.toLocaleString('en-IN')}\n- GST (18%): ₹${gst.toLocaleString('en-IN')}\n\n*Total Est: ₹${total.toLocaleString('en-IN')}* (Excl. Shipping)\n\nReply YES to receive a formal Proforma Invoice.`;
        setQuoteResult(text);
    };

    const handleDownloadPDF = async () => {
        if (!selectedLead) return;

        // Dynamically import jsPDF to avoid SSR issues
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();

        // 1. Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("PROFORMA INVOICE", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("UrbanClay Inc.", 14, 28);
        doc.text("gst@urbanclay.in | +91 98765 43210", 14, 33);

        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);
        doc.text(`Valid Until: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 150, 25);

        // 2. Client Details
        doc.setDrawColor(200);
        doc.line(14, 40, 196, 40);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Bill To:", 14, 50);
        doc.setFontSize(10);
        doc.text(selectedLead.firmName || selectedLead.contact, 14, 56);
        doc.text(selectedLead.city, 14, 61);
        if (selectedLead.email) doc.text(selectedLead.email, 14, 66);

        // 3. Calculation
        const qty = parseInt((selectedLead.quantity || '0').toString().replace(/[^0-9]/g, '') || '0');
        const price = parseInt(quotePrice);
        const subtotal = qty * price;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        // 4. Table
        // @ts-ignore
        autoTable(doc, {
            startY: 75,
            head: [['Description', 'Qty', 'Rate (INR)', 'Amount']],
            body: [
                [selectedLead.product, qty, price, subtotal.toLocaleString('en-IN')],
            ],
            foot: [
                ['', '', 'Subtotal', subtotal.toLocaleString('en-IN')],
                ['', '', 'GST (18%)', gst.toLocaleString('en-IN')],
                ['', '', 'TOTAL', total.toLocaleString('en-IN')],
            ],
            theme: 'grid',
            headStyles: { fillColor: [180, 90, 60] }, // Terracotta color
            footStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: 'bold' }
        });

        // 5. Terms
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Terms & Conditions:", 14, finalY);
        doc.setFontSize(9);
        doc.text("1. 50% Advance calculation to confirm order.", 14, finalY + 6);
        doc.text("2. Delivery timeline starts after payment receipt.", 14, finalY + 11);
        doc.text("3. Transport and unloading is in client scope.", 14, finalY + 16);

        doc.save(`Quote_${selectedLead.contact.replace(/\s+/g, '_')}.pdf`);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-[var(--terracotta)]/10 text-[var(--terracotta)]';
            case 'contacted': return 'bg-orange-100/50 text-orange-700';
            case 'converted': return 'bg-emerald-50 text-emerald-700';
            case 'lost': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100/50 text-gray-700';
        }
    };

    const getSeriousnessBadge = (lead: Lead) => {
        if (lead.role === 'Visitor') {
            return <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">📥 Download</span>;
        }

        switch (lead.seriousness) {
            case 'high': return <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">🔥 Hot</span>;
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

    // Analytics
    const stats = {
        total: leads.length,
        traffic: trafficCount, // New real-time data
        hot: leads.filter(l => l.seriousness === 'high').length,
        // @ts-ignore
        pendingSamples: leads.filter(l => l.role === 'Visitor' || (l.quantity && l.quantity.includes('Sample'))).length
            - leads.filter(l => l.fulfillmentStatus === 'delivered').length
    };

    // Filter Logic
    const filteredLeads = sortedLeads.filter(lead => {
        const matchesSearch = (lead.contact?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (lead.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (lead.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (lead.product?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ? true : lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, sortBy]);

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

    const handleGenerateDraft = async () => {
        if (!selectedLead) return;
        setIsGeneratingDraft(true);
        try {
            // @ts-ignore
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

    return (
        <div className="space-y-8 relative">
            {/* Header & Stats */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-[var(--ink)]">Sales Leads</h1>
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
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] w-40 transition-all focus:w-64"
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
                                            `"${l.contact?.replace(/"/g, '""')}"`,
                                            `"${l.contact?.match(/\d+/)?.[0] || ''}"`,
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
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Website Footfall 👣</p>
                        <p className="text-3xl font-serif text-[var(--ink)] mt-1">{loading ? '...' : stats.traffic.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border border-orange-100 shadow-sm">
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider font-sans">Hot Leads 🔥</p>
                        <p className="text-3xl font-serif text-orange-900 mt-1">{stats.hot}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider font-sans">Pending Orders</p>
                        <p className="text-3xl font-serif text-blue-900 mt-1">{stats.pendingSamples > 0 ? stats.pendingSamples : 0}</p>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
                    {['all', 'new', 'contacted', 'converted', 'lost'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${statusFilter === status
                                ? 'bg-[var(--ink)] text-white shadow-md'
                                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            {status === 'all' ? 'All Leads' : status}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {status === 'all' ? leads.length : leads.filter(l => l.status === status).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* List View */}
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {paginatedLeads.length > 0 ? (
                        paginatedLeads.map((lead, index) => (
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
                                                    <h3 className="font-bold text-lg text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors">{lead.contact}</h3>
                                                    {getSeriousnessBadge(lead)}
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                        {lead.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 font-sans">
                                                    <span>{lead.role}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{lead.city}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="font-mono text-xs text-gray-400">{new Date(lead.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100 group-hover:bg-[var(--sand)]/30 transition-colors">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Product</label>
                                                <p className="font-medium text-sm text-[var(--ink)]">{lead.product}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Quantity</label>
                                                <p className="font-medium text-sm text-[var(--ink)]">{lead.quantity}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Timeline</label>
                                                <p className="font-medium text-sm text-[var(--ink)]">{lead.timeline || '-'}</p>
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
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-bold">{filteredLeads.length}</span> leads
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
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
                                        <h2 className="text-3xl font-serif text-[var(--ink)]">{selectedLead.contact}</h2>
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
                                            href={quoteResult ? `https://wa.me/${selectedLead.contact?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(quoteResult)}` : `https://wa.me/${selectedLead.contact?.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`px-4 py-2 ${quoteResult ? 'bg-green-600 hover:bg-green-700' : 'bg-[#25D366] hover:bg-[#128C7E]'} text-white rounded-lg text-sm font-bold transition-colors flex items-center shadow-lg shadow-green-200`}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            {quoteResult ? 'Send Quote via WA' : 'WhatsApp'}
                                        </a>

                                        <button onClick={() => setShowQuoteCalc(!showQuoteCalc)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold border border-gray-200">
                                            {showQuoteCalc ? 'Close' : '⚡ Quote'}
                                        </button>

                                        <button onClick={() => handleDelete(selectedLead._id)} className="text-red-400 text-sm hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* QUOTE GENERATOR - CONVERSION TOOL */}
                                {showQuoteCalc && (
                                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl animate-in slide-in-from-top-2">
                                        <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                            Fast Quote Generator
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-xs font-bold uppercase text-blue-400">Price / Unit</label>
                                                <div className="flex items-center mt-1">
                                                    <span className="bg-white border-y border-l border-blue-200 px-3 py-2 rounded-l-lg text-gray-500 text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        value={quotePrice}
                                                        onChange={(e) => setQuotePrice(e.target.value)}
                                                        className="w-full p-2 border border-blue-200 rounded-r-lg outline-none focus:border-blue-500 font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-end">
                                                <button onClick={handleCalculateQuote} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-sm">
                                                    Calculate 🧮
                                                </button>
                                            </div>
                                        </div>

                                        {quoteResult && (
                                            <div className="relative space-y-3">
                                                <textarea
                                                    readOnly
                                                    value={quoteResult}
                                                    className="w-full h-32 text-sm p-3 rounded-lg border border-blue-200 focus:outline-none bg-white resize-none font-mono text-gray-600"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { navigator.clipboard.writeText(quoteResult); alert('Copied!'); }}
                                                        className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-600 font-bold flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                        Copy Text
                                                    </button>
                                                    <button
                                                        onClick={handleDownloadPDF}
                                                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded font-bold flex items-center gap-1 border border-red-100"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                        Download PDF
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Detailed Information Grid */}
                                <div className="space-y-6">

                                    {/* SECTION 1: CONTACT CARD */}
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Profile</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                                                <p className="font-bold text-[var(--ink)]">{selectedLead.contact}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Firm / Company</label>
                                                <p className="font-bold text-[var(--ink)]">{selectedLead.firmName || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                                                <p className="text-sm font-medium text-[var(--ink)] break-all">{selectedLead.email || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                                                <p className="font-medium text-[var(--ink)]">{selectedLead.city}</p>
                                            </div>
                                            {selectedLead.address && (
                                                <div className="col-span-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Shipping Address</label>
                                                    <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200 mt-1">{selectedLead.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Col: Specs */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-lg text-[var(--ink)] border-b pb-2">Requirement Specs</h3>

                                            <div className="bg-white border rounded-xl overflow-hidden shadow-sm group">
                                                <div className="h-40 bg-gray-100 relative">
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
                                                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                                                        <h4 className="text-white font-bold text-lg shadow-black/50 drop-shadow-md">{selectedLead.product}</h4>
                                                    </div>
                                                </div>
                                                <div className="p-4 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 font-bold uppercase">Quantity</label>
                                                        <p className="font-bold text-[var(--ink)]">{selectedLead.quantity}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 font-bold uppercase">Timeline</label>
                                                        <p className="font-bold text-[var(--ink)]">{selectedLead.timeline || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedLead.requirement && (
                                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">Custom Request</label>
                                                    <p className="text-gray-700 text-sm">{selectedLead.requirement}</p>
                                                </div>
                                            )}

                                            <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                                                <label className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1 block">Client Message</label>
                                                <p className="text-[var(--ink)] text-sm whitespace-pre-wrap">{selectedLead.notes || "No message provided."}</p>
                                            </div>
                                        </div>

                                        {/* Right Col: Admin Log */}
                                        <div className="bg-gray-50 rounded-xl p-6 h-full flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-lg text-[var(--ink)]">Admin Activity Log</h3>
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
                                                    className="w-full mt-2 bg-[var(--ink)] text-white py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSavingNote ? 'Saving...' : 'Add Log Entry'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
