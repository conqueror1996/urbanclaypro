'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyzeProject, IdentifyAndAsk } from '@/app/actions/project-lab-ai';
import { createCRMLead } from '@/app/actions/crm';
import { Download, FileText, Settings, Shield, Clock, Plus, User, MapPin } from 'lucide-react';

interface AIResponse {
    strategicVision: string;
    primarySolution: {
        product: string;
        method: string;
        reasoning: string;
        quantity: string;
    };
    alternativeSolution: {
        product: string;
        method: string;
        reasoning: string;
    };
    engineeringMastery: {
        structuralLogic: string;
        keyChallenges: string[];
        proTip: string;
    };
    stepByStepExecution: {
        phase: string;
        whatToDo: string;
        whyItMatters: string;
        estimatedDays: number;
    }[];
    financialForecasting: {
        materialInvestment: number;
        ancillaryCosts: number;
        wastageBuffer: number;
        roiInsight: string;
    };
    visualObservation: string;
}

interface DiscoveryData {
    identifiedProducts: string[];
    visualContext: string;
    discoveryQuestions: { id: string; question: string; placeholder: string }[];
}

export default function ProjectLab() {
    const [files, setFiles] = useState<{ product?: string; site?: string }>({});
    const [clientName, setClientName] = useState('');
    const [area, setArea] = useState('');
    const [location, setLocation] = useState('');
    const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');

    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'upload' | 'discovery' | 'results'>('upload');
    const [discovery, setDiscovery] = useState<DiscoveryData | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<AIResponse | null>(null);

    const handleFileUpload = async (type: 'product' | 'site', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFiles(prev => ({ ...prev, [type]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const runDiscovery = async () => {
        if (!files.product && !files.site) {
            alert('Please upload at least one photo (Product or Site).');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await IdentifyAndAsk({
                images: Object.values(files).filter(Boolean) as string[],
                location,
            });

            if (response.success && response.data) {
                setDiscovery(response.data);
                setStep('discovery');
            } else {
                alert('Identification failed. Proceeding with manual input.');
                setDiscovery({
                    identifiedProducts: ['Manual Identification'],
                    visualContext: 'Awaiting manual context',
                    discoveryQuestions: [
                        { id: 'app', question: 'Primary Application', placeholder: 'e.g. Facade, Flooring' },
                        { id: 'surface', question: 'Surface Type', placeholder: 'e.g. Concrete, Plasted Wall' }
                    ]
                });
                setStep('discovery');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const runAnalysis = async () => {
        if (!area) {
            alert('Please provide coverage area.');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await AnalyzeProject({
                area: parseFloat(area),
                complexity,
                location,
                images: Object.values(files).filter(Boolean) as string[],
                userAnswers: answers,
            });

            if (response.success && response.data) {
                setResult(response.data);
                setStep('results');
            } else {
                alert('Analysis failed. Please try again.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };
    const handleSaveStrategy = async () => {
        if (!result) {
            alert('Please run analysis first.');
            return;
        }
        if (!clientName) {
            alert('Please provide a Client Name.');
            return;
        }

        setIsProcessing(true);
        try {
            await createCRMLead({
                clientName,
                location,
                company: `Project Lab: ${result.primarySolution.product}`,
                requirements: `Area: ${area} sqft. ${result.primarySolution.product} using ${result.primarySolution.method}. ROI: ${result.financialForecasting.roiInsight}`,
                potentialValue: result.financialForecasting.materialInvestment + result.financialForecasting.ancillaryCosts + result.financialForecasting.wastageBuffer,
                stage: 'new',
                leadDate: new Date().toISOString().split('T')[0],
                leadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                notes: `AI Generated Strategy. Vision: ${result.strategicVision}`
            });
            alert('Strategy archived to CRM successfully.');
        } catch (e) {
            alert('Failed to save to CRM.');
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[var(--terracotta)] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-900/20">Veteran Edition v5.0</span>
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">Live Inventory Sync</span>
                    </div>
                    <h1 className="text-6xl font-serif text-[var(--ink)] tracking-tight">Project Lab <span className="text-[var(--terracotta)]">Pro</span></h1>
                    <p className="text-gray-500 max-w-2xl text-lg leading-relaxed font-light italic">
                        &quot;Show us your site. Show us the clay. We will engineer the legacy.&quot;
                    </p>
                </div>
                <div className="flex gap-4">
                    {step !== 'upload' && (
                        <button
                            onClick={() => { setStep('upload'); setResult(null); setDiscovery(null); }}
                            className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-[var(--terracotta)] transition-colors"
                        >
                            ← Start New Project
                        </button>
                    )}
                    <button
                        onClick={handleSaveStrategy}
                        disabled={!result || isProcessing}
                        className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all hover:shadow-md disabled:opacity-50"
                    >
                        <FileText className="w-4 h-4" />
                        {isProcessing ? 'Saving...' : 'Save Strategy to CRM'}
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 bg-[var(--ink)] text-white rounded-2xl text-sm font-bold shadow-xl hover:bg-[var(--terracotta)] transition-all hover:-translate-y-0.5">
                        <Settings className="w-4 h-4" />
                        Engineering Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Panel: Inputs (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-8">
                        <h3 className="text-xl font-bold mb-8 text-[var(--ink)] flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                <Settings className="w-5 h-5 text-[var(--terracotta)]" />
                            </div>
                            Project DNA
                        </h3>

                        <div className="space-y-8">
                            {/* Dual File Upload */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="relative group bg-gray-50/50 rounded-3xl p-6 border-2 border-dashed border-gray-100 hover:border-[var(--terracotta)] transition-all">
                                    <input type="file" onChange={(e) => handleFileUpload('product', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                                            {files.product ? <img src={files.product} className="w-full h-full object-cover" /> : <Plus className="text-gray-300 w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[var(--ink)]">Product Photo</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{files.product ? 'Image Detected' : 'Upload SKU/Style'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group bg-gray-50/50 rounded-3xl p-6 border-2 border-dashed border-gray-100 hover:border-[var(--terracotta)] transition-all">
                                    <input type="file" onChange={(e) => handleFileUpload('site', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                                            {files.site ? <img src={files.site} className="w-full h-full object-cover" /> : <Plus className="text-gray-300 w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[var(--ink)]">Site Photo</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{files.site ? 'Site Detected' : 'Installation Area'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Client Name, Location & Area */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Client Name / Context</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Individual or Firm name..."
                                            value={clientName}
                                            onChange={e => setClientName(e.target.value)}
                                            className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--ink)] focus:ring-4 focus:ring-[var(--terracotta)]/5 outline-none border transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block text-emerald-600">Site Location (Contextual)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="e.g. Mumbai, Delhi, Goa..."
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            className="w-full bg-emerald-50/50 border-emerald-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--ink)] focus:ring-4 focus:ring-emerald-500/5 outline-none border transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Execution Area</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Coverage area..."
                                            value={area}
                                            onChange={e => setArea(e.target.value)}
                                            className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-5 text-xl font-bold text-[var(--terracotta)] focus:ring-4 focus:ring-[var(--terracotta)]/5 outline-none border transition-all"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300 tracking-widest">SQ.FT</span>
                                    </div>
                                </div>

                                {step === 'upload' && (
                                    <button
                                        onClick={runDiscovery}
                                        disabled={isProcessing}
                                        className="group w-full bg-[var(--ink)] text-white py-6 rounded-[1.5rem] font-bold uppercase tracking-widest hover:bg-[var(--terracotta)] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 text-sm"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                Identifying Context...
                                            </>
                                        ) : (
                                            <>
                                                Initialize Analysis
                                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Dynamic Content */}
                <div className="lg:col-span-8">
                    {step === 'upload' && !isProcessing && (
                        <div className="h-[750px] bg-gray-50/30 rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center relative overflow-hidden">
                            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center text-6xl shadow-2xl mb-10 relative">
                                👴🏽
                                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[var(--terracotta)]/20 animate-[spin_30s_linear_infinite]"></div>
                            </div>
                            <h4 className="text-3xl font-serif text-[var(--ink)] mb-6 italic">&quot;Show me what you are building...&quot;</h4>
                            <p className="text-gray-400 max-w-md mt-2 leading-relaxed text-lg italic">
                                &quot;Upload a photo of your product SKU and the installation site. I will identify the patterns and measure the engineering needs.&quot;
                            </p>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="h-[750px] bg-white rounded-[4rem] border border-gray-100 p-20 flex flex-col items-center justify-center space-y-10 text-center shadow-xl">
                            <div className="w-32 h-32 border-[6px] border-gray-50 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                            <h4 className="text-3xl font-serif text-[var(--ink)]">Consulting Master Logic...</h4>
                            <p className="text-gray-400 max-w-lg mx-auto leading-relaxed italic">
                                &quot;Analyzing clay density, surface tension, and architectural symmetry targets...&quot;
                            </p>
                        </div>
                    )}

                    {step === 'discovery' && discovery && !isProcessing && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100">
                            <div className="flex gap-4 items-center mb-8 pb-8 border-b border-gray-100">
                                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest border border-emerald-100">
                                    Visual ID Success
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {discovery.identifiedProducts.map((p, i) => (
                                        <div key={i} className="px-3 py-1 bg-[var(--ink)] text-white text-[10px] font-bold rounded-lg border-2 border-white">{p}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-2xl font-serif text-[var(--ink)]">Critical Project Intelligence</h4>
                                <p className="text-gray-500 italic text-sm">Our AI observed: &quot;{discovery.visualContext}&quot;</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                    {discovery.discoveryQuestions.map((q) => (
                                        <div key={q.id} className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{q.question}</label>
                                            <input
                                                type="text"
                                                placeholder={q.placeholder}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--ink)] focus:ring-4 focus:ring-[var(--terracotta)]/5 outline-none"
                                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={runAnalysis}
                                    className="w-full mt-12 py-6 bg-[var(--terracotta)] text-white rounded-[2rem] font-bold uppercase tracking-widest shadow-2xl shadow-orange-900/40 hover:-translate-y-1 transition-all"
                                >
                                    Generate Final Solution →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'results' && result && !isProcessing && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                            {/* Strategic Vision Section */}
                            <div className="bg-[var(--terracotta)] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Shield className="w-24 h-24 rotate-12" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-4">Master Consultant&apos;s Strategic Vision</h4>
                                    <p className="text-3xl font-serif italic leading-snug">
                                        &quot;{result.strategicVision}&quot;
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-white/10 text-xs font-light text-white/60 italic">
                                        Visual Measurement Note: {result.visualObservation}
                                    </div>
                                </div>
                            </div>

                            {/* Main Results Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Solutions */}
                                <div className="bg-white p-10 rounded-[3rem] border-2 border-[var(--terracotta)] shadow-xl relative overflow-hidden">
                                    <div className="absolute top-4 right-6 bg-[var(--terracotta)] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Primary Choice</div>
                                    <h4 className="text-[10px] font-black text-[var(--terracotta)] uppercase tracking-[0.3em] mb-8">Selected Material Path</h4>
                                    <div className="space-y-6">
                                        <div className="text-2xl font-serif text-[var(--ink)] leading-tight">{result.primarySolution.product}</div>
                                        <div className="text-sm font-black text-[var(--terracotta)] uppercase tracking-widest">{result.primarySolution.method}</div>
                                        <p className="text-xs text-gray-500 leading-relaxed italic">&quot;{result.primarySolution.reasoning}&quot;</p>
                                        <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                                            <span className="text-[9px] uppercase font-bold text-gray-400">Esc. Quantity</span>
                                            <span className="text-sm font-bold text-[var(--terracotta)]">{result.primarySolution.quantity}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                                    <h4 className="text-[10px] font-black text-gray-300 uppercase mb-8">Strategic Alternative</h4>
                                    <div className="space-y-4">
                                        <div className="text-2xl font-serif text-gray-400">{result.alternativeSolution.product}</div>
                                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest">{result.alternativeSolution.method}</div>
                                        <p className="text-xs text-gray-400 leading-relaxed italic">&quot;{result.alternativeSolution.reasoning}&quot;</p>
                                    </div>
                                </div>

                                {/* Financial Forecast */}
                                <div className="bg-[var(--ink)] text-white p-10 rounded-[3rem] shadow-xl md:col-span-2">
                                    <div className="flex justify-between items-center mb-12">
                                        <h4 className="text-[10px] font-black text-[var(--sand)] uppercase tracking-[0.4em]">Investment Forecasting</h4>
                                        <span className="text-[var(--sand)] font-mono text-[10px] border border-[var(--sand)]/20 px-3 py-1 rounded-full uppercase tracking-widest">Confidence Level: 98%</span>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                                        <div className="space-y-2">
                                            <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">Material Value</div>
                                            <div className="text-3xl font-serif tracking-tight">₹{result.financialForecasting.materialInvestment.toLocaleString()}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">Engineering Add-ons</div>
                                            <div className="text-3xl font-serif tracking-tight">₹{result.financialForecasting.ancillaryCosts.toLocaleString()}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">Precision Buffer</div>
                                            <div className="text-3xl font-serif tracking-tight">₹{result.financialForecasting.wastageBuffer.toLocaleString()}</div>
                                        </div>
                                        <div className="space-y-2 border-l border-white/10 pl-10">
                                            <div className="text-[var(--terracotta)] text-[10px] font-black uppercase tracking-widest">Total Investment</div>
                                            <div className="text-4xl font-serif text-[var(--sand)] tracking-tighter">₹{(result.financialForecasting.materialInvestment + result.financialForecasting.ancillaryCosts + result.financialForecasting.wastageBuffer).toLocaleString()}*</div>
                                        </div>
                                    </div>
                                    <div className="mt-12 pt-10 border-t border-white/10">
                                        <p className="text-sm text-white/70 leading-relaxed font-light italic">
                                            {result.financialForecasting.roiInsight}
                                        </p>
                                    </div>
                                </div>

                                {/* Engineering Mastery */}
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl md:col-span-2">
                                    <h4 className="text-[10px] font-black text-[var(--terracotta)] uppercase tracking-[0.3em] mb-8">Engineering Mastery</h4>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Structural Logic</div>
                                                <p className="text-sm text-gray-700 leading-relaxed italic">{result.engineeringMastery.structuralLogic}</p>
                                            </div>
                                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="p-1 bg-white rounded-lg"><Settings className="w-3 h-3 text-emerald-600" /></span>
                                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Veteran Pro-Tip</span>
                                                </div>
                                                <p className="text-xs text-emerald-900/70 font-medium italic">&quot;{result.engineeringMastery.proTip}&quot;</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-[10px] text-[var(--ink)] font-black uppercase tracking-widest mb-4">Critical Challenges</div>
                                            <div className="flex flex-wrap gap-2">
                                                {result.engineeringMastery.keyChallenges.map((c, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg border border-gray-100 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span> {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Roadmap */}
                                <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl md:col-span-2 overflow-hidden relative">
                                    <div className="absolute top-0 right-10 w-px h-full bg-gray-50"></div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Step-By-Step Engineering Roadmap</h4>
                                    <div className="space-y-10">
                                        {result.stepByStepExecution.map((step, i) => (
                                            <div key={i} className="relative flex gap-10 group">
                                                <div className="w-14 h-14 bg-[var(--ink)] text-white rounded-2xl flex-shrink-0 flex flex-col items-center justify-center font-serif group-hover:bg-[var(--terracotta)] transition-colors duration-500 shadow-xl">
                                                    <span className="text-xs opacity-50 font-sans">0{i + 1}</span>
                                                    <span className="text-lg font-bold">PH</span>
                                                </div>
                                                <div className="flex-1 space-y-4 pb-10 border-b border-gray-100 last:border-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="text-[10px] font-black text-[var(--terracotta)] uppercase tracking-[0.2em] mb-1">{step.phase}</h5>
                                                            <h6 className="text-xl font-serif text-[var(--ink)]">{step.whatToDo}</h6>
                                                        </div>
                                                        <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            {step.estimatedDays} Days
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 leading-relaxed font-light italic bg-gray-50/50 p-6 rounded-2xl">
                                                        <strong className="text-[var(--ink)] font-bold text-[10px] uppercase tracking-widest block mb-2 opacity-50">Why this matters:</strong>
                                                        &quot;{step.whyItMatters}&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-6 pt-8">
                                <button className="flex items-center justify-center gap-4 px-12 py-7 bg-[var(--terracotta)] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/40 hover:-translate-y-2 transition-all text-sm">
                                    <Download className="w-6 h-6" /> Export Master Strategy (PDF)
                                </button>
                                <button className="flex items-center justify-center gap-4 px-12 py-7 bg-[var(--ink)] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/40 hover:-translate-y-2 transition-all text-sm">
                                    <Settings className="w-6 h-6" /> Request Structural Sign-off
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
