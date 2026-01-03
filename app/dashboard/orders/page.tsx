'use client';

import React, { useState, useEffect } from 'react';
import { getAllPaymentLinks } from '@/app/actions/payment-link';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrdersHistoryPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getAllPaymentLinks().then((res) => {
            if (res.success) setLinks(res.links);
            setLoading(false);
        });
    }, []);

    const filteredLinks = links.filter(link =>
        link.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (link.lineItems?.[0]?.name || link.productName)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'expired': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="p-6 md:p-10 bg-gray-50/50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-[#2A1E16] mb-1">Order History</h1>
                        <p className="text-gray-500 text-sm">Monitor and manage all payment links.</p>
                    </div>
                    <Link
                        href="/dashboard/orders/create"
                        className="px-6 py-3 bg-[#b45a3c] text-white rounded-xl font-bold hover:bg-[#8e452e] transition-all shadow-lg shadow-orange-900/10 flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span>
                        Create New Link
                    </Link>
                </div>

                {/* Search & Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by client, order ID or product..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--terracotta)]/10 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 text-sm font-medium">
                        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                            Total: <span className="text-gray-900">{links.length}</span>
                        </div>
                        <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100 text-green-700">
                            Paid: <span className="font-bold">{links.filter(l => l.status === 'paid').length}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-ful"></div></td>
                                        </tr>
                                    ))
                                ) : filteredLinks.length > 0 ? (
                                    filteredLinks.map((link) => (
                                        <tr key={link._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-mono font-bold text-gray-900">{link.orderId}</div>
                                                <div className="text-[10px] text-gray-400">{new Date(link.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-medium text-gray-900">{link.clientName}</div>
                                                <div className="text-xs text-gray-500">{link.clientPhone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                                {link.lineItems?.[0]?.name || link.productName}
                                                {link.lineItems?.length > 1 && <span className="text-[10px] text-gray-400 block">+ {link.lineItems.length - 1} more items</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                                                ₹{link.amount?.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(link.status)}`}>
                                                    {link.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/pay/${link.orderId}`;
                                                            navigator.clipboard.writeText(url);
                                                        }}
                                                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-[var(--terracotta)] transition-all"
                                                        title="Copy Link"
                                                    >
                                                        📋
                                                    </button>

                                                    {link.status === 'paid' && (
                                                        <a
                                                            href={`/api/invoice/${link.orderId}/pdf`}
                                                            target="_blank"
                                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-green-600 transition-all font-bold"
                                                            title="Download Invoice"
                                                        >
                                                            ⬇️
                                                        </a>
                                                    )}

                                                    <Link
                                                        href={`/pay/${link.orderId}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-500 transition-all"
                                                        title="View Page"
                                                    >
                                                        👁️
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-serif italic">
                                            No orders found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
