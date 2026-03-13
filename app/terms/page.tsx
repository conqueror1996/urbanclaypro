import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms and Conditions | UrbanClay',
    description: 'Comprehensive terms and conditions governing the use of the UrbanClay website, product purchases, and service agreements.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--sand)]">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--ink)] mb-8">Terms and Conditions</h1>
                <p className="text-[#5d554f] mb-12 font-medium">Last Updated: March 2026</p>

                <div className="prose prose-stone prose-lg max-w-none text-[#5d554f]">
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing the UrbanClay website, requesting quotes, purchasing our products, or engaging our services, you acknowledge that you have read, understood, and agree to be unconditionally bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must strictly refrain from using our website and services.</p>

                    <h3>2. Product Specifications & Inherent Variations</h3>
                    <p>UrbanClay products are manufactured from natural clay and fired at high temperatures. Consequently, variations in shade, color, texture, size, and efflorescence are inherent and natural characteristics of the materials. <strong>These variations are not manufacturing defects and do not constitute grounds for rejection or refund.</strong> It is the responsibility of the purchaser and the installer to blend materials from multiple boxes or pallets prior to installation to achieve the desired aesthetic. All dimensions provided are approximate nominal sizes and are subject to accepted manufacturing tolerances.</p>

                    <h3>3. Orders, Pricing, and Payments</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Quotations:</strong> Issued quotes are valid for a period of 15 days from the date of issuance unless explicitly stated otherwise in writing. Prices are subject to change without prior notice.</li>
                        <li><strong>Payment Terms:</strong> For custom runs and bulk orders, a non-refundable advance payment of 100% is required to initiate production and secure dispatch, unless alternate credit terms have been agreed upon in writing by an authorized UrbanClay representative.</li>
                        <li><strong>Taxes & Duties:</strong> All prices are exclusive of applicable taxes, shipping, handling, and insurance, which will be calculated and appended to the final invoice.</li>
                        <li><strong>Cancellation:</strong> Orders for custom, made-to-order, or imported products cannot be canceled once production or dispatch has commenced. Stocked item cancellations may be subject to a restocking fee of up to 25%.</li>
                    </ul>

                    <h3>4. Delivery, Inspection, and Acceptance</h3>
                    <p>Delivery timelines are estimates provided in good faith and are not guaranteed. UrbanClay shall not be held liable for direct or indirect losses, damages, or site delays arising from delayed shipments.</p>
                    <p>Upon receipt of the materials, the purchaser or their designated site representative must inspect the cargo immediately. Any claims regarding damages in transit, shortages, or discrepancies must be reported in writing to UrbanClay along with photographic evidence within <strong>48 hours of delivery</strong>. Once the products are installed, cut, or altered in any manner, they are deemed to have been conclusively accepted, and UrbanClay will entertain no further claims regarding visible defects or variation.</p>

                    <h3>5. Installation and Warranty Disclaimer</h3>
                    <p>UrbanClay operates strictly as a manufacturer and supplier of materials. We do not provide installation services. Consequently, UrbanClay bears no responsibility or liability for damages, failures, or aesthetic issues resulting from improper installation, incorrect substrate preparation, structural movements, inappropriate environmental conditions, or the use of incorrect setting materials.</p>
                    <p><strong>EXCEPT AS EXPRESSLY WRITTEN HEREIN, URBANCLAY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</strong></p>

                    <h3>6. Intellectual Property Rights</h3>
                    <p>The entire content of this website, including but not limited to text, graphics, logos, images, product designs, architectural drawings, technical data sheets, and software, is the exclusive property of UrbanClay and is protected by applicable copyright, trademark, and intellectual property laws. You are strictly prohibited from reproducing, modifying, distributing, or utilizing any of our proprietary content without express prior written consent from UrbanClay.</p>

                    <h3>7. Limitation of Liability</h3>
                    <p>To the maximum extent permitted by applicable law, in no event shall UrbanClay, its directors, employees, affiliates, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, site delays, or business interruption, arising out of or related to the use of our website, our products, or our services. In all cases, UrbanClay’s total maximum liability shall be strictly limited to the initial purchase price of the specific products that gave rise to the claim.</p>

                    <h3>8. Indemnification</h3>
                    <p>You agree to indemnify, defend, and hold harmless UrbanClay from and against any and all claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of your breach of these Terms, your improper installation or usage of our products, or your violation of any law or the rights of a third party.</p>

                    <h3>9. Governing Law and Jurisdiction</h3>
                    <p>These Terms and your use of our services shall be governed by and construed in accordance with the laws of India. Any legal suit, action, or proceeding arising out of or related to these Terms or the products sold shall be instituted exclusively in the competent courts located in Mumbai, Maharashtra, India. By using our services, you irrevocably consent to the jurisdiction of such courts.</p>

                    <h3>10. Severability and Amendments</h3>
                    <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect. UrbanClay reserves the absolute right to unilaterally update, modify, or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.</p>

                    <hr className="my-10 border-[var(--line)]" />

                    <div className="bg-white/50 p-6 rounded-xl border border-[var(--line)]">
                        <p className="text-sm font-semibold mb-2 text-[var(--ink)]">Legal and Compliance Inquiries</p>
                        <p className="text-sm">For comprehensive information regarding these Terms, compliance matters, or to request specific policy documentation, please direct your correspondence to our legal department:</p>
                        <a href="mailto:legal@claytile.in" className="text-[var(--terracotta)] font-medium hover:underline inline-block mt-2">legal@claytile.in</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
