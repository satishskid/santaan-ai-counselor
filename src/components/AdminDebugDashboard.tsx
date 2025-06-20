import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  Server, 
  Settings, 
  Globe,
  Clock,
  MemoryStick,
  Wifi,
  Shield,
  Bug,
  Terminal,
  FileText,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DiagnosticData {
  timestamp: string;
  overall_status: string;
  response_time: number;
  self_test: any;
  environment: any;
  system_info: any;
  api_endpoints_test: any;
  database_test: any;
  file_system_test: any;
  errors: string[];
  warnings: string[];
  debug_info: any;
}

const AdminDebugDashboard = () => {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/system-diagnostics');
      const data = await response.json();
      
      if (data.success || data.data) {
        setDiagnosticData(data.data);
      } else {
        // Even failed responses might contain diagnostic data
        setDiagnosticData(data);
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to fetch diagnostics:', error);
      // Create minimal diagnostic data showing the connection failure
      setDiagnosticData({
        timestamp: new Date().toISOString(),
        overall_status: 'critical',
        response_time: 0,
        self_test: { api_reachable: false },
        environment: {},
        system_info: {},
        api_endpoints_test: {},
        database_test: { status: 'unknown' },
        file_system_test: { status: 'unknown' },
        errors: ['Cannot connect to diagnostic API - this indicates a critical system failure'],
        warnings: [],
        debug_info: { connection_error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const testSpecificEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          data: data,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchDiagnostics, 15000); // Every 15 seconds for admin
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'working':
      case 'connected':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
      case 'error':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'healthy' || status === 'working' || status === 'connected' || status === 'success' ? 'default' :
                   status === 'warning' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading && !diagnosticData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">🔧 Admin Debug Dashboard</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Bug className="h-8 w-8 animate-pulse mx-auto mb-4" />
              <p>Running comprehensive system diagnostics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">🔧 Admin Debug Dashboard</h1>
            {diagnosticData && getStatusIcon(diagnosticData.overall_status)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Wifi className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-green-500' : 'text-gray-500'}`} />
              Auto Debug {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            <Button onClick={fetchDiagnostics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Run Diagnostics
            </Button>
          </div>
        </div>

        {diagnosticData && (
          <>
            {/* Critical Status Alert */}
            {diagnosticData.overall_status === 'critical' && (
              <Alert className="mb-6 border-red-500">
                <XCircle className="h-4 w-4" />
                <AlertTitle>🚨 Critical System Issues Detected</AlertTitle>
                <AlertDescription>
                  The system has critical issues that require immediate attention. Check the errors below for specific problems.
                </AlertDescription>
              </Alert>
            )}

            {/* Overall Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🔍 System Diagnostic Summary</span>
                  {getStatusBadge(diagnosticData.overall_status)}
                </CardTitle>
                <CardDescription>
                  Last diagnostic: {lastChecked?.toLocaleString()} • Response time: {diagnosticData.response_time}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diagnosticData.errors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Critical Errors ({diagnosticData.errors.length})
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {diagnosticData.errors.map((error, index) => (
                          <li key={index} className="text-red-600 text-sm">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {diagnosticData.warnings.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-yellow-600 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Warnings ({diagnosticData.warnings.length})
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {diagnosticData.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-600 text-sm">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {diagnosticData.errors.length === 0 && diagnosticData.warnings.length === 0 && (
                  <p className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    All systems operational - no issues detected
                  </p>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
                <TabsTrigger value="endpoints">API Tests</TabsTrigger>
                <TabsTrigger value="debug">Debug Info</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Self Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Self Test
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>API Reachable:</span>
                          {getStatusIcon(diagnosticData.self_test?.api_reachable ? 'success' : 'error')}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>CORS Enabled:</span>
                          {getStatusIcon(diagnosticData.self_test?.cors_enabled ? 'success' : 'error')}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Method Handling:</span>
                          {getStatusIcon(diagnosticData.self_test?.method_handling === 'working' ? 'success' : 'warning')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Server className="h-5 w-5 mr-2" />
                        System Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span>{formatUptime(diagnosticData.system_info?.uptime_seconds || 0)}</span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Memory:</span>
                            <span>{diagnosticData.system_info?.memory_usage?.percentage || 0}%</span>
                          </div>
                          <Progress value={diagnosticData.system_info?.memory_usage?.percentage || 0} className="h-2" />
                        </div>
                        <div className="flex justify-between">
                          <span>Node.js:</span>
                          <span>{diagnosticData.system_info?.node_version || 'Unknown'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* File System */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        File System
                        {getStatusIcon(diagnosticData.file_system_test?.status || 'unknown')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          {getStatusBadge(diagnosticData.file_system_test?.status || 'unknown')}
                        </div>
                        <div className="flex justify-between">
                          <span>API Directory:</span>
                          <span>{diagnosticData.file_system_test?.api_directory_exists ? '✅ Found' : '❌ Missing'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Files Found:</span>
                          <span>{diagnosticData.file_system_test?.total_files || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="database" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Database Diagnostics
                      {getStatusIcon(diagnosticData.database_test?.status || 'unknown')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Connection Status:</span>
                        {getStatusBadge(diagnosticData.database_test?.status || 'unknown')}
                      </div>
                      {diagnosticData.database_test?.response_time && (
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span>{diagnosticData.database_test.response_time}ms</span>
                        </div>
                      )}
                      <div>
                        <span>Message:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {diagnosticData.database_test?.message || 'No message available'}
                        </p>
                      </div>
                      {diagnosticData.database_test?.error_type && (
                        <div>
                          <span>Error Type:</span>
                          <p className="text-sm text-red-600 mt-1">
                            {diagnosticData.database_test.error_type}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="environment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Environment Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Core Variables</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>NODE_ENV:</span>
                              <Badge variant="outline">{diagnosticData.environment?.node_env || 'undefined'}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>VERCEL_ENV:</span>
                              <Badge variant="outline">{diagnosticData.environment?.vercel_env || 'undefined'}</Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Required Variables</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>DATABASE_URL:</span>
                              {diagnosticData.environment?.database_url_present ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                <XCircle className="h-4 w-4 text-red-500" />
                              }
                            </div>
                            <div className="flex justify-between items-center">
                              <span>JWT_SECRET:</span>
                              {diagnosticData.environment?.jwt_secret_present ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                <XCircle className="h-4 w-4 text-red-500" />
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">All Environment Variables Found</h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosticData.environment?.all_env_vars?.map((varName: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {varName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="endpoints" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      API Endpoint Testing
                    </CardTitle>
                    <CardDescription>
                      Test individual API endpoints to identify specific issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(diagnosticData.api_endpoints_test || {}).map(([key, endpoint]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {endpoint.path}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => testSpecificEndpoint(endpoint.path)}
                            >
                              <Terminal className="h-3 w-3 mr-1" />
                              Test
                            </Button>
                            {testResults[endpoint.path] && (
                              <Badge variant={testResults[endpoint.path].status === 'success' ? 'default' : 'destructive'}>
                                {testResults[endpoint.path].status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="debug" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bug className="h-5 w-5 mr-2" />
                      Debug Information
                    </CardTitle>
                    <CardDescription>
                      Raw diagnostic data for developer debugging
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Information</h4>
                        <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(diagnosticData.debug_info, null, 2)}
                        </pre>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Full Diagnostic Data</h4>
                        <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-96">
                          {JSON.stringify(diagnosticData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDebugDashboard;
