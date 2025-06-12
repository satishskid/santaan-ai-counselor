import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Brain,
  User,
  FileText,
  Activity,
  Target,
  Sparkles,
  AlertCircle,
  Info,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  icon: React.ComponentType<any>;
  route?: string;
  estimatedTime?: string;
}

interface WorkflowIntegrationProps {
  patientId?: string;
  currentStep?: string;
}

const WorkflowIntegration: React.FC<WorkflowIntegrationProps> = ({ 
  patientId = "patient_123", 
  currentStep = "onboarding" 
}) => {
  const [workflowSteps] = useState<WorkflowStep[]>([
    {
      id: "onboarding",
      title: "Patient Onboarding",
      description: "Collect comprehensive patient information, medical history, and fertility journey details",
      status: currentStep === "onboarding" ? "current" : "completed",
      icon: User,
      route: "/patient-onboarding",
      estimatedTime: "15-20 minutes"
    },
    {
      id: "assessment",
      title: "Psychological Assessment",
      description: "Conduct detailed psychological evaluation and emotional readiness assessment",
      status: currentStep === "assessment" ? "current" : 
             currentStep === "onboarding" ? "pending" : "completed",
      icon: Activity,
      route: "/assessment",
      estimatedTime: "30-45 minutes"
    },
    {
      id: "ai-analysis",
      title: "AI Persona Generation",
      description: "Generate comprehensive patient persona and personalized intervention plan using AI",
      status: currentStep === "ai-analysis" ? "current" : 
             ["onboarding", "assessment"].includes(currentStep) ? "pending" : "completed",
      icon: Brain,
      route: "/ai-persona",
      estimatedTime: "2-3 minutes"
    },
    {
      id: "treatment-plan",
      title: "Treatment Planning",
      description: "Develop personalized treatment plan based on AI insights and clinical assessment",
      status: currentStep === "treatment-plan" ? "current" : 
             ["onboarding", "assessment", "ai-analysis"].includes(currentStep) ? "pending" : "completed",
      icon: Target,
      route: "/treatment-plan",
      estimatedTime: "20-30 minutes"
    },
    {
      id: "intervention",
      title: "Intervention Implementation",
      description: "Begin counseling sessions and implement personalized intervention strategies",
      status: currentStep === "intervention" ? "current" : "pending",
      icon: FileText,
      route: "/progress-tracker",
      estimatedTime: "Ongoing"
    }
  ]);

  const getStepIcon = (step: WorkflowStep) => {
    const IconComponent = step.icon;
    if (step.status === "completed") {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (step.status === "current") {
      return <IconComponent className="h-6 w-6 text-santaan-primary" />;
    } else {
      return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepColor = (step: WorkflowStep) => {
    if (step.status === "completed") return "border-green-200 bg-green-50";
    if (step.status === "current") return "border-santaan-primary bg-santaan-primary/5";
    return "border-gray-200 bg-gray-50";
  };

  const getProgressPercentage = () => {
    const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
    const currentStepIndex = workflowSteps.findIndex(step => step.status === "current");
    const totalProgress = completedSteps + (currentStepIndex >= 0 ? 0.5 : 0);
    return (totalProgress / workflowSteps.length) * 100;
  };

  const getCurrentStepData = () => {
    return workflowSteps.find(step => step.status === "current");
  };

  const getNextStepData = () => {
    const currentIndex = workflowSteps.findIndex(step => step.status === "current");
    return currentIndex >= 0 && currentIndex < workflowSteps.length - 1 
      ? workflowSteps[currentIndex + 1] 
      : null;
  };

  const currentStepData = getCurrentStepData();
  const nextStepData = getNextStepData();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Patient Care Workflow</h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive patient journey from onboarding to personalized intervention
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-santaan-primary" />
              Workflow Progress
            </CardTitle>
            <CardDescription>
              Patient ID: {patientId} • Overall completion: {Math.round(getProgressPercentage())}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressPercentage()} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData && (
                <div className="p-4 border rounded-lg bg-santaan-primary/5 border-santaan-primary/20">
                  <h4 className="font-semibold text-santaan-primary mb-2">Current Step</h4>
                  <p className="text-sm font-medium">{currentStepData.title}</p>
                  <p className="text-xs text-muted-foreground">{currentStepData.description}</p>
                  {currentStepData.estimatedTime && (
                    <Badge variant="outline" className="mt-2">
                      {currentStepData.estimatedTime}
                    </Badge>
                  )}
                </div>
              )}
              {nextStepData && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-muted-foreground mb-2">Next Step</h4>
                  <p className="text-sm font-medium">{nextStepData.title}</p>
                  <p className="text-xs text-muted-foreground">{nextStepData.description}</p>
                  {nextStepData.estimatedTime && (
                    <Badge variant="secondary" className="mt-2">
                      {nextStepData.estimatedTime}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <Card key={step.id} className={`transition-all ${getStepColor(step)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        {step.status === "completed" && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Completed
                          </Badge>
                        )}
                        {step.status === "current" && (
                          <Badge className="bg-santaan-primary text-white">
                            In Progress
                          </Badge>
                        )}
                        {step.status === "pending" && (
                          <Badge variant="outline">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{step.description}</p>
                      {step.estimatedTime && (
                        <p className="text-sm text-muted-foreground">
                          Estimated time: {step.estimatedTime}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {step.status === "current" && step.route && (
                      <Button asChild className="bg-santaan-primary">
                        <Link to={step.route}>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {step.status === "completed" && step.route && (
                      <Button variant="outline" asChild>
                        <Link to={step.route}>
                          Review
                        </Link>
                      </Button>
                    )}
                    {step.status === "pending" && (
                      <Button variant="ghost" disabled>
                        Waiting
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Special AI Analysis Step Information */}
                {step.id === "ai-analysis" && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-santaan-primary/10 to-santaan-secondary/10 rounded-lg border border-santaan-primary/20">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-santaan-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-santaan-primary mb-2">AI-Powered Analysis</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our advanced AI system will analyze the patient's onboarding data and assessment results to generate:
                        </p>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Comprehensive psychological profile
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Personalized intervention strategies
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Evidence-based treatment recommendations
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Risk assessment and mitigation plans
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Seamless Integration</h4>
                <p className="text-sm text-blue-800 mb-3">
                  The AI Persona Generator seamlessly integrates into your existing workflow without disrupting current processes. 
                  It enhances your clinical decision-making by providing data-driven insights and personalized recommendations.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Automatically triggered after assessment completion</li>
                  <li>• Uses existing patient data - no additional input required</li>
                  <li>• Generates actionable insights in minutes</li>
                  <li>• Integrates with treatment planning and progress tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowIntegration;
