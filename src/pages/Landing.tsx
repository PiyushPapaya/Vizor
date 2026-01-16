import Navbar from '@/components/landing/Navbar';
import StickyCTA from '@/components/landing/StickyCTA';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import VideoShowcase from '@/components/landing/VideoShowcase';
import UseCases from '@/components/landing/UseCases';
import Comparison from '@/components/landing/Comparison';
import Gallery from '@/components/landing/Gallery';
import Testimonials from '@/components/landing/Testimonials';
import BlogPreview from '@/components/landing/BlogPreview';
import FAQ from '@/components/landing/FAQ';
import PlatformDownloads from '@/components/landing/PlatformDownloads';
import LiveDemo from '@/components/landing/LiveDemo';
import Footer from '@/components/landing/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
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
      <Navbar />
      <StickyCTA />
      <ThemeToggle />
      <Hero />
      <div id="demo">
        <LiveDemo />
      </div>
      <div id="use-cases">
        <UseCases />
      </div>
      <Features />
      <div id="comparison">
        <Comparison />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <div id="downloads">
        <PlatformDownloads />
      </div>
      <Testimonials />
      <BlogPreview />
      <div id="faq">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
