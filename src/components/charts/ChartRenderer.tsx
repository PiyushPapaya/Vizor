import { useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
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
  Treemap,
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
  ZAxis,
  ReferenceLine,
} from 'recharts';
import { ChartData, ChartConfig, CHART_COLORS, COLOR_SCHEMES, ChartAnnotation } from '@/types/chart';

interface ChartRendererProps {
  data: ChartData;
  config: ChartConfig;
}

export interface ChartRendererRef {
  exportToPNG: () => Promise<string | null>;
  exportToSVG: () => string | null;
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
            ctx!.fillStyle = 'white';
            ctx?.fillRect(0, 0, canvas.width, canvas.height);
            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = url;
        });
      },
      exportToSVG: () => {
        if (!containerRef.current) return null;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return null;
        return new XMLSerializer().serializeToString(svg);
      },
    }));

    const colors = useMemo(() => 
      COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || CHART_COLORS,
    [config.colorScheme]);

    const chartData = useMemo(() => {
      return data.labels.map((label, index) => {
        const point: Record<string, string | number> = { name: label };
        data.datasets.forEach((dataset) => {
          if (dataset.visible) {
            point[dataset.name] = dataset.values[index] ?? 0;
          }
        });
        return point;
      });
    }, [data]);

    const visibleDatasets = useMemo(() => 
      data.datasets.filter(ds => ds.visible), 
      [data.datasets]
    );

    if (visibleDatasets.length === 0 || data.labels.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center space-y-3 animate-in">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold">No data to display</p>
              <p className="text-sm text-muted-foreground/70">Import data or load sample to get started</p>
            </div>
          </div>
        </div>
      );
    }

    const strokeWidth = config.strokeWidth ?? 2;
    const fontSize = config.fontSize ?? 12;
    const barRadius = config.barRadius ?? 4;
    const opacity = (config.opacity ?? 100) / 100;

    // Enhanced tooltip with better styling and more information
    const tooltipStyle = { 
      backgroundColor: 'hsl(var(--card))', 
      border: '1px solid hsl(var(--border))',
      borderRadius: '12px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
      padding: '12px 16px',
      fontSize: fontSize + 1,
    };

    // Improved axis styling for better readability
    const axisStyle = {
      tick: { fill: 'hsl(var(--muted-foreground))', fontSize: fontSize, fontWeight: 500 },
      stroke: 'hsl(var(--border))',
      strokeWidth: 1,
    };

    // Enhanced legend styling
    const legendWrapperStyle: React.CSSProperties = {
      paddingTop: config.legendPosition === 'top' ? 10 : undefined,
      paddingBottom: config.legendPosition === 'bottom' ? 15 : undefined,
      fontSize: fontSize + 1,
      fontWeight: 500,
    };

    const legendProps = {
      wrapperStyle: legendWrapperStyle,
      verticalAlign: (config.legendPosition === 'top' ? 'top' : 'bottom') as 'top' | 'bottom',
      align: 'center' as const,
      iconType: 'circle' as const,
      iconSize: 10,
    };

    const animDuration = config.animated ? 800 : 0;

    const annotations = config.annotations?.filter(a => a.visible) || [];

    const renderAnnotations = (chartType: string) => {
      return annotations.map(annotation => {
        if (annotation.type === 'referenceLine' || annotation.type === 'line') {
          if (annotation.orientation === 'horizontal') {
            return (
              <ReferenceLine 
                key={annotation.id}
                y={annotation.value} 
                stroke={annotation.color}
                strokeDasharray={annotation.strokeDasharray}
                strokeWidth={2}
                label={{ 
                  value: annotation.label, 
                  position: 'right',
                  fill: annotation.color,
                  fontSize: fontSize - 1
                }}
              />
            );
          } else {
            return (
              <ReferenceLine 
                key={annotation.id}
                x={annotation.value} 
                stroke={annotation.color}
                strokeDasharray={annotation.strokeDasharray}
                strokeWidth={2}
                label={{ 
                  value: annotation.label, 
                  position: 'top',
                  fill: annotation.color,
                  fontSize: fontSize - 1
                }}
              />
            );
          }
        }
        // Area annotations would need ReferenceArea which isn't imported - could add
        return null;
      });
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
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              {renderAnnotations('line')}
              {visibleDatasets.map((dataset, i) => (
                <Line
                  key={dataset.id}
                  type={config.smooth ? 'monotone' : 'linear'}
                  dataKey={dataset.name}
                  stroke={dataset.color || colors[i % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  dot={{ fill: dataset.color || colors[i % colors.length], strokeWidth: strokeWidth, r: 4 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                  animationDuration={animDuration}
                >
                  {config.showDataLabels && <LabelList dataKey={dataset.name} position="top" fontSize={fontSize - 2} />}
                </Line>
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />}
              {config.showLegend && <Legend {...legendProps} />}
              {renderAnnotations('bar')}
              {visibleDatasets.map((dataset, i) => (
                <Bar
                  key={dataset.id}
                  dataKey={dataset.name}
                  fill={dataset.color || colors[i % colors.length]}
                  fillOpacity={opacity}
                  radius={[barRadius, barRadius, 0, 0]}
                  animationDuration={animDuration}
                  stackId={config.stacked ? 'stack' : undefined}
                >
                  {config.showDataLabels && <LabelList dataKey={dataset.name} position="top" fontSize={fontSize - 2} />}
                </Bar>
              ))}
            </BarChart>
          );

        case 'barHorizontal':
          return (
            <BarChart {...commonProps} layout="vertical">
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis type="number" {...axisStyle} />
              <YAxis dataKey="name" type="category" {...axisStyle} width={80} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Bar
                  key={dataset.id}
                  dataKey={dataset.name}
                  fill={dataset.color || colors[i % colors.length]}
                  fillOpacity={opacity}
                  radius={[0, barRadius, barRadius, 0]}
                  animationDuration={animDuration}
                  stackId={config.stacked ? 'stack' : undefined}
                >
                  {config.showDataLabels && <LabelList dataKey={dataset.name} position="right" fontSize={fontSize - 2} />}
                </Bar>
              ))}
            </BarChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Area
                  key={dataset.id}
                  type={config.smooth ? 'monotone' : 'linear'}
                  dataKey={dataset.name}
                  stroke={dataset.color || colors[i % colors.length]}
                  strokeWidth={strokeWidth}
                  fill={dataset.color || colors[i % colors.length]}
                  fillOpacity={opacity * 0.25}
                  animationDuration={animDuration}
                  stackId={config.stacked ? 'stack' : undefined}
                />
              ))}
            </AreaChart>
          );

        case 'scatter':
          return (
            <ScatterChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis type="number" dataKey="x" name="x" {...axisStyle} />
              <YAxis type="number" dataKey="y" name="y" {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Scatter
                  key={dataset.id}
                  name={dataset.name}
                  data={dataset.values.map((v, idx) => ({ x: idx + 1, y: v, name: data.labels[idx] }))}
                  fill={dataset.color || colors[i % colors.length]}
                  fillOpacity={opacity}
                  animationDuration={animDuration}
                />
              ))}
            </ScatterChart>
          );

        case 'bubble':
          const bubbleData = data.labels.map((label, idx) => ({
            name: label,
            x: idx + 1,
            y: visibleDatasets[0]?.values[idx] ?? 0,
            z: visibleDatasets[1]?.values[idx] ?? visibleDatasets[0]?.values[idx] ?? 10,
          }));
          return (
            <ScatterChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis type="number" dataKey="x" name="Index" {...axisStyle} />
              <YAxis type="number" dataKey="y" name="Value" {...axisStyle} />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />}
              {config.showLegend && <Legend {...legendProps} />}
              <Scatter name="Data" data={bubbleData} animationDuration={animDuration}>
                {bubbleData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={opacity * 0.8} />
                ))}
              </Scatter>
            </ScatterChart>
          );

        case 'pie':
          const pieData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
          }));
          return (
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius="75%"
                paddingAngle={2}
                dataKey="value"
                label={config.showDataLabels ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                labelLine={config.showDataLabels}
                animationDuration={animDuration}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={opacity} />
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
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="75%"
                paddingAngle={3}
                dataKey="value"
                animationDuration={animDuration}
              >
                {donutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={opacity} />
                ))}
              </Pie>
            </PieChart>
          );

        case 'radar':
          return (
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: fontSize }} />
              <PolarRadiusAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: fontSize - 2 }} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Radar
                  key={dataset.id}
                  name={dataset.name}
                  dataKey={dataset.name}
                  stroke={dataset.color || colors[i % colors.length]}
                  strokeWidth={strokeWidth}
                  fill={dataset.color || colors[i % colors.length]}
                  fillOpacity={opacity * 0.3}
                  animationDuration={animDuration}
                />
              ))}
            </RadarChart>
          );

        case 'radialBar':
          const radialData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
            fill: colors[i % colors.length],
          }));
          return (
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="85%" 
              data={radialData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={barRadius}
                animationDuration={animDuration}
              >
                {config.showDataLabels && <LabelList dataKey="name" position="insideStart" fill="hsl(var(--foreground))" fontSize={fontSize - 2} />}
              </RadialBar>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
            </RadialBarChart>
          );

        case 'composed':
          return (
            <ComposedChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, index) => {
                const color = dataset.color || colors[index % colors.length];
                if (index % 2 === 0) {
                  return (
                    <Bar
                      key={dataset.id}
                      dataKey={dataset.name}
                      fill={color}
                      fillOpacity={opacity}
                      radius={[barRadius, barRadius, 0, 0]}
                      animationDuration={animDuration}
                    />
                  );
                }
                return (
                  <Line
                    key={dataset.id}
                    type="monotone"
                    dataKey={dataset.name}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    dot={{ fill: color, r: 4 }}
                    animationDuration={animDuration}
                  />
                );
              })}
            </ComposedChart>
          );

        case 'funnel':
          const funnelData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
            fill: colors[i % colors.length],
          })).sort((a, b) => b.value - a.value);
          return (
            <FunnelChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive={config.animated}
                animationDuration={animDuration}
              >
                <LabelList position="center" fill="white" stroke="none" fontSize={fontSize} dataKey="name" />
              </Funnel>
            </FunnelChart>
          );

        case 'treemap':
          const treemapData = data.labels.map((label, i) => ({
            name: label,
            size: visibleDatasets[0]?.values[i] ?? 0,
            fill: colors[i % colors.length],
          }));
          return (
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="hsl(var(--background))"
                fill="hsl(var(--primary))"
                animationDuration={animDuration}
              >
                {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
                {treemapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={opacity} />
                ))}
              </Treemap>
            </ResponsiveContainer>
          );

        case 'waterfall':
          const waterfallData = data.labels.map((label, i) => {
            const val = visibleDatasets[0]?.values[i] ?? 0;
            const prevSum = visibleDatasets[0]?.values.slice(0, i).reduce((a, b) => a + b, 0) ?? 0;
            return {
              name: label,
              value: val,
              start: prevSum,
              end: prevSum + val,
              isPositive: val >= 0,
            };
          });
          return (
            <BarChart {...commonProps} data={waterfallData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-40" />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <Bar dataKey="start" stackId="waterfall" fill="transparent" animationDuration={0} />
              <Bar dataKey="value" stackId="waterfall" animationDuration={animDuration} radius={[barRadius, barRadius, barRadius, barRadius]}>
                {waterfallData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isPositive ? colors[0] : colors[4]} 
                    fillOpacity={opacity}
                  />
                ))}
                {config.showDataLabels && <LabelList dataKey="value" position="top" fontSize={fontSize - 2} />}
              </Bar>
            </BarChart>
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
      <div ref={containerRef} className="w-full h-full transition-gpu" style={{ minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    );
  }
);

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;