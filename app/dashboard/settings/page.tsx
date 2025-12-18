'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Get stored password
        const storedPassword = localStorage.getItem('uc_admin_password') || 'clay2025';

        // Validate current password
        if (currentPassword !== storedPassword && currentPassword !== 'clay2025' && currentPassword !== 'admin') {
            setMessage({ type: 'error', text: 'Current password is incorrect' });
            return;
        }

        // Validate new password
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        // Update password
        localStorage.setItem('uc_admin_password', newPassword);
        localStorage.setItem('uc_custom_password', newPassword); // Store custom password separately
        document.cookie = `uc_admin_token=${newPassword}; path=/; max-age=31536000; SameSite=Lax`;

        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif text-[#2A1E16] mb-2">Settings</h1>
                <p className="text-gray-500">Manage your dashboard preferences and security</p>
            </div>

            {/* Password Change Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[var(--terracotta)]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-[#2A1E16]">Change Password</h2>
                        <p className="text-sm text-gray-500">Update your dashboard access password</p>
                    </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent"
                            required
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent"
                            required
                        />
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[var(--terracotta)] text-white py-3 rounded-xl font-medium hover:bg-[#a85638] transition-all"
                    >
                        Update Password
                    </button>
                </form>
            </motion.div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl">
                <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-1">Security Note</h3>
                        <p className="text-sm text-blue-700">
                            Your password is stored locally in your browser. Make sure to remember it as there's no recovery option.
                            The default passwords (clay2025, admin) will continue to work unless you change them.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
