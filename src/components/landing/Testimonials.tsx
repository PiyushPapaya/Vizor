import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.items.sarah.name'),
      role: t('testimonials.items.sarah.role'),
      content: t('testimonials.items.sarah.content'),
      rating: 5,
      initials: 'SC',
    },
    {
      id: 2,
      name: t('testimonials.items.marcus.name'),
      role: t('testimonials.items.marcus.role'),
      content: t('testimonials.items.marcus.content'),
      rating: 5,
      initials: 'MR',
    },
    {
      id: 3,
      name: t('testimonials.items.emily.name'),
      role: t('testimonials.items.emily.role'),
      content: t('testimonials.items.emily.content'),
      rating: 5,
      initials: 'EW',
    },
    {
      id: 4,
      name: t('testimonials.items.david.name'),
      role: t('testimonials.items.david.role'),
      content: t('testimonials.items.david.content'),
      rating: 5,
      initials: 'DP',
    },
  ];
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm font-medium text-primary/60 mb-3">{t('testimonials.badge')}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              {t('testimonials.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-card/80 border border-slate-200 dark:border-border/60 hover:shadow-xl transition-shadow duration-300 group">
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
