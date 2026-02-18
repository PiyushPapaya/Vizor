import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { Users, BarChart2, Zap, Globe } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: '+',
      label: 'Active Users',
      description: 'Creating charts daily'
    },
    {
      icon: BarChart2,
      value: 2000000,
      suffix: '+',
      label: 'Charts Created',
      description: 'Visualizations made'
    },
    {
      icon: Zap,
      value: 99,
      suffix: '%',
      label: 'Satisfaction Rate',
      description: 'Users love Vizor'
    },
    {
      icon: Globe,
      value: 150,
      suffix: '+',
      label: 'Countries',
      description: 'Worldwide reach'
    }
  ];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-8 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/8 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1.5 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="text-sm font-bold text-foreground mb-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground/70">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
