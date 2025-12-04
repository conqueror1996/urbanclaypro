import React from 'react';
import VisualizerTool from '@/components/VisualizerTool';
import { getProducts } from '@/lib/products';

export const metadata = {
    title: 'Visualizer Atelier | UrbanClay',
    description: 'Professional facade design tool. Upload your project, apply textures, and visualize your vision.',
};

export default async function VisualizerPage() {
    const products = await getProducts();

    return (
        <div className="fixed inset-0 bg-[#1a1a18] overflow-hidden">
            <VisualizerTool products={products} />
        </div>
    );
}
