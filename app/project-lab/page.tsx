'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, Loader2, Sparkles, Building2, MapPin, Mail, User, Scan, Cpu, Layers, Palette } from 'lucide-react';
import { submitProjectLab } from '@/app/actions/submit-project-lab';
import { toast } from 'sonner';

const STEPS = [
    { text: "Scanning geometry...", icon: Scan },
    { text: "Detecting facade orientation...", icon: MapPin },
    { text: "Calculating surface area...", icon: Layers },
    { text: "Identifying material palette...", icon: Palette },
    { text: "Generating technical proposal...", icon: Cpu }
];

export default function ProjectLabPage() {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic Typing Effect
    const [typedText, setTypedText] = useState('');
    const fullText = "Turn Sketches into Fabricated Reality.";

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setTypedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, []);

    // Processing Simulation Loop
    useEffect(() => {
        if (isSubmitting && processingStep < STEPS.length) {
            const timer = setTimeout(() => {
                setProcessingStep(prev => prev + 1);
            }, 800); // Change step every 800ms
            return () => clearTimeout(timer);
        }
    }, [isSubmitting, processingStep]);


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
        setProcessingStep(0);

        const formData = new FormData(e.currentTarget);
        if (file) {
            formData.append('sketch', file);
        }

        // Simulate wait for the animation to play at least a bit
        await new Promise(resolve => setTimeout(resolve, 3000));

        const result = await submitProjectLab(formData);

        if (result.success) {
            setIsSuccess(true);
            toast.success("Project received! AI Analysis initiated.");
        } else {
            toast.error("Submission failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0c] text-[#EBE5E0] font-sans selection:bg-[var(--terracotta)] selection:text-white relative overflow-x-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--terracotta)]/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-1000"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen"></div>
                {/* Moving Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
            </div>

            <Header />

            <main className="pt-32 pb-20 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold uppercase tracking-widest text-[var(--terracotta)] backdrop-blur-md shadow-[0_0_15px_rgba(180,90,60,0.2)]">
                            <Sparkles size={12} className="animate-spin-slow" />
                            <span>UrbanClay Project Lab AI v2.0</span>
                        </div>

                        <div className="relative">
                            <h1 className="text-4xl md:text-6xl font-serif leading-tight h-[3em] md:h-auto">
                                {typedText}
                                <span className="animate-pulse inline-block w-1 h-10 ml-1 bg-[var(--terracotta)] align-middle"></span>
                            </h1>
                        </div>

                        <p className="text-lg text-white/50 max-w-lg leading-relaxed font-light">
                            Upload your facade elevation or rough sketch. Our system will generate a
                            <span className="text-white font-medium border-b border-[var(--terracotta)]/50 mx-1">detailed cladding proposal</span>
                            including panel optimization, u-value checks, and texture mapping—within 24 hours.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {['24h Turnaround', 'BIM Compatible', 'Cost Estimator', 'Texture Map'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all hover:bg-white/10 group">
                                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white/40 group-hover:text-[var(--terracotta)] transition-colors">
                                        {i === 0 && <Check size={14} />}
                                        {i === 1 && <Cpu size={14} />}
                                        {i === 2 && <Scan size={14} />}
                                        {i === 3 && <Palette size={14} />}
                                    </div>
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Form Interface */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative group perspective-1000"
                    >
                        {/* Glow effect behind form */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--terracotta)] to-blue-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                        <div className="relative bg-[#15110f]/90 backdrop-blur-xl border border-white/10 rounded-[1.8rem] p-8 md:p-10 shadow-2xl">
                            {isSuccess ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 relative"
                                    >
                                        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping"></div>
                                        <Check size={40} strokeWidth={3} />
                                    </motion.div>
                                    <h3 className="text-2xl font-serif text-white mb-2">Transmission Complete</h3>
                                    <p className="text-white/50 max-w-xs font-mono text-xs">
                                        Reference ID: #{Math.floor(Math.random() * 100000)}<br />
                                        Status: Awaiting Analysis
                                    </p>
                                    <button
                                        onClick={() => { setIsSuccess(false); setFile(null); setIsSubmitting(false); }}
                                        className="mt-8 px-6 py-3 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] hover:bg-white/5 transition-all"
                                    >
                                        Start New Session
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white/40">Input Parameters</h3>
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-[10px] uppercase font-bold text-emerald-500">System Online</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <input
                                                name="architectName"
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] transition-all placeholder:text-white/10 text-sm font-medium"
                                                placeholder="Architect Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] transition-all placeholder:text-white/10 text-sm font-medium"
                                                placeholder="Work Email"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <select
                                                name="projectType"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-all appearance-none text-sm font-medium"
                                            >
                                                <option value="commercial" className="bg-[#231e1a]">Commercial Facade</option>
                                                <option value="residential" className="bg-[#231e1a]">Residential Villa</option>
                                                <option value="institutional" className="bg-[#231e1a]">Institutional / Public</option>
                                                <option value="interior" className="bg-[#231e1a]">Interior Info</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                name="city"
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--terracotta)] transition-all placeholder:text-white/10 text-sm font-medium"
                                                placeholder="Project Location"
                                            />
                                        </div>
                                    </div>

                                    {/* HOLOGRAPHIC UPLOAD AREA */}
                                    <div
                                        className={`
                                            relative h-48 border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden group
                                            ${dragging ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/5' : 'border-white/10 hover:border-[var(--terracotta)]/50 hover:bg-white/5'}
                                            ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
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

                                        {/* Scanner Grid Animation */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(180,90,60,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(180,90,60,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                        {/* Scanning Bar */}
                                        <div className="absolute left-0 right-0 h-1 bg-[var(--terracotta)] shadow-[0_0_15px_var(--terracotta)] opacity-0 group-hover:opacity-50 animate-scan pointer-events-none top-0"></div>

                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                                            {file ? (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                                                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3 border border-emerald-500/30">
                                                        <Check size={24} />
                                                    </div>
                                                    <p className="font-mono text-sm font-bold text-white mb-1">{file.name}</p>
                                                    <p className="text-[10px] text-white/40 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB - READY TO PROCESS</p>
                                                </motion.div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 rounded-lg bg-white/5 text-white/30 group-hover:text-[var(--terracotta)] group-hover:bg-[var(--terracotta)]/10 mx-auto flex items-center justify-center mb-3 transition-colors">
                                                        <Scan size={24} />
                                                    </div>
                                                    <p className="font-bold text-white text-sm">Drop Reference File Here</p>
                                                    <p className="text-xs text-white/40 mt-1 font-mono">JPG, PDF, PNG (Max 10MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !file}
                                        className={`
                                            relative w-full h-14 rounded-xl font-bold uppercase tracking-widest text-sm transition-all overflow-hidden
                                            ${isSubmitting || !file
                                                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                                : 'bg-[var(--terracotta)] text-white hover:bg-[#a85638] shadow-[0_0_20px_rgba(180,90,60,0.3)] hover:shadow-[0_0_30px_rgba(180,90,60,0.5)] active:scale-[0.98]'
                                            }
                                        `}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="processing"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    className="flex items-center justify-center gap-3 text-xs font-mono"
                                                >
                                                    {processingStep < STEPS.length ? (
                                                        <>
                                                            <Loader2 size={14} className="animate-spin" />
                                                            {STEPS[processingStep]?.text || "Processing..."}
                                                        </>
                                                    ) : (
                                                        <>Finalizing Report...</>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="idle"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    <Sparkles size={16} />
                                                    Initiate Analysis
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Progress Bar background during submit */}
                                        {isSubmitting && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-1 bg-white/30"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 4 }}
                                            />
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Add strict styles for scan animation in a real implementation or global.css
// For now, relying on standard tailwind or adding quick style injection if needed, 
// but 'animate-scan' needs to be defined if not present. 
// I'll stick to 'animate-pulse' or similar if 'animate-scan' isn't in global css.
// Actually, I will add a style tag for the scan animation to be safe.
