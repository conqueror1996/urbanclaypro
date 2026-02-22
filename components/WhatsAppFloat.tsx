'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppFloat() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Show after a delay (e.g., 5 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappNumber = "918080081951";
    const defaultMessage = "Hi UrbanClay, I'm interested in your premium terracotta products.";

    const openWhatsApp = () => {
        setHasInteracted(true);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`, '_blank');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {!hasInteracted && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed bottom-28 right-6 z-[9999] flex flex-col items-end gap-2"
                >
                    {/* Chat Bubble */}
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tr-none shadow-xl border border-gray-100 relative mb-2 animate-bounce-subtle origin-bottom-right">
                        <p className="text-xs font-bold text-gray-800">
                            👋 Need Help? <span className="text-[var(--terracotta)]">Chat with us!</span>
                        </p>
                        <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={openWhatsApp}
                        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-green-500/30 transition-all hover:scale-110"
                        aria-label="Chat on WhatsApp"
                    >
                        {/* Tooltip on Hover */}
                        <div className="absolute right-full mr-3 bg-black/80 text-white text-[10px] uppercase font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Quick Response
                        </div>

                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </button>

                    {/* Close Button (Subtle) */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
