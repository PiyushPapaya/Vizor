import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Will Vizor stay free?",
    answer: "Yes. Vizor is free forever. We may add optional premium features later, but core functionality stays free."
  },
  {
    question: "Is my data secure?",
    answer: "Your data never leaves your device. Everything happens in your browser. We don't store or see any of your information."
  },
  {
    question: "What file formats work?",
    answer: "CSV, Excel (.xlsx, .xls), and JSON. Drag and drop your file or paste data directly."
  },
  {
    question: "What chart types can I make?",
    answer: "14 types including line, bar, pie, area, scatter, bubble, radar, donut, funnel, and treemap."
  },
  {
    question: "Can I export my charts?",
    answer: "Yes. Download as PNG or PDF. Both work great for presentations and reports."
  },
  {
    question: "Can I use this for school or work?",
    answer: "Yes. Use Vizor for business presentations, client reports, research papers, school projects, or anything else. Everything you create is yours."
  },
  {
    question: "Can I customize charts?",
    answer: "Yes. Change colors, fonts, labels, legends, axes, and gridlines. Pick from preset palettes or create your own theme."
  },
  {
    question: "Can I embed charts on my website?",
    answer: "Yes. Export as PNG or PDF and use them anywhere. You can also save projects and share links."
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
            Questions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Common questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick answers to help you get started
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
