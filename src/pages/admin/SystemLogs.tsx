import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Info, AlertTriangle, XCircle, Search, Trash2, Download } from 'lucide-react';

interface SystemLog {
  id: string;
  user_id?: string;
  user_email?: string;
  message: string;
  level: string;
  component?: string;
  stack_trace?: string;
  created_at: string;
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [components, setComponents] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (levelFilter !== 'all') {
        query = query.eq('level', levelFilter);
      }

      if (componentFilter !== 'all') {
        query = query.eq('component', componentFilter);
      }

      if (searchTerm) {
        query = query.or(`message.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);

      // Extract unique components for filter
      const uniqueComponents = [...new Set((data || [])
        .map(log => log.component)
        .filter(Boolean))] as string[];
      setComponents(uniqueComponents);

    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('logs')
        .delete()
        .gte('created_at', '1970-01-01'); // Delete all logs

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All logs have been cleared",
      });
      fetchLogs();
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast({
        title: "Error",
        description: "Failed to clear logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Component', 'User Email', 'Message'],
      ...logs.map(log => [
        new Date(log.created_at).toISOString(),
        log.level,
        log.component || '',
        log.user_email || '',
        log.message.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and troubleshoot issues</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportLogs} disabled={logs.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="destructive" onClick={handleClearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by search term, level, and component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={componentFilter} onValueChange={setComponentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All components" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Components</SelectItem>
                {components.map((component) => (
                  <SelectItem key={component} value={component}>
                    {component}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchLogs} disabled={loading}>
              {loading ? 'Loading...' : 'Apply Filters'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <div className="space-y-4">
        {loading && !logs.length ? (
          <div className="text-center py-8">Loading logs...</div>
        ) : logs.map((log) => (
          <Card key={log.id} className={`${log.level === 'error' ? 'border-red-200' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getLevelIcon(log.level)}
                  <Badge variant={getLevelBadgeVariant(log.level)}>
                    {log.level.toUpperCase()}
                  </Badge>
                  {log.component && (
                    <Badge variant="outline">{log.component}</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-2">{log.message}</p>
              {log.user_email && (
                <p className="text-xs text-muted-foreground mb-2">
                  User: {log.user_email}
                </p>
              )}
              {log.stack_trace && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Stack Trace
                  </summary>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                    {log.stack_trace}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && logs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || levelFilter !== 'all' || componentFilter !== 'all' 
                ? 'No logs found matching your filters.' 
                : 'No system logs found.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemLogs;