'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClaimStudioKit } from '@/app/actions/claim-lead';
import { motion } from 'framer-motion';

export default function ClaimSamplePage() {
    const searchParams = useSearchParams();
    const leadId = searchParams.get('uid');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadId) return;

        setStatus('loading');
        const res = await ClaimStudioKit(leadId, address, phone);
        if (res.success) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center p-6 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl shadow-orange-900/5">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h1 className="text-3xl font-serif text-[#2a1e16] mb-4">Kit Requested.</h1>
                    <p className="text-gray-500">We've added your studio material kit to our fulfillment queue. You will receive tracking details via email shortly.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">UrbanClay Studio</span>
                    <h1 className="font-serif text-4xl text-[#2a1e16] mb-4">Request Material Library.</h1>
                    <p className="text-gray-500">Confirm your studio details to receive your complimentary terracotta sample kit.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-orange-900/5 border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Address</label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Studio Name, Street, Building, City, Pin Code"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)] transition-all min-h-[120px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Number</label>
                            <input
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 00000 00000"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)] transition-all"
                            />
                        </div>

                        <button
                            disabled={status === 'loading' || !leadId}
                            className="w-full bg-[var(--terracotta)] text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-orange-900/20 hover:bg-[#a85638] transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Processing...' : 'Request Shipment'}
                        </button>

                        <p className="text-[10px] text-gray-400 text-center">
                            By requesting, you agree to our privacy policy. Kits are subject to availability in your region.
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
