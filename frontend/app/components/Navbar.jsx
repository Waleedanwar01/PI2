'use client'
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Phone, X, Menu } from 'lucide-react';
import SmartLink from './SmartLink.jsx';
import SmartImage from './SmartImage.jsx';
import ZipForm from './ZipForm.jsx';
import { getMediaUrl } from '../lib/config.js';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
    const [phone, setPhone] = useState('');
    const [brand, setBrand] = useState('AutoInsurance.org');
    const [logoUrl, setLogoUrl] = useState(null);
    const [logoHeight, setLogoHeight] = useState(32);
    const [siteConfig, setSiteConfig] = useState(null);
    const navbarRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    
    // Zip form modal state
    const [showZipModal, setShowZipModal] = useState(false);
    
    // Dynamic data from database
    const [pagesData, setPagesData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch site configuration data
    useEffect(() => {
        const versioned = (u, v) => {
            const url = String(u || '').trim();
            if (!url) return null;
            const sep = url.includes('?') ? '&' : '?';
            return v ? `${url}${sep}v=${encodeURIComponent(v)}` : url;
        };
        const fetchSiteConfig = async () => {
            try {
                const response = await fetch('/api/site-config/', { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    setSiteConfig(data);
                    
                    // Update component state with site config data
                    if (data.phone_number) setPhone(data.phone_number);
                    if (data.brand_name) setBrand(data.brand_name);
                    if (data.logo_url) setLogoUrl(versioned(getMediaUrl(data.logo_url), data.updated_at));
                    if (data.logo_height_px) setLogoHeight(data.logo_height_px);
                }
            } catch (error) {
                console.error('Error fetching site config:', error);
            }
        };

        fetchSiteConfig();
    }, []);

    // Fetch dynamic categories from database
    useEffect(() => {
        const fetchPagesData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/pages-with-categories/?include_blogs=0', { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    // Transform ALL pages data from database
                    const transformedPages = (data.pages || [])
                        .filter(page => page.slug !== 'state') // Remove duplicate "state" page only
                        .map(page => ({
                            slug: page.slug,
                            name: page.name,
                            has_dropdown: page.has_dropdown,
                            dropdownItems: (page.categories || []).map(category => ({
                                name: category.name,
                                slug: category.slug,
                                blogs: [] // Show all categories regardless of blog content
                            }))
                        }));
                        // Show ALL pages from database - NO FILTERING
                    
                    setPagesData(transformedPages);
                } else {
                    console.error('Failed to fetch pages data:', response.status);
                    setPagesData([]);
                }
            } catch (error) {
                console.error('Error fetching pages data:', error);
                setPagesData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPagesData();
    }, []);

    const pathname = usePathname();

    // Scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when clicking a link
    const handleMobileLinkClick = () => {
        setIsMobileMenuOpen(false);
        setDropdownOpen(false);
        setActiveDropdown(null);
        setMobileOpenDropdown(null);
    };

    // Enhanced dropdown handling with better hover management
    const handleDropdownEnter = (slug) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setDropdownOpen(true);
        setActiveDropdown(slug);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
            setActiveDropdown(null);
        }, 150);
    };

    // Mobile dropdown toggle handler
    const handleMobileDropdownToggle = (slug) => {
        setMobileOpenDropdown(mobileOpenDropdown === slug ? null : slug);
    };

    // Show loading state while fetching data
    if (loading) {
        return (
            <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-1 min-w-0 flex items-center">
                            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                            <div className="animate-pulse bg-gray-200 h-6 w-6 rounded md:hidden"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Main Navbar Container: Enhanced with scroll animations */}
            <nav
                ref={navbarRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-[var(--ai-orange-100)]'
                        : 'bg-white border-b border-gray-200 shadow-sm'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        
                        {/* Left: Logo with enhanced animations */}
                        <div className="flex items-center space-x-4">
                            
                            {/* Logo */}
                            <SmartLink
                                href="/"
                                className="group font-bold text-gray-900 text-xl tracking-tight flex items-center space-x-2 hover:text-[var(--ai-orange-700)] transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="relative overflow-hidden rounded-lg">
                                    {logoUrl ? (
                                        <SmartImage
                                            src={logoUrl}
                                            alt={brand}
                                            style={{ height: `${logoHeight}px` }}
                                            className="w-auto transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <span className="transition-colors duration-300">{brand}</span>
                                    )}
                                </div>
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--ai-orange-rgb),0)] via-[rgba(var(--ai-orange-rgb),0.2)] to-[rgba(var(--ai-orange-rgb),0)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                            </SmartLink>
                        </div>

                        {/* Center: Navigation Links simplified and right-aligned */}
                        <div className="hidden md:flex ml-auto justify-end relative">
                            <ul className="flex items-center gap-3">
                                {pagesData.map((p, index) => (
                                    <li
                                        key={p.slug}
                                        className="relative flex-shrink-0"
                                        onMouseEnter={() => (p.has_dropdown || p.dropdownItems.length > 0) && handleDropdownEnter(p.slug)}
                                        onMouseLeave={handleDropdownLeave}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {(p.has_dropdown || p.dropdownItems.length > 0) ? (
                                            <button className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[var(--ai-orange-700)] whitespace-nowrap py-2 px-2 rounded-md transition-colors">
                                                <span>{p.name}</span>
                                                <ChevronDown className={`w-4 h-4 ${dropdownOpen && activeDropdown === p.slug ? 'rotate-180 text-[var(--ai-orange-hover)]' : ''}`} />
                                            </button>
                                        ) : (
                                            <SmartLink
                                                href={`/${p.slug}`}
                                                className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-[var(--ai-orange-700)] whitespace-nowrap py-2 px-2 rounded-md transition-colors"
                                            >
                                                <span>{p.name}</span>
                                            </SmartLink>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right: Phone and Mobile Toggle with animations */}
                        <div className="flex min-w-0 justify-end items-center space-x-4 ml-4">
                            {phone && (
                                <SmartLink
                                    href={`tel:${phone.replace(/\s+/g,'')}`}
                                    className="group hidden lg:inline-flex items-center text-[var(--ai-orange-700)] border-2 border-[var(--ai-orange-700)] px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-[var(--ai-orange-50)] hover:to-[var(--ai-orange-100)] whitespace-nowrap relative overflow-hidden"
                                >
                                    {/* Animated background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--ai-orange-rgb),0)] via-[rgba(var(--ai-orange-rgb),0.1)] to-[rgba(var(--ai-orange-rgb),0)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <Phone className="w-4 h-4 mr-2 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--ai-orange-hover)]">{phone}</span>
                                    {/* Pulse ring effect */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-[var(--ai-orange-500)] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-110 transition-all duration-300"></div>
                                </SmartLink>
                            )}
                            
                            {/* Hamburger Icon for Mobile with enhanced animations */}
                            <div className="flex md:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="group relative text-gray-500 hover:text-[var(--ai-orange-700)] p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r hover:from-[var(--ai-orange-50)] hover:to-[var(--ai-orange-100)]"
                                    aria-expanded={isMobileMenuOpen}
                                    aria-controls="mobile-menu"
                                >
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                        {isMobileMenuOpen ? (
                                            <X className="w-6 h-6 transition-all duration-300 transform rotate-90 text-[var(--ai-orange-hover)]" aria-label="Close menu" />
                                        ) : (
                                            <div className="space-y-1.5">
                                                <div className="w-5 h-0.5 bg-current transition-all duration-300 group-hover:bg-[var(--ai-orange-hover)] group-hover:scale-110"></div>
                                                <div className="w-4 h-0.5 bg-current transition-all duration-300 group-hover:bg-[var(--ai-orange-hover)] group-hover:scale-110 group-hover:translate-x-0.5"></div>
                                                <div className="w-5 h-0.5 bg-current transition-all duration-300 group-hover:bg-[var(--ai-orange-hover)] group-hover:scale-110"></div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[rgba(var(--ai-orange-rgb),0)] via-[rgba(var(--ai-orange-rgb),0.2)] to-[rgba(var(--ai-orange-rgb),0)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Enhanced Full Size Dropdown Menu with smooth animations */}
                {dropdownOpen && activeDropdown && (
                    <div
                        className="absolute left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[rgba(var(--ai-orange-rgb),0.5)] z-50 min-h-[500px] rounded-b-3xl animate-in slide-in-from-top-2 duration-500 ease-out"
                        onMouseEnter={() => handleDropdownEnter(activeDropdown)}
                        onMouseLeave={handleDropdownLeave}
                        style={{ top: '100%' }}
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-5 gap-4">
                                {(() => {
                                    const currentPage = pagesData.find(p => p.slug === activeDropdown);
                                    if (!currentPage || !currentPage.dropdownItems || currentPage.dropdownItems.length === 0) return null;
                                    
                                    // Show first 25 items (5 columns × 5 rows)
                                    const limitedItems = currentPage.dropdownItems.slice(0, 25);
                                    
                                    return limitedItems.map((item, index) => (
                                        <SmartLink
                                            key={`${activeDropdown}-${index}`}
                                            href={`/articles/${item.slug}`}
                                            className="group relative block text-sm text-gray-700 hover:text-orange-700 rounded-xl px-4 py-3 transition-all duration-300 font-semibold border border-gray-100 hover:border-orange-300 transform hover:scale-105 hover:shadow-lg"
                                            onClick={handleMobileLinkClick}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="text-center">
                                                <span className="text-gray-900 font-semibold group-hover:text-orange-800 text-xs transition-colors duration-300 block mb-1">{item.name}</span>
                                                <div className="flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-orange-300 rounded-full group-hover:bg-orange-500 transition-all duration-300"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Hover effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-orange-100/30 to-orange-50/0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                                        </SmartLink>
                                    ));
                                })()}
                            </div>
                            
                            {/* Next Button Below */}
                            <div className="mt-6 text-center">
                                <SmartLink
                                    href="/articles"
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    onClick={handleMobileLinkClick}
                                >
                                    <span>View All Articles</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </SmartLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Enhanced Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 overflow-y-auto animate-in slide-in-from-right duration-500">
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center h-16 px-4 border-b border-orange-200 sticky top-0 bg-white/95 backdrop-blur-md z-50 shadow-lg">
                        <SmartLink
                            href="/"
                            onClick={handleMobileLinkClick}
                            className="font-bold text-gray-900 text-xl tracking-tight flex items-center space-x-2 hover:text-orange-700 transition-all duration-300 transform hover:scale-105"
                        >
                            {logoUrl ? (
                                <SmartImage src={logoUrl} alt={brand} style={{ height: `${logoHeight}px` }} className="w-auto transition-transform duration-300 hover:scale-110" />
                            ) : (
                                <span className="transition-colors duration-300">{brand}</span>
                            )}
                        </SmartLink>
                        <button
                            onClick={toggleMobileMenu}
                            className="group text-gray-500 hover:text-orange-700 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:bg-orange-50"
                            aria-label="Close mobile menu"
                        >
                            <X className="w-6 h-6 transition-all duration-300 group-hover:rotate-90" />
                        </button>
                    </div>
<ul className="space-y-1 p-4 animate-in fade-in duration-500">
    {pagesData.map((p, index) => (
        <li key={p.slug} style={{ animationDelay: `${index * 100}ms` }}>
            <div className='border-b border-gray-200 mb-6 animate-in slide-in-from-left duration-500'>
                {(p.has_dropdown || p.dropdownItems.length > 0) ? (
                    <div className="group">
                        <button
                            onClick={() => handleMobileDropdownToggle(p.slug)}
                            className="flex justify-between items-center w-full py-4 text-lg font-bold text-gray-800 hover:text-orange-700 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 px-3"
                        >
                            <span className="transition-colors duration-300">{p.name}</span>
                            <ChevronDown className={`w-5 h-5 transition-all duration-300 ${mobileOpenDropdown === p.slug ? 'rotate-180 text-orange-600' : 'group-hover:text-orange-600'}`} />
                        </button>
                        {mobileOpenDropdown === p.slug && (
                            <ul className="pl-2 pb-4 space-y-3 grid grid-cols-1 gap-2">
                                {p.dropdownItems?.map((item, itemIndex) => (
                                    <li key={itemIndex} className="w-full">
                                        <SmartLink
                                            href={`/articles/${item.slug}`}
                                            className="group/item block w-full py-4 px-4 text-base text-gray-700 hover:text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-xl transition-all duration-300 border border-gray-100 hover:border-orange-300 transform hover:scale-102 hover:shadow-lg"
                                            onClick={handleMobileLinkClick}
                                            style={{ animationDelay: `${itemIndex * 100}ms` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold transition-colors duration-300 group-hover/item:text-orange-800">{item.name}</span>
                                                <div className="w-3 h-3 bg-orange-300 rounded-full group-hover/item:bg-orange-500 transition-all duration-300 transform group-hover/item:scale-125"></div>
                                            </div>
                                        </SmartLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <SmartLink
                        href={`/${p.slug}`}
                        className="group block py-4 text-lg font-semibold text-gray-800 hover:text-orange-700 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 px-3 transform hover:scale-102 relative overflow-hidden"
                        onClick={handleMobileLinkClick}
                    >
                        <span className="relative z-10 transition-colors duration-300">{p.name}</span>
                        {/* Animated underline */}
                        <div className="absolute bottom-3 left-3 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:w-16"></div>
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </SmartLink>
                )}
            </div>
        </li>
    ))}
    
    {/* Enhanced Action Items */}
    <li className="pt-6 animate-in slide-in-from-bottom duration-500" style={{ animationDelay: '300ms' }}>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-lg font-bold text-orange-800 mb-4 text-center flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Get Your Free Quote
            </h3>
            <ZipForm />
        </div>
    </li>
    
    <li className="pt-4 animate-in slide-in-from-left duration-500" style={{ animationDelay: '400ms' }}>
        <SmartLink
            href="/contact"
            className="group block py-4 text-lg font-semibold text-gray-800 hover:text-orange-700 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 px-3 transform hover:scale-102"
            onClick={handleMobileLinkClick}
        >
            <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 transition-colors duration-300 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="transition-colors duration-300">Contact</span>
            </div>
        </SmartLink>
    </li>

    {phone && (
        <li className="pt-4 animate-in slide-in-from-right duration-500" style={{ animationDelay: '500ms' }}>
            <SmartLink
                href={`tel:${phone.replace(/\s+/g,'')}`}
                className="group flex items-center justify-center w-full text-orange-700 border-2 border-orange-700 px-4 py-4 rounded-xl text-lg font-bold hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                onClick={handleMobileLinkClick}
            >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/10 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Phone className="w-5 h-5 mr-3 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-orange-800">Call Us: {phone}</span>
            </SmartLink>
        </li>
    )}
</ul>
</div>
)}

{/* Responsive ZIP Modal */}
{showZipModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowZipModal(false)}
    ></div>
    
    {/* Modal Content */}
    <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
            onClick={() => setShowZipModal(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Close form"
        >
            <X className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </X>
        </button>
        
        {/* Modal Content */}
        <div className="p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Free Insurance Quote</h2>
                <p className="text-lg text-gray-600">Compare rates from top insurers in your area</p>
            </div>
            
            <ZipForm />
            
            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-semibold">100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-semibold">Save 40%</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold">Instant Results</span>
                </div>
            </div>
        </div>
    </div>
</div>
)}
</>
);
}