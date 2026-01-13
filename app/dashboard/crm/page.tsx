'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCRMLeads, updateCRMLeadStage, addCRMInteraction, createCRMLead, getCRMContacts, getLabours, getSites, createSiteFromLead, addFeedback, updateCRMLead, deleteCRMLead } from '@/app/actions/crm';
import { generateCRMSmartReply } from '@/app/actions/crm-ai';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Plus, TrendingUp, UserPlus, Search, Clock,
    ArrowRight, Loader2, AlertCircle, Sparkles
} from 'lucide-react';

// Components
import { CRMStats } from '@/components/dashboard/crm/CRMStats';
import { CRMFilters } from '@/components/dashboard/crm/CRMFilters';
import { CRMLeadCard } from '@/components/dashboard/crm/CRMLeadCard';
import { CRMDetailPanel } from '@/components/dashboard/crm/CRMDetailPanel';
import { CRMKanbanBoard } from '@/components/dashboard/crm/CRMKanbanBoard';

const STAGES = [
    { label: 'New', value: 'new', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Qualified', value: 'qualified', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Sample Sent', value: 'sample', color: 'bg-rose-50 text-rose-700 border-rose-100' },
    { label: 'Quoted', value: 'quoted', color: 'bg-sky-50 text-sky-700 border-sky-100' },
    { label: 'Negotiating', value: 'negotiating', color: 'bg-violet-50 text-violet-700 border-violet-100' },
    { label: 'Won', value: 'won', color: 'bg-amber-50 text-amber-700 border-amber-100' }
];

export default function CRMDashboard() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-[#b45a3c]" /></div>}>
            <CRMContent />
        </Suspense>
    );
}

function CRMContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Core Data
    const [leads, setLeads] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [labours, setLabours] = useState<any[]>([]);
    const [sites, setSites] = useState<any[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'pipeline' | 'kanban' | 'contacts' | 'dormant' | 'priority'>('kanban');
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [showNewDealModal, setShowNewDealModal] = useState(false);

    // Action States
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiDraft, setAiDraft] = useState('');
    const [isLoggingInteraction, setIsLoggingInteraction] = useState(false);
    const [isCreatingSite, setIsCreatingSite] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    // Form States
    const [interactionForm, setInteractionForm] = useState({ type: 'call', summary: '', nextAction: '', nextFollowUpDate: '' });
    const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
    const [newDealForm, setNewDealForm] = useState({
        clientName: '', company: '', phone: '', email: '',
        potentialValue: '', stage: 'new', role: 'architect', requirements: '',
        location: '',
        leadDate: new Date().toISOString().split('T')[0],
        leadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        productName: '',
        quantity: ''
    });

    // Quote States
    const [showQuoteCalc, setShowQuoteCalc] = useState(false);
    const [quotePrice, setQuotePrice] = useState('120');
    const [quoteUnit, setQuoteUnit] = useState<'piece' | 'sqft'>('sqft');
    const [quoteResult, setQuoteResult] = useState('');

    useEffect(() => {
        fetchInitialData();

        const syncStatus = searchParams.get('sync');
        if (syncStatus === 'complete') fetchInitialData();
    }, [searchParams]);

    const fetchInitialData = async () => {
        setLoading(true);
        const [leadsData, contactsData, labsData, sitesData] = await Promise.all([
            getCRMLeads(),
            getCRMContacts(),
            getLabours(),
            getSites()
        ]);
        setLeads(leadsData);
        setContacts(contactsData);
        setLabours(labsData);
        setSites(sitesData);
        setLoading(false);
    };

    // Logic Helpers
    const isDormant = (lead: any) => {
        if (lead.stage === 'won' || lead.stage === 'lost') return false;
        const lastContact = new Date(lead.lastContactDate || lead._updatedAt);
        const diff = (new Date().getTime() - lastContact.getTime()) / (1000 * 3600 * 24);
        return diff >= 21;
    };

    const getDealHealth = (lastContact: string) => {
        if (!lastContact) return { label: 'Initial', color: 'text-blue-500', bg: 'bg-blue-50' };
        const days = Math.floor((new Date().getTime() - new Date(lastContact).getTime()) / (1000 * 3600 * 24));
        if (days <= 2) return { label: 'Optimal', color: 'text-green-500', bg: 'bg-green-50' };
        if (days <= 5) return { label: 'Caution', color: 'text-orange-500', bg: 'bg-orange-50' };
        return { label: 'At Risk', color: 'text-red-500', bg: 'bg-red-50' };
    };

    const isOverdue = (date: string) => date ? new Date(date) < new Date() : false;

    // Handlers
    const handleStageChange = async (leadId: string, newStage: string) => {
        const updatedLeads = leads.map(l => l._id === leadId ? { ...l, stage: newStage } : l);
        setLeads(updatedLeads);
        if (selectedLead?._id === leadId) setSelectedLead({ ...selectedLead, stage: newStage });
        await updateCRMLeadStage(leadId, newStage);
    };

    const handleGenerateAI = async () => {
        if (!selectedLead) return;
        setIsGeneratingAI(true);
        const reply = await generateCRMSmartReply(selectedLead, selectedLead.interactions || []);
        setAiDraft(reply);
        setIsGeneratingAI(false);
    };

    const handleCalculateQuote = () => {
        if (!selectedLead) return;
        const qty = parseInt((selectedLead.requirements?.match(/\d+/)?.[0] || '100'));
        const price = parseInt(quotePrice);
        const subtotal = qty * price;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;
        const unitLabel = quoteUnit === 'sqft' ? 'sqft' : 'pieces';

        const text = `*UrbanClay Design Estimate*\n\nProject: ${selectedLead.company || 'Private'}\nVolume: ${qty} ${unitLabel}\n\n- Material Rate: ₹${price}/${quoteUnit}\n- Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n- GST (18%): ₹${gst.toLocaleString('en-IN')}\n\n*Total Payable: ₹${total.toLocaleString('en-IN')}*`;
        setQuoteResult(text);
    };

    const handleDownloadPDF = async () => {
        if (!selectedLead) return;
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF();
        doc.setFontSize(22); doc.text("OFFICIAL QUOTATION", 14, 20);
        doc.setFontSize(10); doc.text("UrbanClay premium terra-cotta solutions", 14, 28);
        const qty = parseInt((selectedLead.requirements?.match(/\d+/)?.[0] || '100'));
        const subtotal = qty * parseInt(quotePrice);
        // @ts-ignore
        autoTable(doc, { startY: 40, head: [['Description', 'Qty', 'Rate', 'Total']], body: [[selectedLead.company || 'Wall Tiles', `${qty} ${quoteUnit}`, `Rs.${quotePrice}`, `Rs.${subtotal}`]], theme: 'grid', headStyles: { fillColor: [42, 30, 22] } });
        doc.save(`UrbanClay_Quote_${selectedLead.clientName}.pdf`);
    };

    const handleLogInteraction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;
        setIsLoggingInteraction(true);
        try {
            await addCRMInteraction(selectedLead._id, interactionForm);
            fetchInitialData();
            setInteractionForm({ type: 'call', summary: '', nextAction: '', nextFollowUpDate: '' });
            setSelectedLead(null);
        } catch (e) { alert("Interaction failed to log."); }
        finally { setIsLoggingInteraction(false); }
    };

    const handleCreateDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const cleanData = { ...newDealForm, potentialValue: Number(newDealForm.potentialValue) || 0 };
            await createCRMLead(cleanData);
            setShowNewDealModal(false);
            fetchInitialData();
            alert("Opportunity successfully initialized.");
        } catch (e) { alert("Creation failed."); }
    };

    const handleCreateSite = async () => {
        if (!selectedLead) return;
        setIsCreatingSite(true);
        try {
            await createSiteFromLead(selectedLead);
            fetchInitialData();
            alert("Site operations activated.");
        } catch (e) { alert("Site activation failed."); }
        finally { setIsCreatingSite(false); }
    };

    const handleUpdateLead = async (id: string, data: any) => {
        // Optimistic update
        if (selectedLead && selectedLead._id === id) {
            setSelectedLead({ ...selectedLead, ...data });
        }
        setLeads(prev => prev.map(l => l._id === id ? { ...l, ...data } : l));

        await updateCRMLead(id, data);
        await fetchInitialData(); // Full sync
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm("Are you sure you want to delete this opportunity? This cannot be undone.")) return;

        // Optimistic update
        setLeads(prev => prev.filter(l => l._id !== id));
        if (selectedLead?._id === id) setSelectedLead(null);

        await deleteCRMLead(id);
        await fetchInitialData();
    };

    const handleSubmitFeedback = async () => {
        if (!selectedLead) return;
        setIsSubmittingFeedback(true);
        try {
            await addFeedback({ name: selectedLead.clientName, rating: feedbackForm.rating, comment: feedbackForm.comment, leadId: selectedLead._id });
            setFeedbackForm({ rating: 5, comment: '' });
            alert("Testimony captured.");
        } catch (e) { alert("Feedback log failed."); }
        finally { setIsSubmittingFeedback(false); }
    };



    const filteredLeads = leads.filter(lead => {
        const terms = searchTerm.toLowerCase().split(' ').filter(t => t.length > 0);
        const searchableText = `${lead.clientName || ''} ${lead.company || ''} ${lead.phone || ''} ${lead.email || ''} ${lead.requirements || ''}`.toLowerCase();
        const matchesSearch = terms.length === 0 || terms.every(term => searchableText.includes(term));
        const dormant = isDormant(lead);
        if (viewMode === 'dormant') return matchesSearch && dormant;
        if (viewMode === 'kanban') return matchesSearch && !dormant;
        if (viewMode === 'priority') return matchesSearch && !dormant && isOverdue(lead.nextFollowUp);
        const matchesTab = activeTab === 'all' ? true : lead.stage === activeTab;
        return matchesSearch && matchesTab && !dormant;
    });

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const newStage = destination.droppableId;

        // Optimistic Update
        const updatedLeads = leads.map(l => l._id === draggableId ? { ...l, stage: newStage } : l);
        setLeads(updatedLeads);

        await updateCRMLeadStage(draggableId, newStage);
    };

    const overdueCount = leads.filter(l => isOverdue(l.nextFollowUp) && !['won', 'lost'].includes(l.stage)).length;

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-sans selection:bg-[#2a1e16] selection:text-white">
            <div className="max-w-[1400px] mx-auto space-y-12">

                {/* Executive Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                    <div>
                        <h1 className="text-3xl font-serif text-[#2a1e16] tracking-tight">Projects</h1>
                        <p className="text-[#8c7b70] text-sm mt-1 font-medium">Manage your pipeline and client relationships</p>
                    </div>
                    <div>
                        <button
                            onClick={() => setShowNewDealModal(true)}
                            className="bg-[#2a1e16] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#4a3e36] transition-all font-bold text-xs uppercase tracking-wider"
                        >
                            <Plus className="w-4 h-4" /> New Opportunity
                        </button>
                    </div>
                </div>

                {/* Overdue Alert Bar */}
                {overdueCount > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            <span className="text-[11px] font-black uppercase text-rose-700 tracking-wider font-sans">{overdueCount} Immediate follow-ups required to prevent deal death</span>
                        </div>
                        <button onClick={() => setViewMode('priority')} className="text-[10px] font-black text-rose-600 underline uppercase">View Priority →</button>
                    </motion.div>
                )}

                {/* Stats Matrix */}
                <CRMStats
                    stats={{
                        totalValue: leads.reduce((acc, l) => acc + (l.potentialValue || 0), 0),
                        hotLeads: leads.filter(l => !['won', 'lost'].includes(l.stage) && (l.potentialValue > 50000 || l.isSerious)).length,
                        actionToday: leads.filter(l => l.nextFollowUp && new Date(l.nextFollowUp).toDateString() === new Date().toDateString()).length,
                        dormantCount: leads.filter(l => isDormant(l)).length
                    }}
                    onViewDormant={() => setViewMode('dormant')}
                />

                {/* Filter Engine */}
                <CRMFilters
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    stages={STAGES}
                    leads={leads}
                />

                {/* Opportunity Ledger */}
                <div className="space-y-4 min-min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-[#b45a3c]" />
                            <p className="text-[10px] font-black uppercase text-[#8c7b70] tracking-[0.2em]">Synchronizing Archive...</p>
                        </div>
                    ) : viewMode === 'kanban' ? (
                        <CRMKanbanBoard
                            leads={filteredLeads}
                            stages={STAGES}
                            onDragEnd={handleDragEnd}
                            onLeadClick={setSelectedLead}
                            isOverdue={l => isOverdue(l)}
                            getDealHealth={getDealHealth}
                        />
                    ) : (viewMode === 'pipeline' || viewMode === 'dormant' || viewMode === 'priority') ? (
                        <div className="grid grid-cols-1 gap-4">
                            <AnimatePresence mode="popLayout">
                                {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                                    <CRMLeadCard
                                        key={lead._id}
                                        lead={lead}
                                        onClick={() => setSelectedLead(lead)}
                                        isOverdue={isOverdue(lead.nextFollowUp)}
                                        getDealHealth={getDealHealth}
                                        stages={STAGES}
                                    />
                                )) : (
                                    <div className="py-24 text-center">
                                        <h3 className="text-xl font-serif text-[#2a1e16] mb-2">No active opportunities</h3>
                                        <p className="text-sm text-[#8c7b70]">There are no deals in this stage matching your criteria.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contacts.filter(c => {
                                if (!searchTerm) return true;
                                const terms = searchTerm.toLowerCase().split(' ').filter(t => t.length > 0);
                                const searchableText = `${c.name || ''} ${c.phone || ''} ${c.email || ''}`.toLowerCase();
                                return terms.every(term => searchableText.includes(term));
                            }).map((contact, i) => (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={contact._id} className="bg-white p-7 rounded-[2rem] border border-[#e9e2da]/60 hover:shadow-2xl transition-all group flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-[#2a1e16] rounded-xl flex items-center justify-center text-white font-serif text-lg mb-6">{contact.name.charAt(0)}</div>
                                        <h4 className="font-serif text-xl text-[#2a1e16]">{contact.name}</h4>
                                        <p className="text-[11px] font-bold text-[#8c7b70] uppercase mt-1">{contact.phone || 'No direct dial'}</p>
                                    </div>
                                    <button onClick={() => { setNewDealForm({ ...newDealForm, clientName: contact.name, phone: contact.phone || '' }); setShowNewDealModal(true); }} className="mt-8 bg-[#FAF9F6] text-[#2a1e16] text-[10px] font-black uppercase py-4 rounded-xl border border-[#e9e2da] hover:bg-[#2a1e16] hover:text-white transition-all tracking-widest">Initialize Transition</button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Deep Detail Panel */}
                <AnimatePresence>
                    {selectedLead && (
                        <CRMDetailPanel
                            lead={selectedLead}
                            onClose={() => setSelectedLead(null)}
                            stages={STAGES}
                            handleStageChange={handleStageChange}
                            handleGenerateAI={handleGenerateAI}
                            isGeneratingAI={isGeneratingAI}
                            aiDraft={aiDraft}
                            showQuoteCalc={showQuoteCalc}
                            setShowQuoteCalc={setShowQuoteCalc}
                            quotePrice={quotePrice}
                            setQuotePrice={setQuotePrice}
                            quoteUnit={quoteUnit}
                            setQuoteUnit={setQuoteUnit}
                            handleCalculateQuote={handleCalculateQuote}
                            quoteResult={quoteResult}
                            handleDownloadPDF={handleDownloadPDF}
                            interactionForm={interactionForm}
                            setInteractionForm={setInteractionForm}
                            handleLogInteraction={handleLogInteraction}
                            isLoggingInteraction={isLoggingInteraction}
                            sites={sites}
                            labours={labours}
                            handleCreateSite={handleCreateSite}
                            isCreatingSite={isCreatingSite}
                            feedbackForm={feedbackForm}
                            setFeedbackForm={setFeedbackForm}
                            handleSubmitFeedback={handleSubmitFeedback}
                            isSubmittingFeedback={isSubmittingFeedback}
                            handleUpdateLead={handleUpdateLead}
                            handleDeleteLead={handleDeleteLead}
                        />
                    )}
                </AnimatePresence>

                {/* Creation Modal - Simplified Professional */}
                <AnimatePresence>
                    {showNewDealModal && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewDealModal(false)} className="fixed inset-0 bg-[#2a1e16]/60 backdrop-blur-xl z-[100]" />
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[3rem] shadow-2xl z-[110] p-12 overflow-hidden border border-white">
                                <form onSubmit={handleCreateDeal} className="space-y-8">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-serif text-[#2a1e16]">New Opportunity</h2>
                                        <p className="text-[10px] font-black text-[#8c7b70] uppercase tracking-widest">Initial project intake and specs</p>
                                    </div>
                                    <div className="space-y-4">
                                        <input required placeholder="Client Context (Individual/Firm)" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.clientName} onChange={e => setNewDealForm({ ...newDealForm, clientName: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Dial Signature" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.phone} onChange={e => setNewDealForm({ ...newDealForm, phone: e.target.value })} />
                                            <input type="email" placeholder="Email Address" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.email} onChange={e => setNewDealForm({ ...newDealForm, email: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Project Location (City)" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.location} onChange={e => setNewDealForm({ ...newDealForm, location: e.target.value })} />
                                            <input type="number" placeholder="Est. Valuation (₹)" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.potentialValue} onChange={e => setNewDealForm({ ...newDealForm, potentialValue: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="date" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.leadDate} onChange={e => setNewDealForm({ ...newDealForm, leadDate: e.target.value })} />
                                            <input type="time" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.leadTime} onChange={e => setNewDealForm({ ...newDealForm, leadTime: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Product Choice (e.g. Handmade)" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.productName} onChange={e => setNewDealForm({ ...newDealForm, productName: e.target.value })} />
                                            <input placeholder="Est. Quantity (units/sqft)" className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm" value={newDealForm.quantity} onChange={e => setNewDealForm({ ...newDealForm, quantity: e.target.value })} />
                                        </div>
                                        <textarea placeholder="Technical Requirements & Aesthetic Specifications..." className="w-full bg-[#FAF9F6] border border-[#e9e2da]/50 p-4 rounded-2xl outline-none focus:border-[#b45a3c]/30 transition-all font-medium text-sm h-32 resize-none" value={newDealForm.requirements} onChange={e => setNewDealForm({ ...newDealForm, requirements: e.target.value })} />
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setShowNewDealModal(false)} className="flex-1 text-[#8c7b70] font-black text-[10px] uppercase tracking-widest hover:text-[#2a1e16] transition-colors">Discard</button>
                                        <button type="submit" className="flex-[3] bg-[#b45a3c] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#b45a3c]/20">Commit to Archive</button>
                                    </div>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
