import React from 'react';

export default function CatalogueBack() {
    return (
        <div className="w-full h-full bg-[#1a1512] text-[#e8e4dc] p-16 flex flex-col justify-between items-center relative overflow-hidden">

            {/* Centered Logo */}
            <div className="mt-40 text-center">
                <h2 className="text-8xl font-serif text-white tracking-tighter mb-4">Urban Clay</h2>
                <p className="text-sm uppercase tracking-[0.3em] font-light text-neutral-400">
                    Fired Earth . Timeless Architecture
                </p>
            </div>

            <div className="w-full max-w-lg text-center space-y-12">

                {/* Contact */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c45d3f]">Headquarters</span>
                        <p className="font-light text-lg">No. 123, Clay District, Architecture Ave,<br /> Bangalore, India - 560001</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c45d3f]">Contact</span>
                        <p className="font-light text-lg">urbanclay@claytile.in</p>
                        <p className="font-light text-lg">+91 98765 43210</p>
                    </div>
                </div>

                {/* Website */}
                <div className="pt-12 border-t border-white/10 w-full">
                    <p className="text-2xl font-serif italic">www.claytile.in</p>
                </div>

            </div>

            {/* Footer legal */}
            <div className="w-full flex justify-between text-[10px] text-neutral-600 uppercase tracking-widest">
                <span>© 2025 Urban Clay Details</span>
                <span>Designed in India</span>
            </div>

        </div>
    );
}
