import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  BarChart2, Wand2, Database, Palette, Edit3, Sparkles,
  TrendingUp, Download, Filter, Layers, Share2, Zap
} from 'lucide-react';

const features = [
  {
    icon: BarChart2,
    title: '15+ Chart Types',
    description: 'Bar, Line, Pie, Scatter, Area, Radar, Heatmap, and more. Everything you need for data visualization.',
    color: 'text-chart-1'
  },
  {
    icon: Wand2,
    title: 'Real-Time Editing',
    description: 'See your changes instantly with live preview. No more waiting for renders.',
    color: 'text-accent'
  },
  {
    icon: Database,
    title: 'Import & Export',
    description: 'Support for CSV, JSON, Excel, and more. Seamlessly integrate with your workflow.',
    color: 'text-chart-3'
  },
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description: 'Light and dark modes with customizable color schemes. Make charts that match your brand.',
    color: 'text-chart-4'
  },
  {
    icon: Edit3,
    title: 'Annotations & Labels',
    description: 'Add custom labels, tooltips, and annotations to highlight key insights.',
    color: 'text-chart-5'
  },
  {
    icon: Sparkles,
    title: 'One-Click Export',
    description: 'Export to PNG, SVG, PDF, or get shareable links. Download publication-ready charts.',
    color: 'text-chart-6'
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description: 'Built-in statistics and trend analysis to uncover insights in your data.',
    color: 'text-primary'
  },
  {
    icon: Filter,
    title: 'Interactive Filters',
    description: 'Dynamic filtering and data transformation. Explore your data interactively.',
    color: 'text-accent'
  },
  {
    icon: Layers,
    title: 'Multiple Datasets',
    description: 'Combine multiple data sources in a single chart. Create complex visualizations easily.',
    color: 'text-chart-3'
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your charts with a single link. Collaborate with your team effortlessly.',
    color: 'text-chart-4'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance handles large datasets smoothly. No lag, no waiting.',
    color: 'text-chart-1'
  },
  {
    icon: Download,
    title: 'Offline Support',
    description: 'Download desktop and mobile apps. Work anywhere, even without internet.',
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
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional data visualizations
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
