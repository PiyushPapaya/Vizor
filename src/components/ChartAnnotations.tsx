import { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Trash2, ChevronDown, Type, Minus, ArrowRight, 
  Target, Edit2, Eye, EyeOff, GripVertical
} from 'lucide-react';

export interface ChartAnnotation {
  id: string;
  type: 'text' | 'line' | 'referenceLine' | 'area';
  label: string;
  value?: number;
  position?: { x: number; y: number };
  color: string;
  visible: boolean;
  // Line specific
  orientation?: 'horizontal' | 'vertical';
  strokeDasharray?: string;
  // Area specific
  y1?: number;
  y2?: number;
}

interface ChartAnnotationsProps {
  annotations: ChartAnnotation[];
  onUpdate: (annotations: ChartAnnotation[]) => void;
}

const ANNOTATION_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'
];

function ChartAnnotations({ annotations, onUpdate }: ChartAnnotationsProps) {
  const [openSections, setOpenSections] = useState({ add: false, list: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add new annotation
  const addAnnotation = useCallback((type: ChartAnnotation['type']) => {
    const newAnnotation: ChartAnnotation = {
      id: generateId(),
      type,
      label: type === 'text' ? 'Label' : type === 'line' ? 'Threshold' : type === 'area' ? 'Range' : 'Reference',
      value: type !== 'text' ? 50 : undefined,
      position: type === 'text' ? { x: 50, y: 50 } : undefined,
      color: ANNOTATION_COLORS[annotations.length % ANNOTATION_COLORS.length],
      visible: true,
      orientation: type === 'line' || type === 'referenceLine' ? 'horizontal' : undefined,
      strokeDasharray: type === 'line' ? '5 5' : undefined,
      y1: type === 'area' ? 30 : undefined,
      y2: type === 'area' ? 70 : undefined,
    };
    onUpdate([...annotations, newAnnotation]);
    setEditingId(newAnnotation.id);
    setOpenSections(prev => ({ ...prev, list: true, add: false }));
  }, [annotations, onUpdate]);

  // Update annotation
  const updateAnnotation = useCallback((id: string, updates: Partial<ChartAnnotation>) => {
    onUpdate(annotations.map(a => a.id === id ? { ...a, ...updates } : a));
  }, [annotations, onUpdate]);

  // Delete annotation
  const deleteAnnotation = useCallback((id: string) => {
    onUpdate(annotations.filter(a => a.id !== id));
    if (editingId === id) setEditingId(null);
  }, [annotations, onUpdate, editingId]);

  // Toggle visibility
  const toggleVisibility = useCallback((id: string) => {
    const annotation = annotations.find(a => a.id === id);
    if (annotation) {
      updateAnnotation(id, { visible: !annotation.visible });
    }
  }, [annotations, updateAnnotation]);

  const visibleCount = annotations.filter(a => a.visible).length;

  const getTypeIcon = (type: ChartAnnotation['type']) => {
    switch (type) {
      case 'text': return <Type className="h-3.5 w-3.5" />;
      case 'line': return <Minus className="h-3.5 w-3.5" />;
      case 'referenceLine': return <ArrowRight className="h-3.5 w-3.5" />;
      case 'area': return <Target className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-2">
      {/* Add Annotation Section */}
      <Collapsible open={openSections.add} onOpenChange={() => toggleSection('add')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Add Annotation</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.add ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addAnnotation('text')}
              className="h-9 text-xs gap-1.5 justify-start"
            >
              <Type className="h-3.5 w-3.5" />
              Text Label
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addAnnotation('referenceLine')}
              className="h-9 text-xs gap-1.5 justify-start"
            >
              <Minus className="h-3.5 w-3.5" />
              Reference Line
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addAnnotation('line')}
              className="h-9 text-xs gap-1.5 justify-start"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              Threshold
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addAnnotation('area')}
              className="h-9 text-xs gap-1.5 justify-start"
            >
              <Target className="h-3.5 w-3.5" />
              Highlight Area
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Annotations List */}
      <Collapsible open={openSections.list} onOpenChange={() => toggleSection('list')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Annotations</span>
          </div>
          <div className="flex items-center gap-2">
            {annotations.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {visibleCount}/{annotations.length}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.list ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          {annotations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No annotations yet. Add one above.
            </p>
          ) : (
            <ScrollArea className="max-h-64">
              <div className="space-y-2 pr-2">
                {annotations.map((annotation) => (
                  <div 
                    key={annotation.id}
                    className={`rounded-lg border transition-all ${
                      editingId === annotation.id ? 'border-primary bg-muted/30' : 'border-border/50 hover:border-border'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 p-2">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: annotation.color }}
                      />
                      <span className="text-xs font-medium flex-1 truncate">
                        {annotation.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVisibility(annotation.id)}
                          className="h-6 w-6 p-0"
                        >
                          {annotation.visible ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(editingId === annotation.id ? null : annotation.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAnnotation(annotation.id)}
                          className="h-6 w-6 p-0 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Edit Panel */}
                    {editingId === annotation.id && (
                      <div className="p-2 pt-0 space-y-3 border-t border-border/50">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Label</Label>
                          <Input
                            value={annotation.label}
                            onChange={(e) => updateAnnotation(annotation.id, { label: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </div>

                        {(annotation.type === 'line' || annotation.type === 'referenceLine') && (
                          <>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">Value</Label>
                                <span className="text-xs font-mono">{annotation.value}</span>
                              </div>
                              <Slider
                                value={[annotation.value ?? 50]}
                                onValueChange={([v]) => updateAnnotation(annotation.id, { value: v })}
                                min={0}
                                max={100}
                                step={1}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">Orientation</Label>
                              <Select
                                value={annotation.orientation}
                                onValueChange={(v) => updateAnnotation(annotation.id, { orientation: v as 'horizontal' | 'vertical' })}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="horizontal">Horizontal</SelectItem>
                                  <SelectItem value="vertical">Vertical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {annotation.type === 'area' && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Range</Label>
                              <span className="text-xs font-mono">{annotation.y1} - {annotation.y2}</span>
                            </div>
                            <Slider
                              value={[annotation.y1 ?? 30, annotation.y2 ?? 70]}
                              onValueChange={([y1, y2]) => updateAnnotation(annotation.id, { y1, y2 })}
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Color</Label>
                          <div className="flex gap-1.5 flex-wrap">
                            {ANNOTATION_COLORS.map((color) => (
                              <button
                                key={color}
                                onClick={() => updateAnnotation(annotation.id, { color })}
                                className={`w-6 h-6 rounded-full transition-all ${
                                  annotation.color === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default memo(ChartAnnotations);
