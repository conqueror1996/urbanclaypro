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
        <section className="py-24 bg-[#1a1512] text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Sticky Side Content */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <span className="text-[var(--terracotta)] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">
                            Knowledge Base
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-8">
                            Technical <br />
                            <span className="italic text-white/60 text-3xl">Specifications & FAQs</span>
                        </h2>
                        <p className="text-white/40 leading-relaxed mb-8">
                            Detailed insights into material science, installation protocols, and performance metrics for architects and specifiers.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Thermal', 'Structural', 'Acoustics', 'LEED'].map(tag => (
                                <span key={tag} className="px-3 py-1 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="lg:col-span-8 space-y-4">
                        {technicalFaqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`border-b border-white/10 transition-all duration-500 pb-4 ${openIndex === idx ? 'bg-white/5 p-8 rounded-2xl border-transparent' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full flex items-center justify-between text-left group"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className={`text-xs font-mono transition-colors ${openIndex === idx ? 'text-[var(--terracotta)]' : 'text-white/30'}`}>
                                            0{idx + 1}
                                        </span>
                                        <h3 className={`text-xl md:text-2xl font-serif transition-colors ${openIndex === idx ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <span className={`text-2xl transition-transform duration-500 ${openIndex === idx ? 'rotate-45 text-[var(--terracotta)]' : 'text-white/20'}`}>
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
                                            <div className="pt-6 pl-12">
                                                <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                                                    {faq.answer}
                                                </p>
                                                <div className="mt-8 flex items-center gap-4">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] px-2 py-1 bg-[var(--terracotta)]/10 rounded">
                                                        Expert insight
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 underline decoration-white/10 underline-offset-4">
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
