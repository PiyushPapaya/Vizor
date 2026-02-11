import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function UseCasesNew() {
  const { t } = useTranslation();
  
  // Sample data for each chart
  const studentData = [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 78 },
    { subject: 'History', score: 88 },
  ];

  const workData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 92 },
  ];

  const startupData = [
    { month: 'Q1', users: 120, revenue: 45 },
    { month: 'Q2', users: 280, revenue: 78 },
    { month: 'Q3', users: 450, revenue: 125 },
    { month: 'Q4', users: 680, revenue: 198 },
  ];

  const creatorData = [
    { name: 'YouTube', value: 45, color: 'hsl(175, 70%, 48%)' },
    { name: 'Twitter', value: 25, color: 'hsl(160, 75%, 42%)' },
    { name: 'Instagram', value: 20, color: 'hsl(200, 75%, 45%)' },
    { name: 'TikTok', value: 10, color: 'hsl(280, 65%, 55%)' },
  ];

  const useCases = [
    {
      title: t('useCases.items.students.title'),
      description: t('useCases.items.students.description'),
      chartType: 'bar' as const,
      data: studentData,
      color: 'hsl(175, 70%, 48%)',
    },
    {
      title: t('useCases.items.work.title'),
      description: t('useCases.items.work.description'),
      chartType: 'line' as const,
      data: workData,
      color: 'hsl(160, 75%, 42%)',
    },
    {
      title: t('useCases.items.startups.title'),
      description: t('useCases.items.startups.description'),
      chartType: 'area' as const,
      data: startupData,
      color: 'hsl(200, 75%, 45%)',
    },
    {
      title: t('useCases.items.creators.title'),
      description: t('useCases.items.creators.description'),
      chartType: 'pie' as const,
      data: creatorData,
      color: '',
    },
  ];

  const renderChart = (useCase: typeof useCases[0]) => {
    const commonProps = {
      width: '100%',
      height: 180,
    };

    switch (useCase.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={useCase.data}>
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="score" fill={useCase.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={useCase.data}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={useCase.color} 
                strokeWidth={3}
                dot={{ fill: useCase.color, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={useCase.data}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke={useCase.color} 
                fill={useCase.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={useCase.data}
                cx="50%"
                cy="45%"
                outerRadius={55}
                dataKey="value"
              >
                {useCase.data.map((entry, index) => (
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
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden" id="use-cases">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-background to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t('useCases.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('useCases.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
          {useCases.map((useCase, index) => (
            <Card 
              key={index}
              className="group bg-card/95 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-depth-lg transition-all duration-300 overflow-hidden p-5 sm:p-6 md:p-8"
            >
              <div className="mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>

              <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50 group-hover:border-primary/30 transition-all duration-300">
                {renderChart(useCase)}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
