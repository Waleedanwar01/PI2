"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from 'gsap';
import { Twitter, Youtube, Facebook, Instagram, Linkedin, Globe, Shield, Star } from "lucide-react";
import SmartLink from './SmartLink.jsx';
import SmartImage from './SmartImage.jsx';
import { getMediaUrl } from '../lib/config.js';

// Helper functions (resolveHref and FooterCopyright) remain the same.

const Footer = () => {
    const [brandName, setBrandName] = useState("AutoInsurance.org");
    const [logoUrl, setLogoUrl] = useState(null);
    const [logoHeight, setLogoHeight] = useState(null);
    const [disclaimer, setDisclaimer] = useState("");
    const [footerText, setFooterText] = useState("We are a free online resource for anyone interested in learning more about auto insurance. Our goal is to be an objective, third-party resource for everything auto insurance related.");
    const [address, setAddress] = useState("");
    const [addressSource, setAddressSource] = useState(""); // Track where address came from
    // Company and Legal links fetched dynamically from backend
    const [companyLinks, setCompanyLinks] = useState([]);
    const [legalLinks, setLegalLinks] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);

    // Pick icon based on URL hostname
    const iconFor = (url) => {
        try {
            const u = new URL(url);
            const h = (u.hostname || '').toLowerCase();
            if (h.includes('facebook')) return Facebook;
            if (h.includes('twitter') || h.includes('x.com')) return Twitter;
            if (h.includes('instagram')) return Instagram;
            if (h.includes('youtube')) return Youtube;
            if (h.includes('linkedin')) return Linkedin;
        } catch (e) {}
        return Globe;
    };

    // Fetch site config: brand, logo, disclaimer, address, social links
    useEffect(() => {
        const versioned = (u, v) => {
            const url = String(u || '').trim();
            if (!url) return null;
            const sep = url.includes('?') ? '&' : '?';
            return v ? `${url}${sep}v=${encodeURIComponent(v)}` : url;
        };
        fetch('/api/site-config/', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const bn = (data.brand_name || data.site_name || '').trim();
                if (bn) setBrandName(bn);
                if (data.logo_url) setLogoUrl(versioned(getMediaUrl(data.logo_url), data.updated_at));
                if (data.logo_height) setLogoHeight(data.logo_height);

                const dsc = (data.footer_disclaimer || data.disclaimer || data.disclaimer_text || '').trim();
                if (dsc) setDisclaimer(dsc);
                const addr = (data.address || '').trim();
                if (addr) setAddress(addr);

                // Build social links from API: supports array of URLs and per-field URLs
                let linksFromAdmin = [];
                const arr = Array.isArray(data.social_links) ? data.social_links : [];
                arr.forEach((u) => {
                    const href = String(u || '').trim();
                    if (href) linksFromAdmin.push(href);
                });
                // Also pick from individual fields if present
                ['facebook_url','twitter_url','instagram_url','linkedin_url','youtube_url'].forEach((fname) => {
                    const href = String(data[fname] || '').trim();
                    if (href) linksFromAdmin.push(href);
                });
                // De-duplicate
                linksFromAdmin = Array.from(new Set(linksFromAdmin));
                setSocialLinks(linksFromAdmin);
            })
            .catch(() => {
                // Silent fail: keep defaults and show no social icons if unavailable
                setSocialLinks([]);
            });
    }, []);

    // Fetch footer address from articles dynamically
    useEffect(() => {
        fetch('/api/footer-address/', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data.address) {
                    setAddress(data.address);
                    setAddressSource(data.source || '');
                }
            })
            .catch(() => {
                // Silent fail: keep existing address or default
            });
    }, []);

    // Fetch footer links (Company, Legal) from admin
    useEffect(() => {
        fetch('/api/menu/footer/', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const company = Array.isArray(data.company) ? data.company : [];
                const legal = Array.isArray(data.legal) ? data.legal : [];
                setCompanyLinks(company);
                setLegalLinks(legal);
            })
            .catch(() => {
                // Ignore menu errors in UI
            });
    }, []);
    // Removed Company/Legal toggle states and bars per request

    // *****************************************************************
    // ******************** DESIGN MODIFICATION HERE *******************
    // ** 1. Removed rounded-t-3xl from footer.                       **
    // ** 2. Added a Wave DIV with clip-path at the top.              **
    // ** 3. Used negative margin (-mt-10) on the FORM SECTION.       **
    // *****************************************************************
    return (
        <footer className="bg-gradient-to-b from-neutral-900 to-neutral-800 text-gray-500 font-sans relative pt-16 overflow-visible"> 
            {/* 1. Wave shape at the top (Ocean Wave Effect) */}
            <div 
                className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-neutral-900 to-neutral-800 border-b border-neutral-700/50"
                style={{
                    // Creates a wavy, organic shape by clipping an ellipse
                    clipPath: 'ellipse(100% 50% at 50% 100%)', 
                    transform: 'translateY(-50%)', 
                    zIndex: 0, // Behind the content
                }}
            />

            {/* ==== FORM SECTION (Blue band) - Slightly outside and inside footer ==== */}  
            <div className="relative text-center px-4 overflow-visible z-20 -mt-20 sm:-mt-24 md:-mt-28 pb-20"> 
                {/* Full-width blue band from 'Trusted by' down to the form */}
                <div className="relative overflow-hidden w-full rounded-2xl bg-gradient-to-r from-sky-600 to-blue-800 py-10 sm:py-12 shadow-xl ring-1 ring-white/10">
                    
                    {/* Dotted pattern at bottom of the band */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-24 opacity-40 pointer-events-none"
                        aria-hidden="true"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, rgba(255,255,255,0.85) 1px, rgba(255,255,255,0) 1px)',
                            backgroundSize: '12px 12px',
                            backgroundPosition: 'center',
                        }}
                    />

                    <div className="relative max-w-5xl mx-auto px-4">
                        {/* Trust indicators */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                                <Shield className="w-5 h-5 text-white" />
                                <span className="text-white text-sm font-semibold">Trusted by 500K+ Users</span>
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"> 
                            Find the Best <span className="text-[var(--ai-orange-300)]">Auto Insurance</span> Rates
                        </h2>
                        <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
                            Compare quotes from top-rated insurers in your area. Save up to 40% on your premium today.
                        </p>

                        {/* Foreground form card */}
                        <div className="relative max-w-3xl mx-auto px-3 sm:px-0">
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-100"> 
                                <form
                                    className="flex flex-col sm:flex-row items-stretch gap-3"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget;
                                        const zipInput = form.querySelector('input[name="zip"]');
                                        const zip = String(zipInput?.value || '').replace(/\D/g, '').slice(0, 5);
                                        if (zip.length === 5) {
                                            window.location.href = `/quotes?zip=${encodeURIComponent(zip)}`;
                                        }
                                    }}
                                >
                                    <div className="relative flex-1 grid grid-cols-1 gap-3">
                                        <div className="relative">
                                            <input
                                                name="zip"
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="Enter your ZIP code"
                                                className="w-full px-6 py-4 rounded-full text-gray-800 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ai-orange-500)] border border-gray-300 placeholder-gray-500 text-lg transition-colors duration-200"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-[var(--ai-orange-500)] to-[var(--ai-orange-hover)] hover:from-[var(--ai-orange-hover)] hover:to-[var(--ai-orange-700)] text-white font-bold px-8 py-4 rounded-full transition-transform duration-200 flex items-center justify-center gap-2 transform hover:scale-105 text-lg whitespace-nowrap group shadow-lg shadow-[var(--ai-orange-700)]/40"
                                    >
                                        <span className="group-hover:scale-105 transition-transform">GET QUOTES</span>
                                        <Star className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    </button>
                                </form>
                                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-sm text-gray-600"> 
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-500" /> 
                                        <span className="font-medium">256-bit SSL</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>No credit check</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>100% Free</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==== MAIN FOOTER SECTION ==== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10"> 
                {/* Top Section: Logo & Description */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-700 pb-8 mb-8"> 
                    <div className="md:w-3/4 mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {brandName}
                        </h2>
                        <p className="text-gray-400 leading-relaxed max-w-2xl text-sm sm:text-base">
                            {footerText}
                        </p>
                        
                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-4 mt-6">
                            <div className="flex items-center gap-2 bg-green-600/20 text-green-300 px-4 py-2 rounded-xl border border-green-500/30"> 
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Insured & Licensed</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30"> 
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-medium">A+ Rated Service</span>
                            </div>
                        </div>
                    </div>

                    {/* Links & Social */}
                    <div className="flex flex-col items-start md:items-end w-full md:w-1/4 pt-4 md:pt-0">
                        {socialLinks && socialLinks.length > 0 ? (
                            <div className="flex items-center gap-3">
                                {socialLinks.map((href, idx) => {
                                    const Icon = iconFor(href);
                                    return (
                                        <a
                                            key={`${href}-${idx}`}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-neutral-600 text-gray-300 hover:text-white hover:border-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-md"
                                            aria-label="Social link"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Company & Legal lists in main footer */}
                {(companyLinks?.length > 0 || legalLinks?.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
                        {companyLinks?.length > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-3">Company</h3>
                                <div className="flex flex-col gap-2">
                                    {companyLinks.map((item, idx) => (
                                        <SmartLink
                                            key={`${String(item.page_slug || item.href || item.name || '')}-${idx}`}
                                            href={resolveHref(item)}
                                            className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 text-sm"
                                        >
                                            {item.name}
                                        </SmartLink>
                                    ))}
                                </div>
                            </div>
                        )}
                        {legalLinks?.length > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-3">Legal</h3>
                                <div className="flex flex-col gap-2">
                                    {legalLinks.map((item, idx) => (
                                        <SmartLink
                                            key={`${String(item.page_slug || item.href || item.name || '')}-${idx}`}
                                            href={resolveHref(item)}
                                            className="text-gray-400 hover:text-white hover:underline transition-colors duration-200 text-sm"
                                        >
                                            {item.name}
                                        </SmartLink>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Section */}
                <div className="text-sm">
                    <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-neutral-900 md:p-6 p-4 rounded-xl border border-neutral-700 shadow-inner"> 
                        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                {logoUrl ? (
                                    <SmartImage src={logoUrl} alt={brandName} style={logoHeight ? { height: `${logoHeight}px` } : undefined} className="w-auto" />
                                ) : null}
                                <FooterCopyright brandName={brandName} />
                            </div>
                            
                            {/* Quick Links moved to the right */}
                            <div className="flex items-center gap-3 sm:ml-auto">
                                <SmartLink
                                    href="/articles"
                                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-200 hover:text-white rounded-lg transition-all duration-300 text-sm font-medium"
                                >
                                    Articles
                                </SmartLink>
                                <SmartLink
                                    href="/contact"
                                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-200 hover:text-white rounded-lg transition-all duration-300 text-sm font-medium"
                                >
                                    Contact
                                </SmartLink>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <p className="mt-4 pt-4 border-t border-neutral-800 text-[10px] sm:text-xs leading-relaxed text-gray-500">
                    {disclaimer || (
                        "Disclaimer: AutoInsurance.org strives to present the most up-to-date and comprehensive information on saving money on car insurance possible. This information may be different than what you see when you visit an insurance provider, insurance agency, or insurance company website. All insurance rates, products, and services are presented without warranty and guarantee. When evaluating rates, please verify directly with your insurance company or agent. Quotes and offers are not binding, nor a guarantee of coverage."
                    )}
                </p>

                {address ? (
                    <div className="w-full mt-2">
                        <p className="text-xs text-gray-500">{address}</p>
                        {addressSource && (
                            <p className="text-[10px] text-gray-400 mt-1">
                                Source: {addressSource === 'article' ? 'From article content' : addressSource === 'site_config' ? 'From site configuration' : 'Default'}
                            </p>
                        )}
                    </div>
                ) : null}
            </div>
        </footer>
    );
};

export default Footer;

function resolveHref(item) {
    if (item.href) return item.href;
    if (item.page_slug) {
        const anchor = item.anchor_id ? `#${String(item.anchor_id)}` : "";
        return `/${encodeURIComponent(String(item.page_slug || ''))}${anchor}`;
    }
    return "#";
}

function FooterCopyright({ brandName }) {
    const [copyright, setCopyright] = React.useState("");
    React.useEffect(() => {
        fetch('/api/site-config/', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const txt = (data.copyright_text || '').trim();
                if (txt) {
                    setCopyright(txt);
                } else {
                    const year = new Date().getFullYear();
                    setCopyright(`Copyright © ${year} ${brandName}`);
                }
            })
            .catch(() => {
                const year = new Date().getFullYear();
                setCopyright(`Copyright © ${year} ${brandName}`);
            });
    }, [brandName]);
    return (
        <p className="text-gray-400 font-medium text-xs sm:text-sm">{copyright}</p>
    );
}