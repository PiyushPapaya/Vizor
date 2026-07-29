import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Database, Link, FileSpreadsheet, Table, RefreshCw, Zap } from 'lucide-react';
import { ChartData } from '@/types/chart';

interface DataConnectorProps {
  open: boolean;
  onClose: () => void;
  onDataFetched: (data: ChartData) => void;
}

type ConnectorType = 'rest_api' | 'google_sheets' | 'csv_url' | 'airtable';

export default function DataConnector({ open, onClose, onDataFetched }: DataConnectorProps) {
  const [connectorType, setConnectorType] = useState<ConnectorType>('rest_api');
  const [loading, setLoading] = useState(false);

  // REST API State
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiHeaders, setApiHeaders] = useState('');
  const [apiBody, setApiBody] = useState('');

  // Google Sheets State
  const [sheetId, setSheetId] = useState('');
  const [sheetRange, setSheetRange] = useState('A1:Z1000');

  // CSV URL State
  const [csvUrl, setCsvUrl] = useState('');

  // Airtable State
  const [airtableBase, setAirtableBase] = useState('');
  const [airtableTable, setAirtableTable] = useState('');
  const [airtableApiKey, setAirtableApiKey] = useState('');

  // Auto-refresh State
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [isLive, setIsLive] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dispatches the fetch for the currently-selected connector type. Kept as a
  // plain function so it always closes over the latest form inputs.
  const fetchForType = async (): Promise<ChartData | null> => {
    switch (connectorType) {
      case 'rest_api':
        return fetchFromAPI();
      case 'google_sheets':
        return fetchFromGoogleSheets();
      case 'csv_url':
        return fetchFromCSV();
      case 'airtable':
        return fetchFromAirtable();
      default:
        return null;
    }
  };

  const stopLive = useCallback(() => {
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
      refreshTimer.current = null;
    }
    setIsLive(false);
  }, []);

  // Clear the polling timer if the component unmounts.
  useEffect(() => () => stopLive(), [stopLive]);

  const handleClose = useCallback(() => {
    stopLive();
    onClose();
  }, [stopLive, onClose]);

  const handleConnect = async () => {
    setLoading(true);

    try {
      const data = await fetchForType();

      if (data) {
        onDataFetched(data);

        if (autoRefresh) {
          // Keep the connection live: poll on the chosen interval and push
          // fresh data into the chart. The dialog stays open so the timer
          // (which lives with this component) keeps running.
          stopLive();
          const seconds = Math.max(10, refreshInterval);
          refreshTimer.current = setInterval(async () => {
            try {
              const next = await fetchForType();
              if (next) onDataFetched(next);
            } catch (err) {
              // Non-fatal: keep polling, surface a gentle warning.
              toast.warning('Auto-refresh: latest fetch failed, will retry.');
            }
          }, seconds * 1000);
          setIsLive(true);
          toast.success(`Connected — live updates every ${seconds}s`);
        } else {
          toast.success('Data connected successfully!');
          handleClose();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to data source');
    } finally {
      setLoading(false);
    }
  };

  const fetchFromAPI = async (): Promise<ChartData> => {
    const headers: Record<string, string> = {};
    
    if (apiHeaders) {
      try {
        const parsedHeaders = JSON.parse(apiHeaders);
        Object.assign(headers, parsedHeaders);
      } catch (e) {
        throw new Error('Invalid JSON in headers');
      }
    }

    const response = await fetch(apiUrl, {
      method: apiMethod,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: apiMethod === 'POST' ? apiBody : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const json = await response.json();
    return parseAPIResponse(json);
  };

  const fetchFromGoogleSheets = async (): Promise<ChartData> => {
    if (!sheetId || !sheetRange) {
      throw new Error('Please provide Sheet ID and Range');
    }

    try {
      // Using public Google Sheets CSV export URL (works for public sheets)
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&range=${encodeURIComponent(sheetRange)}`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch Google Sheet. Make sure the sheet is publicly accessible.');
      }

      const text = await response.text();
      return parseCSV(text);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch from Google Sheets. Ensure the sheet is public and the ID is correct.');
    }
  };

  const fetchFromCSV = async (): Promise<ChartData> => {
    if (!csvUrl) {
      throw new Error('Please provide a CSV URL');
    }

    try {
      const response = await fetch(csvUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'text/csv, text/plain, application/csv',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }

      const text = await response.text();
      return parseCSV(text);
    } catch (error: any) {
      // If CORS fails, try with a proxy or suggest alternatives
      if (error.message.includes('CORS')) {
        throw new Error('CORS error: The CSV file must allow cross-origin requests, or the server must have CORS enabled.');
      }
      throw new Error(error.message || 'Failed to fetch CSV file');
    }
  };

  const fetchFromAirtable = async (): Promise<ChartData> => {
    if (!airtableBase || !airtableTable || !airtableApiKey) {
      throw new Error('Please provide Base ID, Table Name, and API Key');
    }

    try {
      const url = `https://api.airtable.com/v0/${airtableBase}/${encodeURIComponent(airtableTable)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Airtable API error: ${response.statusText}. ${errorText}`);
      }

      const json = await response.json();
      return parseAirtableResponse(json);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to connect to Airtable. Check your credentials.');
    }
  };

  const parseAPIResponse = (json: any): ChartData => {
    // Handle array of objects with labels and values
    if (Array.isArray(json)) {
      // Case 1: Array of objects with label/value pairs
      if (json.length > 0 && typeof json[0] === 'object') {
        const firstItem = json[0];
        const keys = Object.keys(firstItem);
        
        // Try to identify label and value fields
        const labelKey = keys.find(k => k.toLowerCase().match(/label|name|category|x|date/)) || keys[0];
        const valueKeys = keys.filter(k => k !== labelKey && typeof firstItem[k] === 'number');
        
        if (valueKeys.length === 0) {
          // Try to parse any numeric-looking values
          const valueKey = keys.find(k => k.toLowerCase().match(/value|y|count|amount/)) || keys[1] || keys[0];
          valueKeys.push(valueKey);
        }
        
        const labels = json.map((item: any) => String(item[labelKey] || ''));
        const datasets = valueKeys.map((key, index) => ({
          id: `dataset-${index}`,
          name: key,
          values: json.map((item: any) => parseFloat(item[key]) || 0),
          color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
          visible: true,
        }));

        return { labels, datasets };
      }
    }
    
    // Case 2: Object with data property
    if (json.data && Array.isArray(json.data)) {
      return parseAPIResponse(json.data);
    }
    
    // Case 3: Object with labels and values
    if (json.labels && json.values) {
      return {
        labels: json.labels,
        datasets: [{
          id: 'api-data',
          name: 'Data',
          values: json.values,
          color: 'hsl(199, 89%, 48%)',
          visible: true,
        }],
      };
    }

    throw new Error('Unsupported API response format. Expected an array of objects with label/value pairs.');
  };

  const parseCSV = (text: string): ChartData => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    // Parse CSV handling quoted values
    const parseCSVLine = (line: string): string[] => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };
    
    const headers = parseCSVLine(lines[0]);
    const labels: string[] = [];
    const datasetMap: Record<string, number[]> = {};

    // Initialize datasets
    for (let j = 1; j < headers.length; j++) {
      datasetMap[headers[j]] = [];
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length > 0) {
        labels.push(values[0]);

        for (let j = 1; j < values.length && j < headers.length; j++) {
          const header = headers[j];
          const numValue = parseFloat(values[j]);
          datasetMap[header].push(isNaN(numValue) ? 0 : numValue);
        }
      }
    }

    const datasets = Object.entries(datasetMap).map(([name, values], index) => ({
      id: `dataset-${index}`,
      name,
      values,
      color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
      visible: true,
    }));

    return { labels, datasets };
  };

  const parseAirtableResponse = (json: any): ChartData => {
    const records = json.records || [];
    if (records.length === 0) {
      throw new Error('No records found in Airtable table');
    }

    // Get all field names from first record
    const firstRecord = records[0];
    const fields = firstRecord.fields || {};
    const fieldNames = Object.keys(fields);
    
    if (fieldNames.length === 0) {
      throw new Error('No fields found in Airtable records');
    }

    // Try to identify label and value fields
    const labelField = fieldNames.find(f => f.toLowerCase().match(/name|label|category|title/)) || fieldNames[0];
    const valueFields = fieldNames.filter(f => f !== labelField && typeof fields[f] === 'number');
    
    if (valueFields.length === 0) {
      // Look for any numeric-looking field
      const numericField = fieldNames.find(f => f !== labelField && !isNaN(parseFloat(fields[f])));
      if (numericField) {
        valueFields.push(numericField);
      } else {
        // Default to using all fields except label as values
        valueFields.push(...fieldNames.filter(f => f !== labelField));
      }
    }

    const labels = records.map((r: any) => String(r.fields[labelField] || r.id));
    const datasets = valueFields.map((field, index) => ({
      id: `airtable-${index}`,
      name: field,
      values: records.map((r: any) => parseFloat(r.fields[field]) || 0),
      color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
      visible: true,
    }));

    return { labels, datasets };
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient-vizor">
            <Zap className="h-5 w-5" />
            Connect Live Data Source
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Connect to external data sources for real-time updates
          </p>
        </DialogHeader>

        <Tabs value={connectorType} onValueChange={(v) => setConnectorType(v as ConnectorType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rest_api">
              <Link className="h-4 w-4 mr-2" />
              REST API
            </TabsTrigger>
            <TabsTrigger value="google_sheets">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Sheets
            </TabsTrigger>
            <TabsTrigger value="csv_url">
              <Table className="h-4 w-4 mr-2" />
              CSV URL
            </TabsTrigger>
            <TabsTrigger value="airtable">
              <Database className="h-4 w-4 mr-2" />
              Airtable
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rest_api" className="space-y-4">
            <div className="space-y-2">
              <Label>API Endpoint</Label>
              <Input
                placeholder="https://api.example.com/data"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Method</Label>
                <Select value={apiMethod} onValueChange={(v: any) => setApiMethod(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Headers (JSON)</Label>
              <Textarea
                placeholder='{"Authorization": "Bearer token"}'
                value={apiHeaders}
                onChange={(e) => setApiHeaders(e.target.value)}
                className="font-mono text-xs"
                rows={3}
              />
            </div>

            {apiMethod === 'POST' && (
              <div className="space-y-2">
                <Label>Body (JSON)</Label>
                <Textarea
                  placeholder="{}"
                  value={apiBody}
                  onChange={(e) => setApiBody(e.target.value)}
                  className="font-mono text-xs"
                  rows={4}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="google_sheets" className="space-y-4">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Google Sheets Integration</CardTitle>
                <CardDescription className="text-xs">
                  Import data from public Google Sheets. The sheet must be published to the web or publicly accessible.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-2">
              <Label>Spreadsheet ID</Label>
              <Input
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Find this in the URL: docs.google.com/spreadsheets/d/<strong>[ID]</strong>/edit
              </p>
            </div>

            <div className="space-y-2">
              <Label>Range (Optional)</Label>
              <Input
                placeholder="Sheet1!A1:Z1000 or leave empty for all data"
                value={sheetRange}
                onChange={(e) => setSheetRange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Specify a range like "A1:D100" or leave empty to import all data
              </p>
            </div>
          </TabsContent>

          <TabsContent value="csv_url" className="space-y-4">
            <div className="space-y-2">
              <Label>CSV URL</Label>
              <Input
                placeholder="https://example.com/data.csv"
                value={csvUrl}
                onChange={(e) => setCsvUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Must be a publicly accessible CSV file with headers. Supports direct CSV URLs or raw GitHub URLs.
              </p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4 text-xs space-y-2">
                <p className="font-semibold">Example URLs:</p>
                <p className="text-muted-foreground">• https://example.com/data.csv</p>
                <p className="text-muted-foreground">• https://raw.githubusercontent.com/user/repo/main/data.csv</p>
                <p className="text-muted-foreground">• https://gist.githubusercontent.com/.../file.csv</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="airtable" className="space-y-4">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Airtable Integration</CardTitle>
                <CardDescription className="text-xs">
                  Connect to your Airtable base. You'll need an API key from your Airtable account settings.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-2">
              <Label>Base ID</Label>
              <Input
                placeholder="appXXXXXXXXXXXXXX"
                value={airtableBase}
                onChange={(e) => setAirtableBase(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Find this in your base URL: airtable.com/<strong>[BASE_ID]</strong>/...
              </p>
            </div>

            <div className="space-y-2">
              <Label>Table Name</Label>
              <Input
                placeholder="Table 1"
                value={airtableTable}
                onChange={(e) => setAirtableTable(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The name of the table you want to import
              </p>
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="keyXXXXXXXXXXXXXX"
                value={airtableApiKey}
                onChange={(e) => setAirtableApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Create an API key in your Airtable account settings
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Refresh</Label>
              <p className="text-xs text-muted-foreground">Automatically fetch new data</p>
            </div>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>

          {autoRefresh && (
            <div className="space-y-2">
              <Label>Refresh Interval (seconds)</Label>
              <Input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 60)}
                min={10}
              />
            </div>
          )}

          {isLive && (
            <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                Live — updating every {Math.max(10, refreshInterval)}s
              </div>
              <Button variant="outline" size="sm" onClick={stopLive} className="h-7 text-xs">
                Stop
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            {isLive ? 'Done' : 'Cancel'}
          </Button>
          <Button onClick={handleConnect} disabled={loading} className="flex-1 btn-vizor">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isLive ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh now
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Connect
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
