import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Activity,
  Clock,
  Database
} from "lucide-react";
import BackToHome from "./BackToHome";

const LiveAPIDemo: React.FC = () => {
  const [groqApiKey, setGroqApiKey] = useState("");
  const [openrouterApiKey, setOpenrouterApiKey] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("groq");

  const testGroqAPI = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: 'Generate a brief psychological assessment for a fertility counseling patient who is anxious about IVF treatment. Respond in JSON format with psychologicalProfile, stressLevel, and recommendedApproach fields.'
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          success: true,
          provider: 'Groq',
          model: 'llama3-8b-8192',
          response: data.choices[0].message.content,
          usage: data.usage,
          responseTime: Date.now()
        });
      } else {
        const errorData = await response.text();
        setTestResult({
          success: false,
          error: `API Error: ${response.status} - ${errorData}`
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testOpenRouterAPI = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://santaan.in',
          'X-Title': 'Santaan Counselor'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'user',
              content: 'Create a personalized intervention plan for a fertility counseling patient. Include coping strategies, communication techniques, and stress management. Respond in JSON format.'
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          success: true,
          provider: 'OpenRouter',
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          response: data.choices[0].message.content,
          usage: data.usage,
          responseTime: Date.now()
        });
      } else {
        const errorData = await response.text();
        setTestResult({
          success: false,
          error: `API Error: ${response.status} - ${errorData}`
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back to Home Button */}
      <BackToHome position="top-left" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-santaan-primary" />
            Live AI API Integration Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Test real AI APIs with your own API keys to see live patient analysis generation
          </p>
        </div>

        <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="groq" className="flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              Groq (Ultra Fast)
            </TabsTrigger>
            <TabsTrigger value="openrouter" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              OpenRouter (Multi-Model)
            </TabsTrigger>
          </TabsList>

          {/* Groq Tab */}
          <TabsContent value="groq">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-santaan-primary" />
                    Groq API Test
                  </CardTitle>
                  <CardDescription>
                    Test ultra-fast AI responses with Groq's lightning-speed inference
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="groq-key">Groq API Key</Label>
                    <Input
                      id="groq-key"
                      type="password"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your free API key from <a href="https://console.groq.com/" target="_blank" className="text-santaan-primary hover:underline">console.groq.com</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Model:</span>
                      <Badge variant="secondary">llama3-8b-8192</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Speed:</span>
                      <Badge className="bg-green-100 text-green-800">Ultra Fast</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cost:</span>
                      <Badge className="bg-blue-100 text-blue-800">FREE</Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={testGroqAPI}
                    disabled={!groqApiKey || isLoading}
                    className="w-full bg-santaan-primary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Groq API...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Test Groq API
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-santaan-secondary" />
                    API Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResult ? (
                    <div className="space-y-4">
                      <div className={`p-4 border rounded-lg ${
                        testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {testResult.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-semibold ${
                            testResult.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {testResult.success ? 'Success!' : 'Error'}
                          </span>
                        </div>
                        
                        {testResult.success ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge variant="outline">{testResult.provider}</Badge>
                              <Badge variant="outline">{testResult.model}</Badge>
                              {testResult.usage && (
                                <Badge variant="outline">
                                  {testResult.usage.total_tokens} tokens
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">AI Response:</Label>
                              <Textarea
                                value={testResult.response}
                                readOnly
                                className="mt-1 h-32 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-700 text-sm">{testResult.error}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your API key and click "Test" to see live AI responses</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* OpenRouter Tab */}
          <TabsContent value="openrouter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-santaan-primary" />
                    OpenRouter API Test
                  </CardTitle>
                  <CardDescription>
                    Test multiple AI models through OpenRouter's unified API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                    <Input
                      id="openrouter-key"
                      type="password"
                      placeholder="sk-or-..."
                      value={openrouterApiKey}
                      onChange={(e) => setOpenrouterApiKey(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your free API key from <a href="https://openrouter.ai/" target="_blank" className="text-santaan-primary hover:underline">openrouter.ai</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Model:</span>
                      <Badge variant="secondary">llama-3.1-8b-instruct:free</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quality:</span>
                      <Badge className="bg-purple-100 text-purple-800">High</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cost:</span>
                      <Badge className="bg-blue-100 text-blue-800">FREE</Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={testOpenRouterAPI}
                    disabled={!openrouterApiKey || isLoading}
                    className="w-full bg-santaan-primary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing OpenRouter API...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Test OpenRouter API
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5 text-santaan-secondary" />
                    API Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResult ? (
                    <div className="space-y-4">
                      <div className={`p-4 border rounded-lg ${
                        testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {testResult.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-semibold ${
                            testResult.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {testResult.success ? 'Success!' : 'Error'}
                          </span>
                        </div>
                        
                        {testResult.success ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge variant="outline">{testResult.provider}</Badge>
                              <Badge variant="outline">{testResult.model}</Badge>
                              {testResult.usage && (
                                <Badge variant="outline">
                                  {testResult.usage.total_tokens} tokens
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">AI Response:</Label>
                              <Textarea
                                value={testResult.response}
                                readOnly
                                className="mt-1 h-32 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-700 text-sm">{testResult.error}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your API key and click "Test" to see live AI responses</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Integration Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-santaan-primary" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-santaan-primary/10 p-4 rounded-lg mb-3">
                  <Brain className="h-8 w-8 text-santaan-primary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">AI Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Real AI APIs integrated and ready for patient analysis
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-santaan-secondary/10 p-4 rounded-lg mb-3">
                  <Activity className="h-8 w-8 text-santaan-secondary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Live Testing</h3>
                <p className="text-sm text-muted-foreground">
                  Test real API responses with your own keys
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-santaan-tertiary/10 p-4 rounded-lg mb-3">
                  <Database className="h-8 w-8 text-santaan-tertiary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">EMR Ready</h3>
                <p className="text-sm text-muted-foreground">
                  FHIR-compliant EMR integration for medical records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveAPIDemo;
