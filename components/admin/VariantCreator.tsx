'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImage } from '@/utils/analyze-image';
import Image from 'next/image';


interface VariantCreatorProps {
    onClose: () => void;
    onSave: (data: { name: string; family?: string; files: File[] }) => Promise<void>;
}

export default function VariantCreator({ onClose, onSave }: VariantCreatorProps) {
    const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [name, setName] = useState('');
    const [family, setFamily] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);

            // Use first image for preview/analysis
            const mainFile = selectedFiles[0];
            setPreviewUrl(URL.createObjectURL(mainFile));
            setStep('analyzing');

            // Trigger AI on main image
            try {
                const result = await analyzeImage(mainFile);
                setAnalysis(result);
                setName(result.suggestedName);
                setStep('review');
            } catch (err) {
                console.error(err);
                setStep('review'); // Fallback
            }
        }
    };

    const handleConfirm = async () => {
        if (files.length === 0 || !name) return;
        setIsSaving(true);
        try {
            await onSave({ name, family, files });
            onClose();
        } catch (e) {
            alert('Failed to save');
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1512]/60 backdrop-blur-md p-4 transition-all duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }} // Add exit animation support if wrapped in AnimatePresence
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Progress Bar (Optional Visual) */}
                <div className="h-1.5 bg-gray-100 w-full">
                    <motion.div
                        className="h-full bg-[var(--terracotta)]"
                        initial={{ width: '0%' }}
                        animate={{
                            width: step === 'upload' ? '33%' : step === 'analyzing' ? '66%' : '100%'
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="p-8 md:p-10">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: UPLOAD */}
                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif font-bold text-[#2A1E16]">New Variant</h3>
                                    <p className="text-sm text-gray-500">Upload high-res images to generate a new product variant.</p>
                                </div>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-3xl p-12 cursor-pointer hover:border-[var(--terracotta)] hover:bg-[#FAF8F6] transition-all group relative overflow-hidden"
                                >
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ring-1 ring-gray-100">
                                        <svg className="w-8 h-8 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <p className="font-bold text-[#2A1E16] text-lg">Drop image here</p>
                                    <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider">or click to browse</p>

                                    {/* Decoration */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <input ref={fileInputRef} type="file" hidden accept="image/*" multiple onChange={handleFileSelect} />
                            </motion.div>
                        )}

                        {/* STEP 2: ANALYZING */}
                        {step === 'analyzing' && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                                className="py-12 text-center flex flex-col items-center justify-center min-h-[300px]"
                            >
                                <div className="relative w-32 h-32 mb-8">
                                    {/* Pulsing Rings */}
                                    <div className="absolute inset-0 rounded-full border border-[var(--terracotta)]/20 animate-ping" />
                                    <div className="absolute inset-0 rounded-full border border-[var(--terracotta)]/40 animate-pulse" />

                                    {/* Image Preview with Spin */}
                                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-lg animate-[spin_10s_linear_infinite]">
                                        {previewUrl && <Image src={previewUrl} alt="Preview" fill className="object-cover" />}
                                    </div>

                                    {/* AI Badge */}
                                    <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                                        <span className="bg-[#2A1E16] text-white text-[10px] font-bold px-2 py-1 rounded-full px-3 shadow-lg">AI SCAN</span>
                                    </div>
                                </div>

                                <h4 className="text-xl font-serif font-bold text-[#2A1E16] mb-2">Analyzing Texture...</h4>
                                <p className="text-sm text-gray-500">Extracting colors and material properties</p>
                            </motion.div>
                        )}

                        {/* STEP 3: REVIEW */}
                        {step === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex gap-6 items-start">
                                    <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 shadow-lg border border-gray-100 group">
                                        {previewUrl && <Image src={previewUrl} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    <div className="flex-1 space-y-4 pt-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                AI Identified
                                            </span>
                                            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                                {Math.round((analysis?.confidence || 0) * 100)}% Match
                                            </span>
                                        </div>

                                        <div className="p-4 bg-[#FAF8F6] rounded-xl border border-[#EBE5E0]">
                                            <p className="text-[10px] text-[#9C8C74] uppercase tracking-widest font-bold mb-2">Dominant Tone</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5 ring-2 ring-white" style={{ backgroundColor: analysis?.dominantColor || '#ccc' }} />
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-[#2A1E16] block">{analysis?.dominantColor}</span>
                                                    <span className="text-[10px] text-gray-400">Hex Code</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Variant Name</label>
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] focus:ring-4 focus:ring-[var(--terracotta)]/10 font-medium text-[#1a1512] transition-all placeholder:text-gray-300"
                                            placeholder="e.g. Classic Red"
                                        />
                                        <p className="text-[10px] text-gray-400 px-2 flex gap-1 items-center">
                                            <svg className="w-3 h-3 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            Suggested: <span className="font-bold text-[var(--terracotta)]">{analysis?.tags?.join(', ')}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Family Group (Optional)</label>
                                        <input
                                            value={family}
                                            onChange={e => setFamily(e.target.value)}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] focus:ring-4 focus:ring-[var(--terracotta)]/10 font-medium text-[#1a1512] transition-all placeholder:text-gray-300"
                                            placeholder="e.g. Red Series"
                                        />
                                    </div>

                                    {files.length > 1 && (
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-100">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                                                +{files.length - 1}
                                            </span>
                                            Additional gallery images selected.
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={isSaving}
                                    className="w-full py-4 bg-[#2A1E16] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-[#4a3e36] disabled:opacity-50 transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Confirm & Add Variant
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
