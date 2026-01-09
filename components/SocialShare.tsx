'use client';

import React from 'react';

interface SocialShareProps {
    url: string;
    title: string;
    image: string;
}

export default function SocialShare({ url, title, image }: SocialShareProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedImage = encodeURIComponent(image);

    const shareLinks = [
        {
            name: 'Pinterest',
            url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.69-2.435-2.828-2.435-4.581 0-3.728 2.705-7.144 7.825-7.144 4.105 0 7.296 2.938 7.296 6.812 0 4.067-2.545 7.339-6.063 7.339-1.183 0-2.293-.616-2.673-1.336l-.728 2.768c-.266 1.026-.985 2.308-1.465 3.089C9.284 23.86 10.632 24 12.016 24c6.627 0 12-5.373 12-12 0-6.633-5.373-12-12-12z" />
                </svg>
            ),
            color: 'bg-[#E60023] text-white hover:bg-[#b3001b]'
        },
        {
            name: 'WhatsApp',
            url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            ),
            color: 'bg-[#25D366] text-white hover:bg-[#20bd5a]'
        }
    ];

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Share:</span>
            {shareLinks.map((link) => (
                <button
                    key={link.name}
                    onClick={() => window.open(link.url, '_blank', 'width=600,height=400')}
                    className={`p-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${link.color}`}
                    title={`Share on ${link.name}`}
                >
                    {link.icon}
                </button>
            ))}
        </div>
    );
}
