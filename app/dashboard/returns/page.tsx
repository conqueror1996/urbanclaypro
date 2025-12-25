'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

interface Return {
    _id: string;
    lead?: { contact: string };
    product?: { title: string };
    quantity: number;
    reason: string;
    status: string;
    date: string;
}

export default function ReturnsDashboard() {
    const [returns, setReturns] = useState<Return[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReturns = async () => {
        try {
            const query = `*[_type == "return"] {
                _id, quantity, reason, status, date,
                lead->{contact},
                product->{title}
            } | order(date desc)`;
            const data = await client.fetch(query);
            setReturns(data);
        } catch (error) {
            console.error('Error fetching returns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[var(--ink)]">Returns & RMA</h1>
                <p className="text-gray-500 mt-1">Manage material returns and quality claims.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Date</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Customer</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Product</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Reason</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {returns.map((r) => (
                                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                        {r.date}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[var(--ink)]">
                                        {r.lead?.contact || 'Guest'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {r.product?.title || '--'} ({r.quantity})
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {r.reason}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${r.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {returns.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            No return requests found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
