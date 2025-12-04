"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AccessModal from './AccessModal';
import SampleModal from './SampleModal';

export default function ArchitectsCorner() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    return (
        <section className="py-16 bg-[#2A1E16] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-[var(--terracotta)] font-medium tracking-wider text-sm uppercase">For Professionals</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Architect's Corner</h2>
                        <p className="text-white/80 text-lg leading-relaxed mb-8">
                            We support your design process with high-quality assets. Request access to our professional library containing BIM objects, CAD details, and high-res textures.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-3 bg-[var(--terracotta)] text-white rounded-full font-medium hover:bg-[#a85638] transition-colors"
                            >
                                Request BIM/CAD Access
                            </button>
                            <button
                                onClick={() => setIsSampleModalOpen(true)}
                                className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                            >
                                Order Sample Box
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="font-semibold text-lg mb-2">BIM Objects</h4>
                            <p className="text-sm text-white/60">Revit & ArchiCAD compatible families for all product lines.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="font-semibold text-lg mb-2">CAD Details</h4>
                            <p className="text-sm text-white/60">Standard installation details in DWG/DXF formats.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="font-semibold text-lg mb-2">Textures</h4>
                            <p className="text-sm text-white/60">4K seamless PBR textures for rendering.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="font-semibold text-lg mb-2">Spec Sheets</h4>
                            <p className="text-sm text-white/60">Detailed CSI specifications for tender documents.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <SampleModal isOpen={isSampleModalOpen} onClose={() => setIsSampleModalOpen(false)} />
        </section>
    );
}
