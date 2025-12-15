import React from 'react';
import { getProducts, Product } from '@/lib/products';
import CatalogueCover from '../../components/catalogue/CatalogueCover';
import CatalogueIntro from '../../components/catalogue/CatalogueIntro';
import CatalogueProduct from '../../components/catalogue/CatalogueProduct';
import CatalogueBack from '../../components/catalogue/CatalogueBack';
import PrintButton from '../../components/catalogue/PrintButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Urban Clay - 2025 Monograph',
    description: 'Limited edition architectural catalogue.',
};

// Grouping Helper - REFINED LOGIC
function groupProductsByCategory(products: Product[]) {
    const groups: Record<string, Product[]> = {
        'The Monoliths': [], // Bricks
        'The Screens': [],   // Jaalis
        'The Skins': [],     // Cladding/Tiles
        'The Collection': [] // Everything else
    };

    products.forEach(p => {
        const t = p.title.toLowerCase();
        const c = (p.category?.title || '').toLowerCase();

        // STRICTER LOGIC
        if (t.includes('brick') && !t.includes('tile') && !t.includes('cladding')) {
            groups['The Monoliths'].push(p);
        } else if (t.includes('jaali') || t.includes('screen') || t.includes('perforated') || t.includes('breeze')) {
            groups['The Screens'].push(p);
        } else if (t.includes('tile') || t.includes('cladding') || t.includes('facade') || t.includes('panel') || t.includes('louver')) {
            groups['The Skins'].push(p);
        } else {
            // Fallback for pavers, floors, or undefined
            groups['The Collection'].push(p);
        }
    });

    return groups;
}

function ChapterCover({ title, index }: { title: string, index: string }) {
    return (
        <div className="w-full h-full bg-[#c45d3f] text-black relative flex flex-col justify-center items-center overflow-hidden p-12">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

            <span className="text-xs font-mono uppercase tracking-[0.5em] text-black mb-8 border border-black px-4 py-1 rounded-full z-10">
                Chapter {index}
            </span>
            <h2 className="text-[120px] font-serif leading-[0.85] text-center tracking-tighter mix-blend-multiply z-10">
                {title.split(' ').map((word, i) => <div key={i}>{word}</div>)}
            </h2>
            <div className="w-1 h-32 bg-black mt-12 z-10"></div>
        </div>
    );
}

export default async function CataloguePage() {
    const products = await getProducts();
    const grouped = groupProductsByCategory(products);
    const sections = [
        { title: 'The Monoliths', data: grouped['The Monoliths'], index: '01' },
        { title: 'The Screens', data: grouped['The Screens'], index: '02' },
        { title: 'The Skins', data: grouped['The Skins'], index: '03' },
        { title: 'The Collection', data: grouped['The Collection'], index: '04' }
    ];

    let pageCounter = 3; // Start after cover + intro

    return (
        <div className="catalogue-container bg-neutral-900 text-black min-h-screen font-sans">
            <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { break-after: page; }
          
          /* FORCE COLOR ON IMAGES */
          img { 
            filter: none !important; 
            -webkit-filter: none !important;
          }
        }
        .catalogue-page {
          width: 210mm; height: 297mm;
          overflow: hidden; position: relative;
          background: #E8E6E1; /* Raw Canvas Color */
          margin: 0 auto;
        }
        @media screen {
            .catalogue-page { margin-bottom: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        }
        @media print {
          .catalogue-page { margin: 0; box-shadow: none; width: 100%; height: 100vh; }
          .no-print { display: none !important; }
        }
      `}</style>

            <div className="no-print fixed bottom-8 right-8 z-50">
                <PrintButton />
            </div>

            {/* 1. Cover */}
            <div className="catalogue-page page-break"><CatalogueCover /></div>

            {/* 2. Intro */}
            <div className="catalogue-page page-break"><CatalogueIntro /></div>

            {/* 3. Dynamic Chapters */}
            {sections.map((section) => {
                if (section.data.length === 0) return null;

                return (
                    <React.Fragment key={section.title}>
                        {/* Chapter Divider */}
                        <div className="catalogue-page page-break">
                            <ChapterCover title={section.title} index={section.index} />
                        </div>

                        {/* Products in this chapter */}
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

            {/* 4. Back Cover */}
            <div className="catalogue-page"><CatalogueBack /></div>
        </div>
    );
}
