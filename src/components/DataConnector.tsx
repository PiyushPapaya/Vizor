import { useState } from 'react';
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

  const handleConnect = async () => {
    setLoading(true);

    try {
      let data: ChartData | null = null;

      switch (connectorType) {
        case 'rest_api':
          data = await fetchFromAPI();
          break;
        case 'google_sheets':
          data = await fetchFromGoogleSheets();
          break;
        case 'csv_url':
          data = await fetchFromCSV();
          break;
        case 'airtable':
          data = await fetchFromAirtable();
          break;
      }

      if (data) {
        onDataFetched(data);
        toast.success('Data connected successfully!');
        onClose();
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
    // This would require Google Sheets API key
    // For demo, we'll show the structure
    toast.info('Google Sheets integration requires API key setup');
    throw new Error('Not implemented - requires Google API key');
  };

  const fetchFromCSV = async (): Promise<ChartData> => {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch CSV');
    }

    const text = await response.text();
    return parseCSV(text);
  };

  const fetchFromAirtable = async (): Promise<ChartData> => {
    const url = `https://api.airtable.com/v0/${airtableBase}/${airtableTable}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Airtable');
    }

    const json = await response.json();
    return parseAirtableResponse(json);
  };

  const parseAPIResponse = (json: any): ChartData => {
    // Simple parser - can be enhanced based on API structure
    if (Array.isArray(json)) {
      const labels = json.map((item: any) => item.label || item.name || item.x);
      const values = json.map((item: any) => item.value || item.y || item.count || 0);

      return {
        labels,
        datasets: [{
          id: 'api-data',
          name: 'Data',
          values,
          color: 'hsl(234, 89%, 58%)',
          visible: true,
        }],
      };
    }

    throw new Error('Unsupported API response format');
  };

  const parseCSV = (text: string): ChartData => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const labels: string[] = [];
    const datasetMap: Record<string, number[]> = {};

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      labels.push(values[0]);

      for (let j = 1; j < values.length; j++) {
        const header = headers[j];
        if (!datasetMap[header]) {
          datasetMap[header] = [];
        }
        datasetMap[header].push(parseFloat(values[j]) || 0);
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
    const labels = records.map((r: any) => r.fields.Name || r.id);
    const values = records.map((r: any) => parseFloat(r.fields.Value) || 0);

    return {
      labels,
      datasets: [{
        id: 'airtable-data',
        name: 'Data',
        values,
        color: 'hsl(234, 89%, 58%)',
        visible: true,
      }],
    };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
                  Requires Google Cloud Project with Sheets API enabled
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
            </div>

            <div className="space-y-2">
              <Label>Range</Label>
              <Input
                placeholder="Sheet1!A1:Z1000"
                value={sheetRange}
                onChange={(e) => setSheetRange(e.target.value)}
              />
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
                Must be a publicly accessible CSV file with headers
              </p>
            </div>
          </TabsContent>

          <TabsContent value="airtable" className="space-y-4">
            <div className="space-y-2">
              <Label>Base ID</Label>
              <Input
                placeholder="appXXXXXXXXXXXXXX"
                value={airtableBase}
                onChange={(e) => setAirtableBase(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Table Name</Label>
              <Input
                placeholder="Table 1"
                value={airtableTable}
                onChange={(e) => setAirtableTable(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="keyXXXXXXXXXXXXXX"
                value={airtableApiKey}
                onChange={(e) => setAirtableApiKey(e.target.value)}
              />
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
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={loading} className="flex-1 btn-vizor">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
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
