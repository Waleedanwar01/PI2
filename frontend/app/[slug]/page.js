import React from 'react';
import { headers } from 'next/headers';
import SectionRenderer from '../components/SectionRenderer.jsx';
import PageHero from '../components/PageHero.jsx';
import HelpfulLinks from '../components/HelpfulLinks.jsx';
// Footer links are handled globally; do not render inline HelpfulLinks inside pages

async function getApiBase() {
  const envBase = process.env.NEXT_PUBLIC_API_BASE;
  if (envBase) return envBase;
  try {
    const h = await headers();
    const host = h.get('host') || '127.0.0.1:3001';
    const hostname = host.split(':')[0];
    return `http://${hostname}:8000`;
  } catch {
    return 'http://127.0.0.1:8000';
  }
}

export async function generateMetadata({ params }) {
  const p = await params;
  const slugRaw = p?.slug;
  const slug = String(slugRaw || '');
  try {
    const API_BASE = await getApiBase();
    const res = await fetch(`${API_BASE}/api/page/${encodeURIComponent(slug)}/`, { cache: 'no-store' });
    const json = await res.json();
    return {
      title: json?.meta?.title || slug,
      description: json?.meta?.description || '',
      openGraph: json?.meta?.og_image ? { images: [json.meta.og_image] } : {},
    };
  } catch (e) {
    return { title: slug, description: '' };
  }
}

export default async function Page({ params }) {
  const p = await params;
  const slugRaw = p?.slug;
  const slug = String(slugRaw || '');
  const slugLc = String(slug || '').toLowerCase();
  const API_BASE = await getApiBase();
  let data = { sections: [] };
  try {
    const res = await fetch(`${API_BASE}/api/page/${encodeURIComponent(slug)}/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      // Fall back to empty sections if backend returns HTML (e.g., 404/debug page)
      const _raw = await res.text();
      console.warn(`Non-JSON response for slug "${String(slug)}":`, res.status, contentType);
      data = { sections: [] };
    }
  } catch (err) {
    console.error('Error fetching page data:', err);
    data = { sections: [] };
  }
  const sections = Array.isArray(data.sections) ? data.sections : [];
  const isAbout = slug === 'about-us' || slug === 'about' || slug === 'About';
  // Default hero subtitle fallback
  const defaultHeroSubtitle = 'We strive to be your most trusted partner in pursuing the right auto insurance.';

  // Derive meta-based hero defaults for non-About pages
  const meta = data?.meta || {};
  const metaTitle = (meta.title || slug).trim();
  const metaSubtitle = (meta.description || defaultHeroSubtitle).trim();
  const metaHeroImage = meta.hero_image || null;

  // Detect if this slug belongs to footer pages (company/legal) for hero injection
  let isFooterPage = false;
  let footerMenu = null;
  try {
    const mres = await fetch(`${API_BASE}/api/menu/footer/`, { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (mres.ok) {
      const menu = await mres.json();
      footerMenu = menu;
      const company = Array.isArray(menu.company) ? menu.company : [];
      const legal = Array.isArray(menu.legal) ? menu.legal : [];
      const all = [...company, ...legal].map((i) => String(i.page_slug || '').toLowerCase());
      isFooterPage = all.includes(slugLc);
    }
  } catch (e) {
    // Silent fail – treat as non-footer page
  }

  // Generic sanitizer to avoid duplicating hero text in content below
  const sanitizeSections = (secs, textsToStrip = []) => {
    const texts = (Array.isArray(textsToStrip) ? textsToStrip : []).filter((t) => !!String(t || '').trim());
    const stripAll = (val) => {
      let out = String(val || '');
      texts.forEach((t) => { out = out.split(t).join(''); });
      return out;
    };
    return (Array.isArray(secs) ? secs : []).map((s) => {
      const next = { ...s };
      next.title = stripAll(next.title);
      next.subtitle = stripAll(next.subtitle);
      next.body = stripAll(next.body);
      next.col1_title = stripAll(next.col1_title);
      next.col1_subtitle = stripAll(next.col1_subtitle);
      next.col1_rich = stripAll(next.col1_rich);
      next.col2_title = stripAll(next.col2_title);
      next.col2_subtitle = stripAll(next.col2_subtitle);
      next.col2_rich = stripAll(next.col2_rich);
      next.col3_title = stripAll(next.col3_title);
      next.col3_subtitle = stripAll(next.col3_subtitle);
      next.col3_rich = stripAll(next.col3_rich);
      next.col4_title = stripAll(next.col4_title);
      next.col4_subtitle = stripAll(next.col4_subtitle);
      next.col4_rich = stripAll(next.col4_rich);
      next.col5_title = stripAll(next.col5_title);
      next.col5_subtitle = stripAll(next.col5_subtitle);
      next.col5_rich = stripAll(next.col5_rich);
      return next;
    });
  };

  const removeEmptySections = (secs) => {
    const containsHtmlMedia = (text) => String(text || '').toLowerCase().includes('<iframe') || String(text || '').toLowerCase().includes('<video') || String(text || '').toLowerCase().includes('<img');
    const parseBlocks = (raw) => {
      let blocks = raw || [];
      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) blocks = parsed;
        } catch (_) {}
      }
      return Array.isArray(blocks) ? blocks : [];
    };
    const hasEditorContent = (s) => {
      const blocks = parseBlocks(s.editor_blocks || s.blocks);
      return blocks.some((b) => {
        const t = String(b.type || b.block_type || '').toLowerCase();
        if (['embed', 'video', 'image'].includes(t)) return true;
        if (t.includes('rich') || t.includes('text') || t.includes('html')) {
          const html = String(b.html || b.body || b.content || '').replace(/<[^>]*>/g, '').trim();
          return html.length > 0;
        }
        return false;
      });
    };
    const hasDirectMediaProps = (s) => (s.type === 'image' && !!s.src) || (s.type === 'video' && !!s.video_url);
    const nonEmpty = (s) => {
      const textParts = [s.title, s.subtitle, s.body, s.col1_rich, s.col2_rich, s.col3_rich, s.col4_rich, s.col5_rich]
        .filter((x) => typeof x === 'string')
        .map((x) => x.replace(/<[^>]*>/g, '').trim());
      const hasText = textParts.some((x) => x.length > 0);
      const hasHtml = containsHtmlMedia(s.body) || containsHtmlMedia(s.col1_rich) || containsHtmlMedia(s.col2_rich) || containsHtmlMedia(s.col3_rich) || containsHtmlMedia(s.col4_rich) || containsHtmlMedia(s.col5_rich);
      return hasText || hasHtml || hasEditorContent(s) || hasDirectMediaProps(s);
    };
    return (Array.isArray(secs) ? secs : []).filter((s) => nonEmpty(s));
  };
  const sanitizeAboutSections = (secs, textToStrip = defaultHeroSubtitle) => {
    const strip = (val) => (typeof val === 'string' && val ? val.split(textToStrip).join('') : val);
    return (Array.isArray(secs) ? secs : []).map((s) => {
      const next = { ...s };
      next.title = strip(next.title);
      next.subtitle = strip(next.subtitle);
      next.body = strip(next.body);
      next.col1_title = strip(next.col1_title);
      next.col1_subtitle = strip(next.col1_subtitle);
      next.col1_rich = strip(next.col1_rich);
      next.col2_title = strip(next.col2_title);
      next.col2_subtitle = strip(next.col2_subtitle);
      next.col2_rich = strip(next.col2_rich);
      next.col3_title = strip(next.col3_title);
      next.col3_subtitle = strip(next.col3_subtitle);
      next.col3_rich = strip(next.col3_rich);
      next.col4_title = strip(next.col4_title);
      next.col4_subtitle = strip(next.col4_subtitle);
      next.col4_rich = strip(next.col4_rich);
      next.col5_title = strip(next.col5_title);
      next.col5_subtitle = strip(next.col5_subtitle);
      next.col5_rich = strip(next.col5_rich);
      return next;
    });
  };

  // Remove specific About content sections per your request
  const UNWANTED_PHRASES = [
    'Who We Are',
    'Our mission and values',
    'About Our Company',
    'We are committed to delivering reliable insurance information and tools that help you make informed decisions.',
    'Our team combines industry expertise with user-first design to create a trustworthy experience.',
    'What We Do',
    'Services and approach',
    'Our Services',
    'Policy comparisons',
    'Coverage guides',
    'Rate insights',
    'Our Approach',
    'We focus on transparency, accuracy, and usability.',
    'Content is vetted and layouts are optimized for all devices.'
  ].map((s) => s.toLowerCase());

  const removeUnwantedAboutContent = (secs) => {
    return (Array.isArray(secs) ? secs : []).filter((s) => {
      const blob = [
        s.title,
        s.subtitle,
        s.body,
        s.col1_rich,
        s.col2_rich,
        s.col3_rich,
        s.col4_rich,
        s.col5_rich
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase())
        .join(' ');
      return !UNWANTED_PHRASES.some((ph) => blob.includes(ph));
    });
  };
  if (isAbout) {
    const prelimHeroText = (sections[0]?.subtitle || sections[0]?.title || '').trim() || defaultHeroSubtitle;
    const aboutSections = removeEmptySections(removeUnwantedAboutContent(sanitizeAboutSections(sections, prelimHeroText)));
    const first = aboutSections[0] || {};
    const heroTitle = first.title || 'About Us';
    const heroSubtitle = first.subtitle || defaultHeroSubtitle;
    const companyLinks = Array.isArray(footerMenu?.company) ? footerMenu.company : [];
    const legalLinks = Array.isArray(footerMenu?.legal) ? footerMenu.legal : [];
    const helpfulLinks = [...companyLinks, ...legalLinks].filter((l) => String(l.page_slug || '').toLowerCase() !== slugLc);
    return (
      <>
        <PageHero title={heroTitle} subtitle={heroSubtitle} imageUrl="/globe.svg" variant="dark" />
        <SectionRenderer sections={aboutSections} roundImages imageSizePx={200} centerText />
        <HelpfulLinks links={helpfulLinks} title="Helpful Links" />
      </>
    );
  }

  // Company & Legal pages: show page hero (title + description) then content
  if (isFooterPage) {
    // Sanitize sections to avoid duplicating hero text below
    const sanitized = sanitizeSections(sections, [metaTitle, metaSubtitle]);
    const finalSections = removeEmptySections(sanitized);
    // Filter out specific unwanted sections from the Terms & Conditions page
    const isTermsPage = slugLc.includes('term');
    const filteredSections = finalSections.filter(section => {
      const title = String(section.title || '').toLowerCase();
      const body = String(section.body || '').toLowerCase();
      const isAssignmentSection = title.includes('16. assignment') || body.includes('*****');
      const isDupTermsHeader = isTermsPage && (title.includes('terms & conditions') || title.includes('terms and conditions'));
      return !isAssignmentSection && !isDupTermsHeader;
    });

    const companyLinks = Array.isArray(footerMenu?.company) ? footerMenu.company : [];
    const legalLinks = Array.isArray(footerMenu?.legal) ? footerMenu.legal : [];
    const helpfulLinks = [...companyLinks, ...legalLinks].filter((l) => String(l.page_slug || '').toLowerCase() !== slugLc);
    return (
      <>
        <PageHero title={metaTitle} subtitle={metaSubtitle} imageUrl={metaHeroImage} variant="dark" />
        <SectionRenderer sections={filteredSections} />
        <HelpfulLinks links={helpfulLinks} attachToFooter />
      </>
    );
  }

  // All other pages: render sections without injecting an extra hero or inline helpful links
  return (
    <>
      <SectionRenderer sections={sections} />
    </>
  );
}