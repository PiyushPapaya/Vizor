import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Sample user-generated charts showcase
const sampleCharts = [
  {
    title: 'Q4 2025 Revenue Growth',
    author: 'Sarah from TechCorp',
    type: 'bar',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    views: '2.3k',
  },
  {
    title: 'Market Share Analysis',
    author: 'Mike from Analytics Inc',
    type: 'pie',
    icon: PieChart,
    color: 'from-purple-500 to-pink-500',
    views: '1.8k',
  },
  {
    title: 'Website Traffic Trends',
    author: 'Emma from StartupCo',
    type: 'line',
    icon: LineChart,
    color: 'from-green-500 to-emerald-500',
    views: '3.1k',
  },
  {
    title: 'Sales Performance',
    author: 'John from SalesForce',
    type: 'area',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    views: '1.5k',
  },
];

export default function UserChartGallery() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Community Showcase
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Created by users like you
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals creating beautiful charts with Vizor every day
          </p>
        </div>

        {/* Chart cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCharts.map((chart, index) => {
            const Icon = chart.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 bg-card border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group cursor-pointer h-full overflow-hidden relative">
                  {/* Subtle hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content wrapper */}
                  <div className="relative z-10">
                    {/* Chart icon with gradient */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${chart.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Chart info */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {chart.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 group-hover:text-muted-foreground/80">
                      by {chart.author}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                      <span className="capitalize">{chart.type} chart</span>
                      <span>{chart.views} views</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Want to see your chart featured here?
          </p>
          <a
            href="#demo"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-primary font-semibold hover:underline"
          >
            Start creating now →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
