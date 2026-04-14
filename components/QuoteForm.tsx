'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitLead } from '@/app/actions/submit-lead';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface QuoteFormProps {
    mode?: 'default' | 'export';
    isEmbedded?: boolean;
    keyword?: string;
}

export default function QuoteForm({ mode = 'default', isEmbedded = false, keyword }: QuoteFormProps) {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        role: 'Architect',
        product: keyword || 'Flexible Brick Tiles',
        firmName: '',
        city: '',
        country: '',
        quantity: '',
        timeline: '',
        contact: '',
        email: '',
        name: '',
        notes: mode === 'export' ? 'International Inquiry' : ''
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
            if (mode === 'export') {
                if (!formData.country.trim()) { newErrors.country = 'Required'; isValid = false; }
            } else {
                if (!formData.city.trim()) { newErrors.city = 'Required'; isValid = false; }
            }
            // Quantity is now optional to reduce form friction
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
            const res = await submitLead(formData);
            if (!res.success) throw new Error("Submission failed");
            
            setIsSubmitted(true);
        } catch (error) {
            console.error('Lead submission error:', error);
            alert("Something went wrong. Please try again.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);

        // WhatsApp Redirect
        const message = `*New Quote Request*
----------------
*Role:* ${formData.role}
*Firm:* ${formData.firmName || 'N/A'}
*Product:* ${formData.product}
*${mode === 'export' ? 'Country' : 'City'}:* ${mode === 'export' ? formData.country : formData.city}
*Quantity:* ${formData.quantity}
*Timeline:* ${formData.timeline}
*Contact:* ${formData.contact}
*Notes:* ${formData.notes}
----------------
Sent from UrbanClay ${mode === 'export' ? 'Global' : ''}`;

        const whatsappUrl = `https://wa.me/918080081951?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const formContent = (
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-0 bg-[var(--background)] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-[var(--line)]">


            {/* LEFT: VISUAL CONTEXT (Premium Side Panel) */}
            <div className="lg:col-span-5 relative bg-[var(--sand)] text-[var(--foreground)] p-5 md:p-16 flex flex-col justify-between min-h-[160px] md:min-h-[220px] lg:min-h-[400px] rounded-t-[2rem] lg:rounded-l-[2.5rem] lg:rounded-tr-none overflow-hidden border-r border-[var(--line)]">
                {/* Background Texture/Image */}
                <div className="absolute inset-0 opacity-10 mix-blend-multiply">
                    <Image
                        src="/images/architect-hero-confidence.png"
                        alt="Texture"
                        fill
                        className="object-cover grayscale"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sand)]/80 to-[var(--sand)]" />

                <div className="relative z-10">
                    <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 md:mb-4 block">
                        {mode === 'export' ? 'Global Export Division' : 'The Technical Desk'}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl text-[var(--foreground)] mb-3 md:mb-6">
                        {keyword ? `Quote for ${keyword}` : (mode === 'export' ? 'Logistics' : "Let's Build")} <br className="hidden md:block" /> <span className="italic text-[var(--foreground)]/70">{mode === 'export' ? 'Simplified.' : 'Details.'}</span>
                    </h2>
                    <p className="text-sm md:text-base text-[var(--foreground)]/80 leading-relaxed font-light line-clamp-2 md:line-clamp-none">
                        {mode === 'export'
                            ? 'Technical support for global specification. We handle ASTM certifications and seaworthy logistics.'
                            : 'Get a precise estimate, technical consultation, or sample box for your next project.'}
                    </p>
                </div>

                {/* Trust Indicators - Compact on Mobile */}
                <div className="relative z-10 mt-6 md:mt-12 space-y-3 md:space-y-6 hidden sm:block">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--terracotta)]/10 flex items-center justify-center text-[var(--terracotta)] shrink-0 transition-transform hover:scale-110">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm md:text-base text-[var(--foreground)] tracking-tight whitespace-nowrap">24h Response</h4>
                            <p className="hidden md:block text-xs text-[var(--foreground)]/70">International Desk Timezones</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: INTERACTIVE FORM */}
            <div className="lg:col-span-7 p-5 md:p-16 bg-[var(--background)] relative rounded-b-[2rem] lg:rounded-b-none lg:rounded-r-[2.5rem] lg:rounded-bl-none">

                {/* Progress Header */}
                <div className="flex items-center justify-between mb-6 md:mb-10">
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

                <form onSubmit={handleSubmit} className="min-h-0 md:min-h-[400px] flex flex-col justify-between">
                    <AnimatePresence mode='wait'>

                        {/* STEP 1: IDENTITY & CONTEXT */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-xl md:text-2xl font-serif text-[var(--ink)]">What is your role?</h3>
                                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                                        {['Architect', 'Builder', 'Homeowner', 'Contractor'].map(role => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => handleChange('role', role)}
                                                className={`p-3 md:p-6 rounded-xl md:rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${formData.role === role
                                                    ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/5 text-[var(--terracotta)] shadow-sm'
                                                    : 'border-gray-100 text-[var(--ink)] hover:border-gray-200 bg-gray-50/10'
                                                    }`}
                                            >
                                                <span className="font-bold text-xs md:text-base block">{role}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {(formData.role === 'Architect' || formData.role === 'Builder' || formData.role === 'Contractor') && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Firm Name</label>
                                        <input
                                            value={formData.firmName}
                                            onChange={e => handleChange('firmName', e.target.value)}
                                            className="w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--terracotta)]/20 focus:border-[var(--terracotta)]/30 transition-all outline-none"
                                            placeholder="Studio / Company Name"
                                        />
                                    </div>
                                )}

                                <div className="space-y-3 md:space-y-4 pt-2 md:pt-4 relative">
                                    <h3 className="text-xl md:text-2xl font-serif text-[var(--ink)]">Interested Product?</h3>

                                    {/* Custom Premium Dropdown */}
                                    <div className="relative z-50">
                                        <button
                                            type="button"
                                            onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                                            className="w-full bg-[#f8f8f8] rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-left flex items-center justify-between group hover:ring-2 hover:ring-gray-100 transition-all border border-transparent focus:border-[var(--terracotta)]/30"
                                        >
                                            <span className="font-semibold text-[var(--ink)] text-sm md:text-lg">
                                                {formData.product}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 md:w-6 md:h-6 text-gray-600 transition-transform duration-300 ${productDropdownOpen ? 'rotate-180' : ''}`}
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
                                                    className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-[var(--line)] overflow-hidden py-2 max-h-[300px] overflow-y-auto z-50"
                                                >
                                                    {[
                                                        'Flexible Brick Tiles',
                                                        'Exposed Wirecut Bricks',
                                                        'Brick Cladding Tiles',
                                                        'Terracotta Jali Panels',
                                                        'Clay Facade Panels',
                                                        'Perforated Bricks',
                                                        'Terracotta Wall Tile',
                                                        'Clay Flooring Tile',
                                                        'Dry Brick Tile'
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
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="space-y-6 md:space-y-8">
                                    <h3 className="text-xl md:text-2xl font-serif text-[var(--ink)]">Project Logistics</h3>

                                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">{mode === 'export' ? 'Target Country' : 'Project City'} <span className="text-[var(--terracotta)]">*</span></label>
                                            <input
                                                value={mode === 'export' ? formData.country : formData.city}
                                                onChange={e => handleChange(mode === 'export' ? 'country' : 'city', e.target.value)}
                                                className={`w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none ${(mode === 'export' ? errors.country : errors.city) ? 'ring-2 ring-red-500/20 bg-red-50' : 'focus:border-[var(--terracotta)]/30'}`}
                                                placeholder={mode === 'export' ? "USA, UAE..." : "City"}
                                            />
                                            {(mode === 'export' ? errors.country : errors.city) && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pl-1">{mode === 'export' ? errors.country : errors.city}</p>}
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40 ml-1">Est. Qty <span className="text-[var(--ink)]/20 italic">(Optional)</span></label>
                                            <input
                                                value={formData.quantity}
                                                onChange={e => handleChange('quantity', e.target.value)}
                                                className={`w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none ${errors.quantity ? 'ring-2 ring-red-500/20 bg-red-50' : 'focus:border-[var(--terracotta)]/30'}`}
                                                placeholder="Sq. Ft. or 'TBD'"
                                            />
                                            {errors.quantity && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pl-1">{errors.quantity}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40">Timeline Requirement</label>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {['Immediate', '1-2 Months', 'Planning Phase'].map(time => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => handleChange('timeline', time)}
                                                    className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 text-[9px] md:text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${formData.timeline === time
                                                        ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white shadow-sm'
                                                        : 'border-gray-100 text-gray-600 hover:border-gray-200 bg-gray-50/10'
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
                                className="space-y-4 md:space-y-6"
                            >
                                <h3 className="text-xl md:text-2xl font-serif text-[var(--ink)]">Where should we send the estimate?</h3>

                                <div className="space-y-3 md:space-y-4">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40 ml-1">Your Name</label>
                                            <input
                                                value={formData.name}
                                                onChange={e => handleChange('name', e.target.value)}
                                                className="w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium outline-none focus:ring-2 focus:ring-[var(--terracotta)]/20 focus:border-[var(--terracotta)]/30 transition-all"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40 ml-1">Mobile <span className="text-[var(--terracotta)]">*</span></label>
                                            <input
                                                value={formData.contact}
                                                onChange={e => handleChange('contact', e.target.value)}
                                                type="tel"
                                                inputMode="tel"
                                                className={`w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium outline-none transition-all ${errors.contact ? 'ring-2 ring-red-500/20 bg-red-50' : 'focus:ring-2 focus:ring-[var(--terracotta)]/20 focus:border-[var(--terracotta)]/30'}`}
                                                placeholder={mode === 'export' ? "Number" : "+91..."}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40 ml-1">Email <span className="text-[var(--ink)]/20 italic">(Optional)</span></label>
                                        <input
                                            value={formData.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                            type="email"
                                            inputMode="email"
                                            className="w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium outline-none focus:ring-2 focus:ring-[var(--terracotta)]/20 focus:border-[var(--terracotta)]/30 transition-all"
                                            placeholder="architect@studio.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--ink)]/40 ml-1">Additional Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={e => handleChange('notes', e.target.value)}
                                            className="w-full bg-[#f8f8f8] border border-transparent rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 text-sm md:text-lg text-[var(--ink)] font-medium outline-none h-24 md:h-36 resize-none focus:ring-2 focus:ring-[var(--terracotta)]/20 focus:border-[var(--terracotta)]/30 transition-all"
                                            placeholder="Requirement details..."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* NAVIGATION ACTIONS */}
                    <div className="grid grid-cols-12 gap-4 mt-4 md:mt-8 pt-4 md:pt-8 border-t border-gray-100">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="col-span-4 md:col-span-3 py-3 md:py-4 rounded-xl text-[var(--ink)] font-bold text-[10px] md:text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type={currentStep === 3 ? 'submit' : 'button'}
                            onClick={currentStep < 3 ? nextStep : undefined}
                            disabled={isSubmitting || isSubmitted}
                            className={`
                                ${currentStep === 1 ? 'col-span-12' : 'col-span-8 md:col-span-9'}
                                py-3.5 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2
                                ${isSubmitted ? 'bg-green-600 text-white cursor-default' : 'bg-[var(--ink)] text-white hover:bg-[var(--terracotta)]'}
                                disabled:opacity-70 disabled:cursor-not-allowed text-[11px] md:text-base
                            `}
                        >
                            {isSubmitting ? (
                                'Processing...'
                            ) : isSubmitted ? (
                                <>✓ Sent Successfully</>
                            ) : currentStep === 3 ? (
                                <>Get Estimate <ArrowRight className="w-4 h-4" /></>
                            ) : (
                                'Next Phase'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (isEmbedded) return formContent;

    return (
        <section id="quote" className={`py-16 md:py-24 bg-[var(--background)] ${mode === 'export' ? '' : 'border-t border-[var(--line)]'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {formContent}
            </div>
        </section>
    );
}

