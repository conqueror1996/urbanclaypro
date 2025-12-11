
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    productTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({ isOpen, productTitle, onClose, onConfirm }: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
            >
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#1a1512] mb-2">Delete Product Range?</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete <span className="font-bold text-[#1a1512]">"{productTitle}"</span>?
                        <br />
                        This action cannot be undone and will remove all associated data.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors uppercase text-xs tracking-wider"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 uppercase text-xs tracking-wider"
                        >
                            Delete Forever
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
