'use client';

import React, { useState, useEffect } from 'react';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/payment'; // Reusing your robust actions
import { markPaymentLinkAsPaid } from '@/app/actions/payment-link';
import { useRouter } from 'next/navigation';

export default function PaymentPageClient({ order }: { order: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [amountToPay, setAmountToPay] = useState(order.amount);

    useEffect(() => {
        // Load Razorpay Script proactively
        if (!order.status || order.status === 'pending' || order.status === 'partially_paid') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [order.status]);

    const handlePayment = async () => {
        if (!amountToPay || amountToPay < 1) {
            alert('Amount must be greater than zero.');
            return;
        }
        if (amountToPay > order.amount) {
            alert('Amount cannot be greater than the total order amount.');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order
            const receiptId = `rcpt_${order.orderId}`;
            const orderRes = await createRazorpayOrder(amountToPay, receiptId);

            if (!orderRes.success || !orderRes.orderId) {
                alert(`Gateway Error: ${orderRes.error || 'Please try again.'}`);
                setLoading(false);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderRes.amount,
                currency: orderRes.currency,
                name: 'UrbanClay',
                description: `Order #${order.orderId}`,
                image: 'https://claytile.in/urbanclay-logo.png',
                order_id: orderRes.orderId,
                handler: async function (response: any) {
                    await handleVerification(response, orderRes.orderId, amountToPay);
                },
                prefill: {
                    name: order.clientName,
                    email: order.clientEmail,
                    contact: order.clientPhone
                },
                theme: { color: '#b45a3c' },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error(error);
            alert("Payment initialization failed.");
            setLoading(false);
        }
    };

    const handleVerification = async (response: any, rzpOrderId: string, amountPaid: number) => {
        const verify = await verifyRazorpayPayment(rzpOrderId, response.razorpay_payment_id, response.razorpay_signature);

        if (verify.success) {
            // Update Backend
            const updateRes = await markPaymentLinkAsPaid(order.orderId, response.razorpay_payment_id, amountPaid);

            if (updateRes.success) {
                // Reload to show paid state
                router.refresh();
            } else {
                alert(`Payment Received but Order Update Failed: ${updateRes.error || 'Unknown Error'}. Please contact support with Order ID: ${order.orderId}`);
                setLoading(false);
            }
        } else {
            alert("Payment verification failed! Please check your internet connection.");
            setLoading(false);
        }
    };

    if (order.status === 'paid' || (order.status === 'partially_paid' && order.paidAmount >= order.amount)) {
        return (
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-8 md:p-12 print:p-0 print:shadow-none print:border-none">
                {/* PAID Watermark */}
                <div className="absolute top-10 right-10 -rotate-12 border-4 border-green-500/20 text-green-500/20 px-4 py-1 rounded text-4xl font-black select-none pointer-events-none uppercase">
                    Paid
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-serif text-gray-900 mb-2">Payment Receipt</h2>
                    <p className="text-gray-500 text-sm">Thank you for your business. Your order is now being processed.</p>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-mono text-gray-900 font-bold">{order.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-mono text-gray-600">{order.paymentId}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-600">Payment Date</span>
                        <span className="text-gray-900">{new Date(order.paidAt || new Date()).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t-2 border-gray-100">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <span className="text-lg font-bold text-gray-900">Total Paid</span>
                            <span className="text-2xl font-serif font-bold text-[#b45a3c]">₹{(order.paidAmount || order.amount).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                    <a
                        href={`/api/invoice/${order.orderId}/pdf?t=${new Date().getTime()}`}
                        download
                        className="px-8 py-3 bg-[#b45a3c] text-white font-bold rounded-xl hover:bg-[#8e452e] transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download Official Invoice
                    </a>
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-3 bg-[#2A1E16] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Receipt
                    </button>
                </div>

                <p className="mt-12 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
                    Official Document issued by UrbanClay Solutions Pvt Ltd.
                    <br />Digital Verification ID: {order.orderId.split('-').pop()}
                </p>
            </div>
        );
    }

    if (order.status === 'expired') {
        return (
            <div className="bg-red-50 rounded-xl p-8 text-center border border-red-200">
                <h2 className="text-xl font-bold text-red-800 mb-2">Link Expired</h2>
                <p className="text-red-700">Please contact sales for a new payment link.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {order.status === 'partially_paid' && order.paidAmount > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                    <p className="text-emerald-800 font-bold mb-1">Partially Paid</p>
                    <p className="text-sm text-emerald-700">₹{order.paidAmount.toLocaleString('en-IN')} has already been paid.</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Pending Balance: ₹{(order.amount - order.paidAmount).toLocaleString('en-IN')}</p>
                </div>
            )}

            <div className="bg-orange-50/50 p-6 border border-orange-100 hover:border-orange-300 transition-colors rounded-3xl flex flex-col gap-3 group relative overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs uppercase font-bold text-orange-800 tracking-widest leading-none">Enter Amount to Pay (₹)</label>
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-bold uppercase tracking-widest">Flexible Payment</span>
                </div>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-serif text-orange-400 font-bold pointer-events-none">₹</span>
                    <input
                        type="number"
                        value={amountToPay === 0 ? '' : amountToPay}
                        onChange={(e) => setAmountToPay(Number(e.target.value))}
                        min={1}
                        max={order.status === 'partially_paid' ? order.amount - order.paidAmount : order.amount}
                        className="w-full bg-white text-4xl font-serif font-bold text-[#b45a3c] border-2 border-orange-200 rounded-2xl p-5 pl-12 focus:ring-0 focus:border-[#b45a3c] transition-all no-spinner shadow-inner placeholder-orange-200"
                        placeholder="0"
                    />
                </div>

                <div className="flex justify-between items-center text-xs text-orange-700/70 font-medium px-2 mt-2">
                    <span className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity"><svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> You can pay an advance/partial amount.</span>
                    <span className="bg-white px-3 py-1.5 rounded-lg border border-orange-100 tabular-nums">Total Pending: ₹{(order.status === 'partially_paid' ? order.amount - order.paidAmount : order.amount).toLocaleString('en-IN')}</span>
                </div>
            </div>

            <button
                onClick={handlePayment}
                disabled={loading || !amountToPay || amountToPay < 1}
                className="w-full py-5 bg-[#b45a3c] text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-[#8e452e] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 relative overflow-hidden group"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Securely...
                    </>
                ) : (
                    <>Authorize Payment of ₹{amountToPay.toLocaleString('en-IN')}</>
                )}
            </button>

            <style jsx global>{`
                .no-spinner::-webkit-inner-spin-button, 
                .no-spinner::-webkit-outer-spin-button { 
                   -webkit-appearance: none; 
                   margin: 0; 
                }
                .no-spinner { 
                   -moz-appearance: textfield; 
                }
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}
