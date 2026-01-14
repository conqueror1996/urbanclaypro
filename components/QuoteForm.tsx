'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitLead } from '@/app/actions/submit-lead';
import Image from 'next/image';

export default function QuoteForm() {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        role: 'Architect',
        product: 'Exposed Brick Tiles',
        firmName: '',
        city: '',
        quantity: '',
        timeline: '',
        contact: '',
        email: '',
        name: '',
        notes: ''
    });

    // Auto-fill from URL
    useEffect(() => {
        const productParam = searchParams.get('product');
        const variantParam = searchParams.get('variant');

        if (productParam) {
            setFormData(prev => ({
                ...prev,
                product: productParam,
                notes: variantParam ? `Interested in variant: ${variantParam}` : ''
            }));
        }
    }, [searchParams]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Validation Logic
    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (step === 2) {
            if (!formData.city.trim()) { newErrors.city = 'Required'; isValid = false; }
            if (!formData.quantity.trim()) { newErrors.quantity = 'Required'; isValid = false; }
        }

        if (step === 3) {
            if (!formData.contact.trim()) { newErrors.contact = 'Required'; isValid = false; }
            else if (formData.contact.length < 10) { newErrors.contact = 'Invalid number'; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;
        if (isSubmitted) return;

        setIsSubmitting(true);

        try {
            await submitLead(formData);
        } catch (error) {
            console.error('Lead submission error:', error);
        }

        setIsSubmitting(false);
        setIsSubmitted(true);

        // WhatsApp Redirect
        const message = `*New Quote Request*
----------------
*Role:* ${formData.role}
*Firm:* ${formData.firmName || 'N/A'}
*Product:* ${formData.product}
*City:* ${formData.city}
*Quantity:* ${formData.quantity}
*Timeline:* ${formData.timeline}
*Contact:* ${formData.contact}
*Notes:* ${formData.notes}
----------------
Sent from UrbanClay`;

        const whatsappUrl = `https://wa.me/918080081951?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section id="quote" className="py-20 md:py-32 bg-[#Fbf9f7] border-t border-[var(--line)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-0 bg-white rounded-[2.5rem] shadow-2xl border border-[var(--line)]">

                    {/* LEFT: VISUAL CONTEXT (Premium Side Panel) */}
                    <div className="lg:col-span-5 relative bg-[#1a1512] text-[#EBE5E0] p-10 md:p-16 flex flex-col justify-between min-h-[250px] lg:min-h-[400px] rounded-t-[2.5rem] lg:rounded-l-[2.5rem] lg:rounded-tr-none overflow-hidden">
                        {/* Background Texture/Image */}
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                            <Image
                                src="/images/architect-hero-confidence.png" // Reusing an existing asset for vibe
                                alt="Texture"
                                fill
                                className="object-cover grayscale"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/80 to-[#1a1512]" />

                        <div className="relative z-10">
                            <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                                The Technical Desk
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white mb-6">
                                Let's Build <br /> <span className="italic text-white/50">Details.</span>
                            </h2>
                            <p className="text-white/60 leading-relaxed font-light">
                                Get a precise estimate, technical consultation, or sample box for your next facade project.
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="relative z-10 mt-12 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--terracotta)]">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">2-Hour Response</h4>
                                    <p className="text-xs text-white/40">During business hours (Mon-Sat)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--terracotta)]">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Direct Factory Pricing</h4>
                                    <p className="text-xs text-white/40">No middlemen, straight from kiln.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: INTERACTIVE FORM */}
                    <div className="lg:col-span-7 p-6 md:p-16 bg-white relative rounded-b-[2.5rem] lg:rounded-r-[2.5rem] lg:rounded-bl-none">

                        {/* Progress Header */}
                        <div className="flex items-center justify-between mb-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Step {currentStep} of 3</span>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(step => (
                                    <div
                                        key={step}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${step <= currentStep ? 'w-8 bg-[var(--terracotta)]' : 'w-2 bg-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col justify-between">
                            <AnimatePresence mode='wait'>

                                {/* STEP 1: IDENTITY & CONTEXT */}
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-serif text-[var(--ink)]">What is your role?</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Architect', 'Builder', 'Homeowner', 'Contractor'].map(role => (
                                                    <button
                                                        key={role}
                                                        type="button"
                                                        onClick={() => handleChange('role', role)}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.role === role
                                                            ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/5 text-[var(--terracotta)] shadow-sm'
                                                            : 'border-gray-100 text-[var(--ink)] hover:border-gray-200'
                                                            }`}
                                                    >
                                                        <span className="font-bold text-sm block">{role}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {(formData.role === 'Architect' || formData.role === 'Builder' || formData.role === 'Contractor') && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Firm Name</label>
                                                <input
                                                    value={formData.firmName}
                                                    onChange={e => handleChange('firmName', e.target.value)}
                                                    className="w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    placeholder="Studio / Company Name"
                                                    autoFocus
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-4 pt-4 relative">
                                            <h3 className="text-2xl font-serif text-[var(--ink)]">Interested Product?</h3>

                                            {/* Custom Premium Dropdown */}
                                            <div className="relative z-50">
                                                <button
                                                    type="button"
                                                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                                                    className="w-full bg-[#f8f8f8] rounded-xl px-5 py-4 text-left flex items-center justify-between group hover:ring-2 hover:ring-gray-100 transition-all border border-transparent focus:border-[var(--terracotta)]/30"
                                                >
                                                    <span className="font-medium text-[var(--ink)] text-lg">
                                                        {formData.product}
                                                    </span>
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${productDropdownOpen ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                <AnimatePresence>
                                                    {productDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-2 max-h-[300px] overflow-y-auto z-50"
                                                        >
                                                            {[
                                                                'Exposed Wirecut Bricks',
                                                                'Brick Cladding Tiles',
                                                                'Terracotta Jaali Panels',
                                                                'Clay Facade Systems',
                                                                'Terracotta Floor Tiles'
                                                            ].map((option) => (
                                                                <button
                                                                    key={option}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleChange('product', option);
                                                                        setProductDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-5 py-4 transition-colors flex items-center justify-between group ${formData.product === option
                                                                        ? 'bg-[var(--terracotta)]/5 text-[var(--terracotta)] font-bold'
                                                                        : 'text-[var(--ink)] hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    <span>{option}</span>
                                                                    {formData.product === option && (
                                                                        <svg className="w-5 h-5 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: PROJECT LOGISTICS */}
                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-serif text-[var(--ink)]">Project Logistics</h3>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Project City <span className="text-[var(--terracotta)]">*</span></label>
                                                    <input
                                                        value={formData.city}
                                                        onChange={e => handleChange('city', e.target.value)}
                                                        className={`w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none ${errors.city ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}
                                                        placeholder="Site Location"
                                                        autoFocus
                                                    />
                                                    {errors.city && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.city}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Est. Quantity <span className="text-[var(--terracotta)]">*</span></label>
                                                    <input
                                                        value={formData.quantity}
                                                        onChange={e => handleChange('quantity', e.target.value)}
                                                        className={`w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none ${errors.quantity ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}
                                                        placeholder="Sq. Ft."
                                                    />
                                                    {errors.quantity && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.quantity}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Timeline Requirement</label>
                                                <div className="flex gap-3">
                                                    {['Immediate', '1-2 Months', 'Planning Phase'].map(time => (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => handleChange('timeline', time)}
                                                            className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${formData.timeline === time
                                                                ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white'
                                                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* High Volume Nudge */}
                                            {parseInt(formData.quantity) > 2000 && (
                                                <div className="bg-[var(--terracotta)]/5 p-4 rounded-xl flex items-start gap-3">
                                                    <span className="text-xl">🏭</span>
                                                    <p className="text-xs text-[var(--ink)]/60 leading-relaxed">
                                                        <strong className="text-[var(--terracotta)] block mb-1">High Volume Detected</strong>
                                                        Your volume qualifies for direct-from-kiln pricing. We will assign a senior project manager to this account.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: CONTACT & SUBMIT */}
                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-serif text-[var(--ink)]">Where should we send the estimate?</h3>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Your Name</label>
                                                    <input
                                                        value={formData.name}
                                                        onChange={e => handleChange('name', e.target.value)}
                                                        className="w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium outline-none"
                                                        placeholder="Full Name"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Mobile <span className="text-[var(--terracotta)]">*</span></label>
                                                    <input
                                                        value={formData.contact}
                                                        onChange={e => handleChange('contact', e.target.value)}
                                                        className={`w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium outline-none ${errors.contact ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}
                                                        placeholder="+91 WhatsApp"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Email (Optional)</label>
                                                <input
                                                    value={formData.email}
                                                    onChange={e => handleChange('email', e.target.value)}
                                                    className="w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium outline-none"
                                                    placeholder="architect@studio.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Additional Notes</label>
                                                <textarea
                                                    value={formData.notes}
                                                    onChange={e => handleChange('notes', e.target.value)}
                                                    className="w-full bg-[#f8f8f8] border-none rounded-xl px-5 py-4 text-base text-[var(--ink)] font-medium outline-none h-24 resize-none"
                                                    placeholder="Specify any custom requirements..."
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* NAVIGATION ACTIONS */}
                            <div className="grid grid-cols-12 gap-4 mt-8 pt-8 border-t border-gray-100">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="col-span-3 py-4 rounded-xl text-[var(--ink)] font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                )}

                                <button
                                    type={currentStep === 3 ? 'submit' : 'button'}
                                    onClick={currentStep < 3 ? nextStep : undefined}
                                    disabled={isSubmitting || isSubmitted}
                                    className={`
                                        ${currentStep === 1 ? 'col-span-12' : currentStep === 2 ? 'col-span-9' : 'col-span-9'}
                                        py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3
                                        ${isSubmitted ? 'bg-green-600 text-white cursor-default' : 'bg-[var(--ink)] text-white hover:bg-[var(--terracotta)]'}
                                        disabled:opacity-70 disabled:cursor-not-allowed
                                    `}
                                >
                                    {isSubmitting ? (
                                        'Processing...'
                                    ) : isSubmitted ? (
                                        <><span>✓</span> Request Sent</>
                                    ) : currentStep === 3 ? (
                                        <>Get Estimate <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
                                    ) : (
                                        'Next Step'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

