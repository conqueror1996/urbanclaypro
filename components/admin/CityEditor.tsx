
import React, { useState } from 'react';
import { authenticatedFetch } from '@/lib/auth-utils';

interface City {
    _id: string;
    name: string;
    richContent?: string;
}

interface CityEditorProps {
    city: City;
    onClose: () => void;
    onSave: () => void;
}

export default function CityEditor({ city, onClose, onSave }: CityEditorProps) {
    const [richContent, setRichContent] = useState(city.richContent || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_city',
                    data: {
                        _id: city._id,
                        richContent
                    }
                })
            });
            const json = await res.json();
            if (json.success) {
                onSave();
                onClose();
            } else {
                alert('Failed to save');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-[#1a1512]">Edit Content: {city.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Add rich SEO text to boost rankings in {city.name}.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Power Text (Bottom Content)</label>
                    <textarea
                        className="w-full h-full min-h-[400px] p-6 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] font-mono text-sm leading-relaxed resize-none"
                        placeholder="Write 300-500 words about why UrbanClay is the best choice for this city. Mention specific localities, weather benefits, and architectural styles..."
                        value={richContent}
                        onChange={(e) => setRichContent(e.target.value)}
                    />
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-[var(--terracotta)] text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#a85638] disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
