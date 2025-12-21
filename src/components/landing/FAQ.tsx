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
    question: "Can I use this for school or work?",
    answer: "Yes. Use Vizor for business presentations, client reports, research papers, school projects, or anything else. Everything you create is yours."
  },
  {
    question: "Does Vizor work offline?",
    answer: "No. Vizor works in your browser and needs an internet connection. But your data stays on your computer—we never store it on our servers."
  },
  {
    question: "Can I embed charts on my website?",
    answer: "Yes. Export as PNG or PDF and use them anywhere. You can also save projects and share links."
  },
  {
    question: "Will you add more chart types?",
    answer: "Probably. We're always looking for ways to improve Vizor. If you have a specific chart type in mind, let us know."
  }
];

export default function FAQ() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />
            Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            Common questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Quick answers to help you get started
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-2 border-border/60 rounded-lg px-4 sm:px-5 md:px-6 bg-card hover:border-primary/50 hover:shadow-md transition-all touch-target"
            >
              <AccordionTrigger className="text-left hover:no-underline py-3 sm:py-4">
                <span className="font-semibold text-sm sm:text-base md:text-lg pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12 p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border/60 bg-card shadow-md">
          <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">
            Have more questions?
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
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
