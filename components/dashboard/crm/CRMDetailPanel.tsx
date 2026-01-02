'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Phone, MessageSquare, Calendar, AlertCircle, TrendingUp,
    ArrowRight, Star, HardHat, CheckCircle2, Loader2, FileText,
    Send, Sparkles, Receipt
} from 'lucide-react';

interface CRMDetailPanelProps {
    lead: any;
    onClose: () => void;
    stages: any[];
    handleStageChange: (id: string, stage: string) => void;
    handleGenerateAI: () => void;
    isGeneratingAI: boolean;
    aiDraft: string;
    showQuoteCalc: boolean;
    setShowQuoteCalc: (show: boolean) => void;
    quotePrice: string;
    setQuotePrice: (price: string) => void;
    quoteUnit: 'piece' | 'sqft';
    setQuoteUnit: (unit: 'piece' | 'sqft') => void;
    handleCalculateQuote: () => void;
    quoteResult: string;
    handleDownloadPDF: () => void;
    interactionForm: any;
    setInteractionForm: (form: any) => void;
    handleLogInteraction: (e: React.FormEvent) => void;
    isLoggingInteraction: boolean;
    sites: any[];
    labours: any[];
    handleCreateSite: () => void;
    isCreatingSite: boolean;
    feedbackForm: any;
    setFeedbackForm: (form: any) => void;
    handleSubmitFeedback: () => void;
    isSubmittingFeedback: boolean;
}

export function CRMDetailPanel({
    lead,
    onClose,
    stages,
    handleStageChange,
    handleGenerateAI,
    isGeneratingAI,
    aiDraft,
    showQuoteCalc,
    setShowQuoteCalc,
    quotePrice,
    setQuotePrice,
    quoteUnit,
    setQuoteUnit,
    handleCalculateQuote,
    quoteResult,
    handleDownloadPDF,
    interactionForm,
    setInteractionForm,
    handleLogInteraction,
    isLoggingInteraction,
    sites,
    labours,
    handleCreateSite,
    isCreatingSite,
    feedbackForm,
    setFeedbackForm,
    handleSubmitFeedback,
    isSubmittingFeedback
}: CRMDetailPanelProps) {
    if (!lead) return null;

    const isActiveSite = sites.some(s => s.clientPhone === lead.phone);
    const siteData = sites.find(s => s.clientPhone === lead.phone);
    const assignedLabours = labours.filter(l => l.currentSite?._ref === siteData?._id);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-[#2a1e16]/60 backdrop-blur-md z-[60]"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-3xl bg-[#FAF9F6] shadow-2xl z-[70] overflow-y-auto flex flex-col"
            >
                {/* Panel Header */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#e9e2da]/50 p-8 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-[#2a1e16] text-[#FAF9F6] rounded-md text-[9px] font-bold uppercase tracking-[0.2em]">
                                UID: {lead._id?.slice(-8).toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] border ${stages.find(s => s.value === (lead.stage || 'new'))?.color}`}>
                                {stages.find(s => s.value === (lead.stage || 'new'))?.label}
                            </span>
                        </div>
                        <h2 className="text-3xl font-serif text-[#2a1e16] font-medium leading-none">{lead.clientName}</h2>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#8c7b70] uppercase tracking-widest mt-2">
                            <span className="text-[#b45a3c]">{lead.company || 'Private Portfolio'}</span>
                            <span className="opacity-20">|</span>
                            <span>{lead.phone}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-[#FAF9F6] hover:bg-rose-50 hover:text-rose-600 rounded-2xl flex items-center justify-center transition-all group"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-10">
                    {/* Stage Transition Bar */}
                    <section className="bg-white p-6 rounded-[2rem] border border-[#e9e2da]/50 shadow-sm">
                        <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" /> Project Lifecycle Stage
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {stages.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => handleStageChange(lead._id, s.value)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border ${lead.stage === s.value
                                            ? 'bg-[#2a1e16] border-[#2a1e16] text-white shadow-lg'
                                            : 'bg-[#FAF9F6] border-[#e9e2da] text-[#8c7b70] hover:border-[#b45a3c]/30'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Main Interaction Area */}
                        <div className="md:col-span-3 space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-[#e9e2da]/60 shadow-sm space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-serif text-2xl text-[#2a1e16]">Pipeline Chronicle</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleGenerateAI}
                                            disabled={isGeneratingAI}
                                            className="p-2 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-all border border-violet-100 disabled:opacity-50"
                                            title="AI Content Strategy"
                                        >
                                            {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => setShowQuoteCalc(!showQuoteCalc)}
                                            className={`p-2 rounded-xl transition-all border ${showQuoteCalc ? 'bg-sky-600 text-white border-sky-600' : 'bg-sky-50 text-sky-600 border-sky-100'}`}
                                            title="Financial Engine"
                                        >
                                            <Receipt className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {aiDraft && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-violet-50/50 p-6 rounded-2xl border border-violet-100 relative group"
                                    >
                                        <p className="text-[9px] font-bold text-violet-500 uppercase tracking-widest mb-3">AI Intelligence Draft</p>
                                        <p className="text-[#2a1e16] text-sm italic font-serif leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all cursor-pointer">"{aiDraft}"</p>
                                        <button
                                            onClick={() => window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(aiDraft)}`, '_blank')}
                                            className="mt-4 flex items-center gap-2 text-[10px] font-bold text-violet-600 uppercase hover:translate-x-1 transition-transform"
                                        >
                                            Ship via WhatsApp <Send className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                )}

                                {showQuoteCalc && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100 space-y-4"
                                    >
                                        <p className="text-[9px] font-bold text-sky-600 uppercase tracking-widest">Pricing Engine v2</p>
                                        <div className="flex gap-2 bg-white p-1 rounded-xl border border-sky-100/50 w-fit">
                                            <button onClick={() => setQuoteUnit('sqft')} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase ${quoteUnit === 'sqft' ? 'bg-sky-600 text-white shadow-sm' : 'text-sky-400'}`}>Sqft</button>
                                            <button onClick={() => setQuoteUnit('piece')} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase ${quoteUnit === 'piece' ? 'bg-sky-600 text-white shadow-sm' : 'text-sky-400'}`}>Piece</button>
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                value={quotePrice}
                                                onChange={e => setQuotePrice(e.target.value)}
                                                placeholder="Unit Price"
                                                className="flex-1 bg-white border border-sky-100 p-3 rounded-xl text-sm outline-none focus:border-sky-300 transition-all font-mono"
                                            />
                                            <button
                                                onClick={handleCalculateQuote}
                                                className="bg-sky-600 text-white px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-sky-700 transition-all"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                        {quoteResult && (
                                            <div className="space-y-3 pt-2">
                                                <textarea readOnly value={quoteResult} className="w-full bg-white/80 border border-sky-100 rounded-xl p-4 text-[11px] h-32 font-mono text-sky-900 resize-none" />
                                                <div className="flex gap-2">
                                                    <button onClick={handleDownloadPDF} className="flex-1 bg-white border border-sky-200 text-sky-600 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-50 transition-all">
                                                        <FileText className="w-3.5 h-3.5" /> PDF
                                                    </button>
                                                    <button onClick={() => window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(quoteResult)}`, '_blank')} className="flex-[2] bg-sky-600 text-white py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20">
                                                        <Send className="w-3.5 h-3.5" /> Dispatch Estimate
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                <form onSubmit={handleLogInteraction} className="space-y-6 pt-4 border-t border-gray-100">
                                    <div className="grid grid-cols-4 gap-2">
                                        {['call', 'whatsapp', 'email', 'meeting'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setInteractionForm({ ...interactionForm, type })}
                                                className={`py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest flex flex-col items-center gap-2 transition-all border ${interactionForm.type === type
                                                        ? 'bg-[#2a1e16] border-[#2a1e16] text-white shadow-lg'
                                                        : 'bg-[#FAF9F6] border-[#e9e2da] text-[#8c7b70] hover:bg-white'
                                                    }`}
                                            >
                                                {type === 'call' && <Phone className="w-4 h-4" />}
                                                {type === 'whatsapp' && <MessageSquare className="w-4 h-4" />}
                                                {type === 'email' && <AlertCircle className="w-4 h-4" />}
                                                {type === 'meeting' && <Calendar className="w-4 h-4" />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Record high-level meeting specific details..."
                                        value={interactionForm.summary}
                                        onChange={e => setInteractionForm({ ...interactionForm, summary: e.target.value })}
                                        className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-5 rounded-2xl outline-none focus:border-[#b45a3c]/30 focus:bg-white transition-all text-sm min-h-[140px] resize-none"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest pl-2">Follow-up Window</label>
                                            <input
                                                type="date"
                                                value={interactionForm.nextFollowUpDate}
                                                onChange={e => setInteractionForm({ ...interactionForm, nextFollowUpDate: e.target.value })}
                                                className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-3 rounded-xl outline-none text-xs font-bold text-[#2a1e16]"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest pl-2">Actionable Item</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Confirm specs"
                                                value={interactionForm.nextAction}
                                                onChange={e => setInteractionForm({ ...interactionForm, nextAction: e.target.value })}
                                                className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-3 rounded-xl outline-none text-xs font-medium"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoggingInteraction || !interactionForm.summary}
                                        className="w-full bg-[#2a1e16] text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
                                    >
                                        {isLoggingInteraction ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Interaction'}
                                    </button>
                                </form>
                            </div>

                            {/* Interaction History */}
                            <div className="space-y-6">
                                <h3 className="font-serif text-2xl text-[#2a1e16] px-2">Project History</h3>
                                <div className="space-y-6 relative border-l-2 border-[#e9e2da]/50 ml-6 pl-10">
                                    {lead.interactions?.length > 0 ? (
                                        lead.interactions.map((int: any) => (
                                            <div key={int._key} className="relative">
                                                <div className="absolute -left-[50px] top-1.5 w-4 h-4 bg-white border-2 border-[#2a1e16] rounded-full z-10 shadow-sm" />
                                                <div className="bg-white p-5 rounded-2xl border border-[#e9e2da]/40 shadow-sm space-y-3 hover:border-[#b45a3c]/20 transition-all">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-extrabold text-[#2a1e16] uppercase">{new Date(int.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-bold uppercase tracking-widest">{int.type}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[#5d554f] text-sm leading-relaxed">{int.summary}</p>
                                                    {int.nextAction && (
                                                        <div className="text-[9px] text-[#b45a3c] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 pt-1">
                                                            <ArrowRight className="w-3 h-3 text-[var(--terracotta)]" /> {int.nextAction}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-white/50 border-2 border-dashed border-[#e9e2da] rounded-3xl">
                                            <p className="text-xs text-[#8c7b70] font-medium italic opacity-50 text-[10px] uppercase tracking-widest">Awaiting First Chronicle Entry</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Auxiliary Stats */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Project Roadmap Module */}
                            <div className="bg-white p-7 rounded-[2rem] border border-[#e9e2da]/60 shadow-sm space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#FAF9F6] rounded-xl flex items-center justify-center shadow-inner">
                                        <HardHat className="w-5 h-5 text-[#2a1e16]" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-[#8c7b70] uppercase tracking-widest">Phase 3 Intelligence</p>
                                        <h4 className="text-lg font-serif">Site Roadmap</h4>
                                    </div>
                                </div>

                                {isActiveSite ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span className="text-[10px] font-black uppercase text-emerald-700">Live Operation</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600">ID: {siteData?._id.slice(-6)}</span>
                                        </div>
                                        <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#e9e2da]/40">
                                            <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest mb-3">Labour Deployment</p>
                                            <div className="flex -space-x-2">
                                                {assignedLabours.length > 0 ? assignedLabours.map((l, i) => (
                                                    <div key={l._id} className="w-8 h-8 rounded-lg bg-[#2a1e16] border-2 border-white flex items-center justify-center text-[9px] text-white font-bold uppercase" title={l.name}>
                                                        {l.name.charAt(0)}
                                                    </div>
                                                )) : (
                                                    <div className="text-[10px] text-gray-300 italic">No technician assigned</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-[11px] text-[#8c7b70] leading-relaxed">Ready to transition from sales to onsite execution? Initialize the formal roadmap.</p>
                                        <button
                                            onClick={handleCreateSite}
                                            disabled={isCreatingSite}
                                            className="w-full bg-[#2a1e16] text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isCreatingSite ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Activate Site Operations'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Customer Success (Post-Sales Won) */}
                            {lead.stage === 'won' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-amber-50/50 p-7 rounded-[2rem] border border-amber-200/50 shadow-sm space-y-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100/50 rounded-xl flex items-center justify-center shadow-inner">
                                            <Star className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Account Health</p>
                                            <h4 className="text-lg font-serif">Post-Sales Review</h4>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                    className={`w-full py-2 rounded-lg flex items-center justify-center transition-all ${feedbackForm.rating >= star ? 'bg-amber-400 text-white shadow-md' : 'bg-white border border-amber-200 text-amber-200 hover:border-amber-300'}`}
                                                >
                                                    <Star className="w-4 h-4 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder="Capture material performance & site service quality..."
                                            value={feedbackForm.comment}
                                            onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                            className="w-full bg-white border border-amber-200 p-4 rounded-xl text-xs min-h-[100px] outline-none focus:border-amber-400 transition-all placeholder:text-amber-300"
                                        />
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={isSubmittingFeedback || !feedbackForm.comment}
                                            className="w-full bg-amber-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-amber-500/20 disabled:opacity-50 hover:bg-amber-600 outline-none"
                                        >
                                            {isSubmittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log Client Testimony'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Brief Stats Section */}
                            <div className="bg-[#FAF9F6] p-7 rounded-[2rem] border border-[#e9e2da]/40 space-y-5">
                                <h4 className="text-[10px] font-black text-[#8c7b70] uppercase tracking-widest px-2">Portfolio Metrics</h4>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                                        <span className="text-[10px] font-bold text-[#8c7b70] uppercase">Total Engagements</span>
                                        <span className="text-lg font-serif text-[#2a1e16]">{lead.interactionCount || 0}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                                        <span className="text-[10px] font-bold text-[#8c7b70] uppercase">Days in Pipeline</span>
                                        <span className="text-lg font-serif text-[#2a1e16]">{Math.floor((new Date().getTime() - new Date(lead._createdAt).getTime()) / (1000 * 3600 * 24))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
