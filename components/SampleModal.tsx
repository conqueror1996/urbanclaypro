'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '@/app/actions/submit-lead';

import { useSampleBox } from '@/context/SampleContext';

interface SampleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialRequirements?: string;
    initialData?: {
        name?: string;
        phone?: string;
        email?: string;
        address?: string;
        city?: string;
        pincode?: string;
    };
}

export default function SampleModal({ isOpen, onClose, initialRequirements, initialData }: SampleModalProps) {
    const [viewMode, setViewMode] = useState<'review' | 'consult'>(initialData ? 'consult' : 'review');
    const { box, removeFromBox } = useSampleBox();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Auto-generate requirements from box content
    const getSampleDescription = (s: any) => {
        const details = s.texture && !s.texture.includes('url') && !s.texture.includes('http') ? ` [${s.texture}]` : '';
        return `${s.name}${details}`;
    };

    const boxRequirements = box.map(getSampleDescription).join(', ');
    const defaultRequirements = initialRequirements || '';

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        role: 'Architect', // Default role
        firm: '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address ? `${initialData.address}, ${initialData.city || ''} ${initialData.pincode || ''}` : '',
        requirements: defaultRequirements
    });

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

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                name: initialData.name || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                address: initialData.address ? `${initialData.address}, ${initialData.city || ''} ${initialData.pincode || ''}` : '',
            }));
            setViewMode('consult');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const finalRequirements = formData.requirements
            ? `${formData.requirements}${box.length > 0 ? `\n\n(Tray Items: ${boxRequirements})` : ''}`
            : (box.length > 0 ? `Tray Items: ${boxRequirements}` : 'None');

        const leadData = {
            role: formData.role || 'Architect',
            product: 'Expert Consultation',
            firmName: formData.firm,
            city: formData.address.split(',')[0], // Simple heuristic
            quantity: 'Consultation',
            timeline: 'Immediate',
            contact: formData.phone,
            email: formData.email, // Explicitly passing email for auto-reply
            name: formData.name, // Explicitly pass name for CRM
            address: formData.address,
            sampleItems: box.map(s => s.name),
            isSampleRequest: box.length > 0, // Flag if they have items in tray
            notes: `Name: ${formData.name}\nEmail: ${formData.email}\nFull Address: ${formData.address}\n\nRequirements:\n${finalRequirements}`
        };

        try {
            const response = await submitLead(leadData);

            if (response.success) {
                const waMessage = `Hi Urban Clay, I would like to request a free expert consultation.\n\nName: ${formData.name} (${formData.firm})\nReq: ${finalRequirements.substring(0, 500)}`;
                // Replace with actual number if different
                const waUrl = `https://wa.me/919790932822?text=${encodeURIComponent(waMessage)}`;

                // Open WhatsApp in background/new tab
                window.open(waUrl, '_blank');

                setIsSubmitted(true);
            } else {
                showNotification('Connection error. Please try again.');
            }
        } catch (err) {
            console.error(err);
            showNotification('Something went wrong.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    {/* ... (backdrop) ... */}
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
                        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all z-10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {!isSubmitted ? (
                            <>
                                {/* VIEW MODE SWITCHER (Optional Visual Cue) */}
                                {viewMode === 'consult' && (
                                    <button
                                        onClick={() => setViewMode('review')}
                                        className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[var(--terracotta)] transition-colors"
                                    >
                                        ← Back to Samples
                                    </button>
                                )}

                                {/* REVIEW MODE: SAMPLES & CHECKOUT */}
                                {viewMode === 'review' && (
                                    <>
                                        <div className="text-center mb-10">
                                            <span className="inline-block px-4 py-1.5 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                                                Premium Samples
                                            </span>
                                            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#2A1E16] mb-3">
                                                Sample Collection
                                            </h2>
                                            <p className="text-gray-600 text-sm max-w-md mx-auto">
                                                Experience our materials firsthand with curated samples delivered to your doorstep
                                            </p>
                                        </div>

                                        {/* TRAY */}
                                        {box.length > 0 && (
                                            <div className="mb-8 p-6 bg-white/60 rounded-2xl border border-white/40 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--terracotta)]/20" />
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a1887f] mb-4 flex items-center gap-2">
                                                    <span>Tray Selection</span>
                                                    <span className="px-1.5 py-0.5 bg-[#2A1E16] text-white rounded text-[9px]">{box.length}</span>
                                                </h4>
                                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
                                                    {box.map((sample, i) => (
                                                        <div key={sample.id} className="relative group w-16 h-16 flex-shrink-0 cursor-pointer">
                                                            <div className="w-full h-full rounded-lg shadow-md border border-black/5 overflow-hidden bg-gray-100">
                                                                {sample.texture && (sample.texture.startsWith('/') || sample.texture.startsWith('http') || sample.texture.includes('url')) ? (
                                                                    <img src={sample.texture.includes('url') ? sample.texture.match(/url\(['"]?([^'"\)]+)['"]?\)/)?.[1] || sample.texture : sample.texture} alt={sample.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full" style={{ backgroundColor: sample.color }} />
                                                                )}
                                                            </div>
                                                            <button onClick={(e) => { e.stopPropagation(); removeFromBox(sample.id); }} className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <a href="/products" className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-[#d6cbb8] flex flex-col items-center justify-center text-[#a1887f] hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-colors group">
                                                        <span className="text-xl mb-0.5">+</span>
                                                        <span className="text-[8px] font-bold uppercase">Add</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* SOCIAL PROOF - STRATEGY: TRUST INDICATORS */}
                                        <div className="flex flex-wrap gap-4 justify-center items-center mb-8 text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 text-yellow-800">
                                                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                <span className="font-bold">Trusted by 2,500+ Architects</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-green-800">
                                                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <span className="font-bold">100% Authentic Materials</span>
                                            </div>
                                        </div>

                                        {/* CHECKOUT OPTIONS - STRATEGY: VALUE FRAMING */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            {/* OPTION 1: USER SELECTION */}
                                            <button
                                                onClick={() => {
                                                    if (box.length === 0) return showNotification('Please add samples to your tray first');
                                                    const event = new CustomEvent('openCheckout', { detail: { type: 'regular' } });
                                                    window.dispatchEvent(event);
                                                }}
                                                className={`relative p-4 rounded-2xl border-2 text-left group transition-all duration-300 flex flex-col h-full ${box.length > 0
                                                    ? 'border-[var(--terracotta)] bg-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                                    : 'border-gray-200 border-dashed bg-gray-50 opacity-60'
                                                    }`}
                                            >
                                                {box.length > 0 && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--terracotta)] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                        MOST POPULAR
                                                    </div>
                                                )}

                                                <div className="mb-2">
                                                    <h4 className="font-serif text-lg md:text-xl text-[#2A1E16] font-bold">Your Selection</h4>
                                                    <div className="flex items-baseline gap-1 mt-0.5">
                                                        <span className="text-xl md:text-2xl font-bold text-[var(--terracotta)]">₹999</span>
                                                        <span className="text-xs text-gray-400 line-through">₹1,500</span>
                                                    </div>
                                                </div>

                                                <ul className="space-y-1.5 mb-3 flex-grow">
                                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span><strong>{box.length > 0 ? box.length : '5'} Premium Samples</strong> (Your Choice)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span><strong>Free Shipping</strong> (Worth ₹200)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span>Delivered in <strong>3-5 Days</strong></span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-xs text-[#2A1E16] bg-[#2A1E16]/5 p-1.5 rounded">
                                                        <svg className="w-4 h-4 text-[#2A1E16] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span className="font-bold">100% Refundable on Order*</span>
                                                    </li>
                                                </ul>

                                                <div className="w-full py-2 bg-[var(--terracotta)] text-white text-center rounded-lg text-xs font-bold uppercase tracking-wider group-hover:bg-[#a85638] transition-colors">
                                                    Get Physical Samples
                                                </div>
                                            </button>

                                            {/* OPTION 2: CURATED COLLECTION */}
                                            <button
                                                onClick={() => {
                                                    const event = new CustomEvent('openCheckout', { detail: { type: 'curated' } });
                                                    window.dispatchEvent(event);
                                                }}
                                                className="relative p-4 rounded-2xl border-2 border-[#2A1E16]/10 bg-white text-left group transition-all duration-300 hover:border-[#2A1E16] hover:shadow-xl hover:scale-[1.02] flex flex-col h-full"
                                            >
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2A1E16] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                    RECOMMENDED
                                                </div>

                                                <div className="mb-2">
                                                    <h4 className="font-serif text-lg md:text-xl text-[#2A1E16] font-bold">Curated Set</h4>
                                                    <div className="flex items-baseline gap-1 mt-0.5">
                                                        <span className="text-xl md:text-2xl font-bold text-[#2A1E16]">₹2,000</span>
                                                        <span className="text-xs text-gray-400 line-through">₹3,500</span>
                                                    </div>
                                                </div>

                                                <ul className="space-y-1.5 mb-3 flex-grow">
                                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                                        <svg className="w-4 h-4 text-[#2A1E16] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span><strong>8 Expert-Selected</strong> Samples</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                                        <svg className="w-4 h-4 text-[#2A1E16] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span><strong>Express Shipping</strong> (2-3 Days)</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                                        <svg className="w-4 h-4 text-[#2A1E16] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span>Free Design Consultation</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-xs text-[#2A1E16] bg-[#2A1E16]/5 p-1.5 rounded">
                                                        <svg className="w-4 h-4 text-[#2A1E16] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span className="font-bold">100% Refundable on Order*</span>
                                                    </li>
                                                </ul>

                                                <div className="w-full py-2 bg-[#2A1E16] text-white text-center rounded-lg text-xs font-bold uppercase tracking-wider group-hover:bg-black transition-colors">
                                                    Order Curated Set
                                                </div>
                                            </button>
                                        </div>

                                        {/* REFUND POLICY FOOTNOTE */}
                                        <p className="text-[10px] text-center text-gray-400 mt-4 mb-6">
                                            *Sample cost is fully adjusted in your final order invoice (Orders above ₹50,000)
                                        </p>

                                        {/* SWITCH TO CONSULT ACTION */}
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
                                            <p className="text-sm text-blue-900 mb-3">Not sure about the material?</p>
                                            <button
                                                onClick={() => setViewMode('consult')}
                                                className="inline-block border-b border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-900 pb-0.5 hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors"
                                            >
                                                Speak to our experts (Free)
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* CONSULT MODE: FORM */}
                                {viewMode === 'consult' && (
                                    <div className="bg-white">
                                        <div className="text-center mb-10">
                                            <div className="w-14 h-14 bg-[#2A1E16]/5 rounded-full flex items-center justify-center mx-auto mb-5 text-[var(--terracotta)] ring-1 ring-[#2A1E16]/5">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-serif text-[#2A1E16] mb-3">Free Expert Consultation</h2>
                                            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">Fill in your details and our architectural team will guide you on the best materials for your specific project.</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* ROLE SELECTOR */}
                                            <div className="bg-[#faf9f8] p-1.5 rounded-xl flex gap-1 mb-2">
                                                {['Architect', 'Home Owner', 'Builder'].map((r) => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => setFormData(p => ({ ...p, role: r }))}
                                                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${formData.role === r
                                                            ? 'bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] text-[#b45a3c]'
                                                            : 'text-gray-400 hover:text-gray-600'
                                                            }`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5 group">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-[#b45a3c] transition-colors">Name</label>
                                                    <input name="name" value={formData.name} onChange={handleChange} className="w-full py-4 px-5 bg-[#faf9f8] rounded-xl border border-gray-200 focus:bg-white focus:border-[#b45a3c] focus:ring-1 focus:ring-[#b45a3c] outline-none text-sm text-[#2A1E16] font-medium transition-all placeholder-gray-400" placeholder="Full Name" required />
                                                </div>
                                                <div className="space-y-1.5 group">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-[#b45a3c] transition-colors">Firm / Project Name</label>
                                                    <input name="firm" value={formData.firm} onChange={handleChange} className="w-full py-4 px-5 bg-[#faf9f8] rounded-xl border border-gray-200 focus:bg-white focus:border-[#b45a3c] focus:ring-1 focus:ring-[#b45a3c] outline-none text-sm text-[#2A1E16] font-medium transition-all placeholder-gray-400" placeholder={formData.role === 'Home Owner' ? 'Project Name (Optional)' : 'Firm Name'} required={formData.role !== 'Home Owner'} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5 group">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-[#b45a3c] transition-colors">Phone</label>
                                                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full py-4 px-5 bg-[#faf9f8] rounded-xl border border-gray-200 focus:bg-white focus:border-[#b45a3c] focus:ring-1 focus:ring-[#b45a3c] outline-none text-sm text-[#2A1E16] font-medium transition-all placeholder-gray-400" placeholder="Contact Number" required />
                                                </div>
                                                <div className="space-y-1.5 group">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-[#b45a3c] transition-colors">Email</label>
                                                    <input name="email" value={formData.email} onChange={handleChange} className="w-full py-4 px-5 bg-[#faf9f8] rounded-xl border border-gray-200 focus:bg-white focus:border-[#b45a3c] focus:ring-1 focus:ring-[#b45a3c] outline-none text-sm text-[#2A1E16] font-medium transition-all placeholder-gray-400" placeholder="Email Address" required />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 group">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-[#b45a3c] transition-colors">Project Location</label>
                                                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full py-4 px-5 bg-[#faf9f8] rounded-xl border border-gray-200 focus:bg-white focus:border-[#b45a3c] focus:ring-1 focus:ring-[#b45a3c] outline-none text-sm text-[#2A1E16] font-medium transition-all resize-none placeholder-gray-400" placeholder="City / Site Address" required />
                                            </div>
                                            <div className="space-y-1.5 group">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-[#b45a3c] transition-colors">Project Requirements</label>
                                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={2} className="w-full py-4 px-5 bg-[#faf9f8] rounded-xl border border-gray-200 focus:bg-white focus:border-[#b45a3c] focus:ring-1 focus:ring-[#b45a3c] outline-none text-sm text-[#2A1E16] font-medium transition-all resize-none placeholder-gray-400" placeholder="Briefly describe your project needs..." />
                                            </div>

                                            <button type="submit" className="w-full py-4 bg-[#2A1E16] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#4a3525] transition-all shadow-[0_10px_30px_-10px_rgba(42,30,22,0.4)] hover:shadow-[0_15px_35px_-10px_rgba(42,30,22,0.5)] active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group">
                                                <span>Request Free Guidance</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </motion.div>
                                <h3 className="text-2xl font-serif text-[#2A1E16] mb-2">{viewMode === 'consult' ? 'Inquiry Sent' : 'Order Placed'}</h3>
                                <p className="text-gray-500 mb-8">{viewMode === 'consult' ? 'Our experts will get back to you shortly.' : 'Your samples will be dispatched soon.'}</p>
                                <button onClick={onClose} className="w-full py-4 bg-[var(--terracotta)] text-white rounded-lg font-bold uppercase text-xs">Close</button>
                            </div>
                        )}

                        <AnimatePresence>
                            {notification && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-[#2A1E16] text-white rounded-full shadow-2xl shadow-black/20 pointer-events-none"
                                >
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">{notification}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
