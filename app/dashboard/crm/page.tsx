'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCRMLeads, updateCRMLeadStage, addCRMInteraction, createCRMLead, getCRMContacts } from '@/app/actions/crm';
import { generateCRMSmartReply } from '@/app/actions/crm-ai';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import {
    Phone,
    MessageSquare,
    Calendar,
    TrendingUp,
    AlertCircle,
    Plus,
    ArrowRight,
    Filter,
    Search,
    UserPlus,
    Clock,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Loader2,
    Building2,
    Target,
    ChevronDown
} from 'lucide-react';

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
        <Suspense fallback={<div>Loading CRM...</div>}>
            <CRMContent />
        </Suspense>
    );
}

function CRMContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [showNewDealModal, setShowNewDealModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isLoggingInteraction, setIsLoggingInteraction] = useState(false);

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiDraft, setAiDraft] = useState('');

    // Quote State
    const [showQuoteCalc, setShowQuoteCalc] = useState(false);
    const [quotePrice, setQuotePrice] = useState('120');
    const [quoteResult, setQuoteResult] = useState('');
    const [quoteUnit, setQuoteUnit] = useState<'piece' | 'sqft'>('sqft');
    const [contacts, setContacts] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'pipeline' | 'contacts'>('pipeline');

    const [importSearchTerm, setImportSearchTerm] = useState('');

    // New Deal Form State
    const [newDealForm, setNewDealForm] = useState({
        clientName: '',
        company: '',
        phone: '',
        email: '',
        potentialValue: '',
        stage: 'new',
        role: 'architect',
        requirements: ''
    });

    const [interactionForm, setInteractionForm] = useState({
        type: 'call',
        summary: '',
        nextAction: '',
        nextFollowUpDate: ''
    });

    useEffect(() => {
        fetchLeads();
        fetchContacts();

        // Handle Google Sync Complete
        const syncStatus = searchParams.get('sync');
        const syncCount = searchParams.get('count');
        if (syncStatus === 'complete') {
            alert(`🎉 Successfully synced ${syncCount} contacts to Sanity!`);
            fetchContacts();
            router.replace('/dashboard/crm');
        }
    }, [searchParams]);

    const fetchLeads = async () => {
        setLoading(true);
        const data = await getCRMLeads();
        setLeads(data);
        setLoading(false);
    };

    const fetchContacts = async () => {
        const data = await getCRMContacts();
        setContacts(data);
    };

    const handleStageChange = async (leadId: string, newStage: string) => {
        setLeads(prev => prev.map(l => l._id === leadId ? { ...l, stage: newStage } : l));
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

        const text = `*Quick Estimate for ${selectedLead.company || 'your project'}*\n\nHi ${selectedLead.clientName?.split(' ')[0] || 'there'},\nThanks for your enquiry. Preliminary cost for ${qty} ${unitLabel}:\n\n- Base Rate: ₹${price}/${quoteUnit}\n- Material Cost: ₹${subtotal.toLocaleString('en-IN')}\n- GST (18%): ₹${gst.toLocaleString('en-IN')}\n\n*Total Est: ₹${total.toLocaleString('en-IN')}* (Excl. Shipping)`;
        setQuoteResult(text);
    };

    const handleDownloadPDF = async () => {
        if (!selectedLead) return;
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF();

        doc.setFontSize(22); doc.text("QUOTATION", 14, 20);
        doc.setFontSize(10); doc.text("UrbanClay | premium terra-cotta solutions", 14, 28);
        doc.text(`Lead ID: ${selectedLead._id.slice(-6)}`, 150, 20);

        const qty = parseInt((selectedLead.requirements?.match(/\d+/)?.[0] || '100'));
        const price = parseInt(quotePrice);
        const subtotal = qty * price;
        const unitLabel = quoteUnit === 'sqft' ? 'sqft' : 'pcs';

        // @ts-ignore
        autoTable(doc, {
            startY: 40,
            head: [['Item', 'Qty', `Rate/${quoteUnit}`, 'Subtotal']],
            body: [[selectedLead.company || 'Materials', `${qty} ${unitLabel}`, `Rs.${price}`, `Rs.${subtotal}`]],
            theme: 'grid',
            headStyles: { fillColor: [42, 30, 22] }
        });

        doc.save(`UrbanClay_Quote_${selectedLead.clientName}.pdf`);
    };

    const handleLogInteraction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;

        setIsLoggingInteraction(true);
        try {
            await addCRMInteraction(selectedLead._id, interactionForm);
            fetchLeads(); // Refresh data
            setInteractionForm({ type: 'call', summary: '', nextAction: '', nextFollowUpDate: '' });
            setSelectedLead(null); // Close panel
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingInteraction(false);
        }
    };

    const handleCreateDeal = async (data: any) => {
        try {
            // Validation check before sending
            if (!data.clientName || !data.phone) {
                alert("❌ Client Name and Phone are required.");
                return;
            }

            const cleanData = {
                ...data,
                potentialValue: Number(data.potentialValue) || 0
            };

            await createCRMLead(cleanData);

            // Success cleanup
            setShowNewDealModal(false);
            setShowImportModal(false);
            setNewDealForm({
                clientName: '',
                company: '',
                phone: '',
                email: '',
                potentialValue: '',
                stage: 'new',
                role: 'architect',
                requirements: ''
            });

            // CRITICAL: Reset filters to ensure the new deal is visible immediately
            setSearchTerm('');
            setActiveTab('all');
            setViewMode('pipeline');

            await fetchLeads();
            alert("✅ Deal successfully started!");
        } catch (error: any) {
            console.error("Deal Creation Error:", error);
            alert(`❌ Failed to create deal: ${error.message || 'Unknown error'}`);
        }
    };

    const handleGoogleSync = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            alert("Google Client ID not found in environment variables. Please check Vercel settings.");
            return;
        }
        const redirectUri = `${window.location.origin}/api/crm/google/callback`;
        const scope = 'https://www.googleapis.com/auth/contacts.readonly';
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
        window.location.href = url;
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = (lead.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (lead.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' ? true : lead.stage === activeTab;
        return matchesSearch && matchesTab;
    });

    const isOverdue = (date: string) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    const stats = {
        totalValue: leads.reduce((acc, l) => acc + (l.potentialValue || 0), 0),
        hotLeads: leads.filter(l => l.stage !== 'won' && l.stage !== 'lost' && (l.potentialValue > 50000 || l.isSerious)).length,
        actionToday: leads.filter(l => l.nextFollowUp && new Date(l.nextFollowUp).toDateString() === new Date().toDateString()).length
    };

    const getDealHealth = (lastContact: string) => {
        if (!lastContact) return { label: 'New', color: 'text-blue-500', bg: 'bg-blue-50' };
        const days = Math.floor((new Date().getTime() - new Date(lastContact).getTime()) / (1000 * 3600 * 24));
        if (days <= 2) return { label: 'Healthy', color: 'text-green-500', bg: 'bg-green-50' };
        if (days <= 5) return { label: 'Stale', color: 'text-orange-500', bg: 'bg-orange-50' };
        return { label: 'At Risk', color: 'text-red-500', bg: 'bg-red-50' };
    };

    const getWhatsAppLink = (lead: any, template: string) => {
        const phone = lead.phone?.replace(/[^0-9]/g, '');
        const name = lead.clientName?.split(' ')[0] || 'Sir/Ma\'am';
        const templates: any = {
            followup: `Hi ${name}, this is UrbanClay. Checking in to see if you had a chance to review the quotation for your project. Let me know if you need any revisions.`,
            sample: `Hi ${name}, your UrbanClay samples have been prepared and are ready for dispatch. Could you please confirm the site contact person's number?`,
            closing: `Hi ${name}, we are finalizing our production schedule for this week. Would you like to confirm your order to ensure timely delivery?`
        };
        return `https://wa.me/${phone}?text=${encodeURIComponent(templates[template] || '')}`;
    };

    const overdueTasks = leads.filter(l => l.nextFollowUp && new Date(l.nextFollowUp) < new Date() && l.stage !== 'won' && l.stage !== 'lost');

    return (
        <div className="min-h-screen bg-[#FAF9F6] p-4 md:p-10 font-sans selection:bg-[#b45a3c]/10 selection:text-[#b45a3c]">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2a1e16] rounded-2xl flex items-center justify-center shadow-xl shadow-[#2a1e16]/20">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-4xl font-serif text-[#2a1e16] font-medium tracking-tight">Project Pipeline</h1>
                        </div>
                        <p className="text-[#8c7b70] font-medium ml-13">Drive architectural excellence and convert aspirations into reality.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-[#e9e2da]/50 shadow-sm">
                        <button
                            onClick={handleGoogleSync}
                            className="bg-white text-[#5d554f] px-5 py-2.5 rounded-xl flex items-center gap-2.5 hover:bg-[#2a1e16] hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider border border-[#e9e2da] shadow-sm active:scale-95"
                        >
                            <UserPlus className="w-4 h-4" />
                            Sync Contacts
                        </button>
                        <button
                            onClick={() => setShowNewDealModal(true)}
                            className="bg-[#b45a3c] text-white px-6 py-2.5 rounded-xl flex items-center gap-2.5 hover:bg-[#96472d] transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#b45a3c]/20 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Initialize New Deal
                        </button>
                    </div>
                </div>

                {/* Overdue Alerts - Sleeker */}
                {overdueTasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50/50 backdrop-blur-sm border border-rose-100 rounded-[2rem] p-8 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-rose-900 font-bold uppercase tracking-[0.15em] text-xs">High Priority Follow-ups</h2>
                            </div>
                            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{overdueTasks.length} Overdue</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {overdueTasks.slice(0, 3).map(task => (
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    key={task._id}
                                    onClick={() => setSelectedLead(task)}
                                    className="bg-white/80 p-5 rounded-3xl shadow-sm border border-rose-100/50 cursor-pointer hover:shadow-xl hover:shadow-rose-500/5 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative">
                                        <p className="font-serif text-[#2a1e16] text-lg font-medium mb-1">{task.clientName}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <AlertCircle className="w-3 h-3" />
                                                Action Required
                                            </p>
                                            <ArrowRight className="w-4 h-4 text-rose-300 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid - Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-[#e9e2da]/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mb-16 -mr-16 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative space-y-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl w-fit text-emerald-600 shadow-sm">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-[0.2em] mb-1">Pipeline Asset Value</p>
                                <h3 className="text-4xl font-serif font-medium text-[#2a1e16]">₹{stats.totalValue.toLocaleString('en-IN')}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#2a1e16] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mt-20 -mr-20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative space-y-4">
                            <div className="p-3 bg-orange-400/20 rounded-2xl w-fit text-orange-400 shadow-sm">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">High-Velocity Deals</p>
                                <h3 className="text-4xl font-serif font-medium text-white">{stats.hotLeads}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-[#e9e2da]/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mb-16 -mr-16 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative space-y-4">
                            <div className="p-3 bg-sky-50 rounded-2xl w-fit text-sky-600 shadow-sm">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-[0.2em] mb-1">Interactions Scheduled</p>
                                <h3 className="text-4xl font-serif font-medium text-sky-600 tracking-tight">{stats.actionToday}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Filter & View Controls */}
                <div className="bg-white/40 backdrop-blur-xl sticky top-24 z-40 p-3 rounded-3xl border border-white shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6 justify-between items-center px-6">
                    <div className="flex bg-[#f3f0ec] rounded-2xl p-1.5 border border-[#e9e2da]/50">
                        <button
                            onClick={() => setViewMode('pipeline')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-500 flex items-center gap-2 ${viewMode === 'pipeline' ? 'bg-[#2a1e16] text-white shadow-lg' : 'text-[#8c7b70] hover:text-[#2a1e16]'}`}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Deal Pipeline
                        </button>
                        <button
                            onClick={() => setViewMode('contacts')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-500 flex items-center gap-2 ${viewMode === 'contacts' ? 'bg-[#2a1e16] text-white shadow-lg' : 'text-[#8c7b70] hover:text-[#2a1e16]'}`}
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Address Book
                        </button>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {viewMode === 'pipeline' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeTab === 'all' ? 'bg-white border-[#2a1e16] text-[#2a1e16] shadow-sm' : 'bg-transparent border-transparent text-[#8c7b70]'}`}
                                >
                                    Global
                                </button>
                                {STAGES.map(stage => (
                                    <button
                                        key={stage.value}
                                        onClick={() => setActiveTab(stage.value)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeTab === stage.value ? 'bg-white border-[#2a1e16] text-[#2a1e16] shadow-sm' : 'bg-transparent border-transparent text-[#8c7b70]'}`}
                                    >
                                        {stage.label}
                                        <span className={`ml-2 px-1.5 rounded-md ${activeTab === stage.value ? 'bg-[#2a1e16] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {leads.filter(l => l.stage === stage.value).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="h-6 w-px bg-[#e9e2da] hidden md:block" />
                        <div className="relative group min-w-[240px]">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7b70] group-focus-within:text-[#b45a3c] transition-colors" />
                            <input
                                type="text"
                                placeholder={`Search ${viewMode === 'pipeline' ? 'deals' : 'contacts'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-[#f3f0ec] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#b45a3c]/30 focus:shadow-lg focus:shadow-[#b45a3c]/5 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Main List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-white rounded-[3rem] border border-[#e9e2da]/50 shadow-sm">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-[#b45a3c]/10 border-t-[#b45a3c] rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-[#2a1e16] rounded-xl animate-pulse" />
                                </div>
                            </div>
                            <p className="text-[#8c7b70] font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing Pipeline...</p>
                        </div>
                    ) : viewMode === 'pipeline' ? (
                        <div className="grid grid-cols-1 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredLeads.length > 0 ? (
                                    filteredLeads.map((lead) => (
                                        <motion.div
                                            key={lead._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            onClick={() => setSelectedLead(lead)}
                                            className={`group bg-white rounded-[2rem] p-7 border transition-all hover:shadow-2xl hover:shadow-black/[0.02] cursor-pointer flex flex-col md:flex-row items-center gap-10 ${isOverdue(lead.nextFollowUp) && lead.stage !== 'won' ? 'border-rose-100 bg-rose-50/20' : 'border-[#e9e2da]/60'}`}
                                        >
                                            {/* Client Identity */}
                                            <div className="flex-1 flex items-center gap-6 w-full md:w-auto">
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-[#2a1e16] rounded-2xl flex items-center justify-center text-white font-serif text-2xl shadow-xl shadow-[#2a1e16]/20 transition-transform group-hover:scale-105 duration-500">
                                                        {lead.clientName?.charAt(0)}
                                                    </div>
                                                    <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-lg border-4 border-white shadow-sm flex items-center justify-center ${getDealHealth(lead.lastContactDate).bg}`}>
                                                        <div className={`w-2 h-2 rounded-full ${getDealHealth(lead.lastContactDate).color.replace('text-', 'bg-')}`} />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-serif text-xl text-[#2a1e16] font-medium truncate group-hover:text-[#b45a3c] transition-colors">{lead.clientName}</h3>
                                                        {lead.statusIndicator && (
                                                            <span className="px-2 py-0.5 rounded-md bg-[#2a1e16]/5 text-[#2a1e16] text-[9px] font-bold uppercase tracking-wider border border-[#2a1e16]/10">
                                                                {lead.statusIndicator.replace('_', ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-[#8c7b70] font-medium">
                                                        <span className="truncate">{lead.company || 'Direct Client'}</span>
                                                        <span className="w-1 h-1 bg-[#e9e2da] rounded-full" />
                                                        <span className="text-[10px] uppercase tracking-widest">{getDealHealth(lead.lastContactDate).label} Transition</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financials & Status */}
                                            <div className="flex-[0.8] grid grid-cols-2 gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#e9e2da]/40 pt-6 md:pt-0 md:pl-10">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-[0.2em]">VALUATION</p>
                                                    <p className="font-serif text-lg text-[#2a1e16] font-medium italic">₹{lead.potentialValue?.toLocaleString('en-IN') || 'TBD'}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-[0.2em]">CURRENT STAGE</p>
                                                    <span className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider border inline-block ${STAGES.find(s => s.value === (lead.stage || 'new'))?.color}`}>
                                                        {STAGES.find(s => s.value === (lead.stage || 'new'))?.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Velocity / Next Action */}
                                            <div className="flex-1 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#e9e2da]/40 pt-6 md:pt-0 md:pl-10">
                                                <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-[0.2em]">NEXT MILESTONE</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {lead.nextFollowUp ? (
                                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isOverdue(lead.nextFollowUp) && lead.stage !== 'won' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-sky-50 border-sky-100 text-sky-600'}`}>
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                                {new Date(lead.nextFollowUp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-[#e9e2da] italic font-medium tracking-wide">No active follow-up</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Interaction Hub */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`, '_blank');
                                                    }}
                                                    className="w-12 h-12 flex items-center justify-center bg-[#f3f0ec] rounded-2xl text-[#2a1e16] hover:bg-[#b45a3c] hover:text-white transition-all duration-300 shadow-sm"
                                                >
                                                    <MessageSquare className="w-5 h-5" />
                                                </button>
                                                <button className="w-12 h-12 flex items-center justify-center bg-[#f3f0ec] rounded-2xl text-[#2a1e16] hover:bg-[#2a1e16] hover:text-white transition-all duration-300 shadow-sm">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-[#e9e2da]/50">
                                        <div className="w-20 h-20 bg-[#f3f0ec] rounded-full flex items-center justify-center mx-auto mb-6">
                                            <TrendingUp className="w-10 h-10 text-[#8c7b70]/30" />
                                        </div>
                                        <h3 className="text-2xl font-serif text-[#2a1e16] font-medium">Pipeline Initialized</h3>
                                        <p className="text-[#8c7b70] mt-2 font-medium">No deals match your current filtration.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {contacts
                                    .filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm))
                                    .map((contact, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={contact._id}
                                            className="bg-white p-7 rounded-[2rem] border border-[#e9e2da]/60 shadow-sm hover:shadow-2xl hover:shadow-black/[0.03] transition-all group flex flex-col justify-between h-full relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f3f0ec] rounded-full -mr-16 -mt-16 group-hover:bg-[#b45a3c]/5 transition-colors duration-500" />
                                            <div className="relative">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="w-14 h-14 bg-[#2a1e16] rounded-2xl flex items-center justify-center font-serif text-[#FAF9F6] text-xl shadow-lg shadow-[#2a1e16]/10 group-hover:scale-105 transition-transform duration-500">{contact.name.charAt(0)}</div>
                                                    <div className="text-right">
                                                        <h4 className="font-serif text-[#2a1e16] text-lg font-medium group-hover:text-[#b45a3c] transition-colors">{contact.name}</h4>
                                                        <p className="text-xs text-[#8c7b70] font-medium tracking-wide">{contact.phone || 'No direct dial'}</p>
                                                    </div>
                                                </div>
                                                <div className="w-full h-px bg-[#e9e2da]/40 mb-6" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewDealForm({
                                                            clientName: contact.name || '',
                                                            phone: contact.phone || '',
                                                            email: contact.email || '',
                                                            company: '',
                                                            potentialValue: '',
                                                            stage: 'new',
                                                            role: 'architect',
                                                            requirements: ''
                                                        });
                                                        setShowNewDealModal(true);
                                                    }}
                                                    className="w-full bg-[#f3f0ec] text-[#2a1e16] px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-3 border border-transparent group-hover:bg-[#b45a3c] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#b45a3c]/20"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Initialize Deal
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        </div>
                    )
                    }
                </div>

                {/* MODALS */}
                <AnimatePresence>
                    {/* NEW DEAL MODAL */}
                    {showNewDealModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowNewDealModal(false)}
                                className="fixed inset-0 bg-[#2a1e16]/60 backdrop-blur-xl z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(42,30,22,0.2)] z-[110] p-10 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F6] rounded-full -mr-16 -mt-16 opacity-50" />
                                <div className="relative">
                                    <h2 className="text-3xl font-serif text-[#2a1e16] font-medium mb-2">Initialize Deal</h2>
                                    <p className="text-[#8c7b70] text-sm mb-8 font-medium">Define the specifications for this architectural project.</p>

                                    <form onSubmit={(e) => { e.preventDefault(); handleCreateDeal(newDealForm); }} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="group relative">
                                                <input placeholder="Principal Client Name" className="w-full bg-[#f3f0ec] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium" value={newDealForm.clientName} onChange={e => setNewDealForm({ ...newDealForm, clientName: e.target.value })} required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <select className="w-full bg-[#f3f0ec] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-bold uppercase tracking-wider text-[#5d554f]" value={newDealForm.role} onChange={e => setNewDealForm({ ...newDealForm, role: e.target.value })}>
                                                    <option value="architect">Architect</option>
                                                    <option value="designer">Designer</option>
                                                    <option value="contractor">Contractor</option>
                                                    <option value="owner">Owner</option>
                                                </select>
                                                <input placeholder="Project / Firm Name" className="w-full bg-[#f3f0ec] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium" value={newDealForm.company} onChange={e => setNewDealForm({ ...newDealForm, company: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Direct Dial" className="w-full bg-[#f3f0ec] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium" value={newDealForm.phone} onChange={e => setNewDealForm({ ...newDealForm, phone: e.target.value })} required />
                                                <input placeholder="Est. Valuation (₹)" type="number" className="w-full bg-[#f3f0ec] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium" value={newDealForm.potentialValue} onChange={e => setNewDealForm({ ...newDealForm, potentialValue: e.target.value })} />
                                            </div>
                                            <textarea placeholder="Material Requirements & Specifications..." className="w-full bg-[#f3f0ec] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium min-h-[120px] resize-none" value={newDealForm.requirements} onChange={e => setNewDealForm({ ...newDealForm, requirements: e.target.value })} />
                                        </div>
                                        <button className="w-full bg-[#b45a3c] text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#b45a3c]/20 hover:bg-[#96472d] hover:-translate-y-0.5 transition-all active:scale-95">Open Opportunity</button>
                                        <button type="button" onClick={() => setShowNewDealModal(false)} className="w-full text-[#8c7b70] text-[10px] font-bold uppercase tracking-widest mt-2 hover:text-[#2a1e16] transition-colors">Discard Draft</button>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Side Panel Detail View */}
                <AnimatePresence>
                    {selectedLead && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setSelectedLead(null)}
                                className="fixed inset-0 bg-[#2a1e16]/40 backdrop-blur-sm z-50 p-4"
                            />
                            <motion.div
                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#FAF9F6] shadow-2xl z-[60] overflow-y-auto flex flex-col border-l border-[#e9e2da]/50"
                            >
                                {/* Modal Header */}
                                <div className="p-10 bg-white border-b border-[#e9e2da]/50 flex justify-between items-center sticky top-0 z-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2.5 py-1 bg-[#2a1e16] text-[#FAF9F6] rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                                ID: {selectedLead._id?.slice(-6).toUpperCase()}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${STAGES.find(s => s.value === (selectedLead.stage || 'new'))?.color}`}>
                                                {STAGES.find(s => s.value === (selectedLead.stage || 'new'))?.label}
                                            </span>
                                        </div>
                                        <h2 className="text-4xl font-serif font-medium text-[#2a1e16]">{selectedLead.clientName}</h2>
                                        <div className="flex items-center gap-2 text-[#8c7b70] font-medium text-sm">
                                            <span className="text-[#b45a3c]">{selectedLead.company || 'Private Project'}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                            <span>{selectedLead.phone}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="w-12 h-12 flex items-center justify-center bg-[#f3f0ec] rounded-2xl hover:bg-[#2a1e16] hover:text-white transition-all duration-300 group"
                                    >
                                        <XCircle className="w-6 h-6 text-[#8c7b70] group-hover:text-white transition-colors" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 p-10 space-y-10">
                                    {/* Command Bar / Stages */}
                                    <div className="bg-white p-7 rounded-[2rem] border border-[#e9e2da]/50 shadow-sm space-y-4">
                                        <h3 className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-[0.2em]">Transition Milestone</h3>
                                        <div className="flex flex-wrap gap-2.5">
                                            {STAGES.map(s => (
                                                <button
                                                    key={s.value}
                                                    onClick={() => handleStageChange(selectedLead._id, s.value)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${selectedLead.stage === s.value ? 'bg-[#2a1e16] border-[#2a1e16] text-white shadow-lg' : 'bg-[#FAF9F6] border-[#e9e2da] text-[#8c7b70] hover:border-[#b45a3c]/30 hover:text-[#b45a3c]'}`}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interaction Suite */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <h3 className="font-serif text-2xl text-[#2a1e16] font-medium">Interaction Studio</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleGenerateAI}
                                                    disabled={isGeneratingAI}
                                                    className="px-4 py-2 bg-violet-50 text-violet-700 text-[10px] font-bold rounded-xl border border-violet-100 hover:bg-violet-100 transition-all flex items-center gap-2"
                                                >
                                                    {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
                                                    AI Insights
                                                </button>
                                                <button
                                                    onClick={() => setShowQuoteCalc(!showQuoteCalc)}
                                                    className={`px-4 py-2 border rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${showQuoteCalc ? 'bg-[#b45a3c] border-[#b45a3c] text-white' : 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100'}`}
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    Pricing Engine
                                                </button>
                                            </div>
                                        </div>

                                        {showQuoteCalc && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] border border-sky-100 shadow-xl shadow-sky-900/5 mb-8">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Financial Simulation</h4>
                                                        <p className="text-[#2a1e16] font-serif text-lg">Generate Architectural Quote</p>
                                                    </div>
                                                    <button onClick={() => setShowQuoteCalc(false)} className="text-sky-300 hover:text-sky-600">×</button>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex bg-[#FAF9F6] p-1.5 rounded-2xl border border-[#e9e2da]/50 w-fit">
                                                        <button onClick={() => setQuoteUnit('sqft')} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${quoteUnit === 'sqft' ? 'bg-sky-600 text-white shadow-md' : 'text-[#8c7b70]'}`}>per Sqft</button>
                                                        <button onClick={() => setQuoteUnit('piece')} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${quoteUnit === 'piece' ? 'bg-sky-600 text-white shadow-md' : 'text-[#8c7b70]'}`}>per Piece</button>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 relative group">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-600 font-bold">₹</span>
                                                            <input type="number" placeholder="Unit Price" value={quotePrice} onChange={e => setQuotePrice(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-[#FAF9F6] border-2 border-transparent focus:border-sky-200 focus:bg-white rounded-2xl outline-none text-sm font-bold text-sky-900" />
                                                        </div>
                                                        <button onClick={handleCalculateQuote} className="bg-sky-600 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-95">Compute</button>
                                                    </div>

                                                    {quoteResult && (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                            <div className="relative">
                                                                <textarea readOnly value={quoteResult} className="w-full bg-[#FAF9F6] border-2 border-sky-50 rounded-[1.5rem] p-6 text-sm h-40 font-mono text-sky-900 leading-relaxed resize-none" />
                                                                <div className="absolute top-4 right-4 animate-pulse">
                                                                    <div className="w-2 h-2 bg-sky-400 rounded-full" />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <button onClick={handleDownloadPDF} className="bg-white border-2 border-sky-100 text-sky-600 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-sky-50 transition-all">Export Blueprint PDF</button>
                                                                <button onClick={() => window.open(`https://wa.me/${selectedLead.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(quoteResult)}`, '_blank')} className="bg-green-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">Dispatch WhatsApp</button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}

                                        {aiDraft && (
                                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-violet-50/50 p-8 rounded-[2rem] border border-violet-100 shadow-xl shadow-violet-900/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100 opacity-30 rounded-full -mr-12 -mt-12" />
                                                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-4">AI Copilot Recommendation</p>
                                                <p className="text-[#2a1e16] text-lg font-serif italic leading-relaxed">"{aiDraft}"</p>
                                                <button onClick={() => window.open(`https://wa.me/${selectedLead.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(aiDraft)}`, '_blank')} className="mt-6 text-xs font-bold text-violet-600 flex items-center gap-2 hover:gap-3 transition-all">
                                                    Execute this communication strategy <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        )}

                                        <div className="bg-white p-10 rounded-[2.5rem] border border-[#e9e2da]/60 shadow-sm space-y-8">
                                            <div className="grid grid-cols-4 gap-3">
                                                {['call', 'whatsapp', 'email', 'meeting'].map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setInteractionForm(f => ({ ...f, type }))}
                                                        className={`py-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-3 transition-all duration-300 border ${interactionForm.type === type ? 'bg-[#2a1e16] border-[#2a1e16] text-white shadow-xl' : 'bg-[#FAF9F6] border-[#e9e2da] text-[#8c7b70] hover:bg-white'}`}
                                                    >
                                                        {type === 'call' && <Phone className="w-5 h-5" />}
                                                        {type === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                                                        {type === 'email' && <AlertCircle className="w-5 h-5" />}
                                                        {type === 'meeting' && <Calendar className="w-5 h-5" />}
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>

                                            <form onSubmit={handleLogInteraction} className="space-y-6">
                                                <textarea
                                                    placeholder="Synthesize the discussion highlights..."
                                                    value={interactionForm.summary}
                                                    onChange={e => setInteractionForm(f => ({ ...f, summary: e.target.value }))}
                                                    className="w-full bg-[#FAF9F6] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-6 rounded-[1.5rem] outline-none transition-all text-sm font-medium min-h-[160px] resize-none"
                                                />
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest pl-2">Follow-up Window</label>
                                                        <input type="date" value={interactionForm.nextFollowUpDate} onChange={e => setInteractionForm(f => ({ ...f, nextFollowUpDate: e.target.value }))} className="w-full bg-[#FAF9F6] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-xl outline-none text-sm font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest pl-2">Strategic Next Step</label>
                                                        <input type="text" placeholder="e.g. Prototype delivery" value={interactionForm.nextAction} onChange={e => setInteractionForm(f => ({ ...f, nextAction: e.target.value }))} className="w-full bg-[#FAF9F6] border-2 border-transparent focus:border-[#b45a3c]/30 focus:bg-white p-4 rounded-xl outline-none text-sm font-medium" />
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={isLoggingInteraction || !interactionForm.summary} className="w-full bg-[#2a1e16] text-white font-bold py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-black/10 text-xs uppercase tracking-[0.2em] transform active:scale-[0.98]">
                                                    {isLoggingInteraction ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Commit to Pipeline'}
                                                </button>
                                            </form>
                                        </div>

                                        {/* Interaction Archive */}
                                        <div className="space-y-8 pt-6">
                                            <div className="flex items-center gap-4">
                                                <h3 className="font-serif text-2xl text-[#2a1e16] font-medium">Project Chronicles</h3>
                                                <div className="h-px flex-1 bg-[#e9e2da]/60" />
                                            </div>
                                            <div className="space-y-10 relative border-l-2 border-[#e9e2da] ml-4 pl-10">
                                                {selectedLead.interactions?.length > 0 ? (
                                                    selectedLead.interactions.map((int: any, idx: number) => (
                                                        <div key={int._key} className="relative">
                                                            <div className="absolute -left-[49px] top-1 w-4 h-4 bg-white border-4 border-[#2a1e16] rounded-full z-10" />
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm font-serif font-medium text-[#2a1e16]">{new Date(int.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                                        <span className="text-[10px] text-[#8c7b70] font-bold uppercase tracking-wider">{new Date(int.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    </div>
                                                                    <span className="px-3 py-1 bg-[#f3f0ec] text-[#5d554f] rounded-lg text-[9px] font-bold uppercase tracking-widest border border-[#e9e2da]">{int.type}</span>
                                                                </div>
                                                                <p className="text-[#5d554f] text-sm leading-relaxed font-medium bg-white p-5 rounded-2xl border border-[#e9e2da]/40 shadow-sm">{int.summary}</p>
                                                                {int.nextAction && (
                                                                    <div className="flex items-center gap-2 text-[10px] text-[#b45a3c] font-bold uppercase tracking-widest bg-[#b45a3c]/5 w-fit px-3 py-1.5 rounded-lg border border-[#b45a3c]/10">
                                                                        <ArrowRight className="w-3 h-3" />
                                                                        Immediate Focus: {int.nextAction}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-[#e9e2da]">
                                                        <p className="text-sm text-[#8c7b70] font-medium italic">Chronicle is empty. Initialize the project history above.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}
