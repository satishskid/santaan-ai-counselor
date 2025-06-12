import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Star,
  Clock,
  BookOpen,
  Video,
  FileText,
  Edit,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Heart,
  Brain,
  Users,
  DollarSign,
  Activity,
  Target,
  MessageCircle,
  Award,
  Stethoscope,
  Calendar,
  Phone,
  Mail
} from "lucide-react";

interface ResourceViewerProps {
  resourceId: number;
  onBack: () => void;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({ resourceId, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const resources = {
    1: {
      title: "Understanding PCOS and Fertility",
      type: "article",
      category: "medical",
      duration: "8 min read",
      rating: 4.8,
      author: "Dr. Sarah Mitchell, Reproductive Endocrinologist",
      lastUpdated: "March 2024",
      sections: [
        {
          title: "What is PCOS?",
          content: {
            text: "Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders affecting women of reproductive age, occurring in 5-10% of women. It's characterized by irregular menstrual cycles, elevated androgen levels, and polycystic ovaries.",
            keyPoints: [
              "PCOS affects 1 in 10 women of childbearing age",
              "It's the leading cause of female infertility",
              "Symptoms often begin during puberty",
              "Early diagnosis and treatment improve outcomes"
            ],
            clinicalNote: "PCOS diagnosis requires 2 of 3 criteria: irregular ovulation, clinical/biochemical hyperandrogenism, or polycystic ovaries on ultrasound."
          }
        },
        {
          title: "PCOS and Fertility Challenges",
          content: {
            text: "PCOS affects fertility primarily through irregular or absent ovulation. Women with PCOS may have difficulty conceiving naturally and often require fertility treatments.",
            challenges: [
              {
                issue: "Irregular Ovulation",
                explanation: "Hormonal imbalances prevent regular egg release",
                impact: "Unpredictable fertile windows, difficulty timing conception"
              },
              {
                issue: "Insulin Resistance",
                explanation: "Common in PCOS, affects hormone balance",
                impact: "Worsens ovulation problems, increases miscarriage risk"
              },
              {
                issue: "Elevated Androgens",
                explanation: "High male hormone levels disrupt ovulation",
                impact: "Irregular cycles, poor egg quality"
              }
            ]
          }
        },
        {
          title: "Treatment Options",
          content: {
            text: "PCOS treatment focuses on managing symptoms and improving fertility outcomes through lifestyle modifications and medical interventions.",
            treatments: [
              {
                category: "Lifestyle Modifications",
                options: [
                  "Weight management (5-10% weight loss can restore ovulation)",
                  "Regular exercise (improves insulin sensitivity)",
                  "Balanced diet (low glycemic index foods)",
                  "Stress management techniques"
                ]
              },
              {
                category: "Medical Treatments",
                options: [
                  "Metformin (improves insulin sensitivity)",
                  "Clomiphene citrate (ovulation induction)",
                  "Letrozole (first-line ovulation induction)",
                  "Gonadotropins (for resistant cases)"
                ]
              },
              {
                category: "Assisted Reproductive Technology",
                options: [
                  "IUI with ovulation induction",
                  "IVF (for severe cases or failed treatments)",
                  "In vitro maturation (IVM) for PCOS patients"
                ]
              }
            ]
          }
        },
        {
          title: "Counseling Considerations",
          content: {
            text: "Counseling women with PCOS requires sensitivity to the emotional and psychological impact of the condition.",
            counselingPoints: [
              {
                topic: "Emotional Support",
                guidance: "Acknowledge the frustration and anxiety associated with irregular cycles and fertility challenges"
              },
              {
                topic: "Realistic Expectations",
                guidance: "Explain that PCOS is manageable and many women with PCOS conceive successfully with treatment"
              },
              {
                topic: "Lifestyle Counseling",
                guidance: "Emphasize the importance of lifestyle modifications and provide practical guidance"
              },
              {
                topic: "Long-term Health",
                guidance: "Discuss long-term health implications and the importance of ongoing management"
              }
            ]
          }
        }
      ]
    },
    2: {
      title: "IVF Process Step-by-Step",
      type: "video",
      category: "procedures",
      duration: "12 min",
      rating: 4.9,
      author: "Dr. Michael Chen, IVF Specialist",
      lastUpdated: "February 2024",
      sections: [
        {
          title: "Pre-IVF Preparation",
          content: {
            text: "Before beginning IVF treatment, patients undergo comprehensive evaluation and preparation to optimize success rates.",
            steps: [
              {
                step: "Initial Consultation",
                description: "Comprehensive medical history and physical examination",
                duration: "60-90 minutes",
                includes: ["Medical history review", "Physical examination", "Treatment plan discussion", "Consent process"]
              },
              {
                step: "Diagnostic Testing",
                description: "Complete fertility workup for both partners",
                duration: "2-4 weeks",
                includes: ["Hormone testing", "Ultrasound evaluation", "Semen analysis", "Genetic screening"]
              },
              {
                step: "Treatment Planning",
                description: "Personalized protocol development",
                duration: "1 week",
                includes: ["Protocol selection", "Medication planning", "Calendar creation", "Education session"]
              }
            ]
          }
        },
        {
          title: "Ovarian Stimulation Phase",
          content: {
            text: "The stimulation phase involves daily hormone injections to stimulate multiple egg development.",
            timeline: [
              {
                day: "Day 1-2",
                activity: "Baseline monitoring",
                details: "Ultrasound and blood work to confirm readiness to start"
              },
              {
                day: "Day 3-12",
                activity: "Daily injections",
                details: "FSH/LH injections to stimulate egg development"
              },
              {
                day: "Day 6-12",
                activity: "Monitoring visits",
                details: "Regular ultrasounds and blood work every 2-3 days"
              },
              {
                day: "Day 10-14",
                activity: "Trigger injection",
                details: "HCG injection to mature eggs for retrieval"
              }
            ],
            patientEducation: [
              "Injection technique training",
              "Side effect management",
              "Monitoring schedule importance",
              "When to contact the clinic"
            ]
          }
        },
        {
          title: "Egg Retrieval & Fertilization",
          content: {
            text: "Egg retrieval is a minor surgical procedure performed under sedation, followed by fertilization in the laboratory.",
            procedure: {
              preparation: [
                "Fasting 8 hours before procedure",
                "Arrive 1 hour early for preparation",
                "Bring partner for sperm collection",
                "Arrange transportation home"
              ],
              process: [
                "IV sedation administered",
                "Transvaginal ultrasound-guided retrieval",
                "Eggs collected and evaluated",
                "Sperm preparation and fertilization"
              ],
              recovery: [
                "1-2 hours observation",
                "Discharge with instructions",
                "Rest for remainder of day",
                "Follow-up call next day"
              ]
            }
          }
        },
        {
          title: "Embryo Transfer & Follow-up",
          content: {
            text: "Embryo transfer is typically performed 3-5 days after retrieval, followed by a two-week wait period.",
            transferProcess: [
              {
                timing: "Day 3 or Day 5",
                procedure: "Embryo transfer",
                description: "Simple procedure similar to pap smear, no anesthesia needed"
              },
              {
                timing: "Day 6-12",
                procedure: "Two-week wait",
                description: "Progesterone support continues, limited activity recommended"
              },
              {
                timing: "Day 14",
                procedure: "Pregnancy test",
                description: "Blood test to determine if treatment was successful"
              }
            ],
            supportCare: [
              "Progesterone supplementation",
              "Activity restrictions",
              "Emotional support resources",
              "Follow-up scheduling"
            ]
          }
        }
      ]
    },
    3: {
      title: "Emotional Support During Fertility Treatment",
      type: "guide",
      category: "counseling",
      duration: "15 min read",
      rating: 4.7,
      author: "Dr. Lisa Rodriguez, Fertility Counselor",
      lastUpdated: "April 2024",
      sections: [
        {
          title: "Understanding the Emotional Journey",
          content: {
            text: "Fertility treatment is an emotional rollercoaster that affects patients physically, mentally, and emotionally. Understanding common emotional responses helps counselors provide better support.",
            commonEmotions: [
              {
                emotion: "Grief and Loss",
                description: "Loss of the expected natural conception experience",
                manifestations: ["Sadness", "Anger", "Denial", "Bargaining"]
              },
              {
                emotion: "Anxiety and Fear",
                description: "Worry about treatment outcomes and future",
                manifestations: ["Sleep disturbances", "Panic attacks", "Obsessive thoughts", "Avoidance behaviors"]
              },
              {
                emotion: "Guilt and Shame",
                description: "Self-blame for fertility problems",
                manifestations: ["Self-criticism", "Social withdrawal", "Relationship strain", "Depression"]
              },
              {
                emotion: "Hope and Optimism",
                description: "Positive expectations for treatment success",
                manifestations: ["Excitement", "Planning for pregnancy", "Increased motivation", "Treatment compliance"]
              }
            ]
          }
        },
        {
          title: "Counseling Techniques",
          content: {
            text: "Effective counseling techniques help patients cope with the emotional challenges of fertility treatment.",
            techniques: [
              {
                technique: "Active Listening",
                description: "Fully focus on patient's words and emotions",
                implementation: [
                  "Maintain eye contact and open body language",
                  "Reflect back what you hear",
                  "Ask clarifying questions",
                  "Avoid interrupting or rushing"
                ]
              },
              {
                technique: "Validation",
                description: "Acknowledge and normalize patient emotions",
                implementation: [
                  "Use phrases like 'That sounds really difficult'",
                  "Normalize emotional responses",
                  "Avoid minimizing feelings",
                  "Share that others have similar experiences"
                ]
              },
              {
                technique: "Cognitive Restructuring",
                description: "Help patients identify and challenge negative thoughts",
                implementation: [
                  "Identify catastrophic thinking patterns",
                  "Challenge unrealistic beliefs",
                  "Develop balanced perspectives",
                  "Practice positive self-talk"
                ]
              }
            ]
          }
        },
        {
          title: "Crisis Intervention",
          content: {
            text: "Some patients may experience severe emotional distress requiring immediate intervention.",
            warningSigns: [
              "Persistent hopelessness or despair",
              "Thoughts of self-harm or suicide",
              "Severe anxiety or panic attacks",
              "Complete social withdrawal",
              "Substance abuse",
              "Inability to function in daily life"
            ],
            interventionSteps: [
              {
                step: "Immediate Assessment",
                actions: ["Assess suicide risk", "Evaluate safety", "Determine level of support needed"]
              },
              {
                step: "Safety Planning",
                actions: ["Remove means of self-harm", "Identify support persons", "Create crisis contact list"]
              },
              {
                step: "Professional Referral",
                actions: ["Refer to mental health professional", "Consider psychiatric evaluation", "Coordinate care"]
              },
              {
                step: "Follow-up",
                actions: ["Schedule frequent check-ins", "Monitor progress", "Adjust treatment plan"]
              }
            ]
          }
        }
      ]
    }
  };

  const currentResource = resources[resourceId as keyof typeof resources];
  const currentSectionData = currentResource?.sections[currentSection];
  const progress = ((currentSection + 1) / currentResource.sections.length) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "article": return FileText;
      case "guide": return BookOpen;
      case "worksheet": return Edit;
      default: return FileText;
    }
  };

  const handleNext = () => {
    if (currentSection < currentResource.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (!currentResource) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Resource Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested resource could not be found.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(currentResource.type);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-santaan-primary text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <TypeIcon className="mr-1 h-3 w-3" />
                {currentResource.type}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                Section {currentSection + 1} of {currentResource.sections.length}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{currentResource.title}</h1>
              <div className="flex items-center space-x-4 text-white/90">
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {currentResource.duration}
                </span>
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-300" />
                  {currentResource.rating}
                </span>
                <span>By {currentResource.author}</span>
              </div>
            </div>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
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
            <CardTitle>{currentSectionData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {currentSectionData.content.text}
              </p>
            </div>

            {/* Render different content types based on the section */}
            {'keyPoints' in currentSectionData.content && currentSectionData.content.keyPoints && (
              <div>
                <h4 className="font-semibold mb-3">Key Points:</h4>
                <ul className="space-y-2">
                  {('keyPoints' in currentSectionData.content ? currentSectionData.content.keyPoints : []).map((point, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {'clinicalNote' in currentSectionData.content && currentSectionData.content.clinicalNote && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Clinical Note</h4>
                    <p className="text-blue-800 text-sm">{'clinicalNote' in currentSectionData.content ? currentSectionData.content.clinicalNote : ''}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="bg-santaan-primary">
                {currentSection === currentResource.sections.length - 1 ? "Complete" : "Next Section"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceViewer;
