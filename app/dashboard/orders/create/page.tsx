'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPaymentLink, findZohoLeads, verifyGST } from '@/app/actions/payment-link';
import { getProductDropdownData } from '@/app/actions/product-fetcher';
import { motion, AnimatePresence } from 'framer-motion';

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
        getProductDropdownData().then(setProducts);
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

        // Construct composite address for the simple view/backend compatibility
        const billingAddressComposite = `${formData.billingStreet}, ${formData.billingCity}, ${formData.billingState} - ${formData.billingZip}`;
        const shippingAddressComposite = `${formData.shippingStreet}, ${formData.shippingCity}, ${formData.shippingState} - ${formData.shippingZip}`;

        const data = {
            ...formData,
            billingAddress: billingAddressComposite, // Keep valid for PDF
            shippingAddress: shippingAddressComposite, // Keep valid for PDF
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 relative">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Zoho CRM Quick Lookup</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by Name, Email or Phone..."
                                            className="w-full p-4 pl-12 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[var(--terracotta)]/5 outline-none transition-all"
                                            value={searchQuery}
                                            onChange={(e) => handleZohoSearch(e.target.value)}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 opacity-50">🔍</span>
                                    </div>
                                    <AnimatePresence>
                                        {zohoResults.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-30 top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                                                {zohoResults.map(lead => (
                                                    <button key={lead.id} type="button" onClick={() => selectLead(lead)} className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 flex justify-between">
                                                        <div>
                                                            <div className="font-bold">{lead.name}</div>
                                                            <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{lead.email} • {lead.phone}</div>
                                                        </div>
                                                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold self-center">CRM MATCH</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Company / Display Name</label>
                                        <input name="clientName" required value={formData.clientName} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email ID</label>
                                        <input name="clientEmail" required type="email" value={formData.clientEmail} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Primary Phone</label>
                                        <input name="clientPhone" required value={formData.clientPhone} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex justify-between">
                                            <span>GST Number</span>
                                            <button type="button" onClick={handleGSTVerify} className="text-[var(--terracotta)] hover:underline">Verify & Auto-fill</button>
                                        </label>
                                        <input name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="e.g. 29AAAAA0000A1Z5" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 uppercase font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">PAN Card #</label>
                                        <input name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 uppercase font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Expiry Date</label>
                                        <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50" />
                                    </div>
                                </div>

                                {/* GRANULAR BILLING ADDRESS */}
                                <div className="md:col-span-1 bg-gray-50/50 p-4 rounded-2xl space-y-3">
                                    <h4 className="text-xs font-bold text-[#2A1E16] flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        Billing Address
                                    </h4>
                                    <input name="billingAttention" value={formData.billingAttention} onChange={handleInputChange} placeholder="Attention (Optional)" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                    <textarea name="billingStreet" value={formData.billingStreet} onChange={handleInputChange} placeholder="Street / Area" rows={2} className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input name="billingCity" value={formData.billingCity} onChange={handleInputChange} placeholder="City" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                        <input name="billingZip" value={formData.billingZip} onChange={handleInputChange} placeholder="Zip Code" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                    </div>
                                    <input name="billingState" value={formData.billingState} onChange={handleInputChange} placeholder="State" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                    <input name="billingCountry" value={formData.billingCountry} onChange={handleInputChange} placeholder="Country" className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-gray-100" readOnly />
                                </div>

                                {/* GRANULAR SHIPPING ADDRESS */}
                                <div className="md:col-span-1 bg-gray-50/50 p-4 rounded-2xl space-y-3">
                                    <h4 className="text-xs font-bold text-[#2A1E16] flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                                        Shipping Address
                                    </h4>
                                    <input name="shippingAttention" value={formData.shippingAttention} onChange={handleInputChange} placeholder="Attention (Optional)" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                    <textarea name="shippingStreet" value={formData.shippingStreet} onChange={handleInputChange} placeholder="Street / Area" rows={2} className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input name="shippingCity" value={formData.shippingCity} onChange={handleInputChange} placeholder="City" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                        <input name="shippingZip" value={formData.shippingZip} onChange={handleInputChange} placeholder="Zip Code" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                    </div>
                                    <input name="shippingState" value={formData.shippingState} onChange={handleInputChange} placeholder="State" className="w-full p-2 text-sm border border-gray-200 rounded-lg" />
                                    <input name="shippingCountry" value={formData.shippingCountry} onChange={handleInputChange} placeholder="Country" className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-gray-100" readOnly />
                                </div>
                            </div>
                        </div>

                        {/* 2. Line Items Table */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 bg-[#2a1e16] text-white rounded-lg flex items-center justify-center font-bold text-sm">02</span>
                                    <h3 className="font-bold text-lg text-[#2a1e16]">Product & Service Details</h3>
                                </div>
                                <button type="button" onClick={addLineItem} className="text-xs bg-[var(--terracotta)] text-white px-4 py-2 rounded-lg font-bold hover:brightness-105 transition-all">
                                    + Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto custom-scrollbar pb-4">
                                <table className="w-full text-sm min-w-[1000px]">
                                    <thead className="bg-[#fcfaf9] text-gray-400 font-bold text-[10px] uppercase tracking-widest border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-6 text-left w-[30%]">Item Details</th>
                                            <th className="px-4 py-6 text-left w-[10%]">HSN/SAC</th>
                                            <th className="px-4 py-6 text-center w-[10%]">Qty</th>
                                            <th className="px-4 py-6 text-left w-[15%]">Rate (₹)</th>
                                            <th className="px-4 py-6 text-left w-[10%]">Disc %</th>
                                            <th className="px-4 py-6 text-left w-[10%]">Tax %</th>
                                            <th className="px-6 py-6 text-right w-[15%]">Amount</th>
                                            <th className="px-4 py-6 w-[3%]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {formData.lineItems.map((item: any, idx: number) => (
                                            <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-6 align-top">
                                                    <div className="space-y-3">
                                                        <input
                                                            value={item.name}
                                                            onChange={(e) => updateLineItem(idx, 'name', e.target.value)}
                                                            placeholder="Item Name / Service Title"
                                                            className="w-full p-3 font-bold text-gray-800 border-b border-gray-100 focus:border-[var(--terracotta)] bg-transparent outline-none transition-all placeholder:font-normal"
                                                        />
                                                        <textarea
                                                            value={item.description}
                                                            onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                                                            placeholder="Add specific details or description here..."
                                                            rows={2}
                                                            className="w-full p-2 text-xs text-gray-500 bg-gray-50/30 rounded-lg border border-transparent focus:bg-white focus:border-gray-100 outline-none resize-none transition-all"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 align-top">
                                                    <input
                                                        value={item.hsnCode}
                                                        onChange={(e) => updateLineItem(idx, 'hsnCode', e.target.value)}
                                                        placeholder="123456"
                                                        className="w-full p-3 font-mono text-xs bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none transition-all"
                                                    />
                                                </td>
                                                <td className="px-4 py-6 align-top">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateLineItem(idx, 'quantity', Number(e.target.value))}
                                                            className="w-16 p-3 text-center font-bold bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none transition-all"
                                                        />
                                                        <select
                                                            value={item.unit || 'pcs'}
                                                            onChange={(e) => updateLineItem(idx, 'unit', e.target.value)}
                                                            className="w-20 p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none cursor-pointer appearance-none"
                                                        >
                                                            <option value="pcs">Pcs</option>
                                                            <option value="sqft">Sq.ft</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 align-top">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-3 text-gray-400 font-light">₹</span>
                                                        <input
                                                            type="number"
                                                            value={item.rate}
                                                            onChange={(e) => updateLineItem(idx, 'rate', Number(e.target.value))}
                                                            className="w-full p-3 pl-7 font-mono bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none transition-all"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 align-top">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={item.discount}
                                                            onChange={(e) => updateLineItem(idx, 'discount', Number(e.target.value))}
                                                            className="w-full p-3 text-center bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none transition-all"
                                                        />
                                                        <span className="absolute right-3 top-3 text-gray-400 text-xs">%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 align-top">
                                                    <select
                                                        value={item.taxRate}
                                                        onChange={(e) => updateLineItem(idx, 'taxRate', Number(e.target.value))}
                                                        className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none cursor-pointer appearance-none"
                                                    >
                                                        <option value={0}>GST 0%</option>
                                                        <option value={5}>GST 5%</option>
                                                        <option value={12}>GST 12%</option>
                                                        <option value={18}>GST 18%</option>
                                                        <option value={28}>GST 28%</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-6 align-top text-right">
                                                    <div className="p-3 font-bold text-lg text-[#2a1e16] bg-gray-50/50 rounded-xl border border-transparent group-hover:bg-white group-hover:border-gray-100 transition-all">
                                                        ₹{((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 align-middle text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLineItem(idx)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        title="Remove Item"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                    <input name="deliveryTimeline" value={formData.deliveryTimeline} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Customer Notes (Printed on Invoice)</label>
                                    <input name="customerNotes" value={formData.customerNotes} onChange={handleInputChange} placeholder="e.g. Please call before unloading" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Public Terms & Disclaimer</label>
                                    <textarea name="terms" rows={3} value={formData.terms} onChange={handleInputChange} className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50/50 text-[11px] font-mono leading-relaxed" />
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
                                            value={formData.shippingCharges}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[10px] uppercase font-bold text-white/30 mb-1">Manual Adjustment</label>
                                        <input
                                            name="adjustment"
                                            type="number"
                                            value={formData.adjustment}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-white/30 mb-1">Settlement Type</label>
                                            <select name="tdsOption" value={formData.tdsOption} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white">
                                                <option value="none">Standard</option>
                                                <option value="tds">TDS - Direct</option>
                                                <option value="tcs">TCS - Applied</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-white/30 mb-1">Rate %</label>
                                            <input name="tdsRate" type="number" value={formData.tdsRate} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-mono" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white/30 mb-1">Collectible Amount</p>
                                    <h2 className="text-4xl font-serif">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</h2>
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
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1a1512]/95 backdrop-blur-xl flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                            {/* Modal Content - Scrollable Part */}
                            <div className="overflow-y-auto p-12 custom-scrollbar">
                                <div className="flex justify-between items-start mb-16 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-[#2a1e16] rounded-2xl flex items-center justify-center text-white font-serif text-3xl shadow-xl">U</div>
                                        <div>
                                            <h2 className="text-3xl font-serif text-[#2a1e16]">UrbanClay</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Premium Clay Solutions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-4xl font-serif text-gray-300 uppercase tracking-tighter">Pro-forma</h2>
                                        <p className="text-sm font-bold text-[var(--terracotta)] mt-2">DRAFT SECURE LINK</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-16 mb-16 px-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Billed To</p>
                                        <h4 className="text-xl font-bold text-[#2a1e16] mb-2">{formData.clientName || 'Valued Client'}</h4>
                                        <p className="text-sm text-gray-500 italic max-w-xs">{formData.billingAddress || 'No address provided'}</p>
                                        {(formData.gstNumber || formData.panNumber) && (
                                            <div className="mt-4 flex gap-4">
                                                {formData.gstNumber && <span className="text-[10px] font-mono bg-gray-50 px-2 py-1 rounded text-gray-400">GST: {formData.gstNumber}</span>}
                                                {formData.panNumber && <span className="text-[10px] font-mono bg-gray-50 px-2 py-1 rounded text-gray-400">PAN: {formData.panNumber}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Logistics Timeline</p>
                                        <h4 className="text-xl font-bold text-[#2a1e16] mb-1">{formData.deliveryTimeline}</h4>
                                        <p className="text-sm text-gray-500">Exp. Site Delivery</p>
                                        <div className="mt-6">
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Validity</p>
                                            <p className="text-sm font-bold text-red-500">{formData.expiryDate ? `Expires: ${new Date(formData.expiryDate).toLocaleDateString()}` : 'Standard Validity'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-16 border border-gray-100 rounded-[2rem] overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                            <tr>
                                                <th className="px-8 py-6">Description</th>
                                                <th className="px-6 py-6 text-center">Qty</th>
                                                <th className="px-6 py-6">Rate</th>
                                                <th className="px-6 py-6 text-right">Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {formData.lineItems.map((item: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="px-8 py-6">
                                                        <div className="font-bold text-[#2a1e16]">{item.name || 'Untitled Line Item'}</div>
                                                        <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center font-mono">{item.quantity}</td>
                                                    <td className="px-6 py-6 font-mono text-gray-500">₹{Number(item.rate).toLocaleString('en-IN')}</td>
                                                    <td className="px-8 py-6 text-right font-bold text-[#2a1e16]">
                                                        ₹{((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50/30 font-bold border-t border-gray-100">
                                            <tr>
                                                <td colSpan={3} className="px-8 py-6 text-right text-gray-400 uppercase tracking-widest text-[10px]">Settlement Amount</td>
                                                <td className="px-8 py-6 text-right text-2xl font-serif text-[#2a1e16]">₹{finalTotal.toLocaleString('en-IN')}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Terms & Legal</p>
                                        <div className="text-[10px] text-gray-400 leading-relaxed font-mono whitespace-pre-wrap pl-4 border-l-2 border-gray-100">
                                            {formData.terms}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-center">
                                        <div className="bg-gray-50 p-6 rounded-2xl inline-block ml-auto border border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1 text-center">Secure Engine</p>
                                            <p className="text-xs font-mono text-gray-400 truncate max-w-[150px]">SHA-256 Authorized</p>
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
                )}
            </AnimatePresence>

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
            `}</style>
        </div>
    );
}
