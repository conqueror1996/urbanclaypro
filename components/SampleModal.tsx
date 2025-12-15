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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const finalRequirements = formData.requirements
            ? `${formData.requirements}${box.length > 0 ? `\n(Tray: ${boxRequirements})` : ''}`
            : (box.length > 0 ? `Tray: ${boxRequirements}` : 'None');

        const rawMessage = `*New Sample Request*\n\n*Name:* ${formData.name}\n*Firm:* ${formData.firm}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Address:* ${formData.address}\n*Requirements:* ${finalRequirements}`;
        const encodedMessage = encodeURIComponent(rawMessage);
        window.open(`https://wa.me/918080081951?text=${encodedMessage}`, '_blank');
        setIsSubmitted(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ perspective: 1000 }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#2A1E16]/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative bg-[#f5f0eb] rounded-xl md:rounded-3xl p-5 md:p-8 max-w-lg w-full shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto overscroll-contain scrollbar-hide border border-white/50"
                        data-lenis-prevent
                    >
                        {/* Noise Overlay */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none opacity-[0.4] mix-blend-multiply"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                            }}
                        />

                        <button onClick={onClose} className="absolute top-4 right-4 text-[#8c8580] hover:text-[#2A1E16] z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-all duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="relative z-10">
                            {!isSubmitted ? (
                                <>
                                    <div className="text-center mb-8">
                                        <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-[10px] mb-2 block">Premium Material Selection</span>
                                        <h3 className="text-2xl md:text-3xl font-serif font-medium text-[#2A1E16]">Order Sample Box</h3>
                                    </div>

                                    {/* Selected Samples Display - Physical Chips Look */}
                                    {box.length > 0 && (
                                        <div className="mb-8 p-6 bg-white/60 rounded-2xl border border-white/40 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--terracotta)]/20" />
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a1887f] mb-4 flex items-center gap-2">
                                                <span>Tray Selection</span>
                                                <span className="px-1.5 py-0.5 bg-[#2A1E16] text-white rounded text-[9px]">{box.length}</span>
                                            </h4>

                                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
                                                {box.map((sample, i) => (
                                                    <motion.div
                                                        key={sample.id}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="relative group w-16 h-16 flex-shrink-0 cursor-pointer"
                                                    >
                                                        <a href={`/products/${sample.id}`} className="block w-full h-full">
                                                            <div
                                                                className="w-full h-full rounded-lg shadow-md border border-black/5 bg-cover bg-center transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                                                                style={{ backgroundImage: sample.texture.includes('url') ? sample.texture : `none`, backgroundColor: sample.color }}
                                                            />
                                                        </a>
                                                        {/* Subtle thickness effect */}
                                                        <div
                                                            className="absolute -bottom-1 left-0 w-full h-full rounded-lg bg-black/20 -z-10"
                                                            style={{ transform: 'scale(0.95)' }}
                                                        />

                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromBox(sample.id); }}
                                                            className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100 z-10"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                        <div className="mt-2 text-[9px] font-medium text-center text-[#5d554f] truncate w-full px-1 leading-tight">
                                                            {sample.name}
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {/* Add More Placeholder -> Redirects to Catalogue */}
                                                <a href="/products" className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-[#d6cbb8] flex flex-col items-center justify-center text-[#a1887f] hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-colors group">
                                                    <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">+</span>
                                                    <span className="text-[8px] font-bold uppercase">Add</span>
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative group col-span-1">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2.5 rounded-lg bg-[#faf9f8] border ${errors.name ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-xs transition-all placeholder-gray-400 font-medium`}
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
                                                    className={`w-full px-3 py-2.5 rounded-lg bg-[#faf9f8] border ${errors.firm ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-xs transition-all placeholder-gray-400 font-medium`}
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
                                                    className={`w-full px-3 py-2.5 rounded-lg bg-[#faf9f8] border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-xs transition-all placeholder-gray-400 font-medium`}
                                                />
                                            </div>

                                            <div className="relative group col-span-1">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2.5 rounded-lg bg-[#faf9f8] border ${errors.email ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] text-xs transition-all placeholder-gray-400 font-medium`}
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
                                                className={`w-full px-3 py-2.5 rounded-lg bg-[#faf9f8] border ${errors.address ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-[var(--terracotta)]'} focus:bg-white focus:ring-0 outline-none text-[#2A1E16] resize-none text-xs transition-all placeholder-gray-400 font-medium`}
                                            ></textarea>
                                        </div>

                                        <div className="relative group">
                                            <textarea
                                                name="requirements"
                                                placeholder="Notes / Specifics (Optional)"
                                                value={formData.requirements}
                                                onChange={handleChange}
                                                rows={1}
                                                className="w-full px-3 py-2.5 rounded-lg bg-[#faf9f8] border border-transparent focus:border-[var(--terracotta)] focus:bg-white focus:ring-0 outline-none text-[#2A1E16] resize-none text-xs transition-all placeholder-gray-400 font-medium"
                                            ></textarea>
                                        </div>

                                        <button type="submit" className="w-full py-3.5 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-[#a85638] transition-all shadow-lg shadow-orange-900/10 active:scale-[0.98]">
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
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
