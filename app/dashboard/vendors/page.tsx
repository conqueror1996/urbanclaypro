'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Vendor {
    _id: string;
    name: string;
    companyName?: string;
    category?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    status: string;
    notes?: string;
}

export default function VendorsDashboard() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const query = `*[_type == "vendor"] | order(name asc)`;
            const data = await client.fetch(query);
            setVendors(data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vendor.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vendor.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Vendors</h1>
                    <p className="text-gray-500 mt-1">Manage suppliers and service providers.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] w-64 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVendors.map((vendor) => (
                        <motion.div
                            key={vendor._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSelectedVendor(vendor)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-[var(--sand)] rounded-xl flex items-center justify-center text-[var(--terracotta)] font-bold text-xl group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                    {vendor.name[0]}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vendor.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {vendor.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--ink)] mb-1">{vendor.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{vendor.companyName || 'No Company'}</p>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <span className="capitalize">{vendor.category?.replace('_', ' ') || 'Uncategorized'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span>{vendor.phone || 'No Phone'}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredVendors.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No vendors found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Vendor Detail Overlay */}
            <AnimatePresence>
                {selectedVendor && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVendor(null)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[60] p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-2xl font-serif text-[var(--ink)]">Vendor Details</h2>
                                <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[var(--sand)]/30 p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold text-[var(--ink)] mb-1">{selectedVendor.name}</h3>
                                    <p className="text-gray-500">{selectedVendor.companyName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category</label>
                                        <p className="text-sm font-medium capitalize">{selectedVendor.category?.replace('_', ' ') || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Status</label>
                                        <p className="text-sm font-medium capitalize">{selectedVendor.status}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Contact Person</label>
                                        <p className="text-sm font-medium">{selectedVendor.contactPerson || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Phone</label>
                                        <p className="text-sm font-medium">{selectedVendor.phone || '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Email</label>
                                    <p className="text-sm font-medium">{selectedVendor.email || '-'}</p>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Address</label>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{selectedVendor.address || 'No address provided.'}</p>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Internal Notes</label>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedVendor.notes || 'No notes.'}</p>
                                </div>

                                <div className="pt-4 border-t">
                                    <a
                                        href={`/studio/desk/vendor;${selectedVendor._id}`}
                                        className="inline-flex items-center gap-2 text-sm text-[var(--terracotta)] font-bold hover:underline"
                                    >
                                        Edit in CMS Studio
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
