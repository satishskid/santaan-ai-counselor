import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  User,
  Heart,
  Coins,
  Stethoscope,
  Home,
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface Assessment {
  title: string;
  description: string;
  icon: React.ReactNode;
  questions: Question[];
  color: string;
}

const AssessmentDashboard = () => {
  const [activeTab, setActiveTab] = useState("emotional");
  const [completedQuestions, setCompletedQuestions] = useState<
    Record<string, Record<string, string>>
  >({});
  const [notes, setNotes] = useState("");
  const [personaGenerated, setPersonaGenerated] = useState(false);

  const assessments: Record<string, Assessment> = {
    emotional: {
      title: "Emotional Needs Assessment",
      description:
        "Evaluate psychological well-being and emotional support requirements based on ESHRE guidelines.",
      icon: <Heart className="h-5 w-5 text-rose-500" />,
      color: "bg-rose-100",
      questions: [
        {
          id: "e1",
          text: "How would you rate your current stress level related to fertility treatment?",
          options: ["Low", "Moderate", "High", "Very High"],
        },
        {
          id: "e2",
          text: "Do you have a support system in place (partner, family, friends)?",
          options: [
            "Strong support",
            "Some support",
            "Limited support",
            "No support",
          ],
        },
        {
          id: "e3",
          text: "Have you experienced symptoms of anxiety or depression related to fertility issues?",
          options: ["None", "Mild", "Moderate", "Severe"],
        },
        {
          id: "e4",
          text: "How has infertility affected your relationship with your partner?",
          options: [
            "Strengthened it",
            "No change",
            "Some strain",
            "Significant strain",
          ],
        },
        {
          id: "e5",
          text: "How do you typically cope with disappointment or setbacks?",
          options: [
            "Very well",
            "Adequately",
            "With difficulty",
            "Poor coping",
          ],
        },
      ],
    },
    financial: {
      title: "Financial Needs Assessment",
      description:
        "Evaluate financial readiness and support requirements for fertility treatment.",
      icon: <Coins className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-100",
      questions: [
        {
          id: "f1",
          text: "How would you describe your understanding of the costs associated with IVF treatment?",
          options: ["Very clear", "Somewhat clear", "Unclear", "Very unclear"],
        },
        {
          id: "f2",
          text: "Do you have insurance coverage for fertility treatments?",
          options: [
            "Full coverage",
            "Partial coverage",
            "Minimal coverage",
            "No coverage",
          ],
        },
        {
          id: "f3",
          text: "Have you established a budget for fertility treatments?",
          options: ["Yes, comprehensive", "Yes, basic", "In progress", "No"],
        },
        {
          id: "f4",
          text: "Are you aware of financial assistance programs or options?",
          options: [
            "Very aware",
            "Somewhat aware",
            "Limited awareness",
            "Not aware",
          ],
        },
        {
          id: "f5",
          text: "How concerned are you about the financial impact of treatment?",
          options: [
            "Not concerned",
            "Slightly concerned",
            "Moderately concerned",
            "Very concerned",
          ],
        },
      ],
    },
    clinical: {
      title: "Clinical Needs Assessment",
      description:
        "Evaluate medical understanding and clinical support requirements based on ESHRE guidelines.",
      icon: <Stethoscope className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100",
      questions: [
        {
          id: "c1",
          text: "How would you rate your understanding of your fertility diagnosis?",
          options: ["Very clear", "Somewhat clear", "Unclear", "Very unclear"],
        },
        {
          id: "c2",
          text: "How comfortable are you with the proposed treatment procedures?",
          options: [
            "Very comfortable",
            "Somewhat comfortable",
            "Somewhat uncomfortable",
            "Very uncomfortable",
          ],
        },
        {
          id: "c3",
          text: "Do you understand the potential side effects of medications and procedures?",
          options: [
            "Fully understand",
            "Mostly understand",
            "Partially understand",
            "Do not understand",
          ],
        },
        {
          id: "c4",
          text: "How would you rate your understanding of treatment success rates?",
          options: ["Very clear", "Somewhat clear", "Unclear", "Very unclear"],
        },
        {
          id: "c5",
          text: "Are you aware of alternative treatment options if this cycle is unsuccessful?",
          options: [
            "Very aware",
            "Somewhat aware",
            "Limited awareness",
            "Not aware",
          ],
        },
      ],
    },
  };

  const calculateProgress = (assessmentType: string) => {
    if (!completedQuestions[assessmentType]) return 0;
    const totalQuestions = assessments[assessmentType].questions.length;
    const answeredQuestions = Object.keys(
      completedQuestions[assessmentType],
    ).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleAnswerSelect = (
    assessmentType: string,
    questionId: string,
    answer: string,
  ) => {
    setCompletedQuestions((prev) => ({
      ...prev,
      [assessmentType]: {
        ...(prev[assessmentType] || {}),
        [questionId]: answer,
      },
    }));
  };

  const handleGeneratePersona = () => {
    setPersonaGenerated(true);
  };

  const getTotalProgress = () => {
    const types = Object.keys(assessments);
    const sum = types.reduce((acc, type) => acc + calculateProgress(type), 0);
    return sum / types.length;
  };

  const getPersonaDetails = () => {
    // This would be more sophisticated in a real implementation
    // Here we're just providing a simple example
    const emotionalSupport = getAssessmentLevel("emotional");
    const financialSupport = getAssessmentLevel("financial");
    const clinicalSupport = getAssessmentLevel("clinical");

    return {
      emotionalSupport,
      financialSupport,
      clinicalSupport,
      summary: `Patient requires ${emotionalSupport} emotional support, ${financialSupport} financial guidance, and ${clinicalSupport} clinical information.`,
      recommendations: generateRecommendations(
        emotionalSupport,
        financialSupport,
        clinicalSupport,
      ),
    };
  };

  const getAssessmentLevel = (type: string): string => {
    if (
      !completedQuestions[type] ||
      Object.keys(completedQuestions[type]).length === 0
    ) {
      return "unknown";
    }

    const answers = Object.values(completedQuestions[type]);
    const concernCount = answers.filter((answer) =>
      [
        "High",
        "Very High",
        "Limited support",
        "No support",
        "Moderate",
        "Severe",
        "Some strain",
        "Significant strain",
        "With difficulty",
        "Poor coping",
        "Unclear",
        "Very unclear",
        "Minimal coverage",
        "No coverage",
        "In progress",
        "No",
        "Limited awareness",
        "Not aware",
        "Moderately concerned",
        "Very concerned",
        "Somewhat uncomfortable",
        "Very uncomfortable",
        "Partially understand",
        "Do not understand",
      ].includes(answer),
    ).length;

    const percentage = (concernCount / answers.length) * 100;

    if (percentage >= 75) return "high";
    if (percentage >= 40) return "moderate";
    return "low";
  };

  const generateRecommendations = (
    emotional: string,
    financial: string,
    clinical: string,
  ) => {
    const recommendations = [];

    if (emotional === "high") {
      recommendations.push(
        "Consider referral to specialized fertility counselor",
      );
      recommendations.push("Provide access to support groups");
    } else if (emotional === "moderate") {
      recommendations.push("Regular check-ins for emotional support");
      recommendations.push("Provide coping strategy resources");
    }

    if (financial === "high") {
      recommendations.push("Schedule financial planning consultation");
      recommendations.push(
        "Provide information on financial assistance programs",
      );
    } else if (financial === "moderate") {
      recommendations.push("Offer budgeting tools and resources");
    }

    if (clinical === "high") {
      recommendations.push(
        "Additional educational sessions on treatment procedures",
      );
      recommendations.push(
        "Provide simplified visual materials explaining the process",
      );
    } else if (clinical === "moderate") {
      recommendations.push(
        "Provide additional reading materials on treatment options",
      );
    }

    return recommendations.length > 0
      ? recommendations
      : ["No specific recommendations at this time"];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-6xl mx-auto">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Assessment Dashboard
          </h1>
          <p className="text-gray-500">
            Evaluate patient needs based on ESHRE guidelines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-2xl font-bold">
              {Math.round(getTotalProgress())}%
            </p>
          </div>
          <Progress value={getTotalProgress()} className="w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(assessments).map(([key, assessment]) => (
          <Card key={key} className="overflow-hidden">
            <CardHeader
              className={`${assessment.color} flex flex-row items-center gap-2`}
            >
              {assessment.icon}
              <div>
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <CardDescription className="text-xs">
                  {calculateProgress(key) === 100 ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" /> Completed
                    </span>
                  ) : (
                    <span>{Math.round(calculateProgress(key))}% complete</span>
                  )}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">{assessment.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab(key)}
              >
                {calculateProgress(key) === 0
                  ? "Start Assessment"
                  : "Continue Assessment"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="emotional" className="flex items-center gap-2">
            <Heart className="h-4 w-4" /> Emotional
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <Coins className="h-4 w-4" /> Financial
          </TabsTrigger>
          <TabsTrigger value="clinical" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" /> Clinical
          </TabsTrigger>
        </TabsList>

        {Object.entries(assessments).map(([key, assessment]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessment.questions.map((question) => (
                  <div key={question.id} className="space-y-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="font-medium">{question.text}</p>
                    </div>
                    <RadioGroup
                      value={completedQuestions[key]?.[question.id] || ""}
                      onValueChange={(value) =>
                        handleAnswerSelect(key, question.id, value)
                      }
                      className="grid grid-cols-2 gap-2"
                    >
                      {question.options.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${option}`}
                          />
                          <Label htmlFor={`${question.id}-${option}`}>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Separator />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    setActiveTab(
                      Object.keys(assessments)[
                        (Object.keys(assessments).indexOf(key) + 2) % 3
                      ],
                    )
                  }
                >
                  Previous Assessment
                </Button>
                <Button
                  onClick={() =>
                    setActiveTab(
                      Object.keys(assessments)[
                        (Object.keys(assessments).indexOf(key) + 1) % 3
                      ],
                    )
                  }
                >
                  Next Assessment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Patient Persona
            </CardTitle>
            <CardDescription>
              Auto-generated patient profile based on assessment responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {personaGenerated ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Emotional Support</p>
                    <Badge
                      variant={
                        getPersonaDetails().emotionalSupport === "high"
                          ? "destructive"
                          : getPersonaDetails().emotionalSupport === "moderate"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {getPersonaDetails().emotionalSupport.toUpperCase()} NEED
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Financial Guidance</p>
                    <Badge
                      variant={
                        getPersonaDetails().financialSupport === "high"
                          ? "destructive"
                          : getPersonaDetails().financialSupport === "moderate"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {getPersonaDetails().financialSupport.toUpperCase()} NEED
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Clinical Information</p>
                    <Badge
                      variant={
                        getPersonaDetails().clinicalSupport === "high"
                          ? "destructive"
                          : getPersonaDetails().clinicalSupport === "moderate"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {getPersonaDetails().clinicalSupport.toUpperCase()} NEED
                    </Badge>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-sm text-gray-600">
                    {getPersonaDetails().summary}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">
                    Recommended Interventions
                  </h4>
                  <ul className="space-y-1">
                    {getPersonaDetails().recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Persona Generated
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Complete the assessments and generate a patient persona to
                  view personalized recommendations based on ESHRE guidelines.
                </p>
                <Button
                  onClick={handleGeneratePersona}
                  disabled={getTotalProgress() < 50}
                >
                  {getTotalProgress() < 50
                    ? "Complete at least 50% of assessments"
                    : "Generate Patient Persona"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Counselor Notes
            </CardTitle>
            <CardDescription>
              Add your observations and additional context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your notes about the patient's assessment results..."
              className="min-h-[200px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Notes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
