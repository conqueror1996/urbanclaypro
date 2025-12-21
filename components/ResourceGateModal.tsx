
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '@/app/actions/submit-lead';

interface ResourceGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceName: string;
    onAccessGranted: () => void;
}

export default function ResourceGateModal({ isOpen, onClose, resourceName, onAccessGranted }: ResourceGateModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        firm: '',
        role: 'Architect'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // Lock html too for Lenis
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const leadData = {
            role: formData.role,
            product: 'Resource Download',
            firmName: formData.firm,
            city: 'Digital', // Placeholder
            quantity: 'Asset Download',
            timeline: 'Immediate',
            contact: 'N/A', // Email is primary here
            email: formData.email,
            name: formData.name,
            notes: `Downloaded Resource: ${resourceName}`
        };

        try {
            await submitLead(leadData);

            // Save to LocalStorage so they don't have to fill it again
            localStorage.setItem('urbanclay_pro_user', JSON.stringify({
                name: formData.name,
                email: formData.email,
                firm: formData.firm
            }));

            onAccessGranted();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative bg-[#0a0806]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl overflow-hidden group"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--terracotta)] via-orange-400 to-[var(--terracotta)]" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--terracotta)]/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-[var(--terracotta)]/30 transition-colors duration-700" />

                        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors z-10 p-2 hover:bg-white/5 rounded-full">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="mb-8 relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-pulse" />
                                <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px]">Architect's Vault</span>
                            </div>
                            <h2 className="text-3xl font-serif text-[#EBE5E0] leading-tight">Unlock Technical <br />Specification</h2>
                            <p className="text-white/40 text-sm mt-3 leading-relaxed">
                                Join 2,500+ design professionals. Enter your details once to access our full library of CADs, BIM models, and High-Res textures.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                <div className="relative group/input">
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                        className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-5 pb-2 text-sm text-[#EBE5E0] placeholder-transparent focus:border-[var(--terracotta)] focus:bg-white/10 focus:outline-none transition-all"
                                    />
                                    <label className="absolute left-4 top-3.5 text-xs text-white/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-[var(--terracotta)] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-white/50 pointer-events-none uppercase tracking-wider font-medium">Full Name</label>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                <div className="relative group/input">
                                    <input
                                        name="firm"
                                        value={formData.firm}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                        className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-5 pb-2 text-sm text-[#EBE5E0] placeholder-transparent focus:border-[var(--terracotta)] focus:bg-white/10 focus:outline-none transition-all"
                                    />
                                    <label className="absolute left-4 top-3.5 text-xs text-white/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-[var(--terracotta)] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-white/50 pointer-events-none uppercase tracking-wider font-medium">Firm / Company</label>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                <div className="relative group/input">
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                        className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-5 pb-2 text-sm text-[#EBE5E0] placeholder-transparent focus:border-[var(--terracotta)] focus:bg-white/10 focus:outline-none transition-all"
                                    />
                                    <label className="absolute left-4 top-3.5 text-xs text-white/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-[var(--terracotta)] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-white/50 pointer-events-none uppercase tracking-wider font-medium">Work Email</label>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#EBE5E0] focus:border-[var(--terracotta)] focus:bg-white/10 focus:outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Architect" className="bg-[#1a1512]">Architect</option>
                                        <option value="Builder" className="bg-[#1a1512]">Builder</option>
                                        <option value="Contractor" className="bg-[#1a1512]">Contractor</option>
                                        <option value="Student" className="bg-[#1a1512]">Student</option>
                                        <option value="Home Owner" className="bg-[#1a1512]">Home Owner</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-br from-[var(--terracotta)] to-[#a85638] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(180,90,60,0.4)] hover:shadow-[0_15px_35px_-10px_rgba(180,90,60,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group/btn mt-2"
                            >
                                {isSubmitting ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <>
                                        <span>Download Asset</span>
                                        <div className="bg-white/20 p-1 rounded-full group-hover/btn:translate-x-1 transition-transform">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
