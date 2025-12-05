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

        const message = `*New Sample Request*%0A%0A*Name:* ${formData.name}%0A*Firm:* ${formData.firm}%0A*Phone:* ${formData.phone}%0A*Email:* ${formData.email}%0A*Address:* ${formData.address}%0A*Requirements:* ${formData.requirements}`;
        window.open(`https://wa.me/918080081951?text=${message}`, '_blank');
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
                        className="relative bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {!isSubmitted ? (
                            <>
                                <h3 className="text-2xl font-serif font-bold text-[#2A1E16] mb-2">Order Sample Box</h3>
                                <p className="text-[#5d554f] mb-6 font-light">Complete the form below to request your samples.</p>

                                {/* Selected Samples Display */}
                                {box.length > 0 && (
                                    <div className="mb-6 bg-[#f9f9f9] p-4 rounded-xl border border-gray-100">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a6f66] mb-3">Selected Samples ({box.length})</h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            {box.map((sample) => (
                                                <div key={sample.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                    <div
                                                        className="w-full h-full bg-cover bg-center"
                                                        style={{ background: sample.texture.includes('url') ? sample.texture : sample.color }}
                                                    />
                                                    <button
                                                        onClick={() => removeFromBox(sample.id)}
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                        title="Remove"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#2A1E16] mb-1">Full Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#2A1E16] mb-1">Firm Name</label>
                                            <input type="text" name="firm" value={formData.firm} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.firm ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} />
                                            {errors.firm && <p className="text-red-500 text-xs mt-1">{errors.firm}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#2A1E16] mb-1">Phone</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#2A1E16] mb-1">Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16]`} />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#2A1E16] mb-1">Shipping Address</label>
                                        <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={`w-full px-4 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16] resize-none`} placeholder="Full address with pincode"></textarea>
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#2A1E16] mb-1">Sample Requirements</label>
                                        <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--terracotta)] outline-none text-[#2A1E16] resize-none" placeholder="e.g., Exposed Wirecut Bricks, Terracotta Jaali (Camp pattern), etc."></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-[var(--terracotta)] text-white rounded-lg font-semibold hover:bg-[#a85638] transition-colors mt-2">Request Samples</button>
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
