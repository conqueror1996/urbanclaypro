import React from 'react';
import { notFound } from 'next/navigation';
import { getPaymentLinkDetails } from '@/app/actions/payment-link';
import PaymentPageClient from './payment-client';
import Image from 'next/image';

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const { success, order } = await getPaymentLinkDetails(orderId);

    if (!success || !order) {
        notFound();
    }

    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        order.lineItems?.forEach((item: any) => {
            const lineSubtotal = item.rate * item.quantity;
            const lineDiscount = lineSubtotal * (item.discount / 100);
            const taxableAmount = lineSubtotal - lineDiscount;
            const lineTax = taxableAmount * (item.taxRate / 100);

            subtotal += lineSubtotal;
            totalDiscount += lineDiscount;
            totalTax += lineTax;
        });

        // Adjustment calculation for display
        let settlementAdjust = 0;
        if (order.tdsOption === 'tds') settlementAdjust = -(subtotal - totalDiscount) * (order.tdsRate / 100);
        if (order.tdsOption === 'tcs') settlementAdjust = (subtotal - totalDiscount) * (order.tdsRate / 100);

        return { subtotal, totalDiscount, totalTax, settlementAdjust };
    };

    const { subtotal, totalDiscount, totalTax, settlementAdjust } = calculateTotals();

    return (
        <div className="bg-[#f0ece9] min-h-screen flex flex-col font-sans text-[#1a1512]">
            {/* Minimal Header */}
            <header className="w-full py-6 flex justify-center items-center bg-[#2A1E16] shadow-sm">
                <div className="relative w-32 h-10">
                    <Image
                        src="/urbanclay-logo.png"
                        alt="UrbanClay"
                        fill
                        className="object-contain brightness-0 invert"
                        priority
                    />
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">

                    {/* Official Banner */}
                    <div className="bg-white p-10 pb-0 text-center relative overflow-hidden text-[#2A1E16]">
                        <p className="text-[var(--terracotta)] font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Secure Payment Portal</p>
                        <h1 className="text-4xl font-serif font-bold">Tax Invoice & Settlement</h1>
                        <p className="text-gray-400 text-[10px] mt-2 font-mono tracking-widest uppercase">REF: {order.orderId}</p>
                    </div>

                    <div className="p-8 md:p-14">

                        {/* Status Alert for Expired */}
                        {order.status === 'expired' && (
                            <div className="mb-10 bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-800">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <h4 className="font-bold">This payment link has expired.</h4>
                                    <p className="text-sm opacity-80">Pricing or availability may have changed. Please request a new link.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Billed To</p>
                                <h3 className="text-2xl font-bold text-[#2A1E16] mb-2">{order.clientName}</h3>
                                <div className="text-sm text-gray-500 space-y-1 font-sans">
                                    <p className="whitespace-pre-wrap leading-relaxed">{order.billingAddress}</p>
                                    <p className="pt-2">{order.clientEmail} • {order.clientPhone}</p>
                                    {order.gstNumber && <p className="pt-2 font-mono text-[11px] text-[var(--terracotta)] font-bold">GST: {order.gstNumber}</p>}
                                </div>
                            </div>
                            <div className="md:text-right">
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Invoice Metadata</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                            order.status === 'expired' ? 'bg-red-50 text-red-600' :
                                                'bg-orange-50 text-orange-600 animate-pulse'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    {order.status === 'paid' && order.paidAt ? (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Paid On</p>
                                            <p className="text-emerald-700 font-bold">
                                                {new Date(order.paidAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                <span className="text-[10px] text-gray-400 ml-1 block font-mono">
                                                    {new Date(order.paidAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Created</p>
                                            <p className="text-gray-900 font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                    )}
                                    {order.expiryDate && (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Valid Until</p>
                                            <p className="text-red-500 font-bold">{new Date(order.expiryDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="mb-12 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 w-[40%]">Item & Description</th>
                                        <th className="px-4 py-4 text-center w-[15%]">Qty</th>
                                        <th className="px-4 py-4 text-right w-[15%]">Rate</th>
                                        <th className="px-4 py-4 text-right w-[10%]">Tax</th>
                                        <th className="px-8 py-4 text-right w-[20%]">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.lineItems?.map((item: any, i: number) => (
                                        <tr key={i} className="hover:bg-[#fcfaf9] transition-colors group">
                                            <td className="px-8 py-5 align-top">
                                                <div className="font-semibold text-[#2A1E16] text-sm">{item.name}</div>
                                                {item.description && (
                                                    <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.description}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-5 text-center px-4 align-top">
                                                <span className="font-mono text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                    {item.quantity} {item.unit || 'pcs'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5 text-right font-mono text-xs text-gray-600 align-top">
                                                ₹{item.rate.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-5 text-right font-mono text-xs text-gray-400 align-top">
                                                {item.taxRate}%
                                            </td>
                                            <td className="px-8 py-5 text-right font-medium text-[#2A1E16] text-sm align-top">
                                                ₹{((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#fcfaf9] border-t border-gray-100">
                                    <tr className="text-gray-500 text-xs">
                                        <td colSpan={4} className="px-8 pt-6 pb-2 text-right">Subtotal & Tax</td>
                                        <td className="px-8 pt-6 pb-2 text-right font-mono text-gray-900">₹{(subtotal - totalDiscount + totalTax).toLocaleString('en-IN')}</td>
                                    </tr>
                                    {order.shippingCharges > 0 && (
                                        <tr className="text-gray-500 text-xs">
                                            <td colSpan={4} className="px-8 py-2 text-right">Shipping / Logistics</td>
                                            <td className="px-8 py-2 text-right font-mono text-gray-900">₹{order.shippingCharges.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    {Math.abs(order.adjustment) > 0 && (
                                        <tr className="text-gray-500 text-xs">
                                            <td colSpan={4} className="px-8 py-2 text-right">Adjustments</td>
                                            <td className="px-8 py-2 text-right font-mono text-gray-900">₹{order.adjustment.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    {order.tdsOption !== 'none' && (
                                        <tr className="text-gray-500 text-xs italic">
                                            <td colSpan={4} className="px-8 py-2 text-right uppercase text-[10px] font-bold tracking-widest">{order.tdsOption} Adjustment ({order.tdsRate}%)</td>
                                            <td className="px-8 py-2 text-right font-mono text-gray-900">₹{settlementAdjust.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan={5} className="p-4">
                                            <div className="bg-[#2A1E16] text-white rounded-xl flex items-center justify-between px-8 py-5 mt-2">
                                                <span className="font-bold uppercase tracking-widest text-xs opacity-80">Total Payable Amount</span>
                                                <span className="text-2xl font-serif text-[var(--terracotta)]">
                                                    ₹{order.amount.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                            <div className="md:col-span-2">
                                <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Contractual Terms</h4>
                                <div className="text-[11px] text-gray-500 leading-relaxed font-mono whitespace-pre-wrap pl-6 border-l border-gray-100">
                                    {order.terms}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Dispatcher Note</h4>
                                <p className="text-xs text-[#2A1E16] font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {order.customerNotes || "Standard logistics handling enabled. Site delivery confirmed."}
                                </p>
                            </div>
                        </div>

                        {/* Action Component */}
                        <div className="mt-16">
                            <PaymentPageClient order={order} />

                            {order.status !== 'paid' && (
                                <div className="mt-8 text-center">
                                    <a
                                        href={`/api/invoice/${order.orderId}/pdf`}
                                        target="_blank"
                                        className="text-xs font-bold text-gray-400 hover:text-[var(--terracotta)] underline decoration-dotted underline-offset-4 transition-colors uppercase tracking-widest"
                                    >
                                        Download Proforma Invoice (PDF)
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 text-center">
                            <div className="flex justify-center gap-8 mb-6 opacity-30">
                                <span className="text-[10px] font-black tracking-widest">RAZORPAY SECURE</span>
                                <span className="text-[10px] font-black tracking-widest">PCI DSS COMPLIANT</span>
                            </div>
                            <p className="text-[10px] text-gray-300 max-w-sm mx-auto leading-relaxed uppercase tracking-tighter">
                                Electronic legal document. Generated by UrbanClay Monolith Engine. For support, contact logistics@urbanclay.in or +91 8080081951.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="text-center py-8 text-[10px] text-gray-400 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} UrbanClay Architecture Pvt Ltd. All rights reserved.
            </footer>
        </div>
    );
}
