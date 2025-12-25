'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIResponse {
    procurement: string[];
    installation: string[];
    logic: string;
    estimatedCost: string;
}

export default function ProjectLab() {
    const [file, setFile] = useState<File | null>(null);
    const [dimensions, setDimensions] = useState({ length: '', width: '', height: '', area: '' });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AIResponse | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const runAnalysis = () => {
        if (!file || !dimensions.area) {
            alert('Please provide 3D file and coverage area.');
            return;
        }

        setIsAnalyzing(true);

        // Simulate AI Logic Processing
        setTimeout(() => {
            setResult({
                procurement: [
                    "Sourcing Terracotta Cladding from North-East Region (Lot #402)",
                    "Procuring structural grade adhesive (Sika or equivalent)",
                    "Custom CNC trimming based on 3D geometry provided",
                    "Logistic lead time: 14 days"
                ],
                installation: [
                    "Surface Priming: Ensure wall moisture is below 5%",
                    "Grid Layout: Marker line at every 450mm interval",
                    "Cladding Application: Bottom-up approach with 10mm spacers",
                    "Grouting: Match substrate tone for monolithic finish"
                ],
                logic: "The geometry of your 3D model suggests a high wind-load zone. We recommend a mechanical fixing system in addition to adhesives. Your coverage area of " + dimensions.area + " sqft will require 5% wastage buffer for corner cuts.",
                estimatedCost: "₹" + (parseInt(dimensions.area) * 240).toLocaleString() + " (Estimate)"
            });
            setIsAnalyzing(false);
        }, 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-serif text-[var(--ink)]">Project Lab <span className="text-[var(--terracotta)]">AI</span></h1>
                <p className="text-gray-500">Upload technical data and let our AI engineer its execution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
                        <h3 className="text-lg font-bold mb-6 text-[var(--ink)]">Technical Input</h3>

                        <div className="space-y-4">
                            {/* File Upload Area */}
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={handleUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    accept=".obj,.stl,.skp,.step,.3ds"
                                />
                                <div className={`
                                    border-2 border-dashed rounded-2xl p-8 text-center transition-all
                                    ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 group-hover:border-[var(--terracotta)] group-hover:bg-orange-50/20'}
                                `}>
                                    <div className="text-3xl mb-2">{file ? '📂' : '⏫'}</div>
                                    <p className="text-sm font-medium text-gray-600">{file ? file.name : 'Upload 3D/CAD File'}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">.OBJ, .STL, .SKP supported</p>
                                </div>
                            </div>

                            {/* Dimensions Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Width (m)</label>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={dimensions.width}
                                        onChange={e => setDimensions({ ...dimensions, width: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Height (m)</label>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={dimensions.height}
                                        onChange={e => setDimensions({ ...dimensions, height: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Total Area (sqft)</label>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={dimensions.area}
                                        onChange={e => setDimensions({ ...dimensions, area: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="w-full bg-[var(--ink)] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[var(--terracotta)] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Neural Processing...' : 'Run Technical Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Output Panel */}
                <div className="relative">
                    {!result && !isAnalyzing && (
                        <div className="h-full bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center opacity-50">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">🧠</div>
                            <h4 className="text-lg font-serif italic">Awaiting technical parameters...</h4>
                            <p className="text-sm text-gray-400 mt-2">Upload your blueprint to generate an execution strategy.</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="h-full bg-white rounded-[2.5rem] border border-gray-100 p-12 flex flex-col items-center justify-center space-y-6">
                            <div className="w-16 h-16 border-4 border-[var(--sand)] border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h4 className="font-bold text-[var(--ink)]">Analyzing 3D Geometry</h4>
                                <p className="text-xs text-gray-400 animate-pulse">Calculating load factors and material yield...</p>
                            </div>
                        </div>
                    )}

                    {result && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl space-y-8"
                        >
                            <div>
                                <h4 className="text-xs font-bold text-[var(--terracotta)] uppercase tracking-[0.2em] mb-4">Architectural Logic</h4>
                                <p className="text-[var(--ink)] leading-relaxed italic text-sm border-l-4 border-[var(--sand)] pl-4">
                                    &quot;{result.logic}&quot;
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                        Procurement Strategy
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.procurement.map((item, i) => (
                                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                <span className="text-[10px] mt-0.5">🔹</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                        Installation Roadmap
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.installation.map((item, i) => (
                                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                <span className="text-[10px] mt-0.5">✅</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-6 border-t flex justify-between items-center">
                                <span className="text-2xl font-serif text-[var(--ink)]">{result.estimatedCost}</span>
                                <button className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] hover:underline">Download Report PDF</button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* AI Assistant Context */}
            <div className="bg-[var(--ink)] text-white p-10 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-[var(--terracotta)]/10 transition-colors" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">🤖</div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2">How this logic works?</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Our AI Cross-references your 3D geometry with our **Structural Knowledge Base**. It analyzes material wastage based on patterns, recommends the most efficient procurement route from our manufacturers, and suggests installation steps tailored to your specific project dimensions.
                        </p>
                    </div>
                    <button className="bg-white text-[var(--ink)] px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--sand)] transition-colors whitespace-nowrap">
                        Talk to Expert
                    </button>
                </div>
            </div>
        </div>
    );
}
