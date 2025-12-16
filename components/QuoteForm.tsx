'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitLead } from '@/app/actions/submit-lead';

export default function QuoteForm() {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        role: 'Architect',
        product: 'Exposed Brick Tiles',
        firmName: '',
        city: '',
        quantity: '',
        timeline: '',
        contact: '',
        notes: ''
    });

    useEffect(() => {
        const productParam = searchParams.get('product');
        const variantParam = searchParams.get('variant');

        if (productParam) {
            setFormData(prev => ({
                ...prev,
                product: productParam, // We will allow custom values, but might need to add to select options
                notes: variantParam ? `Interested in variant: ${variantParam}` : ''
            }));
        }
    }, [searchParams]);

    const [errors, setErrors] = useState({
        city: '',
        quantity: '',
        contact: ''
    });

    const nextStep = () => {
        if (currentStep === 2) {
            // Validate step 2
            let isValid = true;
            const newErrors = { ...errors };

            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
                isValid = false;
            }
            if (!formData.quantity.trim()) {
                newErrors.quantity = 'Quantity is required';
                isValid = false;
            }

            setErrors(newErrors);
            if (!isValid) return;
        }
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { city: '', quantity: '', contact: '' };

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
            isValid = false;
        }

        if (!formData.quantity.trim()) {
            newErrors.quantity = 'Quantity is required';
            isValid = false;
        }

        if (!formData.contact.trim()) {
            newErrors.contact = 'Contact number is required';
            isValid = false;
        } else if (formData.contact.length < 10) {
            newErrors.contact = 'Please enter a valid phone number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Save to CMS first
            const result = await submitLead(formData);
            if (result.success && result.isSerious) {

            }
        } catch (error) {
            console.error('Failed to save lead:', error);
            // We continue to WhatsApp even if CMS save fails so we don't block the user
        }

        setIsSubmitting(false);

        const message = `*New Quote Request*
----------------
*Role:* ${formData.role}
*Firm Name:* ${formData.firmName || 'N/A'}
*Product:* ${formData.product}
*City:* ${formData.city}
*Quantity:* ${formData.quantity}
*Timeline:* ${formData.timeline}
*Contact:* ${formData.contact}
*Notes:* ${formData.notes}
----------------
Sent from UrbanClay Website`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/918080081951?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <section id="quote" className="bg-[var(--sand)] border-t border-[var(--line)] py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl border border-[var(--line)] overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-serif text-[#2A1E16] mb-4">Request a Quote</h2>
                            <p className="text-[#5d554f]">Tell us about your project, and we'll get back to you with a personalized estimate.</p>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= step ? 'bg-[var(--terracotta)] text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`w-12 h-0.5 mx-2 transition-colors ${currentStep > step ? 'bg-[var(--terracotta)]' : 'bg-gray-200'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {currentStep === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">I am a...</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16]"
                                        >
                                            <option value="Architect">Architect</option>
                                            <option value="Builder">Builder</option>
                                            <option value="Homeowner">Homeowner</option>
                                            <option value="Contractor">Contractor</option>
                                        </select>
                                    </div>

                                    {/* Conditional Firm Name Input */}
                                    {['Architect', 'Builder', 'Contractor'].includes(formData.role) && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">Firm Name</label>
                                            <input
                                                name="firmName"
                                                value={formData.firmName}
                                                onChange={handleChange}
                                                placeholder="Enter firm name"
                                                className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16]"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">Interested in...</label>
                                        <select
                                            name="product"
                                            value={formData.product}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16]"
                                        >
                                            <option value="Exposed Brick Tiles">Exposed Brick Tiles</option>
                                            <option value="Linear Tiles">Linear Tiles</option>
                                            <option value="Terracotta Jaali">Terracotta Jaali</option>
                                            <option value="Clay Floor Tiles">Clay Floor Tiles</option>
                                            <option value="Clay Ceiling Tiles">Clay Ceiling Tiles</option>
                                            {/* Dynamically add option if it comes from URL and isn't in the list */}
                                            {![
                                                'Exposed Brick Tiles',
                                                'Linear Tiles',
                                                'Terracotta Jaali',
                                                'Clay Floor Tiles',
                                                'Clay Ceiling Tiles'
                                            ].includes(formData.product) && (
                                                    <option value={formData.product}>{formData.product}</option>
                                                )}
                                        </select>
                                    </div>

                                    {/* SuperBuild Inline Nudge */}
                                    <div
                                        className="w-full bg-white border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4"
                                        data-partner="superbuild"
                                        data-placement="quote-inline"
                                    >
                                        <div className="flex-shrink-0 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div className="flex-grow text-sm text-gray-700 leading-snug">
                                            Need help executing your project? Meet our execution partner, <span className="font-medium">SuperBuild</span>.
                                        </div>
                                        <a
                                            href="https://superbuildindia.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-[#2A1E16] hover:text-[#B14A2A] transition-colors whitespace-nowrap flex items-center gap-1 self-end sm:self-auto"
                                        >
                                            Explore Now <span>→</span>
                                        </a>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full py-4 rounded-full bg-[var(--ink)] text-white font-medium hover:opacity-90 transition-opacity mt-4"
                                    >
                                        Next Step
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">City</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai"
                                            className={`w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16] ${errors.city ? 'border-red-500 bg-red-50' : ''}`}
                                        />
                                        {errors.city && <p className="text-red-500 text-xs ml-1">{errors.city}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">Quantity</label>
                                        <input
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            placeholder="e.g. 500 sq.ft"
                                            className={`w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16] ${errors.quantity ? 'border-red-500 bg-red-50' : ''}`}
                                        />
                                        {errors.quantity && <p className="text-red-500 text-xs ml-1">{errors.quantity}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">Timeline</label>
                                        <input
                                            name="timeline"
                                            value={formData.timeline}
                                            onChange={handleChange}
                                            placeholder="e.g. Immediate / 2 months"
                                            className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16]"
                                        />
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-full sm:flex-1 py-4 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="w-full sm:flex-[2] py-4 rounded-full bg-[var(--ink)] text-white font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Next Step
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">Contact Number</label>
                                        <input
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className={`w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16] ${errors.contact ? 'border-red-500 bg-red-50' : ''}`}
                                        />
                                        {errors.contact && <p className="text-red-500 text-xs ml-1">{errors.contact}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1">Additional Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Any specific requirements or questions?"
                                            className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[#2A1E16] resize-none"
                                            rows={4}
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-full sm:flex-1 py-4 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:flex-[2] py-4 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[#a85638] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <span>Processing...</span>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                                    Get Quote via WhatsApp
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-4">We typically respond within 2 hours.</p>
                                </motion.div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
