'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A drop-in replacement for Next.js Image that includes a branded UrbanClay loader.
 * Perfect for Hero sections and large content images.
 */
export default function UrbanClayImage({ className, ...props }: ImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className || ''}`}>
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--background)]/20 backdrop-blur-[4px]"
                    >
                        {/* Branded Spinner */}
                        <div className="relative flex flex-col items-center gap-4">
                            <motion.div
                                className="w-12 h-12 border-[2px] border-[var(--terracotta)]/20 border-t-[var(--terracotta)] rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            
                            {/* Brand Text - Matching SplashLoader */}
                            <motion.h2 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 0.8, y: 0 }}
                                className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--ink)]"
                            >
                                URBANCLAY
                            </motion.h2>

                            {/* Scale Indicator / Technical Feel */}
                            <div className="absolute -bottom-8 flex items-center gap-2 opacity-30">
                                <span className="w-8 h-[1px] bg-[var(--ink)]" />
                                <span className="text-[7px] font-mono whitespace-nowrap">ASSET_LOAD_SEQUENCE</span>
                                <span className="w-8 h-[1px] bg-[var(--ink)]" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <Image
                {...props}
                onLoadingComplete={(result) => {
                    setIsLoaded(true);
                    if (props.onLoadingComplete) props.onLoadingComplete(result);
                }}
                className={`${className || ''} transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            />
        </div>
    );
}
