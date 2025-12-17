import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  Zap, 
  Upload, 
  BarChart3, 
  Palette, 
  Download, 
  Share2,
  FileText,
  Table,
  Edit,
  Save,
  Keyboard,
  Shield,
  Sparkles,
  Database,
  Settings,
  Users,
  LineChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { updateMetaTags } from '@/lib/seo';

export default function Documentation() {
  useEffect(() => {
    window.scrollTo(0, 0);
    updateMetaTags({
      title: 'Documentation - Vizor | Complete Guide',
      description: 'Complete documentation for Vizor - Learn how to create stunning visualizations, import data, customize charts, and export your work.',
      keywords: ['Vizor documentation', 'chart creation guide', 'data visualization tutorial', 'CSV import help']
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">Documentation</span>
            </div>
          </div>
          <Link to="/app">
            <Button>
              Launch Vizor
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-2">
            <BookOpen className="w-4 h-4 mr-2 inline" />
            Complete Guide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Vizor Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to master data visualization — from your first chart to advanced customization
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-12 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <CardTitle className="text-3xl">Quick Start</CardTitle>
            </div>
            <CardDescription className="text-base">Get up and running in 60 seconds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-card/50">
                <div className="font-bold text-2xl text-primary mb-2">1</div>
                <p className="font-semibold mb-1">Import Data</p>
                <p className="text-sm text-muted-foreground">Upload CSV, Excel, or paste data</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/50">
                <div className="font-bold text-2xl text-primary mb-2">2</div>
                <p className="font-semibold mb-1">Choose Chart</p>
                <p className="text-sm text-muted-foreground">Select from 20+ chart types</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/50">
                <div className="font-bold text-2xl text-primary mb-2">3</div>
                <p className="font-semibold mb-1">Customize</p>
                <p className="text-sm text-muted-foreground">Colors, labels, styling</p>
              </div>
              <div className="p-4 border rounded-lg bg-card/50">
                <div className="font-bold text-2xl text-primary mb-2">4</div>
                <p className="font-semibold mb-1">Export</p>
                <p className="text-sm text-muted-foreground">PNG, SVG, or PDF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Documentation Sections */}
        <div className="space-y-12">
          {/* Importing Data */}
          <section id="importing-data">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Importing Data</h2>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Supported File Formats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold mb-2">📄 CSV Files (.csv)</p>
                      <p className="text-sm text-muted-foreground">Comma-separated values — the most common format. Click "Import Data" → "Upload CSV" and select your file.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold mb-2">📊 Excel Files (.xlsx, .xls)</p>
                      <p className="text-sm text-muted-foreground">Microsoft Excel spreadsheets. Vizor automatically detects the first sheet and imports all rows.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold mb-2">📋 TSV Files (.tsv)</p>
                      <p className="text-sm text-muted-foreground">Tab-separated values. Perfect for data copied from spreadsheet applications.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold mb-2">🔧 JSON Files (.json)</p>
                      <p className="text-sm text-muted-foreground">JavaScript Object Notation. Supports both array of objects and nested structures.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Other Import Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="font-semibold">✂️ Paste from Clipboard</p>
                    <p className="text-sm text-muted-foreground">Copy data from Excel, Google Sheets, or any spreadsheet → Click "Paste Data" → Vizor auto-detects columns and rows.</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-semibold">✏️ Manual Entry</p>
                    <p className="text-sm text-muted-foreground">Click "Create Dataset" → Use the built-in data editor to enter values manually. Perfect for small datasets or quick demos.</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-semibold">🔗 Google Sheets Integration (Coming Soon)</p>
                    <p className="text-sm text-muted-foreground">Connect live Google Sheets for real-time data sync.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Pro Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Your data must have column headers in the first row. Vizor uses these as labels for axes, legends, and tooltips.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Chart Types */}
          <section id="chart-types">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Chart Types</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Bar Charts</CardTitle>
                  <CardDescription>Compare values across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Best for: Sales by region, survey responses, category comparisons</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Vertical & Horizontal orientations</li>
                    <li>• Stacked & Grouped modes</li>
                    <li>• Custom bar colors & spacing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📈 Line Charts</CardTitle>
                  <CardDescription>Show trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Best for: Stock prices, temperature trends, website traffic</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Smooth or straight lines</li>
                    <li>• Multiple data series</li>
                    <li>• Area fill under curves</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🥧 Pie & Donut Charts</CardTitle>
                  <CardDescription>Show proportions and percentages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Best for: Market share, budget breakdown, demographics</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Percentage or value labels</li>
                    <li>• Exploded slices</li>
                    <li>• Custom segment colors</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📍 Scatter Plots</CardTitle>
                  <CardDescription>Explore relationships between variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Best for: Correlations, clustering, outlier detection</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Trend lines & regression</li>
                    <li>• Color-coded categories</li>
                    <li>• Variable bubble sizes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Area Charts</CardTitle>
                  <CardDescription>Emphasize magnitude of change</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Best for: Cumulative values, volume trends, comparisons</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Stacked area fills</li>
                    <li>• Gradient backgrounds</li>
                    <li>• Opacity controls</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 More Chart Types</CardTitle>
                  <CardDescription>Specialized visualizations</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Radar Charts • Heatmaps • Treemaps • Box Plots • Histograms • Funnel Charts • Gauge Charts • Candlestick Charts • Waterfall Charts</p>
                  <p className="text-xs">...and more being added regularly!</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Customization */}
          <section id="customization">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Customization</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎨 Colors & Themes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Pre-built Color Palettes</p>
                    <p className="text-sm text-muted-foreground mb-3">Choose from 10+ professionally designed color schemes: Ocean, Sunset, Forest, Modern, Pastel, Bold, and more.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Custom Colors</p>
                    <p className="text-sm text-muted-foreground mb-3">Click any color swatch to open the color picker. Set specific hex codes, RGB values, or use the intuitive color wheel.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes. Charts automatically adjust for optimal contrast and readability.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📝 Labels & Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold mb-1">Chart Title</p>
                      <p className="text-sm text-muted-foreground">Main heading displayed above your chart</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Axis Labels</p>
                      <p className="text-sm text-muted-foreground">X-axis and Y-axis titles</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Data Labels</p>
                      <p className="text-sm text-muted-foreground">Show values directly on chart elements</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Legend</p>
                      <p className="text-sm text-muted-foreground">Position, hide/show, custom entries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚙️ Advanced Styling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">• <strong>Grid Lines:</strong> Show/hide, customize color and opacity</p>
                  <p className="text-sm text-muted-foreground">• <strong>Margins & Padding:</strong> Adjust spacing around chart</p>
                  <p className="text-sm text-muted-foreground">• <strong>Font Styles:</strong> Size, weight, family for all text elements</p>
                  <p className="text-sm text-muted-foreground">• <strong>Animations:</strong> Enable smooth transitions and hover effects</p>
                  <p className="text-sm text-muted-foreground">• <strong>Background:</strong> Solid colors, gradients, or transparent</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Data Editing */}
          <section id="data-editing">
            <div className="flex items-center gap-3 mb-6">
              <Edit className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Editing Data</h2>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="font-semibold mb-2">📊 Spreadsheet-Style Editor</p>
                  <p className="text-sm text-muted-foreground">Click the "Edit Data" button to open the built-in data table. Edit any cell by clicking on it — changes update your chart in real-time.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">➕ Add Rows & Columns</p>
                  <p className="text-sm text-muted-foreground">Use the + buttons to add new data points or categories. Perfect for expanding your dataset without re-importing.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">🗑️ Delete Data</p>
                  <p className="text-sm text-muted-foreground">Select rows or columns and press Delete key, or right-click for context menu options.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">↕️ Sort & Filter</p>
                  <p className="text-sm text-muted-foreground">Click column headers to sort ascending/descending. Use filters to temporarily hide data without deleting it.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">🔄 Undo/Redo</p>
                  <p className="text-sm text-muted-foreground">Made a mistake? Press Ctrl+Z (Windows) or Cmd+Z (Mac) to undo changes. Ctrl+Shift+Z to redo.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-12" />

          {/* Exporting */}
          <section id="exporting">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Exporting Charts</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🖼️ PNG Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Raster image format — perfect for presentations, reports, and social media.</p>
                  <p className="text-xs text-muted-foreground">Best for: PowerPoint, Word, emails</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📐 SVG Vector</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Scalable vector graphics — infinitely resizable without quality loss.</p>
                  <p className="text-xs text-muted-foreground">Best for: Print materials, logos, large displays</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📄 PDF Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Portable document format — ideal for professional reports and sharing.</p>
                  <p className="text-xs text-muted-foreground">Best for: Reports, documentation, archiving</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Export Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">• <strong>Resolution:</strong> Choose from standard (1x), high (2x), or ultra (4x) DPI for print quality</p>
                <p className="text-sm text-muted-foreground">• <strong>Background:</strong> Include or remove background color (transparent PNGs supported)</p>
                <p className="text-sm text-muted-foreground">• <strong>Dimensions:</strong> Custom width and height, or use presets (Social Media, Presentation, A4)</p>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-12" />

          {/* Saving & Sharing */}
          <section id="saving-sharing">
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Saving & Sharing</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold mb-1">💾 Auto-Save</p>
                    <p className="text-sm text-muted-foreground">Projects are automatically saved to your browser's local storage. No account required — your work is always safe.</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">☁️ Cloud Sync (Coming Soon)</p>
                    <p className="text-sm text-muted-foreground">Create a free account to sync projects across devices and access from anywhere.</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">📁 Export Project</p>
                    <p className="text-sm text-muted-foreground">Download your entire project as a .vizor file. Reopen it later or share with collaborators.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Collaboration (Coming Soon)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Share projects with team members and collaborate in real-time:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Generate shareable links with view or edit permissions</li>
                    <li>• Team workspaces for organization-wide projects</li>
                    <li>• Comment and annotation tools for feedback</li>
                    <li>• Version history and change tracking</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Keyboard Shortcuts */}
          <section id="keyboard-shortcuts">
            <div className="flex items-center gap-3 mb-6">
              <Keyboard className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Keyboard Shortcuts</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Save project</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + S</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New project</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + N</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Open project</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + O</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Export chart</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + E</code>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Editing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Undo</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + Z</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Redo</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + Shift + Z</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delete selection</span>
                    <code className="bg-muted px-2 py-1 rounded">Delete</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Select all</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + A</code>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">View</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toggle dark mode</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + D</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zoom in</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + +</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zoom out</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + -</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reset zoom</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + 0</code>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Show shortcuts</span>
                    <code className="bg-muted px-2 py-1 rounded">?</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Open help</span>
                    <code className="bg-muted px-2 py-1 rounded">F1</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Search commands</span>
                    <code className="bg-muted px-2 py-1 rounded">Ctrl + K</code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Privacy & Security */}
          <section id="privacy">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Privacy & Security</h2>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Your Data Stays Private
                  </p>
                  <p className="text-sm text-muted-foreground">All data processing happens in your browser. Your uploaded files and charts never touch our servers. We don't store, collect, or have access to your data.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">🔒 Local Storage</p>
                  <p className="text-sm text-muted-foreground">Saved projects are stored in your browser's local storage on your device only. Clear your browser data to remove saved projects.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">📊 No Tracking</p>
                  <p className="text-sm text-muted-foreground">We don't use analytics or tracking cookies. Your usage patterns and data remain completely private.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">🌐 Open Source</p>
                  <p className="text-sm text-muted-foreground">Vizor's code is transparent and auditable. Review our security practices and contribute on GitHub.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-12" />

          {/* Best Practices */}
          <section id="best-practices">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Best Practices</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Choosing the Right Chart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• <strong>Comparisons:</strong> Use bar charts (categories) or line charts (time series)</p>
                  <p>• <strong>Proportions:</strong> Pie or donut charts work best for parts of a whole</p>
                  <p>• <strong>Relationships:</strong> Scatter plots reveal correlations between variables</p>
                  <p>• <strong>Distributions:</strong> Histograms or box plots show data spread</p>
                  <p>• <strong>Trends:</strong> Line or area charts highlight changes over time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎨 Design Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• <strong>Keep it simple:</strong> Remove unnecessary gridlines, labels, and decorations</p>
                  <p>• <strong>Use color purposefully:</strong> Highlight key data points, maintain consistency</p>
                  <p>• <strong>Choose readable fonts:</strong> Size 12+ for labels, 16+ for titles</p>
                  <p>• <strong>Provide context:</strong> Add clear titles, axis labels, and legends</p>
                  <p>• <strong>Consider accessibility:</strong> Use colorblind-friendly palettes, high contrast</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📈 Data Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• <strong>Clean your data:</strong> Remove duplicates, fix typos, handle missing values</p>
                  <p>• <strong>Use consistent formats:</strong> Dates, numbers, and categories should follow patterns</p>
                  <p>• <strong>Include headers:</strong> First row should contain clear column names</p>
                  <p>• <strong>Sort meaningfully:</strong> Arrange data logically (chronological, alphabetical, by value)</p>
                  <p>• <strong>Verify accuracy:</strong> Double-check numbers before finalizing visualizations</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Support */}
          <section id="support">
            <div className="flex items-center gap-3 mb-6">
              <LineChart className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Need More Help?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>📧 Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Have questions or need assistance? Our team is here to help.</p>
                  <a href="mailto:help@vizor.app">
                    <Button className="w-full">
                      Contact Support
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>💬 Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Join our community to share tips, ask questions, and showcase your work.</p>
                  <Button variant="outline" className="w-full">
                    Join Discord (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Back to Top */}
        <div className="mt-16 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top ↑
          </Button>
        </div>
      </div>
    </div>
  );
}
