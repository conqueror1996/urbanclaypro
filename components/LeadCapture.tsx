
'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface LeadCaptureProps {
    city: string;
    category?: string;
    title?: string;
    subtitle?: string;
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ city, category, title, subtitle }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            projectType: formData.get('projectType'),
            estimatedSqft: formData.get('sqft'),
            city: city,
            category: category || 'General Enquiry',
            source: `LeadCapture Component - ${city}`
        };

        try {
            // Simulated submission to your API
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStep(2);
                toast.success("Request received! Our team will contact you shortly.");
            } else {
                throw new Error("Failed to submit");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="bg-[#2A1E16] text-white p-10 rounded-2xl text-center border border-white/10 shadow-2xl">
                <div className="text-5xl mb-6">📦</div>
                <h3 className="text-2xl font-serif mb-4">Sample Box Request Received!</h3>
                <p className="text-white/70 mb-8 max-w-sm mx-auto">
                    We've received your request for {city}. An architectural consultant will call you within 24 hours to confirm your delivery address.
                </p>
                <button 
                    onClick={() => setStep(1)}
                    className="text-white/50 text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                    Request another for a different project
                </button>
            </div>
        );
    }

    return (
        <div id="lead-form" className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--terracotta)]/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-[var(--terracotta)]/10 animate-pulse"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 rounded-lg bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-bold">1</span>
                    <h3 className="text-2xl font-serif text-[#2A1E16]">{title || `Request Local Price List in ${city}`}</h3>
                </div>
                
                <p className="text-gray-500 mb-8 font-light">
                    {subtitle || `Get a customized quote and sample box delivered to your project site in ${city}. Trusted by 500+ architects.`}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Full Name</label>
                            <input 
                                required
                                name="name"
                                type="text" 
                                placeholder="Your Name"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)] outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Phone Number</label>
                            <input 
                                required
                                name="phone"
                                type="tel" 
                                placeholder="+91 XXXX XXX XXX"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)] outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Project Type</label>
                            <select 
                                name="projectType"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)] outline-none transition-all"
                            >
                                <option>Residential Villa</option>
                                <option>Commercial Building</option>
                                <option>Interior Project</option>
                                <option>Institutional/Govt</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Est. Quantity (Sqft)</label>
                            <input 
                                name="sqft"
                                type="text" 
                                placeholder="e.g. 2500"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--terracotta)] outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full py-5 bg-[var(--terracotta)] text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-orange-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <span>Get Price List & Samples</span>
                                <span className="text-xl">→</span>
                            </>
                        )}
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-400 mt-4 italic">
                        * Free shipping for sample boxes for architects in {city}.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LeadCapture;
