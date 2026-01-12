'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IdentifyAndAsk, AnalyzeProject } from '@/app/actions/project-lab-ai';
import { Camera, Upload, ArrowRight, Activity, Cpu, Layers, Maximize2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Question {
    id: string;
    question: string;
    placeholder: string;
}

export default function ProjectLabInterface() {
    const [step, setStep] = useState<'upload' | 'analyzing_visual' | 'discovery' | 'analyzing_final' | 'report'>('upload');
    const [images, setImages] = useState<string[]>([]);
    const [visualContext, setVisualContext] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [report, setReport] = useState<any>(null);
    const [error, setError] = useState('');

    // Form inputs
    const [area, setArea] = useState('');
    const [location, setLocation] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on step change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [step, questions, report]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImages([base64]);
                startVisualAnalysis(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const startVisualAnalysis = async (base64Image: string) => {
        setStep('analyzing_visual');
        setError('');

        try {
            const result = await IdentifyAndAsk({
                images: [base64Image],
                location: location || 'Mumbai', // Default context if empty
            });

            if (result.success && result.data) {
                setVisualContext(result.data.visualContext);
                setQuestions(result.data.discoveryQuestions || []);
                setTimeout(() => setStep('discovery'), 1500); // Artificial delay for "processing" feel
            } else {
                setError(result.error || "Failed to analyze image.");
                setStep('upload');
            }
        } catch (err) {
            setError("Connection failed. Please check your network.");
            setStep('upload');
        }
    };

    const submitDiscovery = async () => {
        setStep('analyzing_final');
        setError('');

        try {
            const result = await AnalyzeProject({
                images: images,
                location: location,
                area: Number(area) || 1000,
                userAnswers: answers,
                complexity: 'medium'
            });

            if (result.success && result.data) {
                setReport(result.data);
                setTimeout(() => setStep('report'), 2000);
            } else {
                setError(result.error || "Failed to generate directive.");
                setStep('discovery');
            }
        } catch (err) {
            setError("Analysis Protocol Failed.");
            setStep('discovery');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-[#0c0a09] text-[#EBE5E0] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 relative min-h-[800px] flex flex-col font-sans selection:bg-[#b45a3c] selection:text-white">

            {/* --- TOP BAR: Command Center Status --- */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#1a1512]">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/30 ml-2">sys.architect_ai_v2.0</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${error ? 'text-red-500' : 'text-emerald-500/80'}`}>
                        {error ? '⚠ SYSTEM ERROR' : '● ONLINE'}
                    </span>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 relative overflow-y-auto px-6 py-8 md:px-12 md:py-12 custom-scrollbar">

                {/* Intro / Header */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">
                        Project Lab <span className="text-[#b45a3c]">.AI</span>
                    </h2>
                    <p className="text-white/60 text-lg font-light max-w-2xl leading-relaxed">
                        Feasibility analysis and architectural direction. Upload your site context to receive a principal-level directive.
                    </p>
                </div>

                <AnimatePresence mode='wait'>

                    {/* STEP 1: UPLOAD & INITIAL CONTEXT */}
                    {step === 'upload' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Location Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#b45a3c] font-bold">01. Project Coordinates</label>
                                    <input
                                        type="text"
                                        placeholder="City / Context (e.g. Goa, Coastal)"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b45a3c] transition-colors font-mono text-sm placeholder:text-white/20"
                                    />
                                </div>

                                {/* Upload Zone */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#b45a3c] font-bold">02. Site Visual Data</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-[3/1] md:aspect-[4/1] bg-white/[0.02] border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.05] hover:border-[#b45a3c]/50 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
                                        <div className="z-10 flex flex-col items-center gap-3">
                                            <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-500 border border-white/10">
                                                <Upload className="w-5 h-5 text-[#b45a3c]" />
                                            </div>
                                            <p className="text-xs uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                                                Upload Site Image
                                            </p>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* LOADING: VISUAL SCAN */}
                    {step === 'analyzing_visual' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 border-t-2 border-[#b45a3c] rounded-full animate-spin" />
                                <div className="absolute inset-2 border-r-2 border-white/20 rounded-full animate-spin [animation-direction:reverse]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Cpu className="w-8 h-8 text-[#b45a3c] animate-pulse" />
                                </div>
                            </div>
                            <div className="font-mono text-xs text-[#b45a3c] tracking-[0.2em] mb-2">PROCESSING VISUAL DATA</div>
                            <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#b45a3c]"
                                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DISCOVERY (The Interface) */}
                    {step === 'discovery' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            {/* Analysis Result */}
                            <div className="flex gap-6 items-start p-6 bg-[#b45a3c]/10 border border-[#b45a3c]/20 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Layers className="w-24 h-24 text-[#b45a3c]" />
                                </div>
                                <div className="min-w-[48px] h-12 bg-[#b45a3c]/20 rounded-lg flex items-center justify-center border border-[#b45a3c]/30">
                                    <Activity className="w-6 h-6 text-[#b45a3c]" />
                                </div>
                                <div>
                                    <h4 className="text-[#b45a3c] font-bold uppercase tracking-widest text-xs mb-2">Initial Site Scan</h4>
                                    <p className="text-white/80 font-serif text-lg leading-relaxed">"{visualContext}"</p>
                                </div>
                            </div>

                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); submitDiscovery(); }}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Total Plot/Facade Area</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={area}
                                                onChange={e => setArea(e.target.value)}
                                                placeholder="1000"
                                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b45a3c] transition-colors font-mono text-lg"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">SQ.FT</span>
                                        </div>
                                    </div>

                                    {questions.map((q, i) => (
                                        <div key={q.id} className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Recon 0{i + 1}: {q.question}</label>
                                            <input
                                                type="text"
                                                value={answers[q.id] || ''}
                                                onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                                                placeholder={q.placeholder}
                                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b45a3c] transition-colors font-serif text-base placeholder:text-white/10 placeholder:font-sans"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#b45a3c] hover:text-white transition-all flex items-center gap-4 group"
                                    >
                                        Generate Directive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* LOADING: FINAL COMPUTE */}
                    {step === 'analyzing_final' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="grid grid-cols-3 gap-1 mb-8">
                                {[...Array(9)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-3 h-3 bg-white/10"
                                        animate={{ backgroundColor: ['rgba(255,255,255,0.1)', '#b45a3c', 'rgba(255,255,255,0.1)'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                    />
                                ))}
                            </div>
                            <div className="font-mono text-xs text-white/60 tracking-widest mb-1">COMPILING FEASIBILITY REPORT</div>
                            <div className="text-[#b45a3c] text-xs font-mono">CALCULATING LOADS...</div>
                        </motion.div>
                    )}

                    {/* STEP 3: THE DIRECTIVE (Report) */}
                    {step === 'report' && report && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-12"
                        >
                            {/* Header Statement */}
                            <div className="border-l-4 border-[#b45a3c] pl-8 py-2">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-[#b45a3c] block mb-4 font-bold">Principal's Vision</span>
                                <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                                    "{report.strategicVision}"
                                </h3>
                            </div>

                            {/* The Two Paths */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Path A: Visionary */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 bg-white/10 rounded text-[10px] uppercase tracking-widest font-bold text-white/60 group-hover:bg-[#b45a3c] group-hover:text-white transition-colors">Visionary Path</div>
                                        <CheckCircle2 className="w-5 h-5 text-white/20 group-hover:text-[#b45a3c]" />
                                    </div>
                                    <h4 className="text-3xl font-serif text-white mb-2">{report.primarySolution?.product}</h4>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6 border-b border-white/10 pb-6">
                                        {report.primarySolution?.reasoning}
                                    </p>
                                    <div className="space-y-3 font-mono text-xs text-white/40">
                                        <div className="flex justify-between">
                                            <span>Method</span>
                                            <span className="text-white">{report.primarySolution?.method}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Quantity</span>
                                            <span className="text-white">{report.primarySolution?.quantity} (Est.)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Path B: Boss Directive */}
                                <div className="bg-[#b45a3c] rounded-2xl p-8 relative overflow-hidden shadow-2xl group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="px-3 py-1 bg-black/20 rounded text-[10px] uppercase tracking-widest font-bold text-white/90">Principal's Directive</div>
                                        <Maximize2 className="w-5 h-5 text-white/50" />
                                    </div>
                                    <h4 className="text-3xl font-serif text-white mb-2 relative z-10">{report.alternativeSolution?.product}</h4>
                                    <p className="text-white/80 text-sm leading-relaxed mb-6 border-b border-white/20 pb-6 relative z-10">
                                        {report.alternativeSolution?.reasoning}
                                    </p>
                                    <div className="space-y-3 font-mono text-xs text-white/60 relative z-10">
                                        <div className="flex justify-between">
                                            <span>Method</span>
                                            <span className="text-white">{report.alternativeSolution?.method}</span>
                                        </div>
                                        <div className="p-3 bg-black/20 rounded mt-4 text-white italic">
                                            "This isn't just a solution. It's a statement."
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tech & Finance */}
                            <div className="grid md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                                <div>
                                    <h4 className="text-[12px] uppercase tracking-widest text-white/40 mb-6 font-bold flex items-center gap-2">
                                        <Cpu className="w-4 h-4" /> Engineering Notes
                                    </h4>
                                    <ul className="space-y-4">
                                        {report.engineeringMastery?.keyChallenges?.map((c: string, i: number) => (
                                            <li key={i} className="flex gap-4 text-sm text-white/70">
                                                <span className="text-[#b45a3c] font-mono">0{i + 1}</span>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8 p-4 border border-[#b45a3c]/30 rounded-lg bg-[#b45a3c]/5">
                                        <p className="text-xs text-[#b45a3c] font-mono uppercase tracking-widest mb-2">Pro Tip</p>
                                        <p className="text-sm text-white/80 italic">"{report.engineeringMastery?.proTip}"</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[12px] uppercase tracking-widest text-white/40 mb-6 font-bold flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Investment
                                    </h4>
                                    <div className="space-y-4 font-mono text-sm">
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-white/50">Material Cost</span>
                                            <span className="text-white text-lg">{report.financialForecasting?.materialInvestment}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-white/50">Wastage Buffer</span>
                                            <span className="text-emerald-400">{report.financialForecasting?.wastageBuffer}%</span>
                                        </div>
                                        <p className="pt-4 text-xs text-white/40 leading-relaxed">
                                            {report.financialForecasting?.roiInsight}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => window.print()}
                                        className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors border border-white/10"
                                    >
                                        Download Official Directive (PDF)
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
