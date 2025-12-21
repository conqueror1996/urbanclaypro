'use client';

import React, { useState, useEffect } from 'react';
import { exchangeZohoCode } from '@/app/actions/zoho-auth';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ZohoSetupPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [domain, setDomain] = useState('www.zoho.in');

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // If redirected back with code
    const code = searchParams.get('code');

    useEffect(() => {
        // Load from local storage if available (handling the redirect return)
        const storedId = localStorage.getItem('temp_zoho_id');
        const storedSecret = localStorage.getItem('temp_zoho_secret');
        const storedDomain = localStorage.getItem('temp_zoho_domain');

        if (storedId) setClientId(storedId);
        if (storedSecret) setClientSecret(storedSecret);
        if (storedDomain) setDomain(storedDomain);

        if (code && storedId && storedSecret) {
            handleExchange(code, storedId, storedSecret, storedDomain || 'www.zoho.in');
        }
    }, [code]);

    const getRedirectUri = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/zoho-setup`;
        }
        return '';
    };

    const handleAuthorize = () => {
        if (!clientId) return alert("Please enter Client ID");

        // Save for after redirect
        localStorage.setItem('temp_zoho_id', clientId);
        localStorage.setItem('temp_zoho_secret', clientSecret);
        localStorage.setItem('temp_zoho_domain', domain);

        const accountDomain = domain.replace('www.', 'accounts.');
        const scope = 'ZohoCRM.modules.ALL';
        const redirect = getRedirectUri();

        const authUrl = `https://${accountDomain}/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirect}`;

        window.location.href = authUrl;
    };

    const handleExchange = async (authCode: string, id: string, secret: string, dom: string) => {
        setLoading(true);
        try {
            const redirect = getRedirectUri();
            const res = await exchangeZohoCode(authCode, id, secret, redirect, dom);
            setResult(res);

            if (res.success) {
                // Clear temp storage
                localStorage.removeItem('temp_zoho_id');
                localStorage.removeItem('temp_zoho_secret');
                localStorage.removeItem('temp_zoho_domain');
            }
        } catch (e) {
            console.error(e);
            alert("Failed to exchange token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f7f6] p-10 font-sans">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-[#e9e2da]">
                <h1 className="text-3xl font-serif text-[#2A1E16] mb-2">Zoho CRM Connector</h1>
                <p className="text-gray-500 mb-8">Authorize UrbanClay to sync leads directly to your Zoho CRM.</p>

                {!result?.success ? (
                    <div className="space-y-6">
                        {loading && (
                            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-3">
                                <span className="animate-spin text-xl">↻</span>
                                <strong>Authenticating with Zoho...</strong>
                            </div>
                        )}

                        {!loading && code && (
                            <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                                <strong>Authorization Pending...</strong>
                                <p>Processing the callback code. If this sticks, please try again.</p>
                            </div>
                        )}

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-4">1. Configuration</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Zoho Domain</label>
                                    <select
                                        value={domain}
                                        onChange={e => setDomain(e.target.value)}
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
                                            value={clientId}
                                            onChange={e => setClientId(e.target.value)}
                                            placeholder="1000.xxxx..."
                                            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Client Secret</label>
                                        <input
                                            type="password"
                                            value={clientSecret}
                                            onChange={e => setClientSecret(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 mt-2">
                                    <p>Redirect URI to set in Zoho Console:</p>
                                    <code className="bg-gray-200 px-2 py-1 rounded block mt-1 select-all">{getRedirectUri()}</code>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAuthorize}
                            className="w-full py-4 bg-[#b45a3c] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#8f4730] transition-all shadow-lg shadow-orange-900/20"
                        >
                            Connect to Zoho
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 bg-green-50 border border-green-100 rounded-xl text-center">
                            <div className="text-4xl mb-4">🎉</div>
                            <h3 className="text-2xl font-bold text-green-900 mb-2">Connected Successfully!</h3>
                            <p className="text-green-700">Your specific Refresh Token has been generated.</p>
                        </div>

                        <div className="bg-[#1a1b1e] p-6 rounded-xl border border-gray-800 text-gray-300">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Add to your .env file:</label>
                            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap select-all bg-black/30 p-4 rounded-lg">
                                ZOHO_CLIENT_ID={clientId}
                                ZOHO_CLIENT_SECRET={clientSecret}
                                ZOHO_REFRESH_TOKEN={result.refresh_token}
                                ZOHO_DOMAIN={domain}
                            </pre>
                            <p className="text-xs text-gray-500 mt-4 italic">
                                ⚠️ Keep this secret safe. Do not share it publicly.
                            </p>
                        </div>

                        <a href="/dashboard/samples" className="block text-center text-[#b45a3c] underline font-bold">
                            Return to Dashboard
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
