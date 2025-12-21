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
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Vizor instead of Excel or Tableau?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get charts faster, easier, and without the hassle
          </p>
        </div>

        <Card className="overflow-hidden border-2">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold bg-primary/10">Vizor</th>
                    <th className="text-center p-4 font-semibold">Excel</th>
                    <th className="text-center p-4 font-semibold">Tableau</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <tr 
                      key={index} 
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center bg-primary/5">
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

        <p className="text-center mt-8 text-sm text-muted-foreground">
          <Check className="w-4 h-4 inline text-green-600" /> Yes{' '}
          <AlertCircle className="w-4 h-4 inline text-yellow-600 ml-3" /> Partial{' '}
          <X className="w-4 h-4 inline text-red-500 ml-3" /> No
        </p>
        
        <p className="text-center mt-4 text-xs text-muted-foreground/70 max-w-2xl mx-auto">
          Partial means possible with manual work or add-ons. Excel can make charts but requires formatting. Tableau needs desktop install for full features.
        </p>
      </div>
    </section>
  );
}
