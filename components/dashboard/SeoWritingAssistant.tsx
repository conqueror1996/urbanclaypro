
import React, { useEffect, useState } from 'react';

interface SeoAssistantProps {
    title: string;
    excerpt: string;
    keyword?: string;
}

export default function SeoWritingAssistant({ title, excerpt, keyword = '' }: SeoAssistantProps) {
    const [score, setScore] = useState(0);
    const [tips, setTips] = useState<string[]>([]);
    const [previewWidth, setPreviewWidth] = useState(0);

    // Analysis Logic
    useEffect(() => {
        let newScore = 100;
        const newTips: string[] = [];

        // 1. Title Analysis
        if (title.length < 30) {
            newScore -= 20;
            newTips.push("Title is too short. Aim for 50-60 chars.");
        } else if (title.length > 60) {
            newScore -= 10;
            newTips.push("Title might be truncated on search results.");
        }

        if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) {
            newScore -= 30;
            newTips.push(`Add target keyword "${keyword}" to the title.`);
        }

        // Power Words (Simple check)
        const powerWords = ['Best', 'Guide', 'Review', '2025', 'Top', 'Free', 'Tips', 'How to', 'Why', 'Premium'];
        const hasPowerWord = powerWords.some(w => title.toLowerCase().includes(w.toLowerCase()));
        if (!hasPowerWord) {
            newScore -= 10;
            newTips.push("Add a power word (e.g., 'Guide', 'Best', 'Tips') to increase CTR.");
        }

        // 2. Excerpt/Description Analysis
        if (excerpt.length < 120) {
            newScore -= 10;
            newTips.push("Excerpt is redundant. Make it a full meta description (~150 chars).");
        } else if (excerpt.length > 160) {
            newScore -= 5;
            newTips.push("Excerpt is a bit long. Keep important info early.");
        }

        if (keyword && !excerpt.toLowerCase().includes(keyword.toLowerCase())) {
            newScore -= 20;
            newTips.push(`Mention "${keyword}" in the excerpt.`);
        }

        setScore(Math.max(0, newScore));
        setTips(newTips);
        setPreviewWidth(Math.min(600, title.length * 9)); // Rough estimate
    }, [title, excerpt, keyword]);

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-500 bg-green-50 border-green-200';
        if (s >= 50) return 'text-orange-500 bg-orange-50 border-orange-200';
        return 'text-red-500 bg-red-50 border-red-200';
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h4 className="font-bold text-gray-700 font-serif">SEO Assistant</h4>
                <div className={`px-2 py-1 rounded text-xs font-bold border ${getScoreColor(score)}`}>
                    {score}/100
                </div>
            </div>

            {/* Google Preview */}
            <div className="mb-6 bg-white p-3 rounded-lg border border-gray-100 shadow-inner">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider">Google Search Preview</p>
                <div className="font-sans">
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-6 h-6 bg-gray-200 rounded-full text-[8px] flex items-center justify-center text-gray-500">UC</div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-800">UrbanClay</span>
                            <span className="text-[8px] text-gray-500">https://urbanclay.in › journal › ...</span>
                        </div>
                    </div>
                    <h3 className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer truncate font-medium">
                        {title || 'Your Title Here...'}
                    </h3>
                    <p className="text-sm text-[#4d5156] mt-1 leading-snug line-clamp-2">
                        <span className="text-gray-400">{new Date().toLocaleDateString()} — </span>
                        {excerpt || 'Your article description/excerpt will appear here. Make it catchy to improve click-through rates.'}
                    </p>
                </div>
            </div>

            {/* Tips List */}
            <div className="space-y-2">
                {tips.length > 0 ? (
                    tips.map((tip, i) => (
                        <div key={i} className="flex gap-2 items-start text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="text-orange-500 mt-0.5">⚠️</span>
                            {tip}
                        </div>
                    ))
                ) : (
                    <div className="flex gap-2 items-center text-xs text-green-700 bg-green-50 p-3 rounded font-medium">
                        <span className="text-green-500">✅</span>
                        Perfect! Ready to publish.
                    </div>
                )}
            </div>

            {/* Keyword Input Helper */}
            {(!keyword) && (
                <p className="text-[10px] text-gray-400 mt-4 text-center">
                    * Tip: Define a focus keyword to get better suggestions.
                </p>
            )}
        </div>
    );
}
