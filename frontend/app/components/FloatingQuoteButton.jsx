'use client';
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import ZipForm from './ZipForm.jsx';

export default function FloatingQuoteButton() {
    const [showZipModal, setShowZipModal] = useState(false);
    const btnRef = useRef(null);
    const sparkleRef = useRef(null);
    const mobileBtnRef = useRef(null);
    const mobileSparkleRef = useRef(null);

    // GSAP bounce animation for attention
    useEffect(() => {
        const btns = [btnRef.current, mobileBtnRef.current].filter(Boolean);
        const sparkles = [sparkleRef.current, mobileSparkleRef.current].filter(Boolean);
        if (btns.length === 0 && sparkles.length === 0) return;

        const timelines = [];
        btns.forEach((el) => {
            const tl = gsap.timeline({ repeat: -1, yoyo: true });
            tl.to(el, { x: 10, duration: 1.1, ease: 'power1.inOut' })
              .to(el, { y: -2, scale: 1.04, duration: 0.7, ease: 'power1.inOut' }, 0);
            tl.paused(showZipModal);
            timelines.push(tl);
        });

        sparkles.forEach((sp) => {
            gsap.set(sp, { opacity: 0.0 });
            const sTl = gsap.timeline({ repeat: -1 });
            sTl
              .to(sp, { opacity: 0.85, duration: 0.6, ease: 'power2.out' })
              .to(sp, { x: 6, y: -6, duration: 0.9, ease: 'power1.inOut' })
              .to(sp, { opacity: 0.0, duration: 0.4, ease: 'power2.in' })
              .to(sp, { x: 0, y: 0, duration: 0.1 });
            sTl.paused(showZipModal);
            timelines.push(sTl);
        });

        return () => {
            timelines.forEach((t) => t.kill());
        };
    }, [showZipModal]);

    return (
        <>
            {/* Floating Quote Button */}
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
                <button
                    onClick={() => setShowZipModal(true)}
                    ref={btnRef}
                    aria-label="Get insurance quote"
                    className="relative bg-gradient-to-br from-[var(--ai-orange-700)] via-[var(--ai-orange-500)] to-red-600 text-white px-5 py-4 rounded-l-full shadow-2xl hover:from-[var(--ai-orange-hover)] hover:to-red-700 transition-all duration-300 flex items-center gap-2 group transform hover:scale-105 ring-2 ring-white/20 border border-white/20 backdrop-blur-[2px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--ai-orange-rgb),0.6)]"
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                    }}
                >
                    <svg className="w-5 h-5 rotate-90 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-extrabold text-sm tracking-wider drop-shadow">GET QUOTE</span>
                    {/* Hover effect arrow */}
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-[var(--ai-orange-hover)] border-t-2 border-b-2 border-t-transparent border-b-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Glow accent */}
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[rgba(var(--ai-orange-rgb),0.3)] blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Savings badge */}
                    <span className="absolute -top-4 right-0 translate-x-1 text-[10px] px-2 py-[3px] rounded-full bg-white/90 text-[var(--ai-orange-hover)] font-bold shadow-md border border-[var(--ai-orange-200)]">Save 40%</span>
                    {/* Tooltip */}
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-neutral-900 text-white text-xs opacity-0 group-hover:opacity-100 shadow-lg">Instant quotes</span>
                    {/* Sparkle */}
                    <span ref={sparkleRef} className="absolute -right-2 top-2 h-3 w-3 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                </button>
            </div>

            {/* Mobile Floating Quote Button */}
            <div className="fixed bottom-4 right-4 z-40 lg:hidden">
                <button
                    onClick={() => setShowZipModal(true)}
                    ref={mobileBtnRef}
                    aria-label="Get insurance quote"
                    className="relative bg-gradient-to-r from-[var(--ai-orange-700)] via-[var(--ai-orange-500)] to-red-600 text-white px-4 py-3 rounded-full shadow-2xl hover:from-[var(--ai-orange-hover)] hover:to-red-700 transition-all duration-300 flex items-center gap-2 group hover:scale-105 ring-2 ring-white/20 border border-white/20 backdrop-blur-[2px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--ai-orange-rgb),0.6)]"
                >
                    <svg className="w-5 h-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-extrabold text-sm tracking-wider drop-shadow">GET QUOTE</span>
                    {/* Glow accent */}
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[rgba(var(--ai-orange-rgb),0.3)] blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Savings badge */}
                    <span className="absolute -top-3 -right-3 text-[10px] px-2 py-[3px] rounded-full bg-white/90 text-[var(--ai-orange-hover)] font-bold shadow-md border border-[var(--ai-orange-200)]">Save 40%</span>
                    {/* Sparkle */}
                    <span ref={mobileSparkleRef} className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                </button>
            </div>

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
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[var(--ai-orange-500)] to-[var(--ai-orange-hover)] rounded-full mb-6 shadow-lg">
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