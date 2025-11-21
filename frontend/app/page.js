import React from "react";
import { headers } from "next/headers";
import OptimizedHero from "./components/OptimizedHero.jsx";
// FeaturedIn removed per request
import SectionRenderer from "./components/SectionRenderer.jsx";
import ClientHomepage from "./ClientHomepage.jsx";

export const dynamic = "force-dynamic";

async function fetchHomepage() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${origin}/api/homepage`, { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const data = await fetchHomepage();
  const title = data?.meta?.title ?? "Home";
  const description = data?.meta?.description ?? "Welcome";
  const image = data?.meta?.image ?? undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function HomePage() {
  const data = await fetchHomepage();
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  const lowerType = (t) => String(t || '').toLowerCase();
  const baseContentSections = sections.filter((s) => 
    lowerType(s.type) !== 'featured' && 
    !['video','embed'].includes(lowerType(s.type)) &&
    String(s.title || '').toLowerCase() !== 'featured in' &&
    !String(s.title || '').toLowerCase().includes('insurance guide')
  );

  // Remove specific homepage sections per your request
  const UNWANTED_PHRASES = [
    'Featured In',
    'Why Choose Us',
    'insurance guides',
    'coverage basics',
    'rate factors',
    'savings tips',
    'Embedded Video',
    'Video Embed',
    'Featured Video',
    'Sample iframe via Editor Blocks',
    'Get up to speed quickly.',
    'transparent, accurate, and easy to compare.',
    'we make shopping for auto insurance simpler.'
  ].map((s) => s.toLowerCase());

  const removeUnwantedHomepageContent = (secs) => {
    return (Array.isArray(secs) ? secs : []).filter((s) => {
      const blob = [
        s.title,
        s.subtitle,
        s.body,
        s.col1_rich,
        s.col2_rich,
        s.col3_rich,
        s.col4_rich,
        s.col5_rich,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase())
        .join(' ');
      return !UNWANTED_PHRASES.some((ph) => blob.includes(ph));
    });
  };

  const contentSections = removeUnwantedHomepageContent(baseContentSections);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero at top */}
      <OptimizedHero />

      {/* Removed Featured In and videos below per request */}

      {/* CKEditor (DB-driven) content sections */}
      {contentSections.length ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionRenderer sections={contentSections} />
        </div>
      ) : null}

      {/* Articles at the bottom */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ClientHomepage />
      </div>
    </main>
  );
}