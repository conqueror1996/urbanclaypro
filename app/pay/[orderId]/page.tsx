import React from 'react';
import { notFound } from 'next/navigation';
import { getPaymentLinkDetails } from '@/app/actions/payment-link';
import PaymentPageClient from './payment-client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        <div className="bg-[#1a1512] min-h-screen">
            <Header />
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">

                    {/* Official Banner */}
                    <div className="bg-[#2A1E16] p-10 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <p className="text-[var(--terracotta)] font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Authentic Secure Invoice</p>
                            <h1 className="text-4xl font-serif">Settlement & Disbursement</h1>
                            <p className="opacity-40 text-[10px] mt-4 font-mono tracking-widest uppercase">Token ID: {order.orderId}</p>
                        </div>
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
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Created</p>
                                        <p className="text-gray-900 font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    </div>
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
                        <div className="mb-12 border border-gray-100 rounded-[2rem] overflow-hidden bg-gray-50/30">
                            <table className="w-full text-left">
                                <thead className="bg-[#fcfaf9] text-gray-400 text-[10px] font-extrabold uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5">Particulars</th>
                                        <th className="px-6 py-5 text-center">Qty</th>
                                        <th className="px-6 py-5 text-right whitespace-nowrap">Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.lineItems?.map((item: any, i: number) => (
                                        <tr key={i} className="hover:bg-white/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-[#2A1E16] text-lg">{item.name}</div>
                                                <div className="text-[11px] text-gray-400 mt-1 italic">{item.description}</div>
                                            </td>
                                            <td className="px-6 py-6 text-center font-mono font-bold text-gray-400">{item.quantity}</td>
                                            <td className="px-8 py-6 text-right font-bold text-[#2A1E16]">
                                                ₹{((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t border-gray-100">
                                    <tr className="text-gray-500 text-sm">
                                        <td colSpan={2} className="px-8 py-3 text-right">Subtotal & Tax</td>
                                        <td className="px-8 py-3 text-right font-mono">₹{(subtotal - totalDiscount + totalTax).toLocaleString('en-IN')}</td>
                                    </tr>
                                    {order.shippingCharges > 0 && (
                                        <tr className="text-gray-500 text-sm">
                                            <td colSpan={2} className="px-8 py-2 text-right">Shipping / Logistics</td>
                                            <td className="px-8 py-2 text-right font-mono">₹{order.shippingCharges.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    {Math.abs(order.adjustment) > 0 && (
                                        <tr className="text-gray-500 text-sm">
                                            <td colSpan={2} className="px-8 py-2 text-right">Adjustments</td>
                                            <td className="px-8 py-2 text-right font-mono">₹{order.adjustment.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    {order.tdsOption !== 'none' && (
                                        <tr className="text-gray-500 text-sm italic">
                                            <td colSpan={2} className="px-8 py-2 text-right uppercase text-[10px] font-bold tracking-widest">{order.tdsOption} Adjustment ({order.tdsRate}%)</td>
                                            <td className="px-8 py-2 text-right font-mono">₹{settlementAdjust.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    <tr className="bg-[#2A1E16] text-white">
                                        <td colSpan={2} className="px-8 py-6 text-right font-bold uppercase tracking-widest text-xs">Gross Settlement Amount</td>
                                        <td className="px-8 py-6 text-right text-3xl font-serif text-[var(--terracotta)]">
                                            ₹{order.amount.toLocaleString('en-IN')}
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
            <Footer />
        </div>
    );
}
