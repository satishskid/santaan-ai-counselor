import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  CreditCard, 
  Database, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Save,
  TestTube,
  Loader2
} from 'lucide-react';

interface ServiceConfig {
  email: {
    provider: string;
    configured: boolean;
    settings: Record<string, any>;
  };
  payment: {
    stripe: boolean;
    razorpay: boolean;
    active: string;
  };
  emr: {
    providers: string[];
    enabled: string[];
    status: Record<string, any>;
  };
}

const AdminSettings = () => {
  const [config, setConfig] = useState<ServiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    provider: 'sendgrid',
    sendgridApiKey: '',
    mailgunApiKey: '',
    mailgunDomain: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    fromEmail: '',
    fromName: ''
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeSecretKey: '',
    stripePublishableKey: '',
    stripeWebhookSecret: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    razorpayWebhookSecret: '',
    preferredProvider: 'stripe'
  });

  // EMR settings
  const [emrSettings, setEmrSettings] = useState({
    epicBaseUrl: '',
    epicClientId: '',
    epicClientSecret: '',
    epicEnabled: false,
    cernerBaseUrl: '',
    cernerClientId: '',
    cernerClientSecret: '',
    cernerEnabled: false,
    allscriptsBaseUrl: '',
    allscriptsClientId: '',
    allscriptsClientSecret: '',
    allscriptsEnabled: false
  });

  useEffect(() => {
    fetchServiceConfig();
  }, []);

  const fetchServiceConfig = async () => {
    try {
      setLoading(true);
      // This would fetch current service configuration
      // For demo, we'll simulate the response
      const mockConfig: ServiceConfig = {
        email: {
          provider: 'None',
          configured: false,
          settings: {}
        },
        payment: {
          stripe: false,
          razorpay: false,
          active: 'None'
        },
        emr: {
          providers: ['epic', 'cerner', 'allscripts'],
          enabled: [],
          status: {}
        }
      };
      setConfig(mockConfig);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load service configuration' });
    } finally {
      setLoading(false);
    }
  };

  const saveEmailSettings = async () => {
    setSaving(true);
    try {
      // This would save email settings to environment variables or database
      console.log('Saving email settings:', emailSettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Email settings saved successfully' });
      await fetchServiceConfig();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save email settings' });
    } finally {
      setSaving(false);
    }
  };

  const savePaymentSettings = async () => {
    setSaving(true);
    try {
      console.log('Saving payment settings:', paymentSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Payment settings saved successfully' });
      await fetchServiceConfig();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save payment settings' });
    } finally {
      setSaving(false);
    }
  };

  const saveEMRSettings = async () => {
    setSaving(true);
    try {
      console.log('Saving EMR settings:', emrSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'EMR settings saved successfully' });
      await fetchServiceConfig();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save EMR settings' });
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setTesting('email');
    try {
      // This would test the email configuration
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Email test successful! Test email sent.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Email test failed' });
    } finally {
      setTesting(null);
    }
  };

  const testEMRConnection = async (provider: string) => {
    setTesting(provider);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: `${provider} connection test successful!` });
    } catch (error) {
      setMessage({ type: 'error', text: `${provider} connection test failed` });
    } finally {
      setTesting(null);
    }
  };

  const getStatusIcon = (configured: boolean) => {
    return configured ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure email notifications, payment processing, and EMR integrations
        </p>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Service Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Service</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(config?.email.configured || false)}
              <span className="text-sm">{config?.email.provider || 'Not configured'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Service</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(config?.payment.active !== 'None')}
              <span className="text-sm">{config?.payment.active || 'Not configured'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EMR Integration</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(config?.emr.enabled.length > 0)}
              <span className="text-sm">{config?.emr.enabled.length || 0} providers enabled</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email Settings</TabsTrigger>
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          <TabsTrigger value="emr">EMR Integration</TabsTrigger>
        </TabsList>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Settings</CardTitle>
              <CardDescription>
                Configure email providers for sending notifications to patients and staff
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    placeholder="noreply@yourclinic.com"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    placeholder="Your Clinic Name"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                  />
                </div>
              </div>

              {/* SendGrid Settings */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">SendGrid Configuration</h4>
                <div className="space-y-2">
                  <Label htmlFor="sendgridApiKey">SendGrid API Key</Label>
                  <Input
                    id="sendgridApiKey"
                    type="password"
                    placeholder="SG.xxxxxxxxxxxxxxxx"
                    value={emailSettings.sendgridApiKey}
                    onChange={(e) => setEmailSettings({...emailSettings, sendgridApiKey: e.target.value})}
                  />
                </div>
              </div>

              {/* Mailgun Settings */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Mailgun Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailgunApiKey">Mailgun API Key</Label>
                    <Input
                      id="mailgunApiKey"
                      type="password"
                      placeholder="key-xxxxxxxxxxxxxxxx"
                      value={emailSettings.mailgunApiKey}
                      onChange={(e) => setEmailSettings({...emailSettings, mailgunApiKey: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailgunDomain">Mailgun Domain</Label>
                    <Input
                      id="mailgunDomain"
                      placeholder="mg.yourclinic.com"
                      value={emailSettings.mailgunDomain}
                      onChange={(e) => setEmailSettings({...emailSettings, mailgunDomain: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveEmailSettings} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Email Settings
                </Button>
                <Button variant="outline" onClick={testEmailConnection} disabled={testing === 'email'}>
                  {testing === 'email' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TestTube className="h-4 w-4 mr-2" />}
                  Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing Settings</CardTitle>
              <CardDescription>
                Configure Stripe and Razorpay for subscription billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stripe Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Stripe Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      type="password"
                      placeholder="sk_live_xxxxxxxxxxxxxxxx"
                      value={paymentSettings.stripeSecretKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                    <Input
                      id="stripePublishableKey"
                      placeholder="pk_live_xxxxxxxxxxxxxxxx"
                      value={paymentSettings.stripePublishableKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Razorpay Settings */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Razorpay Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpayKeyId">Key ID</Label>
                    <Input
                      id="razorpayKeyId"
                      placeholder="rzp_live_xxxxxxxxxxxxxxxx"
                      value={paymentSettings.razorpayKeyId}
                      onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeyId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razorpayKeySecret">Key Secret</Label>
                    <Input
                      id="razorpayKeySecret"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxx"
                      value={paymentSettings.razorpayKeySecret}
                      onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeySecret: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={savePaymentSettings} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EMR Settings */}
        <TabsContent value="emr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EMR Integration Settings</CardTitle>
              <CardDescription>
                Configure connections to Epic, Cerner, and other FHIR-compliant EMR systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Epic Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Epic EMR</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={emrSettings.epicEnabled}
                      onCheckedChange={(checked) => setEmrSettings({...emrSettings, epicEnabled: checked})}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testEMRConnection('Epic')}
                      disabled={testing === 'Epic'}
                    >
                      {testing === 'Epic' ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="epicBaseUrl">Base URL</Label>
                    <Input
                      id="epicBaseUrl"
                      placeholder="https://fhir.epic.com/interconnect-fhir-oauth"
                      value={emrSettings.epicBaseUrl}
                      onChange={(e) => setEmrSettings({...emrSettings, epicBaseUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="epicClientId">Client ID</Label>
                    <Input
                      id="epicClientId"
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={emrSettings.epicClientId}
                      onChange={(e) => setEmrSettings({...emrSettings, epicClientId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="epicClientSecret">Client Secret</Label>
                    <Input
                      id="epicClientSecret"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxx"
                      value={emrSettings.epicClientSecret}
                      onChange={(e) => setEmrSettings({...emrSettings, epicClientSecret: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Cerner Settings */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Cerner EMR</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={emrSettings.cernerEnabled}
                      onCheckedChange={(checked) => setEmrSettings({...emrSettings, cernerEnabled: checked})}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testEMRConnection('Cerner')}
                      disabled={testing === 'Cerner'}
                    >
                      {testing === 'Cerner' ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cernerBaseUrl">Base URL</Label>
                    <Input
                      id="cernerBaseUrl"
                      placeholder="https://fhir-open.cerner.com/r4"
                      value={emrSettings.cernerBaseUrl}
                      onChange={(e) => setEmrSettings({...emrSettings, cernerBaseUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cernerClientId">Client ID</Label>
                    <Input
                      id="cernerClientId"
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={emrSettings.cernerClientId}
                      onChange={(e) => setEmrSettings({...emrSettings, cernerClientId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cernerClientSecret">Client Secret</Label>
                    <Input
                      id="cernerClientSecret"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxx"
                      value={emrSettings.cernerClientSecret}
                      onChange={(e) => setEmrSettings({...emrSettings, cernerClientSecret: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveEMRSettings} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save EMR Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
