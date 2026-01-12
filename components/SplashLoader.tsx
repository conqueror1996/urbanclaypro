'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashLoader() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initial check to see if we should show the loader
        // We only show it once per session to avoid annoying returning users
        const hasSeenLoader = sessionStorage.getItem('hasSeenSplash');
        if (!hasSeenLoader) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
                sessionStorage.setItem('hasSeenSplash', 'true');
            }, 100); // Super fast 100ms flash
            return () => clearTimeout(timer);

        }
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--sand)]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }} // Faster exit
                >
                    <div className="flex flex-col items-center gap-4">
                        <motion.div
                            className="w-16 h-16 border-4 border-[var(--terracotta)] border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            // No delay
                            className="text-2xl font-bold text-[var(--ink)] tracking-wider"
                        >
                            URBANCLAY
                        </motion.h1>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
