import { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartData, ChartConfig, ChartType } from '@/types/chart';

interface ChartRendererProps {
  data: ChartData;
  config: ChartConfig;
}

export interface ChartRendererRef {
  exportToPNG: () => Promise<string | null>;
}

const ChartRenderer = forwardRef<ChartRendererRef, ChartRendererProps>(
  ({ data, config }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      exportToPNG: async () => {
        if (!containerRef.current) return null;
        
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return null;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        return new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx?.scale(2, 2);
            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = url;
        });
      },
    }));

    const chartData = data.labels.map((label, index) => {
      const point: Record<string, string | number> = { name: label };
      data.datasets.forEach((dataset) => {
        if (dataset.visible) {
          point[dataset.name] = dataset.values[index] ?? 0;
        }
      });
      return point;
    });

    const visibleDatasets = data.datasets.filter(ds => ds.visible);

    const renderChart = () => {
      const commonProps = {
        data: chartData,
        margin: { top: 20, right: 30, left: 20, bottom: 20 },
      };

      switch (config.type) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey="name" 
                label={{ value: config.xAxisLabel, position: 'bottom', offset: 0 }}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              {config.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Line
                  key={dataset.id}
                  type="monotone"
                  dataKey={dataset.name}
                  stroke={dataset.color}
                  strokeWidth={2}
                  dot={{ fill: dataset.color, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              {config.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Bar
                  key={dataset.id}
                  dataKey={dataset.name}
                  fill={dataset.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              {config.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Area
                  key={dataset.id}
                  type="monotone"
                  dataKey={dataset.name}
                  stroke={dataset.color}
                  fill={dataset.color}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          );

        case 'scatter':
          return (
            <ScatterChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                stroke="hsl(var(--border))"
              />
              {config.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Scatter
                  key={dataset.id}
                  name={dataset.name}
                  data={dataset.values.map((v, i) => ({ x: i, y: v, name: data.labels[i] }))}
                  fill={dataset.color}
                />
              ))}
            </ScatterChart>
          );

        case 'pie':
          const pieData = visibleDatasets.length > 0
            ? data.labels.map((label, i) => ({
                name: label,
                value: visibleDatasets[0].values[i] ?? 0,
              }))
            : [];
          return (
            <PieChart>
              {config.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />}
              {config.showLegend && <Legend />}
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={visibleDatasets[index % visibleDatasets.length]?.color || `hsl(${index * 60}, 70%, 50%)`}
                  />
                ))}
              </Pie>
            </PieChart>
          );

        default:
          return null;
      }
    };

    return (
      <div ref={containerRef} className="w-full h-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() as any}
        </ResponsiveContainer>
      </div>
    );
  }
);

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;
