import Navbar from '@/components/landing/Navbar';
import StickyCTA from '@/components/landing/StickyCTA';
import HeroNew from '@/components/landing/HeroNew';
import FeaturesNew from '@/components/landing/FeaturesNew';
import UseCasesNew from '@/components/landing/UseCasesNew';
import Comparison from '@/components/landing/Comparison';
import GalleryNew from '@/components/landing/GalleryNew';
import BlogPreview from '@/components/landing/BlogPreview';
import FAQ from '@/components/landing/FAQ';
import PlatformDownloads from '@/components/landing/PlatformDownloads';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
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
    <div className="dark min-h-screen bg-background landing-page">
      <Navbar />
      <StickyCTA />
      <HeroNew />
      <div id="demo" className="landing-anchor landing-section">
        <InteractiveDemo />
      </div>
      <div id="use-cases" className="landing-anchor landing-section">
        <UseCasesNew />
      </div>
      <div className="landing-section">
        <FeaturesNew />
      </div>
      <div id="comparison" className="landing-anchor landing-section">
        <Comparison />
      </div>
      <div id="gallery" className="landing-anchor landing-section">
        <GalleryNew />
      </div>
      <div id="downloads" className="landing-anchor landing-section">
        <PlatformDownloads />
      </div>
      <div className="landing-section">
        <BlogPreview />
      </div>
      <div id="faq" className="landing-anchor landing-section">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
