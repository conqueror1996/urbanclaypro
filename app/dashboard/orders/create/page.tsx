'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPaymentLink, findZohoLeads } from '@/app/actions/payment-link';
import { getProductDropdownData } from '@/app/actions/product-fetcher';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateOrderPage() {
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Zoho Search States
    const [zohoResults, setZohoResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    // Form Data states for Preview
    const [formData, setFormData] = useState<any>({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        productName: '',
        amount: '',
        deliveryTimeline: '3-4 Weeks',
        terms: '1. Standard delivery timeline is 3-4 weeks from payment.\n2. Goods once sold cannot be returned.\n3. Unloading at site is client responsibility.',
        expiryDate: ''
    });

    useEffect(() => {
        getProductDropdownData().then(setProducts);
    }, []);

    const handleZohoSearch = async (val: string) => {
        setSearchQuery(val);
        if (val.length < 3) {
            setZohoResults([]);
            return;
        }
        setIsSearching(true);
        const res = await findZohoLeads(val);
        if (res.success) setZohoResults(res.leads);
        setIsSearching(false);
    };

    const selectLead = (lead: any) => {
        setFormData({
            ...formData,
            clientName: lead.name,
            clientEmail: lead.email,
            clientPhone: lead.phone
        });
        setSearchQuery('');
        setZohoResults([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setGeneratedLink(null);

        const data = {
            ...formData,
            // Combined product and variant for the actual link
            productName: formData.variantNote ? `${formData.productSelect} (${formData.variantNote})` : formData.productSelect,
            amount: formData.amount,
        };

        const result = await createPaymentLink(data);
        setLoading(false);

        if (result.success) {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://claytile.in';
            const fullLink = result.linkPath ? `${origin}${result.linkPath}` : '';
            setGeneratedLink(fullLink);
        } else {
            alert('Failed to create link');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans relative">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-serif text-[#2A1E16] mb-2">Invoice Generator</h1>
                    <p className="text-gray-500 text-sm">Draft, Preview, and Send secure payment links.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        <div className="bg-[#2A1E16] px-8 py-4 flex justify-between items-center text-white/90">
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">Create Official Invoice</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                                >
                                    Preview Mode
                                </button>
                            </div>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-6 text-gray-800">
                            {/* Zoho Search Bar */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Zoho CRM Search (Name/Email/Phone)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search for a client in Zoho..."
                                        className="w-full p-3 pl-10 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none transition-all placeholder:text-gray-300"
                                        value={searchQuery}
                                        onChange={(e) => handleZohoSearch(e.target.value)}
                                    />
                                    {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 scale-50"><div className="w-5 h-5 border-2 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin" /></div>}
                                </div>

                                <AnimatePresence>
                                    {zohoResults.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-20 top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="max-h-60 overflow-y-auto">
                                                {zohoResults.map(lead => (
                                                    <button
                                                        key={lead.id}
                                                        type="button"
                                                        onClick={() => selectLead(lead)}
                                                        className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <div className="font-bold text-[#2A1E16]">{lead.name}</div>
                                                            <div className="text-xs text-gray-400">{lead.email} • {lead.phone}</div>
                                                        </div>
                                                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500 uppercase font-bold tracking-tighter">CRM Match</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1">Company / Name</label>
                                        <input name="clientName" required value={formData.clientName} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1">Email</label>
                                        <input name="clientEmail" required type="email" value={formData.clientEmail} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1">Phone</label>
                                        <input name="clientPhone" required type="tel" value={formData.clientPhone} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Specifics</h3>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1">Select Product</label>
                                        <select name="productSelect" required value={formData.productSelect} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50">
                                            <option value="" disabled>-- Catalog --</option>
                                            {products.map(p => <option key={p._id} value={p.title}>{p.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1">Variant / Note</label>
                                        <input name="variantNote" value={formData.variantNote} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50" placeholder="e.g. Size, Tone, etc." />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1">Amount (₹)</label>
                                            <input name="amount" required type="number" value={formData.amount} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 font-mono font-bold" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1">Valid Until (Expiry)</label>
                                            <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange} className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Final Terms & Conditions</label>
                                <textarea name="terms" rows={3} value={formData.terms} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 text-xs font-mono text-gray-500 leading-relaxed" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowPreview(true)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                    👁️ Preview Draft
                                </button>
                                <button disabled={loading} className="flex-[2] py-4 bg-[#b45a3c] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#92442d] transition-all disabled:opacity-50">
                                    {loading ? 'Creating...' : 'Secure & Generate Link'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: SUCCESS FEEDBACK */}
                    <div className="lg:col-span-1">
                        <AnimatePresence>
                            {generatedLink ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-2xl border border-green-100 shadow-xl text-center">
                                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Authenticated!</h3>
                                    <p className="text-gray-500 text-sm mb-6">Security signatures applied. Send this link to the client.</p>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 flex items-center gap-2">
                                        <input readOnly value={generatedLink} className="flex-1 bg-transparent text-xs text-gray-600 outline-none truncate" />
                                        <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="text-lg">📋</button>
                                    </div>

                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Hi, please find the payment link for your UrbanClay order: ${generatedLink}`)}`}
                                        target="_blank"
                                        className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                                    >
                                        Share on WhatsApp
                                    </a>
                                </motion.div>
                            ) : (
                                <div className="bg-gray-100/50 p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 italic font-serif">
                                    Constructing your digital invoice engine...
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1a1512]/90 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
                            <div className="bg-[#2A1E16] p-6 text-center text-white relative">
                                <button onClick={() => setShowPreview(false)} className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">✕</button>
                                <p className="text-[var(--terracotta)] font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Internal Preview</p>
                                <h2 className="text-2xl font-serif">Pro-forma Invoice</h2>
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="flex justify-between border-b border-gray-50 pb-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">Billed To</p>
                                        <h4 className="text-xl font-bold text-[#2A1E16]">{formData.clientName || 'N/A'}</h4>
                                        <p className="text-sm text-gray-500">{formData.clientEmail || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{formData.clientPhone || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">Validity</p>
                                        <p className="text-sm font-bold text-red-500">{formData.expiryDate ? `Expires: ${new Date(formData.expiryDate).toLocaleDateString()}` : 'No Expiry Set'}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-bold text-[#2A1E16]">{formData.productSelect || 'No Product Selected'}</p>
                                        <p className="text-xs text-gray-500">{formData.variantNote || 'No variant notes'}</p>
                                    </div>
                                    <p className="text-2xl font-serif font-bold text-[#b45a3c]">₹{Number(formData.amount).toLocaleString('en-IN')}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Terms & Conditions</p>
                                    <div className="text-[11px] text-gray-500 leading-relaxed font-mono whitespace-pre-wrap pl-4 border-l-2 border-gray-100">
                                        {formData.terms}
                                    </div>
                                </div>

                                <button onClick={() => setShowPreview(false)} className="w-full py-4 bg-[#2A1E16] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all">
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
