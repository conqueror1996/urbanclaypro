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
            <div className="bg-green-50 rounded-xl p-8 text-center border border-green-200">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Received</h2>
                <p className="text-green-700">Thank you! Your order is now confirmed.</p>
                <p className="text-xs text-gray-500 mt-4 font-mono mb-6">Ref: {order.paymentId}</p>

                <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-white border border-green-200 text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Invoice
                </button>
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
