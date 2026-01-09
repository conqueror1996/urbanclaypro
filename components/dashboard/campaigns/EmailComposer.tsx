'use client';



import React, { useState } from 'react';
import { SendCampaignEmail, SendTestEmail } from '@/app/actions/campaigns';
import { toast, Toaster } from 'sonner';

export default function EmailComposer({ initialRecipients = [] }: { initialRecipients: string[] }) {
    const [subject, setSubject] = useState('Collaboration Proposal: Premium Terracotta Systems for your next project');
    const [isSending, setIsSending] = useState(false);
    const [sentCount, setSentCount] = useState<number | null>(null);

    const handleSend = async () => {
        if (initialRecipients.length === 0) return;

        setIsSending(true);
        const toastId = toast.loading('Sending campaign emails...');

        try {
            // The actual HTML would be much richer, this is a simplified view of the "content"
            const bodyContent = getEmailTemplate();

            const result = await SendCampaignEmail(initialRecipients, subject, bodyContent);

            if (result.success) {
                toast.success(`Campaign sent to ${initialRecipients.length} architects!`, {
                    id: toastId,
                    description: 'Emails have been dispatched via SMTP.'
                });
                setSentCount(initialRecipients.length);
            } else {
                toast.error('Failed to send campaign', {
                    id: toastId,
                    description: result.error || 'Unknown error occurred'
                });
            }
        } catch (error) {
            toast.error('Unexpected error', { id: toastId });
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const handleTestSend = async () => {
        const email = prompt("Enter email address to send test preview:");
        if (!email) return;

        const toastId = toast.loading('Sending test email...');
        try {
            const bodyContent = getEmailTemplate();
            const result = await SendTestEmail(email, subject, bodyContent);

            if (result.success) {
                toast.success(`Preview sent to ${email}`, { id: toastId });
            } else {
                toast.error(`Test failed: ${result.error}`, { id: toastId });
            }
        } catch (e) {
            toast.error("Test execution failed", { id: toastId });
        }
    };

    if (sentCount !== null) {
        return (
            <div className="bg-white p-20 text-center rounded-2xl shadow-sm border border-gray-100 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-serif text-[var(--ink)] mb-2">Campaign Sent!</h3>
                <p className="text-gray-500">Successfully delivered to {sentCount} architects.</p>
                <button onClick={() => setSentCount(null)} className="mt-8 text-[var(--terracotta)] font-bold hover:underline">Start New Campaign</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Email Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-200 space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase text-gray-400 w-16 text-right">To:</span>
                        <div className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600">
                            {initialRecipients.length > 0 ? `${initialRecipients.length} Selected Recipients` : 'No recipients selected (Select from Database)'}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase text-gray-400 w-16 text-right">Subject:</span>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
                        />
                    </div>
                </div>

                {/* Email Body Preview */}
                <div className="p-8 md:p-12 min-h-[500px] bg-white text-[#2a1e16]">
                    {/* Visual Email Template */}
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">UrbanClay Studio</span>
                            <h1 className="font-serif text-4xl mb-4">Timeless Facades.</h1>
                            <p className="text-gray-500 italic">"Buildings deserve a skin, not just decoration."</p>
                        </div>

                        <div className="prose prose-stone mx-auto">
                            <p>Dear Architect,</p>
                            <p>We have been following your firm's recent work and admire your approach to sustainable materiality.</p>
                            <p>At <strong>UrbanClay</strong>, we specialize in low-efflorescence, precision-engineered terracotta facade systems that bridge the gap between vernacular soul and modern performance.</p>

                            <div className="my-8 grid grid-cols-2 gap-4">
                                <img src="/images/campaign/hero1.png" alt="Terracotta Facade" className="w-full h-32 object-cover rounded-lg" />
                                <img src="/images/campaign/hero2.png" alt="Modern Interior" className="w-full h-32 object-cover rounded-lg" />
                            </div>

                            <p>We deliver pan-India to over 100 cities. We would love to send a <strong>complimentary sample box</strong> to your studio for your material library.</p>

                            <div style={{ margin: '32px 0' }}>
                                <a href="https://claytile.in/claims/sample?uid=TRACKING_ID" style={{ display: 'inline-block', backgroundColor: '#b45a3c', color: 'white', padding: '18px 32px', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Request Studio Sample Kit</a>
                                <p style={{ marginTop: '12px', fontSize: '11px', color: '#999' }}>Kit includes: 6 Terracotta Textures, Joint Detail Manual, and 2025 Price List.</p>
                            </div>

                            <p>Or alternatively, you can view our full project portfolio here:</p>
                            <a href="https://claytile.in/products" style={{ color: '#b45a3c', fontWeight: 'bold', textDecoration: 'underline' }}>View Full Catalog →</a>
                        </div>

                        <div className="mt-16 border-t border-gray-100 pt-8 flex items-start gap-4">
                            <div className="w-12 h-12 bg-[var(--terracotta)] rounded-full text-white flex items-center justify-center font-serif font-bold text-xl">U</div>
                            <div>
                                <p className="font-bold text-[var(--ink)]">UrbanClay Team</p>
                                <p className="text-xs text-gray-400 mb-2">Mumbai Experience Center</p>
                                <div className="flex gap-3 text-[10px] text-gray-400 uppercase tracking-wider">
                                    <span>claytile.in</span>
                                    <span>•</span>
                                    <span>+91 80800 81951</span>
                                </div>
                            </div>
                        </div>

                        {/* Anti-Spam Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400">
                                You received this email because your firm is listed in the public architecture directory for India.
                            </p>
                            <a href="#" className="text-[10px] text-gray-400 underline hover:text-gray-600 mt-1 inline-block">Unsubscribe from future updates</a>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={handleTestSend}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Test Preview
                    </button>
                    <button className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">Save Draft</button>
                    <button
                        onClick={handleSend}
                        disabled={isSending || initialRecipients.length === 0}
                        className="bg-[var(--terracotta)] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-[#a85638] shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSending ? 'Sending...' : 'Send Campaign'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function getEmailTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f3f4f6;">
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 24px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px;">
            <span style="color: #b45a3c; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 16px;">UrbanClay Studio</span>
            <h1 style="font-family: serif; font-size: 36px; margin-bottom: 16px; color: #000; margin-top: 0; line-height: 1.2;">Timeless Facades.</h1>
            <p style="color: #6b7280; font-style: italic; margin: 0; font-size: 16px;">"Buildings deserve a skin, not just decoration."</p>
        </div>

        <!-- Content -->
        <div style="color: #333; line-height: 1.6; font-size: 16px;">
            <p style="margin-bottom: 16px; margin-top: 0;">Dear Architect,</p>
            <p style="margin-bottom: 16px;">We have been following your firm's recent work and admire your approach to sustainable materiality.</p>
            <p style="margin-bottom: 24px;">At <strong>UrbanClay</strong>, we specialize in low-efflorescence, precision-engineered terracotta facade systems that bridge the gap between vernacular soul and modern performance.</p>

            <!-- Images -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                    <td width="48%" style="padding-right: 8px; vertical-align: top;">
                        <img src="/images/campaign/hero1.png" alt="Terracotta Facade" style="width: 100%; height: 128px; object-fit: cover; border-radius: 8px; display: block;" />
                    </td>
                    <td width="48%" style="padding-left: 8px; vertical-align: top;">
                        <img src="/images/campaign/hero2.png" alt="Modern Interior" style="width: 100%; height: 128px; object-fit: cover; border-radius: 8px; display: block;" />
                    </td>
                </tr>
            </table>

            <p style="margin-bottom: 24px;">We deliver pan-India to over 100 cities. We would love to send a <strong>complimentary sample box</strong> to your studio for your material library.</p>

            <!-- Button -->
            <div style="margin: 32px 0; text-align: center;">
                <a href="https://claytile.in/claims/sample?uid=TRACKING_ID" style="display: inline-block; background-color: #b45a3c; color: white; padding: 18px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Request Studio Sample Kit</a>
                <p style="margin-top: 12px; font-size: 11px; color: #999; margin-bottom: 0;">Kit includes: 6 Terracotta Textures, Joint Detail Manual, and 2025 Price List.</p>
            </div>

            <p style="margin-bottom: 8px;">Or alternatively, you can view our full project portfolio here:</p>
            <a href="https://claytile.in/products" style="color: #b45a3c; font-weight: bold; text-decoration: underline;">View Full Catalog →</a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 64px; border-top: 1px solid #f3f4f6; padding-top: 32px;">
           <table width="100%" cellpadding="0" cellspacing="0">
             <tr>
               <td width="60" valign="top">
                  <div style="width: 48px; height: 48px; background-color: #b45a3c; border-radius: 50%; color: white; text-align: center; line-height: 48px; font-family: serif; font-weight: bold; font-size: 20px;">U</div>
               </td>
               <td valign="top">
                    <p style="font-weight: bold; color: #000; margin: 0 0 4px 0;">UrbanClay Team</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 0 0 8px 0;">Mumbai Experience Center</p>
                    <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
                        <span>claytile.in</span>
                        <span style="margin: 0 8px;">•</span>
                        <span>+91 80800 81951</span>
                    </div>
               </td>
             </tr>
           </table>
        </div>

        <!-- Anti-Spam -->
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6; text-align: center;">
            <p style="font-size: 10px; color: #9ca3af; margin: 0;">
                You received this email because your firm is listed in the public architecture directory for India.
            </p>
            <a href="#" style="font-size: 10px; color: #9ca3af; text-decoration: underline; display: inline-block; margin-top: 4px;">Unsubscribe from future updates</a>
        </div>
    </div>
</body>
</html>
    `;
}

