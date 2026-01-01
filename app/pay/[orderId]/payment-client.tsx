'use client';

import React, { useState, useEffect } from 'react';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/payment'; // Reusing your robust actions
import { markPaymentLinkAsPaid } from '@/app/actions/payment-link';
import { useRouter } from 'next/navigation';

export default function PaymentPageClient({ order }: { order: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load Razorpay Script proactively
        if (!order.status || order.status === 'pending') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [order.status]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const receiptId = `rcpt_${order.orderId}`;
            const orderRes = await createRazorpayOrder(order.amount, receiptId);

            if (!orderRes.success || !orderRes.orderId) {
                alert("Gateway Error. Please try again.");
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
                    await handleVerification(response, orderRes.orderId);
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

    const handleVerification = async (response: any, rzpOrderId: string) => {
        const verify = await verifyRazorpayPayment(rzpOrderId, response.razorpay_payment_id, response.razorpay_signature);

        if (verify.success) {
            // Update Backend
            await markPaymentLinkAsPaid(order.orderId, response.razorpay_payment_id);

            // Reload to show paid state
            router.refresh();
        } else {
            alert("Payment verification failed!");
            setLoading(false);
        }
    };

    if (order.status === 'paid') {
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
                        <span className="text-gray-400">Order ID</span>
                        <span className="font-mono text-gray-900 font-bold">{order.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-400">Transaction ID</span>
                        <span className="font-mono text-gray-400">{order.paymentId}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-400">Payment Date</span>
                        <span className="text-gray-900">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t-2 border-gray-100">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <span className="text-lg font-bold text-gray-900">Total Paid</span>
                            <span className="text-2xl font-serif font-bold text-[#b45a3c]">₹{order.amount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-3 bg-[#2A1E16] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Download Invoice (PDF)
                    </button>
                    <a
                        href="/"
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                        Back to Home
                    </a>
                </div>

                <p className="mt-12 text-center text-xs text-gray-400 uppercase tracking-widest leading-relaxed">
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
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-5 bg-[#b45a3c] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-[#8e452e] hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
            {loading ? (
                <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                </>
            ) : (
                <>Pay ₹{order.amount.toLocaleString('en-IN')}</>
            )}
        </button>
    );
}
