import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Data Analyst at TechCorp',
    content: 'Vizor transformed how we present data to stakeholders. The intuitive interface saves me hours every week, and the visualizations are stunning!',
    rating: 5,
    initials: 'SC',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Product Manager',
    content: 'As a non-technical PM, I love how easy it is to create professional charts. No more waiting for the design team — I can do it myself in minutes!',
    rating: 5,
    initials: 'MR',
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Marketing Director',
    content: 'The live data connectors are a game-changer. Our dashboards update automatically, and the export options make it perfect for presentations.',
    rating: 5,
    initials: 'EW',
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Research Scientist',
    content: 'I\'ve tried countless visualization tools, but Vizor strikes the perfect balance between power and simplicity. Highly recommend!',
    rating: 5,
    initials: 'DP',
  },
  {
    id: 5,
    name: 'Aisha Mohammed',
    role: 'Business Intelligence Lead',
    content: 'The template gallery is amazing! It gave me a head start on complex visualizations, and the customization options are endless.',
    rating: 5,
    initials: 'AM',
  },
  {
    id: 6,
    name: 'James Thompson',
    role: 'Startup Founder',
    content: 'Vizor helps us look professional without breaking the bank. Perfect for startups that need high-quality data viz on a budget!',
    rating: 5,
    initials: 'JT',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Data Enthusiasts Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who trust Vizor for their data visualization needs
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
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
