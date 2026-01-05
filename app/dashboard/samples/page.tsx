
'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { updateSampleStatus } from '@/app/actions/manage-samples';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrackingLink, validateTrackingNumber } from '@/lib/utils';

interface SampleOrder {
    _id: string;
    contact: string;
    role: string;
    city: string;
    product: string;
    sampleItems?: string[];
    fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
    shippingInfo?: {
        courier: string;
        trackingNumber: string;
        dispatchedDate: string;
    };
    submittedAt: string;
}

const COLUMNS = [
    { id: 'pending', title: 'New Requests', color: 'bg-blue-50 border-blue-100 text-blue-800' },
    { id: 'processing', title: 'Packing', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
    { id: 'shipped', title: 'In Transit', color: 'bg-purple-50 border-purple-100 text-purple-800' },
    { id: 'delivered', title: 'Delivered', color: 'bg-green-50 border-green-100 text-green-800' }
];

export default function SamplesDashboard() {
    const [orders, setOrders] = useState<SampleOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [shippingModalOrder, setShippingModalOrder] = useState<SampleOrder | null>(null);
    const [shippingForm, setShippingForm] = useState({ courier: '', trackingNumber: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch leads marked as sample request OR with 'Sample' in product name (legacy support)
            const query = `*[_type == "lead" && (isSampleRequest == true || product match "Sample*")] | order(submittedAt desc) {
                _id,
                contact,
                role,
                city,
                product,
                sampleItems,
                fulfillmentStatus,
                shippingInfo,
                submittedAt,
                notes
            }`;
            const data = await client.fetch(query);

            // Normalize fulfillment status if missing (for legacy leads)
            const normalized = data.map((item: any) => ({
                ...item,
                fulfillmentStatus: item.fulfillmentStatus || 'pending'
            }));

            setOrders(normalized);
        } catch (error) {
            console.error('Error fetching sample orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const moveOrder = async (orderId: string, asStatus: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, fulfillmentStatus: asStatus as any } : o));

        try {
            const res = await updateSampleStatus(orderId, asStatus);
            if (res.emailError) {
                console.warn("Email warning:", res.emailError);
                // Optionally notify UI
            }
        } catch (error) {
            console.error("Failed to update status", error);
            fetchOrders(); // Revert on error
        }
    };

    const handleShipSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingModalOrder) return;

        // Validation
        const validation = validateTrackingNumber(shippingForm.courier, shippingForm.trackingNumber);
        if (!validation.valid) {
            alert(validation.error || "Invalid tracking details");
            return;
        }

        setIsUpdating(true);
        try {
            // Optimistic update
            setOrders(prev => prev.map(o => o._id === shippingModalOrder._id ? {
                ...o,
                fulfillmentStatus: 'shipped',
                shippingInfo: {
                    courier: shippingForm.courier,
                    trackingNumber: shippingForm.trackingNumber,
                    dispatchedDate: new Date().toISOString()
                }
            } : o));

            const res = await updateSampleStatus(shippingModalOrder._id, 'shipped', shippingForm);
            if (res.emailError) {
                alert(`⚠️ Shipment saved, but Email Failed: ${JSON.stringify(res.emailError)}`);
            }
            setShippingModalOrder(null);
            setShippingForm({ courier: '', trackingNumber: '' });
        } catch (error) {
            console.error(error);
            fetchOrders();
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-20">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Samples</h1>
                    <p className="text-gray-500 mt-2">Track and manage physical sample shipments.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={async () => {
                            const email = prompt("Enter email for test notifications:");
                            if (email) {
                                if (!confirm(`Create test order for ${email}? This will send a real confirmation email.`)) return;

                                try {
                                    setLoading(true);
                                    const result = await import('@/app/actions/simulate-lead').then(m => m.createTestLead(email));
                                    await fetchOrders();

                                    if (result.success) {
                                        let msg = "✅ Test Order Created!";
                                        if (result.emailStatus) {
                                            const adminStatus = result.emailStatus.admin.success ? "✅ Sent" : `❌ Failed (${JSON.stringify(result.emailStatus.admin.error)})`;
                                            const userStatus = result.emailStatus.user.success ? "✅ Sent" : `❌ Failed (${JSON.stringify(result.emailStatus.user.error)})`;
                                            msg += `\n\nAdmin Alert: ${adminStatus}\nUser Email: ${userStatus}`;
                                        }
                                        alert(msg);
                                    } else {
                                        alert(`❌ Failed to create order: ${result.error}`);
                                    }
                                } catch (e) {
                                    alert("Failed to create test order");
                                    console.error(e);
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }}
                        className="text-xs font-bold text-gray-400 hover:text-[var(--terracotta)] border border-gray-200 hover:border-[var(--terracotta)] px-3 py-1.5 rounded-lg transition-colors"
                    >
                        + Test Order
                    </button>
                    <button onClick={fetchOrders} className="text-sm text-[var(--terracotta)] hover:underline font-bold">
                        Refresh Data
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex-1 bg-gray-50 rounded-xl flex flex-col border border-gray-200/60 max-w-xs xl:max-w-sm">
                            <div className={`p-4 border-b border-gray-100 rounded-t-xl flex justify-between items-center ${col.color.replace('text', 'bg').replace('800', '100')}`}>
                                <h3 className={`font-bold uppercase tracking-wider text-xs ${col.color.split(' ')[2]}`}>{col.title}</h3>
                                <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold text-gray-600">
                                    {orders.filter(o => o.fulfillmentStatus === col.id).length}
                                </span>
                            </div>

                            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {orders.filter(o => o.fulfillmentStatus === col.id).map(order => (
                                    <motion.div
                                        layoutId={order._id}
                                        key={order._id}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-[var(--ink)]">{order.contact}</h4>
                                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{order.role}</span>
                                        </div>

                                        <div className="text-xs text-gray-500 space-y-1 mb-3">
                                            <p className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {order.city}
                                            </p>
                                            <p className="font-medium text-gray-700">{order.product}</p>
                                            {order.sampleItems && order.sampleItems.length > 0 ? (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {order.sampleItems.map((item, i) => (
                                                        <span key={i} className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[10px] border border-orange-100 font-medium">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                /* Fallback to showing notes if no specific items tracked */
                                                (order as any).notes && (
                                                    <div className="mt-1.5 p-1.5 bg-gray-50 rounded border border-gray-100">
                                                        <p className="text-[10px] text-gray-500 italic line-clamp-3">{(order as any).notes}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-3 border-t border-gray-50 flex gap-2">
                                            {col.id === 'pending' && (
                                                <button
                                                    onClick={() => moveOrder(order._id, 'processing')}
                                                    className="w-full py-1.5 bg-[var(--terracotta)] text-white rounded text-xs font-bold uppercase tracking-wide hover:bg-[#a85638]"
                                                >
                                                    Start Packing
                                                </button>
                                            )}
                                            {col.id === 'processing' && (
                                                <button
                                                    onClick={() => {
                                                        setShippingModalOrder(order);
                                                        setShippingForm({ courier: 'BlueDart', trackingNumber: '' });
                                                    }}
                                                    className="w-full py-1.5 bg-purple-600 text-white rounded text-xs font-bold uppercase tracking-wide hover:bg-purple-700"
                                                >
                                                    Ship Order
                                                </button>
                                            )}
                                            {col.id === 'shipped' && (
                                                <div className="w-full space-y-2">
                                                    <div className="text-[10px] bg-gray-50 p-2 rounded text-gray-600 border border-gray-100 flex justify-between items-center">
                                                        <div>
                                                            <span className="font-bold block text-xs mb-0.5">{order.shippingInfo?.courier}</span>
                                                            <span className="font-mono">{order.shippingInfo?.trackingNumber}</span>
                                                        </div>
                                                        {order.shippingInfo?.trackingNumber && (
                                                            <a
                                                                href={getTrackingLink(order.shippingInfo?.courier || '', order.shippingInfo?.trackingNumber || '')}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[var(--terracotta)] hover:underline text-[10px] font-bold flex items-center gap-1"
                                                            >
                                                                Track
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => moveOrder(order._id, 'delivered')}
                                                        className="w-full py-1.5 bg-green-600 text-white rounded text-xs font-bold uppercase tracking-wide hover:bg-green-700"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                </div>
                                            )}
                                            {col.id === 'delivered' && (
                                                <span className="w-full text-center text-xs text-green-600 font-bold bg-green-50 py-1 rounded">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {orders.filter(o => o.fulfillmentStatus === col.id).length === 0 && (
                                    <div className="h-20 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                        Empty
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SHIPPING MODAL */}
            <AnimatePresence>
                {shippingModalOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShippingModalOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative z-10"
                        >
                            <h3 className="text-xl font-serif text-[var(--ink)] mb-4">Ship Sample Order</h3>
                            <p className="text-sm text-gray-500 mb-6">Enter tracking details for {shippingModalOrder.product} to {shippingModalOrder.city}.</p>

                            <form onSubmit={handleShipSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Courier Service</label>
                                    <input
                                        list="couriers"
                                        autoFocus
                                        value={shippingForm.courier}
                                        onChange={e => setShippingForm({ ...shippingForm, courier: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-[var(--terracotta)] outline-none"
                                        placeholder="Select or Type Courier"
                                        required
                                    />
                                    <datalist id="couriers">
                                        <option value="BlueDart" />
                                        <option value="Professional Courier" />
                                        <option value="DTDC" />
                                        <option value="Delhivery" />
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tracking Number</label>
                                    <input
                                        type="text"
                                        value={shippingForm.trackingNumber}
                                        onChange={e => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-[var(--terracotta)] outline-none"
                                        placeholder="e.g., 123456789"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShippingModalOrder(null)}
                                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-6 py-2 bg-[var(--terracotta)] text-white rounded-lg text-sm font-bold hover:bg-[#a85638] disabled:opacity-50"
                                    >
                                        {isUpdating ? 'Saving...' : 'Confirm Shipment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

}
