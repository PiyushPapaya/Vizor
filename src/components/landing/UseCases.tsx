import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GraduationCap, FileText, Rocket, Users } from 'lucide-react';

const useCases = [
  {
    icon: GraduationCap,
    title: 'Students & teachers',
    description: 'Make charts for school projects and research papers. No signup needed.',
    color: 'from-blue-500/20 to-blue-600/20',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: FileText,
    title: 'Work presentations',
    description: 'Turn spreadsheets into clean visuals for meetings and reports.',
    color: 'from-purple-500/20 to-purple-600/20',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    icon: Rocket,
    title: 'Startups',
    description: 'Show growth and metrics to investors. Looks professional. Costs nothing.',
    color: 'from-orange-500/20 to-orange-600/20',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    icon: Users,
    title: 'Content creators',
    description: 'Add charts to articles and posts. Download and use anywhere.',
    color: 'from-green-500/20 to-green-600/20',
    textColor: 'text-green-600 dark:text-green-400'
  }
];

export default function UseCases() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-background to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            Perfect for
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Whatever you need charts for, Vizor works
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index}
                className="group bg-card border-2 border-border/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden touch-target"
              >
                <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${useCase.color}`}></div>
                <CardHeader className="p-5 sm:p-6">
                  <div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${useCase.textColor}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{useCase.title}</h3>
                </CardHeader>
                <CardContent className="p-5 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {useCase.description}
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
