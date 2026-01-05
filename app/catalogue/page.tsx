import React from 'react';
import { getProducts, getProjects, Product, Project } from '@/lib/products';
import CatalogueCover from '../../components/catalogue/CatalogueCover';
import CatalogueIntro from '../../components/catalogue/CatalogueIntro';
import CatalogueProduct from '../../components/catalogue/CatalogueProduct';
import CatalogueBack from '../../components/catalogue/CatalogueBack';
import PrintButton from '../../components/catalogue/PrintButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Urban Clay - 2025 Monograph',
    description: 'Limited edition architectural catalogue featuring our complete range of premium terracotta tiles, jaalis, and cladding systems.',
};

function groupProductsByCategory(products: Product[]) {
    const groups: Record<string, Product[]> = {
        'The Monoliths': [], // Bricks
        'The Screens': [],   // Jaalis
        'The Skins': [],     // Cladding/Tiles
        'The Collection': [] // Everything else
    };

    products.forEach(p => {
        const t = p.title.toLowerCase();

        if (t.includes('brick') && !t.includes('tile') && !t.includes('cladding')) {
            groups['The Monoliths'].push(p);
        } else if (t.includes('jaali') || t.includes('screen') || t.includes('perforated') || t.includes('breeze')) {
            groups['The Screens'].push(p);
        } else if (t.includes('tile') || t.includes('cladding') || t.includes('facade') || t.includes('panel') || t.includes('louver')) {
            groups['The Skins'].push(p);
        } else {
            groups['The Collection'].push(p);
        }
    });

    return groups;
}

function ChapterCover({ title, index }: { title: string, index: string }) {
    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] relative flex flex-col justify-center items-center overflow-hidden p-12 font-sans">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>
            <div className="relative z-10 text-center">
                <span className="block text-xs font-bold uppercase tracking-[0.5em] mb-8 text-[var(--terracotta)]">
                    Chapter {index}
                </span>

                <h2 className="text-[100px] md:text-[140px] font-serif leading-[0.8] tracking-tighter text-[#1a1512] mb-12 mix-blend-multiply">
                    {title.split(' ').map((word, i) => (
                        <span key={i} className="block">{word}</span>
                    ))}
                </h2>
                <div className="w-[1px] h-24 bg-[#1a1512] mx-auto"></div>
            </div>
        </div>
    );
}

export default async function CataloguePage({ searchParams }: { searchParams: { v?: string } }) {
    const products = await getProducts();
    // NOTE: We are intentionally NOT expanding variants here to keep the catalogue length manageable
    // while maintaining the premium "1 Product per Page" aesthetic.
    const grouped = groupProductsByCategory(products);

    const sections = [
        { title: 'The Monoliths', data: grouped['The Monoliths'], index: '01' },
        { title: 'The Screens', data: grouped['The Screens'], index: '02' },
        { title: 'The Skins', data: grouped['The Skins'], index: '03' },
        { title: 'The Collection', data: grouped['The Collection'], index: '04' }
    ];

    let pageCounter = 3;
    const version = searchParams?.v === 'eco' ? 'eco' : 'premium';

    return (
        <div className="catalogue-container bg-[#e0e0e0] text-black min-h-screen font-sans">
            <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { break-after: page; }
          img { filter: none !important; -webkit-filter: none !important; }
          .catalogue-page { width: 210mm; height: 297mm; margin: 0; box-shadow: none; overflow: hidden; position: relative; background: white; }
          .no-print { display: none !important; }
        }
        .catalogue-page { width: 100%; min-height: 100vh; position: relative; background: #E8E6E1; margin-bottom: 2rem; overflow: hidden; }
        @media screen and (min-width: 1024px) {
            .catalogue-page { width: 210mm; height: 297mm; margin: 2rem auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        }
      `}</style>

            {/* Header */}
            <div className="no-print fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-t border-neutral-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Monograph Version:</span>
                    <div className="flex bg-neutral-100 p-1 rounded-lg">
                        <a href="/catalogue?v=premium" className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest transition-all ${version === 'premium' ? 'bg-[#1a1512] text-white shadow-md' : 'text-neutral-500 hover:text-black'}`}>
                            Premium Monograph
                        </a>
                    </div>
                </div>
                <PrintButton />
            </div>

            {/* Content Pages */}
            <div className="catalogue-page page-break hidden md:block"><CatalogueCover /></div>
            <div className="catalogue-page page-break hidden md:block"><CatalogueIntro /></div>

            {sections.map((section) => {
                if (section.data.length === 0) return null;

                return (
                    <React.Fragment key={section.title}>
                        <div className="catalogue-page page-break hidden md:block">
                            <ChapterCover title={section.title} index={section.index} />
                        </div>

                        {/* Render Main Products Only (No Grid, No Infinite Expansion) */}
                        {section.data.map((product) => {
                            pageCounter++;
                            return (
                                <div key={product._id} className="catalogue-page page-break">
                                    <CatalogueProduct product={product} index={pageCounter} />
                                </div>
                            );
                        })}
                    </React.Fragment>
                );
            })}

            <div className="catalogue-page"><CatalogueBack /></div>
        </div>
    );
}
