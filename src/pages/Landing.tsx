import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Gallery from '@/components/landing/Gallery';
import VideoShowcase from '@/components/landing/VideoShowcase';
import Testimonials from '@/components/landing/Testimonials';
import BlogPreview from '@/components/landing/BlogPreview';
import FAQ from '@/components/landing/FAQ';
import PlatformDownloads from '@/components/landing/PlatformDownloads';
import LiveDemo from '@/components/landing/LiveDemo';
import Footer from '@/components/landing/Footer';
import { useEffect } from 'react';
import { updateMetaTags, SEO_CONFIGS, generateStructuredData } from '@/lib/seo';

export default function Landing() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Update SEO meta tags
    updateMetaTags(SEO_CONFIGS.landing);
    
    // Add structured data for SEO
    generateStructuredData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <Gallery />
      <VideoShowcase />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <PlatformDownloads />
      <LiveDemo />
      <Footer />
    </div>
  );
}
