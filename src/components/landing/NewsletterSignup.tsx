import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function NewsletterSignup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // TODO: Replace with actual newsletter signup API
    // For now, simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox for confirmation.');
      setEmail('');
      
      // Track signup event
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('newsletter_signup', { email });
      }
    }, 1000);

    /* Example implementation with real API:
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
    */
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 md:p-12 bg-card/95 backdrop-blur-xl border-2 border-border/40 shadow-depth-lg">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Stay updated with data viz tips
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get weekly tutorials, chart templates, and best practices delivered to your inbox. No spam, unsubscribe anytime.
            </p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                You're all set!
              </p>
              <p className="text-muted-foreground">{message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base"
                  disabled={status === 'loading'}
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white h-12 px-8 font-semibold whitespace-nowrap"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          )}

          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-500 text-sm mt-3"
            >
              {message}
            </motion.p>
          )}

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Join 5,000+ data professionals • Free weekly content
          </div>
        </Card>
      </div>
    </section>
  );
}
