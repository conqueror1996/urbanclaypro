'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const technicalFaqs = [
    {
        question: "How do you prevent efflorescence (white patches) on bricks?",
        answer: "Efflorescence is caused by soluble salts reacting with moisture. At UrbanClay, we utilize a high-temperature firing process and low-alkali clay sources. Additionally, we recommend using a low-cement mortar and ensuring proper drainage during installation to minimize any lime blooming.",
        category: "Reliability"
    },
    {
        question: "What is the thermal insulation performance of terracotta cladding?",
        answer: "Terracotta is a natural insulator with high thermal mass. It creates a 'Thermal Buffer' that absorbs heat during the day and releases it at night. When used in a ventilated facade system, it can reduce building cooling loads by up to 20-30% compared to standard glass or metal facades.",
        category: "Energy"
    },
    {
        question: "What is the compression strength of your wirecut bricks?",
        answer: "Our wirecut bricks typically exhibit a compressive strength ranging from 15 N/mm² to 25 N/mm², which is significantly higher than standard fly-ash or locally kilned bricks. This makes them suitable for load-bearing structures as well as decorative cladding.",
        category: "Structural"
    },
    {
        question: "Are UrbanClay products suitable for coastal regions like Mumbai or Chennai?",
        answer: "Yes. Our vitrified terracotta range features a very low water absorption rate (typically <8%). This prevents salt-air penetration and moisture-induced damage, making them the preferred choice for high-humidity coastal environments.",
        category: "Durability"
    },
    {
        question: "Can these tiles be installed over an existing concrete wall?",
        answer: "Absolutely. Our clay brick tiles and cladding veneers are lightweight (approx. 18-22kg per sqm) and can be easily installed on concrete, plastered walls, or even drywall using a high-quality flexible tile adhesive.",
        category: "Installation"
    }
];

export default function TechnicalFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="section-padding bg-[var(--background)] text-[var(--foreground)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-16">

                    {/* Sticky Side Content */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-2 md:mb-6 block">
                            Knowledge Base
                        </span>
                        <h2 className="text-[var(--foreground)] leading-[1.1] mb-3 md:mb-8">
                            Technical <br />
                            <span className="italic text-[var(--foreground)]/50 text-xl md:text-3xl">Specifications & FAQs</span>
                        </h2>
                        <p className="text-[var(--foreground)]/60 text-[13px] md:text-base leading-relaxed mb-4 md:mb-8 max-w-sm md:max-w-none">
                            Detailed insights into material science, installation protocols, and performance metrics for architects and specifiers.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                            {['Thermal', 'Structural', 'Acoustics', 'LEED'].map(tag => (
                                <span key={tag} className="px-2 py-0.5 border border-[var(--line)] bg-[var(--sand)] rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="lg:col-span-8 space-y-6">
                        {technicalFaqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`border-b border-[var(--line)] transition-all duration-500 pb-0 ${openIndex === idx ? 'bg-[var(--line)]/30 rounded-2xl border-transparent' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full flex items-center justify-between text-left group p-4 md:p-6"
                                >
                                    <div className="flex items-center gap-3 md:gap-6">
                                        <span className={`text-[10px] md:text-xs font-mono transition-colors ${openIndex === idx ? 'text-[var(--terracotta)]' : 'text-[#999]'}`}>
                                            0{idx + 1}
                                        </span>
                                        <h3 className={`font-serif text-lg md:text-xl transition-colors ${openIndex === idx ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/70 group-hover:text-[var(--foreground)]'}`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <span className={`text-xl md:text-2xl transition-transform duration-500 ${openIndex === idx ? 'rotate-45 text-[var(--terracotta)]' : 'text-[#ccc]'}`}>
                                        +
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 md:px-6 pt-0 pb-4 md:pb-6 ml-8 md:ml-12">
                                                <p className="text-sm md:text-lg text-[var(--foreground)]/60 leading-relaxed max-w-2xl font-light">
                                                    {faq.answer}
                                                </p>
                                                <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3">
                                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] px-2 py-0.5 bg-[var(--terracotta)]/10 rounded">
                                                        Expert insight
                                                    </span>
                                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#777] underline decoration-gray-200 underline-offset-4 cursor-pointer hover:text-[var(--terracotta)]">
                                                        Read Technical Sheet
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
