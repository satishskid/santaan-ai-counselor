import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Database,
  Settings,
  TestTube,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Upload,
  Webhook,
  Shield,
  Clock,
  Users,
  FileText,
  Calendar,
  Pill,
  BarChart3,
} from 'lucide-react';

interface EMRConfig {
  enabled: boolean;
  provider: 'epic' | 'cerner' | 'allscripts' | 'athenahealth' | 'custom' | 'fhir';
  baseUrl: string;
  apiKey: string;
  clientId?: string;
  clientSecret?: string;
  timeout: number;
  retryAttempts: number;
  ivfSpecific: {
    cycleManagement: boolean;
    medicationTracking: boolean;
    monitoringIntegration: boolean;
    labResultsSync: boolean;
    procedureScheduling: boolean;
    outcomeTracking: boolean;
    counselingIntegration: boolean;
    aiAnalysisSharing: boolean;
  };
  webhooks: {
    enabled: boolean;
    endpoints: {
      cycleUpdates?: string;
      labResults?: string;
      appointments?: string;
      procedures?: string;
    };
    authentication: {
      type: 'bearer' | 'hmac' | 'basic';
      secret: string;
    };
  };
}

interface ConnectionStatus {
  connected: boolean;
  lastTested?: string;
  capabilities?: string[];
  message?: string;
}

const EMRIntegrationPanel: React.FC = () => {
  const [config, setConfig] = useState<EMRConfig>({
    enabled: false,
    provider: 'custom',
    baseUrl: '',
    apiKey: '',
    timeout: 30000,
    retryAttempts: 3,
    ivfSpecific: {
      cycleManagement: true,
      medicationTracking: true,
      monitoringIntegration: true,
      labResultsSync: true,
      procedureScheduling: true,
      outcomeTracking: true,
      counselingIntegration: true,
      aiAnalysisSharing: true,
    },
    webhooks: {
      enabled: false,
      endpoints: {},
      authentication: {
        type: 'bearer',
        secret: '',
      },
    },
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const response = await fetch('/api/emr/config');
      if (response.ok) {
        const savedConfig = await response.json();
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Failed to load EMR configuration:', error);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/emr/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      const result = await response.json();
      setConnectionStatus({
        connected: result.success,
        lastTested: new Date().toISOString(),
        capabilities: result.capabilities,
        message: result.message,
      });
      setTestResults(result);
    } catch (error) {
      setConnectionStatus({
        connected: false,
        lastTested: new Date().toISOString(),
        message: 'Connection test failed',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/emr/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('EMR configuration saved successfully!');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      alert('Failed to save EMR configuration');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const testDataSync = async () => {
    try {
      // Test pulling patient data
      const response = await fetch('/api/emr/patients/test-patient-001');
      const result = await response.json();
      
      if (result.success) {
        alert('Data sync test successful! Patient data retrieved from EMR.');
        console.log('Retrieved patient data:', result.data);
      } else {
        alert('Data sync test failed: ' + result.message);
      }
    } catch (error) {
      alert('Data sync test failed');
      console.error('Sync test error:', error);
    }
  };

  const testCounselingPush = async () => {
    try {
      const mockCounselingData = {
        sessionId: 'session-001',
        patientId: 'test-patient-001',
        counselorId: 'counselor-001',
        sessionDate: new Date().toISOString(),
        sessionType: 'pre_treatment',
        aiPersonaAnalysis: {
          psychologicalProfile: { anxiety: 'moderate', coping: 'adaptive' },
          copingStrategies: ['mindfulness', 'support_groups'],
          riskFactors: ['treatment_anxiety', 'relationship_stress'],
          recommendations: ['stress_management', 'partner_counseling'],
        },
        interventionPlan: {
          phases: [
            { name: 'Assessment', description: 'Initial evaluation' },
            { name: 'Intervention', description: 'Active counseling' },
          ],
          goals: ['reduce_anxiety', 'improve_coping'],
          strategies: ['CBT', 'mindfulness'],
          timeline: '8 weeks',
        },
        assessmentResults: {
          anxietyScore: 6,
          depressionScore: 3,
          stressLevel: 7,
          copingScore: 8,
        },
      };

      const response = await fetch('/api/emr/counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCounselingData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Counseling data push test successful! Data sent to EMR.');
        console.log('Push result:', result);
      } else {
        alert('Counseling data push test failed: ' + result.message);
      }
    } catch (error) {
      alert('Counseling data push test failed');
      console.error('Push test error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">EMR Integration</h2>
          <p className="text-muted-foreground">
            Configure bidirectional integration with IVF EMR systems
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {connectionStatus.connected ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="w-3 h-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="features">IVF Features</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Basic Configuration
              </CardTitle>
              <CardDescription>
                Configure your EMR system connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig({ ...config, enabled })
                  }
                />
                <Label>Enable EMR Integration</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">EMR Provider</Label>
                  <Select
                    value={config.provider}
                    onValueChange={(provider: any) =>
                      setConfig({ ...config, provider })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select EMR provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="cerner">Cerner</SelectItem>
                      <SelectItem value="allscripts">Allscripts</SelectItem>
                      <SelectItem value="athenahealth">athenahealth</SelectItem>
                      <SelectItem value="fhir">Generic FHIR</SelectItem>
                      <SelectItem value="custom">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={config.timeout}
                    onChange={(e) =>
                      setConfig({ ...config, timeout: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://your-emr-system.com/api/fhir"
                  value={config.baseUrl}
                  onChange={(e) =>
                    setConfig({ ...config, baseUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your EMR API key"
                  value={config.apiKey}
                  onChange={(e) =>
                    setConfig({ ...config, apiKey: e.target.value })
                  }
                />
              </div>

              {config.provider !== 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      placeholder="OAuth Client ID"
                      value={config.clientId || ''}
                      onChange={(e) =>
                        setConfig({ ...config, clientId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      placeholder="OAuth Client Secret"
                      value={config.clientSecret || ''}
                      onChange={(e) =>
                        setConfig({ ...config, clientSecret: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={testConnection}
                  disabled={isTestingConnection || !config.enabled}
                  variant="outline"
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button
                  onClick={saveConfiguration}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  Save Configuration
                </Button>
              </div>

              {connectionStatus.lastTested && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Connection Status</span>
                    <span className="text-sm text-muted-foreground">
                      Last tested: {new Date(connectionStatus.lastTested).toLocaleString()}
                    </span>
                  </div>
                  <p className={`text-sm ${connectionStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionStatus.message}
                  </p>
                  {connectionStatus.capabilities && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Available capabilities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {connectionStatus.capabilities.map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                IVF-Specific Features
              </CardTitle>
              <CardDescription>
                Configure which IVF-specific data to sync with your EMR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(config.ivfSpecific).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          ivfSpecific: { ...config.ivfSpecific, [key]: checked },
                        })
                      }
                    />
                    <Label className="flex items-center space-x-2">
                      {getFeatureIcon(key)}
                      <span>{getFeatureLabel(key)}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="w-5 h-5 mr-2" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure real-time updates from your EMR system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.webhooks.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig({
                      ...config,
                      webhooks: { ...config.webhooks, enabled },
                    })
                  }
                />
                <Label>Enable Webhooks</Label>
              </div>

              {config.webhooks.enabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Webhook Endpoints</h4>
                    {Object.entries({
                      cycleUpdates: 'Cycle Updates',
                      labResults: 'Lab Results',
                      appointments: 'Appointments',
                      procedures: 'Procedures',
                    }).map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          placeholder={`https://your-app.com/webhooks/${key}`}
                          value={config.webhooks.endpoints[key as keyof typeof config.webhooks.endpoints] || ''}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              webhooks: {
                                ...config.webhooks,
                                endpoints: {
                                  ...config.webhooks.endpoints,
                                  [key]: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label>Authentication Type</Label>
                      <Select
                        value={config.webhooks.authentication.type}
                        onValueChange={(type: any) =>
                          setConfig({
                            ...config,
                            webhooks: {
                              ...config.webhooks,
                              authentication: { ...config.webhooks.authentication, type },
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="hmac">HMAC Signature</SelectItem>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <Input
                        type="password"
                        placeholder="Webhook secret for authentication"
                        value={config.webhooks.authentication.secret}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            webhooks: {
                              ...config.webhooks,
                              authentication: {
                                ...config.webhooks.authentication,
                                secret: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Integration Testing
              </CardTitle>
              <CardDescription>
                Test your EMR integration with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={testDataSync}
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!config.enabled}
                >
                  <Download className="w-6 h-6 mb-2" />
                  Test Data Pull
                  <span className="text-xs text-muted-foreground">
                    Pull patient data from EMR
                  </span>
                </Button>

                <Button
                  onClick={testCounselingPush}
                  variant="outline"
                  className="h-20 flex-col"
                  disabled={!config.enabled}
                >
                  <Upload className="w-6 h-6 mb-2" />
                  Test Data Push
                  <span className="text-xs text-muted-foreground">
                    Push counseling data to EMR
                  </span>
                </Button>
              </div>

              {testResults && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Test Results</h4>
                  <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getFeatureIcon = (feature: string) => {
  const icons: Record<string, React.ReactNode> = {
    cycleManagement: <Calendar className="w-4 h-4" />,
    medicationTracking: <Pill className="w-4 h-4" />,
    monitoringIntegration: <BarChart3 className="w-4 h-4" />,
    labResultsSync: <TestTube className="w-4 h-4" />,
    procedureScheduling: <Clock className="w-4 h-4" />,
    outcomeTracking: <Activity className="w-4 h-4" />,
    counselingIntegration: <Users className="w-4 h-4" />,
    aiAnalysisSharing: <FileText className="w-4 h-4" />,
  };
  return icons[feature] || <Settings className="w-4 h-4" />;
};

const getFeatureLabel = (feature: string) => {
  const labels: Record<string, string> = {
    cycleManagement: 'Cycle Management',
    medicationTracking: 'Medication Tracking',
    monitoringIntegration: 'Monitoring Integration',
    labResultsSync: 'Lab Results Sync',
    procedureScheduling: 'Procedure Scheduling',
    outcomeTracking: 'Outcome Tracking',
    counselingIntegration: 'Counseling Integration',
    aiAnalysisSharing: 'AI Analysis Sharing',
  };
  return labels[feature] || feature;
};

export default EMRIntegrationPanel;
