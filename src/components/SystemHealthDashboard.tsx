import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HealthCheckData {
  timestamp: string;
  overall_status: 'healthy' | 'warning' | 'unhealthy';
  response_time: number;
  components: {
    database: {
      status: string;
      message: string;
      response_time: number;
    };
    environment: {
      status: string;
      variables: Record<string, any>;
      missing: string[];
      warnings: string[];
    };
    api_endpoints: Record<string, {
      path: string;
      method: string;
      status: string;
      description: string;
    }>;
    system: {
      status: string;
      uptime: number;
      memory: {
        used_mb: number;
        total_mb: number;
        usage_percentage: number;
      };
      node_version: string;
      platform: string;
      environment: string;
    };
  };
  errors: string[];
  warnings: string[];
}

const SystemHealthDashboard = () => {
  const [healthData, setHealthData] = useState<HealthCheckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system-health');
      const data = await response.json();
      
      if (data.success) {
        setHealthData(data.data);
      } else {
        setHealthData(data); // Error response might still contain partial health data
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      // Set minimal error state
      setHealthData({
        timestamp: new Date().toISOString(),
        overall_status: 'unhealthy',
        response_time: 0,
        components: {
          database: { status: 'unknown', message: 'Unable to check', response_time: 0 },
          environment: { status: 'unknown', variables: {}, missing: [], warnings: [] },
          api_endpoints: {},
          system: { status: 'unknown', uptime: 0, memory: { used_mb: 0, total_mb: 0, usage_percentage: 0 }, node_version: '', platform: '', environment: '' }
        },
        errors: ['Failed to connect to health check API'],
        warnings: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'available':
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy':
      case 'disconnected':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'healthy' || status === 'connected' || status === 'available' ? 'default' :
                   status === 'warning' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading && !healthData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">System Health Check</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Running system health check...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">System Health Check</h1>
            {healthData && getStatusIcon(healthData.overall_status)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Wifi className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-green-500' : 'text-gray-500'}`} />
              Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            <Button onClick={fetchHealthData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {healthData && (
          <>
            {/* Overall Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall System Status</span>
                  {getStatusBadge(healthData.overall_status)}
                </CardTitle>
                <CardDescription>
                  Last checked: {lastChecked?.toLocaleString()} • Response time: {healthData.response_time}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {healthData.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {healthData.errors.map((error, index) => (
                        <li key={index} className="text-red-600 text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {healthData.warnings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-2">Warnings:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {healthData.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-600 text-sm">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {healthData.errors.length === 0 && healthData.warnings.length === 0 && (
                  <p className="text-green-600">All systems operational</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Database
                    {getStatusIcon(healthData.components.database.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(healthData.components.database.status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span>{healthData.components.database.response_time}ms</span>
                    </div>
                    <div>
                      <span>Message:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {healthData.components.database.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    System Information
                    {getStatusIcon(healthData.components.system.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span>{formatUptime(healthData.components.system.uptime)}</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Memory Usage:</span>
                        <span>{healthData.components.system.memory.usage_percentage}%</span>
                      </div>
                      <Progress value={healthData.components.system.memory.usage_percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {healthData.components.system.memory.used_mb}MB / {healthData.components.system.memory.total_mb}MB
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span>Node.js:</span>
                      <span>{healthData.components.system.node_version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Environment:</span>
                      <span>{healthData.components.system.environment}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Environment Variables */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Environment Variables
                  {getStatusIcon(healthData.components.environment.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(healthData.components.environment.variables).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-mono text-sm">{key}</span>
                      <div className="flex items-center space-x-2">
                        {value.present ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">
                              {value.masked || value.value || 'Set'}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">Not Set</span>
                            {value.optional && <Badge variant="outline" className="text-xs">Optional</Badge>}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  API Endpoints
                </CardTitle>
                <CardDescription>
                  Available API endpoints in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(healthData.components.api_endpoints).map(([key, endpoint]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {endpoint.method} {endpoint.path}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(endpoint.status)}
                        {getStatusBadge(endpoint.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Test specific components or troubleshoot issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Test Settings Page
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => window.open('/api/health', '_blank')}>
                    <Database className="h-4 w-4 mr-2" />
                    Test Health API
                  </Button>
                  <Button variant="outline" onClick={() => window.open('/api/system-health', '_blank')}>
                    <Shield className="h-4 w-4 mr-2" />
                    View Raw Health Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SystemHealthDashboard;
