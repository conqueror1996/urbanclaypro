'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ComparisonTable() {
    const metrics = [
        {
            label: 'Dimensional Tolerance',
            urbanClay: '± 1mm (Calibrated)',
            conventional: '± 5-8mm (Variable)',
            highlight: true
        },
        {
            label: 'Firing Temperature',
            urbanClay: '> 1150°C (Vitrified)',
            conventional: '800°C - 900°C',
            highlight: true
        },
        {
            label: 'Soluble Salt Content',
            urbanClay: '< 0.05% (Washed Clay)',
            conventional: '> 2.0% (Unwashed)',
            highlight: true
        },
        {
            label: 'Efflorescence Risk',
            urbanClay: 'Near Zero',
            conventional: 'High / Severe',
            highlight: true
        },
        {
            label: 'Water Absorption',
            urbanClay: '< 6-8%',
            conventional: '> 15-20%',
            highlight: false
        },
        {
            label: 'Compressive Strength',
            urbanClay: '> 25 N/mm²',
            conventional: '< 7-10 N/mm²',
            highlight: false
        },
        {
            label: 'Facade Failure Rate',
            urbanClay: '0% (System based)',
            conventional: 'Common (Cracking/Detachment)',
            highlight: true
        },
        {
            label: 'Maintenance Cost (5 Yrs)',
            urbanClay: 'Zero',
            conventional: 'High (Cleaning/Sealing)',
            highlight: true
        }
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl border border-[var(--ink)]/5 bg-white shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-[#2A1E16] text-white p-6 md:p-8 items-center">
                <div className="col-span-1 font-serif text-lg md:text-2xl italic text-white/50">
                    Performance Metric
                </div>
                <div className="col-span-1 text-center">
                    <div className="inline-block relative">
                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-1 block">
                            The Standard
                        </span>
                        <h3 className="font-serif text-xl md:text-3xl text-white">UrbanClay®</h3>
                    </div>
                </div>
                <div className="col-span-1 text-center opacity-60">
                    <h3 className="font-sans font-medium text-sm md:text-lg">Conventional Market</h3>
                </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[var(--ink)]/5">
                {metrics.map((metric, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className={`grid grid-cols-3 p-6 md:p-8 items-center hover:bg-[var(--sand)]/10 transition-colors ${metric.highlight ? 'bg-[var(--sand)]/5' : ''}`}
                    >
                        {/* Label */}
                        <div className="col-span-1 font-medium text-sm md:text-lg text-[var(--ink)]/80">
                            {metric.label}
                        </div>

                        {/* UrbanClay Value */}
                        <div className="col-span-1 text-center">
                            <span className={`
                                inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-lg
                                ${metric.highlight ? 'text-[#2A1E16] bg-[#dcbf3f]/10 border border-[#dcbf3f]/50' : 'text-[#2A1E16]'}
                            `}>
                                {metric.urbanClay}
                            </span>
                            {metric.highlight && (
                                <div className="text-[10px] uppercase tracking-wider text-[var(--ink)]/40 mt-1 hidden md:block">
                                    Superior
                                </div>
                            )}
                        </div>

                        {/* Conventional Value */}
                        <div className="col-span-1 text-center text-sm md:text-lg text-[var(--ink)]/40 line-through decoration-[var(--terracotta)]/50">
                            {metric.conventional}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
