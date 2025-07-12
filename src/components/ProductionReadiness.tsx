import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Database, 
  Shield, 
  Globe, 
  Settings,
  Zap,
  RefreshCw
} from 'lucide-react';

interface ConfigValidation {
  timestamp: string;
  environment: string;
  overall_status: 'ready' | 'needs_attention';
  production_ready: boolean;
  total_recommendations: number;
  validation: {
    database: {
      status: string;
      url_set: boolean;
      prisma_url_set: boolean;
    };
    authentication: {
      status: string;
      jwt_secret_set: boolean;
      jwt_secret_length: number;
    };
    application: {
      app_url_set: boolean;
      app_url: string;
      node_env: string;
    };
    features: {
      clinic_registration: boolean;
      emr_integration: boolean;
      analytics: boolean;
    };
  };
  security: {
    https_enabled: boolean;
    jwt_secret_secure: boolean;
    environment_production: boolean;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    message: string;
    action: string;
  }>;
}

const ProductionReadiness = () => {
  const [config, setConfig] = useState<ConfigValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigValidation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data?type=config-validation');
      const result = await response.json();

      if (result.success) {
        setConfig(result.data);
      } else {
        setError(result.error || 'Failed to fetch configuration');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigValidation();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'needs_attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
      case 'ready':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ready</Badge>;
      case 'needs_attention':
        return <Badge variant="destructive">Needs Attention</Badge>;
      case 'missing':
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking production readiness...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!config) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No configuration data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Readiness</h1>
          <p className="text-muted-foreground">
            Environment: {config.environment} • Last checked: {new Date(config.timestamp).toLocaleString()}
          </p>
        </div>
        <Button onClick={fetchConfigValidation} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getStatusIcon(config.overall_status)}
            <span className="ml-2">Overall Status</span>
            {getStatusBadge(config.overall_status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {config.production_ready ? '✅' : '⚠️'}
              </div>
              <div className="text-sm text-muted-foreground">
                Production Ready: {config.production_ready ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {config.total_recommendations}
              </div>
              <div className="text-sm text-muted-foreground">
                Recommendations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {config.environment}
              </div>
              <div className="text-sm text-muted-foreground">
                Environment
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Database URL</span>
              {getStatusBadge(config.validation.database.status)}
            </div>
            <div className="flex items-center justify-between">
              <span>Prisma URL</span>
              <Badge variant={config.validation.database.prisma_url_set ? "default" : "destructive"}>
                {config.validation.database.prisma_url_set ? 'Set' : 'Missing'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Authentication & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>JWT Secret</span>
              {getStatusBadge(config.validation.authentication.status)}
            </div>
            <div className="flex items-center justify-between">
              <span>HTTPS Enabled</span>
              <Badge variant={config.security.https_enabled ? "default" : "destructive"}>
                {config.security.https_enabled ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>JWT Secure</span>
              <Badge variant={config.security.jwt_secret_secure ? "default" : "destructive"}>
                {config.security.jwt_secret_secure ? 'Yes' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Application Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>App URL</span>
              <Badge variant={config.validation.application.app_url_set ? "default" : "destructive"}>
                {config.validation.application.app_url_set ? 'Set' : 'Missing'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {config.validation.application.app_url}
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Feature Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Clinic Registration</span>
              <Badge variant={config.validation.features.clinic_registration ? "default" : "secondary"}>
                {config.validation.features.clinic_registration ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>EMR Integration</span>
              <Badge variant={config.validation.features.emr_integration ? "default" : "secondary"}>
                {config.validation.features.emr_integration ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Analytics</span>
              <Badge variant={config.validation.features.analytics ? "default" : "secondary"}>
                {config.validation.features.analytics ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {config.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Recommendations ({config.recommendations.length})
            </CardTitle>
            <CardDescription>
              Actions to improve your production setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {config.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="mr-2">
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{rec.category}</span>
                      </div>
                      <p className="text-sm mb-2">{rec.message}</p>
                      <p className="text-xs font-medium">Action: {rec.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionReadiness;
