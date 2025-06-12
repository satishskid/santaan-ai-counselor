import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  Activity,
  CalendarIcon,
  BookOpen,
  Settings,
  Search,
  Bell,
  Plus,
  Eye,
  Edit,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  ChevronRight,
  Home,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";

const UserManual = () => {
  const [currentSection, setCurrentSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: Home },
    { id: "dashboard", title: "Dashboard", icon: Monitor },
    { id: "onboarding", title: "Patient Onboarding", icon: Users },
    { id: "assessment", title: "Assessment Tools", icon: FileText },
    { id: "treatment", title: "Treatment Plans", icon: Activity },
    { id: "progress", title: "Progress Tracking", icon: CalendarIcon },
    { id: "resources", title: "Resource Hub", icon: BookOpen },
    { id: "tips", title: "Best Practices", icon: CheckCircle },
  ];

  const features = [
    {
      title: "Patient Management",
      description: "Complete patient lifecycle management from onboarding to treatment completion",
      color: "bg-santaan-primary"
    },
    {
      title: "ESHRE Guidelines",
      description: "Built-in assessment tools following international fertility counseling standards",
      color: "bg-santaan-secondary"
    },
    {
      title: "Treatment Planning",
      description: "Structured milestone-based treatment plans with progress tracking",
      color: "bg-santaan-tertiary"
    },
    {
      title: "Resource Library",
      description: "Curated educational materials and resources for patient support",
      color: "bg-santaan-success"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-santaan-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Santaan Counselor Training Manual</h1>
          <p className="text-white/90 text-lg">
            Complete guide to using the IVF counseling platform effectively
          </p>
          <div className="flex items-center mt-4 space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Version 1.0
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              For Counselors
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none transition-colors ${
                          currentSection === section.id
                            ? "bg-santaan-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection === "overview" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Home className="mr-2 h-5 w-5 text-santaan-primary" />
                      Platform Overview
                    </CardTitle>
                    <CardDescription>
                      Welcome to Santaan Counselor - your comprehensive IVF counseling platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {features.map((feature, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className={`w-8 h-8 ${feature.color} rounded-lg mb-3 flex items-center justify-center`}>
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Getting Started</h4>
                          <p className="text-blue-800 text-sm">
                            This manual will guide you through each feature of the platform. 
                            Use the navigation menu to jump to specific sections or follow along sequentially.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Monitor className="h-8 w-8 mx-auto mb-2 text-santaan-primary" />
                        <h3 className="font-semibold mb-1">Desktop</h3>
                        <p className="text-sm text-muted-foreground">Chrome, Firefox, Safari, Edge</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Tablet className="h-8 w-8 mx-auto mb-2 text-santaan-secondary" />
                        <h3 className="font-semibold mb-1">Tablet</h3>
                        <p className="text-sm text-muted-foreground">iPad, Android tablets</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Smartphone className="h-8 w-8 mx-auto mb-2 text-santaan-tertiary" />
                        <h3 className="font-semibold mb-1">Mobile</h3>
                        <p className="text-sm text-muted-foreground">iOS, Android browsers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentSection === "dashboard" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Monitor className="mr-2 h-5 w-5 text-santaan-primary" />
                      Dashboard Overview
                    </CardTitle>
                    <CardDescription>
                      Your central hub for patient management and daily activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Dashboard Layout */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <span className="bg-santaan-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                          Navigation Sidebar
                        </h3>
                        <div className="bg-gradient-santaan-primary text-white p-4 rounded-lg mb-4">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                              <Home className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold">Santaan.in</p>
                              <p className="text-sm text-white/80">science for smiles</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center p-2 bg-white/20 rounded text-sm">
                              <Users className="mr-2 h-4 w-4" />
                              Dashboard
                            </div>
                            <div className="flex items-center p-2 text-white/90 text-sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Patient Onboarding
                            </div>
                            <div className="flex items-center p-2 text-white/90 text-sm">
                              <Activity className="mr-2 h-4 w-4" />
                              Assessment
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The sidebar provides quick access to all major features. The current page is highlighted in white.
                        </p>
                      </div>

                      {/* Statistics Cards */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <span className="bg-santaan-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                          Statistics Overview
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Total Patients</p>
                            <p className="text-xl font-bold text-santaan-primary">8</p>
                            <p className="text-xs text-green-600">+2 this month</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Appointments</p>
                            <p className="text-xl font-bold text-santaan-secondary">5</p>
                            <p className="text-xs text-muted-foreground">Next: 10:00 AM</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Treatment Plans</p>
                            <p className="text-xl font-bold text-santaan-tertiary">6</p>
                            <p className="text-xs text-muted-foreground">Active plans</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Assessments</p>
                            <p className="text-xl font-bold text-santaan-success">3</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          These cards show real-time statistics from your patient database. Numbers update automatically as you work.
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <span className="bg-santaan-tertiary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <Button className="h-auto py-4 flex flex-col items-center bg-santaan-primary hover:bg-santaan-primary/90">
                            <Plus className="h-5 w-5 mb-1" />
                            <span className="text-xs">New Patient</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center border-santaan-secondary text-santaan-secondary hover:bg-santaan-secondary hover:text-white">
                            <FileText className="h-5 w-5 mb-1" />
                            <span className="text-xs">Assessment</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center border-santaan-tertiary text-santaan-tertiary hover:bg-santaan-tertiary hover:text-white">
                            <Activity className="h-5 w-5 mb-1" />
                            <span className="text-xs">Treatment Plan</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center border-santaan-success text-santaan-success hover:bg-santaan-success hover:text-white">
                            <BookOpen className="h-5 w-5 mb-1" />
                            <span className="text-xs">Resources</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Use these buttons to quickly start common tasks without navigating through menus.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add more sections here... */}
            {currentSection === "onboarding" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-santaan-primary" />
                    Patient Onboarding Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 mb-1">Important</h4>
                          <p className="text-yellow-800 text-sm">
                            Complete all onboarding steps to ensure comprehensive patient care and proper documentation.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="bg-santaan-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Personal Details</h4>
                          <p className="text-sm text-muted-foreground">Basic information, contact details, demographics</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="bg-santaan-secondary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Medical History</h4>
                          <p className="text-sm text-muted-foreground">Previous treatments, conditions, medications, allergies</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="bg-santaan-tertiary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Fertility Journey</h4>
                          <p className="text-sm text-muted-foreground">Timeline, previous attempts, challenges, expectations</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="bg-santaan-success text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Treatment Pathway</h4>
                          <p className="text-sm text-muted-foreground">Preferred treatments, timeline, additional notes</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Continue with other sections... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
