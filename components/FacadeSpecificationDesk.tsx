'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Download, Building2, Home, Landmark, Hotel, Building, LayoutTemplate, Layers, Frame, Cuboid, ChevronLeft } from 'lucide-react';
import { submitLead } from '@/app/actions/submit-lead';
import Image from 'next/image';

// Types
type ProjectType = "Commercial" | "Residential" | "Hospitality" | "Institutional" | "High Rise" | "";
type WallCondition = "Concrete Wall" | "Block Masonry" | "Steel Frame Structure" | "Existing Building Retrofit" | "";
type PerformancePriority = "Ventilated Facade" | "Structural Brick" | "Lightweight Cladding" | "Decorative Screen" | "Thermal Performance" | "";

interface RecommendedSystem {
    name: string;
    description: string;
    specs: string[];
    link: string;
    image: string;
}

const SYSTEMS: Record<string, RecommendedSystem> = {
    airbrick: {
        name: "AirBrick Ventilated System",
        description: "Rear-ventilated clay brick facade engineered for thermal performance and moisture control.",
        specs: ["System Depth: 90–110 mm", "Fire Rating: A1 Non-Combustible", "Water Absorption: <3%"],
        link: "/products/airbrick-ventilated-system",
        image: "/images/premium-terracotta-facade.png"
    },
    airbrick2: {
        name: "AirBrick II Ventilated System",
        description: "Advanced ventilated facade system designed for high wind load resistance and high-rise applications.",
        specs: ["System Depth: 120–150 mm", "Wind Load: 2.5 kPa", "Fire Rating: A1 Non-Combustible"],
        link: "/products/airbrick-2-ventilated-system",
        image: "/images/commercial-facade-cladding.png"
    },
    hp10: {
        name: "HP-10 Structural Brick",
        description: "High-performance load-bearing clay brick ensuring superior structural integrity.",
        specs: ["Compressive Strength: >35 MPa", "Thermal Conductivity: 0.6 W/mK", "100% Recyclable"],
        link: "/products/hp-10-structural-brick",
        image: "/images/brick-raw.png"
    },
    flexible: {
        name: "Flexible Brick Tile System",
        description: "Ultra-lightweight, bendable clay tiles perfect for retrofits and curved surfaces.",
        specs: ["Weight: 4-5 kg/sqm", "Thickness: 2-3 mm", "Installation: Dry/Wet adhesive"],
        link: "/products/flexible-brick-tiles",
        image: "/images/flexible-brick-showcase.png"
    },
    jali: {
        name: "Terracotta Jali System",
        description: "Architectural decorative screens for natural ventilation, shading, and aesthetic facades.",
        specs: ["Open Area: Custom 30-60%", "Finish: Natural/Glazed", "Installation: Mortar/Dry"],
        link: "/products/terracotta-jali",
        image: "/images/breeze-block-interior.png"
    },
    panels: {
        name: "Terracotta Rainscreen Panels",
        description: "Large format, highly durable terracotta facade panels for commercial thermal performance.",
        specs: ["Format: Up to 1500x600mm", "Weight: ~32 kg/sqm", "Frost Resistance: 100 Cycles"],
        link: "/products/terracotta-panels",
        image: "/images/technical-detail.png"
    }
};

const getRecommendation = (
    projectType: ProjectType,
    wallCondition: WallCondition,
    priority: PerformancePriority
): RecommendedSystem => {
    if (priority === "Ventilated Facade") {
        if (projectType === "High Rise") return SYSTEMS.airbrick2;
        return SYSTEMS.airbrick;
    }
    if (priority === "Structural Brick") return SYSTEMS.hp10;
    if (priority === "Lightweight Cladding" || wallCondition === "Existing Building Retrofit") return SYSTEMS.flexible;
    if (priority === "Decorative Screen") return SYSTEMS.jali;

    // Fallbacks
    if (projectType === "Commercial" || projectType === "Institutional") return SYSTEMS.panels;

    return SYSTEMS.airbrick; // Default
};

// Wizard Config
const PROJECT_TYPES = [
    { title: "Commercial", desc: "Office buildings, malls, corporate campuses.", icon: <Building2 className="w-5 h-5" /> },
    { title: "Residential", desc: "Premium villas, apartments, housing complexes.", icon: <Home className="w-5 h-5" /> },
    { title: "Hospitality", desc: "Hotels, resorts, luxury retreats.", icon: <Hotel className="w-5 h-5" /> },
    { title: "Institutional", desc: "Schools, universities, hospitals, museums.", icon: <Landmark className="w-5 h-5" /> },
    { title: "High Rise", desc: "Towers and skyscrapers.", icon: <Building className="w-5 h-5" /> }
];

const WALL_CONDITIONS = [
    { title: "Concrete Wall", icon: <Cuboid className="w-5 h-5" /> },
    { title: "Block Masonry", icon: <LayoutTemplate className="w-5 h-5" /> },
    { title: "Steel Frame Structure", icon: <Frame className="w-5 h-5" /> },
    { title: "Existing Building Retrofit", icon: <Layers className="w-5 h-5" /> }
];

const PERFORMANCE_PRIORITIES = [
    "Ventilated Facade",
    "Structural Brick",
    "Lightweight Cladding",
    "Decorative Screen",
    "Thermal Performance"
];

export default function FacadeSpecificationDesk() {
    const [step, setStep] = useState(1);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

    const [projectType, setProjectType] = useState<ProjectType>("");
    const [wallCondition, setWallCondition] = useState<WallCondition>("");
    const [performancePriority, setPerformancePriority] = useState<PerformancePriority>("");

    const [recommendation, setRecommendation] = useState<RecommendedSystem | null>(null);

    // Form State
    const [leadData, setLeadData] = useState({
        name: "",
        email: "",
        phone: "",
        firmName: "",
        location: "", // city
        area: "",     // quantity
        role: "Architect"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showMobileLeadForm, setShowMobileLeadForm] = useState(false);

    const step2Ref = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<HTMLDivElement>(null);
    const recommendationRef = useRef<HTMLDivElement>(null);

    // Desktop Auto-scroll logic
    useEffect(() => {
        if (window.innerWidth >= 1024 && !isMobileOpen) {
            if (step === 2 && step2Ref.current) {
                step2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (step === 3 && step3Ref.current) {
                step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (step === 4 && recommendationRef.current) {
                recommendationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [step, isMobileOpen]);

    const handleProjectTypeSelect = (type: ProjectType) => {
        setProjectType(type);
        if (window.innerWidth >= 1024) setStep(2);
    };

    const handleWallConditionSelect = (condition: WallCondition) => {
        setWallCondition(condition);
        if (window.innerWidth >= 1024) setStep(3);
    };

    const handlePrioritySelect = (priority: PerformancePriority) => {
        setPerformancePriority(priority);
        if (window.innerWidth >= 1024) {
            const rec = getRecommendation(projectType, wallCondition, priority);
            setRecommendation(rec);
            setStep(4);
        }
    };

    const handleNextMobile = () => {
        setDirection(1);
        if (step === 3) {
            const rec = getRecommendation(projectType, wallCondition, performancePriority);
            setRecommendation(rec);
            setStep(4);
        } else {
            setStep(s => s + 1);
        }
    };

    const handleBackMobile = () => {
        setDirection(-1);
        if (step === 4 && showMobileLeadForm) {
            setShowMobileLeadForm(false);
        } else {
            setStep(s => Math.max(1, s - 1));
        }
    };

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await submitLead({
                name: leadData.name,
                email: leadData.email,
                contact: leadData.phone,
                phone: leadData.phone,
                firmName: leadData.firmName,
                city: leadData.location,
                quantity: leadData.area,
                role: leadData.role,
                product: recommendation?.name || "Facade Desk General",
                notes: `Facade Desk Spec: ${projectType} | ${wallCondition} | ${performancePriority}`
            });
            if (res.success) {
                setIsSubmitted(true);
            } else {
                throw new Error("Failed to submit");
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert("Submission error. Please check your connection or contact us directly on WhatsApp.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startOver = () => {
        setProjectType("");
        setWallCondition("");
        setPerformancePriority("");
        setRecommendation(null);
        setIsSubmitted(false);
        setShowMobileLeadForm(false);
        setLeadData({
            name: "", email: "", phone: "", firmName: "", location: "", area: "", role: "Architect"
        });
        setStep(1);
        setIsMobileOpen(false);
    };

    const mobileVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------

    return (
        <>
            {/* MOBILE VIEW PORTAL */}
            {isMobileOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-[#FAF9F6] z-[150] flex flex-col overflow-hidden text-[var(--ink)]">
                    {/* Mobile Header Loader/Progress */}
                    <div className="pt-unsafe-top bg-white border-b border-[var(--line)] px-4 py-4 flex items-center justify-between z-10 sticky top-0">
                        <button onClick={step > 1 ? handleBackMobile : startOver} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--sand)] transition-colors active:scale-95">
                            <ChevronLeft className="w-5 h-5 text-[var(--ink)]" />
                        </button>
                        {!isSubmitted && (
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--ink)]/50">
                                    {step <= 3 ? `Step ${step} of 3` : (showMobileLeadForm ? 'Details' : 'Recommendation')}
                                </span>
                                {step <= 3 && (
                                    <div className="w-24 h-1 bg-[var(--line)] rounded-full mt-2 overflow-hidden flex">
                                        <div className="h-full bg-[var(--terracotta)] transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="w-10"></div> {/* Spacer for symmetry */}
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 mb-24">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            {isSubmitted ? (
                                <motion.div
                                    key="submitted"
                                    custom={direction}
                                    variants={mobileVariants}
                                    initial="enter" animate="center" exit="exit"
                                    transition={{ type: "tween", duration: 0.3 }}
                                    className="flex flex-col items-center justify-center h-full text-center py-10"
                                >
                                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-serif text-[var(--ink)] mb-4">Thank you.</h2>
                                    <p className="text-sm text-[var(--ink)]/60 mb-10 w-4/5 mx-auto leading-relaxed">
                                        Our facade engineering team will review your project and send technical documentation shortly.
                                    </p>
                                    <div className="space-y-3 w-full">
                                        <button className="w-full flex items-center justify-center gap-2 bg-[var(--sand)] hover:bg-[var(--line)] text-[var(--ink)] px-4 py-4 rounded-xl text-sm font-semibold transition-colors">
                                            <Download className="w-4 h-4" />
                                            Download Technical Sheet
                                        </button>
                                        <button onClick={startOver} className="w-full bg-[var(--ink)] text-white hover:bg-black px-4 py-4 rounded-xl text-sm font-semibold transition-colors">
                                            Explore Facade Systems
                                        </button>
                                    </div>
                                </motion.div>
                            ) : step === 1 ? (
                                <motion.div
                                    key="step1" custom={direction} variants={mobileVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.3 }}
                                    className="w-full max-w-md mx-auto"
                                >
                                    <h3 className="text-2xl font-serif mb-6 leading-tight">What is your project type?</h3>
                                    <div className="flex flex-col gap-3">
                                        {PROJECT_TYPES.map(type => (
                                            <button
                                                key={type.title}
                                                onClick={() => setProjectType(type.title as ProjectType)}
                                                className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-start gap-4 min-h-[72px] ${projectType === type.title
                                                    ? 'border-[var(--terracotta)] bg-[#fff5f2] shadow-sm ring-1 ring-[var(--terracotta)]'
                                                    : 'border-[var(--line)] bg-white active:bg-[var(--sand)]'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 ${projectType === type.title ? 'text-[var(--terracotta)]' : 'text-[var(--ink)]/40'}`}>
                                                    {type.icon}
                                                </div>
                                                <div>
                                                    <h4 className={`text-base font-bold ${projectType === type.title ? 'text-[var(--terracotta)]' : 'text-[var(--ink)]'}`}>{type.title}</h4>
                                                    <p className="text-xs text-[var(--ink)]/50 mt-1 leading-relaxed">{type.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : step === 2 ? (
                                <motion.div
                                    key="step2" custom={direction} variants={mobileVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.3 }}
                                    className="w-full max-w-md mx-auto"
                                >
                                    <h3 className="text-2xl font-serif mb-6 leading-tight">What type of wall or structure are you working with?</h3>
                                    <div className="flex flex-col gap-3">
                                        {WALL_CONDITIONS.map(condition => (
                                            <button
                                                key={condition.title}
                                                onClick={() => setWallCondition(condition.title as WallCondition)}
                                                className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-center gap-4 min-h-[72px] ${wallCondition === condition.title
                                                    ? 'border-[var(--terracotta)] bg-[#fff5f2] shadow-sm ring-1 ring-[var(--terracotta)]'
                                                    : 'border-[var(--line)] bg-white active:bg-[var(--sand)]'
                                                    }`}
                                            >
                                                <div className={`${wallCondition === condition.title ? 'text-[var(--terracotta)]' : 'text-[var(--ink)]/40'}`}>
                                                    {condition.icon}
                                                </div>
                                                <h4 className={`text-base font-bold ${wallCondition === condition.title ? 'text-[var(--terracotta)]' : 'text-[var(--ink)]'}`}>{condition.title}</h4>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : step === 3 ? (
                                <motion.div
                                    key="step3" custom={direction} variants={mobileVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.3 }}
                                    className="w-full max-w-md mx-auto"
                                >
                                    <h3 className="text-2xl font-serif mb-6 leading-tight">What is the main facade requirement?</h3>
                                    <div className="flex flex-col gap-3">
                                        {PERFORMANCE_PRIORITIES.map(priority => (
                                            <button
                                                key={priority}
                                                onClick={() => setPerformancePriority(priority as PerformancePriority)}
                                                className={`p-5 rounded-xl border transition-all duration-200 text-left min-h-[72px] ${performancePriority === priority
                                                    ? 'border-[var(--terracotta)] bg-[#fff5f2] shadow-sm ring-1 ring-[var(--terracotta)]'
                                                    : 'border-[var(--line)] bg-white active:bg-[var(--sand)]'
                                                    }`}
                                            >
                                                <h4 className={`text-base font-bold ${performancePriority === priority ? 'text-[var(--terracotta)]' : 'text-[var(--ink)]'}`}>{priority}</h4>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : step === 4 && recommendation ? (
                                <motion.div
                                    key="step4" custom={direction} variants={mobileVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.3 }}
                                    className="w-full max-w-md mx-auto"
                                >
                                    {!showMobileLeadForm ? (
                                        <>
                                            <div className="mb-6">
                                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--terracotta)] block border-b border-[var(--terracotta)]/20 pb-2 mb-4">Recommended Facade System</span>
                                                <h3 className="text-3xl font-serif leading-tight mb-4">{recommendation.name}</h3>
                                                <p className="text-sm text-[var(--ink)]/70 leading-relaxed mb-6 bg-white p-4 rounded-xl border border-[var(--line)] shadow-sm">
                                                    {recommendation.description}
                                                </p>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                {recommendation.specs.map((spec, i) => {
                                                    const [label, val] = spec.split(': ');
                                                    return (
                                                        <div key={i} className="flex flex-col border-l-2 border-[var(--terracotta)] pl-4">
                                                            <span className="text-xs uppercase text-[var(--ink)]/50 tracking-wider mb-1">{label}</span>
                                                            <span className="text-sm font-bold text-[var(--ink)]">{val}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="space-y-3">
                                                <button onClick={() => setShowMobileLeadForm(true)} className="w-full bg-[var(--terracotta)] hover:bg-[#c25e3b] text-white px-4 py-4 rounded-xl text-sm font-bold shadow-lg shadow-[var(--terracotta)]/20 transition-all active:scale-95 flex justify-center items-center gap-2">
                                                    <Download className="w-4 h-4" /> Download Technical Sheet
                                                </button>
                                                <button onClick={() => setShowMobileLeadForm(true)} className="w-full bg-white text-[var(--ink)] border border-[var(--line)] px-4 py-4 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
                                                    Request Sample
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-serif mb-6 leading-tight">Where should we send the technical package?</h3>
                                            <form onSubmit={handleLeadSubmit} className="space-y-4">
                                                <input required type="text" placeholder="Full Name" value={leadData.name} onChange={e => setLeadData({ ...leadData, name: e.target.value })} className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none" />
                                                <input required type="email" placeholder="Email Address" value={leadData.email} onChange={e => setLeadData({ ...leadData, email: e.target.value })} className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none" />
                                                <input required type="text" placeholder="Firm/Company Name" value={leadData.firmName} onChange={e => setLeadData({ ...leadData, firmName: e.target.value })} className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none" />
                                                <input required type="tel" placeholder="Phone Number (WhatsApp)" value={leadData.phone} onChange={e => setLeadData({ ...leadData, phone: e.target.value })} className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none" />

                                                <div className="grid grid-cols-2 gap-3">
                                                    <input required type="text" placeholder="Project City" value={leadData.location} onChange={e => setLeadData({ ...leadData, location: e.target.value })} className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none" />
                                                    <input required type="text" placeholder="Est. Area (sq.ft)" value={leadData.area} onChange={e => setLeadData({ ...leadData, area: e.target.value })} className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none" />
                                                </div>

                                                <div className="pt-2">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/50 mb-3">Your Role</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["Architect", "Builder", "Contractor", "Developer"].map(role => (
                                                            <button
                                                                key={role} type="button"
                                                                onClick={() => setLeadData({ ...leadData, role })}
                                                                className={`py-3 rounded-lg border text-sm font-semibold transition-all ${leadData.role === role ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink)] border-[var(--line)]'}`}
                                                            >
                                                                {role}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--terracotta)] hover:bg-[#c25e3b] text-white rounded-xl px-4 py-4 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-6 shadow-xl shadow-[var(--terracotta)]/20 active:scale-95 disabled:opacity-50">
                                                    {isSubmitting ? "Processing..." : "Get Technical Package"}
                                                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Bottom Bar for Steps 1-3 */}
                    {!isSubmitted && step <= 3 && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--line)] z-20 pb-safe-bottom">
                            <button
                                onClick={handleNextMobile}
                                disabled={(step === 1 && !projectType) || (step === 2 && !wallCondition) || (step === 3 && !performancePriority)}
                                className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center transition-all ${((step === 1 && projectType) || (step === 2 && wallCondition) || (step === 3 && performancePriority))
                                    ? 'bg-[var(--ink)] text-white shadow-lg shadow-black/10'
                                    : 'bg-[var(--sand)] text-[var(--ink)]/30 border border-[var(--line)]'
                                    }`}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* DESKTOP VIEW */}
            <section id="facade-specification-desk" className="py-20 lg:py-24 bg-[#FAF9F6] text-[var(--ink)] border-t border-[var(--line)]">
                {/* Hidden SEO text */}
                <h1 className="sr-only">Terracotta Facade Systems and Brick Cladding Custom Specification Desk</h1>
                <p className="sr-only">Configure your ventilated facade systems, architectural clay systems, and building exteriors using our engineering desk.</p>

                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center lg:text-left mb-12 lg:mb-16">
                        <span className="text-[var(--terracotta)] text-xs font-bold tracking-widest uppercase mb-4 block">Engineered Solutions</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[var(--ink)] mb-4 lg:mb-6">Facade Specification Desk</h2>
                        <p className="text-[var(--ink)]/60 text-base lg:text-lg max-w-2xl mx-auto lg:mx-0">
                            Specify the right facade system and receive technical drawings, pricing guidance, and samples for your project.
                        </p>

                        {/* MOBILE ENTRY BUTTON */}
                        <div className="mt-8 lg:hidden">
                            <button
                                onClick={() => setIsMobileOpen(true)}
                                className="w-full bg-[var(--terracotta)] text-white font-bold uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg shadow-[var(--terracotta)]/20 flex justify-center items-center gap-2"
                            >
                                Start Specification <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* DESKTOP LAYOUT - Hidden on Mobile */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* LEFT SIDE: BUILDER STEPS */}
                        <div className="lg:col-span-7 space-y-12">
                            {/* STEP 1 */}
                            <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-bold text-sm">1</div>
                                    <h3 className="text-xl font-serif border-b border-[var(--line)] flex-1 pb-4">What is your project type?</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {PROJECT_TYPES.map(type => (
                                        <button
                                            key={type.title}
                                            onClick={() => handleProjectTypeSelect(type.title as ProjectType)}
                                            className={`p-4 rounded-xl border text-sm transition-all duration-300 text-left flex flex-col justify-between h-24 ${projectType === type.title
                                                ? 'border-[var(--terracotta)] bg-[#fff5f2] text-black shadow-md ring-1 ring-[var(--terracotta)]'
                                                : 'border-[var(--line)] bg-white text-[var(--ink)]/70 hover:border-[var(--terracotta)]/50'
                                                }`}
                                        >
                                            <div className={projectType === type.title ? "text-[var(--terracotta)]" : "text-[var(--ink)]/40"}>
                                                {type.icon}
                                            </div>
                                            <span className="font-semibold block">{type.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STEP 2 */}
                            <div ref={step2Ref} className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-bold text-sm">2</div>
                                    <h3 className="text-xl font-serif border-b border-[var(--line)] flex-1 pb-4">What type of wall or structure are you working with?</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {WALL_CONDITIONS.map(condition => (
                                        <button
                                            key={condition.title}
                                            onClick={() => handleWallConditionSelect(condition.title as WallCondition)}
                                            className={`p-4 rounded-xl border text-sm font-semibold transition-all duration-300 text-left flex items-center gap-3 ${wallCondition === condition.title
                                                ? 'border-[var(--terracotta)] bg-[#fff5f2] text-black shadow-md ring-1 ring-[var(--terracotta)]'
                                                : 'border-[var(--line)] bg-white text-[var(--ink)]/70 hover:border-[var(--terracotta)]/50'
                                                }`}
                                        >
                                            <div className={wallCondition === condition.title ? "text-[var(--terracotta)]" : "text-[var(--ink)]/40"}>
                                                {condition.icon}
                                            </div>
                                            {condition.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STEP 3 */}
                            <div ref={step3Ref} className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-bold text-sm">3</div>
                                    <h3 className="text-xl font-serif border-b border-[var(--line)] flex-1 pb-4">What is the main facade requirement?</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {PERFORMANCE_PRIORITIES.map(priority => (
                                        <button
                                            key={priority}
                                            onClick={() => handlePrioritySelect(priority as PerformancePriority)}
                                            className={`px-5 py-3 rounded-full border text-sm font-semibold transition-all duration-300 ${performancePriority === priority
                                                ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white shadow-md'
                                                : 'border-[var(--line)] bg-white text-[var(--ink)]/70 hover:border-[var(--terracotta)]/50 hover:bg-[var(--sand)]'
                                                }`}
                                        >
                                            {priority}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT SIDE: PREVIEW & LEAD FORM */}
                        <div className="lg:col-span-5" ref={recommendationRef}>
                            <div className="sticky top-28">
                                <AnimatePresence mode="wait">
                                    {!recommendation ? (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-white rounded-2xl p-8 border border-[var(--line)] shadow-sm h-full min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-[var(--sand)] opacity-50 transition-opacity duration-1000 group-hover:opacity-70" />
                                            <div className="absolute inset-0 bg-[url('/images/clay-texture.png')] bg-cover opacity-[0.03] mix-blend-multiply" />
                                            <motion.div
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                                className="relative z-10 w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-2xl shadow-[var(--terracotta)]/10 ring-1 ring-[var(--line)]"
                                            >
                                                <Layers className="w-10 h-10 text-[var(--ink)]/30 group-hover:text-[var(--terracotta)] transition-colors duration-500" />
                                            </motion.div>
                                            <h4 className="text-2xl font-serif text-[var(--ink)] mb-3 relative z-10">Facade Engineering Desk</h4>
                                            <p className="text-sm text-[var(--ink)]/60 relative z-10 max-w-[80%] mx-auto leading-relaxed">
                                                Select your project parameters on the left to generate customized structural recommendations.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="recommendation"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-2xl border border-[var(--line)] shadow-xl overflow-hidden"
                                        >
                                            <div className="bg-[var(--ink)] text-white p-6 md:p-8 relative overflow-hidden min-h-[360px] flex flex-col justify-end group">
                                                <div className="absolute inset-0 opacity-50 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-105">
                                                    <Image src={recommendation.image} alt={recommendation.name} fill className="object-cover" />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/80 to-[var(--ink)]/10" />
                                                
                                                <div className="relative z-10 mt-12">
                                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--terracotta)] block mb-3">Recommended System</span>
                                                    <h3 className="text-3xl font-serif leading-tight mb-4">{recommendation.name}</h3>
                                                    <p className="text-sm text-white/80 leading-relaxed mb-6 max-w-[85%]">{recommendation.description}</p>

                                                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                                        {recommendation.specs.map((spec, i) => {
                                                            const [label, val] = spec.split(': ');
                                                            return (
                                                                <div key={i} className="flex flex-col border-l-2 border-[var(--terracotta)] pl-3">
                                                                    <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">{label}</span>
                                                                    <span className="text-xs text-white/95 font-bold">{val}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 md:p-8 bg-white">
                                                {!isSubmitted ? (
                                                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <input required type="text" placeholder="Name" value={leadData.name} onChange={e => setLeadData({ ...leadData, name: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]" />
                                                            <input required type="email" placeholder="Email" value={leadData.email} onChange={e => setLeadData({ ...leadData, email: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]" />
                                                        </div>
                                                        <input required type="text" placeholder="Firm/Company Name" value={leadData.firmName} onChange={e => setLeadData({ ...leadData, firmName: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]" />
                                                        <input required type="tel" placeholder="Phone/WhatsApp" value={leadData.phone} onChange={e => setLeadData({ ...leadData, phone: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]" />

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <input required type="text" placeholder="Project Location" value={leadData.location} onChange={e => setLeadData({ ...leadData, location: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]" />
                                                            <input required type="text" placeholder="Est. Area (sq.ft)" value={leadData.area} onChange={e => setLeadData({ ...leadData, area: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)]" />
                                                        </div>

                                                        <select required value={leadData.role} onChange={e => setLeadData({ ...leadData, role: e.target.value })} className="w-full bg-[var(--sand)] border-0 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--terracotta)] text-[var(--ink)]">
                                                            <option value="Architect">Architect</option>
                                                            <option value="Builder">Builder</option>
                                                            <option value="Contractor">Contractor</option>
                                                            <option value="Developer">Developer</option>
                                                        </select>

                                                        <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--terracotta)] hover:bg-[#c25e3b] text-white rounded-lg px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[var(--terracotta)]/20 active:scale-95 disabled:opacity-50">
                                                            {isSubmitting ? "Processing..." : "Get Technical Package"}
                                                            {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 relative overflow-hidden ring-1 ring-green-100">
                                                            <div className="absolute inset-0 bg-green-500/10 mix-blend-multiply" />
                                                            <CheckCircle2 className="w-10 h-10 text-green-600 relative z-10" />
                                                        </div>
                                                        <h4 className="text-2xl font-serif text-[var(--ink)] mb-3">Request Received</h4>
                                                        <p className="text-sm text-[var(--ink)]/60 mb-8 border-b border-[var(--line)] pb-8 max-w-[85%] mx-auto leading-relaxed">
                                                            Thank you. Our technical engineering team will review your requirements and respond within 24 hours.
                                                        </p>

                                                        <div className="space-y-4">
                                                            <button 
                                                                onClick={() => window.open('https://claytile.in/technical-package-preview.pdf', '_blank')}
                                                                className="w-full flex items-center justify-center gap-2 bg-[var(--sand)] hover:bg-[var(--line)] text-[var(--ink)] px-4 py-4 rounded-xl text-sm font-bold transition-all active:scale-95 border border-[var(--line)]"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                Download Standard Datasheet
                                                            </button>
                                                            <button onClick={startOver} className="w-full text-xs font-bold text-[var(--ink)]/40 hover:text-[var(--ink)] uppercase tracking-widest py-3 transition-colors">
                                                                Configure Another System
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
