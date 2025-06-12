import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { aiService } from "@/services/aiService";
import {
  Brain,
  User,
  Heart,
  Target,
  Lightbulb,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  RefreshCw,
  Download,
  Share,
  BookOpen,
  MessageCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Star,
  ArrowRight,
  FileText,
  Activity
} from "lucide-react";
import BackToHome from "./BackToHome";

interface PatientData {
  personalInfo: any;
  medicalHistory: any;
  fertilityJourney: any;
  assessmentResults: any;
}

interface AIPersonaGeneratorProps {
  patientData: PatientData;
  onComplete?: (persona: any, interventionPlan: any) => void;
}

const AIPersonaGenerator: React.FC<AIPersonaGeneratorProps> = ({ patientData, onComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [persona, setPersona] = useState<any>(null);
  const [interventionPlan, setInterventionPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("persona");
  const [aiConfig, setAiConfig] = useState(aiService.getConfig());
  const [currentPatientData, setCurrentPatientData] = useState(patientData);

  // Sample patient data for testing
  const loadSamplePatientData = () => {
    const sampleData = {
      personalInfo: {
        firstName: "Sarah",
        lastName: "Johnson",
        age: 32,
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        partnerName: "Michael Johnson",
        relationshipDuration: "5 years",
        occupation: "Marketing Manager"
      },
      medicalHistory: {
        previousTreatments: "2 IUI cycles (unsuccessful), fertility medications for 8 months",
        medicalConditions: "PCOS (Polycystic Ovary Syndrome), mild hypothyroidism",
        medications: "Metformin 500mg daily, Levothyroxine 75mcg daily",
        allergies: "Penicillin",
        familyHistory: "Mother had fertility issues, maternal grandmother had diabetes"
      },
      fertilityJourney: {
        tryingToConceiveSince: "3 years",
        previousIVFAttempts: "None - this will be first IVF cycle",
        challenges: "Irregular ovulation due to PCOS, anxiety about treatment failure, financial stress",
        expectations: "Hopeful but realistic about success rates, wants to be fully informed about process",
        supportSystem: "Strong partner support, close relationship with sister who went through IVF"
      },
      assessmentResults: {
        anxietyLevel: "Moderate to High (7/10)",
        depressionScreening: "Mild symptoms (4/10)",
        copingStrategies: "Exercise, talking with partner, reading about fertility",
        stressors: "Work pressure, family questions, financial concerns, time pressure due to age",
        strengths: "Strong relationship, good communication skills, proactive approach to health"
      }
    };
    setCurrentPatientData(sampleData);
  };

  // Generate AI persona and intervention plan using configured AI service
  const generateAIPersonaAndPlan = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressSteps = [
        { step: 20, message: "Analyzing patient data..." },
        { step: 40, message: "Generating psychological profile..." },
        { step: 60, message: "Creating intervention strategies..." },
        { step: 80, message: "Personalizing recommendations..." },
        { step: 100, message: "Finalizing plan..." }
      ];

      // Update progress with delays to show realistic generation time
      const progressPromise = (async () => {
        for (const { step, message } of progressSteps) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setGenerationProgress(step);
        }
      })();

      // Generate using AI service (this will use configured API or fallback to mock)
      const result = await aiService.generatePersonaAndPlan(currentPatientData);

      // Wait for progress animation to complete
      await progressPromise;

      setPersona(result.persona);
      setInterventionPlan(result.interventionPlan);

      if (onComplete) {
        onComplete(result.persona, result.interventionPlan);
      }
    } catch (error) {
      console.error('Failed to generate AI analysis:', error);
      // Show error state or fallback
      alert('Failed to generate AI analysis. Please check your API configuration in the admin panel.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockPersona = (data: PatientData) => {
    // This would be replaced with actual AI API call
    return {
      id: `persona_${Date.now()}`,
      patientName: `${data.personalInfo?.firstName || 'Patient'} ${data.personalInfo?.lastName || ''}`,
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
  };

  const generateMockInterventionPlan = (data: PatientData, persona: any) => {
    return {
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
            },
            {
              type: "Psychoeducation",
              frequency: "As needed",
              focus: "Understanding fertility treatment process and emotional responses"
            },
            {
              type: "Mindfulness Training",
              frequency: "Daily practice, weekly review",
              focus: "Stress reduction and emotional regulation"
            }
          ]
        },
        {
          phase: 2,
          title: "Skill Building & Preparation",
          duration: "4-6 weeks",
          goals: [
            "Develop advanced coping strategies",
            "Improve communication with partner and medical team",
            "Prepare for treatment decision-making",
            "Build resilience for potential setbacks"
          ],
          interventions: [
            {
              type: "Couples Counseling",
              frequency: "Bi-weekly sessions",
              focus: "Communication, shared decision-making, mutual support"
            },
            {
              type: "Cognitive Restructuring",
              frequency: "Weekly practice",
              focus: "Challenging negative thought patterns and catastrophic thinking"
            },
            {
              type: "Decision-Making Support",
              frequency: "As needed",
              focus: "Treatment option evaluation and choice preparation"
            }
          ]
        },
        {
          phase: 3,
          title: "Treatment Support & Maintenance",
          duration: "Ongoing",
          goals: [
            "Provide ongoing emotional support during treatment",
            "Maintain coping strategies under stress",
            "Process treatment experiences and outcomes",
            "Plan for various scenarios (success, failure, next steps)"
          ],
          interventions: [
            {
              type: "Check-in Sessions",
              frequency: "Bi-weekly or as needed",
              focus: "Ongoing support and strategy adjustment"
            },
            {
              type: "Crisis Support",
              frequency: "Available as needed",
              focus: "Immediate support for treatment setbacks or emotional crises"
            },
            {
              type: "Outcome Processing",
              frequency: "After each treatment cycle",
              focus: "Processing results and planning next steps"
            }
          ]
        }
      ],
      personalizedStrategies: [
        {
          category: "Anxiety Management",
          strategies: [
            "Progressive muscle relaxation before medical appointments",
            "Breathing exercises during waiting periods",
            "Visualization techniques for positive outcomes",
            "Grounding techniques for overwhelming moments"
          ]
        },
        {
          category: "Communication Enhancement",
          strategies: [
            "Prepare questions before medical appointments",
            "Use 'I' statements when discussing concerns with partner",
            "Schedule regular check-ins with partner about feelings",
            "Practice assertive communication with medical team"
          ]
        },
        {
          category: "Lifestyle Optimization",
          strategies: [
            "Maintain regular exercise routine for stress management",
            "Prioritize sleep hygiene during treatment cycles",
            "Engage in enjoyable activities unrelated to fertility",
            "Build and maintain social connections outside of fertility journey"
          ]
        }
      ],
      resources: [
        {
          type: "Educational Materials",
          items: [
            "Understanding IVF: A Complete Guide",
            "Managing Fertility Treatment Stress",
            "Communication Strategies for Couples"
          ]
        },
        {
          type: "Support Groups",
          items: [
            "Local fertility support group meetings",
            "Online fertility community forums",
            "Couples fertility support groups"
          ]
        },
        {
          type: "Apps & Tools",
          items: [
            "Mindfulness meditation app",
            "Fertility tracking application",
            "Mood and anxiety tracking tools"
          ]
        }
      ],
      riskFactors: [
        {
          risk: "High anxiety levels",
          mitigation: "Regular anxiety monitoring and intervention adjustment",
          priority: "High"
        },
        {
          risk: "Treatment decision overwhelm",
          mitigation: "Structured decision-making support and information processing",
          priority: "Medium"
        },
        {
          risk: "Relationship strain",
          mitigation: "Couples counseling and communication skill building",
          priority: "Medium"
        }
      ],
      successMetrics: [
        "Reduced anxiety scores on standardized assessments",
        "Improved coping strategy utilization",
        "Enhanced communication satisfaction ratings",
        "Increased treatment adherence and engagement",
        "Better emotional regulation during treatment cycles"
      ]
    };
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
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Brain className="mr-3 h-8 w-8" />
                AI-Generated Patient Persona & Intervention Plan
              </h1>
              <p className="text-white/90 text-lg">
                Personalized psychological profile and evidence-based intervention strategies
              </p>
              <div className="mt-3 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${aiConfig.provider === 'mock' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                <span className="text-white/80 text-sm">
                  {aiConfig.provider === 'mock'
                    ? 'Using simulated AI analysis'
                    : `Connected to ${aiConfig.provider.toUpperCase()} (${aiConfig.modelName})`
                  }
                </span>
                {aiConfig.provider === 'mock' && (
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    Configure API in Admin Panel
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={loadSamplePatientData}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <User className="mr-2 h-4 w-4" />
                Load Sample Patient
              </Button>
              {!isGenerating && (
                <Button
                  onClick={generateAIPersonaAndPlan}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  disabled={!currentPatientData.personalInfo?.firstName}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {persona ? 'Regenerate' : 'Generate'} AI Analysis
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Patient Data Summary */}
        {currentPatientData.personalInfo?.firstName && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-santaan-primary" />
                Patient Data Summary
              </CardTitle>
              <CardDescription>
                Current patient information that will be analyzed by AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-santaan-primary">Personal Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {currentPatientData.personalInfo.firstName} {currentPatientData.personalInfo.lastName}</p>
                    <p><strong>Age:</strong> {currentPatientData.personalInfo.age}</p>
                    <p><strong>Partner:</strong> {currentPatientData.personalInfo.partnerName}</p>
                    <p><strong>Occupation:</strong> {currentPatientData.personalInfo.occupation}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-santaan-secondary">Medical History</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Conditions:</strong> {currentPatientData.medicalHistory.medicalConditions}</p>
                    <p><strong>Previous Treatments:</strong> {currentPatientData.medicalHistory.previousTreatments}</p>
                    <p><strong>Medications:</strong> {currentPatientData.medicalHistory.medications}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-santaan-tertiary">Fertility Journey</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Trying Since:</strong> {currentPatientData.fertilityJourney.tryingToConceiveSince}</p>
                    <p><strong>Previous IVF:</strong> {currentPatientData.fertilityJourney.previousIVFAttempts}</p>
                    <p><strong>Main Challenges:</strong> {currentPatientData.fertilityJourney.challenges}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Assessment Results</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Anxiety Level: {currentPatientData.assessmentResults.anxietyLevel} |
                  Depression: {currentPatientData.assessmentResults.depressionScreening} |
                  Strengths: {currentPatientData.assessmentResults.strengths}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-santaan-primary animate-pulse" />
                AI Analysis in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={generationProgress} className="w-full" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {generationProgress < 20 ? "Analyzing patient data..." :
                     generationProgress < 40 ? "Generating psychological profile..." :
                     generationProgress < 60 ? "Creating intervention strategies..." :
                     generationProgress < 80 ? "Personalizing recommendations..." :
                     "Finalizing plan..."}
                  </span>
                  <span className="font-semibold">{generationProgress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {persona && interventionPlan && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="persona" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Patient Persona
              </TabsTrigger>
              <TabsTrigger value="intervention" className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Intervention Plan
              </TabsTrigger>
            </TabsList>

            {/* Patient Persona Tab */}
            <TabsContent value="persona" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Psychological Profile */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-santaan-primary" />
                      Psychological Profile
                    </CardTitle>
                    <CardDescription>AI-generated psychological assessment based on patient data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Coping Style</h4>
                        <p className="text-sm text-muted-foreground">{persona.psychologicalProfile.primaryCopingStyle}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Stress Level</h4>
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {persona.psychologicalProfile.stressLevel}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Emotional State</h4>
                        <p className="text-sm text-muted-foreground">{persona.psychologicalProfile.emotionalState}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Support System</h4>
                        <Badge variant="outline" className="border-green-200 text-green-700">
                          {persona.psychologicalProfile.supportSystemStrength}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Communication Style</h4>
                        <p className="text-sm text-muted-foreground">{persona.psychologicalProfile.communicationStyle}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Decision Making</h4>
                        <p className="text-sm text-muted-foreground">{persona.psychologicalProfile.decisionMakingStyle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personality Traits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5 text-santaan-secondary" />
                      Personality Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {persona.personalityTraits.map((trait: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{trait.trait}</span>
                            <span className="text-sm text-muted-foreground">{trait.score}%</span>
                          </div>
                          <Progress value={trait.score} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{trait.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Motivational Factors & Challenges */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-santaan-success" />
                      Motivational Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {persona.motivationalFactors.map((factor: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-santaan-warning" />
                      Potential Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {persona.potentialChallenges.map((challenge: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Communication Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-santaan-tertiary" />
                    Communication Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Information Style</h4>
                      <p className="text-sm text-muted-foreground">{persona.communicationPreferences.informationStyle}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Frequency</h4>
                      <p className="text-sm text-muted-foreground">{persona.communicationPreferences.frequency}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Format</h4>
                      <p className="text-sm text-muted-foreground">{persona.communicationPreferences.format}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Partner Involvement</h4>
                      <p className="text-sm text-muted-foreground">{persona.communicationPreferences.partnerInvolvement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Intervention Plan Tab */}
            <TabsContent value="intervention" className="space-y-6">
              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-santaan-primary" />
                    Intervention Plan Overview
                  </CardTitle>
                  <CardDescription>Personalized evidence-based intervention strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <Badge className="bg-santaan-primary/10 text-santaan-primary border-santaan-primary/20">
                        {interventionPlan.overview.duration}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Approach</h4>
                      <p className="text-sm text-muted-foreground">{interventionPlan.overview.approach}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Primary Goals</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {interventionPlan.overview.primaryGoals.slice(0, 2).map((goal: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {goal}
                          </li>
                        ))}
                        {interventionPlan.overview.primaryGoals.length > 2 && (
                          <li className="text-xs text-muted-foreground">
                            +{interventionPlan.overview.primaryGoals.length - 2} more goals
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Phases */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Treatment Phases</h3>
                {interventionPlan.phases.map((phase: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="bg-santaan-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                          {phase.phase}
                        </div>
                        {phase.title}
                        <Badge variant="outline" className="ml-auto">
                          {phase.duration}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Goals</h4>
                          <ul className="space-y-2">
                            {phase.goals.map((goal: string, goalIndex: number) => (
                              <li key={goalIndex} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Interventions</h4>
                          <div className="space-y-3">
                            {phase.interventions.map((intervention: any, intIndex: number) => (
                              <div key={intIndex} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-medium text-sm">{intervention.type}</h5>
                                  <Badge variant="secondary" className="text-xs">
                                    {intervention.frequency}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{intervention.focus}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Personalized Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-santaan-secondary" />
                    Personalized Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {interventionPlan.personalizedStrategies.map((category: any, index: number) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <div className="bg-santaan-tertiary/10 p-2 rounded-lg mr-2">
                            <Activity className="h-4 w-4 text-santaan-tertiary" />
                          </div>
                          {category.category}
                        </h4>
                        <ul className="space-y-2">
                          {category.strategies.map((strategy: string, stratIndex: number) => (
                            <li key={stratIndex} className="flex items-start">
                              <Zap className="h-3 w-3 text-santaan-secondary mr-2 mt-1 flex-shrink-0" />
                              <span className="text-sm">{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Action Buttons */}
        {persona && interventionPlan && (
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline">
              <Share className="mr-2 h-4 w-4" />
              Share with Team
            </Button>
            <Button className="bg-santaan-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPersonaGenerator;
