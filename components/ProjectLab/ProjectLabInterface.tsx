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
    const [scanData, setScanData] = useState<any>(null); // NEW: Store scan data
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
                setScanData(result.data.scanData); // Capture scan data
                setQuestions(result.data.discoveryQuestions || []);
                setStep('discovery');
            } else {
                // Logic Core never fails, but good to have fallback
                setError("Analysis interrupted. Please retry.");
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
                setError("Strategy generation interrupted.");
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
                <div className="mb-8 text-center max-w-2xl mx-auto">
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
                            {step === 'discovery' && "Analysis Complete. Initiate Alignment."}
                            {step === 'analyzing_final' && "Formulating Strategy..."}
                            {step === 'report' && "The Principal's Directive"}
                        </h2>
                        <p className="text-[#B0A8A2] font-light text-sm md:text-base leading-relaxed">
                            {step === 'upload' && "Upload a site photo. Our AI Principal will analyze the geometry, light, and potential."}
                            {step === 'analyzing_visual' && "Identifying structural constraints, lighting conditions, and architectural character."}
                            {step === 'discovery' && "Visual cortex scan complete. Please verify the structural and environmental parameters below."}
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
                <div className="flex-1 flex flex-col items-center justify-center w-full relative z-20">

                    {/* STEP 1: UPLOAD */}
                    {step === 'upload' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-lg space-y-6 md:space-y-8"
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
                                className="group relative border border-dashed border-white/20 rounded-2xl p-8 md:p-12 text-center cursor-pointer hover:bg-white/5 hover:border-[var(--terracotta)] transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--terracotta)]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[var(--terracotta)] to-[#8A422C] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/30 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-serif text-[#EBE5D9]">Upload Site Context</h3>
                                    <p className="text-white/40 text-xs md:text-sm mt-2 font-light">Initiate Urban Logic Core Analysis</p>
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

                    {/* LOADING STATE - GOD MODE */}
                    {(step === 'analyzing_visual' || step === 'analyzing_final') && (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 border-t border-[var(--terracotta)] rounded-full animate-spin duration-1000" />
                                <div className="absolute inset-2 border-r border-white/20 rounded-full animate-spin direction-reverse duration-[3s]" />
                                <div className="absolute inset-8 border-b border-[var(--terracotta)]/50 rounded-full animate-pulse" />

                                {/* Scanning Lines */}
                                <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden rounded-full opacity-30">
                                    <motion.div
                                        className="w-full h-1 bg-[var(--terracotta)] shadow-[0_0_20px_var(--terracotta)]"
                                        animate={{ y: [-40, 40, -40] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 text-center font-mono text-xs text-[var(--terracotta)] uppercase tracking-widest">
                                <p className="animate-pulse">Urban Logic Algorithm Active</p>
                                <p className="text-white/30 text-[10px]">Triangulating Geometry...</p>
                                <p className="text-white/30 text-[10px]">Calculating Load Vectors...</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DISCOVERY FORM + PHYSICS HUD + VISUAL SCAN */}
                    {step === 'discovery' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-5xl space-y-8"
                        >
                            {/* NEW: VISUAL CORTEX DISPLAY */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* SCAN VISUALIZATION */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                                    {images[0] && (
                                        <div className="relative">
                                            <img src={images[0]} alt="Scanned Context" className="w-full h-64 md:h-80 object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-[#0F0B09]/40 mix-blend-multiply" />

                                            {/* SCAN OVERLAYS */}
                                            {scanData && (
                                                <>
                                                    {scanData.corners.map((c: any, i: number) => (
                                                        <motion.div
                                                            key={`c-${i}`}
                                                            className="absolute w-6 h-6 border-2 border-[var(--terracotta)] flex items-center justify-center"
                                                            style={{ left: `${c.x}%`, top: `${c.y}%` }}
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: i * 0.2 }}
                                                        >
                                                            <div className="w-1 h-1 bg-[var(--terracotta)]" />
                                                            <div className="absolute -top-4 -left-4 text-[8px] font-mono text-[var(--terracotta)] bg-black/50 px-1 rounded whitespace-nowrap">
                                                                NODE.{i}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                    {scanData.anomalies.map((a: any, i: number) => (
                                                        <motion.div
                                                            key={`a-${i}`}
                                                            className="absolute w-8 h-8 flex items-center justify-center animate-pulse"
                                                            style={{ left: `${a.x}%`, top: `${a.y}%` }}
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                        >
                                                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10">
                                        <p className="text-[9px] font-mono text-[var(--terracotta)] uppercase tracking-wider animate-pulse">● Live Cortex Feed</p>
                                    </div>
                                </div>

                                {/* DATA & FORM */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#B0A8A2] border-b border-white/10 pb-2">Diagnostic Data</h4>

                                    {/* HUD STATS */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {visualContext.split('\n').filter(l => l.includes(':')).slice(0, 4).map((line, i) => {
                                            const [label, val] = line.replace('- ', '').split(':');
                                            return (
                                                <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
                                                    <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">{label}</span>
                                                    <span className="text-[var(--terracotta)] font-mono font-bold text-xs">{val}</span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* CORE QUESTIONS */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        {questions.map((q) => (
                                            <div key={q.id} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{q.question}</label>
                                                <input
                                                    type="text"
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                                    placeholder={q.placeholder}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--terracotta)]/50 focus:bg-white/10 transition-all font-light"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2"> {/* Additional Inputs moved to keep layout clean */}
                                <div className="space-y-2 mb-6">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Confirm Total Area (Sq.ft)</label>
                                    <input
                                        type="number"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="1000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--terracotta)]/50 focus:bg-white/10 transition-all font-light"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={submitDiscovery}
                                    className="w-full md:w-auto px-12 py-4 bg-[var(--terracotta)] text-white rounded-full font-bold hover:bg-[#a85638] transition-all shadow-lg hover:shadow-[var(--terracotta)]/20 active:scale-95 text-xs tracking-[0.2em] uppercase border border-white/10"
                                >
                                    Synthesize Master Plan
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REPORT - PREMIUM */}
                    {step === 'report' && report && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-[#EBE5D9] text-[#1a1512] rounded-2xl overflow-hidden shadow-2xl max-h-[75vh] overflow-y-auto custom-scrollbar"
                        >
                            {/* Report Header */}
                            <div className="bg-[#1a1512] text-[#EBE5D9] p-6 md:p-10 text-center border-b border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--terracotta)] to-transparent opacity-50" />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--terracotta)] mb-4">Final Execution Directive</h3>
                                <p className="text-xl md:text-3xl font-serif leading-relaxed max-w-3xl mx-auto">
                                    "{report.strategicVision.replace('EXECUTION DIRECTIVE:', '')}"
                                </p>
                            </div>

                            <div className="p-6 md:p-12 space-y-12">

                                {/* Solutions Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Primary */}
                                    <div className="p-6 md:p-10 border border-[var(--ink)]/10 rounded-xl bg-white shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--terracotta)]" />
                                        <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">Computational Selection</h4>
                                        <h3 className="text-2xl md:text-3xl font-serif text-[var(--ink)] mb-3 group-hover:text-[var(--terracotta)] transition-colors">{report.primarySolution?.product}</h3>
                                        <p className="text-sm text-gray-600 mb-6 font-light leading-relaxed">{report.primarySolution?.reasoning}</p>
                                        <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase bg-gray-50 p-4 rounded border border-gray-100">
                                            <span className="text-gray-400">Methodology:</span>
                                            <span className="font-bold">{report.primarySolution?.method}</span>
                                        </div>
                                    </div>

                                    {/* Alternative */}
                                    <div className="p-6 md:p-10 border border-[var(--ink)]/80 rounded-xl bg-[#1a1512] text-[#EBE5D9] relative overflow-hidden shadow-2xl">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--terracotta)] rounded-full blur-[80px] opacity-20 pointer-events-none" />
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

                                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#EBE5D9]/40 mb-6">Alternative Protocol</h4>
                                        <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">{report.alternativeSolution?.product}</h3>
                                        <p className="text-sm text-white/70 mb-6 font-light leading-relaxed">{report.alternativeSolution?.reasoning}</p>
                                        <div className="inline-block px-3 py-1 border border-white/20 rounded text-[10px] uppercase tracking-widest text-[var(--terracotta)]">
                                            High Performance Branch
                                        </div>
                                    </div>
                                </div>

                                {/* Engineering & Finance split */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-[var(--ink)]/10">
                                    <div>
                                        <h4 className="font-serif text-xl border-b border-[var(--ink)]/10 pb-4 mb-6">Structural Integrity</h4>
                                        <ul className="space-y-4">
                                            {report.engineeringMastery?.keyChallenges?.map((c: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-[var(--ink)] font-light">
                                                    <span className="text-[var(--terracotta)] font-mono text-xs">0{i + 1}</span>
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-8 p-6 bg-[#F5F2EC] rounded border-l-2 border-[var(--terracotta)] relative">
                                            <span className="absolute -top-3 left-4 bg-[#F5F2EC] px-2 text-[9px] font-bold uppercase tracking-widest text-[var(--terracotta)]">Pro Tip</span>
                                            <p className="text-sm font-serif italic text-[var(--ink)] leading-relaxed">
                                                "{report.engineeringMastery?.proTip}"
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-serif text-xl border-b border-[var(--ink)]/10 pb-4 mb-6">Asset Valuation</h4>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-2">
                                                <span className="text-sm text-gray-500">Material Investment</span>
                                                <span className="font-mono font-bold text-lg text-[var(--terracotta)]">{report.financialForecasting?.materialInvestment || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-2">
                                                <span className="text-sm text-gray-500">Optmized Wastage</span>
                                                <span className="font-mono text-gray-600">{report.financialForecasting?.wastageBuffer || '0'}%</span>
                                            </div>
                                            <p className="mt-8 text-sm font-light text-gray-500 italic border border-gray-200 p-4 rounded bg-white">
                                                <span className="block text-[9px] uppercase tracking-wider mb-2 text-gray-400">ROI Insight</span>
                                                "{report.financialForecasting?.roiInsight}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-6 border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold rounded-lg group"
                                >
                                    Export Official Directive <span className="group-hover:translate-x-2 transition-transform inline-block ml-1">→</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
