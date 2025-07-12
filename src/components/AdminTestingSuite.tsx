import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Target,
  TrendingUp,
  FileText,
  Zap,
  Shield,
  Database,
  Globe,
  Settings,
  Bug
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestResult {
  test_name: string;
  category: string;
  status: 'passed' | 'failed' | 'running' | 'skipped';
  details: string;
  error: string | null;
  execution_time: number;
  critical: boolean;
}

interface TestSuiteData {
  timestamp: string;
  test_suite_version: string;
  execution_time: number;
  overall_status: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  skipped_tests: number;
  test_categories: {
    api_endpoints: { status: string; passed: number; failed: number; total: number; tests: TestResult[] };
    database: { status: string; passed: number; failed: number; total: number; tests: TestResult[] };
    authentication: { status: string; passed: number; failed: number; total: number; tests: TestResult[] };
    file_system: { status: string; passed: number; failed: number; total: number; tests: TestResult[] };
    environment: { status: string; passed: number; failed: number; total: number; tests: TestResult[] };
  };
  detailed_results: TestResult[];
  recommendations: Array<{
    priority: string;
    category: string;
    title: string;
    description: string;
    action: string;
  }>;
  system_health_score: number;
}

const AdminTestingSuite = () => {
  const [testData, setTestData] = useState<TestSuiteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [autoRun, setAutoRun] = useState(false);

  const runTestSuite = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data?type=testing-suite');
      const data = await response.json();
      
      if (data.success) {
        setTestData(data.data);
      } else {
        // Even failed responses might contain test data
        setTestData(data.data || null);
      }
      setLastRun(new Date());
    } catch (error) {
      console.error('Failed to run test suite:', error);
      // Create minimal error state
      setTestData({
        timestamp: new Date().toISOString(),
        test_suite_version: '1.0.0',
        execution_time: 0,
        overall_status: 'error',
        total_tests: 0,
        passed_tests: 0,
        failed_tests: 0,
        skipped_tests: 0,
        test_categories: {
          api_endpoints: { status: 'error', passed: 0, failed: 0, total: 0, tests: [] },
          database: { status: 'error', passed: 0, failed: 0, total: 0, tests: [] },
          authentication: { status: 'error', passed: 0, failed: 0, total: 0, tests: [] },
          file_system: { status: 'error', passed: 0, failed: 0, total: 0, tests: [] },
          environment: { status: 'error', passed: 0, failed: 0, total: 0, tests: [] }
        },
        detailed_results: [],
        recommendations: [{
          priority: 'high',
          category: 'connection',
          title: 'Testing Suite Connection Failed',
          description: 'Unable to connect to the testing API endpoint',
          action: 'Check if /api/admin/testing-suite endpoint is accessible'
        }],
        system_health_score: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRun) {
      interval = setInterval(runTestSuite, 60000); // Every minute for auto-run
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRun]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'skipped':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'passed' ? 'default' :
                   status === 'failed' || status === 'error' ? 'destructive' :
                   status === 'running' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api_endpoints':
        return <Globe className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'authentication':
        return <Shield className="h-5 w-5" />;
      case 'file_system':
        return <FileText className="h-5 w-5" />;
      case 'environment':
        return <Settings className="h-5 w-5" />;
      default:
        return <Bug className="h-5 w-5" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">🧪 Application Testing Suite</h1>
            {testData && getStatusIcon(testData.overall_status)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRun(!autoRun)}
            >
              <Clock className={`h-4 w-4 mr-2 ${autoRun ? 'text-green-500' : 'text-gray-500'}`} />
              Auto Run {autoRun ? 'ON' : 'OFF'}
            </Button>
            <Button onClick={runTestSuite} disabled={loading}>
              <Play className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Running Tests...' : 'Run Test Suite'}
            </Button>
          </div>
        </div>

        {/* Test Suite Introduction */}
        <Alert className="mb-6">
          <Target className="h-4 w-4" />
          <AlertTitle>🎯 Comprehensive Application Testing</AlertTitle>
          <AlertDescription>
            This testing suite performs comprehensive checks on all application components including API endpoints, 
            database connectivity, authentication, file system, and environment configuration. Tests run in isolation 
            without affecting production data.
          </AlertDescription>
        </Alert>

        {testData && (
          <>
            {/* Overall Results */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📊 Test Suite Results</span>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(testData.overall_status)}
                    <Badge variant="outline">v{testData.test_suite_version}</Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Last run: {lastRun?.toLocaleString()} • Execution time: {testData.execution_time}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{testData.total_tests}</div>
                    <div className="text-sm text-muted-foreground">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testData.passed_tests}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{testData.failed_tests}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getHealthScoreColor(testData.system_health_score)}`}>
                      {testData.system_health_score}%
                    </div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </div>
                </div>

                {/* Health Score Progress */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">System Health Score</span>
                    <span className={`text-sm ${getHealthScoreColor(testData.system_health_score)}`}>
                      {testData.system_health_score}%
                    </span>
                  </div>
                  <Progress value={testData.system_health_score} className="h-3" />
                </div>

                {/* Recommendations */}
                {testData.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recommendations ({testData.recommendations.length})
                    </h4>
                    <div className="space-y-2">
                      {testData.recommendations.map((rec, index) => (
                        <Alert key={index} className={rec.priority === 'high' ? 'border-red-500' : 'border-yellow-500'}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>{rec.title}</AlertTitle>
                          <AlertDescription>
                            <p className="mb-2">{rec.description}</p>
                            <p className="text-sm font-medium">Action: {rec.action}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="api">API Tests</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="details">All Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {Object.entries(testData.test_categories).map(([key, category]) => (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getCategoryIcon(key)}
                            <span className="ml-2 capitalize">{key.replace('_', ' ')}</span>
                          </div>
                          {getStatusIcon(category.status)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            {getStatusBadge(category.status)}
                          </div>
                          <div className="flex justify-between">
                            <span>Passed:</span>
                            <span className="text-green-600 font-medium">{category.passed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Failed:</span>
                            <span className="text-red-600 font-medium">{category.failed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">{category.total}</span>
                          </div>
                          {category.total > 0 && (
                            <Progress 
                              value={(category.passed / category.total) * 100} 
                              className="h-2 mt-2" 
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      API Endpoints Testing
                      {getStatusIcon(testData.test_categories.api_endpoints.status)}
                    </CardTitle>
                    <CardDescription>
                      Testing all API endpoints for availability and proper file structure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.test_categories.api_endpoints.tests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{test.test_name}</span>
                              {test.critical && <Badge variant="destructive" className="text-xs">Critical</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{test.execution_time}ms</span>
                            {getStatusIcon(test.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Database Testing
                      {getStatusIcon(testData.test_categories.database.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.test_categories.database.tests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{test.test_name}</div>
                            <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{test.execution_time}ms</span>
                            {getStatusIcon(test.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="auth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Authentication Testing
                      {getStatusIcon(testData.test_categories.authentication.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.test_categories.authentication.tests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{test.test_name}</div>
                            <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{test.execution_time}ms</span>
                            {getStatusIcon(test.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        File System
                        {getStatusIcon(testData.test_categories.file_system.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testData.test_categories.file_system.tests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{test.test_name}</div>
                              <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                            </div>
                            {getStatusIcon(test.status)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Environment
                        {getStatusIcon(testData.test_categories.environment.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testData.test_categories.environment.tests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{test.test_name}</div>
                              <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                            </div>
                            {getStatusIcon(test.status)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>📋 Complete Test Results</CardTitle>
                    <CardDescription>
                      Detailed results for all {testData.total_tests} tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.detailed_results.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{test.test_name}</span>
                              <Badge variant="outline" className="text-xs">{test.category}</Badge>
                              {test.critical && <Badge variant="destructive" className="text-xs">Critical</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{test.execution_time}ms</span>
                            {getStatusIcon(test.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Initial State */}
        {!testData && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>🧪 Ready to Test</CardTitle>
              <CardDescription>
                Click "Run Test Suite" to perform comprehensive application testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  The testing suite will check all application components including API endpoints, 
                  database connectivity, authentication, and system configuration.
                </p>
                <Button onClick={runTestSuite} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Testing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminTestingSuite;
