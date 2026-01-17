import Navbar from '@/components/landing/Navbar';
import StickyCTA from '@/components/landing/StickyCTA';
import HeroNew from '@/components/landing/HeroNew';
import FeaturesNew from '@/components/landing/FeaturesNew';
import VideoShowcase from '@/components/landing/VideoShowcase';
import UseCasesNew from '@/components/landing/UseCasesNew';
import Comparison from '@/components/landing/Comparison';
import GalleryNew from '@/components/landing/GalleryNew';
import Testimonials from '@/components/landing/Testimonials';
import BlogPreview from '@/components/landing/BlogPreview';
import FAQ from '@/components/landing/FAQ';
import PlatformDownloads from '@/components/landing/PlatformDownloads';
import LiveDemoNew from '@/components/landing/LiveDemoNew';
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
      <Navbar />
      <StickyCTA />
      <HeroNew />
      <div id="demo">
        <LiveDemoNew />
      </div>
      <div id="use-cases">
        <UseCasesNew />
      </div>
      <FeaturesNew />
      <div id="comparison">
        <Comparison />
      </div>
      <div id="gallery">
        <GalleryNew />
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
