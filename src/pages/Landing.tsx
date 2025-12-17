import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Gallery from '@/components/landing/Gallery';
import VideoShowcase from '@/components/landing/VideoShowcase';
import PlatformDownloads from '@/components/landing/PlatformDownloads';
import LiveDemo from '@/components/landing/LiveDemo';
import Footer from '@/components/landing/Footer';
import { useEffect } from 'react';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

export default function Landing() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Update SEO meta tags
    updateMetaTags(SEO_CONFIGS.landing);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <Gallery />
      <VideoShowcase />
      <PlatformDownloads />
      <LiveDemo />
      <Footer />
    </div>
  );
}
