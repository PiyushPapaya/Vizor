import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'getting-started-with-data-visualization',
    title: 'Getting Started with Data Visualization',
    excerpt: 'The basics of data viz and how to make your first chart in a few minutes.',
    author: 'Sarah Chen',
    publishedDate: '2025-01-15',
    readTime: '5 min read',
    tags: ['tutorial', 'beginners'],
  },
  {
    id: 2,
    slug: 'choosing-right-chart-type',
    title: 'How to Pick the Right Chart',
    excerpt: 'Bar chart or line graph? Here\'s how to choose what works best for your data.',
    author: 'Marcus Rodriguez',
    publishedDate: '2025-01-22',
    readTime: '7 min read',
    tags: ['guide', 'best-practices'],
  },
  {
    id: 3,
    slug: 'csv-to-chart-in-30-seconds',
    title: 'From CSV to Chart in 30 Seconds',
    excerpt: 'Watch how raw data becomes a shareable chart in less than a minute.',
    author: 'James Thompson',
    publishedDate: '2025-03-12',
    readTime: '3 min read',
    tags: ['tutorial', 'quickstart'],
  },
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Derive an effective slug: prefer the router param, fall back to the URL path
  const effectiveSlug = slug || window.location.pathname.split('/').filter(Boolean).pop();
  const post = blogPosts.find((p) => p.slug === effectiveSlug);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (!effectiveSlug) {
      if (mounted) {
        setError(true);
        setLoading(false);
      }
      return () => { mounted = false; };
    }

    // safety timeout so the page doesn't spin forever
    timer = setTimeout(() => {
      if (mounted) {
        setError(true);
        setLoading(false);
      }
    }, 10000);

    fetch(`/blog/${effectiveSlug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.text();
      })
      .then((text) => {
        if (!mounted) return;
        setContent(text);
        setLoading(false);
        if (timer) clearTimeout(timer);
      })
      .catch(() => {
        if (!mounted) return;
        setError(true);
        setLoading(false);
        if (timer) clearTimeout(timer);
      });

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [effectiveSlug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Failed to Load Article</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-4xl font-bold mt-12 mb-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4">{children}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-lg">{children}</p>,
              strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} className="text-primary hover:underline font-medium">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-6">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-12 border-border" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Create Your Own Charts?</h3>
          <p className="text-muted-foreground mb-6">
            Start visualizing your data in seconds with Vizor
          </p>
          <Link to="/app">
            <Button size="lg">
              Try Vizor Free
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
