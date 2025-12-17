import { useState } from 'react';
import { motion } from 'framer-motion';
import { CHART_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates, ChartTemplate } from '@/lib/templates';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Sparkles, X, Check } from 'lucide-react';

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: ChartTemplate) => void;
}

export default function TemplateGallery({ open, onOpenChange, onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const templates = searchQuery
    ? searchTemplates(searchQuery)
    : getTemplatesByCategory(selectedCategory);

  const handleTemplateClick = (template: ChartTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gradient-forge">Template Gallery</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose from {CHART_TEMPLATES.length}+ pre-configured chart templates
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar - Categories */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-4 space-y-4 overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-1">
              {TEMPLATE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <ScrollArea className="flex-1 p-6 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer interactive-card hover:border-primary/50 group shadow-sm transition-shadow"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <CardHeader className="pb-3">
                      {/* Thumbnail Placeholder */}
                      <div className="w-full h-36 md:h-32 rounded-lg bg-gradient-mesh-forge mb-3 flex items-center justify-center border overflow-hidden">
                        <div className="text-4xl opacity-30">📊</div>
                      </div>
                      
                      <CardTitle className="text-base flex items-center justify-between">
                        {template.name}
                        <Badge variant="secondary" className="text-xs capitalize">
                          {template.config.type}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full mt-3 btn-glass opacity-0 group-hover:opacity-100 transition-opacity"
                        size="sm"
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {templates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No templates found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
