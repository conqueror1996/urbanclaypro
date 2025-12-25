'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

interface Stock {
    _id: string;
    product: {
        title: string;
        imageUrl?: string;
    };
    quantity: number;
    unit: string;
    location?: string;
    minStockLevel?: number;
    lastUpdated: string;
}

export default function StockDashboard() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStocks = async () => {
        try {
            const query = `*[_type == "stock"] {
                _id, quantity, unit, location, minStockLevel, lastUpdated,
                product->{title, "imageUrl": images[0].asset->url}
            } | order(quantity asc)`;
            const data = await client.fetch(query);
            setStocks(data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[var(--ink)]">Stock Inventory</h1>
                <p className="text-gray-500 mt-1">Real-time material availability tracking.</p>
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
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Product</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Current Qty</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Location</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stocks.map((stock) => {
                                const isLow = stock.quantity <= (stock.minStockLevel || 0);
                                return (
                                    <tr key={stock._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {stock.product.imageUrl ? (
                                                        <img src={stock.product.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-[var(--ink)]">{stock.product.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold">{stock.quantity} {stock.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {stock.location || '--'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isLow ? (
                                                <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">In Stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(stock.lastUpdated).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
