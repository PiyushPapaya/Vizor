import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  BarChart2, Wand2, Database, Palette, Edit3, Sparkles,
  TrendingUp, Download, Filter, Layers, Share2, Zap
} from 'lucide-react';

const features = [
  {
    icon: BarChart2,
    title: '20+ Chart Types',
    description: 'From simple bar charts to complex heatmaps — we\'ve got the perfect visualization for your data.',
    color: 'text-chart-1'
  },
  {
    icon: Wand2,
    title: 'Real-Time Editing',
    description: 'See changes instantly as you type. No waiting, no loading — just smooth, live updates.',
    color: 'text-accent'
  },
  {
    icon: Database,
    title: 'Import Anything',
    description: 'Drag and drop CSV, Excel, or JSON files. Copy-paste from spreadsheets. We make it stupid simple.',
    color: 'text-chart-3'
  },
  {
    icon: Palette,
    title: 'Beautiful By Default',
    description: 'Your charts look professional right out of the box. Customize colors to match your brand if you want.',
    color: 'text-chart-4'
  },
  {
    icon: Edit3,
    title: 'Smart Annotations',
    description: 'Add labels, tooltips, and highlights to tell your story. Help your audience understand what matters.',
    color: 'text-chart-5'
  },
  {
    icon: Sparkles,
    title: 'One-Click Export',
    description: 'Download high-quality PNG, SVG, or PDF in seconds. Perfect for presentations and reports.',
    color: 'text-chart-6'
  },
  {
    icon: TrendingUp,
    title: 'Built-in Analytics',
    description: 'Spot trends and patterns automatically. No spreadsheet formulas needed.',
    color: 'text-primary'
  },
  {
    icon: Filter,
    title: 'Interactive Filters',
    description: 'Let viewers explore the data themselves. Add sliders, dropdowns, and dynamic filtering.',
    color: 'text-accent'
  },
  {
    icon: Layers,
    title: 'Multiple Datasets',
    description: 'Compare different data sources side-by-side. Create rich, multi-layered visualizations.',
    color: 'text-chart-3'
  },
  {
    icon: Share2,
    title: 'Share Instantly',
    description: 'Get a shareable link with one click. No sign-up required for viewers. That\'s it.',
    color: 'text-chart-4'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Handle thousands of data points without breaking a sweat. Seriously, try to slow it down.',
    color: 'text-chart-1'
  },
  {
    icon: Download,
    title: 'Works Everywhere',
    description: 'Use it in your browser, download the desktop app, or access on mobile. Your choice.',
    color: 'text-chart-5'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Everything You Need (And Nothing You Don't)
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that are actually easy to use — no PhD required
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="backdrop-blur-xl bg-card/70 border border-border/50 hover:scale-105 hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
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
