import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBar from '@/components/StickyBar';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArchitectsCorner from '@/components/ArchitectsCorner';
import dynamic from 'next/dynamic';

const SampleStudio = dynamic(() => import('@/components/SampleStudio'), {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-3xl" />
});

export const metadata: Metadata = {
    title: 'For Architects | UrbanClay',
    description: 'Resources for architects and designers: BIM objects, CAD details, technical specifications, and swatch requests.',
};

export default function ArchitectsPage() {
    return (
        <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
            <StickyBar />
            <Header />

            <div className="pt-20">
                {/* HERO SECTION */}
                <div className="bg-[#2A1E16] text-white py-20 px-4 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="w-[150%] h-[150%] -rotate-12 -translate-x-[20%] -translate-y-[20%] bg-[radial-gradient(circle_at_center,#b45a3c_0%,transparent_60%)]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="flex justify-center mb-6">
                            <Breadcrumbs />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6">
                            Partnering with <span className="text-[var(--terracotta)]">Visionaries</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                            We understand that every line matters. UrbanClay provides the technical precision and aesthetic versatility you need to bring your most ambitious concepts to life.
                        </p>
                    </div>
                </div>

                {/* RESOURCES GRID */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#2A1E16] mb-4">Technical Resources</h2>
                        <p className="text-[#5d554f]">Everything you need for your specification documents.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Catalogues */}
                        <div className="bg-white p-8 rounded-2xl border border-[var(--line)] hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-[#f4f1ee] rounded-xl flex items-center justify-center mb-6 text-[var(--terracotta)] group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#2A1E16] mb-3">Product Catalogues</h3>
                            <p className="text-sm text-[#5d554f] mb-6">Comprehensive guides featuring our full range of textures, colors, and technical data.</p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2 text-sm text-[#5d554f]">
                                    <span className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full"></span>
                                    2025 General Catalogue
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[#5d554f]">
                                    <span className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full"></span>
                                    Facade Systems Guide
                                </li>
                            </ul>
                            <button className="w-full py-3 border border-[var(--line)] rounded-lg text-sm font-medium hover:bg-[#2A1E16] hover:text-white transition-colors">
                                Download PDF
                            </button>
                        </div>

                        {/* Technical Data */}
                        <div className="bg-white p-8 rounded-2xl border border-[var(--line)] hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-[#f4f1ee] rounded-xl flex items-center justify-center mb-6 text-[var(--terracotta)] group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#2A1E16] mb-3">Technical Sheets</h3>
                            <p className="text-sm text-[#5d554f] mb-6">Detailed performance metrics, installation guidelines, and test reports.</p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2 text-sm text-[#5d554f]">
                                    <span className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full"></span>
                                    Installation Manual
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[#5d554f]">
                                    <span className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full"></span>
                                    Test Certificates
                                </li>
                            </ul>
                            <button className="w-full py-3 border border-[var(--line)] rounded-lg text-sm font-medium hover:bg-[#2A1E16] hover:text-white transition-colors">
                                Access Library
                            </button>
                        </div>

                        {/* 3D Assets */}
                        <div className="bg-white p-8 rounded-2xl border border-[var(--line)] hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-[#f4f1ee] rounded-xl flex items-center justify-center mb-6 text-[var(--terracotta)] group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#2A1E16] mb-3">BIM & 3D Models</h3>
                            <p className="text-sm text-[#5d554f] mb-6">High-fidelity assets for Revit, SketchUp, and 3ds Max.</p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2 text-sm text-[#5d554f]">
                                    <span className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full"></span>
                                    Revit Families (.rfa)
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[#5d554f]">
                                    <span className="w-1.5 h-1.5 bg-[var(--terracotta)] rounded-full"></span>
                                    Seamless Textures (4K)
                                </li>
                            </ul>
                            <button className="w-full py-3 border border-[var(--line)] rounded-lg text-sm font-medium hover:bg-[#2A1E16] hover:text-white transition-colors">
                                Request Access
                            </button>
                        </div>
                    </div>
                </section>

                {/* WHY SPECIFY SECTION */}
                <section className="bg-[#fcf8f6] py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-[#2A1E16] mb-6">Why Specify UrbanClay?</h2>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--terracotta)] shrink-0">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2A1E16] mb-2">Custom Development</h4>
                                            <p className="text-sm text-[#5d554f] leading-relaxed">
                                                We don't just sell products; we co-create. Need a specific shape, size, or glaze? Our R&D team works with you to develop custom moulds for your project.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--terracotta)] shrink-0">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2A1E16] mb-2">Sustainable by Design</h4>
                                            <p className="text-sm text-[#5d554f] leading-relaxed">
                                                Our products are crafted from 100% natural clay, offering high thermal mass and low embodied energy. Perfect for LEED and IGBC certified projects.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--terracotta)] shrink-0">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2A1E16] mb-2">Technical Assurance</h4>
                                            <p className="text-sm text-[#5d554f] leading-relaxed">
                                                Every batch is tested for water absorption, compressive strength, and efflorescence. We provide comprehensive test reports for every supply.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/products/wirecut-texture.jpg"
                                    alt="Architectural Detail"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <p className="text-sm font-medium opacity-80 mb-2">Featured Project</p>
                                    <h3 className="text-2xl font-bold">The Brick House, Alibaug</h3>
                                    <p className="text-sm mt-2">Designed by: Studio Lotus</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SAMPLE STUDIO */}
                <SampleStudio />

                {/* REUSE ARCHITECTS CORNER COMPONENT FOR CTA */}
                <ArchitectsCorner />
            </div>

            <Footer />
        </div>
    );
}
