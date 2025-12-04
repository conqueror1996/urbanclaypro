import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy | UrbanClay',
    description: 'Privacy Policy for UrbanClay website.',
};

export default function PrivacyPolicy() {
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
                <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8">Privacy Policy</h1>
                <p className="text-sm text-[#5d554f] mb-10">Last Updated: November 28, 2024</p>

                <div className="space-y-8 text-[#2A1E16] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                        <p>
                            Welcome to UrbanClay. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
                        <p>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Identity Data:</strong> Name, Role (Architect, Builder, etc.).</li>
                            <li><strong>Contact Data:</strong> Phone number, City.</li>
                            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>To process your requests for quotes and samples.</li>
                            <li>To communicate with you via WhatsApp regarding your inquiries.</li>
                            <li>To improve our website and customer service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you (e.g., WhatsApp, Logistics Partners), so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us via WhatsApp or email.
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
