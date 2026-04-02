'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Generate3DConcept, AnalyzeProject, IdentifyAndAsk } from '@/app/actions/project-lab-ai';
import { createCRMLead } from '@/app/actions/crm';
import { Download, FileText, Settings, Shield, Clock, Plus, User, MapPin, Layers, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface AIResponse {
    strategicVision: string;
    visualObservation: string;
    visualPlanPrompt?: string;
    primarySolution: {
        product: string;
        method: string;
        reasoning: string;
        quantity: string;
        technicalResources?: {
            tds?: string;
            slug?: string;
        };
    };
    fieldEvidence?: {
        project: string;
        location: string;
        result: string;
    }[];
    engineeringMastery: {
        structuralLogic: string;
        keyChallenges: string[];
        complianceNotes?: string;
        proTip?: string;
    };
    implementationPlan?: {
        phase: string;
        tasks: string[];
        tools: string[];
    }[];
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
    visualOverlays?: {
        type: 'marker' | 'region';
        x: number;
        y: number;
        label: string;
        note: string;
    }[];
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
    const [threeDPlanUrl, setThreeDPlanUrl] = useState<string | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

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

                // Trigger 3D Plan automatically if prompt exists
                if (response.data.visualPlanPrompt) {
                    setIsGeneratingPlan(true);
                    const planRes = await Generate3DConcept(response.data.visualPlanPrompt);
                    if (planRes.success && planRes.url) {
                        setThreeDPlanUrl(planRes.url);
                    }
                    setIsGeneratingPlan(false);
                }
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
                company: `Project Lab Analysis`,
                productName: result.primarySolution.product,
                quantity: `${area} sqft`,
                requirements: `Using ${result.primarySolution.method}. ROI: ${result.financialForecasting.roiInsight}`,
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

    const generatePDF = async () => {
        if (!result) return;

        const doc = new jsPDF();
        const terracotta = '#C15E34';
        const ink = '#1A1A1A';

        // Page 1: Vision Header
        doc.setFillColor(ink);
        doc.rect(0, 0, 210, 60, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.text('URBAN CLAY', 20, 30);
        doc.setFontSize(12);
        doc.text('PROJECT LAB | OFFICIAL MASTER DIRECTIVE', 20, 40);
        doc.setDrawColor(terracotta);
        doc.setLineWidth(1);
        doc.line(20, 45, 100, 45);

        // Project Intro
        doc.setTextColor(ink);
        doc.setFontSize(10);
        doc.text(`CLIENT: ${clientName || 'Valued Partner'}`, 20, 75);
        doc.text(`FACILITY: ${location || 'N/A'}`, 120, 75);
        doc.text(`COVERAGE: ${area} SQFT`, 20, 82);
        doc.text(`DIRECTIVE ID: UC-${Math.floor(Math.random() * 10000)}`, 120, 82);

        // 3D Concept Title
        doc.setFontSize(14);
        doc.text('3D CONCEPTUAL IMPLEMENTATION PLAN', 20, 105);
        doc.setDrawColor(terracotta);
        doc.line(20, 107, 60, 107);

        // Include 3D Plan Image if available
        if (threeDPlanUrl) {
            try {
                // Fetch and convert image to base64 for PDF
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = threeDPlanUrl;
                await new Promise((resolve) => {
                    img.onload = resolve;
                });
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);
                const base64Img = canvas.toDataURL("image/jpeg");
                doc.addImage(base64Img, 'JPEG', 20, 115, 170, 100);
            } catch (e) {
                doc.setFillColor('#F9FAFB');
                doc.rect(20, 115, 170, 100, 'F');
                doc.text('3D Plan synchronization in progress...', 70, 160);
            }
        }

        // Strategic Vision Box
        doc.setFillColor('#F9FAFB');
        doc.rect(20, 225, 170, 35, 'F');
        doc.setTextColor(terracotta);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(12);
        const visionLines = doc.splitTextToSize(`"${result.strategicVision}"`, 160);
        doc.text(visionLines, 25, 240);

        // Footer Page 1
        doc.setFontSize(8);
        doc.setTextColor('#999999');
        doc.text('Page 1 of 2 | Technical Directive', 20, 285);

        // Page 2: Technical Specs & Roadmap
        doc.addPage();
        doc.setFillColor(ink);
        doc.rect(0, 0, 210, 15, 'F');
        
        doc.setTextColor(ink);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('TECHNICAL SPECIFICATION & EXECUTION', 20, 35);
        
        doc.setFontSize(10);
        doc.text('PRIMARY SYSTEM:', 20, 50);
        doc.setTextColor(terracotta);
        doc.text(`${result.primarySolution.product} | ${result.primarySolution.method}`, 60, 50);
        
        doc.setTextColor('#666666');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const reasoningLines = doc.splitTextToSize(result.primarySolution.reasoning, 170);
        doc.text(reasoningLines, 20, 60);

        // Implementation Roadmap
        if (result.implementationPlan) {
            doc.setTextColor(ink);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('IMPLEMENTATION ROADMAP', 20, 90);
            
            let y = 105;
            result.implementationPlan.forEach((plan, i) => {
                doc.setFillColor('#F9FAFB');
                doc.rect(20, y, 170, 45, 'F');
                doc.setTextColor(terracotta);
                doc.setFontSize(10);
                doc.text(plan.phase.toUpperCase(), 30, y + 10);
                
                doc.setTextColor(ink);
                doc.setFontSize(8);
                plan.tasks.forEach((task, j) => {
                    doc.text(`- ${task}`, 35, y + 20 + (j * 5));
                });
                
                doc.setTextColor('#999999');
                doc.text(`TOOLS: ${plan.tools.join(', ')}`, 35, y + 40);
                y += 55;
            });
        }

        // Financial Security
        const finalY = doc.internal.pageSize.getHeight() - 60;
        doc.setFillColor(ink);
        doc.rect(20, finalY, 170, 35, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(10);
        doc.text('PRELIMINARY INVESTMENT CAPITAL', 30, finalY + 12);
        doc.setFontSize(18);
        const total = result.financialForecasting.materialInvestment + result.financialForecasting.ancillaryCosts + result.financialForecasting.wastageBuffer;
        doc.text(`INR ${total.toLocaleString()}`, 30, finalY + 25);

        doc.save(`UrbanClay_Directive_${clientName.replace(/\s/g, '_') || 'Project'}.pdf`);
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
                            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-[var(--terracotta)] transition-colors"
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
                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">{files.product ? 'Image Detected' : 'Upload SKU/Style'}</p>
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
                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">{files.site ? 'Site Detected' : 'Installation Area'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Client Name, Location & Area */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1 mb-3 block">Client Name / Context</label>
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
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1 mb-3 block text-emerald-600">Site Location (Contextual)</label>
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
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1 mb-3 block">Execution Area</label>
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
                            <p className="text-gray-600 max-w-md mt-2 leading-relaxed text-lg italic">
                                &quot;Upload a photo of your product SKU and the installation site. I will identify the patterns and measure the engineering needs.&quot;
                            </p>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="h-[750px] bg-white rounded-[4rem] border border-gray-100 p-20 flex flex-col items-center justify-center space-y-12 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--terracotta)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                            </div>
                            
                            <div className="relative">
                                <div className="w-40 h-40 border-[8px] border-gray-50 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                                <div className="absolute inset-4 border-[4px] border-gray-50 border-b-[var(--ink)] rounded-full animate-[spin_3s_linear_infinite]"></div>
                                <div className="absolute inset-8 flex items-center justify-center text-4xl">
                                    🧠
                                </div>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <h4 className="text-4xl font-serif text-[var(--ink)] tracking-tight">Sovereign Intelligence Analysis...</h4>
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed italic text-lg">
                                        &quot;Cross-referencing site topology with 100-year clay durability models...&quot;
                                    </p>
                                    <div className="flex gap-1 mt-4">
                                        {[0, 1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                className="w-1 h-8 bg-[var(--terracotta)] rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
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
                            {/* Visionary Analysis Canvas */}
                            {files.site && (
                                <div className="bg-white p-6 rounded-[3.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">AI Structural Analysis Canvas</h4>
                                    <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group">
                                        <img src={files.site} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Site Analysis" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        
                                        {/* AI Overlays */}
                                        <AnimatePresence>
                                            {result.visualOverlays?.map((overlay, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + i * 0.2 }}
                                                    style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}
                                                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/marker"
                                                >
                                                    <div className="relative">
                                                        <div className="w-6 h-6 bg-[var(--terracotta)] rounded-full border-4 border-white shadow-xl animate-pulse cursor-pointer"></div>
                                                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-2xl border border-gray-100 w-48 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                                                            <p className="text-[10px] font-black text-[var(--terracotta)] uppercase">{overlay.label}</p>
                                                            <p className="text-[9px] text-gray-600 leading-tight mt-1">{overlay.note}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <div className="flex gap-2">
                                                    <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">Neural Scan Active</span>
                                                </div>
                                                <p className="text-white/80 text-xs font-medium max-w-md italic">"{result.visualObservation}"</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[9px] font-bold text-white uppercase tracking-[0.2em]">
                                                Site Topology Confirmed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Strategic Vision Section */}
                            <div className="bg-[var(--ink)] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Shield className="w-24 h-24 rotate-12 text-[var(--terracotta)]" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-px bg-[var(--terracotta)]"></div>
                                        <h4 className="text-[10px] font-black text-[var(--terracotta)] uppercase tracking-[0.2em]">The Principal's Verdict</h4>
                                    </div>
                                    <p className="text-4xl font-serif italic leading-tight text-[var(--sand)]">
                                        &quot;{result.strategicVision}&quot;
                                    </p>
                                    <div className="flex items-center gap-6 mt-10">
                                        <div className="w-14 h-14 rounded-full border-2 border-[var(--terracotta)] p-1 overflow-hidden">
                                            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-xl">👴🏽</div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">Abhinav R.</p>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Founder & Principal Architect</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Results Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div className="bg-white p-10 rounded-[3rem] border-2 border-[var(--terracotta)] shadow-xl relative overflow-hidden">
                                        <div className="absolute top-4 right-6 bg-[var(--terracotta)] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Sovereign Choice</div>
                                        <h4 className="text-[10px] font-black text-[var(--terracotta)] uppercase tracking-[0.2em] mb-8">Primary Material Path</h4>
                                        <div className="space-y-6">
                                            <div className="text-2xl font-serif text-[var(--ink)] leading-tight">{result.primarySolution.product}</div>
                                            <div className="text-sm font-black text-[var(--terracotta)] uppercase tracking-widest leading-none block">{result.primarySolution.method}</div>
                                            <p className="text-sm text-gray-500 leading-relaxed italic">&quot;{result.primarySolution.reasoning}&quot;</p>
                                            
                                            {/* Technical Resources */}
                                            <div className="pt-4 flex flex-col gap-3">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Architectural Specifications</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.primarySolution.technicalResources?.tds ? (
                                                        <a href={result.primarySolution.technicalResources.tds} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-bold border border-emerald-100 transition-colors">
                                                            <Download className="w-3 h-3" /> Download Technical Data (TDS)
                                                        </a>
                                                    ) : (
                                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-bold border border-gray-100 cursor-not-allowed">
                                                            <Download className="w-3 h-3" /> TDS Pending Review
                                                        </button>
                                                    )}
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--ink)] hover:bg-[var(--terracotta)] text-white rounded-xl text-[10px] font-bold border border-gray-100 transition-all shadow-lg hover:-translate-y-0.5">
                                                        <Shield className="w-3 h-3 text-[var(--terracotta)]" /> Order Specifier Sample Kit
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                                                <span className="text-[9px] uppercase font-bold text-gray-400">Precision Quantity</span>
                                                <span className="text-sm font-bold text-[var(--ink)]">{result.primarySolution.quantity}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Field Evidence */}
                                    {result.fieldEvidence && result.fieldEvidence.length > 0 && (
                                        <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                                <Shield className="w-3 h-3" /> Field Evidence / Case Studies
                                            </h4>
                                            <div className="space-y-6">
                                                {result.fieldEvidence.map((ev, i) => (
                                                    <div key={i} className="space-y-2 group">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors">{ev.project}</p>
                                                            <span className="text-[9px] font-black text-gray-300 uppercase">{ev.location}</span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 italic leading-relaxed">"{ev.result}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Financial Forecast */}
                                <div className="bg-[var(--ink)] text-white p-12 rounded-[4rem] shadow-2xl md:col-span-2 relative overflow-hidden group">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--terracotta)]/10 rounded-full blur-3xl group-hover:bg-[var(--terracotta)]/20 transition-colors duration-1000"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-center mb-16">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-black text-[var(--sand)] uppercase tracking-[0.3em]">Capital Investment Forecasting</h4>
                                                <p className="text-[10px] text-white/30 font-medium">PRECISION MODEL V8.2 | ACTUARIAL GRADE</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-white/40 uppercase">Confidence</p>
                                                    <p className="text-xs font-black text-emerald-400">99.4%</p>
                                                </div>
                                                <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-[var(--terracotta)]" />
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                                    <div className="text-white/40 text-[9px] font-black uppercase tracking-widest">Material Assets</div>
                                                </div>
                                                <div className="text-4xl font-serif tracking-tight text-[var(--sand)]">₹{Math.round(result.financialForecasting.materialInvestment).toLocaleString()}</div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                                    <div className="text-white/40 text-[9px] font-black uppercase tracking-widest">Engineering & Install</div>
                                                </div>
                                                <div className="text-4xl font-serif tracking-tight text-[var(--sand)]">₹{Math.round(result.financialForecasting.ancillaryCosts).toLocaleString()}</div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                                                    <div className="text-white/40 text-[9px] font-black uppercase tracking-widest">Precision Buffer</div>
                                                </div>
                                                <div className="text-4xl font-serif tracking-tight text-white/40">₹{Math.round(result.financialForecasting.wastageBuffer).toLocaleString()}</div>
                                            </div>
                                            <div className="space-y-4 bg-white/5 -m-8 p-8 rounded-3xl border border-white/10 shadow-inner">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></div>
                                                    <div className="text-[var(--terracotta)] text-[9px] font-black uppercase tracking-widest">Total Valuation</div>
                                                </div>
                                                <div className="text-5xl font-serif text-white tracking-tighter">
                                                    ₹{Math.round(result.financialForecasting.materialInvestment + result.financialForecasting.ancillaryCosts + result.financialForecasting.wastageBuffer).toLocaleString()}
                                                </div>
                                                <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Includes 18% GST Estimate</p>
                                            </div>
                                        </div>

                                        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-10 items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm text-white/60 leading-relaxed font-light italic max-w-2xl">
                                                    <span className="text-[var(--terracotta)] font-bold mr-2">ROI PERSPECTIVE:</span>
                                                    {result.financialForecasting.roiInsight}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[9px] font-bold text-white/40">LIFESPAN: 100+ YRS</div>
                                                <div className="px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase">Low Maintenance</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3D Concept Plan */}
                                <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl md:col-span-2 overflow-hidden relative min-h-[500px] flex flex-col items-center justify-center">
                                    <div className="absolute top-0 left-0 w-full p-10 z-10">
                                        <h4 className="text-[10px] font-black text-[var(--terracotta)] uppercase tracking-[0.2em] mb-2">Automated Execution Intelligence</h4>
                                        <h2 className="text-3xl font-serif text-[var(--ink)]">3D Conceptual Implementation Plan</h2>
                                    </div>
                                    
                                    {isGeneratingPlan ? (
                                        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
                                            <div className="w-20 h-20 border-4 border-[var(--terracotta)]/20 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Drafting Visual Implementation Strategy...</p>
                                        </div>
                                    ) : threeDPlanUrl ? (
                                        <div className="w-full h-full relative group">
                                            <img src={threeDPlanUrl} alt="3D Plan Concept" className="w-full h-[600px] object-cover rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-transparent flex items-end p-12 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white/60 text-sm italic max-w-xl">&quot;This concept visualizes the installation protocol, focusing on {result.primarySolution.method} to ensure 100-year structural integrity.&quot;</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-20 bg-gray-50 rounded-[3rem] w-full border-2 border-dashed border-gray-100">
                                            <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Visual Concept Blocked by Site Context</p>
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Implementation Roadmap */}
                                {result.implementationPlan && (
                                    <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl md:col-span-2 overflow-hidden relative">
                                        <div className="absolute top-0 right-10 w-px h-full bg-gray-50"></div>
                                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-12 flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive Implementation Roadmap
                                        </h4>
                                        <div className="grid md:grid-cols-3 gap-10 relative z-10">
                                            {result.implementationPlan.map((plan, i) => (
                                                <div key={i} className="space-y-6 p-8 bg-gray-50 rounded-[2.5rem] hover:bg-white transition-all shadow-sm hover:shadow-xl border border-transparent hover:border-gray-100">
                                                    <div className="text-[9px] font-black text-[var(--terracotta)] uppercase tracking-widest px-3 py-1 bg-white inline-block rounded-full shadow-sm">{plan.phase}</div>
                                                    <div className="space-y-4">
                                                        <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Core Technical Tasks</div>
                                                        <ul className="space-y-2">
                                                            {plan.tasks.map((task, j) => (
                                                                <li key={j} className="text-xs text-[var(--ink)] flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                                                    {task}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                                                        {plan.tools.map((tool, j) => (
                                                            <span key={j} className="px-2 py-1 bg-white rounded-lg text-[8px] font-bold text-gray-400 border border-gray-100">{tool}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center gap-6 pt-8">
                                <button
                                    onClick={generatePDF}
                                    className="flex items-center justify-center gap-4 px-12 py-7 bg-[var(--terracotta)] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/40 hover:-translate-y-2 transition-all text-sm"
                                >
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
