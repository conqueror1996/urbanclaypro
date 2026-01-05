import React from 'react';

export default function CatalogueBack() {
    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] p-16 flex flex-col justify-between items-center relative overflow-hidden font-sans">

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>

            {/* Decorative Top Line */}
            <div className="w-[1px] h-32 bg-[#1a1512] mt-12 bg-opacity-20 relative z-10"></div>

            {/* Centered Logo */}
            <div className="text-center relative z-10">
                <h2 className="text-8xl font-serif text-[#1a1512] tracking-tighter mb-6 relative inline-block">
                    Urban Clay
                    {/* Tiny registered mark */}
                    <span className="absolute -top-4 -right-8 text-lg font-sans font-bold text-[#1a1512]/40">®</span>
                </h2>
                <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] font-medium text-neutral-400">
                    <span>Fired Earth</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--terracotta)]"></span>
                    <span>Timeless Architecture</span>
                </div>
            </div>

            <div className="w-full max-w-lg text-center space-y-16 relative z-10">
                <div className="flex flex-col gap-8">
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] mb-2">Studio</span>
                        <p className="font-serif italic text-xl text-[#1a1512]/80">Mumbai • New Delhi • Bangalore</p>
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] mb-2">Connect</span>
                        <a href="https://claytile.in" className="font-mono text-sm underline decoration-[#1a1512]/30 underline-offset-4 hover:decoration-[var(--terracotta)] transition-all">www.claytile.in</a>
                    </div>
                </div>
            </div>

            {/* Footer legal */}
            <div className="w-full flex justify-between text-[9px] text-neutral-400 uppercase tracking-widest border-t border-[#1a1512]/10 pt-8 mt-12 relative z-10">
                <span>© 2025 Urban Clay Details</span>
                <span>The Material Monograph</span>
            </div>

        </div>
    );
}
