import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Copy,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Key,
  Settings,
  ArrowRight,
  Info
} from "lucide-react";
import BackToHome from "./BackToHome";

const APISetupGuide: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string>("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const apiProviders = [
    {
      id: "groq",
      name: "Groq",
      description: "Ultra-fast FREE AI with lightning speed",
      recommended: true,
      free: true,
      signupUrl: "https://console.groq.com/",
      steps: [
        "Visit console.groq.com and create an account",
        "Verify your email address",
        "Go to API Keys section in your dashboard",
        "Click 'Create API Key' and copy the key",
        "Use model name: 'llama3-8b-8192'"
      ],
      limits: "FREE with generous rate limits",
      model: "llama3-8b-8192",
      pros: ["Extremely fast responses", "Completely free", "High quality Llama models", "No token limits"],
      cons: ["Rate limited during peak times", "Newer service"]
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Access to multiple FREE AI models",
      recommended: true,
      free: true,
      signupUrl: "https://openrouter.ai/",
      steps: [
        "Visit openrouter.ai and create an account",
        "Verify your email address",
        "Go to Keys section in your dashboard",
        "Click 'Create Key' and copy the API key",
        "Use model name: 'meta-llama/llama-3.1-8b-instruct:free'"
      ],
      limits: "Multiple FREE models available",
      model: "meta-llama/llama-3.1-8b-instruct:free",
      pros: ["Multiple free models", "High quality responses", "Good rate limits", "Model variety"],
      cons: ["Some models are paid", "Requires credits for premium models"]
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      description: "Open source AI models - completely FREE",
      recommended: true,
      free: true,
      signupUrl: "https://huggingface.co/",
      steps: [
        "Create account at huggingface.co",
        "Go to Settings > Access Tokens",
        "Create a new token with 'Read' permissions",
        "Choose a model like 'microsoft/DialoGPT-large'",
        "Use the model name in configuration"
      ],
      limits: "Free inference API",
      model: "microsoft/DialoGPT-large",
      pros: ["Completely free", "Many models available", "Open source", "No API key required for some models"],
      cons: ["Variable quality", "Can be slower", "Rate limits during peak times"]
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      description: "Generous free tier with 10M tokens/month",
      recommended: false,
      free: true,
      signupUrl: "https://platform.deepseek.com/",
      steps: [
        "Visit platform.deepseek.com and create an account",
        "Verify your email address",
        "Go to API Keys section in your dashboard",
        "Click 'Create API Key' and copy the key",
        "Use model name: 'deepseek-chat'"
      ],
      limits: "10M tokens/month free",
      model: "deepseek-chat",
      pros: ["Very generous free tier", "High quality responses", "Fast response times"],
      cons: ["Newer provider", "Limited documentation"]
    },
    {
      id: "google",
      name: "Google Gemini",
      description: "Google's AI with free tier",
      recommended: false,
      free: true,
      signupUrl: "https://aistudio.google.com/",
      steps: [
        "Visit Google AI Studio (aistudio.google.com)",
        "Sign in with your Google account",
        "Click 'Get API Key' in the top menu",
        "Create a new API key for your project",
        "Use model name: 'gemini-pro'"
      ],
      limits: "15 requests/minute free",
      model: "gemini-pro",
      pros: ["Google's latest AI", "Good integration", "Reliable service"],
      cons: ["Rate limited", "Requires Google account"]
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      description: "Open source AI models",
      recommended: false,
      free: true,
      signupUrl: "https://huggingface.co/",
      steps: [
        "Create account at huggingface.co",
        "Go to Settings > Access Tokens",
        "Create a new token with 'Read' permissions",
        "Choose a model like 'microsoft/DialoGPT-large'",
        "Use the model name in configuration"
      ],
      limits: "Free inference API",
      model: "microsoft/DialoGPT-large",
      pros: ["Completely free", "Many models available", "Open source"],
      cons: ["Variable quality", "Can be slower", "Rate limits"]
    },
    {
      id: "cohere",
      name: "Cohere",
      description: "Enterprise AI with free trial",
      recommended: false,
      free: true,
      signupUrl: "https://cohere.ai/",
      steps: [
        "Sign up at cohere.ai",
        "Verify your email and complete onboarding",
        "Go to API Keys in your dashboard",
        "Copy your trial API key",
        "Use model name: 'command'"
      ],
      limits: "Free trial with good limits",
      model: "command",
      pros: ["High quality", "Good documentation", "Enterprise grade"],
      cons: ["Trial only", "Requires credit card for extended use"]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back to Home Button */}
      <BackToHome position="top-left" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Key className="mr-3 h-8 w-8 text-santaan-primary" />
            Free AI API Setup Guide
          </h1>
          <p className="text-muted-foreground text-lg">
            Step-by-step instructions to get free AI API keys for patient persona generation
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Zap className="mr-2 h-5 w-5" />
              Quick Start Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Start with Groq (Recommended)</h3>
                <p className="text-green-700 mb-3">
                  Groq offers ultra-fast FREE AI responses with no token limits - perfect for real-time patient analysis with lightning speed.
                </p>
                <div className="flex items-center space-x-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open("https://console.groq.com/", "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Get Groq API Key
                  </Button>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    FREE & Ultra Fast
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Tabs */}
        <Tabs defaultValue="groq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {apiProviders.map((provider) => (
              <TabsTrigger key={provider.id} value={provider.id} className="flex items-center">
                {provider.recommended && <Star className="mr-1 h-3 w-3 text-yellow-500" />}
                {provider.name}
                {provider.free && <Badge variant="secondary" className="ml-1 text-xs">FREE</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>

          {apiProviders.map((provider) => (
            <TabsContent key={provider.id} value={provider.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Setup Instructions */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-santaan-primary" />
                      {provider.name} Setup Instructions
                    </CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-blue-800">API Limits</h4>
                          <p className="text-sm text-blue-700">{provider.limits}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {provider.free ? "FREE" : "PAID"}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Step-by-step setup:</h4>
                        <ol className="space-y-3">
                          {provider.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <div className="bg-santaan-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="flex items-center space-x-4 pt-4">
                        <Button 
                          onClick={() => window.open(provider.signupUrl, "_blank")}
                          className="bg-santaan-primary"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Sign Up for {provider.name}
                        </Button>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Model:</span>
                          <code 
                            className="bg-gray-100 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-200"
                            onClick={() => copyToClipboard(provider.model, provider.id)}
                          >
                            {provider.model}
                            {copiedText === provider.id ? (
                              <CheckCircle className="inline ml-1 h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="inline ml-1 h-3 w-3" />
                            )}
                          </code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pros and Cons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pros & Cons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {provider.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-green-600 flex items-center">
                              <ArrowRight className="mr-1 h-3 w-3" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                          <Info className="mr-1 h-4 w-4" />
                          Considerations
                        </h4>
                        <ul className="space-y-1">
                          {provider.cons.map((con, index) => (
                            <li key={index} className="text-sm text-orange-600 flex items-center">
                              <ArrowRight className="mr-1 h-3 w-3" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Configuration Help */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-santaan-primary" />
              After Getting Your API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-santaan-primary/10 p-4 rounded-lg mb-3">
                  <Settings className="h-8 w-8 text-santaan-primary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">1. Configure in Admin Panel</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Admin Panel → AI Configuration tab and enter your API details
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-santaan-secondary/10 p-4 rounded-lg mb-3">
                  <Zap className="h-8 w-8 text-santaan-secondary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">2. Test Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Use the built-in test tools to verify your API configuration works
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-santaan-tertiary/10 p-4 rounded-lg mb-3">
                  <Globe className="h-8 w-8 text-santaan-tertiary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">3. Generate AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Start generating real AI-powered patient personas and intervention plans
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APISetupGuide;
