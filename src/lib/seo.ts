// SEO utilities for ChartForge

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

// Update meta tags dynamically
export const updateMetaTags = (config: SEOConfig) => {
  // Update title
  document.title = config.title;

  // Helper to set or create meta tag
  const setMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  };

  // Standard meta tags
  setMetaTag('description', config.description);
  if (config.keywords) {
    setMetaTag('keywords', config.keywords.join(', '));
  }
  if (config.author) {
    setMetaTag('author', config.author);
  }

  // Open Graph tags
  setMetaTag('og:title', config.title, true);
  setMetaTag('og:description', config.description, true);
  setMetaTag('og:type', config.type || 'website', true);
  if (config.url) {
    setMetaTag('og:url', config.url, true);
  }
  if (config.image) {
    setMetaTag('og:image', config.image, true);
  }

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', config.title);
  setMetaTag('twitter:description', config.description);
  if (config.image) {
    setMetaTag('twitter:image', config.image);
  }
};

// Predefined SEO configs for different pages
export const SEO_CONFIGS = {
  landing: {
    title: 'ChartForge - Professional Data Visualization Made Simple',
    description: 'Create stunning charts and graphs with ChartForge. 15+ chart types, real-time editing, and export to multiple formats. Free to start.',
    keywords: ['data visualization', 'chart maker', 'graph creator', 'data charts', 'online charts', 'free chart tool'],
    image: '/og-image.png',
    type: 'website',
    author: 'ChartForge Team',
  },
  app: {
    title: 'ChartForge App - Create Your Chart',
    description: 'Use ChartForge powerful editor to create beautiful data visualizations. Import your data, customize, and export in seconds.',
    keywords: ['chart editor', 'data visualization tool', 'create charts online'],
    type: 'webapp',
  },
  privacy: {
    title: 'Privacy Policy - ChartForge',
    description: 'Learn how ChartForge protects your data and privacy. We are committed to transparency and GDPR compliance.',
    keywords: ['privacy policy', 'data protection', 'GDPR'],
  },
  terms: {
    title: 'Terms of Service - ChartForge',
    description: 'Read the terms and conditions for using ChartForge data visualization platform.',
    keywords: ['terms of service', 'terms and conditions', 'user agreement'],
  },
};

// Generate JSON-LD structured data for SEO
export const generateStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ChartForge',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Windows, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    description: 'Professional data visualization tool with 15+ chart types, real-time editing, and export capabilities.',
    screenshot: 'https://chartforge.com/screenshot.png',
    author: {
      '@type': 'Organization',
      name: 'ChartForge Team',
    },
  };

  // Add to head
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
};

// Generate sitemap.xml content (for build process)
export const generateSitemap = (baseUrl: string) => {
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/app', priority: '0.9', changefreq: 'daily' },
    { url: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { url: '/terms', priority: '0.3', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = (baseUrl: string) => {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
};
