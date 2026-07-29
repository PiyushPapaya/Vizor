import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Legend,
} from 'recharts';
import { generateId } from '@/lib/data-parser';

type DemoChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut';

interface Row {
  label: string;
  value: number;
}

const INITIAL_ROWS: Row[] = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 3800 },
  { label: 'Mar', value: 5100 },
  { label: 'Apr', value: 6300 },
  { label: 'May', value: 5900 },
  { label: 'Jun', value: 7400 },
];

const PALETTE = [
  'hsl(174, 72%, 50%)',
  'hsl(160, 75%, 45%)',
  'hsl(200, 80%, 52%)',
  'hsl(265, 70%, 62%)',
  'hsl(330, 75%, 60%)',
  'hsl(35, 92%, 58%)',
];

const CHART_TYPES: { id: DemoChartType; label: string }[] = [
  { id: 'bar', label: 'Bar' },
  { id: 'line', label: 'Line' },
  { id: 'area', label: 'Area' },
  { id: 'pie', label: 'Pie' },
  { id: 'donut', label: 'Donut' },
];

export default function InteractiveDemo() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [type, setType] = useState<DemoChartType>('bar');
  const [color, setColor] = useState(PALETTE[0]);

  const appBase = import.meta.env.BASE_URL || '/';
  const appPath = appBase.endsWith('/') ? `${appBase}app` : `${appBase}/app`;

  const chartData = useMemo(
    () => rows.map((r) => ({ name: r.label, value: Number.isFinite(r.value) ? r.value : 0 })),
    [rows]
  );

  const updateRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    if (rows.length >= 10) return;
    setRows((prev) => [...prev, { label: `Item ${prev.length + 1}`, value: 1000 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 2) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const openInApp = () => {
    const payload = {
      data: {
        labels: rows.map((r) => r.label),
        datasets: [
          {
            id: generateId(),
            name: 'My data',
            values: rows.map((r) => (Number.isFinite(r.value) ? r.value : 0)),
            color,
            visible: true,
          },
        ],
      },
    };
    try {
      localStorage.setItem('vizor-landing-upload', JSON.stringify(payload));
    } catch {
      /* storage may be unavailable; app still opens with empty state */
    }
    window.location.href = `${appPath}?source=landing-upload`;
  };

  const renderChart = () => {
    const isPie = type === 'pie' || type === 'donut';
    if (isPie) {
      return (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            dataKey="value"
            nameKey="name"
            innerRadius={type === 'donut' ? '55%' : 0}
            outerRadius="80%"
            paddingAngle={2}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '10px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconSize={9} />
        </PieChart>
      );
    }

    const axes = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.35} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
        <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '11px' }} />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted) / 0.25)' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '10px',
            fontSize: '12px',
          }}
        />
      </>
    );

    if (type === 'line') {
      return (
        <LineChart data={chartData}>
          {axes}
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      );
    }
    if (type === 'area') {
      return (
        <AreaChart data={chartData}>
          {axes}
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.25} />
        </AreaChart>
      );
    }
    return (
      <BarChart data={chartData}>
        {axes}
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={color} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Try it right here
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Edit the data. Watch it update.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A real chart, rendered live in your browser. Change values, switch types, then continue in the full app — no signup.
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Editor */}
            <div className="lg:col-span-2 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your data</span>
                <Button variant="ghost" size="sm" onClick={addRow} disabled={rows.length >= 10} className="h-8 px-2 text-xs gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add row
                </Button>
              </div>

              <div className="space-y-2">
                {rows.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={row.label}
                      onChange={(e) => updateRow(i, { label: e.target.value })}
                      className="h-9 text-sm flex-1 min-w-0"
                      aria-label={`Label for row ${i + 1}`}
                    />
                    <Input
                      type="number"
                      value={row.value}
                      onChange={(e) => updateRow(i, { value: e.target.value === '' ? 0 : Number(e.target.value) })}
                      className="h-9 text-sm w-24 text-right font-mono"
                      aria-label={`Value for row ${i + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(i)}
                      disabled={rows.length <= 2}
                      className="h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Delete row ${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Color</span>
                <div className="flex gap-2 mt-2">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-lg transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-offset-card ring-primary scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Use color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-3 p-5 sm:p-6">
              <div className="flex items-center justify-center gap-1.5 flex-wrap mb-4">
                {CHART_TYPES.map((ct) => (
                  <Button
                    key={ct.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setType(ct.id)}
                    className={`text-xs rounded-lg h-8 px-3 transition-all ${
                      type === ct.id
                        ? 'bg-gradient-to-r from-primary/20 to-accent/10 text-foreground font-semibold border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                    }`}
                  >
                    {ct.label}
                  </Button>
                ))}
              </div>

              <div className="h-[260px] sm:h-[300px] bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl border border-border/40 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={openInApp}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-12 px-7 rounded-xl"
                >
                  Open this in the full app
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  14 chart types · live editing · one-click export — all free.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
