import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Data Analyst',
    company: 'TechCorp',
    content: 'Finally, a tool that just works. No setup, no account, and my data stays private.',
    rating: 5,
    avatar: 'SC',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Marketing Director',
    company: 'GrowthLabs',
    content: 'I can create presentation-ready charts in seconds. Game changer for our team.',
    rating: 5,
    avatar: 'MR',
  },
  {
    name: 'Emma Thompson',
    role: 'Freelance Designer',
    content: 'Beautiful charts without the complexity. Perfect for client presentations.',
    rating: 5,
    avatar: 'ET',
  },
];

export default function TestimonialsPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-12 space-y-4"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        <span className="font-medium">4.8/5 from 1,250+ users</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/40 transition-all duration-300 h-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    "{testimonial.content}"
                  </p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
