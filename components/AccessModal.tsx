'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccessModal({ isOpen, onClose }: AccessModalProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', firm: '', email: '' });
    const [errors, setErrors] = useState({ name: '', firm: '', email: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', firm: '', email: '' };

        if (!formData.name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
        if (!formData.firm.trim()) { newErrors.firm = 'Firm is required'; isValid = false; }
        if (!formData.email.trim()) { newErrors.email = 'Email is required'; isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Invalid email'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const message = `*New Access Request*%0A%0A*Name:* ${formData.name}%0A*Firm:* ${formData.firm}%0A*Email:* ${formData.email}`;
        // window.open(`https://wa.me/918080081951?text=${message}`, '_blank');
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
                        className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {!isSubmitted ? (
                            <>
                                <h3 className="text-2xl font-bold text-[#2A1E16] mb-2">Request Access</h3>
                                <p className="text-[#5d554f] mb-6">Enter your details to unlock our full technical library.</p>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#2A1E16] mb-1">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} placeholder="John Doe" />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#2A1E16] mb-1">Firm / Company</label>
                                        <input type="text" name="firm" value={formData.firm} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.firm ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} placeholder="Studio Arch" />
                                        {errors.firm && <p className="text-red-500 text-xs mt-1">{errors.firm}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#2A1E16] mb-1">Work Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} placeholder="john@studioarch.com" />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-[var(--terracotta)] text-white rounded-lg font-semibold hover:bg-[#a85638] transition-colors mt-2">Get Access</button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#2A1E16] mb-2">Access Granted!</h3>
                                <p className="text-[#5d554f] mb-6">You can now download the technical resources below.</p>

                                <div className="space-y-3 text-left max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {[
                                        { name: 'Technical Data Sheets (TDS)', size: '4.5 MB', file: '/downloads/tds.pdf' },
                                        { name: 'Installation Guide - Facades', size: '2.8 MB', file: '/downloads/install-guide.pdf' },
                                        { name: 'BIM Objects & Textures', size: '45 MB', file: '/downloads/bim-assets.zip' },
                                    ].map((res, idx) => (
                                        <a
                                            key={idx}
                                            href={res.file}
                                            download
                                            className="flex items-center justify-between p-4 rounded-xl border border-[var(--line)] hover:border-[var(--terracotta)] hover:bg-[var(--sand)] transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg text-[var(--terracotta)] shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">{res.name}</p>
                                                    <p className="text-xs text-gray-500">{res.size}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-[var(--terracotta)] opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                                        </a>
                                    ))}
                                </div>

                                <button onClick={onClose} className="mt-6 text-sm text-gray-500 hover:text-[var(--terracotta)] underline">
                                    Close Window
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
