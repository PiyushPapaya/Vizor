import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Is Vizor really free?",
    answer: "Yes! Vizor is 100% free to use. No credit card required, no hidden fees, no premium plans. We believe great data visualization tools should be accessible to everyone."
  },
  {
    question: "Do I need to sign up or create an account?",
    answer: "Nope! You can start creating charts immediately without signing up. Your data stays in your browser and never touches our servers. However, if you want to save projects for later, you can optionally create a free account."
  },
  {
    question: "What file formats can I import?",
    answer: "Vizor supports CSV, Excel (.xlsx, .xls), TSV, and JSON files. You can also paste data directly from spreadsheets or enter it manually in our built-in data editor."
  },
  {
    question: "Can I export my charts?",
    answer: "Absolutely! Export your visualizations as high-quality PNG images, scalable SVG files, or PDF documents. Perfect for presentations, reports, or social media."
  },
  {
    question: "What types of charts can I create?",
    answer: "Vizor offers 20+ chart types including bar charts, line graphs, pie charts, scatter plots, area charts, heatmaps, and more. We're constantly adding new visualization types!"
  },
  {
    question: "Is my data secure?",
    answer: "Your privacy is our priority. All data processing happens in your browser — your data never leaves your computer. We don't store, collect, or have access to your data whatsoever."
  },
  {
    question: "Can I use Vizor for commercial projects?",
    answer: "Yes! Use Vizor for personal projects, business presentations, academic research, or anything else. The charts you create are yours to use however you like."
  },
  {
    question: "Do I need design skills to make good charts?",
    answer: "Not at all! Vizor comes with beautiful templates and smart defaults that make your data look great automatically. Just focus on your data — we'll handle the design."
  },
  {
    question: "Can I customize the colors and styling?",
    answer: "Definitely! Every element is customizable — colors, fonts, labels, legends, axes, and more. Choose from pre-built color palettes or create your own custom styles."
  },
  {
    question: "Does Vizor work on mobile devices?",
    answer: "Yes! Vizor works on any device with a modern web browser. While we recommend using a desktop or laptop for the best experience, you can view and create charts on tablets and phones too."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-2">
            <HelpCircle className="w-4 h-4 mr-2 inline" />
            FAQ
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Questions? We've Got Answers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Vizor — from getting started to advanced features
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/50 rounded-lg px-6 backdrop-blur-xl bg-card/70 hover:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="font-semibold text-base md:text-lg pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="text-center mt-12 p-8 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/70">
          <p className="text-lg text-muted-foreground mb-4">
            Still have questions?
          </p>
          <p className="text-sm text-muted-foreground">
            Check out our{' '}
            <a href="/docs" className="text-primary hover:underline font-semibold">
              documentation
            </a>
            {' '}or reach out to us at{' '}
            <a href="mailto:help@vizor.app" className="text-primary hover:underline font-semibold">
              help@vizor.app
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
