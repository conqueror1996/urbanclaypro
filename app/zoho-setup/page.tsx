'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeZohoCode } from '@/app/actions/zoho-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ZohoSetupPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);

    // Setup Mode State
    const [view, setView] = useState<'diagnostic' | 'setup'>('diagnostic');
    const [setupData, setSetupData] = useState({
        clientId: '',
        clientSecret: '',
        domain: 'www.zoho.in'
    });
    const [authResult, setAuthResult] = useState<any>(null);
    const [isExchanging, setIsExchanging] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    // Handle Callback from Zoho
    useEffect(() => {
        if (code) {
            setView('setup');
            const storedId = localStorage.getItem('temp_zoho_id');
            const storedSecret = localStorage.getItem('temp_zoho_secret');
            const storedDomain = localStorage.getItem('temp_zoho_domain') || 'www.zoho.in';

            if (storedId && storedSecret) {
                setSetupData({ clientId: storedId, clientSecret: storedSecret, domain: storedDomain });
                exchangeToken(code, storedId, storedSecret, storedDomain);
            }
        }
    }, [code]);

    const exchangeToken = async (authCode: string, id: string, secret: string, domain: string) => {
        setIsExchanging(true);
        try {
            const redirectUri = `${window.location.origin}/zoho-setup`;
            const response = await exchangeZohoCode(authCode, id, secret, redirectUri, domain);

            if (response.success) {
                setAuthResult(response);
                // Clear temp storage
                localStorage.removeItem('temp_zoho_id');
                localStorage.removeItem('temp_zoho_secret');
                localStorage.removeItem('temp_zoho_domain');
                // Remove code from URL
                router.replace('/zoho-setup');
            } else {
                alert(`Token Exchange Failed: ${response.error}`);
                setStatus('error'); // reuse diagnostic status or add new one
            }
        } catch (e) {
            console.error(e);
            alert("Failed to exchange token.");
        } finally {
            setIsExchanging(false);
        }
    };

    const handleAuthorize = () => {
        if (!setupData.clientId || !setupData.clientSecret) {
            alert("Please enter Client ID and Secret");
            return;
        }

        // Store temp data to survive redirect
        localStorage.setItem('temp_zoho_id', setupData.clientId);
        localStorage.setItem('temp_zoho_secret', setupData.clientSecret);
        localStorage.setItem('temp_zoho_domain', setupData.domain);

        const accountDomain = setupData.domain.replace('www.', 'accounts.');
        const redirectUri = `${window.location.origin}/zoho-setup`;

        // Redirect to Zoho
        const authUrl = `https://${accountDomain}/oauth/v2/auth?scope=ZohoBooks.fullaccess.all,ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=${setupData.clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}&prompt=consent`;

        window.location.href = authUrl;
    };

    const checkConnection = async () => {
        setStatus('loading');
        try {
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#2A1E16]">Zoho Connection Manager</h1>
                            <p className="text-gray-500">Manage connectivity with Zoho Books & CRM</p>
                        </div>
                    </div>

                    <div className="mb-8 flex gap-4 border-b border-gray-100 pb-4">
                        <button
                            onClick={() => { setView('diagnostic'); setStatus('idle'); }}
                            className={`pb-2 px-1 font-bold text-sm transition-colors ${view === 'diagnostic' ? 'text-[#b45a3c] border-b-2 border-[#b45a3c]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            1. Connection Diagnostic
                        </button>
                        <button
                            onClick={() => { setView('setup'); setStatus('idle'); }}
                            className={`pb-2 px-1 font-bold text-sm transition-colors ${view === 'setup' ? 'text-[#b45a3c] border-b-2 border-[#b45a3c]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            2. Generate Tokens
                        </button>
                    </div>

                    {view === 'diagnostic' ? (
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
                                    <p className="text-gray-600">Click the button to test your Zoho credentials and Organization ID currently in <code>.env</code>.</p>
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
                                        {result?.availableOrgs && (
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
                                        {result?.error ? (
                                            <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm font-mono break-all border border-red-200">
                                                {result.error}
                                            </div>
                                        ) : (
                                            <p className="text-red-600 text-sm">Unknown error occurred.</p>
                                        )}
                                        <div className="text-gray-600 text-sm italic">
                                            {result?.hint || 'Double check ZOHO_DOMAIN and ZOHO_REFRESH_TOKEN.'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                <h4 className="font-bold text-[#2A1E16] mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Configuration Guide
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex gap-2"><span>1.</span> <strong>ZOHO_ORG_ID</strong>: Found in Zoho Books &gt; Settings &gt; Organization Profile.</li>
                                    <li className="flex gap-2"><span>2.</span> <strong>ZOHO_DOMAIN</strong>: Must be exactly <code>zoho.in</code> (India) or <code>zoho.com</code> (Global).</li>
                                    <li className="flex gap-2"><span>3.</span> <strong>Auth Error?</strong> If you see "invalid_code", your Refresh Token is invalid or you pasted an Auth Code. Use the "Generate Tokens" tab.</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        // SETUP MODE
                        <div className="space-y-6">
                            {authResult ? (
                                <div className="bg-[#1a1b1e] p-6 rounded-xl border border-gray-800 text-gray-300">
                                    <div className="flex items-center gap-2 text-green-400 font-bold mb-4">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Success! New Refresh Token Generated
                                    </div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Add this to your .env file:</label>
                                    <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap select-all bg-black/30 p-4 rounded-lg text-emerald-400">
                                        ZOHO_CLIENT_ID={setupData.clientId}{'\n'}
                                        ZOHO_CLIENT_SECRET={setupData.clientSecret}{'\n'}
                                        ZOHO_REFRESH_TOKEN={authResult.refresh_token}{'\n'}
                                        ZOHO_DOMAIN={setupData.domain}
                                    </pre>
                                    <p className="text-xs text-gray-500 mt-4 italic">
                                        ⚠️ This is a permanent token. Keep it safe. It does not expire unless revoked.
                                    </p>
                                    <button onClick={() => { setAuthResult(null); setView('diagnostic'); }} className="mt-6 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold text-white transition-colors">
                                        Done, I've updated my .env
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                                        <strong>Instructions:</strong>
                                        <ol className="list-decimal pl-5 mt-2 space-y-1">
                                            <li>Go to <a href="https://api-console.zoho.in" target="_blank" className="underline font-bold">Zoho API Console</a>.</li>
                                            <li>Create a "Server-based Application".</li>
                                            <li>Set Homepage URL: <code>{typeof window !== 'undefined' ? window.location.origin : '...'}</code></li>
                                            <li>Set Authorized Redirect URI: <code>{typeof window !== 'undefined' ? `${window.location.origin}/zoho-setup` : 'https://claytile.in/zoho-setup'}</code> (Add both localhost:3000/... and your domain).</li>
                                            <li>Copy Client ID and Secret below.</li>
                                        </ol>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Zoho Domain</label>
                                            <select
                                                value={setupData.domain}
                                                onChange={e => setSetupData({ ...setupData, domain: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            >
                                                <option value="www.zoho.in">Zoho.in (India)</option>
                                                <option value="www.zoho.com">Zoho.com (US/Global)</option>
                                                <option value="www.zoho.eu">Zoho.eu (Europe)</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Client ID</label>
                                                <input
                                                    type="text"
                                                    value={setupData.clientId}
                                                    onChange={e => setSetupData({ ...setupData, clientId: e.target.value })}
                                                    placeholder="1000.xxxx..."
                                                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Client Secret</label>
                                                <input
                                                    type="password"
                                                    value={setupData.clientSecret}
                                                    onChange={e => setSetupData({ ...setupData, clientSecret: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAuthorize}
                                            className="w-full py-4 bg-[#b45a3c] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#8f4730] transition-all shadow-lg shadow-orange-900/20"
                                        >
                                            Connect to Zoho
                                        </button>
                                        <p className="text-xs text-center text-gray-400">You will be redirected to Zoho to approve access.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
