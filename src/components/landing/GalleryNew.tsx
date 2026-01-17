import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { useState } from 'react';

export default function GalleryNew() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = {
    sales: [
      { month: 'Jan', value: 4000 },
      { month: 'Feb', value: 3000 },
      { month: 'Mar', value: 5000 },
      { month: 'Apr', value: 4500 },
      { month: 'May', value: 6000 },
    ],
    revenue: [
      { quarter: 'Q1', revenue: 24000, profit: 8000 },
      { quarter: 'Q2', revenue: 32000, profit: 12000 },
      { quarter: 'Q3', revenue: 28000, profit: 9000 },
      { quarter: 'Q4', revenue: 45000, profit: 18000 },
    ],
    traffic: [
      { day: 'Mon', visits: 1200 },
      { day: 'Tue', visits: 1900 },
      { day: 'Wed', visits: 1500 },
      { day: 'Thu', visits: 2200 },
      { day: 'Fri', visits: 2800 },
      { day: 'Sat', visits: 2400 },
      { day: 'Sun', visits: 1800 },
    ],
    budget: [
      { name: 'Marketing', value: 35, color: 'hsl(175, 70%, 48%)' },
      { name: 'Operations', value: 25, color: 'hsl(160, 75%, 42%)' },
      { name: 'Development', value: 30, color: 'hsl(200, 75%, 45%)' },
      { name: 'Other', value: 10, color: 'hsl(280, 65%, 55%)' },
    ],
    performance: [
      { metric: 'Speed', value: 85 },
      { metric: 'Quality', value: 92 },
      { metric: 'Cost', value: 78 },
      { metric: 'Satisfaction', value: 88 },
      { metric: 'Innovation', value: 75 },
    ],
    growth: [
      { year: '2020', users: 1200, revenue: 4500 },
      { year: '2021', users: 2400, revenue: 8200 },
      { year: '2022', users: 4200, revenue: 15800 },
      { year: '2023', users: 7800, revenue: 28500 },
    ],
  };

  const gallery = [
    {
      title: 'Monthly Sales Trends',
      category: 'Line Chart',
      size: 'large' as const,
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData.sales}>
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line type="monotone" dataKey="value" stroke="hsl(175, 70%, 48%)" strokeWidth={2} dot={{ fill: 'hsl(175, 70%, 48%)', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Revenue & Profit',
      category: 'Bar Chart',
      size: 'medium' as const,
      chart: (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData.revenue}>
            <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(175, 70%, 48%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="hsl(160, 75%, 42%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Budget Breakdown',
      category: 'Pie Chart',
      size: 'small' as const,
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData.budget}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={(entry) => `${entry.value}%`}
            >
              {chartData.budget.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Weekly Traffic',
      category: 'Area Chart',
      size: 'medium' as const,
      chart: (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData.traffic}>
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area type="monotone" dataKey="visits" stroke="hsl(200, 75%, 45%)" fill="hsl(200, 75%, 45%)" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Performance Metrics',
      category: 'Radar Chart',
      size: 'small' as const,
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.performance}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={9} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Radar dataKey="value" stroke="hsl(160, 75%, 42%)" fill="hsl(160, 75%, 42%)" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Growth Over Time',
      category: 'Area Chart',
      size: 'large' as const,
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData.growth}>
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="users" stroke="hsl(175, 70%, 48%)" fill="hsl(175, 70%, 48%)" fillOpacity={0.3} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(280, 65%, 55%)" fill="hsl(280, 65%, 55%)" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
  ];

  const getSizeClass = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'md:col-span-1 md:row-span-1 h-[280px]';
      case 'medium':
        return 'md:col-span-1 md:row-span-2 h-[400px]';
      case 'large':
        return 'md:col-span-2 md:row-span-2 h-[400px]';
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2">
            Gallery
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live Chart Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real charts rendered in real-time. Click to open in the app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallery.map((item, index) => (
            <Card
              key={index}
              className={`
                group relative overflow-hidden bg-card/95 backdrop-blur-xl border-2 border-border/50 
                hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300 p-6
                ${getSizeClass(item.size)}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="mb-4">
                {item.chart}
              </div>

              {/* Hover toolbar */}
              <div
                className={`
                  absolute bottom-4 left-4 right-4 flex gap-2
                  transition-all duration-300
                  ${hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
              >
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 h-9 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  onClick={() => window.location.href = '/app?template=' + index}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in App
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
