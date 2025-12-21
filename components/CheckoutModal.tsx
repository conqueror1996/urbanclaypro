'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSampleBox } from '@/context/SampleContext';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/payment';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    sampleType: 'regular' | 'curated';
}

export default function CheckoutModal({ isOpen, onClose, sampleType }: CheckoutModalProps) {
    const { box } = useSampleBox();
    const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
    const [loading, setLoading] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen]);

    const pricing = {
        regular: { price: 999, label: '5 Samples', description: 'Your selected samples' },
        curated: { price: 2000, label: 'Curated Collection', description: 'Expert curated premium samples' }
    };

    const currentPricing = pricing[sampleType];

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        role: 'Home Owner',
        address: '',
        city: '',
        pincode: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Required';
        if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid phone required';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
        if (!formData.address.trim()) newErrors.address = 'Required';
        if (!formData.city.trim()) newErrors.city = 'Required';
        if (!formData.pincode.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Valid pincode required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    useEffect(() => {
        // Load Razorpay Script proactively
        if (isOpen && !(window as any).Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [isOpen]);

    const handleProceedToPayment = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // 1. Create Server-Side Order
            const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;
            const orderRes = await createRazorpayOrder(currentPricing.price, receiptId);

            if (!orderRes.success || !orderRes.orderId) {
                alert("Failed to initialize payment gateway. Please try again.");
                setLoading(false);
                return;
            }

            setStep('payment');
            openRazorpay(orderRes.orderId);
        } catch (error) {
            console.error(error);
            alert("Connection error. Please check internet.");
            setLoading(false);
        }
    };

    const openRazorpay = (orderId: string) => {
        if (!(window as any).Razorpay) {
            alert("Razorpay SDK failed to load. Please refresh.");
            setLoading(false);
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: currentPricing.price * 100,
            currency: 'INR',
            name: 'Urban Clay',
            description: `${currentPricing.label}`,
            image: 'https://raw.githubusercontent.com/conqueror1996/urbanclaypro/main/public/urbanclay-logo.png', // Fallback URL
            order_id: orderId, // Secure Order ID
            handler: async function (response: any) {
                await handleVerification(response);
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            notes: {
                address: formData.city,
                role: formData.role
            },
            theme: { color: '#b45a3c' },
            modal: {
                ondismiss: function () {
                    setLoading(false); // Enable buttons again
                }
            }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    const handleVerification = async (response: any) => {
        setStep('processing');
        try {
            // Prepare Lead Data
            const sampleItems = sampleType === 'regular' ? box.map(s => s.name) : ['Curated Premium Collection'];

            const leadData = {
                role: formData.role,
                product: sampleType === 'regular' ? `Sample Box (${box.length}) - PAID` : 'Curated Samples - PAID',
                firmName: formData.role === 'Architect' ? formData.name + ' Studio' : 'Private Residence',
                city: formData.city,
                quantity: 'Sample Box',
                timeline: 'Immediate',
                contact: formData.phone,
                email: formData.email,
                address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                notes: `PAID ORDER via Razorpay.`, // Payment IDs will be added by server action
                isSampleRequest: true,
                sampleItems: sampleItems,
                fulfillmentStatus: 'pending'
            };

            // 2. Verify Payment AND Submit Lead in one Atomic Server Action
            // This ensures no lead is created unless payment is verified on server
            const { verifyPaymentAndSubmitLead } = await import('@/app/actions/payment');

            const result = await verifyPaymentAndSubmitLead(
                {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                },
                leadData
            );

            if (result.success) {
                setStep('success');
                sendWhatsAppConfirmation(response.razorpay_payment_id);
            } else {
                alert(result.error || "Payment verification failed! Please contact support.");
                setStep('details');
            }
        } catch (error) {
            console.error("Verification/Submission Error", error);
            alert("Payment processed but order creation failed. Please contact support with Payment ID: " + response.razorpay_payment_id);
            setStep('success'); // Payment is done, so show success to avoid user panic, but log error
        } finally {
            setLoading(false);
        }
    };

    // Helper: WhatsApp (Client Side Only)
    const sendWhatsAppConfirmation = (paymentId: string) => {
        const productList = sampleType === 'regular'
            ? box.map((s, i) => `${i + 1}. ${s.name}`).join('\n')
            : 'Curated Premium Collection';

        const message = `*New Sample Order - PAID*\n\n*Payment ID:* ${paymentId}\n*Role:* ${formData.role}\n*Amount:* ₹${currentPricing.price}\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\n*Shipping Address:*\n${formData.address}\n${formData.city}, ${formData.pincode}\n\n*Samples:*\n${productList}`;

        // This function doesn't automatically open URL unless uncommented below
        // const encodedMessage = encodeURIComponent(message);
        // window.open(`https://wa.me/918080081951?text=${encodedMessage}`, '_blank');
    };

    const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#2A1E16]/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {(step === 'details' || step === 'payment') && (
                            <>
                                <div className="text-center mb-6">
                                    {isTestMode && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200 mb-2 inline-block">TEST MODE</span>}
                                    <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mt-2">{currentPricing.label}</h3>
                                    <div className="mt-2 inline-flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-[#2A1E16]">₹{currentPricing.price}</span>
                                        <span className="text-gray-500 text-sm">inc. taxes</span>
                                    </div>
                                </div>

                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name *"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] outline-none text-sm`}
                                            />
                                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone *"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-[var(--terracotta)] outline-none text-sm`}
                                            />
                                            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
                                        </div>
                                        <div>
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--terracotta)] outline-none text-sm bg-white"
                                            >
                                                <option value="Home Owner">Home Owner</option>
                                                <option value="Architect">Architect</option>
                                                <option value="Interior Designer">Interior Designer</option>
                                                <option value="Builder">Builder / Developer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address *"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-[var(--terracotta)] outline-none text-sm`}
                                        />
                                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                                    </div>

                                    <div>
                                        <textarea
                                            name="address"
                                            placeholder="Complete Shipping Address *"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-300' : 'border-gray-200'} focus:border-[var(--terracotta)] outline-none text-sm resize-none`}
                                        />
                                        {errors.address && <span className="text-red-500 text-xs mt-1">{errors.address}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City *"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-300' : 'border-gray-200'} focus:border-[var(--terracotta)] outline-none text-sm`}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="pincode"
                                                placeholder="Pincode *"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                maxLength={6}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.pincode ? 'border-red-300' : 'border-gray-200'} focus:border-[var(--terracotta)] outline-none text-sm`}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={handleProceedToPayment}
                                            className="w-full py-4 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#a85638] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                        >
                                            {loading ? 'Initializing Secure Payment...' : 'Proceed to Pay'}
                                            {!loading && <span className="text-lg">→</span>}
                                        </button>
                                        <p className="text-[10px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Secured by Razorpay
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const event = new CustomEvent('switchToConsultation', { detail: formData });
                                            window.dispatchEvent(event);
                                            onClose();
                                        }}
                                        className="w-full py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--terracotta)] transition-colors"
                                    >
                                        I just need free guidance
                                    </button>
                                </form>
                            </>
                        )}

                        {step === 'processing' && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="text-xl font-serif font-bold text-[#2A1E16] mb-2">Verifying Payment...</h3>
                                <p className="text-gray-500 text-sm">Please do not close this window.</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                                <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mb-3">Order Confirmed!</h3>
                                <p className="text-gray-600 mb-8">Thank you, {formData.name}. Your samples will be dispatched shortly.</p>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#a85638] transition-all"
                                >
                                    Close & Return to Browsing
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
