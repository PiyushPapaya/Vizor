import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CHART_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates, ChartTemplate } from '@/lib/templates';
import { cardVariants, listContainerVariants, hoverLift, tapScale } from '@/lib/animations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, X, Check, Trash2, User, BarChart2, LineChart, PieChart, TrendingUp, AreaChart } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Chart type icons for thumbnail placeholder
const CHART_ICONS: Record<string, any> = {
  bar: BarChart2,
  barHorizontal: BarChart2,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
  donut: PieChart,
  funnel: TrendingUp,
  default: BarChart2,
};

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: ChartTemplate) => void;
}

// User templates stored in localStorage
const USER_TEMPLATES_KEY = 'vizor-user-templates';

function getUserTemplates(): ChartTemplate[] {
  try {
    const stored = localStorage.getItem(USER_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUserTemplates(templates: ChartTemplate[]) {
  localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(templates));
}

export function addUserTemplate(template: ChartTemplate) {
  const templates = getUserTemplates();
  templates.unshift(template);
  saveUserTemplates(templates);
}

export function deleteUserTemplate(templateId: string) {
  const templates = getUserTemplates().filter(t => t.id !== templateId);
  saveUserTemplates(templates);
}

export default function TemplateGallery({ open, onOpenChange, onSelectTemplate }: TemplateGalleryProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userTemplates, setUserTemplates] = useState<ChartTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'my-templates'>('gallery');

  // Load user templates on mount
  useEffect(() => {
    if (open) {
      setUserTemplates(getUserTemplates());
    }
  }, [open]);

  const templates = searchQuery
    ? searchTemplates(searchQuery)
    : getTemplatesByCategory(selectedCategory);

  const handleTemplateClick = (template: ChartTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  const handleDeleteUserTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteUserTemplate(templateId);
    setUserTemplates(getUserTemplates());
    toast.success(t('templates.deleted'));
  };

  // Get appropriate icon for chart type
  const getChartIcon = (type: string) => {
    return CHART_ICONS[type] || CHART_ICONS.default;
  };

  // Generate a simple gradient preview based on chart type
  const getPreviewGradient = (type: string) => {
    const gradients: Record<string, string> = {
      bar: 'from-blue-500/20 to-cyan-500/20',
      barHorizontal: 'from-purple-500/20 to-pink-500/20',
      line: 'from-green-500/20 to-emerald-500/20',
      area: 'from-teal-500/20 to-cyan-500/20',
      pie: 'from-orange-500/20 to-yellow-500/20',
      donut: 'from-pink-500/20 to-rose-500/20',
      radar: 'from-indigo-500/20 to-violet-500/20',
      funnel: 'from-red-500/20 to-orange-500/20',
    };
    return gradients[type] || 'from-primary/20 to-accent/20';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold text-gradient-vizor truncate">{t('templates.gallery')}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                {t('templates.templateCount', { count: CHART_TEMPLATES.length })}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-2 sm:mt-3">
            <TabsList className="grid w-full max-w-xs grid-cols-2 h-9 sm:h-10 bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="gallery" className="text-xs sm:text-sm gap-1 sm:gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">{t('templates.gallery')}</span>
                <span className="sm:hidden">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="my-templates" className="text-xs sm:text-sm gap-1 sm:gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">{t('templates.myTemplates')}</span>
                <span className="sm:hidden">Mine</span>
                {userTemplates.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 sm:h-5 px-1 sm:px-1.5 text-[9px] sm:text-[10px]">
                    {userTemplates.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
            {/* Sidebar - Categories */}
            <div className="w-full sm:w-48 md:w-56 border-b sm:border-b-0 sm:border-r border-border/30 p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm touch-target-critical"
                />
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                {TEMPLATE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-target-secondary ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'hover:bg-muted/60'
                    }`}
                  >
                    {t(`templates.categories.${category.id}`, category.name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {templates.map((template, index) => {
                  const ChartIcon = getChartIcon(template.config.type || 'bar');
                  return (
                    <motion.div
                      key={template.id}
                      variants={cardVariants}
                      whileHover={hoverLift}
                      whileTap={tapScale}
                    >
                      <Card 
                        className="cursor-pointer hover:border-primary/40 group shadow-sm transition-all duration-200 hover:shadow-md border-border/30 shine-on-hover"
                        onClick={() => handleTemplateClick(template)}
                      >
                        <CardHeader className="p-3 pb-2">
                          {/* Visual Preview */}
                          <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${getPreviewGradient(template.config.type || 'bar')} mb-2 flex items-center justify-center border border-border/20 relative overflow-hidden`}>
                            <ChartIcon className="h-10 w-10 text-muted-foreground/40" />
                            {/* Mini bars visualization */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-end gap-1 h-8">
                              {[0.6, 0.8, 0.5, 0.9, 0.7].map((h, i) => (
                                <div 
                                  key={i} 
                                  className="flex-1 bg-primary/30 rounded-t-sm" 
                                  style={{ height: `${h * 100}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm font-semibold leading-tight">
                              {template.name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-[10px] capitalize shrink-0">
                              {template.config.type}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs line-clamp-2 mt-1">
                            {template.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-3 pt-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            {template.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button 
                            className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg font-medium"
                            size="sm"
                            variant="default"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              {templates.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">{t('templates.noTemplates')}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {t('common.tryDifferentSearch')}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* My Templates Tab */}
        {activeTab === 'my-templates' && (
          <ScrollArea className="flex-1 p-4">
            {userTemplates.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {userTemplates.map((template, index) => {
                  const ChartIcon = getChartIcon(template.config.type || 'bar');
                  return (
                    <motion.div
                      key={template.id}
                      variants={cardVariants}
                      whileHover={hoverLift}
                      whileTap={tapScale}
                    >
                      <Card 
                        className="cursor-pointer hover:border-primary/50 group shadow-sm transition-all hover:shadow-md relative"
                        onClick={() => handleTemplateClick(template)}
                      >
                        <CardHeader className="p-3 pb-2">
                          <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${getPreviewGradient(template.config.type || 'bar')} mb-2 flex items-center justify-center border relative overflow-hidden`}>
                            <ChartIcon className="h-10 w-10 text-muted-foreground/40" />
                            <div className="absolute bottom-2 left-2 right-2 flex items-end gap-1 h-8">
                              {[0.6, 0.8, 0.5, 0.9, 0.7].map((h, i) => (
                                <div 
                                  key={i} 
                                  className="flex-1 bg-primary/30 rounded-t-sm" 
                                  style={{ height: `${h * 100}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm font-semibold leading-tight">
                              {template.name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-[10px] capitalize shrink-0">
                              {template.config.type}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs line-clamp-2 mt-1">
                            {template.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-3 pt-0">
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              size="sm"
                              variant="default"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              {t('templates.useTemplate')}
                            </Button>
                            <Button 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              size="sm"
                              variant="destructive"
                              onClick={(e) => handleDeleteUserTemplate(template.id, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">{t('templates.noSavedTemplates')}</p>
                <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">
                  {t('templates.saveFirst')}
                </p>
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
