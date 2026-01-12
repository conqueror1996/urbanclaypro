'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IdentifyAndAsk, AnalyzeProject } from '@/app/actions/project-lab-ai';

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
            const result = await AnalyzeProject({
                images: images,
                location: location,
                area: Number(area) || 1000,
                userAnswers: answers,
                complexity: 'medium'
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
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] border border-[var(--line)] relative">

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <div
                    className="h-full bg-[var(--terracotta)] transition-all duration-1000"
                    style={{ width: step === 'upload' ? '10%' : step === 'analyzing_visual' ? '40%' : step === 'discovery' ? '60%' : '100%' }}
                />
            </div>

            <div className="p-8 md:p-12 h-full flex flex-col">

                {/* HEADERS */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-serif text-[var(--ink)] mb-2">
                        {step === 'upload' && "Upload Your Site / Inspiration"}
                        {step === 'analyzing_visual' && "Analyzing Structure..."}
                        {step === 'discovery' && "Discovery Phase"}
                        {step === 'analyzing_final' && "Generating Solutions..."}
                        {step === 'report' && "Project Feasibility Report"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {step === 'upload' && "Our AI will identify the architectural context and material needs."}
                        {step === 'analyzing_visual' && "Scanning for patterns, lighting conditions, and scale..."}
                        {step === 'discovery' && "Based on your image, we need to clarify a few details."}
                    </p>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center text-sm font-medium">
                        {error}
                        <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
                    </div>
                )}

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">

                    {/* STEP 1: UPLOAD */}
                    {step === 'upload' && (
                        <div className="w-full max-w-md space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Project Location (City)</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Hyderabad"
                                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[var(--terracotta)] outline-none"
                                />
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50 hover:border-[var(--terracotta)] transition-all group"
                            >
                                <div className="w-16 h-16 bg-[var(--terracotta)]/10 text-[var(--terracotta)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="font-bold text-gray-700">Click to Upload Site Photo</h3>
                                <p className="text-xs text-gray-400 mt-2">JPG, PNG (Max 5MB)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* LOADING STATE - VISUAL */}
                    {(step === 'analyzing_visual' || step === 'analyzing_final') && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 border-4 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin mb-6" />
                            <p className="text-[var(--ink)]/60 text-sm animate-pulse">Running Neural Networks...</p>
                        </div>
                    )}

                    {/* STEP 2: DISCOVERY FORM */}
                    {step === 'discovery' && (
                        <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            {/* Visual Context Found */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                                <span className="text-xl">👀</span>
                                <div>
                                    <span className="font-bold block mb-1">AI Observation:</span>
                                    {visualContext}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Approx. Area (Sq.ft)</label>
                                    <input
                                        type="number"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="1000"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[var(--terracotta)] outline-none"
                                    />
                                </div>
                                {questions.map((q) => (
                                    <div key={q.id} className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{q.question}</label>
                                        <input
                                            type="text"
                                            value={answers[q.id] || ''}
                                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                            placeholder={q.placeholder}
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[var(--terracotta)] outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={submitDiscovery}
                                className="w-full py-4 bg-[var(--ink)] text-white rounded-xl font-bold hover:bg-[var(--terracotta)] transition-colors shadow-lg"
                            >
                                Generate Full Report
                            </button>
                        </div>
                    )}

                    {/* STEP 3: REPORT */}
                    {step === 'report' && report && (
                        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">

                            {/* 1. Strategic Vision */}
                            <section className="text-center">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--terracotta)] mb-4">Strategic Vision</h3>
                                <p className="text-xl md:text-2xl font-serif text-[var(--ink)] leading-relaxed">
                                    "{report.strategicVision}"
                                </p>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* 2. Primary Solution */}
                                <div className="bg-[#FAF7F3] p-6 rounded-2xl border border-[var(--terracotta)]/20">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-[var(--terracotta)]"></div>
                                        <h3 className="font-bold text-lg">Primary Recommendation</h3>
                                    </div>
                                    <p className="text-2xl font-serif mb-2">{report.primarySolution?.product}</p>
                                    <p className="text-sm text-gray-600 mb-4">{report.primarySolution?.reasoning}</p>
                                    <div className="text-xs font-mono bg-white p-3 rounded-lg border border-gray-200">
                                        <strong>Method:</strong> {report.primarySolution?.method}
                                    </div>
                                </div>

                                {/* 3. Alternative Solution */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                        <h3 className="font-bold text-lg text-gray-600">The Alternative</h3>
                                    </div>
                                    <p className="text-2xl font-serif mb-2">{report.alternativeSolution?.product}</p>
                                    <p className="text-sm text-gray-600 mb-4">{report.alternativeSolution?.reasoning}</p>
                                </div>
                            </div>

                            {/* 4. Engineering & Costs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-4">Engineering Notes</h4>
                                    <ul className="space-y-3">
                                        {report.engineeringMastery?.keyChallenges?.map((c: string, i: number) => (
                                            <li key={i} className="flex gap-2 text-sm text-[var(--ink)]">
                                                <span className="text-[var(--terracotta)]">⚠</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 bg-orange-50 p-3 rounded-lg text-xs text-orange-800 border border-orange-100">
                                        <strong>Pro Tip:</strong> {report.engineeringMastery?.proTip}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-400 mb-4">Financial Estimates</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span>Material Investment</span>
                                            <span className="font-mono">{report.financialForecasting?.materialInvestment || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span>Buffer (Wastage)</span>
                                            <span className="font-mono">{report.financialForecasting?.wastageBuffer || '0'}%</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs italic text-gray-500">"{report.financialForecasting?.roiInsight}"</p>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full py-4 border border-[var(--ink)] text-[var(--ink)] rounded-xl font-bold hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs"
                            >
                                Download PDF Report
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
