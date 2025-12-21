import { Card, CardContent } from '@/components/ui/card';
import { Check, X, AlertCircle } from 'lucide-react';

const comparisons = [
  { feature: 'Works in browser', vizor: true, excel: false, tableau: false },
  { feature: 'No account needed', vizor: true, excel: false, tableau: false },
  { feature: 'Free to use', vizor: true, excel: false, tableau: false },
  { feature: 'Makes charts fast', vizor: true, excel: 'partial', tableau: false },
  { feature: 'Export PNG and PDF', vizor: true, excel: 'partial', tableau: true },
];

export default function Comparison() {
  const renderIcon = (value: boolean | string) => {
    if (value === true) return <Check className="w-5 h-5 text-green-600 dark:text-green-500" />;
    if (value === false) return <X className="w-5 h-5 text-red-500 dark:text-red-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />;
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            Why Vizor instead of Excel or Tableau?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Get charts faster, easier, and without the hassle
          </p>
        </div>

        <Card className="overflow-hidden border-2 border-slate-200 dark:border-border shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-muted/50">
                    <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base text-foreground">Feature</th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-sm sm:text-base text-foreground bg-primary/15 dark:bg-primary/10">Vizor</th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-sm sm:text-base text-foreground">Excel</th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-sm sm:text-base text-foreground">Tableau</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <tr 
                      key={index} 
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">{row.feature}</td>
                      <td className="p-3 sm:p-4 text-center bg-primary/5">
                        <div className="flex justify-center">
                          {renderIcon(row.vizor)}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          {renderIcon(row.excel)}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          {renderIcon(row.tableau)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> Yes</span>
          <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" /> Partial</span>
          <span className="flex items-center gap-1"><X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" /> No</span>
        </p>
        
        <p className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-muted-foreground/70 max-w-2xl mx-auto px-4">
          Partial = possible, but requires manual setup or paid add-ons. Excel can make charts but requires formatting. Tableau needs desktop install for full features.
        </p>
      </div>
    </section>
  );
}
