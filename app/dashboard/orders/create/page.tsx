'use client';

import React, { useState, useEffect } from 'react';
import { createPaymentLink } from '@/app/actions/payment-link';
import { getProductDropdownData } from '@/app/actions/product-fetcher';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateOrderPage() {
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);

    // Fetch products on mount
    useEffect(() => {
        getProductDropdownData().then(setProducts);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setGeneratedLink(null);

        const formData = new FormData(e.currentTarget);

        // Combine product selection with custom variant note if provided
        const selectedProduct = formData.get('productSelect');
        const variantNote = formData.get('variantNote') as string;
        const finalProductName = variantNote ? `${selectedProduct} (${variantNote})` : selectedProduct;

        const data = {
            clientName: formData.get('clientName'),
            clientEmail: formData.get('clientEmail'),
            clientPhone: formData.get('clientPhone'),
            productName: finalProductName,
            amount: formData.get('amount'),
            deliveryTimeline: formData.get('deliveryTimeline'),
            terms: formData.get('terms'),
        };

        const result = await createPaymentLink(data);
        setLoading(false);

        if (result.success) {
            // Construct full URL relative to current domain (works for localhost and prod)
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://claytile.in';
            const fullLink = result.linkPath ? `${origin}${result.linkPath}` : '';
            setGeneratedLink(fullLink);
        } else {
            alert('Failed to create link');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-serif text-[#2A1E16] mb-2">Invoice Generator</h1>
                    <p className="text-gray-500 text-sm">Create official payment links for clients.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        <div className="bg-[#2A1E16] px-8 py-4 flex justify-between items-center text-white/90">
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">New Order</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Client Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Client Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Client / Firm Name</label>
                                    <input name="clientName" required className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all placeholder:text-gray-300" placeholder="e.g. Acme Architects" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input name="clientEmail" required type="email" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-all outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input name="clientPhone" required type="tel" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-all outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Order Section */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Order Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                                    <div className="relative">
                                        <select
                                            name="productSelect"
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:bg-white transition-all outline-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>-- Choose from Catalog --</option>
                                            {products.map(p => (
                                                <option key={p._id || Math.random()} value={p.title}>
                                                    {p.title} {p.category ? `(${p.category})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant / Description</label>
                                    <input name="variantNote" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-all" placeholder="e.g. Red Wirecut, 5000 units" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input name="amount" required type="number" className="w-full p-3 pl-8 border border-gray-200 rounded-lg bg-gray-50 font-mono text-lg focus:bg-white transition-all outline-none" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                                        <input name="deliveryTimeline" defaultValue="3-4 Weeks" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                                <textarea name="terms" rows={3} className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:bg-white transition-all outline-none font-mono text-gray-600" defaultValue={`1. 100% Advance Payment.\n2. Standard delivery via Truck.\n3. Taxes included.`} />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-4 bg-[#b45a3c] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#8e452e] hover:shadow-lg hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {loading ? 'Processing...' : 'Generate Invoice Link'}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: ACTION / PREVIEW */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Default State */}
                        {!generatedLink && (
                            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center h-[300px] flex flex-col items-center justify-center opacity-70">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">⚡️</div>
                                <p className="text-sm text-gray-500 font-medium">Link will appear here after creation</p>
                            </div>
                        )}

                        {/* Success State */}
                        <AnimatePresence>
                            {generatedLink && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-6 rounded-2xl shadow-xl shadow-green-900/5 border border-green-100 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Ready to Send!</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center gap-2">
                                            <input readOnly value={generatedLink} className="flex-1 text-xs text-gray-600 bg-transparent outline-none truncate" />
                                            <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="p-2 hover:bg-white rounded-md text-gray-500 transition-colors" title="Copy">
                                                📋
                                            </button>
                                        </div>

                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`Hi, please find the payment link for your UrbanClay order: ${generatedLink}`)}`}
                                            target="_blank"
                                            className="block w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg shadow-green-500/20"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.696c1.025.688 1.928.891 3.292.891 3.181 0 5.767-2.587 5.767-5.766 0-3.181-2.587-5.767-5.768-5.767zm0 10.155c-1.168 0-1.776-.134-2.607-.63l-.187-.11-1.548.404.413-1.51-.121-.193c-.569-.914-.868-1.565-.868-2.593 0-2.684 2.184-4.866 4.869-4.866s4.868 2.183 4.868 4.867c0 2.685-2.184 4.867-4.869 4.867zm2.667-3.64l-1.002-.5c-.244-.122-.444-.175-.623.122-.2.322-.389.609-.478.583-.089-.026-.378-.141-1.077-.764-.543-.484-.911-1.082-1.017-1.265-.106-.183-.011-.282.083-.374.084-.083.189-.217.283-.326.095-.109.125-.183.189-.304.064-.121.032-.228-.016-.324-.048-.096-.433-1.042-.593-1.427-.156-.375-.316-.324-.433-.33l-.369-.006c-.128 0-.336.048-.512.242-.176.195-.675.659-.675 1.608 0 .95.691 1.867.787 2.003.096.136 1.36 2.077 3.295 2.913 1.936.837 1.936.558 2.288.525.353-.033 1.144-.468 1.305-.92.16-.452.16-.84.112-.92-.048-.08-.176-.128-.368-.224z" /></svg>
                                            <span>Share Details via WhatsApp</span>
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
