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
  ReferenceArea,
} from 'recharts';
import { ChartData, ChartConfig, CHART_COLORS, COLOR_SCHEMES, ChartAnnotation } from '@/types/chart';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getChartConfigForDevice } from '@/config/responsive.config';

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
    const { width, isMobile, isTablet, isLaptop, isDesktop, isUltraWide } = useResponsiveLayout();
    
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

    const colors = useMemo(() => {
      if (config.colorScheme === 'custom' && config.customColors && config.customColors.length > 0) {
        return config.customColors;
      }
      return COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || CHART_COLORS;
    }, [config.colorScheme, config.customColors]);

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
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4 animate-in fade-in-50 duration-300">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">No data to display</p>
              <p className="text-sm text-muted-foreground mt-1">Import data or load a sample to get started</p>
            </div>
          </div>
        </div>
      );
    }

    const strokeWidth = config.strokeWidth ?? 2;
    
    // Use centralized responsive configuration
    const responsiveConfig = getChartConfigForDevice(width);
    const isSmallMobile = width < 375;
    
    // Responsive font sizing with ultra-wide support and centralized config as fallback
    const baseFontSize = config.fontSize ?? responsiveConfig.fontSize;
    const fontSize = isSmallMobile 
      ? Math.max(9, baseFontSize - 3)
      : isMobile 
        ? Math.max(10, baseFontSize - 2)
        : isTablet
          ? baseFontSize
          : isLaptop
            ? baseFontSize + 1
            : isUltraWide
              ? Math.min(baseFontSize + 3, 16)
              : baseFontSize;
    
    // Responsive bar radius using centralized config
    const barRadius = config.barRadius ?? responsiveConfig.barRadius;
    const opacity = (config.opacity ?? 100) / 100;
    
    // Responsive point size using centralized config
    const basePointSize = config.pointSize ?? responsiveConfig.pointRadius;
    const pointSize = isSmallMobile 
      ? Math.max(2, basePointSize - 2)
      : isMobile 
        ? Math.max(3, basePointSize - 1) 
        : isUltraWide
          ? Math.min(basePointSize + 2, 8)
          : basePointSize;
    
    // Responsive stroke width using centralized config
    const configuredStrokeWidth = config.strokeWidth ?? responsiveConfig.strokeWidth;
    const mobileStrokeWidth = isSmallMobile 
      ? Math.max(1.5, configuredStrokeWidth - 0.5)
      : isMobile
        ? Math.max(1.5, configuredStrokeWidth - 0.3)
        : isUltraWide
          ? Math.min(configuredStrokeWidth + 0.5, 3)
          : configuredStrokeWidth;
    
    // New config options with defaults
    const showXAxis = config.showXAxis !== false;
    const showYAxis = config.showYAxis !== false;
    const xAxisRotation = config.xAxisRotation ?? 0;
    const yAxisTickCount = isMobile ? Math.min(4, config.yAxisTickCount ?? 5) : config.yAxisTickCount ?? 5;
    const fillOpacity = (config.fillOpacity ?? 30) / 100;
    const barGap = isMobile ? Math.max(2, (config.barGap ?? 4) - 2) : config.barGap ?? 4;
    const barCategoryGap = isMobile ? Math.max(10, (config.barCategoryGap ?? 20) - 5) : config.barCategoryGap ?? 20;
    const pieStartAngle = config.pieStartAngle ?? 90;
    const pieInnerRadius = config.pieInnerRadius ?? 0;
    const sharedTooltip = config.sharedTooltip !== false;
    const dataLabelPosition = config.dataLabelPosition ?? 'top';

    const tooltipStyleType = config.tooltipStyle ?? 'default';
    const tooltipStyle = { 
      backgroundColor: tooltipStyleType === 'minimal' ? 'hsl(var(--background))' : 'hsl(var(--card))', 
      border: tooltipStyleType === 'minimal' ? 'none' : '1px solid hsl(var(--border))',
      borderRadius: tooltipStyleType === 'minimal' ? '6px' : '12px',
      boxShadow: tooltipStyleType === 'minimal' ? '0 4px 12px rgba(0,0,0,0.1)' : '0 20px 60px -15px rgba(0,0,0,0.3)',
      padding: tooltipStyleType === 'minimal' ? '4px 8px' : '8px 12px',
      fontSize: Math.max(10, fontSize - 1),
    };
    
    const tooltipLabelStyle = {
      color: 'hsl(var(--foreground))',
      fontWeight: 600,
      marginBottom: tooltipStyleType === 'minimal' ? '4px' : '8px',
    };
    
    const tooltipItemStyle = {
      color: 'hsl(var(--foreground))',
      padding: tooltipStyleType === 'minimal' ? '2px 0' : '4px 0',
    };

    // Axis formatting function
    const formatAxisValue = (value: number) => {
      const format = config.axisFormat ?? 'number';
      const decimals = config.axisDecimals ?? 0;
      const currency = config.axisCurrency ?? '$';
      
      if (format === 'currency') {
        return `${currency}${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
      } else if (format === 'percent') {
        return `${value.toFixed(decimals)}%`;
      } else if (format === 'compact') {
        if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toFixed(decimals);
      }
      return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };

    const axisStyle = {
      tick: { fill: 'hsl(var(--muted-foreground))', fontSize: Math.max(9, fontSize - 1) },
      stroke: 'hsl(var(--border))',
      strokeWidth: 1,
    };
    
    const xAxisProps = {
      ...axisStyle,
      angle: xAxisRotation,
      textAnchor: xAxisRotation !== 0 ? 'end' as const : 'middle' as const,
      height: xAxisRotation !== 0 ? 60 : 30,
    };
    
    const yAxisProps = {
      ...axisStyle,
      tickFormatter: formatAxisValue,
      tickCount: yAxisTickCount,
      domain: [config.yAxisMin ?? 'auto', config.yAxisMax ?? 'auto'] as [number | 'auto', number | 'auto'],
    };

    const legendWrapperStyle: React.CSSProperties = {
      paddingTop: config.legendPosition === 'top' ? (isSmallMobile ? 4 : isMobile ? 6 : isTablet ? 8 : 10) : undefined,
      paddingBottom: config.legendPosition === 'bottom' ? (isSmallMobile ? 8 : isMobile ? 12 : isTablet ? 16 : 20) : undefined,
      paddingLeft: config.legendPosition === 'left' ? (isSmallMobile ? 4 : isMobile ? 6 : isTablet ? 8 : 10) : undefined,
      paddingRight: config.legendPosition === 'right' ? (isSmallMobile ? 4 : isMobile ? 6 : isTablet ? 8 : 10) : undefined,
      fontSize: isSmallMobile ? 10 : isMobile ? 11 : isTablet ? 12 : isUltraWide ? 14 : Math.max(13, fontSize + 2),
    };

    // Force horizontal legend layout on mobile for better space usage
    const mobileLegendPosition = isMobile ? 'bottom' : config.legendPosition;
    const mobileLegendLayout = isMobile ? 'horizontal' : (config.legendPosition === 'left' || config.legendPosition === 'right' ? 'vertical' : 'horizontal');

    const legendProps = {
      wrapperStyle: legendWrapperStyle,
      iconSize: isSmallMobile ? 10 : isMobile ? 12 : isTablet ? 14 : isUltraWide ? 18 : 16,
      verticalAlign: (mobileLegendPosition === 'top' || mobileLegendPosition === 'bottom' ? mobileLegendPosition : 'bottom') as 'top' | 'bottom',
      align: (mobileLegendPosition === 'left' || mobileLegendPosition === 'right' ? mobileLegendPosition : 'center') as 'left' | 'right' | 'center',
      layout: mobileLegendLayout as 'vertical' | 'horizontal',
    };

    const animDuration = config.animated ? 600 : 0;

    // Custom dot renderer for pointStyle
    const renderCustomDot = (color: string) => (props: { cx?: number; cy?: number; fill?: string }) => {
      const { cx, cy } = props;
      if (!cx || !cy) return null;
      
      const pointStyle = config.pointStyle || 'circle';
      const size = pointSize;
      
      if (pointStyle === 'none') return null;
      
      switch (pointStyle) {
        case 'square':
          return <rect x={cx - size} y={cy - size} width={size * 2} height={size * 2} fill={color} fillOpacity={opacity} />;
        case 'diamond':
          return (
            <polygon 
              points={`${cx},${cy - size * 1.3} ${cx + size * 1.3},${cy} ${cx},${cy + size * 1.3} ${cx - size * 1.3},${cy}`} 
              fill={color} 
              fillOpacity={opacity}
            />
          );
        case 'triangle':
          return (
            <polygon 
              points={`${cx},${cy - size * 1.3} ${cx + size * 1.3},${cy + size} ${cx - size * 1.3},${cy + size}`} 
              fill={color} 
              fillOpacity={opacity}
            />
          );
        case 'circle':
        default:
          return <circle cx={cx} cy={cy} r={size} fill={color} fillOpacity={opacity} />;
      }
    };

    // Grid configuration
    const getGridDashArray = () => {
      switch (config.gridType) {
        case 'solid': return '0';
        case 'dashed': return '5 5';
        case 'dotted': return '2 2';
        case 'none': return '0';
        default: return '3 3';
      }
    };
    
    const gridOpacity = config.gridType === 'none' ? 0 : (config.gridOpacity ?? 30) / 100;
    const gridStroke = "hsl(var(--border))";
    const gridStrokeWidth = config.gridSize ?? 1;

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
        } else if (annotation.type === 'area' && annotation.y1 !== undefined && annotation.y2 !== undefined) {
          return (
            <ReferenceArea
              key={annotation.id}
              y1={annotation.y1}
              y2={annotation.y2}
              fill={annotation.color}
              fillOpacity={0.2}
              label={{ 
                value: annotation.label, 
                position: 'top',
                fill: annotation.color,
                fontSize: fontSize - 1
              }}
            />
          );
        }
        return null;
      });
    };

    const renderChart = () => {
      // Mobile-optimized margins
      const chartMargins = {
        top: isMobile ? 15 : 30,
        right: isSmallMobile ? 10 : isMobile ? 15 : 40,
        left: isSmallMobile ? 20 : isMobile ? 25 : 30,
        bottom: isMobile ? 25 : 30,
      };
      
      const commonProps = {
        data: chartData,
        margin: chartMargins,
      };

      switch (config.type) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              {showXAxis && <XAxis dataKey="name" {...xAxisProps} />}
              {showYAxis && <YAxis {...yAxisProps} />}
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} shared={sharedTooltip} />}
              {config.showLegend && <Legend {...legendProps} />}
              {renderAnnotations('line')}
              {visibleDatasets.map((dataset, i) => (
                <Line
                  key={dataset.id}
                  type={config.smooth ? 'monotone' : 'linear'}
                  dataKey={dataset.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={mobileStrokeWidth + 0.5}
                  strokeOpacity={opacity}
                  dot={config.pointStyle === 'none' ? false : renderCustomDot(colors[i % colors.length])}
                  activeDot={{ 
                    r: pointSize + 3, 
                    strokeWidth: 3,
                    stroke: colors[i % colors.length],
                    fill: 'hsl(var(--background))',
                    fillOpacity: 1
                  }}
                  animationDuration={animDuration}
                >
                  {config.showDataLabels && <LabelList dataKey={dataset.name} position={dataLabelPosition} fontSize={fontSize - 1} />}
                </Line>
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps} barGap={barGap} barCategoryGap={`${barCategoryGap}%`}>
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              {showXAxis && <XAxis dataKey="name" {...xAxisProps} />}
              {showYAxis && <YAxis {...yAxisProps} />}
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: 'hsl(var(--muted) / 0.2)' }} shared={sharedTooltip} />}
              {config.showLegend && <Legend {...legendProps} />}
              {renderAnnotations('bar')}
              {visibleDatasets.map((dataset, i) => (
                <Bar
                  key={dataset.id}
                  dataKey={dataset.name}
                  fill={colors[i % colors.length]}
                  fillOpacity={opacity}
                  radius={[barRadius + 2, barRadius + 2, 0, 0]}
                  animationDuration={animDuration}
                  stackId={config.stacked ? 'stack' : undefined}
                >
                  {config.showDataLabels && <LabelList dataKey={dataset.name} position={dataLabelPosition} fontSize={fontSize - 1} />}
                </Bar>
              ))}
            </BarChart>
          );

        case 'barHorizontal':
          return (
            <BarChart {...commonProps} layout="vertical" barGap={barGap} barCategoryGap={`${barCategoryGap}%`}>
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              {showXAxis && <XAxis type="number" {...yAxisProps} />}
              {showYAxis && <YAxis dataKey="name" type="category" {...axisStyle} width={80} />}
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} shared={sharedTooltip} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Bar
                  key={dataset.id}
                  dataKey={dataset.name}
                  fill={colors[i % colors.length]}
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
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              {showXAxis && <XAxis dataKey="name" {...xAxisProps} />}
              {showYAxis && <YAxis {...yAxisProps} />}
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} shared={sharedTooltip} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Area
                  key={dataset.id}
                  type={config.smooth ? 'monotone' : 'linear'}
                  dataKey={dataset.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={strokeWidth + 0.5}
                  fill={colors[i % colors.length]}
                  fillOpacity={fillOpacity}
                  animationDuration={animDuration}
                  stackId={config.stacked ? 'stack' : undefined}
                />
              ))}
            </AreaChart>
          );

        case 'scatter':
          return (
            <ScatterChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              <XAxis type="number" dataKey="x" name="x" {...axisStyle} />
              <YAxis type="number" dataKey="y" name="y" {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={false} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Scatter
                  key={dataset.id}
                  name={dataset.name}
                  data={dataset.values.map((v, idx) => ({ x: idx + 1, y: v, name: data.labels[idx] }))}
                  fill={colors[i % colors.length]}
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
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              <XAxis type="number" dataKey="x" name="Index" {...axisStyle} />
              <YAxis type="number" dataKey="y" name="Value" {...axisStyle} />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={false} />}
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
          const pieLabelPos = config.pieLabelPosition ?? 'outside';
          return (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={pieInnerRadius > 0 ? `${pieInnerRadius}%` : 0}
                outerRadius="70%"
                startAngle={pieStartAngle}
                endAngle={pieStartAngle - 360}
                paddingAngle={3}
                dataKey="value"
                label={config.showDataLabels ? ({ name, percent }) => {
                  if (pieLabelPos === 'inside') return `${(percent * 100).toFixed(0)}%`;
                  if (pieLabelPos === 'outside') return `${name} ${(percent * 100).toFixed(0)}%`;
                  return `${name}`;
                } : false}
                labelLine={config.showDataLabels && pieLabelPos === 'outside'}
                animationDuration={animDuration}
                stroke="hsl(var(--background))"
                strokeWidth={3}
              >
                {pieData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    fillOpacity={opacity}
                  />
                ))}
              </Pie>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
            </PieChart>
          );

        case 'donut':
          const donutData = data.labels.map((label, i) => ({
            name: label,
            value: visibleDatasets[0]?.values[i] ?? 0,
          }));
          const donutLabelPos = config.pieLabelPosition ?? 'outside';
          const donutInnerRadius = Math.max(pieInnerRadius, 45); // minimum 45% for donut
          return (
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={`${donutInnerRadius}%`}
                outerRadius="70%"
                startAngle={pieStartAngle}
                endAngle={pieStartAngle - 360}
                paddingAngle={4}
                dataKey="value"
                label={config.showDataLabels ? ({ name, percent }) => {
                  if (donutLabelPos === 'inside') return `${(percent * 100).toFixed(0)}%`;
                  return `${name}`;
                } : false}
                labelLine={config.showDataLabels && donutLabelPos === 'outside'}
                animationDuration={animDuration}
                stroke="hsl(var(--background))"
                strokeWidth={3}
              >
                {donutData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    fillOpacity={opacity}
                  />
                ))}
              </Pie>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
            </PieChart>
          );

        case 'radar':
          return (
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: fontSize }} />
              <PolarRadiusAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: fontSize - 1 }} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, i) => (
                <Radar
                  key={dataset.id}
                  name={dataset.name}
                  dataKey={dataset.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={strokeWidth}
                  fill={colors[i % colors.length]}
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
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
            </RadialBarChart>
          );

        case 'composed':
          return (
            <ComposedChart {...commonProps}>
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
              {visibleDatasets.map((dataset, index) => {
                const color = colors[index % colors.length];
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
            <FunnelChart>
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive={config.animated}
                animationDuration={animDuration}
              >
                <LabelList position="center" fill="white" stroke="none" fontSize={fontSize} dataKey="name" />
              </Funnel>
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
              {config.showLegend && <Legend {...legendProps} />}
            </FunnelChart>
          );

        case 'treemap':
          const treemapData = data.labels.map((label, i) => ({
            name: label,
            size: visibleDatasets[0]?.values[i] ?? 0,
            fill: colors[i % colors.length],
          }));
          return (
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="hsl(var(--background))"
              fill="hsl(var(--primary))"
              animationDuration={animDuration}
              content={({ x, y, width, height, index }) => {
                const item = treemapData[index];
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={item.fill}
                      fillOpacity={opacity}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                    {width > 50 && height > 30 && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        fill="white"
                        fontSize={Math.min(fontSize, Math.floor(width / 8))}
                        fontWeight="600"
                      >
                        {item.name}
                      </text>
                    )}
                  </g>
                );
              }}
            >
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
            </Treemap>
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
              {config.showGrid && <CartesianGrid strokeDasharray={getGridDashArray()} opacity={gridOpacity} stroke={gridStroke} strokeWidth={gridStrokeWidth} />}
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              {config.showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
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
      <div 
        ref={containerRef} 
        className={`w-full h-full transition-gpu flex flex-col ${isUltraWide ? 'max-w-[1600px] mx-auto' : ''}`}
        style={{ minHeight: 300, backgroundColor: config.backgroundColor || 'transparent' }}
      >
        {config.title && (
          <h2 className="text-center font-semibold text-lg mb-2 flex-shrink-0 pt-2" style={{ fontSize: fontSize + 4 }}>
            {config.title}
          </h2>
        )}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            {chart}
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);

ChartRenderer.displayName = 'ChartRenderer';

export default ChartRenderer;