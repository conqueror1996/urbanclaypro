'use client';

import React, { useState, useEffect } from 'react';
import { testZohoConnection } from '@/lib/zoho'; // This won't work directly because it's a server function, need a server action or just call it from a server component
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Since we need to run this on the server, we'll use a simple Server Action approach
async function runDiagnostic() {
    // We'll import it dynamically to ensure it runs in a server context if called from a server component,
    // but here we are in a client component. Let's create a server action instead.
}

export default function ZohoSetupPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);

    const checkConnection = async () => {
        setStatus('loading');
        try {
            // We'll use a fetch to a temporary API route or just a server action
            const response = await fetch('/api/zoho/test');
            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setResult(data);
            } else {
                setStatus('error');
                setResult(data);
            }
        } catch (err: any) {
            setStatus('error');
            setResult({ error: err.message });
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaf9]">
            <Header />
            <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-orange-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.04z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#2A1E16]">Zoho Connection Diagnostic</h1>
                            <p className="text-gray-500">Verify your ERP & CRM integration status</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className={`p-6 rounded-2xl border ${status === 'success' ? 'bg-green-50 border-green-100' : status === 'error' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Books & CRM API Status</h3>
                                <button
                                    onClick={checkConnection}
                                    disabled={status === 'loading'}
                                    className="px-6 py-2 bg-[#2A1E16] text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Checking...' : 'Run Test'}
                                </button>
                            </div>

                            {status === 'idle' && (
                                <p className="text-gray-600">Click the button to test your Zoho credentials and Organization ID.</p>
                            )}

                            {status === 'success' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-green-700 font-bold">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        Perfect Connection
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-green-200">
                                            <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Organization</span>
                                            <span className="text-[#2A1E16] font-bold">{result.orgName}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-green-200">
                                            <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Currency</span>
                                            <span className="text-[#2A1E16] font-bold">{result.currency}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-red-700 font-bold">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        Connection Failure
                                    </div>
                                    {result.availableOrgs && (
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                                            <p className="text-gray-600 font-bold mb-2">Available Organization IDs:</p>
                                            <div className="space-y-2">
                                                {result.availableOrgs.map((org: any) => (
                                                    <div key={org.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                                        <span className="text-sm font-medium">{org.name}</span>
                                                        <code className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">{org.id}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {result.error && (
                                        <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm font-mono break-all border border-red-200">
                                            {result.error}
                                        </div>
                                    )}
                                    <div className="text-gray-600 text-sm italic">
                                        {result.hint || 'Recommendation: Double check if your ZOHO_DOMAIN in Vercel ends with .in or .com.'}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                            <h4 className="font-bold text-[#2A1E16] mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Configuration Checklist
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex gap-2"><span>1.</span> <strong>ZOHO_ORG_ID</strong> should be the number found in Zoho Books &gt; Settings &gt; Organization Profile.</li>
                                <li className="flex gap-2"><span>2.</span> <strong>ZOHO_DOMAIN</strong> must be exactly <code>zoho.in</code> for Indian accounts or <code>zoho.com</code> for global.</li>
                                <li className="flex gap-2"><span>3.</span> <strong>Refresh Token</strong> never expires, but Client ID and Secret must match the App created in Zoho Developer Console.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
