"use client";
import React, { useState } from 'react';
import { MapPin, ArrowRight, Shield, CheckCircle } from 'lucide-react';

export default function ZipForm({ heading = 'Compare Quotes Now:' }) {
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const clean = zip.replace(/\D/g, '').slice(0, 5);
      if (clean.length === 5) {
        setError('');
        // Use Next.js router for better navigation
        if (typeof window !== 'undefined' && window.location) {
          window.location.href = `/quotes?zip=${encodeURIComponent(clean)}`;
        }
      } else {
        setError('Please enter a valid 5-digit ZIP Code.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/20 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-300/50 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/50 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
      
      {/* Enhanced title with icon */}
      <div className="relative z-10 mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">{heading}</h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">Join thousands of drivers saving money on auto insurance</p>
      </div>
      
      <form noValidate onSubmit={handleSubmit} className="mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-lg relative z-10">
        <div className="relative w-full sm:w-64">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-600 z-10" />
          <input
            type="text"
            name="zip"
            value={zip}
            inputMode="numeric"
            aria-invalid={!!error}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="Enter 5-digit ZIP"
            maxLength={5}
            required
            disabled={isLoading}
            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-base font-semibold text-gray-800 focus:ring-4 focus:ring-orange-200 focus:border-orange-600 transition-all duration-300 bg-white shadow-inner placeholder-gray-500 hover:border-orange-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-orange-300'}`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-300 transform border group ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'} bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 border-orange-600 hover:border-orange-700`}
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? 'Loading...' : 'Get FREE Quotes'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </span>
        </button>
      </form>
      
      <div className="mt-4 min-h-[1.5rem] relative z-10">
        {error ? (
          <p className="text-sm text-red-600 font-medium flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Secured with SHA-256 Encryption</span>
          </div>
        )}
      </div>
      
      {/* Trust indicators */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 relative z-10">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Trusted</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Free</span>
        </div>
      </div>
    </div>
  );
}