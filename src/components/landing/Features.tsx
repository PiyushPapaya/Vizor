import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  BarChart2, Wand2, Database, Palette, Edit3, Sparkles,
  TrendingUp, Download, Filter, Layers, Share2, Zap
} from 'lucide-react';

const features = [
  {
    icon: BarChart2,
    title: '20+ Chart Types',
    description: 'Pick from bar charts to heatmaps. Each type is built for clarity and easy reading.',
    color: 'text-chart-1'
  },
  {
    icon: Wand2,
    title: 'Live Preview',
    description: 'See changes instantly as you edit. No refresh needed.',
    color: 'text-accent'
  },
  {
    icon: Database,
    title: 'Import Any Data',
    description: 'Works with CSV, Excel, and JSON files. Drag and drop or paste from your spreadsheet.',
    color: 'text-chart-3'
  },
  {
    icon: Palette,
    title: 'Looks Good By Default',
    description: 'Every chart starts professional. Customize colors, fonts, and themes to match your brand.',
    color: 'text-chart-4'
  },
  {
    icon: Edit3,
    title: 'Smart Annotations',
    description: 'Add labels and highlights to show key insights. Guide readers through your data story.',
    color: 'text-chart-5'
  },
  {
    icon: Sparkles,
    title: 'Export Anywhere',
    description: 'Download as PNG, SVG, or PDF. Works in presentations, reports, and websites.',
    color: 'text-chart-6'
  },
  {
    icon: TrendingUp,
    title: 'Built-in Analytics',
    description: 'We spot trends, outliers, and patterns for you. No complex formulas required.',
    color: 'text-primary'
  },
  {
    icon: Filter,
    title: 'Interactive Filters',
    description: 'Let viewers explore data with sliders and controls. Make every chart interactive.',
    color: 'text-accent'
  },
  {
    icon: Layers,
    title: 'Multiple Datasets',
    description: 'Combine data sources in one chart. Layer datasets to show the full picture.',
    color: 'text-chart-3'
  },
  {
    icon: Share2,
    title: 'Share with Anyone',
    description: 'Create shareable links instantly. Viewers can interact without signing up.',
    color: 'text-chart-4'
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Handle thousands of data points without slowdown. Works smoothly with large datasets.',
    color: 'text-chart-1'
  },
  {
    icon: Download,
    title: 'Works Everywhere',
    description: 'Use Vizor on web, desktop, or mobile. Your work syncs across all devices.',
    color: 'text-chart-5'
  }
];

export default function Features() {
  return (
    <section 
      id="features" 
      className="py-24 px-4 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Enhanced background with gradients for light mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background dark:via-primary/5" aria-hidden="true" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 dark:bg-accent/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 
            id="features-heading"
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_auto]"
          >
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning charts without the complexity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                role="listitem"
                className="group relative bg-card/80 dark:bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 hover:shadow-[var(--shadow-xl)] hover:shadow-primary/20 dark:hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                
                <CardHeader className="relative">
                  <div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg ${feature.color}`}
                    aria-hidden="true"
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
