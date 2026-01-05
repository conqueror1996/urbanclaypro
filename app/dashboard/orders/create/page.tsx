'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPaymentLink, findZohoLeads, verifyGST } from '@/app/actions/payment-link';
import { getProductDropdownData } from '@/app/actions/product-fetcher';
import { motion, AnimatePresence } from 'framer-motion';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CreateOrderPage() {
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Zoho Search States
    const [zohoResults, setZohoResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Product Search State
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
    const [isClientEditing, setIsClientEditing] = useState(true);

    // Close Dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setActiveSearchIndex(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Form Data states
    const [formData, setFormData] = useState<any>({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        gstNumber: '',
        panNumber: '',

        // Granular Billing Address
        billingAttention: '',
        billingStreet: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingCountry: 'India',

        // Granular Shipping Address
        shippingAttention: '',
        shippingStreet: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        shippingCountry: 'India',

        deliveryTimeline: '3-4 Weeks',
        terms: '1. 100% Advance Payment.\n2. Goods once sold cannot be returned.\n3. Unloading at site is client responsibility.',
        customerNotes: '',
        expiryDate: '',
        shippingCharges: 0,
        adjustment: 0,
        tdsOption: 'none',
        tdsRate: 0,
        lineItems: [
            { name: '', description: '', hsnCode: '', unit: 'pcs', quantity: 1, rate: 0, discount: 0, taxRate: 18, taxId: '' }
        ]
    });

    useEffect(() => {
        getProductDropdownData().then(data => {
            console.log("Loaded products:", data ? data.length : 0);
            if (data) setProducts(data);
        });
    }, []);

    // GST Fetcher Logic
    const handleGSTVerify = async () => {
        if (!formData.gstNumber) return;
        setLoading(true);
        const res = await verifyGST(formData.gstNumber);
        setLoading(false);
        if (res.success && res.data) {
            setFormData({
                ...formData,
                clientName: res.data.tradeName || formData.clientName,
                // Auto-populate Billing
                billingStreet: res.data.address || '',
                billingCity: res.data.city || '',
                billingState: res.data.state || '',
                billingZip: res.data.pincode || '',
                // Copy to Shipping by default
                shippingStreet: res.data.address || '',
                shippingCity: res.data.city || '',
                shippingState: res.data.state || '',
                shippingZip: res.data.pincode || '',
            });
        } else {
            alert(res.error || 'GST Verification failed');
        }
    };

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
        setIsClientEditing(false); // Switch to "Read Mode" after selection
    };

    const addLineItem = () => {
        setFormData({
            ...formData,
            lineItems: [...formData.lineItems, { name: '', description: '', hsnCode: '', unit: 'pcs', quantity: 1, rate: 0, discount: 0, taxRate: 18, taxId: '' }]
        });
    };

    // ... (removeLineItem, updateLineItem, handleInputChange, calculateTotals remain mostly same)

    // BUT we need to update the Address Section in the return JSX
    // AND the Line Items Table to include HSN Code

    // ... [Original removeLineItem, updateLineItem, handleInputChange, calculateTotals impl] ...

    const removeLineItem = (index: number) => {
        if (formData.lineItems.length === 1) return;
        const newItems = [...formData.lineItems];
        newItems.splice(index, 1);
        setFormData({ ...formData, lineItems: newItems });
    };

    const updateLineItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.lineItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, lineItems: newItems });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalTax = 0;
        let totalDiscount = 0;

        formData.lineItems.forEach((item: any) => {
            const lineSubtotal = item.rate * item.quantity;
            const lineDiscount = lineSubtotal * (item.discount / 100);
            const taxableAmount = lineSubtotal - lineDiscount;
            const lineTax = taxableAmount * (item.taxRate / 100);

            subtotal += lineSubtotal;
            totalDiscount += lineDiscount;
            totalTax += lineTax;
        });

        const netBeforeAdjustments = subtotal - totalDiscount + totalTax + Number(formData.shippingCharges);
        let finalTotal = netBeforeAdjustments + Number(formData.adjustment);

        if (formData.tdsOption === 'tds') {
            finalTotal -= (subtotal - totalDiscount) * (formData.tdsRate / 100);
        } else if (formData.tdsOption === 'tcs') {
            finalTotal += (subtotal - totalDiscount) * (formData.tdsRate / 100);
        }

        return { subtotal, totalTax, totalDiscount, finalTotal };
    };

    const { subtotal, totalTax, totalDiscount, finalTotal } = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeneratedLink(null);
        setGeneratedOrderId(null);

        // 1. Sync Shipping Fields if Toggle is ON
        let finalFormData = { ...formData };
        if (shippingSameAsBilling) {
            finalFormData.shippingAttention = formData.billingAttention;
            finalFormData.shippingStreet = formData.billingStreet;
            finalFormData.shippingCity = formData.billingCity;
            finalFormData.shippingState = formData.billingState;
            finalFormData.shippingZip = formData.billingZip;
            finalFormData.shippingCountry = formData.billingCountry;
        }

        // Construct composite address for the simple view/backend compatibility
        const billingAddressComposite = [finalFormData.billingAttention, finalFormData.billingStreet, finalFormData.billingCity, finalFormData.billingState, finalFormData.billingZip].filter(Boolean).join(', ');

        const shippingAddressComposite = [finalFormData.shippingAttention, finalFormData.shippingStreet, finalFormData.shippingCity, finalFormData.shippingState, finalFormData.shippingZip].filter(Boolean).join(', ');

        const data = {
            ...finalFormData,
            billingAddress: billingAddressComposite,
            shippingAddress: shippingAddressComposite,
            amount: finalTotal,
        };

        const result = await createPaymentLink(data);
        setLoading(false);

        if (result.success) {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://claytile.in';
            setGeneratedLink(`${origin}${result.linkPath}`);
            setGeneratedOrderId(result.orderId || '');
        } else {
            alert('Failed to generate secure link');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaf9] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header ... */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif text-[#2a1e16] tracking-tight">Generate Professional Invoice</h1>
                        <p className="text-gray-500 mt-1">Enterprise-grade secure payment links with full Zoho integration.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="flex-1 md:flex-none px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-white transition-all shadow-sm"
                        >
                            👁️ Live Preview
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Client & GST Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 bg-[var(--terracotta)] text-white rounded-lg flex items-center justify-center font-bold text-sm">01</span>
                                <h3 className="font-bold text-lg text-[#2a1e16]">Client Information</h3>
                            </div>

                            {(!isClientEditing && formData.clientName) ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-50/50 p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col md:flex-row justify-between items-start gap-4 mb-6 hover:border-black/10 transition-colors group"
                                >
                                    <div className="flex gap-5">
                                        <div className="w-14 h-14 bg-[#2a1e16] text-[var(--terracotta)] rounded-2xl flex items-center justify-center font-serif text-2xl shadow-inner shrink-0">
                                            {formData.clientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2a1e16] text-xl mb-1">{formData.clientName}</h4>
                                            <div className="flex flex-wrap gap-y-1 gap-x-4">
                                                <span className="text-sm text-gray-500 flex items-center gap-1.5 focus:text-black transition-colors">
                                                    <span className="opacity-50">📧</span> {formData.clientEmail}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1.5 focus:text-black transition-colors">
                                                    <span className="opacity-50">📞</span> {formData.clientPhone}
                                                </span>
                                            </div>
                                            {(formData.gstNumber || formData.panNumber) && (
                                                <div className="flex gap-2 mt-4">
                                                    {formData.gstNumber && <span className="text-[10px] font-mono bg-white border border-gray-100 px-2.5 py-1 rounded-lg text-gray-400 font-bold">GST: {formData.gstNumber.toUpperCase()}</span>}
                                                    {formData.panNumber && <span className="text-[10px] font-mono bg-white border border-gray-100 px-2.5 py-1 rounded-lg text-gray-400 font-bold">PAN: {formData.panNumber.toUpperCase()}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsClientEditing(true)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] bg-[var(--terracotta)]/5 px-4 py-2 rounded-xl hover:bg-[var(--terracotta)] hover:text-white transition-all self-end md:self-start border border-[var(--terracotta)]/10"
                                    >
                                        Edit Client Details
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zoho CRM Quick Lookup</label>
                                            {formData.clientName && (
                                                <button type="button" onClick={() => setIsClientEditing(false)} className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">← Back to Profile</button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search by Name, Email or Phone..."
                                                className="w-full p-4 pl-12 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all shadow-sm"
                                                value={searchQuery}
                                                onChange={(e) => handleZohoSearch(e.target.value)}
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 opacity-50 text-xl">🔍</span>
                                        </div>
                                        <AnimatePresence>
                                            {zohoResults.length > 0 && (
                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-30 top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                                                    {zohoResults.map(lead => (
                                                        <button key={lead.id} type="button" onClick={() => selectLead(lead)} className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 flex justify-between group transition-colors">
                                                            <div>
                                                                <div className="font-bold text-[#2a1e16] group-hover:text-[var(--terracotta)] transition-colors">{lead.name}</div>
                                                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{lead.email} • {lead.phone}</div>
                                                            </div>
                                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold self-center shadow-sm">CRM MATCH</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Company / Display Name</label>
                                            <input name="clientName" required value={formData.clientName} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email ID</label>
                                            <input name="clientEmail" required type="email" value={formData.clientEmail} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Primary Phone</label>
                                            <input name="clientPhone" required value={formData.clientPhone} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex justify-between">
                                                <span>GST Number</span>
                                                <button type="button" onClick={handleGSTVerify} className="text-[var(--terracotta)] hover:underline font-bold tracking-tighter">Verify & Auto-fill</button>
                                            </label>
                                            <input name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="e.g. 29AAAAA0000A1Z5" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 uppercase font-mono focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">PAN Card #</label>
                                            <input name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 uppercase font-mono focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Expiry Date</label>
                                            <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}     {/* UNIFIED ADDRESS SECTION */}
                            <div className="md:col-span-2 pt-4 border-t border-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Address Details
                                    </h4>
                                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${shippingSameAsBilling ? 'bg-[var(--terracotta)]' : 'bg-gray-200'}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={shippingSameAsBilling}
                                                onChange={(e) => setShippingSameAsBilling(e.target.checked)}
                                            />
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${shippingSameAsBilling ? 'left-6' : 'left-1'}`} />
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${shippingSameAsBilling ? 'text-[var(--terracotta)]' : 'text-gray-400'}`}>Shipping same as Billing</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Billing Address */}
                                    <div className="bg-gray-50/30 p-4 rounded-2xl border border-gray-100 space-y-3 hover:border-black/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Billing Address</span>
                                        </div>
                                        <input name="billingAttention" value={formData.billingAttention} onChange={handleInputChange} placeholder="Attention / Department (Optional)" className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400 font-medium" />
                                        <textarea name="billingStreet" value={formData.billingStreet} onChange={handleInputChange} placeholder="Street Address / Area" rows={2} className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400 resize-none font-medium" />
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            <input name="billingCity" value={formData.billingCity} onChange={handleInputChange} placeholder="City" className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400" />
                                            <div className="relative">
                                                <select
                                                    name="billingState"
                                                    value={formData.billingState}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none appearance-none cursor-pointer pr-8"
                                                >
                                                    <option value="">Select State</option>
                                                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 text-[10px]">▼</div>
                                            </div>
                                            <input name="billingZip" value={formData.billingZip} onChange={handleInputChange} placeholder="Zip" className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400" />
                                            <input name="billingCountry" value={formData.billingCountry} onChange={handleInputChange} placeholder="IN" className="w-full p-2 bg-gray-50/50 text-sm border-b border-gray-200 text-gray-400 cursor-not-allowed rounded-none" readOnly />
                                        </div>
                                    </div>

                                    {/* Shipping Address (Conditional) */}
                                    {!shippingSameAsBilling && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50/30 p-4 rounded-2xl border border-gray-100 space-y-3 hover:border-black/10 transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Shipping Address</span>
                                            </div>
                                            <input name="shippingAttention" value={formData.shippingAttention} onChange={handleInputChange} placeholder="Attention / Contact Person" className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400 font-medium" />
                                            <textarea name="shippingStreet" value={formData.shippingStreet} onChange={handleInputChange} placeholder="Street Address / Site Location" rows={2} className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400 resize-none font-medium" />
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                <input name="shippingCity" value={formData.shippingCity} onChange={handleInputChange} placeholder="City" className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400" />
                                                <div className="relative">
                                                    <select
                                                        name="shippingState"
                                                        value={formData.shippingState}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none appearance-none cursor-pointer pr-8"
                                                    >
                                                        <option value="">Select State</option>
                                                        {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                                                    </select>
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 text-[10px]">▼</div>
                                                </div>
                                                <input name="shippingZip" value={formData.shippingZip} onChange={handleInputChange} placeholder="Zip" className="w-full p-2 bg-transparent text-sm border-b border-gray-200 focus:border-black focus:ring-0 rounded-none placeholder-gray-400" />
                                                <input name="shippingCountry" value={formData.shippingCountry} onChange={handleInputChange} placeholder="IN" className="w-full p-2 bg-gray-50/50 text-sm border-b border-gray-200 text-gray-400 cursor-not-allowed rounded-none" readOnly />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Line Items - Clean & Minimal */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50/50">
                                <h3 className="font-bold text-lg text-[#2a1e16]">Items</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50 text-left bg-gray-50/30">
                                            <th className="px-8 py-3 w-[45%] pl-8">Details</th>
                                            <th className="px-4 py-3 w-[15%] text-center">Qty</th>
                                            <th className="px-4 py-3 w-[15%] text-right hidden lg:table-cell">Rate (₹)</th>
                                            <th className="px-4 py-3 w-[10%] text-right font-light">Tax %</th>
                                            <th className="px-8 py-3 w-[15%] text-right pr-8">Total</th>
                                            <th className="w-[5%]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {formData.lineItems.map((item: any, idx: number) => {
                                            // define filter logic inside map to access scope, or better, memoize outside. 
                                            // For simplicity/perf in this specific file structure:
                                            const matches = (item.name && item.name.length > 1)
                                                ? products.filter((p: any) => p.title.toLowerCase().includes(item.name.toLowerCase()))
                                                : [];

                                            return (
                                                <tr key={idx} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 even:bg-gray-50/30">
                                                    <td className="px-8 py-6 align-top pl-8 relative">
                                                        <div className="flex gap-4">
                                                            {/* Product Image Thumbnail */}
                                                            {item.imageUrl && (
                                                                <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                                                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}

                                                            <div className="flex-1 relative">
                                                                <input
                                                                    value={item.name}
                                                                    onChange={(e) => updateLineItem(idx, 'name', e.target.value)}
                                                                    onFocus={() => setActiveSearchIndex(idx)}
                                                                    // Don't blur immediately to allow clicking dropdown
                                                                    placeholder="Item Name (Type to search stock...)"
                                                                    className="w-full font-bold text-[#2a1e16] placeholder-gray-300 bg-transparent border-b border-black focus:border-black focus:ring-0 px-0 py-2 text-base mb-2 leading-relaxed rounded-none placeholder:font-normal transition-all"
                                                                    autoComplete="off"
                                                                />

                                                                {/* Search Dropdown */}
                                                                {activeSearchIndex === idx && matches.length > 0 && (
                                                                    <div className="absolute z-50 top-full left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                                                                        {matches.map((product: any) => (
                                                                            <button
                                                                                key={product._id}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    // Auto-fill logic
                                                                                    const price = product.priceRange ? parseFloat(product.priceRange.replace(/[^0-9.]/g, '')) : 0;
                                                                                    const newItems = [...formData.lineItems];
                                                                                    newItems[idx] = {
                                                                                        ...newItems[idx],
                                                                                        name: product.title,
                                                                                        description: product.category || item.description,
                                                                                        rate: price || item.rate,
                                                                                        imageUrl: product.imageUrl
                                                                                    };
                                                                                    setFormData({ ...formData, lineItems: newItems });
                                                                                    setActiveSearchIndex(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                                                                            >
                                                                                {product.imageUrl ? (
                                                                                    <img src={product.imageUrl} className="w-8 h-8 rounded object-cover bg-gray-100" />
                                                                                ) : (
                                                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-[10px]">📷</div>
                                                                                )}
                                                                                <div>
                                                                                    <div className="text-sm font-bold text-gray-800">{product.title}</div>
                                                                                    <div className="text-[10px] text-gray-500">{product.category}</div>
                                                                                </div>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                                                                    <textarea
                                                                        value={item.description}
                                                                        onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                                                                        placeholder="Add description..."
                                                                        rows={1}
                                                                        className="flex-1 text-sm text-gray-600 placeholder-gray-300 bg-transparent border-b border-black focus:border-black focus:ring-0 px-0 py-2 resize-none rounded-none transition-all"
                                                                        style={{ minHeight: '38px' }}
                                                                        onInput={(e: any) => {
                                                                            e.target.style.height = 'auto';
                                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                                        }}
                                                                    />
                                                                    <input
                                                                        value={item.hsnCode}
                                                                        onChange={(e) => updateLineItem(idx, 'hsnCode', e.target.value)}
                                                                        placeholder="HSN / SAC"
                                                                        className="w-32 text-sm text-gray-600 font-bold bg-gray-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 uppercase placeholder-gray-400 hidden md:block"
                                                                        title="HSN/SAC Code"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mobile Rate Input */}
                                                        <div className="lg:hidden mt-4 flex items-center gap-3">
                                                            <span className="text-xs text-gray-400">Rate:</span>
                                                            <input
                                                                type="number"
                                                                value={item.rate}
                                                                onChange={(e) => updateLineItem(idx, 'rate', Number(e.target.value))}
                                                                className="w-24 text-sm bg-gray-50 rounded-lg px-3 py-2 border-none font-bold text-gray-700"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6 align-top">
                                                        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-black transition-colors h-10 w-24 mx-auto">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={item.quantity}
                                                                onChange={(e) => updateLineItem(idx, 'quantity', Number(e.target.value))}
                                                                className="w-full h-full text-center bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-gray-700"
                                                            />
                                                            <div className="h-full border-l border-gray-100 bg-gray-50 flex items-center justify-center px-1">
                                                                <select
                                                                    value={item.unit || 'pcs'}
                                                                    onChange={(e) => updateLineItem(idx, 'unit', e.target.value)}
                                                                    className="bg-transparent border-none text-[10px] uppercase font-bold text-gray-500 focus:ring-0 p-0 cursor-pointer w-full text-center appearance-none px-1"
                                                                >
                                                                    <option value="pcs">Pcs</option>
                                                                    <option value="sqft">Sq.ft</option>
                                                                    <option value="box">Box</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6 align-top text-right hidden lg:table-cell">
                                                        <div className="flex flex-col items-end gap-2">
                                                            <div className="relative">
                                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={item.rate}
                                                                    onChange={(e) => updateLineItem(idx, 'rate', Number(e.target.value))}
                                                                    className="w-32 text-right bg-transparent border-b border-gray-200 hover:border-black focus:border-black p-1 pl-4 text-base font-mono text-gray-700 focus:ring-0 transition-colors placeholder-gray-300 no-spinner"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                                                <label className="text-[10px] text-gray-400 uppercase font-bold">Disc %</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    value={item.discount}
                                                                    onChange={(e) => updateLineItem(idx, 'discount', Number(e.target.value))}
                                                                    className="w-12 text-right bg-gray-50 rounded px-2 py-0.5 text-xs border border-transparent focus:border-black focus:ring-0 text-orange-600 font-bold no-spinner"
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6 align-top text-right">
                                                        <div className="mt-1">
                                                            <select
                                                                value={item.taxRate}
                                                                onChange={(e) => updateLineItem(idx, 'taxRate', Number(e.target.value))}
                                                                className="text-right bg-gray-50 border-none rounded-lg text-gray-600 text-xs font-bold focus:ring-0 cursor-pointer py-1.5 px-2"
                                                            >
                                                                {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 align-top text-right pr-8">
                                                        <div className="font-bold text-[#2a1e16] text-lg mt-0.5">
                                                            ₹{((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-6 align-top text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLineItem(idx)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                            title="Remove Line"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                        {/* Minimal Add Button */}
                                        <tr>
                                            <td colSpan={6} className="px-8 py-4 bg-gray-50/20 border-t border-dashed border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={addLineItem}
                                                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[var(--terracotta)] transition-colors group"
                                                >
                                                    <div className="w-5 h-5 rounded-full border border-gray-300 group-hover:border-[var(--terracotta)] flex items-center justify-center transition-colors">
                                                        <span className="leading-none mb-0.5">+</span>
                                                    </div>
                                                    <span>Add another line item</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Items Summary Footer */}
                            <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex justify-end items-center gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Qty</p>
                                    <p className="font-bold text-gray-700">{formData.lineItems.reduce((acc: any, i: any) => acc + Number(i.quantity), 0)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Subtotal (Excl. Tax)</p>
                                    <p className="font-bold text-xl text-[#2a1e16]">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Notes ... */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-gray-100 text-[#2a1e16] rounded-lg flex items-center justify-center font-bold text-sm">03</span>
                                <h3 className="font-bold text-lg text-[#2a1e16]">Delivery & Logistics</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Standard Delivery Timeline</label>
                                    <input name="deliveryTimeline" value={formData.deliveryTimeline} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-lg bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Customer Notes (Printed on Invoice)</label>
                                    <input name="customerNotes" value={formData.customerNotes} onChange={handleInputChange} placeholder="e.g. Please call before unloading" className="w-full p-4 border border-gray-100 rounded-lg bg-gray-50/50 focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Public Terms & Disclaimer</label>
                                    <textarea name="terms" rows={3} value={formData.terms} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 text-[11px] font-mono leading-relaxed focus:bg-white focus:border-black focus:ring-0 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT PANEL: SUMMARY & ACTIONS (4 cols) */}
                    <div className="lg:col-span-4 sticky top-8 space-y-6">
                        <div className="bg-[#2a1e16] text-white p-8 rounded-3xl shadow-2xl shadow-[#2a1e16]/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            </div>

                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] mb-8">Order Settlement</h3>

                            <div className="space-y-4 font-sans border-b border-white/5 pb-8 mb-8">
                                <div className="flex justify-between text-white/60">
                                    <span className="text-sm">Pre-tax Subtotal</span>
                                    <span className="font-mono">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span className="text-sm text-emerald-400">Total Discount</span>
                                    <span className="font-mono text-emerald-400">-₹{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span className="text-sm">Taxes (GST)</span>
                                    <span className="font-mono">₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className="relative">
                                        <label className="block text-[10px] uppercase font-bold text-white/30 mb-1">Logistics / Shipping</label>
                                        <input
                                            name="shippingCharges"
                                            type="number"
                                            min="0"
                                            value={formData.shippingCharges}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setFormData({ ...formData, shippingCharges: val < 0 ? 0 : val });
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono no-spinner focus:bg-white/10 focus:border-white/30 focus:ring-0 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[10px] uppercase font-bold text-white/30 mb-1">Manual Adjustment</label>
                                        <input
                                            name="adjustment"
                                            type="number"
                                            value={formData.adjustment}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono no-spinner focus:bg-white/10 focus:border-white/30 focus:ring-0 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] uppercase font-bold text-white/30 mb-3 tracking-widest text-center">Settlement Structure</label>
                                            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                                                {[
                                                    { id: 'none', label: 'Standard' },
                                                    { id: 'tds', label: 'TDS (Direct)' },
                                                    { id: 'tcs', label: 'TCS (Apply)' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, tdsOption: opt.id })}
                                                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${formData.tdsOption === opt.id
                                                            ? 'bg-[var(--terracotta)] text-white shadow-lg scale-[1.02]'
                                                            : 'text-white/30 hover:text-white/60'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {formData.tdsOption !== 'none' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="col-span-2 space-y-2">
                                                <label className="block text-[10px] uppercase font-bold text-white/30 tracking-widest">Rate Percentage (%)</label>
                                                <div className="relative">
                                                    <input
                                                        name="tdsRate"
                                                        type="number"
                                                        step="0.1"
                                                        value={formData.tdsRate}
                                                        onChange={handleInputChange}
                                                        placeholder="0.0"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono text-center focus:border-[var(--terracotta)] focus:ring-0 focus:ring-offset-0 outline-none transition-colors no-spinner"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">%</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8 pt-8 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-[var(--terracotta)] mb-2 tracking-[0.2em]">Collectible Amount</p>
                                    <h2 className="text-5xl font-serif text-white tracking-tighter">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</h2>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-5 bg-[var(--terracotta)] text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-2xl shadow-orange-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Authorizing Secure Engine...' : 'Authorize & Sign Link'}
                            </button>

                            {generatedLink && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">✓</div>
                                        <p className="text-xs font-bold text-white/80">Signature Applied. Valid for {formData.expiryDate || 'Unlimited Time'}.</p>
                                    </div>
                                    <div className="flex bg-white/5 rounded-lg border border-white/5 p-2 gap-2">
                                        <input readOnly value={generatedLink} className="bg-transparent border-none text-[10px] text-white/60 flex-1 outline-none" />
                                        <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="p-1 hover:text-[var(--terracotta)] transition-colors">📋</button>
                                    </div>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Hi, please find your UrbanClay Secure Invoice: ${generatedLink}`)}`}
                                        target="_blank"
                                        className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all text-xs"
                                    >
                                        Share on WhatsApp
                                    </a>

                                    {generatedOrderId && (
                                        <a
                                            href={`/api/invoice/${generatedOrderId}/pdf`}
                                            target="_blank"
                                            className="w-full py-3 bg-[var(--ink)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all text-xs border border-white/10"
                                        >
                                            <span className="text-lg">📄</span> Download PDF
                                        </a>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </form>
            </div >

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {
                    showPreview && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1a1512]/95 backdrop-blur-xl flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                                {/* Modal Content - Scrollable Part */}
                                <div className="overflow-y-auto custom-scrollbar bg-white relative">
                                    {/* Top Accent Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--terracotta)]"></div>

                                    <div className="p-12 pt-16">
                                        {/* HEADER */}
                                        <div className="flex justify-between items-start mb-16">
                                            <div className="flex items-center gap-4">
                                                {/* Logo Placeholder - simplified for HTML */}
                                                <div className="w-12 h-12 bg-[#2a1e16] text-white flex items-center justify-center font-serif text-2xl font-bold rounded-sm">U</div>
                                                <div>
                                                    <h2 className="text-xl font-serif font-bold text-[#1a1c1e] tracking-tight">UrbanClay Architecture Pvt. Ltd.</h2>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Premium Clay Solutions</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-4xl font-serif font-bold text-[#1a1c1e] tracking-tight">PROFORMA</h2>
                                                <p className="text-sm font-bold text-[var(--terracotta)] mt-2">{generatedOrderId || 'DRAFT'}</p>
                                                <div className="mt-4 text-xs space-y-1 text-gray-500 text-right">
                                                    <p><span className="text-gray-400 mr-2">Date:</span> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    {formData.expiryDate && <p><span className="text-gray-400 mr-2">Valid Until:</span> <span className="text-[var(--terracotta)] font-bold">{new Date(formData.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-gray-100 mb-12"></div>

                                        {/* CLIENT & INFO GRID */}
                                        <div className="grid grid-cols-2 gap-16 mb-16">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</p>
                                                <h4 className="text-xl font-serif font-bold text-[#1a1c1e] mb-2">{formData.clientName || 'Valued Client'}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap max-w-sm font-medium">{formData.billingAddress || 'No address provided'}</p>

                                                <div className="mt-6 space-y-1">
                                                    {(formData.clientEmail) && <p className="text-xs text-gray-500">Email: {formData.clientEmail}</p>}
                                                    {(formData.clientPhone) && <p className="text-xs text-gray-500">Phone: {formData.clientPhone}</p>}
                                                </div>

                                                {(formData.gstNumber) && (
                                                    <div className="mt-4">
                                                        <span className="text-[10px] font-bold text-[#1a1c1e]">GSTIN: {formData.gstNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {/* Optional: Add Delivery/Logistics info here if needed, keeping minimal for visual match */}
                                                {formData.deliveryTimeline && (
                                                    <div className="mb-6">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Logistics</p>
                                                        <p className="text-sm font-medium text-[#1a1c1e]">{formData.deliveryTimeline}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* TABLE - High Contrast Premium */}
                                        <div className="mb-12">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-[#1a1c1e] text-white text-[10px] font-bold uppercase tracking-widest font-serif">
                                                    <tr>
                                                        <th className="px-6 py-4 rounded-tl-lg">Item Description</th>
                                                        <th className="px-4 py-4 text-center">Unit</th>
                                                        <th className="px-4 py-4 text-center">Qty</th>
                                                        <th className="px-4 py-4 text-right">Rate</th>
                                                        <th className="px-4 py-4 text-center">Disc</th>
                                                        <th className="px-6 py-4 text-right rounded-tr-lg">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-sm">
                                                    {formData.lineItems.map((item: any, i: number) => {
                                                        const amt = (item.rate * item.quantity) * (1 - item.discount / 100);
                                                        return (
                                                            <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-6 py-5 align-top">
                                                                    <div className="font-bold text-[#1a1c1e]">{item.name || 'Item'}</div>
                                                                    {item.description && <div className="text-xs text-gray-500 mt-1 font-medium">{item.description}</div>}
                                                                </td>
                                                                <td className="px-4 py-5 text-center text-gray-500 align-top">{item.unit === 'sqft' ? 'Sq.ft' : 'Pcs'}</td>
                                                                <td className="px-4 py-5 text-center font-medium text-[#1a1c1e] align-top">{item.quantity}</td>
                                                                <td className="px-4 py-5 text-right text-gray-600 align-top">₹{Number(item.rate).toLocaleString('en-IN')}</td>
                                                                <td className="px-4 py-5 text-center text-gray-400 align-top">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                                                                <td className="px-6 py-5 text-right font-bold text-[#1a1c1e] align-top">
                                                                    ₹{amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* SUMMARY SECTION - Right Aligned */}
                                        <div className="flex justify-end mb-16">
                                            <div className="w-1/2 md:w-1/3 space-y-3">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span className="font-medium text-[#1a1c1e]">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                {totalDiscount > 0 && (
                                                    <div className="flex justify-between text-sm text-emerald-600">
                                                        <span>Discount</span>
                                                        <span className="font-medium">- ₹{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>GST (Total)</span>
                                                    <span className="font-medium text-[#1a1c1e]">₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                {Number(formData.shippingCharges) > 0 && (
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>Shipping</span>
                                                        <span className="font-medium text-[#1a1c1e]">₹{Number(formData.shippingCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    </div>
                                                )}
                                                {Number(formData.adjustment) !== 0 && (
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>Adjustment</span>
                                                        <span className="font-medium text-[#1a1c1e]">₹{Number(formData.adjustment).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    </div>
                                                )}

                                                {/* TERRACOTTA TOTAL BLOCK */}
                                                <div className="mt-6 bg-[var(--terracotta)] p-4 rounded-lg flex justify-between items-center text-white shadow-xl shadow-orange-900/20">
                                                    <span className="font-serif font-bold text-lg">Total Payable</span>
                                                    <span className="font-bold text-2xl">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FOOTER & TERMS */}
                                        <div className="border-t border-gray-100 pt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#1a1c1e] uppercase tracking-widest mb-4">Terms & Conditions</p>
                                                <div className="text-[10px] text-gray-500 leading-relaxed font-medium whitespace-pre-wrap">
                                                    {formData.terms}
                                                </div>
                                            </div>
                                            <div className="text-right text-[10px] text-gray-400 space-y-2">
                                                <p className="font-bold text-[#1a1c1e] text-xs">UrbanClay Architecture Pvt. Ltd.</p>
                                                <p>#610, 80 Feet Rd, 4th Block, Koramangala<br />Bengaluru, Karnataka 560034</p>
                                                <p>GSTIN: 29AAICU5657L1Z9 | CIN: U26931KA2019PTC123456</p>
                                                <p className="pt-4 text-xs italic">System Generated Proforma Invoice</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer - Fixed */}
                                <div className="p-8 border-t border-gray-50 flex gap-4 bg-gray-50/20">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="flex-1 py-4 bg-[#2a1e16] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-black/10"
                                    >
                                        Dismiss Preview
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
                /* Hide Spinner Arrows */
                .no-spinner::-webkit-inner-spin-button, 
                .no-spinner::-webkit-outer-spin-button { 
                   -webkit-appearance: none; 
                   margin: 0; 
                }
                .no-spinner { 
                   -moz-appearance: textfield; 
                }
            `}</style>
        </div >
    );
}
