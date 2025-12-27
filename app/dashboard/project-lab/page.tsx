'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyzeProject } from '@/app/actions/project-lab-ai';
import { Download, FileText, Settings, Shield, Clock } from 'lucide-react';

interface AIResponse {
    architecturalLogic: string;
    engineeringGuidance: string;
    procurementDetail: { item: string; quantity: string; specification: string }[];
    installationRoadmap: { step: string; details: string; duration: string }[];
    completionTimeline: {
        manufacturing: string;
        logistics: string;
        onsiteExecution: string;
        totalEstimatedDays: number;
    };
    preciseCostBreakdown: {
        materialCost: number;
        structuralAdditives: number;
        wastageBuffer: number;
        logisticsEstimate: number;
        totalPreciseCost: number;
    };
    dynamicSuggestions: string[];
    clientConsultationQuestions: { question: string; reason: string }[];
}

export default function ProjectLab() {
    const [file, setFile] = useState<File | null>(null);
    const [dimensions, setDimensions] = useState({ length: '', width: '', height: '', area: '' });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AIResponse | null>(null);
    const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const runAnalysis = async () => {
        if (!dimensions.area) {
            alert('Please provide coverage area.');
            return;
        }

        setIsAnalyzing(true);

        try {
            const response = await AnalyzeProject({
                area: parseFloat(dimensions.area),
                complexity,
                fileMetadata: file ? {
                    name: file.name,
                    size: file.size,
                    type: file.type
                } : undefined
            });

            if (response.success && response.data) {
                setResult(response.data);
            } else {
                alert('Analysis failed. Please check your connection.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[var(--terracotta)]/10 text-[var(--terracotta)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">v4.0 Expert Edition</span>
                    </div>
                    <h1 className="text-5xl font-serif text-[var(--ink)]">Project Lab <span className="text-[var(--terracotta)]">AI</span></h1>
                    <p className="text-gray-500 max-w-xl">Intelligent execution engineering for luxury terracotta projects. Upload technical data to generate precise costings and architectural roadmaps.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[var(--terracotta)] transition-all">
                        <Settings className="w-4 h-4" />
                        Configure Logic
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Panel: Inputs (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 sticky top-8">
                        <h3 className="text-lg font-bold mb-6 text-[var(--ink)] flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[var(--terracotta)]" />
                            Technical Parameters
                        </h3>

                        <div className="space-y-6">
                            {/* File Upload Area */}
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={handleUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    accept=".obj,.stl,.skp,.step,.3ds,.pdf"
                                />
                                <div className={`
                                    border-2 border-dashed rounded-2xl p-8 text-center transition-all
                                    ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 group-hover:border-[var(--terracotta)] group-hover:bg-orange-50/20'}
                                `}>
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                        {file ? <FileText className="text-emerald-500" /> : <Download className="text-gray-400 rotate-180" />}
                                    </div>
                                    <p className="text-sm font-bold text-[var(--ink)]">{file ? file.name : 'Upload Technical File'}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">.OBJ, .STL, .PDF (CAD Blocks)</p>
                                </div>
                            </div>

                            {/* Complexity Selector */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-2 block">Project Complexity</label>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-xl">
                                    {['low', 'medium', 'high'].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setComplexity(c as any)}
                                            className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${complexity === c ? 'bg-white shadow-sm text-[var(--terracotta)]' : 'text-gray-400'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-2 block">Coverage Area (SQFT)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Enter area..."
                                            value={dimensions.area}
                                            onChange={e => setDimensions({ ...dimensions, area: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-lg font-bold text-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">sq.ft</span>
                                    </div>
                                </div>

                                <button
                                    onClick={runAnalysis}
                                    disabled={isAnalyzing}
                                    className="group w-full bg-[var(--ink)] text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-[var(--terracotta)] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Engineering Analysis...
                                        </>
                                    ) : (
                                        <>
                                            Generate Technical Report
                                            <Settings className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Output (8 cols) */}
                <div className="lg:col-span-8">
                    {!result && !isAnalyzing && (
                        <div className="h-[600px] bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl mb-6 relative">
                                🧠
                                <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-100 animate-[spin_20s_linear_infinite]"></div>
                            </div>
                            <h4 className="text-2xl font-serif text-[var(--ink)] mb-4 italic">&quot;Awaiting technical parameters...&quot;</h4>
                            <p className="text-sm text-gray-400 max-w-sm mt-2">
                                Please provide your project dimensions and technical drawings. Our AI will act as your **Lead Engineer** to calculate precise costs and execution steps.
                            </p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="h-[600px] bg-white rounded-[3rem] border border-gray-100 p-12 flex flex-col items-center justify-center space-y-8 text-center">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[var(--terracotta)] animate-pulse">UC</div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-serif text-[var(--ink)]">Simulating Architectural Logic</h4>
                                <p className="text-sm text-gray-400 max-w-md mx-auto">Cross-referencing geometric patterns against our structural knowledge base and live material inventory...</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-225"></div>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {result && !isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Results Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cost Breakdown */}
                                    <div className="bg-[var(--ink)] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden md:col-span-2">
                                        <div className="absolute top-0 right-0 p-8">
                                            <Shield className="w-12 h-12 text-white/10" />
                                        </div>
                                        <h4 className="text-xs font-bold text-[var(--sand)] uppercase tracking-[0.2em] mb-8">Precise Financial Report</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                            <div>
                                                <div className="text-white/40 text-[10px] font-bold uppercase mb-1">Materials</div>
                                                <div className="text-2xl font-serif">₹{result.preciseCostBreakdown.materialCost.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/40 text-[10px] font-bold uppercase mb-1">Structural Additives</div>
                                                <div className="text-2xl font-serif">₹{result.preciseCostBreakdown.structuralAdditives.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/40 text-[10px] font-bold uppercase mb-1">Wastage (Buffer)</div>
                                                <div className="text-2xl font-serif">₹{result.preciseCostBreakdown.wastageBuffer.toLocaleString()}</div>
                                            </div>
                                            <div className="border-l border-white/10 pl-8">
                                                <div className="text-[var(--terracotta)] text-[10px] font-bold uppercase mb-1">Total Precise Cost</div>
                                                <div className="text-3xl font-serif text-[var(--sand)]">₹{result.preciseCostBreakdown.totalPreciseCost.toLocaleString()}*</div>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-white/30 mt-8">*Estimate valid for 15 days. Includes current factory lot prices and logistics baseline.</p>
                                    </div>

                                    {/* Expert Analysis Duo */}
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
                                        <h4 className="text-xs font-bold text-[var(--terracotta)] uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Completion Strategy
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                                <span className="text-xs text-gray-400">Total Duration</span>
                                                <span className="text-sm font-bold text-[var(--ink)]">{result.completionTimeline.totalEstimatedDays} Days</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-[10px] uppercase font-bold text-gray-300">Manufacturing</span>
                                                    <span className="text-xs text-gray-600 text-right">{result.completionTimeline.manufacturing}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-[10px] uppercase font-bold text-gray-300">Logistics</span>
                                                    <span className="text-xs text-gray-600 text-right">{result.completionTimeline.logistics}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-[10px] uppercase font-bold text-gray-300">Execution</span>
                                                    <span className="text-xs text-gray-600 text-right">{result.completionTimeline.onsiteExecution}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50/30 p-8 rounded-[2.5rem] border border-[var(--terracotta)]/10 shadow-xl">
                                        <h4 className="text-xs font-bold text-[var(--terracotta)] uppercase tracking-widest mb-4">Lead Architect Logic</h4>
                                        <p className="text-sm text-[var(--ink)] italic leading-relaxed">
                                            &quot;{result.architecturalLogic}&quot;
                                        </p>
                                    </div>

                                    {/* Detailed Roadmap */}
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl md:col-span-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Expert Engineering Roadmap</h4>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6 border-r border-gray-50 pr-8">
                                                <h5 className="text-[10px] font-bold uppercase text-[var(--terracotta)]">Structural Guidance</h5>
                                                <p className="text-sm text-gray-600 leading-relaxed">{result.engineeringGuidance}</p>

                                                <h5 className="text-[10px] font-bold uppercase text-[var(--terracotta)] mt-8">Dynamic Suggestions</h5>
                                                <ul className="space-y-3">
                                                    {result.dynamicSuggestions.map((s, i) => (
                                                        <li key={i} className="text-sm text-[var(--ink)] flex gap-3 items-start">
                                                            <span className="text-emerald-500 font-bold">✨</span> {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="text-[10px] font-bold uppercase text-[var(--terracotta)]">Installation Sequence</h5>
                                                {result.installationRoadmap.map((step, i) => (
                                                    <div key={i} className="bg-gray-50/50 p-4 rounded-2xl flex gap-4">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-[10px] text-[var(--terracotta)] shadow-sm">
                                                            0{i + 1}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-[var(--ink)] mb-1 flex justify-between">
                                                                {step.step}
                                                                <span className="text-[9px] text-[var(--terracotta)] uppercase">{step.duration}</span>
                                                            </div>
                                                            <div className="text-[11px] text-gray-500">{step.details}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Client Discovery Checklist */}
                                <div className="bg-[var(--sand)]/20 p-8 rounded-[2.5rem] border border-[var(--sand)] md:col-span-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-[var(--ink)] uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-5 h-5 bg-[var(--terracotta)] text-white rounded-full flex items-center justify-center text-[10px]">?</span>
                                                Client Discovery Checklist
                                            </h4>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Recommended questions to ask your project client</p>
                                        </div>
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] hover:underline border border-[var(--terracotta)]/20 px-3 py-1 rounded-lg">Copy All</button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {result.clientConsultationQuestions.map((item, i) => (
                                            <div key={i} className="bg-white/60 p-5 rounded-2xl border border-white/80 hover:border-[var(--terracotta)]/30 transition-all group">
                                                <div className="text-xs font-bold text-[var(--ink)] mb-1 group-hover:text-[var(--terracotta)] transition-colors">
                                                    {item.question}
                                                </div>
                                                <div className="text-[10px] text-gray-400 italic">
                                                    Rationale: {item.reason}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-center gap-6 pt-4 md:col-span-2">
                                    <button className="flex items-center gap-2 px-10 py-5 bg-[var(--terracotta)] text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-orange-900/20 hover:-translate-y-1 transition-all">
                                        <Download className="w-5 h-5" />
                                        Download Detailed Report (PDF)
                                    </button>
                                    <button className="flex items-center gap-2 px-10 py-5 bg-white border border-gray-200 text-[var(--ink)] rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                                        Talk to Structural Engineer
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
