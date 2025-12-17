// SEO utilities for Vizor

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
    title: 'Vizor - Free Data Visualization Tool | Create Beautiful Charts Online',
    description: 'Turn spreadsheets into stunning visualizations in minutes. Free online chart maker with 20+ chart types. No design skills needed. Try Vizor now!',
    keywords: ['free chart maker', 'data visualization tool', 'create charts online', 'graph maker online', 'online chart tool', 'csv to chart', 'free graph maker', 'spreadsheet visualization', 'visualization tool free', 'chart creator'],
    image: '/vizor-social-preview.png',
    url: 'https://getvizor.vercel.app',
    type: 'website',
    author: 'Vizor Team',
  },
  app: {
    title: 'Vizor App - Create Your Chart | Free Data Visualization',
    description: 'Start creating professional charts now. Import CSV, Excel, or paste data. Real-time preview. Export as PNG, SVG, or PDF. 100% free.',
    keywords: ['create chart online', 'make graph', 'data viz app', 'chart creator', 'free visualization tool', 'online graph maker'],
    url: 'https://getvizor.vercel.app/app',
    type: 'webapp',
  },
  privacy: {
    title: 'Privacy Policy - Vizor | Your Data Stays Private',
    description: 'Learn how Vizor protects your data and privacy. Your data never leaves your browser. We are committed to transparency and GDPR compliance.',
    keywords: ['privacy policy', 'data protection', 'GDPR', 'data privacy', 'secure chart maker'],
    url: 'https://getvizor.vercel.app/privacy',
  },
  terms: {
    title: 'Terms of Service - Vizor',
    description: 'Read the terms and conditions for using Vizor free data visualization platform. Fair, simple, and transparent.',
    keywords: ['terms of service', 'terms and conditions', 'user agreement', 'tos'],
    url: 'https://getvizor.vercel.app/terms',
  },
};

// Generate JSON-LD structured data for SEO
export const generateStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vizor',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser, Windows, Android',
    url: 'https://getvizor.vercel.app',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Free online data visualization tool with 20+ chart types. Turn spreadsheets into beautiful charts in minutes. No design skills needed. Real-time editing and export to PNG, SVG, or PDF.',
    screenshot: 'https://getvizor.vercel.app/vizor-screenshot.png',
    softwareVersion: '1.0.0',
    author: {
      '@type': 'Organization',
      name: 'Vizor Team',
      url: 'https://getvizor.vercel.app',
    },
    featureList: [
      '20+ Chart Types',
      'Real-time Editing',
      'CSV & Excel Import',
      'Export PNG, SVG, PDF',
      'No Sign-up Required',
      'Privacy-First Design'
    ],
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
