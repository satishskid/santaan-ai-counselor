import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Users,
  FileText,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Bell,
  BookOpen,
  Video,
  Download,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  BarChart3,
  UserCheck,
  MessageSquare,
  Globe,
  Shield,
  Database,
  Upload,
  Save,
  X,
  ExternalLink
} from "lucide-react";
import { aiService } from "@/services/aiService";
import { emrService } from "@/services/emrService";
import BackToHome from "./BackToHome";
import EMRIntegrationPanel from "./EMRIntegrationPanel";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewContentForm, setShowNewContentForm] = useState(false);
  const [showNewsletterForm, setShowNewsletterForm] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    provider: 'mock' as 'groq' | 'openrouter' | 'huggingface' | 'deepseek' | 'openai' | 'anthropic' | 'google' | 'azure' | 'cohere' | 'custom' | 'mock',
    apiKey: '',
    modelName: '',
    endpoint: '',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 60,
    enableFallback: true
  });
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [emrConfig, setEmrConfig] = useState({
    enabled: false,
    provider: 'fhir' as 'epic' | 'cerner' | 'allscripts' | 'athenahealth' | 'custom' | 'fhir',
    baseUrl: '',
    apiKey: '',
    timeout: 30,
    retryAttempts: 3
  });
  const [emrTestResult, setEmrTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingEmr, setIsTestingEmr] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    type: "",
    category: "",
    content: "",
    tags: "",
    featured: false
  });
  const [newsletter, setNewsletter] = useState({
    subject: "",
    content: "",
    priority: "normal",
    scheduledDate: ""
  });

  // Mock data for admin dashboard
  const counselors = [
    { id: 1, name: "Dr. Emma Wilson", email: "emma@santaan.in", status: "active", lastLogin: "2024-01-15", completedModules: 8 },
    { id: 2, name: "Dr. Sarah Mitchell", email: "sarah@santaan.in", status: "active", lastLogin: "2024-01-14", completedModules: 6 },
    { id: 3, name: "Dr. Michael Chen", email: "michael@santaan.in", status: "active", lastLogin: "2024-01-13", completedModules: 7 },
    { id: 4, name: "Dr. Lisa Rodriguez", email: "lisa@santaan.in", status: "inactive", lastLogin: "2024-01-10", completedModules: 4 }
  ];

  const recentContent = [
    { id: 1, title: "ESHRE Guidelines Update 2024", type: "document", author: "Admin", date: "2024-01-15", status: "published" },
    { id: 2, title: "New IVF Protocol Training", type: "video", author: "Dr. Smith", date: "2024-01-14", status: "draft" },
    { id: 3, title: "Patient Communication Best Practices", type: "guide", author: "Admin", date: "2024-01-13", status: "published" }
  ];

  const newsletters = [
    { id: 1, subject: "Monthly Training Update - January 2024", sentDate: "2024-01-15", recipients: 25, openRate: "85%" },
    { id: 2, subject: "New ESHRE Guidelines Available", sentDate: "2024-01-10", recipients: 25, openRate: "92%" },
    { id: 3, subject: "Platform Feature Updates", sentDate: "2024-01-05", recipients: 25, openRate: "78%" }
  ];

  const handleCreateContent = () => {
    // Here you would typically send the data to your API
    console.log("Creating new content:", newContent);
    setShowNewContentForm(false);
    setNewContent({ title: "", type: "", category: "", content: "", tags: "", featured: false });
  };

  const handleSendNewsletter = () => {
    // Here you would typically send the newsletter via your API
    console.log("Sending newsletter:", newsletter);
    setShowNewsletterForm(false);
    setNewsletter({ subject: "", content: "", priority: "normal", scheduledDate: "" });
  };

  const handleSaveApiConfig = () => {
    aiService.updateConfig(apiConfig);
    // Update the local state to reflect the saved config
    const config = aiService.getConfig();
    setApiConfig({
      ...config,
      endpoint: config.endpoint || ''
    });
    alert('✅ API Configuration Saved Successfully!\n\nYour API key and settings have been securely stored and will be remembered for future sessions.\n\n🔒 Security: API keys are encrypted in local storage\n🚀 Ready: You can now generate real AI personas');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Temporarily update the service config for testing
      aiService.updateConfig(apiConfig);
      const result = await aiService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestPersonaGeneration = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test with comprehensive sample patient data
      const sampleData = {
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          age: 32,
          partnerName: 'Michael',
          occupation: 'Marketing Manager'
        },
        medicalHistory: {
          medicalConditions: 'PCOS, mild hypothyroidism',
          previousTreatments: '2 IUI cycles unsuccessful',
          medications: 'Metformin, Levothyroxine'
        },
        fertilityJourney: {
          tryingToConceiveSince: '3 years',
          previousIVFAttempts: 'None - first IVF cycle',
          challenges: 'Irregular ovulation, anxiety about treatment failure'
        },
        assessmentResults: {
          anxietyLevel: 'Moderate to High (7/10)',
          depressionScreening: 'Mild symptoms',
          copingStrategies: 'Exercise, partner support',
          stressors: 'Work pressure, family questions, financial concerns'
        }
      };

      aiService.updateConfig(apiConfig);
      const result = await aiService.generatePersonaAndPlan(sampleData);

      setTestResult({
        success: true,
        message: `✅ Real AI Persona Generation Successful!\n\n🧠 Generated comprehensive analysis for ${result.persona.patientName}\n📋 Created ${result.interventionPlan.phases.length} intervention phases\n🎯 Identified ${result.persona.personalityTraits.length} personality traits\n💡 Provided ${result.persona.motivationalFactors.length} motivational factors\n\n${apiConfig.provider === 'mock' ? '⚠️ Using mock data - configure real API for live analysis' : '🚀 Using real ' + apiConfig.provider.toUpperCase() + ' API'}`
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Persona generation failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nTip: Check your API key and model configuration.`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveEmrConfig = () => {
    emrService.updateConfig(emrConfig);
    alert('EMR configuration saved successfully!');
  };

  const handleTestEmrConnection = async () => {
    setIsTestingEmr(true);
    setEmrTestResult(null);

    try {
      emrService.updateConfig(emrConfig);
      const result = await emrService.testConnection();
      setEmrTestResult(result);
    } catch (error) {
      setEmrTestResult({
        success: false,
        message: `EMR test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTestingEmr(false);
    }
  };

  // Load existing configs on component mount
  React.useEffect(() => {
    const existingConfig = aiService.getConfig();
    setApiConfig({
      ...existingConfig,
      endpoint: existingConfig.endpoint || ''
    });

    const existingEmrConfig = emrService.getConfig();
    setEmrConfig(existingEmrConfig);

    // Show success message if API is already configured
    if (existingConfig.provider !== 'mock' && existingConfig.apiKey) {
      console.log(`✅ Loaded saved ${existingConfig.provider.toUpperCase()} configuration`);
    }
  }, []);

  const stats = {
    totalCounselors: counselors.length,
    activeCounselors: counselors.filter(c => c.status === "active").length,
    totalContent: 15,
    avgCompletionRate: Math.round(counselors.reduce((acc, c) => acc + c.completedModules, 0) / counselors.length / 8 * 100)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back to Home Button */}
      <BackToHome position="top-left" />

      {/* Header */}
      <div className="bg-gradient-santaan-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-white/90 text-lg">
                Manage counselors, content, and communications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setShowNewContentForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Content
              </Button>
              <Button 
                className="bg-santaan-secondary hover:bg-santaan-secondary/90 text-white"
                onClick={() => setShowNewsletterForm(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="counselors" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Counselors
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Communications
            </TabsTrigger>
            <TabsTrigger value="api-config" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              AI Configuration
            </TabsTrigger>
            <TabsTrigger value="emr-config" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              EMR Integration
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Counselors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-santaan-primary">{stats.totalCounselors}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.activeCounselors} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Counselors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-santaan-secondary">{stats.activeCounselors}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(stats.activeCounselors / stats.totalCounselors * 100)}% of total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-santaan-tertiary">{stats.totalContent}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resources & modules
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-santaan-success">{stats.avgCompletionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Training completion
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Content</CardTitle>
                  <CardDescription>Latest content additions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContent.map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-santaan-primary/10 p-2 rounded-lg">
                            {content.type === "video" ? <Video className="h-4 w-4 text-santaan-primary" /> : 
                             content.type === "document" ? <FileText className="h-4 w-4 text-santaan-primary" /> :
                             <BookOpen className="h-4 w-4 text-santaan-primary" />}
                          </div>
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-muted-foreground">
                              By {content.author} • {content.date}
                            </p>
                          </div>
                        </div>
                        <Badge variant={content.status === "published" ? "default" : "secondary"}>
                          {content.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Performance</CardTitle>
                  <CardDescription>Recent newsletter engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newsletters.map((newsletter) => (
                      <div key={newsletter.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium">{newsletter.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {newsletter.sentDate} • {newsletter.recipients} recipients
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-santaan-success">{newsletter.openRate}</p>
                          <p className="text-xs text-muted-foreground">Open rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Counselors Tab */}
          <TabsContent value="counselors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Counselor Management</CardTitle>
                <CardDescription>Manage counselor accounts and track training progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {counselors.map((counselor) => (
                    <div key={counselor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-santaan-primary/10 p-3 rounded-full">
                          <UserCheck className="h-5 w-5 text-santaan-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{counselor.name}</h3>
                          <p className="text-sm text-muted-foreground">{counselor.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Last login: {counselor.lastLogin}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">{counselor.completedModules}/8</p>
                          <p className="text-xs text-muted-foreground">Modules completed</p>
                        </div>
                        <Badge variant={counselor.status === "active" ? "default" : "secondary"}>
                          {counselor.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Content Library</CardTitle>
                    <CardDescription>Manage training modules and educational resources</CardDescription>
                  </div>
                  <Button onClick={() => setShowNewContentForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-santaan-primary/10 p-2 rounded-lg">
                          {content.type === "video" ? <Video className="h-5 w-5 text-santaan-primary" /> :
                           content.type === "document" ? <FileText className="h-5 w-5 text-santaan-primary" /> :
                           <BookOpen className="h-5 w-5 text-santaan-primary" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{content.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {content.type} • By {content.author} • {content.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={content.status === "published" ? "default" : "secondary"}>
                          {content.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Newsletter Management</CardTitle>
                    <CardDescription>Send updates and announcements to all counselors</CardDescription>
                  </div>
                  <Button onClick={() => setShowNewsletterForm(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    New Newsletter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletters.map((newsletter) => (
                    <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{newsletter.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          Sent {newsletter.sentDate} • {newsletter.recipients} recipients
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-santaan-success">{newsletter.openRate}</p>
                        <p className="text-xs text-muted-foreground">Open rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Configuration Tab */}
          <TabsContent value="api-config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-santaan-primary" />
                  AI API Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI services for patient persona generation and intervention planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Status */}
                  <div className={`p-4 border rounded-lg ${
                    apiConfig.provider === 'mock'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          apiConfig.provider === 'mock' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className={`font-semibold ${
                          apiConfig.provider === 'mock' ? 'text-yellow-800' : 'text-green-800'
                        }`}>
                          {apiConfig.provider === 'mock'
                            ? 'Currently Using Mock Data'
                            : `Connected to ${apiConfig.provider.toUpperCase()}`
                          }
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/api-setup', '_blank')}
                        className={
                          apiConfig.provider === 'mock'
                            ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                            : 'border-green-300 text-green-700 hover:bg-green-100'
                        }
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Setup Guide
                      </Button>
                    </div>
                    <p className={`text-sm ${
                      apiConfig.provider === 'mock' ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {apiConfig.provider === 'mock'
                        ? 'The AI Persona Generator is currently using simulated data. Configure a real AI API below to enable live analysis.'
                        : `Real AI analysis enabled using ${apiConfig.provider.toUpperCase()} with model: ${apiConfig.modelName || 'default'}. API key is saved and ready for use.`
                      }
                    </p>
                  </div>

                  {/* API Provider Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Primary AI Provider</CardTitle>
                        <CardDescription>Select your preferred AI service for persona generation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="ai-provider">AI Service Provider</Label>
                          <Select value={apiConfig.provider} onValueChange={(value) => setApiConfig({...apiConfig, provider: value as any})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select AI provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mock">Mock Data (Testing)</SelectItem>
                              <SelectItem value="groq">🚀 Groq (FREE - Ultra Fast)</SelectItem>
                              <SelectItem value="openrouter">🌟 OpenRouter (FREE Models)</SelectItem>
                              <SelectItem value="huggingface">🤗 Hugging Face (FREE)</SelectItem>
                              <SelectItem value="deepseek">DeepSeek (FREE - 10M tokens)</SelectItem>
                              <SelectItem value="google">Google Gemini (FREE Tier)</SelectItem>
                              <SelectItem value="cohere">Cohere (FREE Trial)</SelectItem>
                              <SelectItem value="openai">OpenAI GPT-4 (Paid)</SelectItem>
                              <SelectItem value="anthropic">Anthropic Claude (Paid)</SelectItem>
                              <SelectItem value="azure">Azure OpenAI (Enterprise)</SelectItem>
                              <SelectItem value="custom">Custom API</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="api-key">API Key</Label>
                          <Input
                            id="api-key"
                            type="password"
                            placeholder="Enter your API key"
                            className="font-mono"
                            value={apiConfig.apiKey}
                            onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Your API key is encrypted and stored securely
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="model-name">Model Name</Label>
                          <Input
                            id="model-name"
                            placeholder="e.g., gpt-4, claude-3-sonnet, gemini-pro"
                            value={apiConfig.modelName}
                            onChange={(e) => setApiConfig({...apiConfig, modelName: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="api-endpoint">API Endpoint (Optional)</Label>
                          <Input
                            id="api-endpoint"
                            placeholder="https://api.openai.com/v1/chat/completions"
                            value={apiConfig.endpoint}
                            onChange={(e) => setApiConfig({...apiConfig, endpoint: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Leave blank to use default endpoint
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Configuration Settings</CardTitle>
                        <CardDescription>Fine-tune AI behavior and response parameters</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="temperature">Temperature (Creativity)</Label>
                          <Input
                            id="temperature"
                            type="number"
                            min="0"
                            max="2"
                            step="0.1"
                            value={apiConfig.temperature}
                            onChange={(e) => setApiConfig({...apiConfig, temperature: parseFloat(e.target.value)})}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            0.0 = Deterministic, 2.0 = Very creative
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="max-tokens">Max Tokens</Label>
                          <Input
                            id="max-tokens"
                            type="number"
                            min="100"
                            max="4000"
                            value={apiConfig.maxTokens}
                            onChange={(e) => setApiConfig({...apiConfig, maxTokens: parseInt(e.target.value)})}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Maximum response length
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                          <Input
                            id="timeout"
                            type="number"
                            min="10"
                            max="300"
                            value={apiConfig.timeout}
                            onChange={(e) => setApiConfig({...apiConfig, timeout: parseInt(e.target.value)})}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="enable-fallback"
                            className="rounded"
                            checked={apiConfig.enableFallback}
                            onChange={(e) => setApiConfig({...apiConfig, enableFallback: e.target.checked})}
                          />
                          <Label htmlFor="enable-fallback" className="text-sm">
                            Enable fallback to mock data if API fails
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Free API Recommendations */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800">Free API Options</CardTitle>
                      <CardDescription className="text-green-700">
                        Recommended free AI services for getting started
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-3 bg-white rounded border border-green-300">
                          <h4 className="font-semibold text-green-800">DeepSeek</h4>
                          <p className="text-sm text-green-700 mb-2">Best free tier - 10M tokens/month</p>
                          <div className="space-y-1">
                            <Badge className="bg-green-100 text-green-800 border-green-200">FREE</Badge>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Recommended</Badge>
                          </div>
                          <p className="text-xs text-green-600 mt-2">Model: deepseek-chat</p>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <h4 className="font-semibold text-green-800">Google Gemini</h4>
                          <p className="text-sm text-green-700 mb-2">15 requests/minute free</p>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Free Tier</Badge>
                          <p className="text-xs text-green-600 mt-2">Model: gemini-pro</p>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <h4 className="font-semibold text-green-800">Hugging Face</h4>
                          <p className="text-sm text-green-700 mb-2">Free inference API</p>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Free</Badge>
                          <p className="text-xs text-green-600 mt-2">Many models available</p>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <h4 className="font-semibold text-green-800">Cohere Trial</h4>
                          <p className="text-sm text-green-700 mb-2">Free trial with good limits</p>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Trial</Badge>
                          <p className="text-xs text-green-600 mt-2">Model: command</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Test Configuration</CardTitle>
                      <CardDescription>Verify your API configuration before going live</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex space-x-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleTestConnection}
                            disabled={isTesting}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            {isTesting ? 'Testing...' : 'Test Connection'}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleTestPersonaGeneration}
                            disabled={isTesting}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {isTesting ? 'Testing...' : 'Test Persona Generation'}
                          </Button>
                        </div>

                        <div className={`p-4 border rounded-lg ${
                          testResult
                            ? testResult.success
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                            : 'bg-gray-50'
                        }`}>
                          <h4 className="font-semibold mb-2">Test Results</h4>
                          {testResult ? (
                            <div className="flex items-start space-x-2">
                              {testResult.success ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              )}
                              <p className={`text-sm ${
                                testResult.success ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {testResult.message}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Click "Test Connection" to verify your API configuration
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Configuration */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setApiConfig({
                          provider: 'mock',
                          apiKey: '',
                          modelName: '',
                          endpoint: '',
                          temperature: 0.7,
                          maxTokens: 2000,
                          timeout: 60,
                          enableFallback: true
                        });
                        setTestResult(null);
                      }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button
                      className="bg-santaan-primary"
                      onClick={handleSaveApiConfig}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMR Integration Tab */}
          <TabsContent value="emr-config" className="space-y-6">
            <EMRIntegrationPanel />

          </TabsContent>
        </Tabs>
      </div>

      {/* New Content Modal */}
      {showNewContentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Content</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowNewContentForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    placeholder="Content title"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newContent.type} onValueChange={(value) => setNewContent({...newContent, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="worksheet">Worksheet</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newContent.category} onValueChange={(value) => setNewContent({...newContent, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="procedures">Procedures</SelectItem>
                      <SelectItem value="counseling">Counseling</SelectItem>
                      <SelectItem value="guidelines">Guidelines</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={newContent.tags}
                    onChange={(e) => setNewContent({...newContent, tags: e.target.value})}
                    placeholder="Comma-separated tags"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newContent.content}
                  onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                  placeholder="Enter content here..."
                  rows={8}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newContent.featured}
                  onChange={(e) => setNewContent({...newContent, featured: e.target.checked})}
                />
                <Label htmlFor="featured">Mark as featured content</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewContentForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContent} className="bg-santaan-primary">
                  <Save className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Newsletter Modal */}
      {showNewsletterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Send Newsletter</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowNewsletterForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newsletter.subject}
                  onChange={(e) => setNewsletter({...newsletter, subject: e.target.value})}
                  placeholder="Newsletter subject"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newsletter.priority} onValueChange={(value) => setNewsletter({...newsletter, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={newsletter.scheduledDate}
                    onChange={(e) => setNewsletter({...newsletter, scheduledDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="newsletterContent">Content</Label>
                <Textarea
                  id="newsletterContent"
                  value={newsletter.content}
                  onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
                  placeholder="Newsletter content..."
                  rows={10}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Recipients</h4>
                    <p className="text-blue-800 text-sm">
                      This newsletter will be sent to all {stats.activeCounselors} active counselors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewsletterForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendNewsletter} className="bg-santaan-secondary">
                  <Send className="mr-2 h-4 w-4" />
                  {newsletter.scheduledDate ? "Schedule Newsletter" : "Send Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
