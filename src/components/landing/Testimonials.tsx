import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Data Analyst',
    content: 'I show insights to stakeholders in minutes. No more fighting with Excel.',
    rating: 5,
    initials: 'SC',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Product Manager',
    content: 'I make charts without waiting for design help. Game changer.',
    rating: 5,
    initials: 'MR',
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Marketing Director',
    content: 'Export works perfectly. Dashboards stay current.',
    rating: 5,
    initials: 'EW',
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Research Scientist',
    content: 'Best balance of power and simplicity I found.',
    rating: 5,
    initials: 'DP',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              What people say about Vizor
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-12">
              Early users share how Vizor helps them work faster
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card border border-border/60 hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  
                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 fill-yellow-500 text-yellow-500" 
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarFallback className="bg-gradient-vizor text-white text-sm font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground">
            Ready to join them?{' '}
            <a 
              href="/app" 
              className="text-primary hover:underline font-semibold"
            >
              Start visualizing now →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
