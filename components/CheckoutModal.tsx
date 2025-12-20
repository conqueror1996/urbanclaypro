'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSampleBox } from '@/context/SampleContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    sampleType: 'regular' | 'curated';
}

export default function CheckoutModal({ isOpen, onClose, sampleType }: CheckoutModalProps) {
    const { box } = useSampleBox();
    const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

    const pricing = {
        regular: { price: 999, label: '5 Samples', description: 'Your selected samples' },
        curated: { price: 2000, label: 'Curated Collection', description: 'Expert curated premium samples' }
    };

    const currentPricing = pricing[sampleType];

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleProceedToPayment = () => {
        if (validate()) {
            setStep('payment');
            initializeRazorpay();
        }
    };

    const initializeRazorpay = () => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    };

    const handlePayment = () => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', // Replace with your Razorpay key
            amount: currentPricing.price * 100, // Amount in paise
            currency: 'INR',
            name: 'Urban Clay',
            description: `${currentPricing.label} - Sample Box`,
            image: '/logo.png',
            handler: function (response: any) {
                // Payment successful
                console.log('Payment successful:', response);
                setStep('success');

                // Send confirmation to backend/WhatsApp
                sendOrderConfirmation(response.razorpay_payment_id);
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            notes: {
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                sampleType: sampleType
            },
            theme: {
                color: '#C17A5F'
            },
            modal: {
                ondismiss: function () {
                    setStep('details');
                }
            }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    const sendOrderConfirmation = (paymentId: string) => {
        const productList = sampleType === 'regular'
            ? box.map((s, i) => `${i + 1}. ${s.name}`).join('\n')
            : 'Curated Premium Collection';

        const message = `*New Sample Order - PAID*\n\n*Payment ID:* ${paymentId}\n*Type:* ${currentPricing.label}\n*Amount:* ₹${currentPricing.price}\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\n*Shipping Address:*\n${formData.address}\n${formData.city}, ${formData.pincode}\n\n*Samples:*\n${productList}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/918080081951?text=${encodedMessage}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#2A1E16]/60 backdrop-blur-md"
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

                        {step === 'details' && (
                            <>
                                <div className="text-center mb-6">
                                    <span className="text-[var(--terracotta)] font-bold text-xs uppercase tracking-widest">Premium Samples</span>
                                    <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mt-2">{currentPricing.label}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{currentPricing.description}</p>
                                    <div className="mt-4 inline-flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-[#2A1E16]">₹{currentPricing.price}</span>
                                        <span className="text-gray-500 text-sm">+ shipping</span>
                                    </div>
                                </div>

                                {sampleType === 'regular' && box.length > 0 && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Your Selection</h4>
                                        <div className="space-y-2">
                                            {box.map((sample, i) => (
                                                <div key={sample.id} className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                                        {sample.texture.includes('url') ? (
                                                            <img
                                                                src={sample.texture.match(/url\(['"]?([^'"\)]+)['"]?\)/)?.[1] || sample.texture}
                                                                alt={sample.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full" style={{ backgroundColor: sample.color }} />
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{sample.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <form className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name *"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all`}
                                        />
                                        {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone *"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all`}
                                            />
                                            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email *"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all`}
                                            />
                                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <textarea
                                            name="address"
                                            placeholder="Shipping Address *"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all resize-none`}
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
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all`}
                                            />
                                            {errors.city && <span className="text-red-500 text-xs mt-1">{errors.city}</span>}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="pincode"
                                                placeholder="Pincode *"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                maxLength={6}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none transition-all`}
                                            />
                                            {errors.pincode && <span className="text-red-500 text-xs mt-1">{errors.pincode}</span>}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleProceedToPayment}
                                        className="w-full py-4 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#a85638] transition-all shadow-lg"
                                    >
                                        Proceed to Payment
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Close checkout and scroll to/focus on the free consultation form in parent or handle here?
                                            // Since this is a modal on top of SampleModal, we can just close this and let them use the form we just renamed.
                                            // OR we can make this button submit the current details as a lead directly.
                                            // Let's submit as lead directly since they filled details here.
                                            const event = new CustomEvent('switchToConsultation', { detail: formData });
                                            window.dispatchEvent(event);
                                            onClose();
                                        }}
                                        className="w-full py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--terracotta)] transition-colors"
                                    >
                                        I just need free guidance
                                    </button>
                                </form>
                            </>
                        )}

                        {step === 'payment' && (
                            <div className="text-center py-12">
                                <div className="mb-6">
                                    <div className="w-20 h-20 bg-[var(--terracotta)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mb-2">Secure Payment</h3>
                                    <p className="text-gray-600 mb-6">Complete your payment to confirm order</p>
                                    <div className="text-3xl font-bold text-[#2A1E16] mb-8">₹{currentPricing.price}</div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    className="w-full py-4 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#a85638] transition-all shadow-lg mb-4"
                                >
                                    Pay with Razorpay
                                </button>

                                <button
                                    onClick={() => setStep('details')}
                                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                                >
                                    ← Back to details
                                </button>
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
                                <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mb-3">Payment Successful!</h3>
                                <p className="text-gray-600 mb-8">Your sample box will be dispatched within 2-3 business days.</p>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#a85638] transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
