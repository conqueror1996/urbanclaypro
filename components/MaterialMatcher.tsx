'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ShieldCheck, Sparkles, Wand2, ArrowRight, RefreshCw } from 'lucide-react';
import { analyzeProductImage } from '@/app/actions/analyze-product-image';
import { toast } from 'sonner';

interface AnalysisResult {
    suggestedName: string;
    tags: string[];
    dominantColor: string;
    confidence: number;
}

export default function MaterialMatcher() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onFileChange = useCallback((selectedFile: File) => {
        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Please upload an image file.');
            return;
        }
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
        setResult(null);
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) onFileChange(droppedFile);
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setIsAnalyzing(false);
    };

    const runAnalysis = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const data = await analyzeProductImage(formData);
            setResult(data);
            toast.success('Analysis complete!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to analyze the material.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] border border-[var(--line)] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="grid md:grid-cols-2 min-h-[500px]">
                    
                    {/* --- LEFT: UPLOAD ZONE --- */}
                    <div 
                        className={`relative group p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--line)] transition-colors duration-500 ${isDragging ? 'bg-[var(--terracotta)]/5' : 'bg-[#faf9f8]'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <AnimatePresence mode="wait">
                            {!preview ? (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center"
                                >
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-[var(--terracotta)] group-hover:scale-110 transition-transform duration-500 border border-[var(--line)]">
                                        <Upload size={32} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="text-xl font-serif font-bold text-[var(--ink)] mb-3">Upload Reference</h4>
                                    <p className="text-gray-500 text-sm max-w-[200px] mx-auto leading-relaxed mb-8">
                                        Drag an image from your site visit or mood board.
                                    </p>
                                    
                                    <label className="cursor-pointer inline-flex items-center gap-2 bg-[var(--ink)] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--terracotta)] transition-colors shadow-md">
                                        Select Image
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])} />
                                    </label>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative w-full h-full flex flex-col"
                                >
                                    <div className="relative aspect-square md:aspect-auto md:flex-1 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={preview} alt="Material Preview" className="w-full h-full object-cover" />
                                        <button 
                                            onClick={handleReset}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[var(--ink)] hover:bg-white transition-colors shadow-lg"
                                        >
                                            <X size={18} />
                                        </button>
                                        
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <RefreshCw className="w-10 h-10 text-white animate-spin-slow" />
                                                    <p className="text-white text-xs font-bold uppercase tracking-widest">AI Syncing...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {!result && !isAnalyzing && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={runAnalysis}
                                            className="mt-6 w-full py-4 bg-[var(--terracotta)] text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl"
                                        >
                                            <Wand2 size={16} />
                                            Analyze Material
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- RIGHT: ANALYSIS PANEL --- */}
                    <div className="p-10 flex flex-col bg-white">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-[var(--terracotta)]/10 flex items-center justify-center text-[var(--terracotta)]">
                                <Sparkles size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">GenAI Studio</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col flex-1"
                                >
                                    <div className="mb-8">
                                        <span className="text-[var(--terracotta)] text-xs font-bold uppercase tracking-wider mb-2 block">Match Found</span>
                                        <h3 className="text-4xl md:text-5xl font-serif text-[var(--ink)] leading-tight mb-4">
                                            {result.suggestedName}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="p-4 rounded-2xl bg-[#faf9f8] border border-[var(--line)]">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Dominant</span>
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full border border-white shadow-sm" 
                                                    style={{ backgroundColor: result.dominantColor }}
                                                />
                                                <span className="text-sm font-mono font-medium text-[var(--ink)]">{result.dominantColor.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-[#faf9f8] border border-[var(--line)]">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Confidence</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-serif text-[var(--ink)]">{(result.confidence * 100).toFixed(0)}</span>
                                                <span className="text-sm text-gray-400">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-3">
                                        <motion.button 
                                            whileHover={{ x: 5 }}
                                            className="w-full p-4 rounded-xl border border-[var(--ink)] text-[var(--ink)] font-bold uppercase tracking-widest text-[10px] flex items-center justify-between group"
                                        >
                                            Request Sample Kit
                                            <ArrowRight size={14} className="group-hover:text-[var(--terracotta)] transition-colors" />
                                        </motion.button>
                                        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-2">
                                            <ShieldCheck size={12} className="text-green-500" />
                                            Matched against 2025 Architectural Library
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col justify-center text-center md:text-left"
                                >
                                    <h3 className="text-2xl md:text-3xl font-serif text-[var(--ink)] mb-6 leading-tight">
                                        Bring your vision <br /> to <span className="italic">Reality</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm">
                                        Our vision-recognition engine analyzes your references against our bespoke kiln-fired palette to find the perfect architectural match.
                                    </p>
                                    
                                    <ul className="space-y-4">
                                        {['Automatic color extraction', 'Architectural branding suggestions', 'Instant technical matching'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {/* --- ADOBE STYLE PROGRESS BAR (Optional) --- */}
            <div className="mt-8 flex justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--ink)]/20">
                <span className={!file ? 'text-[var(--terracotta)]' : ''}>01 Upload</span>
                <span className="mx-2">/</span>
                <span className={file && !result ? 'text-[var(--terracotta)]' : ''}>02 Analyze</span>
                <span className="mx-2">/</span>
                <span className={result ? 'text-[var(--terracotta)]' : ''}>03 Match</span>
            </div>
        </div>
    );
}

