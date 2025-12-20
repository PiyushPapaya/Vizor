import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Is Vizor really free?",
    answer: "Yes. We don't charge anything. No credit card, no hidden fees, no premium plans. Everyone gets full access to all features."
  },
  {
    question: "Do I need an account?",
    answer: "No. Start creating charts right away. Your data stays in your browser. We never see it. You can create an account later to save projects across devices."
  },
  {
    question: "What file formats work?",
    answer: "CSV, Excel, TSV, and JSON. You can also paste data from any spreadsheet or type it in manually."
  },
  {
    question: "Can I export my charts?",
    answer: "Yes. Download as PNG, SVG, or PDF. Use them in presentations, reports, or anywhere else."
  },
  {
    question: "What chart types can I make?",
    answer: "Over 20 types including bar charts, line graphs, pie charts, scatter plots, area charts, and heatmaps. We add new types based on what users ask for."
  },
  {
    question: "Is my data secure?",
    answer: "Your data never leaves your device. Everything happens in your browser. We don't store or see any of your information."
  },
  {
    question: "Can I use this for work?",
    answer: "Yes. Use Vizor for business presentations, client reports, research papers, or anything else. Everything you create is yours."
  },
  {
    question: "Do I need design skills?",
    answer: "No. Every chart looks professional by default. You can customize colors and fonts if you want, but you don't have to."
  },
  {
    question: "Can I customize charts?",
    answer: "Yes. Change colors, fonts, labels, legends, axes, and gridlines. Pick from preset palettes or create your own theme."
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes. Vizor works on phones, tablets, and computers. The full editor works best on larger screens, but you can view and edit on any device."
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
            Questions? Answers.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/60 rounded-lg px-6 bg-card hover:border-primary/50 transition-colors"
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
        <div className="text-center mt-12 p-8 rounded-2xl border border-border/60 bg-card">
          <p className="text-lg text-muted-foreground mb-4">
            Have more questions?
          </p>
          <p className="text-sm text-muted-foreground">
            Read our{' '}
            <a href="/docs" className="text-primary hover:underline font-semibold">
              docs
            </a>
            {' '}or email{' '}
            <a href="mailto:help@vizor.app" className="text-primary hover:underline font-semibold">
              help@vizor.app
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
