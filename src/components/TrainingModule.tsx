import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Users,
  FileText,
  Activity,
  CalendarIcon,
  MessageCircle,
  Award,
  Monitor,
  Home,
  ChevronRight,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Clock,
  Star
} from "lucide-react";

interface TrainingModuleProps {
  moduleId: string;
  onComplete: (moduleId: string) => void;
  onBack: () => void;
}

const TrainingModule: React.FC<TrainingModuleProps> = ({ moduleId, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const modules = {
    overview: {
      title: "Platform Overview",
      icon: Home,
      duration: "15 min",
      description: "Introduction to Santaan Counselor platform and key features",
      steps: [
        {
          title: "Welcome to Santaan Counselor",
          type: "intro",
          content: {
            heading: "Your Complete IVF Counseling Platform",
            text: "Santaan Counselor is designed specifically for fertility counselors to provide comprehensive, evidence-based care to patients undergoing IVF treatment. This platform integrates ESHRE guidelines with modern technology to streamline your workflow.",
            keyPoints: [
              "Patient-centered care approach",
              "ESHRE guideline compliance",
              "Comprehensive patient tracking",
              "Evidence-based assessment tools",
              "Integrated communication features"
            ],
            image: "platform-overview.jpg"
          }
        },
        {
          title: "Core Features",
          type: "features",
          content: {
            heading: "Essential Platform Capabilities",
            features: [
              {
                icon: Users,
                title: "Patient Management",
                description: "Complete patient lifecycle from onboarding to treatment completion",
                benefits: ["Centralized patient records", "Treatment history tracking", "Progress monitoring"]
              },
              {
                icon: FileText,
                title: "Assessment Tools",
                description: "ESHRE-compliant assessment instruments and questionnaires",
                benefits: ["Standardized assessments", "Automated scoring", "Progress tracking"]
              },
              {
                icon: Activity,
                title: "Treatment Planning",
                description: "Milestone-based treatment plans with progress tracking",
                benefits: ["Structured planning", "Goal setting", "Progress visualization"]
              },
              {
                icon: CalendarIcon,
                title: "Appointment Management",
                description: "Integrated scheduling and appointment tracking",
                benefits: ["Calendar integration", "Reminder system", "Session notes"]
              }
            ]
          }
        },
        {
          title: "Getting Started",
          type: "checklist",
          content: {
            heading: "Your First Steps",
            text: "Before you begin using the platform with patients, complete these essential setup tasks:",
            checklist: [
              {
                task: "Complete all training modules",
                description: "Ensure you understand all platform features",
                estimated: "2-3 hours",
                priority: "high"
              },
              {
                task: "Review ESHRE guidelines",
                description: "Familiarize yourself with current best practices",
                estimated: "30 minutes",
                priority: "high"
              },
              {
                task: "Practice with demo patients",
                description: "Use sample data to practice workflows",
                estimated: "1 hour",
                priority: "medium"
              },
              {
                task: "Set up your profile",
                description: "Complete your counselor profile and preferences",
                estimated: "10 minutes",
                priority: "low"
              }
            ]
          }
        },
        {
          title: "Support & Resources",
          type: "support",
          content: {
            heading: "Getting Help When You Need It",
            text: "We provide comprehensive support to ensure your success with the platform:",
            supportOptions: [
              {
                type: "Technical Support",
                availability: "24/7",
                contact: "support@santaan.in",
                description: "Platform issues, login problems, technical questions"
              },
              {
                type: "Clinical Support",
                availability: "Business hours",
                contact: "clinical@santaan.in",
                description: "ESHRE guidelines, best practices, clinical questions"
              },
              {
                type: "Training Support",
                availability: "Business hours",
                contact: "training@santaan.in",
                description: "Additional training, workflow questions, feature requests"
              }
            ]
          }
        }
      ]
    },
    dashboard: {
      title: "Dashboard Navigation",
      icon: Monitor,
      duration: "10 min",
      description: "Master the dashboard interface and navigation",
      steps: [
        {
          title: "Dashboard Layout",
          type: "interface",
          content: {
            heading: "Understanding Your Dashboard",
            text: "The dashboard is your central hub for all patient management activities. Let's explore each section:",
            sections: [
              {
                name: "Navigation Sidebar",
                description: "Access all major features from the left sidebar",
                features: ["Patient Onboarding", "Assessment Tools", "Treatment Plans", "Progress Tracking", "Resources"]
              },
              {
                name: "Statistics Overview",
                description: "Real-time metrics about your patient caseload",
                metrics: ["Total Patients", "Upcoming Appointments", "Active Treatment Plans", "Completed Assessments"]
              },
              {
                name: "Recent Patients",
                description: "Quick access to your most recently active patients",
                actions: ["View patient details", "Schedule appointments", "Update treatment plans"]
              },
              {
                name: "Today's Schedule",
                description: "Your appointments and tasks for today",
                features: ["Upcoming appointments", "Completed sessions", "Quick actions"]
              }
            ]
          }
        },
        {
          title: "Navigation Best Practices",
          type: "tips",
          content: {
            heading: "Efficient Navigation Tips",
            tips: [
              {
                icon: "🔍",
                title: "Use the Search Bar",
                description: "Quickly find patients by name, ID, or diagnosis using the header search",
                shortcut: "Ctrl+K"
              },
              {
                icon: "⚡",
                title: "Quick Actions",
                description: "Use dashboard quick action buttons for common tasks",
                examples: ["New Patient", "Start Assessment", "Create Treatment Plan"]
              },
              {
                icon: "📊",
                title: "Monitor Statistics",
                description: "Check dashboard statistics daily to stay on top of your caseload",
                frequency: "Daily review recommended"
              },
              {
                icon: "🔔",
                title: "Check Notifications",
                description: "Review notifications for important updates and reminders",
                location: "Bell icon in header"
              }
            ]
          }
        },
        {
          title: "Customization Options",
          type: "settings",
          content: {
            heading: "Personalizing Your Dashboard",
            text: "Customize your dashboard to match your workflow preferences:",
            options: [
              {
                setting: "Default View",
                description: "Choose which section to display first when logging in",
                options: ["Dashboard", "Patient List", "Today's Schedule"]
              },
              {
                setting: "Notification Preferences",
                description: "Configure which notifications you want to receive",
                types: ["Appointment reminders", "Assessment due dates", "System updates"]
              },
              {
                setting: "Quick Actions",
                description: "Customize which quick action buttons appear on your dashboard",
                available: ["New Patient", "Assessment", "Treatment Plan", "Resources", "Reports"]
              }
            ]
          }
        }
      ]
    },
    onboarding: {
      title: "Patient Onboarding",
      icon: Users,
      duration: "25 min",
      description: "Complete 4-step patient onboarding process",
      steps: [
        {
          title: "Step 1: Personal Details",
          type: "process",
          content: {
            heading: "Collecting Essential Patient Information",
            text: "The first step in patient onboarding involves gathering comprehensive personal and demographic information:",
            sections: [
              {
                title: "Basic Information",
                fields: [
                  { name: "Full Name", required: true, notes: "Legal name as it appears on ID" },
                  { name: "Date of Birth", required: true, notes: "Used for age-related treatment considerations" },
                  { name: "Gender", required: true, notes: "Important for treatment planning" },
                  { name: "Contact Information", required: true, notes: "Primary phone and email" }
                ]
              },
              {
                title: "Demographics",
                fields: [
                  { name: "Address", required: true, notes: "For appointment scheduling and communication" },
                  { name: "Emergency Contact", required: true, notes: "In case of medical emergency" },
                  { name: "Preferred Language", required: false, notes: "For effective communication" },
                  { name: "Cultural Considerations", required: false, notes: "Religious or cultural preferences" }
                ]
              }
            ],
            bestPractices: [
              "Ensure patient privacy during data collection",
              "Verify information accuracy with patient",
              "Explain why each piece of information is needed",
              "Respect cultural sensitivities"
            ]
          }
        },
        {
          title: "Step 2: Medical History",
          type: "medical",
          content: {
            heading: "Comprehensive Medical Background",
            text: "Gathering detailed medical history is crucial for effective treatment planning:",
            categories: [
              {
                title: "Reproductive History",
                items: [
                  "Previous pregnancies and outcomes",
                  "Menstrual cycle history",
                  "Previous fertility treatments",
                  "Contraceptive history",
                  "Sexual health history"
                ]
              },
              {
                title: "Medical Conditions",
                items: [
                  "Current medical conditions",
                  "Previous surgeries",
                  "Chronic conditions",
                  "Mental health history",
                  "Family medical history"
                ]
              },
              {
                title: "Medications & Allergies",
                items: [
                  "Current medications",
                  "Supplements and vitamins",
                  "Known allergies",
                  "Previous adverse reactions",
                  "Substance use history"
                ]
              }
            ],
            documentation: [
              "Request medical records from previous providers",
              "Document all information accurately",
              "Flag any concerning medical history",
              "Note potential contraindications"
            ]
          }
        },
        {
          title: "Step 3: Fertility Journey",
          type: "journey",
          content: {
            heading: "Understanding the Patient's Path",
            text: "Document the patient's fertility journey to provide personalized care:",
            timeline: [
              {
                phase: "Initial Concerns",
                questions: [
                  "When did fertility concerns begin?",
                  "What prompted seeking treatment?",
                  "Previous attempts to conceive?",
                  "Partner involvement and support?"
                ]
              },
              {
                phase: "Previous Treatments",
                questions: [
                  "What treatments have been tried?",
                  "Results and outcomes?",
                  "Emotional impact of previous treatments?",
                  "Reasons for treatment changes?"
                ]
              },
              {
                phase: "Current Situation",
                questions: [
                  "Current relationship status?",
                  "Support system availability?",
                  "Financial considerations?",
                  "Timeline expectations?"
                ]
              },
              {
                phase: "Future Goals",
                questions: [
                  "Treatment goals and expectations?",
                  "Family size preferences?",
                  "Alternative options considered?",
                  "Decision-making process?"
                ]
              }
            ],
            counselingNotes: [
              "Listen actively and empathetically",
              "Validate patient emotions and experiences",
              "Identify potential psychological support needs",
              "Document emotional state and coping mechanisms"
            ]
          }
        },
        {
          title: "Step 4: Treatment Pathway",
          type: "planning",
          content: {
            heading: "Collaborative Treatment Planning",
            text: "Work with the patient to establish a clear treatment pathway:",
            components: [
              {
                title: "Treatment Options Discussion",
                elements: [
                  "Explain available treatment options",
                  "Discuss success rates and realistic expectations",
                  "Review potential risks and side effects",
                  "Consider patient preferences and values"
                ]
              },
              {
                title: "Timeline Development",
                elements: [
                  "Establish treatment timeline",
                  "Schedule initial assessments",
                  "Plan follow-up appointments",
                  "Set milestone checkpoints"
                ]
              },
              {
                title: "Support Planning",
                elements: [
                  "Identify support needs",
                  "Discuss counseling options",
                  "Plan communication preferences",
                  "Establish emergency protocols"
                ]
              }
            ],
            completion: [
              "Summarize the onboarding session",
              "Provide patient with next steps",
              "Schedule follow-up appointments",
              "Ensure all documentation is complete"
            ]
          }
        }
      ]
    }
  };

  const currentModule = modules[moduleId as keyof typeof modules];
  const currentStepData = currentModule?.steps[currentStep];
  const progress = ((currentStep + 1) / currentModule.steps.length) * 100;

  const handleNext = () => {
    if (currentStep < currentModule.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      onComplete(moduleId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsCompleted(false);
  };

  if (!currentModule) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Module Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested training module could not be found.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Training
        </Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Module Completed!</h2>
          <p className="text-muted-foreground mb-6">
            Congratulations! You have successfully completed the {currentModule.title} training module.
          </p>
          <div className="flex space-x-3 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Review Again
            </Button>
            <Button onClick={onBack} className="bg-santaan-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Training
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-santaan-primary text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Training
            </Button>
            <Badge className="bg-white/20 text-white border-white/30">
              Step {currentStep + 1} of {currentModule.steps.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <currentModule.icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentModule.title}</h1>
              <p className="text-white/90">{currentModule.description}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="bg-white/20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-santaan-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                {currentStep + 1}
              </span>
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content will be rendered based on step type */}
            {currentStepData.type === "intro" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">{currentStepData.content.heading}</h3>
                  <p className="text-muted-foreground mb-4">{currentStepData.content.text}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {('keyPoints' in currentStepData.content ? currentStepData.content.keyPoints : []).map((point, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="bg-santaan-primary">
                {currentStep === currentModule.steps.length - 1 ? "Complete Module" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingModule;
