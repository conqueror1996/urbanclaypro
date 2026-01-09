import Link from 'next/link';

export const metadata = {
    title: 'Return & Refund Policy | UrbanClay',
    description: 'Return and Refund Policy for UrbanClay purchases.',
};

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
            <header className="p-4 border-b border-[var(--line)] bg-white/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-6 h-6 bg-[var(--terracotta)] rounded-sm"></div>
                        <h1 className="font-semibold text-lg">UrbanClay</h1>
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8">Return & Refund Policy</h1>
                <p className="text-sm text-[#5d554f] mb-10">Last Updated: January 10, 2026</p>

                <div className="space-y-8 text-[#2A1E16] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. General Policy</h2>
                        <p>
                            Due to the nature of heavy building materials (terracotta tiles and bricks), we generally do not accept returns for change of mind once the material has been dispatched or delivered. We strongly encourage customers to order samples and verify specifications before placing a bulk order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Damaged or Defective Goods</h2>
                        <p>
                            We take great care in packing our products. However, breakage of up to 3-5% is considered standard industry norm for clay products during transit.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Transit Damages:</strong> Any breakage exceeding 5% must be reported within 24 hours of delivery with photographic evidence. We will replace the excess broken quantity free of cost or provide a refund for the same.</li>
                            <li><strong>Manufacturing Defects:</strong> If you notice distinct manufacturing defects (cracks, major warping beyond tolerance), please notify us immediately. Upon verification, we will arrange for a replacement.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Returns Process</h2>
                        <p>
                            To initiate a return for damaged goods:
                        </p>
                        <ol className="list-decimal pl-5 mt-2 space-y-1">
                            <li>Contact our support team at <strong>urbanclay@claytile.in</strong> or via WhatsApp.</li>
                            <li>Provide your Order ID and clear photos/videos of the damaged material upon unloading.</li>
                            <li>Our team will assess the claim within 2 business days.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Custom Orders</h2>
                        <p>
                            Products that are custom-manufactured (non-standard sizes, specific colors made to order) are <strong>non-refundable</strong> and <strong>non-returnable</strong> unless they are proven to be defective.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Refunds</h2>
                        <p>
                            Authorized refunds will be processed within 5-7 business days to the original method of payment. Shipping and handling charges for the initial delivery are non-refundable unless the entire shipment is defective.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--line)]">
                    <Link href="/" className="text-[var(--terracotta)] font-medium hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </main>
        </div>
    );
}
