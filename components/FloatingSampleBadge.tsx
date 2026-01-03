'use client';

import React, { useEffect, useState } from 'react';
import { useSampleBox } from '@/context/SampleContext';
import { AnimatePresence, motion } from 'framer-motion';

import { usePathname } from 'next/navigation';

export default function FloatingSampleBadge() {
    const { box, setBoxOpen } = useSampleBox();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkVisibility = () => {
            setIsVisible(window.scrollY > 300 || box.length > 0);
        };

        window.addEventListener('scroll', checkVisibility);
        checkVisibility(); // Initial check

        return () => window.removeEventListener('scroll', checkVisibility);
    }, [box.length]);

    if (pathname?.startsWith('/pay')) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 right-6 z-[90]"
                >
                    <button
                        onClick={() => setBoxOpen(true)}
                        className="bg-[#1a1512] text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative active:scale-95 transition-transform border border-white/10"
                        aria-label="View Sample Box"
                    >
                        <svg className="w-6 h-6 text-[#d97757]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {box.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#d97757] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1a1512]">
                                {box.length}
                            </span>
                        )}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
