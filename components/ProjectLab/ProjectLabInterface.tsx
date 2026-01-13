'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FounderEngine_Identify, FounderEngine_Prescribe } from '@/app/actions/founder-engine';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1200; // Increased slightly for better detail
                    const MAX_HEIGHT = 1200;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG at 80% quality
                    const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                    setImages([optimizedBase64]);
                    startVisualAnalysis(optimizedBase64);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const startVisualAnalysis = async (base64Image: string) => {
        setStep('analyzing_visual');
        setError('');

        try {
            const result = await FounderEngine_Identify({
                images: [base64Image],
            });

            if (result.success && result.data) {
                setVisualContext(result.data.visualContext);
                setQuestions(result.data.discoveryQuestions || []);
                setStep('discovery');
            } else {
                setError(result.error || "Failed to analyze image.");
                setStep('upload');
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
            setStep('upload');
        }
    };

    const submitDiscovery = async () => {
        setStep('analyzing_final');
        setError('');

        try {
            const result = await FounderEngine_Prescribe({
                images: images,
                location: location,
                area: Number(area) || 1000,
                userAnswers: answers,
            });

            if (result.success && result.data) {
                setReport(result.data);
                setStep('report');
            } else {
                setError(result.error || "Failed to generate report.");
                setStep('discovery');
            }
        } catch (err) {
            setError("Final analysis failed.");
            setStep('discovery');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto rounded-[2rem] overflow-hidden min-h-[700px] border border-white/10 relative shadow-2xl bg-[#0F0B09]">

            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--terracotta)]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Progress Indicator (Minimal) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
                <motion.div
                    className="h-full bg-[var(--terracotta)]"
                    initial={{ width: '0%' }}
                    animate={{ width: step === 'upload' ? '10%' : step === 'analyzing_visual' ? '40%' : step === 'discovery' ? '60%' : '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </div>

            <div className="p-8 md:p-12 h-full flex flex-col relative z-10 text-white/90 font-light">

                {/* HEADER */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-[var(--terracotta)] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                            {step === 'upload' && "Phase I: Reconnaissance"}
                            {step === 'analyzing_visual' && "Phase II: Analysis"}
                            {step === 'discovery' && "Phase III: Strategic Alignment"}
                            {step === 'analyzing_final' && "Phase IV: Synthesis"}
                            {step === 'report' && "Phase V: Directives"}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-[#EBE5D9] mb-4 leading-tight">
                            {step === 'upload' && "Define The Context"}
                            {step === 'analyzing_visual' && "Scanning Architecture..."}
                            {step === 'discovery' && "Sharpen The Vision"}
                            {step === 'analyzing_final' && "Formulating Strategy..."}
                            {step === 'report' && "The Principal's Directive"}
                        </h2>
                        <p className="text-[#B0A8A2] font-light text-sm md:text-base leading-relaxed">
                            {step === 'upload' && "Upload a site photo. Our AI Principal will analyze the geometry, light, and potential."}
                            {step === 'analyzing_visual' && "Identifying structural constraints, lighting conditions, and architectural character."}
                            {step === 'discovery' && "The Principal has a few questions before prescribing a solution."}
                            {step === 'report' && "A definitive guide to elevating this project beyond the ordinary."}
                        </p>
                    </motion.div>
                </div>

                {/* ERROR MESSAGE */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-lg mb-8 text-center text-sm"
                        >
                            {error} <button onClick={() => setError('')} className="underline ml-2 hover:text-white">Dismiss</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CONTENT AREA */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">

                    {/* STEP 1: UPLOAD */}
                    {step === 'upload' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-lg space-y-8"
                        >
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#B0A8A2]">Project Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Hyderabad, Banjara Hills"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--terracotta)]/50 focus:bg-white/10 transition-all font-light"
                                />
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative border border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:bg-white/5 hover:border-[var(--terracotta)] transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--terracotta)]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-[var(--terracotta)] to-[#8A422C] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/30 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-serif text-[#EBE5D9]">Upload Site Context</h3>
                                    <p className="text-white/40 text-sm mt-2 font-light">Drop your image here or click to browse</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* LOADING STATE */}
                    {(step === 'analyzing_visual' || step === 'analyzing_final') && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-t-2 border-[var(--terracotta)] rounded-full animate-spin" />
                                <div className="absolute inset-2 border-r-2 border-white/20 rounded-full animate-spin direction-reverse duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl">🧠</span>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm tracking-widest uppercase animate-pulse">Running Neural Analysis</p>
                        </div>
                    )}

                    {/* STEP 2: DISCOVERY FORM */}
                    {step === 'discovery' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-3xl space-y-8"
                        >
                            {/* Visual Context Found */}
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-full shrink-0">
                                    <svg className="w-5 h-5 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] block mb-2">Visual Reconnaissance</span>
                                    <p className="text-white/80 font-serif leading-relaxed italic">"{visualContext}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Area (Sq.ft)</label>
                                    <input
                                        type="number"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="1000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--terracotta)]/50 focus:bg-white/10 transition-all font-light"
                                    />
                                </div>
                                {questions.map((q) => (
                                    <div key={q.id} className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{q.question}</label>
                                        <input
                                            type="text"
                                            value={answers[q.id] || ''}
                                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                            placeholder={q.placeholder}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--terracotta)]/50 focus:bg-white/10 transition-all font-light"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-6">
                                <button
                                    onClick={submitDiscovery}
                                    className="px-10 py-4 bg-[var(--terracotta)] text-white rounded-full font-bold hover:bg-[#a85638] transition-all shadow-lg hover:shadow-[var(--terracotta)]/20 active:scale-95 text-sm tracking-widest uppercase"
                                >
                                    Proceed to Strategy
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REPORT */}
                    {step === 'report' && report && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full bg-[#EBE5D9] text-[#1a1512] rounded-2xl overflow-hidden shadow-2xl max-h-[600px] overflow-y-auto custom-scrollbar"
                        >
                            {/* Report Header */}
                            <div className="bg-[#1a1512] text-[#EBE5D9] p-8 text-center border-b border-white/10">
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] mb-4">Strategic Vision</h3>
                                <p className="text-xl md:text-3xl font-serif leading-relaxed max-w-3xl mx-auto">
                                    "{report.strategicVision}"
                                </p>
                            </div>

                            <div className="p-8 md:p-12 space-y-12">

                                {/* Solutions Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Primary */}
                                    <div className="p-8 border border-[var(--ink)]/10 rounded-xl bg-white shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--terracotta)]" />
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">The Architect's Choice</h4>
                                        <h3 className="text-2xl font-serif text-[var(--ink)] mb-3 group-hover:text-[var(--terracotta)] transition-colors">{report.primarySolution?.product}</h3>
                                        <p className="text-sm text-gray-600 mb-6 font-light leading-relaxed">{report.primarySolution?.reasoning}</p>
                                        <div className="flex items-center gap-3 text-xs font-mono bg-gray-50 p-3 rounded border border-gray-100 table-cell">
                                            <span className="text-gray-400">SYS:</span> {report.primarySolution?.method}
                                        </div>
                                    </div>

                                    {/* Alternative */}
                                    <div className="p-8 border border-[var(--ink)]/80 rounded-xl bg-[var(--ink)] text-[#EBE5D9] relative overflow-hidden shadow-2xl">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-[#EBE5D9]/40 mb-6">The Principal's Directive</h4>
                                        <h3 className="text-2xl font-serif text-white mb-3">{report.alternativeSolution?.product}</h3>
                                        <p className="text-sm text-white/70 mb-6 font-light leading-relaxed">{report.alternativeSolution?.reasoning}</p>
                                        <div className="inline-block px-3 py-1 border border-white/20 rounded text-[10px] uppercase tracking-widest">
                                            Premium Upgrade
                                        </div>
                                    </div>
                                </div>

                                {/* Engineering & Finance split */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[var(--ink)]/10">
                                    <div>
                                        <h4 className="font-serif text-xl border-b border-[var(--ink)]/10 pb-4 mb-6">Technical Directives</h4>
                                        <ul className="space-y-4">
                                            {report.engineeringMastery?.keyChallenges?.map((c: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-[var(--ink)] font-light">
                                                    <span className="text-[var(--terracotta)] font-serif italic">{i + 1}.</span>
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-6 p-4 bg-[#F5F2EC] rounded border-l-2 border-[var(--terracotta)]">
                                            <p className="text-xs font-serif italic text-[var(--ink)]">
                                                <span className="font-bold not-italic text-[var(--terracotta)] uppercase text-[10px] tracking-wider block mb-1">Founder's Note:</span>
                                                "{report.engineeringMastery?.proTip}"
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-serif text-xl border-b border-[var(--ink)]/10 pb-4 mb-6">Financial Forecasting</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-2">
                                                <span className="text-sm text-gray-500">Material Investment</span>
                                                <span className="font-mono font-bold text-lg">{report.financialForecasting?.materialInvestment || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-2">
                                                <span className="text-sm text-gray-500">Wastage Buffer</span>
                                                <span className="font-mono text-gray-400">{report.financialForecasting?.wastageBuffer || '0'}%</span>
                                            </div>
                                            <p className="mt-6 text-sm font-light text-gray-500 italic">
                                                "{report.financialForecasting?.roiInsight}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-5 border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold"
                                >
                                    Export Official Directive
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
