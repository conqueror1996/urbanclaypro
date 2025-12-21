'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSampleBox } from '@/context/SampleContext';
import { X, ArrowRight, Download, Package } from 'lucide-react';
import { submitLead } from '@/app/actions/submit-lead';

export default function SmartExitPopup() {
    const { box, setBoxOpen } = useSampleBox();
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form data for the "Catalogue" flow
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check if already dismissed in this session
        const dismissed = sessionStorage.getItem('urbanclay_exit_dismissed');
        if (dismissed) {
            setHasBeenDismissed(true);
            return;
        }

        const handleExitIntent = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                // User moved mouse above the viewport (to tab bar/URL bar)
                if (!hasBeenDismissed && !isVisible) {
                    setIsVisible(true);
                }
            }
        };

        document.addEventListener('mouseleave', handleExitIntent);

        return () => {
            document.removeEventListener('mouseleave', handleExitIntent);
        };
    }, [hasBeenDismissed, isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
        setHasBeenDismissed(true);
        sessionStorage.setItem('urbanclay_exit_dismissed', 'true');
    };

    const handleOpenTray = () => {
        setBoxOpen(true);
        handleDismiss();
    };

    const handleCatalogueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        try {
            // Submit as a lead
            await submitLead({
                role: 'Visitor', // Generic role
                email: email,
                product: 'General Catalogue',
                notes: 'Exit Intent Catalogue Request',
                isSampleRequest: false
            });

            setIsSuccess(true);

            // Auto-dismiss after success
            setTimeout(() => {
                handleDismiss();
            }, 3000);
        } catch (error) {
            console.error('Failed to submit exit lead', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render anything if dismissed or not triggered
    if (!isVisible) return null;

    // Determine Mode: 'AbandonedCart' vs 'LeadMagnet'
    const mode = box.length > 0 ? 'AbandonedCart' : 'LeadMagnet';

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[var(--line)]"
                    >
                        {/* Decorative Top Bar */}
                        <div className="h-2 w-full bg-[var(--terracotta)]" />

                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[var(--ink)] transition-colors rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 md:p-10">
                            {mode === 'AbandonedCart' ? (
                                // Abandoned Cart View
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--terracotta)]/10 flex items-center justify-center mx-auto mb-6 text-[var(--terracotta)]">
                                        <Package size={32} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-[var(--ink)] mb-3">
                                        Wait! You have samples waiting.
                                    </h3>
                                    <p className="text-gray-600 mb-8">
                                        You have <span className="font-semibold text-[var(--terracotta)]">{box.length} item{box.length > 1 ? 's' : ''}</span> in your sample tray.
                                        Don't miss out on seeing our premium textures in person.
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleOpenTray}
                                            className="w-full py-4 rounded-xl bg-[var(--terracotta)] text-white font-medium hover:bg-[#a85638] transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            Complete Request <ArrowRight size={18} />
                                        </button>
                                        <button
                                            onClick={handleDismiss}
                                            className="text-sm text-gray-400 hover:text-gray-600 underline decoration-1 underline-offset-4"
                                        >
                                            I'll do it later
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Lead Magnet View (Catalogue)
                                <div>
                                    {!isSuccess ? (
                                        <>
                                            <div className="flex items-start gap-5 mb-6">
                                                <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--ink)] flex items-center justify-center text-white">
                                                    <Download size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-serif font-bold text-[var(--ink)] mb-2">
                                                        Get the 2025 Design Kit
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        Curated for architects & builders. Includes our full catalogue, technical specs, and exclusive B2B price list.
                                                    </p>
                                                </div>
                                            </div>

                                            <form onSubmit={handleCatalogueSubmit} className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66] ml-1 mb-1 block">Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="architect@firm.com" // Suggestive placeholder
                                                        className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all outline-none text-[var(--ink)] placeholder:text-gray-400"
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-3.5 rounded-xl bg-[var(--ink)] text-white font-medium hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                                                >
                                                    {isSubmitting ? 'Sending...' : 'Send Me The Kit'}
                                                    {!isSubmitting && <ArrowRight size={16} />}
                                                </button>
                                            </form>

                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-200" style={{ backgroundColor: `hsl(30, ${10 + i * 10}%, ${80 - i * 10}%)` }} />
                                                        ))}
                                                    </div>
                                                    <p>Trusted by 500+ firms in India</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-[var(--ink)] mb-2">Check your inbox!</h3>
                                            <p className="text-gray-600">We've sent the design kit to <strong>{email}</strong>.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
