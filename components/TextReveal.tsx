'use client';

import { motion } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function TextReveal({ text, className = '', delay = 0, highlightWords = [], highlightClass = 'text-[var(--terracotta)]' }: TextRevealProps & { highlightWords?: string[], highlightClass?: string }) {
    // Split text into words
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: delay * 0.1 }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <motion.h1
            className={`flex flex-wrap overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {words.map((word, index) => {
                const isHighlighted = highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));

                return (
                    <motion.span
                        variants={child}
                        key={index}
                        className={`mr-[0.25em] ${isHighlighted ? highlightClass : ''}`}
                    >
                        {word}
                    </motion.span>
                );
            })}
        </motion.h1>
    );
}
