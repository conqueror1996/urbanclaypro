import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="contact" className="bg-[#2A1E16] text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            <Image
                                src="/urbanclay-logo.png"
                                alt="UrbanClay"
                                width={120}
                                height={40}
                                className="h-10 w-auto opacity-90 brightness-0 invert"
                            />
                            {/* Fallback if no white logo image exists yet, we can use text or filter */}
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            India's premier manufacturer of sustainable terracotta tiles, brick cladding, and architectural facades.
                        </p>
                        <div className="flex items-center gap-4">
                            {/* Social Icons */}
                            <SocialLink href="https://www.instagram.com/urbanclay.in/" label="Instagram" icon="instagram" />
                            <SocialLink href="https://linkedin.com/company/urbanclay" label="LinkedIn" icon="linkedin" />
                            <SocialLink href="https://x.com/urbanclayindia" label="X (Twitter)" icon="twitter" />
                        </div>
                    </div>

                    {/* Column 2: Products */}
                    <div>
                        <h3 className="font-serif text-lg mb-6 text-[#d8b09a]">Products</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><FooterLink href="/products/exposed-bricks">Exposed Wirecut Bricks</FooterLink></li>
                            <li><FooterLink href="/products/brick-wall-tiles">Brick Cladding Tiles</FooterLink></li>
                            <li><FooterLink href="/products/terracotta-jaali">Terracotta Jaali</FooterLink></li>
                            <li><FooterLink href="/products/clay-facade-panels">Clay Facade Panels</FooterLink></li>
                            <li><FooterLink href="/products/clay-floor-tiles">Floor & Roof Tiles</FooterLink></li>
                            <li><FooterLink href="/products/clay-ceiling-tiles">Ceiling Tiles</FooterLink></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h3 className="font-serif text-lg mb-6 text-[#d8b09a]">Resources</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><FooterLink href="/resources">Installation Guides</FooterLink></li>
                            <li><FooterLink href="/resources">Technical Data Sheets</FooterLink></li>
                            <li><FooterLink href="/projects">Project Showcase</FooterLink></li>
                            <li><FooterLink href="/architects">For Architects</FooterLink></li>
                            <li><FooterLink href="/guide">Selection Guide</FooterLink></li>
                        </ul>
                    </div>

                    {/* Column 4: Company & Contact */}
                    <div>
                        <h3 className="font-serif text-lg mb-6 text-[#d8b09a]">Company</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><FooterLink href="/our-story">Our Story</FooterLink></li>
                            <li><FooterLink href="/contact">Contact Us</FooterLink></li>
                            <li className="pt-4">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Sales & Support</p>
                                <a href="tel:+918080081951" className="block text-white hover:text-[#d8b09a] transition-colors font-medium">+91 80800 81951</a>
                                <a href="tel:+917977107611" className="block text-white hover:text-[#d8b09a] transition-colors font-medium">+91 79771 07611</a>
                                <a href="mailto:sales@urbanclay.in" className="block text-white hover:text-[#d8b09a] transition-colors font-medium">sales@urbanclay.in</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} UrbanClay. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
            {children}
        </Link>
    );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#d8b09a] hover:text-[#1c1917] transition-all duration-300"
            aria-label={label}
        >
            {icon === 'instagram' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            )}
            {icon === 'linkedin' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            )}
            {icon === 'twitter' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            )}
        </a>
    );
}
