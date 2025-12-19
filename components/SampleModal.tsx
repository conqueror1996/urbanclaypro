'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '@/app/actions/submit-lead';

import { useSampleBox } from '@/context/SampleContext';

interface SampleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialRequirements?: string;
}

export default function SampleModal({ isOpen, onClose, initialRequirements }: SampleModalProps) {
    const { box, removeFromBox } = useSampleBox();
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Auto-generate requirements from box content
    const getSampleDescription = (s: any) => {
        const details = s.texture && !s.texture.includes('url') && !s.texture.includes('http') ? ` [${s.texture}]` : '';
        return `${s.name}${details}`;
    };

    const boxRequirements = box.map(getSampleDescription).join(', ');
    const defaultRequirements = initialRequirements || '';

    const [formData, setFormData] = useState({
        name: '',
        firm: '',
        phone: '',
        email: '',
        address: '',
        requirements: defaultRequirements
    });

    // Auto-fill logic removed as per request to keep form clean.
    // Box items are now appended directly during submission.

    const [errors, setErrors] = useState({ name: '', firm: '', phone: '', email: '', address: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', firm: '', phone: '', email: '', address: '' };

        if (!formData.name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
        if (!formData.firm.trim()) { newErrors.firm = 'Firm is required'; isValid = false; }
        if (!formData.phone.trim()) { newErrors.phone = 'Phone is required'; isValid = false; }
        if (!formData.email.trim()) { newErrors.email = 'Email is required'; isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Invalid email'; isValid = false; }
        if (!formData.address.trim()) { newErrors.address = 'Address is required'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const finalRequirements = formData.requirements
            ? `${formData.requirements}${box.length > 0 ? `\n\n(Tray Items: ${boxRequirements})` : ''}`
            : (box.length > 0 ? `Tray Items: ${boxRequirements}` : 'None');

        // Generate product links for WhatsApp message
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://urbanclay.in';
        const productLinks = box.map((sample, idx) => {
            // Extract slug from sample.id (which is the product slug)
            const productUrl = `${baseUrl}/products/${sample.id}`;
            return `${idx + 1}. ${sample.name}\n   ${productUrl}`;
        }).join('\n\n');

        // 1. Submit to CMS (Server Action)
        try {
            await submitLead({
                role: 'Architect', // Defaulting to Architect/User for sample requests or we could add a selector
                name: formData.name,
                firmName: formData.firm,
                contact: formData.phone, // Mapping phone to contact
                // email: formData.email, // Note: Schema might not have email yet, but we can pass it if we update schema later
                city: formData.address.split(',').pop()?.trim() || 'India', // Simple heuristics for city
                quantity: 'Sample Box',
                product: 'Sample Request',
                notes: `Address: ${formData.address}\n\nRequirements: ${finalRequirements}\n\nProduct Links:\n${productLinks}`, // Combine address and reqs for context
            });
        } catch (err) {
            console.error('Failed to save lead:', err);
            // Continue to WhatsApp anyway so user flow isn't broken
        }

        // Build WhatsApp message with product links
        const productSection = box.length > 0
            ? `\n\n*Requested Products:*\n${productLinks}`
            : '';

        const rawMessage = `*New Sample Request*\n\n*Name:* ${formData.name}\n*Firm:* ${formData.firm}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Address:* ${formData.address}${productSection}\n\n*Additional Notes:* ${formData.requirements || 'None'}`;
        const encodedMessage = encodeURIComponent(rawMessage);
        window.open(`https://wa.me/918080081951?text=${encodedMessage}`, '_blank');
        setIsSubmitted(true);
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
                        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto scrollbar-hide"
                        data-lenis-prevent
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className="inline-block px-4 py-1.5 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                                            Premium Samples
                                        </span>
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl md:text-5xl font-serif font-light text-[#2A1E16] mb-3"
                                    >
                                        Sample Collection
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-gray-600 text-sm max-w-md mx-auto"
                                    >
                                        Experience our materials firsthand with curated samples delivered to your doorstep
                                    </motion.p>
                                </div>

                                {/* Selected Samples Display - Physical Chips Look */}
                                {box.length > 0 && (
                                    <div className="mb-4 md:mb-8 p-4 md:p-6 bg-white/60 rounded-xl md:rounded-2xl border border-white/40 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--terracotta)]/20" />
                                        <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#a1887f] mb-3 md:mb-4 flex items-center gap-2">
                                            <span>Tray Selection</span>
                                            <span className="px-1.5 py-0.5 bg-[#2A1E16] text-white rounded text-[8px] md:text-[9px]">{box.length}</span>
                                        </h4>

                                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
                                            {box.map((sample, i) => (
                                                <motion.div
                                                    key={sample.id}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="relative group w-14 h-14 md:w-16 md:h-16 flex-shrink-0 cursor-pointer"
                                                >
                                                    <a href={`/products/${sample.id}`} className="block w-full h-full">
                                                        <div className="w-full h-full rounded-lg shadow-md border border-black/5 overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg relative bg-gray-100">
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
                                                    </a>
                                                    {/* Subtle thickness effect */}
                                                    <div
                                                        className="absolute -bottom-1 left-0 w-full h-full rounded-lg bg-black/20 -z-10"
                                                        style={{ transform: 'scale(0.95)' }}
                                                    />

                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromBox(sample.id); }}
                                                        className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-4 h-4 md:w-5 md:h-5 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100 z-10"
                                                    >
                                                        <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                    <div className="mt-1.5 md:mt-2 text-[8px] md:text-[9px] font-medium text-center text-[#5d554f] truncate w-full px-0.5 leading-tight">
                                                        {sample.name}
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* Add More Placeholder -> Redirects to Catalogue */}
                                            <a href="/products" className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-dashed border-[#d6cbb8] flex flex-col items-center justify-center text-[#a1887f] hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-colors group">
                                                <span className="text-lg md:text-xl mb-0.5 group-hover:scale-110 transition-transform">+</span>
                                                <span className="text-[7px] md:text-[8px] font-bold uppercase">Add</span>
                                            </a>
                                        </div>
                                    </div>
                                )

                                }

                                {/* Social Proof */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center justify-center gap-6 mb-8 text-xs text-gray-600"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="font-semibold">4.9/5 Rating</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>2,500+ Architects</span>
                                    </div>
                                </motion.div>

                                {/* Payment Options */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mb-8 space-y-4"
                                >
                                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-900 text-center mb-6">
                                        Choose Your Option
                                    </h3>

                                    {/* Regular Samples */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (box.length === 0) {
                                                // Show helpful message
                                                alert('Please add samples to your tray first!\n\nClick on products and use "Add to Sample Box" button.');
                                                return;
                                            }
                                            const event = new CustomEvent('openCheckout', { detail: { type: 'regular' } });
                                            window.dispatchEvent(event);
                                        }}
                                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left group relative ${box.length > 0
                                            ? 'border-[var(--terracotta)] bg-gradient-to-br from-[var(--terracotta)]/5 to-[var(--terracotta)]/10 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                                            : 'border-gray-300 border-dashed bg-gray-50/50 opacity-70 cursor-pointer hover:opacity-90'
                                            }`}
                                    >
                                        {box.length === 0 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-[9px] font-bold uppercase rounded-full">
                                                Add Samples First
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-[#2A1E16] text-base mb-1">Your Selection</h4>
                                                <p className="text-xs text-gray-600">
                                                    {box.length > 0 ? `${box.length} premium samples selected` : 'Select samples from catalogue'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-light text-[var(--terracotta)]">₹999</div>
                                                <div className="text-[10px] text-gray-400 line-through">₹1,500</div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 text-xs text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>5 Premium Material Samples</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Free Shipping (₹200 value)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Delivered in 3-5 days</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="font-semibold text-[var(--terracotta)]">100% Refundable on orders ₹50,000+*</span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Curated Collection */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const event = new CustomEvent('openCheckout', { detail: { type: 'curated' } });
                                            window.dispatchEvent(event);
                                        }}
                                        className="w-full p-5 rounded-2xl border-2 border-[#2A1E16] bg-gradient-to-br from-[#2A1E16]/5 to-[#2A1E16]/10 hover:shadow-lg transition-all text-left group hover:scale-[1.02]"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-[#2A1E16] text-base">Curated Collection</h4>
                                                    <span className="px-2 py-0.5 bg-[var(--terracotta)] text-white text-[9px] font-bold uppercase rounded-full">Premium</span>
                                                </div>
                                                <p className="text-xs text-gray-600">Expert-selected premium samples</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-light text-[#2A1E16]">₹2,000</div>
                                                <div className="text-[10px] text-gray-400 line-through">₹3,500</div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 text-xs text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>8 Hand-Selected Premium Samples</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Express Shipping (2-3 days)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Free Design Consultation (₹2,000 value)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="font-semibold text-[var(--terracotta)]">100% Refundable on orders ₹50,000+*</span>
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-4 text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                                            Or Request Free Quote
                                        </span>
                                    </div>
                                </div>

                                {/* Free Quote Context */}
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <p className="text-xs text-gray-700 text-center">
                                        <span className="font-semibold text-blue-900">Not sure what to choose?</span> Request a free consultation and our experts will help you select the perfect materials for your project.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
                                    <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                                        <div className="relative group col-span-1">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg bg-[#faf9f8] border ${errors.name ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-[11px] md:text-xs transition-all placeholder-gray-400 font-medium`}
                                            />
                                            {errors.name && <span className="absolute right-2 top-2 text-red-400 text-[9px] font-bold uppercase">!</span>}
                                        </div>

                                        <div className="relative group col-span-1">
                                            <input
                                                type="text"
                                                name="firm"
                                                placeholder="Firm"
                                                value={formData.firm}
                                                onChange={handleChange}
                                                className={`w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg bg-[#faf9f8] border ${errors.firm ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-[11px] md:text-xs transition-all placeholder-gray-400 font-medium`}
                                            />
                                            {errors.firm && <span className="absolute right-2 top-2 text-red-400 text-[9px] font-bold uppercase">!</span>}
                                        </div>

                                        <div className="relative group col-span-1">
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg bg-[#faf9f8] border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-[11px] md:text-xs transition-all placeholder-gray-400 font-medium`}
                                            />
                                        </div>

                                        <div className="relative group col-span-1">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg bg-[#faf9f8] border ${errors.email ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-[11px] md:text-xs transition-all placeholder-gray-400 font-medium`}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <textarea
                                            name="address"
                                            placeholder="Shipping Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            className={`w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg bg-[#faf9f8] border ${errors.address ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] resize-none text-[11px] md:text-xs transition-all placeholder-gray-400 font-medium`}
                                        ></textarea>
                                    </div>

                                    <div className="relative group">
                                        <textarea
                                            name="requirements"
                                            placeholder="Notes / Specifics (Optional)"
                                            value={formData.requirements}
                                            onChange={handleChange}
                                            rows={1}
                                            className="w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg bg-[#faf9f8] border border-transparent focus:border-[var(--terracotta)] focus:bg-white focus:ring-0 outline-none text-[#2A1E16] resize-none text-[11px] md:text-xs transition-all placeholder-gray-400 font-medium"
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="w-full py-3 md:py-3.5 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-[11px] md:text-xs hover:bg-[#a85638] transition-all shadow-lg shadow-orange-900/10 active:scale-[0.98]">
                                        Request Sample Box
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-20 h-20 bg-green-100 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                                >
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </motion.div>
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-serif font-bold text-[#2A1E16] mb-3"
                                >
                                    Order Placed!
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[#5d554f] mb-8 font-light text-lg max-w-xs mx-auto leading-relaxed"
                                >
                                    We've received your sample request. Our team will coordinate the dispatch shortly.
                                </motion.p>
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={onClose}
                                    className="w-full py-4 bg-[var(--terracotta)] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#a85638] transition-all shadow-xl shadow-orange-900/20"
                                >
                                    Close Window
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
