'use client';

import React, { useEffect, useState } from 'react';
import { updateStockQuantity, getStocksData } from '@/app/actions/manage-stock';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Package, TrendingUp, Search, History, Edit2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Stock {
    _id: string;
    product: {
        title: string;
        imageUrl?: string;
        priceRange?: string; // Approximation
    };
    quantity: number;
    unit: string;
    location?: string;
    minStockLevel?: number;
    lastUpdated: string;
    history?: any[];
}

export default function StockDashboard() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'low'>('all');
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Edit Mode State
    const [editingStock, setEditingStock] = useState<Stock | null>(null);
    const [editQty, setEditQty] = useState<number>(0);
    const [editReason, setEditReason] = useState('');

    const fetchStocks = async () => {
        try {
            const res = await getStocksData();
            if (res.success && res.data) {
                setStocks(res.data);
                setFilteredStocks(res.data);
            } else {
                console.error('Failed to fetch stocks:', res.error);
            }
        } catch (error) {
            console.error('Error fetching stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    useEffect(() => {
        let res = stocks;
        if (filter === 'low') {
            res = res.filter(s => s.quantity <= (s.minStockLevel || 100));
        }
        if (search) {
            res = res.filter(s => s.product.title.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredStocks(res);
    }, [filter, search, stocks]);

    const handleQuickUpdate = async (stock: Stock, change: number) => {
        setUpdatingId(stock._id);
        const newQty = Math.max(0, stock.quantity + change);
        const type = change > 0 ? 'Add' : 'Subtract';

        try {
            await updateStockQuantity(stock._id, newQty, 'Quick Update', type);
            // Optimistic update
            setStocks(prev => prev.map(s => s._id === stock._id ? { ...s, quantity: newQty } : s));
        } catch (e) {
            alert('Update failed');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingStock) return;
        setUpdatingId(editingStock._id);

        // Determine type based on comparison
        let type: 'Add' | 'Subtract' | 'Correction' = 'Correction';
        if (editQty > editingStock.quantity) type = 'Add';
        if (editQty < editingStock.quantity) type = 'Subtract';

        try {
            await updateStockQuantity(editingStock._id, editQty, editReason || 'Manual Adjustment', type);
            setStocks(prev => prev.map(s => s._id === editingStock._id ? { ...s, quantity: editQty, lastUpdated: new Date().toISOString() } : s));
            setEditingStock(null);
        } catch (e) {
            alert('Failed to update');
        } finally {
            setUpdatingId(null);
        }
    };

    // Stats
    const totalItems = stocks.length;
    const lowStockCount = stocks.filter(s => s.quantity <= (s.minStockLevel || 100)).length;
    // Mock valuation logic (since we don't have exact cost price, using a placeholder avg)
    const totalValuation = stocks.reduce((acc, s) => acc + (s.quantity * 85), 0);

    return (
        <div className="space-y-8 pb-20">
            {/* HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-serif text-[var(--ink)] tracking-tight">Inventory Intelligence</h1>
                    <p className="text-gray-500 mt-2">Manage warehouse stock, track movement, and foresee shortages.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-sm font-bold uppercase tracking-widest">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Total SKUs</p>
                        <h3 className="text-3xl font-serif text-[var(--ink)]">{totalItems}</h3>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between ${lowStockCount > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {lowStockCount > 0 ? 'Low Stock Alerts' : 'Stock Health'}
                        </p>
                        <h3 className={`text-3xl font-serif ${lowStockCount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                            {lowStockCount > 0 ? lowStockCount : 'Healthy'}
                        </h3>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Est. Valuation</p>
                        <h3 className="text-3xl font-serif text-[var(--ink)]">₹{(totalValuation / 100000).toFixed(2)}L</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filter === 'all' ? 'bg-[var(--ink)] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        All Stock
                    </button>
                    <button
                        onClick={() => setFilter('low')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filter === 'low' ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        Low Stock ({lowStockCount})
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)] w-full md:w-64"
                    />
                </div>
            </div>

            {/* TABLE */}
            {loading ? (
                <div className="flex items-center justify-center p-32">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-600">Product Details</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-600 text-center">Available Qty</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-600">Location</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStocks.map((stock) => {
                                const isLow = stock.quantity <= (stock.minStockLevel || 100);
                                const isUpdating = updatingId === stock._id;
                                return (
                                    <tr key={stock._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                                    {stock.product.imageUrl ? (
                                                        <img src={stock.product.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-[var(--ink)] block">{stock.product.title}</span>
                                                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">{stock._id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-mono text-lg font-bold text-[var(--ink)]">
                                                {stock.quantity.toLocaleString()} <span className="text-xs text-gray-600 font-sans font-normal">{stock.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isLow ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                    Low Stock
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    In Stock
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {stock.location || 'Warehouse A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleQuickUpdate(stock, -50)}
                                                    disabled={isUpdating}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-gray-600 transition-colors"
                                                    title="-50 Qty"
                                                >
                                                    <ArrowDownRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleQuickUpdate(stock, 50)}
                                                    disabled={isUpdating}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 text-gray-600 transition-colors"
                                                    title="+50 Qty"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingStock(stock);
                                                        setEditQty(stock.quantity);
                                                        setEditReason('');
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-[var(--ink)] text-white flex items-center justify-center hover:bg-[var(--terracotta)] transition-colors shadow-lg"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* EDIT MODAL */}
            <AnimatePresence>
                {editingStock && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingStock(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-serif text-xl text-[var(--ink)]">Adjust Stock</h3>
                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">{editingStock.product.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-600 uppercase">Current</p>
                                    <p className="font-mono font-bold">{editingStock.quantity}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">New Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setEditQty(Math.max(0, editQty - 100))}
                                            className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                                        >
                                            -100
                                        </button>
                                        <input
                                            type="number"
                                            value={editQty}
                                            onChange={e => setEditQty(parseInt(e.target.value) || 0)}
                                            className="flex-1 text-center text-3xl font-serif text-[var(--ink)] border-b-2 border-gray-100 py-2 focus:outline-none focus:border-[var(--terracotta)]"
                                        />
                                        <button
                                            onClick={() => setEditQty(editQty + 100)}
                                            className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                                        >
                                            +100
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Reason for Adjustment</label>
                                    <select
                                        value={editReason}
                                        onChange={e => setEditReason(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--terracotta)]"
                                    >
                                        <option value="">Select Reason...</option>
                                        <option value="Restock">📦 New Shipment Received</option>
                                        <option value="Damage">❌ Damaged / Write-off</option>
                                        <option value="Correction">✏️ Inventory Count Correction</option>
                                        <option value="Order">🚚 Order Fulfillment</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setEditingStock(null)}
                                        className="flex-1 py-3 text-sm font-bold text-gray-600 hover:text-gray-600 uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={!editReason || updatingId !== null}
                                        className="flex-1 py-3 bg-[var(--terracotta)] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#a85638] transition-colors shadow-lg shadow-orange-900/20 disabled:opacity-50"
                                    >
                                        {updatingId ? 'Saving...' : 'Update Stock'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
