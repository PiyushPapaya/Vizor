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
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { ChartData, ChartConfig, CHART_COLORS } from '@/types/chart';

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

    if (visibleDatasets.length === 0 || data.labels.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No data to display</p>
            <p className="text-sm">Import a CSV or JSON file to get started</p>
          </div>
        </div>
      );
    }

    const tooltipStyle = { 
      backgroundColor: 'hsl(var(--card))', 
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    };

    const axisStyle = {
      tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
      stroke: 'hsl(var(--border))',
    };

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
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Line
                  key={dataset.id}
                  type="monotone"
                  dataKey={dataset.name}
                  stroke={dataset.color}
                  strokeWidth={3}
                  dot={{ fill: dataset.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={config.animated ? 1000 : 0}
                />
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Bar
                  key={dataset.id}
                  dataKey={dataset.name}
                  fill={dataset.color}
                  radius={[6, 6, 0, 0]}
                  animationDuration={config.animated ? 1000 : 0}
                />
              ))}
            </BarChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Area
                  key={dataset.id}
                  type="monotone"
                  dataKey={dataset.name}
                  stroke={dataset.color}
                  strokeWidth={2}
                  fill={dataset.color}
                  fillOpacity={0.25}
                  animationDuration={config.animated ? 1000 : 0}
                />
              ))}
            </AreaChart>
          );

        case 'scatter':
          return (
            <ScatterChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis type="number" dataKey="x" name="x" {...axisStyle} />
              <YAxis type="number" dataKey="y" name="y" {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Scatter
                  key={dataset.id}
                  name={dataset.name}
                  data={dataset.values.map((v, i) => ({ x: i + 1, y: v, name: data.labels[i] }))}
                  fill={dataset.color}
                  animationDuration={config.animated ? 1000 : 0}
                />
              ))}
            </ScatterChart>
          );

        case 'pie':
          const pieData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
          }));
          return (
            <PieChart>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                animationDuration={config.animated ? 1000 : 0}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          );

        case 'donut':
          const donutData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
          }));
          return (
            <PieChart>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={3}
                dataKey="value"
                animationDuration={config.animated ? 1000 : 0}
              >
                {donutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          );

        case 'radar':
          return (
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset) => (
                <Radar
                  key={dataset.id}
                  name={dataset.name}
                  dataKey={dataset.name}
                  stroke={dataset.color}
                  fill={dataset.color}
                  fillOpacity={0.3}
                  animationDuration={config.animated ? 1000 : 0}
                />
              ))}
            </RadarChart>
          );

        case 'radialBar':
          const radialData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
            fill: CHART_COLORS[i % CHART_COLORS.length],
          }));
          return (
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="90%" 
              data={radialData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                animationDuration={config.animated ? 1000 : 0}
              >
                <LabelList dataKey="name" position="insideStart" fill="hsl(var(--foreground))" fontSize={11} />
              </RadialBar>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
            </RadialBarChart>
          );

        case 'composed':
          return (
            <ComposedChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              {visibleDatasets.map((dataset, index) => {
                if (index % 2 === 0) {
                  return (
                    <Bar
                      key={dataset.id}
                      dataKey={dataset.name}
                      fill={dataset.color}
                      radius={[4, 4, 0, 0]}
                      animationDuration={config.animated ? 1000 : 0}
                    />
                  );
                }
                return (
                  <Line
                    key={dataset.id}
                    type="monotone"
                    dataKey={dataset.name}
                    stroke={dataset.color}
                    strokeWidth={3}
                    dot={{ fill: dataset.color, r: 4 }}
                    animationDuration={config.animated ? 1000 : 0}
                  />
                );
              })}
            </ComposedChart>
          );

        case 'funnel':
          const funnelData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
            fill: CHART_COLORS[i % CHART_COLORS.length],
          })).sort((a, b) => b.value - a.value);
          return (
            <FunnelChart>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend />}
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive={config.animated}
                animationDuration={1000}
              >
                <LabelList position="center" fill="white" stroke="none" fontSize={12} dataKey="name" />
              </Funnel>
            </FunnelChart>
          );

        default:
          return null;
      }
    };

    const chart = renderChart();
    if (!chart) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <p>Unsupported chart type</p>
        </div>
      );
    }

    return (
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    );
  }
);

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;
