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
    Loader2
} from 'lucide-react';

const STAGES = [
    { label: 'New', value: 'new', color: 'bg-blue-100 text-blue-700' },
    { label: 'Qualified', value: 'qualified', color: 'bg-purple-100 text-purple-700' },
    { label: 'Sample Sent', value: 'sample', color: 'bg-orange-100 text-orange-700' },
    { label: 'Quoted', value: 'quoted', color: 'bg-amber-100 text-amber-700' },
    { label: 'Negotiating', value: 'negotiating', color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Won', value: 'won', color: 'bg-green-100 text-green-700' }
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

        const text = `*Quick Estimate for ${selectedLead.company || 'your project'}*\n\nHi ${selectedLead.clientName?.split(' ')[0] || 'there'},\nThanks for your enquiry. Preliminary cost for ${qty} units:\n\n- Base Rate: ₹${price}/unit\n- Material Cost: ₹${subtotal.toLocaleString('en-IN')}\n- GST (18%): ₹${gst.toLocaleString('en-IN')}\n\n*Total Est: ₹${total.toLocaleString('en-IN')}* (Excl. Shipping)`;
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

        // @ts-ignore
        autoTable(doc, {
            startY: 40,
            head: [['Item', 'Qty', 'Unit Price', 'Subtotal']],
            body: [[selectedLead.company || 'Materials', qty, `Rs.${price}`, `Rs.${subtotal}`]],
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
            await createCRMLead({
                ...data,
                potentialValue: parseFloat(data.potentialValue) || 0
            });
            setShowNewDealModal(false);
            setShowImportModal(false);
            setNewDealForm({ clientName: '', company: '', phone: '', email: '', potentialValue: '', stage: 'new', role: 'architect', requirements: '' });
            setViewMode('pipeline');
            fetchLeads();
            alert("✅ Deal successfully started!");
        } catch (error) {
            console.error(error);
            alert("❌ Failed to create deal. Please check fields.");
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
        <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-serif text-[#2a1e16] font-bold">CRM Engine 🎯</h1>
                        <p className="text-gray-500 mt-1">Track velocity, manage objections, and close deals.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleGoogleSync}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all font-bold shadow-sm"
                        >
                            <UserPlus className="w-4 h-4" />
                            Sync Contacts
                        </button>
                        <button
                            onClick={() => setShowNewDealModal(true)}
                            className="bg-[#2a1e16] text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-black transition-all font-bold shadow-lg shadow-gray-200"
                        >
                            <Plus className="w-4 h-4" />
                            New Deal
                        </button>
                    </div>
                </div>

                {/* TASK INBOX - NEW COMPONENT */}
                {overdueTasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 rounded-3xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-red-500" />
                            <h2 className="text-red-900 font-bold uppercase tracking-widest text-sm">Overdue Follow-ups ({overdueTasks.length})</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {overdueTasks.slice(0, 3).map(task => (
                                <div key={task._id} onClick={() => setSelectedLead(task)} className="bg-white p-4 rounded-2xl shadow-sm border border-red-200 cursor-pointer hover:shadow-md transition-all group">
                                    <p className="font-bold text-[#2a1e16] flex items-center justify-between">
                                        {task.clientName}
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
                                    </p>
                                    <p className="text-xs text-red-500 font-bold mt-1">Due {new Date(task.nextFollowUp).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pipeline Value</p>
                                <h3 className="text-2xl font-bold mt-1">₹ {stats.totalValue.toLocaleString('en-IN')}</h3>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-orange-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hot Deals</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.hotLeads}</h3>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Follow-ups Today</p>
                                <h3 className="text-2xl font-bold mt-1 text-blue-600 tracking-tight">{stats.actionToday}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter & View Control */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mr-4">
                        <button
                            onClick={() => setViewMode('pipeline')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${viewMode === 'pipeline' ? 'bg-[#2a1e16] text-white' : 'text-gray-400'}`}
                        >
                            Pipeline 🚀
                        </button>
                        <button
                            onClick={() => setViewMode('contacts')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${viewMode === 'contacts' ? 'bg-[#2a1e16] text-white' : 'text-gray-400'}`}
                        >
                            Address Book 📒
                        </button>
                    </div>

                    {viewMode === 'pipeline' && (
                        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-[#2a1e16] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
                            >
                                All Deals
                            </button>
                            {STAGES.map(stage => (
                                <button
                                    key={stage.value}
                                    onClick={() => setActiveTab(stage.value)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === stage.value ? 'bg-[#2a1e16] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
                                >
                                    {stage.label}
                                    <span className="ml-2 font-normal opacity-60">{leads.filter(l => l.stage === stage.value).length}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find a deal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#2a1e16] transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Main List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                            <p className="text-gray-400 font-medium">Loading...</p>
                        </div>
                    ) : viewMode === 'pipeline' ? (
                        filteredLeads.length > 0 ? (
                            filteredLeads.map((lead) => (
                                <motion.div
                                    key={lead._id}
                                    layoutId={lead._id}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`group bg-white rounded-2xl p-5 border transition-all hover:shadow-lg cursor-pointer flex flex-col md:flex-row items-center gap-6 ${isOverdue(lead.nextFollowUp) && lead.stage !== 'won' ? 'border-red-100 bg-red-50/10' : 'border-gray-100'}`}
                                >
                                    {/* Client Info */}
                                    <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#2a1e16] font-bold text-lg shrink-0">
                                                {lead.clientName?.charAt(0)}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getDealHealth(lead.lastContactDate).bg.replace('bg-', 'bg-')}`}>
                                                <div className={`w-full h-full rounded-full ${getDealHealth(lead.lastContactDate).color.replace('text-', 'bg-')}`} />
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-[#2a1e16] truncate group-hover:text-blue-600 transition-colors uppercase font-sans tracking-tight">{lead.clientName}</h3>
                                                {lead.statusIndicator && (
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[8px] font-bold uppercase border border-amber-100">
                                                        {lead.statusIndicator.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 truncate mt-1 flex items-center gap-2">
                                                {lead.company || 'Direct Client'}
                                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                {getDealHealth(lead.lastContactDate).label}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Deal Info */}
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Potential Value</p>
                                            <p className="font-bold text-gray-700">₹ {lead.potentialValue?.toLocaleString('en-IN') || 'TBD'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stage</p>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STAGES.find(s => s.value === (lead.stage || 'new'))?.color}`}>
                                                {STAGES.find(s => s.value === (lead.stage || 'new'))?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Follow Up Info */}
                                    <div className="flex-1 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Action</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {lead.nextFollowUp ? (
                                                <>
                                                    <Clock className={`w-3.5 h-3.5 ${isOverdue(lead.nextFollowUp) && lead.stage !== 'won' ? 'text-red-500' : 'text-blue-500'}`} />
                                                    <span className={`text-sm font-bold ${isOverdue(lead.nextFollowUp) && lead.stage !== 'won' ? 'text-red-600' : 'text-blue-600'}`}>
                                                        {new Date(lead.nextFollowUp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-300 italic">No task set</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`, '_blank');
                                            }}
                                            className="p-2 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-300 hover:text-[#2a1e16] hover:bg-gray-50 rounded-xl transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                                <h3 className="text-lg font-bold text-gray-600">No deals found</h3>
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contacts
                                .filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm))
                                .map(contact => (
                                    <div key={contact._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center font-bold text-[#2a1e16] text-lg">{contact.name.charAt(0)}</div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-[#2a1e16] uppercase text-sm truncate">{contact.name}</h4>
                                                <p className="text-xs text-gray-400 truncate">{contact.phone || 'No Phone'}</p>
                                            </div>
                                        </div>
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
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-md shadow-blue-100 flex items-center gap-1 shrink-0"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Start Deal
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    )
                )}
                </div>

                {/* MODALS */}
                <AnimatePresence>
                    {/* NEW DEAL MODAL */}
                    {showNewDealModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowNewDealModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[110] p-8"
                            >
                                <h2 className="text-2xl font-bold mb-6">Create New Deal</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleCreateDeal(newDealForm); }} className="space-y-4">
                                    <input placeholder="Client Name" className="w-full p-3 border rounded-xl" value={newDealForm.clientName} onChange={e => setNewDealForm({ ...newDealForm, clientName: e.target.value })} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select className="w-full p-3 border rounded-xl text-gray-500" value={newDealForm.role} onChange={e => setNewDealForm({ ...newDealForm, role: e.target.value })}>
                                            <option value="architect">Architect</option>
                                            <option value="designer">Designer</option>
                                            <option value="contractor">Contractor</option>
                                            <option value="owner">Owner</option>
                                        </select>
                                        <input placeholder="Company / Project" className="w-full p-3 border rounded-xl" value={newDealForm.company} onChange={e => setNewDealForm({ ...newDealForm, company: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="Phone" className="w-full p-3 border rounded-xl" value={newDealForm.phone} onChange={e => setNewDealForm({ ...newDealForm, phone: e.target.value })} required />
                                        <input placeholder="Potential Value (₹)" type="number" className="w-full p-3 border rounded-xl" value={newDealForm.potentialValue} onChange={e => setNewDealForm({ ...newDealForm, potentialValue: e.target.value })} />
                                    </div>
                                    <textarea placeholder="Specific Requirements (e.g. 200sqft Jaali)" className="w-full p-3 border rounded-xl h-24" value={newDealForm.requirements} onChange={e => setNewDealForm({ ...newDealForm, requirements: e.target.value })} />
                                    <button className="w-full bg-[#2a1e16] text-white py-3 rounded-xl font-bold">Start Deal</button>
                                </form>
                            </motion.div>
                        </>
                    )}

                    {/* IMPORT MODAL */}
                    {showImportModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowImportModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[110] p-8 max-h-[80vh] flex flex-col"
                            >
                                <h2 className="text-2xl font-bold mb-2">Import from Google</h2>
                                <p className="text-gray-500 mb-4">Click on a contact to start a deal with them.</p>

                                <div className="relative mb-4">
                                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or number..."
                                        value={importSearchTerm}
                                        onChange={(e) => setImportSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                    {importData
                                        .filter(c =>
                                            c.name?.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
                                            c.phone?.includes(importSearchTerm) ||
                                            c.email?.toLowerCase().includes(importSearchTerm.toLowerCase())
                                        )
                                        .map((c, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100" onClick={() => handleCreateDeal({ clientName: c.name, phone: c.phone, email: c.email, stage: 'new' })}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600">{c.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-bold text-sm uppercase">{c.name}</p>
                                                        <p className="text-xs text-gray-400">{c.phone || c.email}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-300" />
                                            </div>
                                        ))}
                                </div>
                                <button onClick={() => setShowImportModal(false)} className="mt-6 w-full py-3 text-gray-400 font-bold">Cancel</button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Detail View / Logging - Using a Side Panel / Modal approach */}
                <AnimatePresence>
                    {selectedLead && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedLead(null)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 p-4"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[60] overflow-y-auto flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-8 border-b border-gray-100 flex justify-between items-start shrink-0">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-widest">
                                                Inquiry ID: {selectedLead._id?.slice(-6)}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#2a1e16]">{selectedLead.clientName}</h2>
                                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                                            {selectedLead.company} • {selectedLead.phone}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                    >
                                        <XCircle className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 p-8 space-y-8">
                                    {/* Quick Actions & Stage */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Update Deal Stage</label>
                                            <div className="flex flex-wrap gap-2">
                                                {STAGES.map(s => (
                                                    <button
                                                        key={s.value}
                                                        onClick={() => handleStageChange(selectedLead._id, s.value)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${selectedLead.stage === s.value ? 'bg-white text-[#2a1e16] shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                                    >
                                                        {s.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interaction Logging Form */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-[#2a1e16] flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                                Engage & Log
                                            </h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleGenerateAI}
                                                    disabled={isGeneratingAI}
                                                    className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-100 hover:bg-purple-100 transition-all flex items-center gap-1"
                                                >
                                                    {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨ AI Draft'}
                                                </button>
                                                <button
                                                    onClick={() => setShowQuoteCalc(!showQuoteCalc)}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-1"
                                                >
                                                    📜 Quick Quote
                                                </button>
                                                <button onClick={() => window.open(getWhatsAppLink(selectedLead, 'followup'), '_blank')} className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded border border-green-100 hover:bg-green-100 transition-all">💬 Followup</button>
                                            </div>
                                        </div>

                                        {showQuoteCalc && (
                                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 mb-6">
                                                <div className="flex justify-between mb-4">
                                                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pricing Calculator</h4>
                                                    <button onClick={() => setShowQuoteCalc(false)} className="text-blue-300">×</button>
                                                </div>
                                                <div className="flex gap-3 mb-4">
                                                    <input
                                                        type="number"
                                                        placeholder="Price per unit"
                                                        value={quotePrice}
                                                        onChange={e => setQuotePrice(e.target.value)}
                                                        className="flex-1 p-3 bg-white border border-blue-100 rounded-xl outline-none text-sm"
                                                    />
                                                    <button onClick={handleCalculateQuote} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Calculate</button>
                                                </div>
                                                {quoteResult && (
                                                    <div className="space-y-3">
                                                        <textarea readOnly value={quoteResult} className="w-full bg-white/50 border border-blue-100 rounded-xl p-3 text-xs h-24 font-mono" />
                                                        <div className="flex gap-2">
                                                            <button onClick={handleDownloadPDF} className="flex-1 bg-white border border-blue-200 text-blue-600 py-2 rounded-xl text-xs font-bold">⬇️ PDF</button>
                                                            <button onClick={() => {
                                                                const phone = selectedLead.phone?.replace(/[^0-9]/g, '');
                                                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(quoteResult)}`, '_blank');
                                                            }} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold">💬 Send</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {aiDraft && (
                                            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 mb-4 animate-in fade-in slide-in-from-top-2">
                                                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">AI Suggestion</p>
                                                <p className="text-sm text-purple-900 leading-relaxed italic">"{aiDraft}"</p>
                                                <button
                                                    onClick={() => {
                                                        const phone = selectedLead.phone?.replace(/[^0-9]/g, '');
                                                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(aiDraft)}`, '_blank');
                                                    }}
                                                    className="mt-3 text-[10px] font-bold text-purple-600 underline"
                                                >
                                                    Send this via WhatsApp →
                                                </button>
                                            </div>
                                        )}
                                        <form onSubmit={handleLogInteraction} className="space-y-4 bg-blue-50/10 p-5 rounded-2xl border border-blue-100/30">
                                            <div className="flex gap-2">
                                                {['call', 'whatsapp', 'email', 'meeting'].map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setInteractionForm(f => ({ ...f, type }))}
                                                        className={`px-3 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${interactionForm.type === type ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'}`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                placeholder="What was discussed?"
                                                value={interactionForm.summary}
                                                onChange={e => setInteractionForm(f => ({ ...f, summary: e.target.value }))}
                                                className="w-full bg-white border border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 transition-all text-sm min-h-[100px]"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Next Follow-up</label>
                                                    <input
                                                        type="date"
                                                        value={interactionForm.nextFollowUpDate}
                                                        onChange={e => setInteractionForm(f => ({ ...f, nextFollowUpDate: e.target.value }))}
                                                        className="w-full bg-white border border-gray-100 rounded-xl p-2.5 outline-none text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Next Action</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Share quote"
                                                        value={interactionForm.nextAction}
                                                        onChange={e => setInteractionForm(f => ({ ...f, nextAction: e.target.value }))}
                                                        className="w-full bg-white border border-gray-100 rounded-xl p-2.5 outline-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoggingInteraction || !interactionForm.summary}
                                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100 mt-2"
                                            >
                                                {isLoggingInteraction ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Log'}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Interaction History */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-[#2a1e16] flex items-center gap-2 underline decoration-blue-200 decoration-2 underline-offset-4">
                                            Timeline
                                        </h3>
                                        <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-6 pt-2">
                                            {selectedLead.interactions?.length > 0 ? (
                                                selectedLead.interactions.map((int: any, idx: number) => (
                                                    <div key={int._key} className="relative">
                                                        <div className="absolute -left-[31px] top-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white" />
                                                        <div className="bg-white rounded-xl space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(int.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[9px] font-bold uppercase border border-gray-100">{int.type}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 leading-relaxed font-sans">{int.summary}</p>
                                                            {int.nextAction && (
                                                                <p className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-1 rounded-lg">
                                                                    Next: {int.nextAction}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No historical logs. Log your first conversation above.</p>
                                            )}
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
