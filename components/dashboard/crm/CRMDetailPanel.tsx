'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Phone, MessageSquare, Calendar, AlertCircle, TrendingUp,
    ArrowRight, Star, HardHat, CheckCircle2, Loader2, FileText,
    Send, Sparkles, Receipt, Pencil, Trash2, Save, Link2, MapPin,
    Clock, Truck, Scale, Map, Landmark, Box
} from 'lucide-react';
import { createPaymentLink } from '@/app/actions/payment-link';
import { estimateFreight } from '@/app/actions/logistics';

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
    handleUpdateLead: (id: string, data: any) => void;
    handleDeleteLead: (id: string) => void;
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
    isSubmittingFeedback,
    handleUpdateLead,
    handleDeleteLead
}: CRMDetailPanelProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        clientName: '',
        company: '',
        phone: '',
        email: '',
        potentialValue: 0,
        location: '',
        leadDate: '',
        leadTime: '',
        totalWeightKg: 0,
        freightEstimate: 0,
        productName: '',
        quantity: ''
    });

    const [logisticsResult, setLogisticsResult] = React.useState<any>(null);
    const [isCalculatingFreight, setIsCalculatingFreight] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'overview' | 'intelligence' | 'site'>('overview');

    React.useEffect(() => {
        if (lead) {
            setEditForm({
                clientName: lead.clientName || '',
                company: lead.company || '',
                phone: lead.phone || '',
                email: lead.email || '',
                potentialValue: lead.potentialValue || 0,
                location: lead.location || '',
                leadDate: lead.leadDate || '',
                leadTime: lead.leadTime || '',
                totalWeightKg: lead.totalWeightKg || 0,
                freightEstimate: lead.freightEstimate || 0,
                productName: lead.productName || '',
                quantity: lead.quantity || ''
            });
        }
    }, [lead]);

    const [editableDraft, setEditableDraft] = React.useState(aiDraft);

    React.useEffect(() => {
        if (aiDraft) setEditableDraft(aiDraft);
    }, [aiDraft]);

    const getWhatsAppLink = (phone: string, text: string) => {
        if (!phone) return '';
        let cleanPhone = phone.replace(/[^0-9]/g, '');

        // Remove leading 0 if present
        if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

        // If phone is 10 digits, add 91 (assume India)
        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

        return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    };

    const runFreightRadar = async () => {
        if (!editForm.location) {
            alert("No location set for this lead.");
            return;
        }
        setIsCalculatingFreight(true);
        const result = await estimateFreight(
            editForm.location,
            editForm.totalWeightKg || 1000,
            editForm.productName
        );
        if (result.success && result.data) {
            setLogisticsResult(result.data);
            setEditForm(prev => ({ ...prev, freightEstimate: result.data!.estimatedCost }));
        } else {
            alert("Could not estimate freight. Check city name.");
        }
        setIsCalculatingFreight(false);
    };

    const saveChanges = () => {
        handleUpdateLead(lead._id, editForm);
        setIsEditing(false);
    };

    if (!lead) return null;

    const isActiveSite = sites.some(s => s.clientPhone === lead.phone);
    const siteData = sites.find(s => s.clientPhone === lead.phone);
    const assignedLabours = labours.filter(l => l.currentSite?._ref === siteData?._id);

    return (
        <>
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
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#e9e2da]/50 p-8 flex justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-[#2a1e16] text-[#FAF9F6] rounded-md text-[9px] font-bold uppercase tracking-[0.2em]">
                                UID: {lead._id?.slice(-8).toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] border ${stages.find(s => s.value === (lead.stage || 'new'))?.color}`}>
                                {stages.find(s => s.value === (lead.stage || 'new'))?.label}
                            </span>
                        </div>

                        {isEditing ? (
                            <div className="space-y-3 max-w-lg">
                                <input
                                    value={editForm.clientName}
                                    onChange={e => setEditForm({ ...editForm, clientName: e.target.value })}
                                    className="w-full text-3xl font-serif text-[#2a1e16] bg-white border border-[#b45a3c]/30 rounded-lg px-2 py-1 outline-none"
                                    placeholder="Client Name"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        value={editForm.company}
                                        onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#b45a3c]"
                                        placeholder="Company/Project"
                                    />
                                    <input
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#8c7b70]"
                                        placeholder="Phone"
                                    />
                                    <input
                                        value={editForm.location}
                                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#b45a3c]"
                                        placeholder="Location"
                                    />
                                    <input
                                        type="date"
                                        value={editForm.leadDate}
                                        onChange={e => setEditForm({ ...editForm, leadDate: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#8c7b70]"
                                    />
                                    <input
                                        type="time"
                                        value={editForm.leadTime}
                                        onChange={e => setEditForm({ ...editForm, leadTime: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#8c7b70]"
                                    />
                                    <input
                                        placeholder="Product Choice"
                                        value={editForm.productName}
                                        onChange={e => setEditForm({ ...editForm, productName: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#b45a3c]"
                                    />
                                    <input
                                        placeholder="Quantity"
                                        value={editForm.quantity}
                                        onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                                        className="text-xs font-bold uppercase tracking-widest bg-white border border-[#b45a3c]/30 rounded px-2 py-1 outline-none text-[#b45a3c]"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-serif text-[#2a1e16] font-medium leading-none">{lead.clientName}</h2>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#8c7b70] uppercase tracking-widest mt-2">
                                    <span className="text-[#b45a3c]">{lead.company || 'Private Portfolio'}</span>
                                    <span className="opacity-20">|</span>
                                    {lead.location && (
                                        <>
                                            <span className="flex items-center gap-1 text-[#b45a3c]"><MapPin className="w-3 h-3" /> {lead.location}</span>
                                            <span className="opacity-20">|</span>
                                        </>
                                    )}
                                    <span className="block md:inline w-full md:w-auto">{lead.phone}</span>
                                    {lead.productName && (
                                        <>
                                            <span className="opacity-20">|</span>
                                            <span className="flex items-center gap-1 text-[#b45a3c]"><Box className="w-3 h-3" /> {lead.productName} {lead.quantity && `(${lead.quantity})`}</span>
                                        </>
                                    )}
                                </div>
                                {lead.leadDate && (
                                    <div className="flex items-center gap-2 mt-2 text-[9px] font-bold text-[#8c7b70] uppercase tracking-[0.2em] bg-[#FAF9F6] w-fit px-2 py-1 rounded">
                                        <Calendar className="w-3 h-3 text-[#b45a3c]" /> Source Date: {new Date(lead.leadDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {lead.leadTime && `@ ${lead.leadTime}`}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <button
                                onClick={saveChanges}
                                className="w-10 h-10 bg-[#b45a3c] text-white rounded-xl flex items-center justify-center hover:bg-[#96472d] transition-all shadow-lg shadow-[#b45a3c]/20"
                                title="Save Changes"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-10 h-10 bg-white text-[#8c7b70] border border-[#e9e2da] rounded-xl flex items-center justify-center hover:bg-[#FAF9F6] hover:text-[#2a1e16] transition-all"
                                title="Edit Details"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}

                        {isEditing && (
                            <button
                                onClick={() => handleDeleteLead(lead._id)}
                                className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-all"
                                title="Delete Opportunity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="w-px h-8 bg-[#e9e2da] mx-1" />

                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-[#FAF9F6] hover:bg-rose-50 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all group border border-transparent hover:border-rose-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-4 bg-white/80 backdrop-blur-xl border-b border-[#e9e2da]/30 sticky top-[108px] z-10">
                    <div className="flex gap-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: Clock },
                            { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
                            { id: 'site', label: 'Site Ops', icon: HardHat },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#b45a3c]' : 'text-[#8c7b70] hover:text-[#2a1e16]'
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b45a3c]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    {/* Stage Transition Bar */}
                    <div className="bg-white p-6 rounded-[2rem] border border-[#e9e2da]/40 shadow-sm">
                        <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" /> Sales Velocity Stage
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {stages.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => handleStageChange(lead._id, s.value)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${lead.stage === s.value
                                        ? 'bg-[#2a1e16] border-[#2a1e16] text-white shadow-lg'
                                        : 'bg-white border-[#e9e2da] text-[#8c7b70] hover:border-[#b45a3c]/30'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[600px]">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Interaction History & Logging */}
                                <div className="md:col-span-3 space-y-8">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-[#e9e2da]/60 shadow-sm space-y-8">
                                        <h3 className="font-serif text-2xl text-[#2a1e16]">Activity Log</h3>
                                        <form onSubmit={handleLogInteraction} className="space-y-6">
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
                                                placeholder="Log notes from your last conversation..."
                                                value={interactionForm.summary}
                                                onChange={e => setInteractionForm({ ...interactionForm, summary: e.target.value })}
                                                className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-5 rounded-2xl outline-none focus:border-[#b45a3c]/30 focus:bg-white transition-all text-sm min-h-[140px] resize-none"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest pl-2">Follow-up</label>
                                                    <input
                                                        type="date"
                                                        value={interactionForm.nextFollowUpDate}
                                                        onChange={e => setInteractionForm({ ...interactionForm, nextFollowUpDate: e.target.value })}
                                                        className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-3 rounded-xl outline-none text-xs font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest pl-2">Next Step</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Discuss variations"
                                                        value={interactionForm.nextAction}
                                                        onChange={e => setInteractionForm({ ...interactionForm, nextAction: e.target.value })}
                                                        className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-3 rounded-xl outline-none text-xs font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoggingInteraction || !interactionForm.summary}
                                                className="w-full bg-[#2a1e16] text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-[#2a1e16]/20"
                                            >
                                                {isLoggingInteraction ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sync Activity'}
                                            </button>
                                        </form>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="font-serif text-2xl text-[#2a1e16] px-2">Timeline</h3>
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
                                                                    <ArrowRight className="w-3 h-3" /> {int.nextAction}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 bg-white/50 border-2 border-dashed border-[#e9e2da] rounded-3xl">
                                                    <p className="text-xs text-[#8c7b70] font-medium italic opacity-50 text-[10px] uppercase tracking-widest">No entries yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Metrics */}
                                <div className="md:col-span-2 space-y-8">
                                    <div className="bg-[#FAF9F6] p-7 rounded-[2rem] border border-[#e9e2da]/40 space-y-6 shadow-sm">
                                        <h4 className="text-[10px] font-black text-[#8c7b70] uppercase tracking-widest px-2">Lead Performance</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e9e2da]/20">
                                                <p className="text-[9px] font-bold text-[#8c7b70] uppercase mb-1">Potential Value</p>
                                                <p className="text-2xl font-serif text-[#2a1e16]">₹{lead.potentialValue?.toLocaleString() || '0'}</p>
                                            </div>
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e9e2da]/20">
                                                <p className="text-[9px] font-bold text-[#8c7b70] uppercase mb-1">Engagement Score</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-2xl font-serif text-[#2a1e16]">{lead.interactionCount || 0}</p>
                                                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Touchpoints</span>
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e9e2da]/20">
                                                <p className="text-[9px] font-bold text-[#8c7b70] uppercase mb-1">Pipeline Velocity</p>
                                                <p className="text-2xl font-serif text-[#2a1e16]">{Math.floor((new Date().getTime() - new Date(lead._createdAt).getTime()) / (1000 * 3600 * 24))} Days</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#2a1e16] p-8 rounded-[2rem] text-white shadow-xl space-y-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="relative z-10">
                                            <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest mb-2">Deal Health</p>
                                            <h4 className="text-xl font-serif mb-6">Probability of Success</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-3xl font-serif">85%</span>
                                                    <span className="text-[10px] text-[#b45a3c] font-black uppercase tracking-widest">Target Met</span>
                                                </div>
                                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '85%' }}
                                                        className="bg-[#b45a3c] h-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'intelligence' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="bg-white p-8 rounded-3xl border border-[#e9e2da]/60 shadow-sm space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-violet-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-xl text-[#2a1e16]">AI Sales Assistant</h3>
                                                <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest">Generative Strategy Engine</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleGenerateAI}
                                            disabled={isGeneratingAI}
                                            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50"
                                        >
                                            {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Sales Draft'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {aiDraft && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`p-6 rounded-2xl border relative ${aiDraft.includes("configure GEMINI_API_KEY")
                                                    ? "bg-amber-50 border-amber-200"
                                                    : "bg-violet-50/50 border-violet-100"
                                                    }`}
                                            >
                                                {aiDraft.includes("configure GEMINI_API_KEY") ? (
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                                        <div className="space-y-1">
                                                            <p className="text-amber-900 text-sm font-bold">API Configuration Required</p>
                                                            <p className="text-amber-700 text-[11px] leading-relaxed italic">{aiDraft}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="relative group">
                                                            <textarea
                                                                value={editableDraft}
                                                                onChange={(e) => setEditableDraft(e.target.value)}
                                                                className="w-full bg-white/50 border border-violet-100 rounded-xl p-4 text-[#2a1e16] text-sm italic font-serif leading-relaxed focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none h-32"
                                                                placeholder="Edit your draft here..."
                                                            />
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Pencil className="w-3 h-3 text-violet-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-4">
                                                            <button
                                                                onClick={() => {
                                                                    const link = getWhatsAppLink(editForm.phone, editableDraft);
                                                                    if (link) window.open(link, '_blank');
                                                                    else alert("Please ensure a valid phone number is entered.");
                                                                }}
                                                                className="flex items-center gap-2 text-[10px] font-bold text-violet-600 uppercase hover:translate-x-1 transition-transform bg-white px-4 py-2.5 rounded-lg border border-violet-100 shadow-sm"
                                                            >
                                                                Send on WhatsApp <Send className="w-3 h-3" />
                                                            </button>
                                                            <p className="text-[9px] text-violet-400 italic">
                                                                Note: Link works even if the contact isn't saved.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                                <Receipt className="w-5 h-5 text-sky-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-xl text-[#2a1e16]">Pricing & Estimates</h3>
                                                <p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Live Financial Engine</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex gap-2 bg-gray-50 p-1 rounded-xl w-fit">
                                                <button onClick={() => setQuoteUnit('sqft')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${quoteUnit === 'sqft' ? 'bg-sky-600 text-white shadow-md' : 'text-[#8c7b70]'}`}>Sqft</button>
                                                <button onClick={() => setQuoteUnit('piece')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${quoteUnit === 'piece' ? 'bg-sky-600 text-white shadow-md' : 'text-[#8c7b70]'}`}>Piece</button>
                                            </div>
                                            <div className="flex gap-3">
                                                <input
                                                    type="number"
                                                    value={quotePrice}
                                                    onChange={e => setQuotePrice(e.target.value)}
                                                    placeholder="Enter Unit Price"
                                                    className="flex-1 bg-white border border-[#e9e2da] p-4 rounded-xl text-sm outline-none focus:border-sky-300 transition-all shadow-inner"
                                                />
                                                <button onClick={handleCalculateQuote} className="bg-sky-600 text-white px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-sky-700 shadow-lg shadow-sky-600/20">Generate</button>
                                            </div>
                                            <AnimatePresence>
                                                {quoteResult && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-3 overflow-hidden"
                                                    >
                                                        <textarea readOnly value={quoteResult} className="w-full bg-white border border-sky-100 rounded-xl p-4 text-[11px] h-32 font-mono text-sky-900 resize-none shadow-inner" />
                                                        <div className="flex flex-wrap gap-2">
                                                            <button onClick={handleDownloadPDF} className="flex-1 bg-white border border-sky-200 text-sky-600 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-50">
                                                                <FileText className="w-4 h-4" /> PDF
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm("Generate a formal payment link for this quote?")) return;
                                                                    const qty = parseInt(editForm.quantity.replace(/[^0-9]/g, '')) || 100;
                                                                    const result = await createPaymentLink({
                                                                        clientName: lead.clientName,
                                                                        clientEmail: lead.email,
                                                                        clientPhone: lead.phone,
                                                                        amount: Number(quotePrice) * qty,
                                                                        lineItems: [{ name: `Project Supply: ${editForm.productName || 'Material'}`, quantity: qty, rate: Number(quotePrice), amount: Number(quotePrice) * qty }],
                                                                        deliveryTimeline: 'Immediate',
                                                                        terms: '50% Advance',
                                                                        billingAddress: editForm.location || 'Site Address',
                                                                        shippingAddress: editForm.location || 'Site Address'
                                                                    });
                                                                    if (result.success) {
                                                                        prompt("Payment Link Generated. Copy & Send:", `https://claytile.in${result.linkPath}`);
                                                                    }
                                                                }}
                                                                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                                                            >
                                                                <Link2 className="w-4 h-4" /> Payment Link
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-xl text-[#2a1e16]">Logistics Radar</h3>
                                                <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">Real-time Freight Engine</p>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold text-[#8c7b70] uppercase ml-2">Total Load Weight (kg)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={editForm.totalWeightKg}
                                                        onChange={e => setEditForm({ ...editForm, totalWeightKg: Number(e.target.value) })}
                                                        className="flex-1 bg-white border border-[#e9e2da] p-4 rounded-xl outline-none text-sm font-bold shadow-inner"
                                                    />
                                                    <button
                                                        onClick={runFreightRadar}
                                                        disabled={isCalculatingFreight}
                                                        className="bg-[#2a1e16] text-white px-6 rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg"
                                                    >
                                                        {isCalculatingFreight ? <Loader2 className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {logisticsResult && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="bg-orange-50/40 p-5 rounded-2xl border border-orange-100 space-y-4 overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[8px] font-bold text-orange-400 uppercase tracking-widest mb-1">Distance</p>
                                                                <p className="text-xl font-serif text-[#2a1e16]">{logisticsResult.distanceKm} km</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-bold text-orange-400 uppercase tracking-widest mb-1">Estimated Cost</p>
                                                                <p className="text-xl font-bold text-orange-700">₹{logisticsResult.estimatedCost.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="pt-3 border-t border-orange-200/40 flex justify-between items-center">
                                                            <span className="text-[9px] font-bold text-[#8c7b70] flex items-center gap-1"><Landmark className="w-3 h-3" /> {logisticsResult.hub}</span>
                                                            <span className="text-[9px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">{logisticsResult.tier}</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'site' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Site Execution */}
                                <div className="bg-white p-8 rounded-3xl border border-[#e9e2da]/60 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#FAF9F6] rounded-xl flex items-center justify-center">
                                            <HardHat className="w-5 h-5 text-[#2a1e16]" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-[#2a1e16]">Execution Roadmap</h3>
                                            <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-widest">Site Operations Control</p>
                                        </div>
                                    </div>

                                    {isActiveSite ? (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase text-emerald-700">Active Deployment</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-600">ID: {siteData?._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#e9e2da]/40 space-y-4">
                                                <p className="text-[9px] font-bold text-[#8c7b70] uppercase">Technicians On Floor</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {assignedLabours.length > 0 ? assignedLabours.map(l => (
                                                        <div key={l._id} className="px-3 py-1.5 rounded-lg bg-[#2a1e16] text-white text-[10px] font-bold uppercase shadow-sm">
                                                            {l.name}
                                                        </div>
                                                    )) : (
                                                        <div className="text-[10px] text-gray-400 italic">No labour units assigned.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 text-center py-6">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#e9e2da]/50">
                                                <MapPin className="w-6 h-6 text-gray-300" />
                                            </div>
                                            <p className="text-sm text-[#8c7b70] leading-relaxed max-w-xs mx-auto">This project hasn't been activated for site operations yet.</p>
                                            <button
                                                onClick={handleCreateSite}
                                                disabled={isCreatingSite}
                                                className="w-full bg-[#2a1e16] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
                                            >
                                                {isCreatingSite ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Activate Fulfillment Layer'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Feedback / Post-Sales */}
                                <div className="bg-amber-50/30 p-8 rounded-3xl border border-amber-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100/50 rounded-xl flex items-center justify-center">
                                            <Star className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-[#2a1e16]">Client Testimony</h3>
                                            <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Quality Assurance</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold text-amber-600 uppercase ml-2">Material & Service Rating</p>
                                            <div className="flex justify-between gap-1 bg-white p-2 rounded-xl border border-amber-100 shadow-inner">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                        className={`flex-1 py-3 rounded-lg flex items-center justify-center transition-all ${feedbackForm.rating >= star ? 'bg-amber-400 text-white shadow-md' : 'text-amber-200 hover:text-amber-300'}`}
                                                    >
                                                        <Star className="w-5 h-5 fill-current" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Capture post-fulfillment insights..."
                                            value={feedbackForm.comment}
                                            onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                            className="w-full bg-white border border-amber-100 p-5 rounded-2xl text-sm min-h-[140px] outline-none focus:border-amber-400 transition-all shadow-inner resize-none"
                                        />
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={isSubmittingFeedback}
                                            className="w-full bg-amber-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50"
                                        >
                                            Commit Post-Sales Audit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
