'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '@/app/actions/submit-lead';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    variantName?: string;
}

export default function QuoteModal({ isOpen, onClose, productName, variantName }: QuoteModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial State
    const [formData, setFormData] = useState({
        role: 'Architect',
        product: productName,
        firmName: '',
        city: '',
        quantity: '',
        timeline: '',
        contact: '',
        notes: ''
    });

    const [errors, setErrors] = useState({
        city: '',
        quantity: '',
        contact: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Reset form when opened, but keep product
            setFormData(prev => ({
                ...prev,
                product: productName,
                notes: variantName ? `Variant: ${variantName}` : ''
            }));
            setCurrentStep(1);
            setErrors({ city: '', quantity: '', contact: '' });
        }
    }, [isOpen, productName, variantName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step: number) => {
        let isValid = true;
        const newErrors = { ...errors };

        if (step === 2) {
            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
                isValid = false;
            }
            if (!formData.quantity.trim()) {
                newErrors.quantity = 'Quantity is required';
                isValid = false;
            }
        }

        if (step === 3) { // Final validation before submit
            if (!formData.contact.trim()) {
                newErrors.contact = 'Required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        setIsSubmitting(true);

        try {
            // 1. Submit to CMS (Server Action)
            await submitLead(formData);
        } catch (err) {
            console.error(err);
        }

        // 2. Open WhatsApp
        const message = `*New Quote Request*
----------------
*Product:* ${formData.product}
*Variant:* ${variantName || 'N/A'}
*Role:* ${formData.role}
*City:* ${formData.city}
*Quantity:* ${formData.quantity}
*Contact:* ${formData.contact}
*Notes:* ${formData.notes}
----------------
Sent from UrbanClay Website`;

        const whatsappUrl = `https://wa.me/918080081951?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg bg-[#1a1512] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div>
                        <h3 className="text-xl font-serif text-[#EBE5E0]">Request Quote</h3>
                        <p className="text-white/40 text-xs mt-1">Get pricing for {productName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/60 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map(step => (
                        <div key={step} className={`h-1 flex-1 rounded-full bg-white/10 ${currentStep >= step ? 'bg-[var(--terracotta)]' : ''}`} />
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">I am a...</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#EBE5E0] focus:border-[var(--terracotta)] outline-none"
                                    >
                                        <option value="Architect" className="bg-[#1a1512]">Architect</option>
                                        <option value="Builder" className="bg-[#1a1512]">Builder</option>
                                        <option value="Homeowner" className="bg-[#1a1512]">Homeowner</option>
                                        <option value="Contractor" className="bg-[#1a1512]">Contractor</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-[var(--terracotta)]/10 rounded-xl border border-[var(--terracotta)]/20">
                                    <p className="text-[var(--terracotta)] text-sm mb-1 font-medium">Why we ask?</p>
                                    <p className="text-white/60 text-xs">We customize pricing based on project type and volume.</p>
                                </div>
                                <button type="button" onClick={nextStep} className="w-full py-4 bg-[var(--terracotta)] text-white font-bold uppercase tracking-widest text-xs rounded-xl mt-4">
                                    Next
                                </button>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Project City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Bangalore"
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-[#EBE5E0] focus:border-[var(--terracotta)] outline-none ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Quantity (Approx)</label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="e.g. 1000 sq ft"
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-[#EBE5E0] focus:border-[var(--terracotta)] outline-none ${errors.quantity ? 'border-red-500' : 'border-white/10'}`}
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={prevStep} className="flex-1 py-4 bg-white/5 text-white/60 font-bold uppercase tracking-widest text-xs rounded-xl">
                                        Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-[var(--terracotta)] text-white font-bold uppercase tracking-widest text-xs rounded-xl">
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="+91"
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-[#EBE5E0] focus:border-[var(--terracotta)] outline-none ${errors.contact ? 'border-red-500' : 'border-white/10'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Any specific variation?"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#EBE5E0] focus:border-[var(--terracotta)] outline-none resize-none"
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={prevStep} className="flex-1 py-4 bg-white/5 text-white/60 font-bold uppercase tracking-widest text-xs rounded-xl">
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 bg-[var(--terracotta)] text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                <span>Get Quote on WhatsApp</span>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
}
