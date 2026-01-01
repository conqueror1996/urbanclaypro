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

    return (
        <div className="bg-[#1a1512] min-h-screen">
            <Header />
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="bg-[#2A1E16] p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10"></div>
                        <p className="text-[var(--terracotta)] font-bold uppercase tracking-widest text-xs mb-2">Official Payment Link</p>
                        <h1 className="text-3xl font-serif">Order Invoice</h1>
                        <p className="opacity-60 text-sm mt-2 font-mono">#{order.orderId}</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-gray-100">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</p>
                                <h3 className="text-xl font-bold text-[#2A1E16]">{order.clientName}</h3>
                                <p className="text-gray-500">{order.clientEmail}</p>
                                <p className="text-gray-500">{order.clientPhone}</p>
                            </div>
                            <div className="mt-6 md:mt-0 md:text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Details</p>
                                <p className="text-gray-900 font-medium">Issue Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-900 font-medium">Status:
                                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">{order.productName}</span>
                                <span className="font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                                Timeline: {order.deliveryTimeline || 'Standard Delivery'}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="mb-10">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Terms & Conditions</h4>
                            <div className="text-sm text-gray-500 space-y-2 whitespace-pre-wrap pl-4 border-l-2 border-gray-100">
                                {order.terms}
                            </div>
                        </div>

                        {/* Action */}
                        <PaymentPageClient order={order} />

                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-gray-400">
                                Platform secured by SSL. Payments processed by Razorpay.
                                <br />For support, contact +91 8080081951
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
