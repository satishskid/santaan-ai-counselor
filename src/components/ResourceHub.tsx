import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import TrainingModule from "./TrainingModule";
import ResourceViewer from "./ResourceViewer";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Activity,
  CalendarIcon,
  Settings,
  Play,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Heart,
  Brain,
  Stethoscope,
  GraduationCap,
  Award,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Home,
  ChevronRight,
  Plus,
  Eye,
  Edit
} from "lucide-react";
import BackToHome from "./BackToHome";

const ResourceHub = () => {
  const [activeTab, setActiveTab] = useState("training");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentTrainingModule, setCurrentTrainingModule] = useState<string | null>(null);
  const [currentResource, setCurrentResource] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>(["overview", "dashboard"]);

  // Training sections
  const trainingSections = [
    {
      id: "overview",
      title: "Platform Overview",
      icon: Home,
      duration: "15 min",
      completed: completedModules.includes("overview"),
      description: "Introduction to Santaan Counselor platform and key features"
    },
    {
      id: "dashboard",
      title: "Dashboard Navigation",
      icon: Monitor,
      duration: "10 min",
      completed: completedModules.includes("dashboard"),
      description: "Master the dashboard interface and navigation"
    },
    {
      id: "onboarding",
      title: "Patient Onboarding",
      icon: Users,
      duration: "25 min",
      completed: completedModules.includes("onboarding"),
      description: "Complete 4-step patient onboarding process"
    },
    {
      id: "assessment",
      title: "ESHRE Assessments",
      icon: FileText,
      duration: "30 min",
      completed: completedModules.includes("assessment"),
      description: "Conduct professional fertility assessments"
    },
    {
      id: "treatment",
      title: "Treatment Planning",
      icon: Activity,
      duration: "35 min",
      completed: completedModules.includes("treatment"),
      description: "Create milestone-based treatment plans"
    },
    {
      id: "progress",
      title: "Progress Tracking",
      icon: CalendarIcon,
      duration: "20 min",
      completed: completedModules.includes("progress"),
      description: "Monitor patient progress and appointments"
    },
    {
      id: "communication",
      title: "Patient Communication",
      icon: MessageCircle,
      duration: "15 min",
      completed: completedModules.includes("communication"),
      description: "Best practices for counselor-patient communication"
    },
    {
      id: "ethics",
      title: "Ethics & Guidelines",
      icon: Award,
      duration: "20 min",
      completed: completedModules.includes("ethics"),
      description: "Professional ethics and ESHRE guidelines"
    }
  ];

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
    setCurrentTrainingModule(null);
  };

  const handleStartModule = (moduleId: string) => {
    setCurrentTrainingModule(moduleId);
  };

  const handleOpenResource = (resourceId: number) => {
    setCurrentResource(resourceId);
  };

  // Educational resources
  const educationalResources = [
    {
      id: 1,
      title: "Understanding PCOS and Fertility",
      type: "article",
      category: "medical",
      duration: "8 min read",
      rating: 4.8,
      downloads: 1250,
      description: "Comprehensive guide about PCOS and its impact on fertility treatments",
      tags: ["PCOS", "fertility", "hormones", "treatment"],
      url: "#",
      featured: true
    },
    {
      id: 2,
      title: "IVF Process Step-by-Step",
      type: "video",
      category: "procedures",
      duration: "12 min",
      rating: 4.9,
      downloads: 2100,
      description: "Visual walkthrough of the complete IVF process for patient education",
      tags: ["IVF", "procedures", "education", "patient-care"],
      url: "#",
      featured: true
    },
    {
      id: 3,
      title: "Emotional Support During Fertility Treatment",
      type: "guide",
      category: "counseling",
      duration: "15 min read",
      rating: 4.7,
      downloads: 890,
      description: "Techniques for providing emotional support throughout the fertility journey",
      tags: ["emotional-support", "counseling", "mental-health", "coping"],
      url: "#",
      featured: false
    },
    {
      id: 4,
      title: "Male Factor Infertility Explained",
      type: "article",
      category: "medical",
      duration: "6 min read",
      rating: 4.6,
      downloads: 750,
      description: "Understanding male factor infertility causes and treatment options",
      tags: ["male-factor", "infertility", "diagnosis", "treatment"],
      url: "#",
      featured: false
    },
    {
      id: 5,
      title: "Financial Planning for Fertility Treatment",
      type: "worksheet",
      category: "financial",
      duration: "10 min",
      rating: 4.5,
      downloads: 650,
      description: "Interactive worksheet to help patients plan fertility treatment costs",
      tags: ["financial", "planning", "costs", "insurance"],
      url: "#",
      featured: false
    },
    {
      id: 6,
      title: "Nutrition and Lifestyle for Fertility",
      type: "guide",
      category: "lifestyle",
      duration: "12 min read",
      rating: 4.8,
      downloads: 1100,
      description: "Evidence-based nutrition and lifestyle recommendations for fertility",
      tags: ["nutrition", "lifestyle", "fertility", "health"],
      url: "#",
      featured: true
    },
    {
      id: 7,
      title: "Managing Treatment Expectations",
      type: "video",
      category: "counseling",
      duration: "8 min",
      rating: 4.7,
      downloads: 920,
      description: "How to help patients set realistic expectations for treatment outcomes",
      tags: ["expectations", "counseling", "communication", "success-rates"],
      url: "#",
      featured: false
    },
    {
      id: 8,
      title: "ESHRE Guidelines Summary 2024",
      type: "document",
      category: "guidelines",
      duration: "20 min read",
      rating: 4.9,
      downloads: 1800,
      description: "Latest ESHRE guidelines for fertility counseling and patient care",
      tags: ["ESHRE", "guidelines", "standards", "professional"],
      url: "#",
      featured: true
    },
    {
      id: 9,
      title: "Handling Difficult Conversations",
      type: "video",
      category: "counseling",
      duration: "18 min",
      rating: 4.8,
      downloads: 1350,
      description: "Techniques for navigating challenging discussions with patients",
      tags: ["communication", "difficult-conversations", "counseling", "empathy"],
      url: "#",
      featured: false
    },
    {
      id: 10,
      title: "Cultural Sensitivity in Fertility Care",
      type: "guide",
      category: "counseling",
      duration: "14 min read",
      rating: 4.7,
      downloads: 980,
      description: "Understanding cultural differences and providing inclusive care",
      tags: ["cultural-sensitivity", "diversity", "inclusive-care", "communication"],
      url: "#",
      featured: false
    },
    {
      id: 11,
      title: "Medication Management Checklist",
      type: "worksheet",
      category: "medical",
      duration: "5 min",
      rating: 4.6,
      downloads: 1450,
      description: "Comprehensive checklist for fertility medication management",
      tags: ["medications", "checklist", "safety", "protocols"],
      url: "#",
      featured: false
    },
    {
      id: 12,
      title: "Success Rate Communication Guide",
      type: "guide",
      category: "counseling",
      duration: "10 min read",
      rating: 4.8,
      downloads: 1200,
      description: "How to effectively communicate treatment success rates to patients",
      tags: ["success-rates", "statistics", "communication", "expectations"],
      url: "#",
      featured: true
    }
  ];

  const categories = [
    { id: "all", label: "All Resources", count: educationalResources.length },
    { id: "medical", label: "Medical", count: educationalResources.filter(r => r.category === "medical").length },
    { id: "procedures", label: "Procedures", count: educationalResources.filter(r => r.category === "procedures").length },
    { id: "counseling", label: "Counseling", count: educationalResources.filter(r => r.category === "counseling").length },
    { id: "guidelines", label: "Guidelines", count: educationalResources.filter(r => r.category === "guidelines").length },
    { id: "lifestyle", label: "Lifestyle", count: educationalResources.filter(r => r.category === "lifestyle").length },
    { id: "financial", label: "Financial", count: educationalResources.filter(r => r.category === "financial").length }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "document": return FileText;
      case "guide": return BookOpen;
      case "worksheet": return Edit;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-100 text-red-700";
      case "document": return "bg-blue-100 text-blue-700";
      case "guide": return "bg-green-100 text-green-700";
      case "worksheet": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredResources = educationalResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completedTraining = trainingSections.filter(section => section.completed).length;
  const totalTraining = trainingSections.length;
  const progressPercentage = (completedTraining / totalTraining) * 100;

  // Show training module if one is selected
  if (currentTrainingModule) {
    return (
      <TrainingModule
        moduleId={currentTrainingModule}
        onComplete={handleModuleComplete}
        onBack={() => setCurrentTrainingModule(null)}
      />
    );
  }

  // Show resource viewer if one is selected
  if (currentResource) {
    return (
      <ResourceViewer
        resourceId={currentResource}
        onBack={() => setCurrentResource(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back to Home Button */}
      <BackToHome position="top-left" />

      {/* Header */}
      <div className="bg-gradient-santaan-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Resource Hub & Training Center</h1>
              <p className="text-white/90 text-lg">
                Complete training materials and educational resources for effective counseling
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-sm text-white/80">Training Progress</p>
                <p className="text-2xl font-bold">{completedTraining}/{totalTraining}</p>
                <div className="w-24 bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="training" className="flex items-center">
              <GraduationCap className="mr-2 h-4 w-4" />
              Training Modules
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Educational Resources
            </TabsTrigger>
            <TabsTrigger value="quick-reference" className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Quick Reference
            </TabsTrigger>
          </TabsList>

          {/* Training Modules Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-santaan-primary" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-santaan-primary">{Math.round(progressPercentage)}%</div>
                        <p className="text-sm text-muted-foreground">Complete</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completed</span>
                          <span>{completedTraining} modules</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Remaining</span>
                          <span>{totalTraining - completedTraining} modules</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Est. Time</span>
                          <span>2.5 hours</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-santaan-secondary">
                        <Play className="mr-2 h-4 w-4" />
                        Continue Training
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Training Modules */}
              <div className="lg:col-span-2 space-y-4">
                {trainingSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <Card key={section.id} className={`transition-all hover:shadow-santaan ${section.completed ? 'border-green-200 bg-green-50/50' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              section.completed 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-santaan-primary/10 text-santaan-primary'
                            }`}>
                              {section.completed ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{section.title}</h3>
                                {section.completed && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {section.duration}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Module {index + 1} of {trainingSections.length}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {section.completed ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartModule(section.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Review
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-santaan-primary hover:bg-santaan-primary/90"
                                onClick={() => handleStartModule(section.id)}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Start
                              </Button>
                            )}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Educational Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search resources, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-santaan-primary" : ""}
                  >
                    {category.label} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Resources */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-santaan-secondary" />
                Featured Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(resource => resource.featured).map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  return (
                    <Card key={resource.id} className="hover:shadow-santaan-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <Badge variant="secondary" className="bg-santaan-secondary/10 text-santaan-secondary">
                            Featured
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {resource.duration}
                            </span>
                            <span className="flex items-center">
                              <Star className="mr-1 h-3 w-3 text-yellow-500" />
                              {resource.rating}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{resource.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Download className="mr-1 h-3 w-3" />
                              {resource.downloads} downloads
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenResource(resource.id)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                className="bg-santaan-primary"
                                onClick={() => handleOpenResource(resource.id)}
                              >
                                <Download className="mr-1 h-3 w-3" />
                                Access
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* All Resources */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-santaan-primary" />
                All Resources ({filteredResources.length})
              </h2>
              <div className="space-y-4">
                {filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  return (
                    <Card key={resource.id} className="hover:shadow-santaan transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{resource.title}</h3>
                                {resource.featured && (
                                  <Badge className="bg-santaan-secondary/10 text-santaan-secondary border-santaan-secondary/20">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {resource.duration}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Star className="mr-1 h-3 w-3 text-yellow-500" />
                                  {resource.rating}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Download className="mr-1 h-3 w-3" />
                                  {resource.downloads}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {resource.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenResource(resource.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="bg-santaan-primary hover:bg-santaan-primary/90"
                              onClick={() => handleOpenResource(resource.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Access
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Quick Reference Tab */}
          <TabsContent value="quick-reference" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Quick Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5 text-santaan-primary" />
                    Platform Quick Guide
                  </CardTitle>
                  <CardDescription>Essential shortcuts and navigation tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-santaan-primary pl-4">
                      <h4 className="font-semibold">Dashboard Navigation</h4>
                      <p className="text-sm text-muted-foreground">Use sidebar for main features, header for search and notifications</p>
                    </div>
                    <div className="border-l-4 border-santaan-secondary pl-4">
                      <h4 className="font-semibold">Patient Search</h4>
                      <p className="text-sm text-muted-foreground">Search by name, ID, or diagnosis in the header search bar</p>
                    </div>
                    <div className="border-l-4 border-santaan-tertiary pl-4">
                      <h4 className="font-semibold">Quick Actions</h4>
                      <p className="text-sm text-muted-foreground">Use dashboard quick action buttons for common tasks</p>
                    </div>
                    <div className="border-l-4 border-santaan-success pl-4">
                      <h4 className="font-semibold">Keyboard Shortcuts</h4>
                      <p className="text-sm text-muted-foreground">Ctrl+K for search, Ctrl+N for new patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ESHRE Guidelines Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-santaan-secondary" />
                    ESHRE Guidelines Summary
                  </CardTitle>
                  <CardDescription>Key professional standards and best practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Patient-Centered Care</h4>
                        <p className="text-sm text-muted-foreground">Always prioritize patient autonomy and informed consent</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Emotional Support</h4>
                        <p className="text-sm text-muted-foreground">Provide continuous psychological support throughout treatment</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Evidence-Based Practice</h4>
                        <p className="text-sm text-muted-foreground">Base all recommendations on current scientific evidence</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Confidentiality</h4>
                        <p className="text-sm text-muted-foreground">Maintain strict patient confidentiality and data protection</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-santaan-tertiary" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>Important contacts for urgent situations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <h4 className="font-semibold text-red-900">Medical Emergency</h4>
                        <p className="text-sm text-red-700">24/7 Medical Support</p>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <h4 className="font-semibold text-blue-900">Technical Support</h4>
                        <p className="text-sm text-blue-700">Platform issues & training</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h4 className="font-semibold text-green-900">Supervisor</h4>
                        <p className="text-sm text-green-700">Clinical guidance & escalation</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-santaan-success" />
                    System Information
                  </CardTitle>
                  <CardDescription>Current system status and compatibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Platform Status</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Backup</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Version</span>
                      <span className="text-sm text-muted-foreground">v1.0.0</span>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Supported Devices</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-gray-50 rounded">
                          <Monitor className="h-6 w-6 mx-auto mb-1 text-santaan-primary" />
                          <p className="text-xs">Desktop</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <Tablet className="h-6 w-6 mx-auto mb-1 text-santaan-secondary" />
                          <p className="text-xs">Tablet</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <Smartphone className="h-6 w-6 mx-auto mb-1 text-santaan-tertiary" />
                          <p className="text-xs">Mobile</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResourceHub;
