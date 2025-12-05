'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const defaultRequirements = initialRequirements
        ? `${initialRequirements}${box.length > 0 ? `, ${boxRequirements}` : ''}`
        : boxRequirements;

    const [formData, setFormData] = useState({
        name: '',
        firm: '',
        phone: '',
        email: '',
        address: '',
        requirements: defaultRequirements
    });

    // Update requirements when box changes, but only if user hasn't manually edited it significantly
    // (Simplification: Just append box items if they aren't there)
    React.useEffect(() => {
        if (box.length > 0) {
            setFormData(prev => {
                const currentReqs = prev.requirements;
                const newItems = box
                    .filter(s => !currentReqs.includes(s.name))
                    .map(getSampleDescription)
                    .join(', ');

                return {
                    ...prev,
                    requirements: currentReqs ? (newItems ? `${currentReqs}, ${newItems}` : currentReqs) : newItems
                };
            });
        }
    }, [box]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const rawMessage = `*New Sample Request*\n\n*Name:* ${formData.name}\n*Firm:* ${formData.firm}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Address:* ${formData.address}\n*Requirements:* ${formData.requirements}`;
        const encodedMessage = encodeURIComponent(rawMessage);
        window.open(`https://wa.me/918080081951?text=${encodedMessage}`, '_blank');
        setIsSubmitted(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto overscroll-contain scrollbar-hide"
                        data-lenis-prevent
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-gray-50 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {!isSubmitted ? (
                            <>
                                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2A1E16] mb-1">Order Sample Box</h3>
                                <p className="text-[#8c8580] mb-5 font-medium text-xs md:text-sm tracking-wide">Curate your material palette.</p>

                                {/* Selected Samples Display */}
                                {box.length > 0 && (
                                    <div className="mb-5 bg-[#faf9f8] p-3 rounded-lg border border-[#e9e2da]">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a1887f] mb-2">Selected ({box.length})</h4>
                                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                            {box.map((sample) => (
                                                <div key={sample.id} className="relative group w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                                                    <div
                                                        className="w-full h-full bg-cover bg-center"
                                                        style={{ background: sample.texture.includes('url') ? sample.texture : sample.color }}
                                                    />
                                                    <button
                                                        onClick={() => removeFromBox(sample.id)}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg bg-[#faf9f8] border ${errors.name ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-sm transition-all placeholder-gray-400 font-medium`}
                                            />
                                            {errors.name && <span className="absolute right-3 top-3.5 text-red-400 text-[10px] font-bold uppercase tracking-wider">Required</span>}
                                        </div>

                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="firm"
                                                placeholder="Firm / Studio Name"
                                                value={formData.firm}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg bg-[#faf9f8] border ${errors.firm ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-sm transition-all placeholder-gray-400 font-medium`}
                                            />
                                            {errors.firm && <span className="absolute right-3 top-3.5 text-red-400 text-[10px] font-bold uppercase tracking-wider">Required</span>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative group">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="Phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 rounded-lg bg-[#faf9f8] border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-sm transition-all placeholder-gray-400 font-medium`}
                                                />
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 rounded-lg bg-[#faf9f8] border ${errors.email ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-sm transition-all placeholder-gray-400 font-medium`}
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
                                                className={`w-full px-4 py-3 rounded-lg bg-[#faf9f8] border ${errors.address ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] resize-none text-sm transition-all placeholder-gray-400 font-medium`}
                                            ></textarea>
                                        </div>

                                        <div className="relative group">
                                            <textarea
                                                name="requirements"
                                                placeholder="Specific Requirements (e.g. Exposed Wirecut Bricks)"
                                                value={formData.requirements}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full px-4 py-3 rounded-lg bg-[#faf9f8] border border-transparent focus:border-[var(--terracotta)] focus:bg-white focus:ring-0 outline-none text-[#2A1E16] resize-none text-sm transition-all placeholder-gray-400 font-medium"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-3.5 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-[#a85638] transition-all shadow-lg shadow-orange-900/10 active:scale-[0.98]">
                                        Request Sample Box
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mb-2">Order Placed!</h3>
                                <p className="text-[#5d554f] mb-6 font-light">We've received your sample request. Our team will coordinate the dispatch shortly.</p>
                                <button onClick={onClose} className="w-full py-3 bg-[var(--terracotta)] text-white rounded-lg font-semibold hover:bg-[#a85638] transition-colors">Close</button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
