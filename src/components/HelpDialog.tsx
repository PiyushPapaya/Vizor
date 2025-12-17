import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Book, 
  Keyboard, 
  Video, 
  HelpCircle,
  FileText,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const documentation = [
  {
    category: 'Getting Started',
    icon: Lightbulb,
    items: [
      {
        title: 'Quick Start Guide',
        description: 'Learn the basics of Vizor in 5 minutes',
        content: 'Upload your data → Select chart type → Customize appearance → Export your chart',
      },
      {
        title: 'Supported File Formats',
        description: 'CSV, Excel (.xlsx, .xls), JSON',
        content: 'We support the most common data formats. Make sure your data has headers in the first row.',
      },
      {
        title: 'Creating Your First Chart',
        description: 'Step-by-step tutorial',
        content: '1. Click "Upload Data" or drag a file\n2. Select your preferred chart type\n3. Customize colors and labels\n4. Download or share your chart',
      },
    ],
  },
  {
    category: 'Chart Types',
    icon: FileText,
    items: [
      {
        title: 'Bar Charts',
        description: 'Compare values across categories',
        content: 'Best for comparing discrete categories. Supports horizontal and vertical orientation.',
      },
      {
        title: 'Line Charts',
        description: 'Show trends over time',
        content: 'Perfect for time series data. Supports multiple lines and area fills.',
      },
      {
        title: 'Pie Charts',
        description: 'Show proportions of a whole',
        content: 'Ideal for showing percentage breakdowns. Supports doughnut variation.',
      },
      {
        title: 'Scatter Plots',
        description: 'Visualize correlations',
        content: 'Great for finding relationships between two variables.',
      },
    ],
  },
  {
    category: 'Advanced Features',
    icon: Book,
    items: [
      {
        title: 'Data Cleaning',
        description: 'Handle missing values and outliers',
        content: 'Use the data cleaning panel to remove duplicates, fill missing values, and filter outliers.',
      },
      {
        title: 'Annotations',
        description: 'Add notes and highlights to charts',
        content: 'Click the annotation tool to add text, lines, and shapes to emphasize key data points.',
      },
      {
        title: 'Custom Themes',
        description: 'Create your own color schemes',
        content: 'Access the theme editor to create custom color palettes that match your brand.',
      },
      {
        title: 'Export Options',
        description: 'PNG, SVG, PDF, and more',
        content: 'Choose from multiple export formats. SVG provides the best quality for print.',
      },
    ],
  },
];

const shortcuts = [
  { keys: ['Ctrl', 'N'], description: 'New project' },
  { keys: ['Ctrl', 'S'], description: 'Save project' },
  { keys: ['Ctrl', 'E'], description: 'Export chart' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Y'], description: 'Redo' },
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['Ctrl', 'P'], description: 'Open projects' },
  { keys: ['Ctrl', '/'], description: 'Toggle help' },
  { keys: ['Tab'], description: 'Navigate between panels' },
  { keys: ['Esc'], description: 'Close dialogs' },
];

const videoTutorials = [
  {
    title: 'Getting Started with Vizor',
    duration: '3:24',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    url: '#',
  },
  {
    title: 'Advanced Data Visualization',
    duration: '7:15',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    url: '#',
  },
  {
    title: 'Customizing Chart Themes',
    duration: '4:50',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    url: '#',
  },
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const filteredDocs = documentation.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.items.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Help & Documentation
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="docs" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="docs">
              <Book className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="shortcuts">
              <Keyboard className="w-4 h-4 mr-2" />
              Shortcuts
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Video Tutorials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="docs" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              {searchQuery && filteredDocs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(searchQuery ? filteredDocs : documentation).map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.category}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{category.category}</h3>
                        </div>
                        <div className="space-y-2">
                          {category.items.map((item, idx) => (
                            <Card
                              key={idx}
                              className="cursor-pointer hover:bg-accent/50 transition-colors"
                              onClick={() => setSelectedDoc(selectedDoc === item.title ? null : item.title)}
                            >
                              <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-base">{item.title}</CardTitle>
                                    <CardDescription className="text-sm mt-1">
                                      {item.description}
                                    </CardDescription>
                                  </div>
                                  <ChevronRight
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                                      selectedDoc === item.title ? 'rotate-90' : ''
                                    }`}
                                  />
                                </div>
                              </CardHeader>
                              {selectedDoc === item.title && (
                                <CardContent className="pt-0 pb-4 px-4">
                                  <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-line text-sm">
                                    {item.content}
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shortcuts" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-3">
                {shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <kbd
                          key={keyIdx}
                          className="px-2 py-1 text-xs font-semibold bg-muted border rounded"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-4">
                {videoTutorials.map((video, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="relative w-48 h-32 flex-shrink-0 bg-muted">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute bottom-2 right-2">{video.duration}</Badge>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                            <Video className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <CardHeader className="flex-1">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <Button variant="link" className="p-0 h-auto" asChild>
                            <a href={video.url} target="_blank" rel="noopener noreferrer">
                              Watch Tutorial
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        </CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Need more help? Contact us at{' '}
            <a href="mailto:support@Vizor.com" className="text-primary hover:underline">
              support@Vizor.com
            </a>
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
