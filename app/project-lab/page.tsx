'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Upload, Check, Loader2, Sparkles, Building2, MapPin, Mail, User } from 'lucide-react';
import { submitProjectLab } from '@/app/actions/submit-project-lab';
import { toast } from 'sonner';

export default function ProjectLabPage() {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        if (file) {
            formData.append('sketch', file);
        }

        const result = await submitProjectLab(formData);

        if (result.success) {
            setIsSuccess(true);
            toast.success("Project received! Our AI is analyzing your facade compatibility.");
        } else {
            toast.error("Submission failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1512] text-[#EBE5E0] font-sans selection:bg-[var(--terracotta)] selection:text-white">
            <Header />

            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
                            <Sparkles size={12} />
                            <span>Project Lab AI</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif leading-tight">
                            Turn Sketches into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Fabricated Reality.</span>
                        </h1>

                        <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                            Upload your facade elevation or rough sketch. Our AI-assisted team will generate a
                            <span className="text-white font-bold"> detailed cladding proposal</span>, including panel optimization and texture mapping, within 24 hours.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-2xl font-serif mb-1">24h</h3>
                                <p className="text-xs text-white/40 uppercase tracking-widest">Turnaround Time</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-2xl font-serif mb-1">BIM</h3>
                                <p className="text-xs text-white/40 uppercase tracking-widest">Compatible Assets</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Form Interface */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#231e1a] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50"
                    >
                        {isSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-2">Analysis in Progress</h3>
                                <p className="text-white/50 max-w-xs">
                                    We've received your project data. Check your email inbox in 24 hours for the comprehensive proposal.
                                </p>
                                <button
                                    onClick={() => { setIsSuccess(false); setFile(null); setIsSubmitting(false); }}
                                    className="mt-8 text-sm font-bold uppercase tracking-widest text-[var(--terracotta)] hover:text-white transition-colors"
                                >
                                    Submit Another Project
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <User size={12} /> Architect Name
                                        </label>
                                        <input
                                            name="architectName"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-white/10"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <Mail size={12} /> Work Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-white/10"
                                            placeholder="arch@studio.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <Building2 size={12} /> Project Type
                                        </label>
                                        <select
                                            name="projectType"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-colors appearance-none"
                                        >
                                            <option value="commercial" className="bg-[#231e1a]">Commercial Facade</option>
                                            <option value="residential" className="bg-[#231e1a]">Residential Villa</option>
                                            <option value="institutional" className="bg-[#231e1a]">Institutional / Public</option>
                                            <option value="interior" className="bg-[#231e1a]">Interior Info</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <MapPin size={12} /> Project City
                                        </label>
                                        <input
                                            name="city"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-white/10"
                                            placeholder="Mumbai, Delhi..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Project Context</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-white/10 resize-none"
                                        placeholder="Briefly describe the design intent, estimated facade area, and preferred color palette..."
                                    />
                                </div>

                                {/* UPLOAD AREA */}
                                <div
                                    className={`
                                        border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative overflow-hidden group
                                        ${dragging ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                                        ${file ? 'bg-emerald-500/5 border-emerald-500/30' : ''}
                                    `}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                                        }}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                    />

                                    <div className="flex flex-col items-center gap-3 relative z-10">
                                        {file ? (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                    <Check size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{file.name}</p>
                                                    <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider mt-2"
                                                >
                                                    Remove File
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white transition-colors flex items-center justify-center">
                                                    <Upload size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">Drop facade sketch here</p>
                                                    <p className="text-xs text-white/40 mt-1">or click to browse (JPG, PDF, PNG)</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !file}
                                    className={`
                                        w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
                                        ${isSubmitting || !file
                                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                            : 'bg-[var(--terracotta)] text-white hover:bg-[#b45a3c] shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 active:scale-[0.98]'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>Generate Proposal</>
                                    )}
                                </button>

                                <p className="text-center text-[10px] text-white/30">
                                    By submitting, you agree to receive a technical analysis via email.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
