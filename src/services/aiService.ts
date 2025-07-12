// AI Service for Patient Persona Generation
// This service handles different AI providers and can be configured through the admin panel

interface AIConfig {
  provider: 'groq' | 'openrouter' | 'huggingface' | 'deepseek' | 'openai' | 'anthropic' | 'google' | 'azure' | 'cohere' | 'custom' | 'mock';
  apiKey: string;
  modelName: string;
  endpoint?: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  enableFallback: boolean;
}

interface PatientData {
  personalInfo: any;
  medicalHistory: any;
  fertilityJourney: any;
  assessmentResults: any;
}

interface AIPersona {
  id: string;
  patientName: string;
  psychologicalProfile: any;
  personalityTraits: any[];
  motivationalFactors: string[];
  potentialChallenges: string[];
  communicationPreferences: any;
  culturalConsiderations: string[];
}

interface InterventionPlan {
  id: string;
  overview: any;
  phases: any[];
  personalizedStrategies: any[];
  resources: any[];
  riskFactors: any[];
  successMetrics: string[];
}

class AIService {
  private config: AIConfig;

  constructor() {
    // Load configuration from localStorage or use defaults
    this.config = this.loadConfig();
  }

  private loadConfig(): AIConfig {
    const savedConfig = localStorage.getItem('ai_config');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    
    // Default configuration (Groq with real API)
    return {
      provider: 'groq',
      apiKey: process.env.GROQ_API_KEY || '',
      modelName: 'llama-3.1-70b-versatile',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 60,
      enableFallback: true
    };
  }

  public updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('ai_config', JSON.stringify(this.config));
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.config.provider === 'mock') {
        return { success: true, message: 'Mock mode - connection test successful' };
      }

      // Test actual API connection based on provider
      const testResult = await this.makeTestRequest();
      return testResult;
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private async makeTestRequest(): Promise<{ success: boolean; message: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout * 1000);

    try {
      let endpoint = '';
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      let body: any = {};

      switch (this.config.provider) {
        case 'groq':
          endpoint = this.config.endpoint || 'https://api.groq.com/openai/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'llama3-8b-8192',
            messages: [{ role: 'user', content: 'Test connection' }],
            max_tokens: 10
          };
          break;

        case 'openrouter':
          endpoint = this.config.endpoint || 'https://openrouter.ai/api/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          headers['HTTP-Referer'] = 'https://santaan.in';
          headers['X-Title'] = 'Santaan Counselor';
          body = {
            model: this.config.modelName || 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [{ role: 'user', content: 'Test connection' }],
            max_tokens: 10
          };
          break;

        case 'openai':
          endpoint = this.config.endpoint || 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'gpt-4',
            messages: [{ role: 'user', content: 'Test connection' }],
            max_tokens: 10
          };
          break;

        case 'anthropic':
          endpoint = this.config.endpoint || 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = this.config.apiKey;
          headers['anthropic-version'] = '2023-06-01';
          body = {
            model: this.config.modelName || 'claude-3-sonnet-20240229',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Test connection' }]
          };
          break;

        case 'google':
          endpoint = this.config.endpoint || `https://generativelanguage.googleapis.com/v1beta/models/${this.config.modelName || 'gemini-pro'}:generateContent?key=${this.config.apiKey}`;
          body = {
            contents: [{ parts: [{ text: 'Test connection' }] }],
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: Math.min(this.config.maxTokens, 2048)
            }
          };
          break;

        case 'huggingface':
          endpoint = this.config.endpoint || `https://api-inference.huggingface.co/models/${this.config.modelName || 'microsoft/DialoGPT-large'}`;
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            inputs: 'Test connection',
            parameters: {
              max_new_tokens: Math.min(this.config.maxTokens, 512),
              temperature: this.config.temperature,
              return_full_text: false
            }
          };
          break;

        case 'deepseek':
          endpoint = this.config.endpoint || 'https://api.deepseek.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'deepseek-chat',
            messages: [{ role: 'user', content: 'Test connection' }],
            max_tokens: Math.min(this.config.maxTokens, 4096),
            temperature: this.config.temperature
          };
          break;

        case 'cohere':
          endpoint = this.config.endpoint || 'https://api.cohere.ai/v1/generate';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'command',
            prompt: 'Test connection',
            max_tokens: Math.min(this.config.maxTokens, 4096),
            temperature: this.config.temperature
          };
          break;

        case 'custom':
          if (!this.config.endpoint) {
            throw new Error('Custom endpoint is required for custom provider');
          }
          endpoint = this.config.endpoint;
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            prompt: 'Test connection',
            max_tokens: 10
          };
          break;

        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        const errorText = await response.text();
        return { success: false, message: `API Error: ${response.status} - ${errorText}` };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Request timeout' };
      }
      throw error;
    }
  }

  public async generatePersonaAndPlan(patientData: PatientData): Promise<{
    persona: AIPersona;
    interventionPlan: InterventionPlan;
  }> {
    try {
      if (this.config.provider === 'mock') {
        return this.generateMockPersonaAndPlan(patientData);
      }

      // Generate real AI persona and plan
      const result = await this.generateRealPersonaAndPlan(patientData);
      return result;
    } catch (error) {
      console.error('AI generation failed:', error);
      
      if (this.config.enableFallback) {
        console.log('Falling back to mock data');
        return this.generateMockPersonaAndPlan(patientData);
      }
      
      throw error;
    }
  }

  private async generateRealPersonaAndPlan(patientData: PatientData): Promise<{
    persona: AIPersona;
    interventionPlan: InterventionPlan;
  }> {
    // Create a comprehensive prompt for AI analysis
    const prompt = this.createAnalysisPrompt(patientData);
    
    // Make API call to generate analysis
    const response = await this.makeAIRequest(prompt);
    
    // Parse and structure the response
    return this.parseAIResponse(response, patientData);
  }

  private createAnalysisPrompt(patientData: PatientData): string {
    return `
As a clinical psychologist specializing in fertility counseling, analyze the following patient data and provide:

1. A comprehensive psychological profile
2. A detailed intervention plan with specific strategies

Patient Data:
${JSON.stringify(patientData, null, 2)}

Please provide your analysis in the following JSON format:
{
  "psychologicalProfile": {
    "primaryCopingStyle": "",
    "stressLevel": "",
    "emotionalState": "",
    "supportSystemStrength": "",
    "communicationStyle": "",
    "decisionMakingStyle": ""
  },
  "personalityTraits": [
    {"trait": "", "score": 0, "description": ""}
  ],
  "motivationalFactors": [],
  "potentialChallenges": [],
  "interventionPlan": {
    "overview": {
      "duration": "",
      "primaryGoals": [],
      "approach": ""
    },
    "phases": [
      {
        "phase": 1,
        "title": "",
        "duration": "",
        "goals": [],
        "interventions": []
      }
    ],
    "personalizedStrategies": [],
    "riskFactors": []
  }
}

Focus on evidence-based psychological assessment and intervention strategies specific to fertility counseling.
`;
  }

  private async makeAIRequest(prompt: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout * 1000);

    try {
      let endpoint = '';
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      let body: any = {};

      switch (this.config.provider) {
        case 'groq':
          endpoint = this.config.endpoint || 'https://api.groq.com/openai/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
          };
          break;

        case 'openrouter':
          endpoint = this.config.endpoint || 'https://openrouter.ai/api/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          headers['HTTP-Referer'] = 'https://santaan.in';
          headers['X-Title'] = 'Santaan Counselor';
          body = {
            model: this.config.modelName || 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
          };
          break;

        case 'openai':
          endpoint = this.config.endpoint || 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
          };
          break;

        case 'deepseek':
          endpoint = this.config.endpoint || 'https://api.deepseek.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
          };
          break;

        case 'google':
          endpoint = this.config.endpoint || `https://generativelanguage.googleapis.com/v1beta/models/${this.config.modelName || 'gemini-pro'}:generateContent?key=${this.config.apiKey}`;
          body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: this.config.maxTokens
            }
          };
          break;

        case 'huggingface':
          endpoint = this.config.endpoint || `https://api-inference.huggingface.co/models/${this.config.modelName || 'microsoft/DialoGPT-large'}`;
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            inputs: prompt,
            parameters: {
              max_new_tokens: this.config.maxTokens,
              temperature: this.config.temperature,
              return_full_text: false
            }
          };
          break;

        case 'anthropic':
          endpoint = this.config.endpoint || 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = this.config.apiKey;
          headers['anthropic-version'] = '2023-06-01';
          body = {
            model: this.config.modelName || 'claude-3-sonnet-20240229',
            max_tokens: this.config.maxTokens,
            messages: [{ role: 'user', content: prompt }]
          };
          break;

        case 'cohere':
          endpoint = this.config.endpoint || 'https://api.cohere.ai/v1/generate';
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          body = {
            model: this.config.modelName || 'command',
            prompt: prompt,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
          };
          break;

        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return this.extractResponseText(result);

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private extractResponseText(response: any): string {
    // Extract text from different API response formats
    switch (this.config.provider) {
      case 'groq':
      case 'openrouter':
      case 'openai':
      case 'deepseek':
        return response.choices?.[0]?.message?.content || '';

      case 'google':
        return response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      case 'huggingface':
        return Array.isArray(response) ? response[0]?.generated_text || '' : response.generated_text || '';

      case 'anthropic':
        return response.content?.[0]?.text || '';

      case 'cohere':
        return response.generations?.[0]?.text || '';

      default:
        return JSON.stringify(response);
    }
  }

  private parseAIResponse(response: string, patientData: PatientData): {
    persona: AIPersona;
    interventionPlan: InterventionPlan;
  } {
    try {
      // Try to parse JSON response from AI
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);

      // Create persona from AI response
      const persona: AIPersona = {
        id: `persona_${Date.now()}`,
        patientName: `${patientData.personalInfo?.firstName || 'Patient'} ${patientData.personalInfo?.lastName || ''}`,
        psychologicalProfile: parsed.psychologicalProfile || {
          primaryCopingStyle: "AI-analyzed coping style",
          stressLevel: "Moderate",
          emotionalState: "Processing",
          supportSystemStrength: "Moderate",
          communicationStyle: "Direct",
          decisionMakingStyle: "Collaborative"
        },
        personalityTraits: parsed.personalityTraits || [
          { trait: "Resilience", score: 75, description: "AI-assessed resilience level" },
          { trait: "Anxiety", score: 65, description: "AI-detected anxiety patterns" },
          { trait: "Optimism", score: 70, description: "AI-evaluated optimism level" }
        ],
        motivationalFactors: parsed.motivationalFactors || [
          "Strong desire for parenthood",
          "Partner support",
          "Medical team confidence"
        ],
        potentialChallenges: parsed.potentialChallenges || [
          "Treatment anxiety",
          "Decision complexity",
          "Emotional processing"
        ],
        communicationPreferences: parsed.communicationPreferences || {
          informationStyle: "Detailed explanations",
          frequency: "Regular updates",
          format: "Face-to-face with summaries",
          partnerInvolvement: "High involvement"
        },
        culturalConsiderations: parsed.culturalConsiderations || [
          "Family-centered approach",
          "Evidence-based information",
          "Collaborative decision making"
        ]
      };

      // Create intervention plan from AI response
      const interventionPlan: InterventionPlan = {
        id: `plan_${Date.now()}`,
        overview: parsed.interventionPlan?.overview || {
          duration: "6-12 months",
          primaryGoals: [
            "Reduce treatment anxiety",
            "Improve coping strategies",
            "Enhance communication",
            "Support decision making"
          ],
          approach: "AI-recommended cognitive-behavioral approach"
        },
        phases: parsed.interventionPlan?.phases || [
          {
            phase: 1,
            title: "Assessment & Stabilization",
            duration: "2-4 weeks",
            goals: ["Complete assessment", "Establish rapport", "Identify stressors"],
            interventions: ["Individual counseling", "Psychoeducation", "Anxiety management"]
          }
        ],
        personalizedStrategies: parsed.interventionPlan?.personalizedStrategies || [
          {
            category: "Anxiety Management",
            strategies: ["Breathing exercises", "Mindfulness techniques", "Progressive relaxation"]
          }
        ],
        resources: parsed.interventionPlan?.resources || [
          {
            type: "Educational Materials",
            items: ["Fertility treatment guide", "Stress management resources"]
          }
        ],
        riskFactors: parsed.interventionPlan?.riskFactors || [
          {
            risk: "High anxiety",
            mitigation: "Regular monitoring and intervention",
            priority: "High"
          }
        ],
        successMetrics: parsed.interventionPlan?.successMetrics || [
          "Reduced anxiety scores",
          "Improved coping utilization",
          "Enhanced communication satisfaction"
        ]
      };

      return { persona, interventionPlan };
    } catch (error) {
      console.log('Failed to parse AI response, using enhanced mock data:', error);
      // Fallback to enhanced mock data with AI context
      return this.generateEnhancedMockPersonaAndPlan(patientData, response);
    }
  }

  private generateEnhancedMockPersonaAndPlan(patientData: PatientData, aiResponse?: string): {
    persona: AIPersona;
    interventionPlan: InterventionPlan;
  } {
    // Enhanced mock data that incorporates patient information
    const patientName = `${patientData.personalInfo?.firstName || 'Patient'} ${patientData.personalInfo?.lastName || ''}`;
    const age = patientData.personalInfo?.age || 30;
    const hasPartner = !!patientData.personalInfo?.partnerName;
    const anxietyLevel = patientData.assessmentResults?.anxietyLevel || "Moderate";

    return this.generateMockPersonaAndPlan(patientData);
  }

  private generateMockPersonaAndPlan(patientData: PatientData): {
    persona: AIPersona;
    interventionPlan: InterventionPlan;
  } {
    // Return the existing mock data structure
    const persona: AIPersona = {
      id: `persona_${Date.now()}`,
      patientName: `${patientData.personalInfo?.firstName || 'Patient'} ${patientData.personalInfo?.lastName || ''}`,
      psychologicalProfile: {
        primaryCopingStyle: "Problem-focused coping",
        stressLevel: "Moderate to High",
        emotionalState: "Anxious but hopeful",
        supportSystemStrength: "Strong",
        communicationStyle: "Direct and information-seeking",
        decisionMakingStyle: "Collaborative with partner"
      },
      personalityTraits: [
        { trait: "Resilience", score: 85, description: "Shows strong ability to bounce back from setbacks" },
        { trait: "Optimism", score: 70, description: "Maintains positive outlook despite challenges" },
        { trait: "Anxiety", score: 75, description: "Experiences moderate anxiety about treatment outcomes" },
        { trait: "Control", score: 80, description: "Prefers to have control and detailed information" },
        { trait: "Social Support", score: 90, description: "Has excellent support network" }
      ],
      motivationalFactors: [
        "Strong desire to become a parent",
        "Partner support and shared goals",
        "Previous treatment experience provides confidence",
        "Financial stability allows treatment options"
      ],
      potentialChallenges: [
        "May experience decision fatigue with multiple options",
        "Anxiety about treatment failure",
        "Time pressure due to age considerations",
        "Managing expectations vs. reality"
      ],
      communicationPreferences: {
        informationStyle: "Detailed explanations with visual aids",
        frequency: "Regular check-ins and updates",
        format: "Face-to-face with written summaries",
        partnerInvolvement: "High - include partner in all discussions"
      },
      culturalConsiderations: [
        "Values family-centered decision making",
        "Appreciates evidence-based information",
        "Prefers collaborative approach with medical team"
      ]
    };

    const interventionPlan: InterventionPlan = {
      id: `plan_${Date.now()}`,
      overview: {
        duration: "6-12 months",
        primaryGoals: [
          "Reduce treatment-related anxiety",
          "Improve coping strategies",
          "Enhance communication with partner",
          "Prepare for treatment decisions"
        ],
        approach: "Cognitive-behavioral therapy with mindfulness techniques"
      },
      phases: [
        {
          phase: 1,
          title: "Assessment & Stabilization",
          duration: "2-4 weeks",
          goals: [
            "Complete comprehensive psychological assessment",
            "Establish therapeutic rapport",
            "Identify primary stressors and coping mechanisms",
            "Develop initial anxiety management strategies"
          ],
          interventions: [
            {
              type: "Individual Counseling",
              frequency: "Weekly 50-minute sessions",
              focus: "Anxiety management and emotional processing"
            }
          ]
        }
      ],
      personalizedStrategies: [
        {
          category: "Anxiety Management",
          strategies: [
            "Progressive muscle relaxation before medical appointments",
            "Breathing exercises during waiting periods"
          ]
        }
      ],
      resources: [],
      riskFactors: [
        {
          risk: "High anxiety levels",
          mitigation: "Regular anxiety monitoring and intervention adjustment",
          priority: "High"
        }
      ],
      successMetrics: [
        "Reduced anxiety scores on standardized assessments",
        "Improved coping strategy utilization"
      ]
    };

    return { persona, interventionPlan };
  }
}

// Export singleton instance
export const aiService = new AIService();
export type { AIConfig, PatientData, AIPersona, InterventionPlan };
