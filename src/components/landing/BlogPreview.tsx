import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    slug: 'getting-started-with-data-visualization',
    title: 'Getting Started with Data Visualization',
    excerpt: 'The basics of data viz and how to make your first chart in a few minutes.',
    author: 'Sarah Chen',
    publishedDate: '2024-01-15',
    readTime: '5 min read',
    tags: ['tutorial', 'beginners'],
  },
  {
    id: 2,
    slug: 'choosing-right-chart-type',
    title: 'How to Pick the Right Chart',
    excerpt: 'Bar chart or line graph? Here\'s how to choose what works best for your data.',
    author: 'Marcus Rodriguez',
    publishedDate: '2024-01-22',
    readTime: '7 min read',
    tags: ['guide', 'best-practices'],
  },
  {
    id: 3,
    slug: 'csv-to-chart-in-30-seconds',
    title: 'From CSV to Chart in 30 Seconds',
    excerpt: 'Watch how raw data becomes a shareable chart in less than a minute.',
    author: 'James Thompson',
    publishedDate: '2024-03-12',
    readTime: '3 min read',
    tags: ['tutorial', 'quickstart'],
  },
];

export default function BlogPreview() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-sm px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2 inline" />
              Learn & Grow
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Learn How It Works
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Guides to help you get the most out of Vizor
            </p>
          </motion.div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${post.slug}`}>
                <Card className="h-full bg-card border border-border/60 hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm font-medium">{post.author}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            More Guides Coming Soon
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            We're adding more tutorials and how-tos
          </p>
        </div>
      </div>
    </section>
  );
}
