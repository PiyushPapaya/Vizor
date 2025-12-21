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
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-background to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Perfect for
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whatever you need charts for, Vizor works
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index}
                className="group bg-card border-2 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${useCase.color}`}></div>
                <CardHeader>
                  <div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${useCase.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold">{useCase.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
