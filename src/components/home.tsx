import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Users,
  FileText,
  Activity,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Search,
} from "lucide-react";

const Home = () => {
  // Mock data for recent patients
  const recentPatients = [
    {
      id: "p1",
      name: "Priya Sharma",
      age: 34,
      stage: "Assessment",
      diagnosis: "PCOS",
      nextAppointment: "2024-01-15",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      status: "active",
    },
    {
      id: "p2",
      name: "Arjun Patel",
      age: 36,
      stage: "Treatment Plan",
      diagnosis: "Male Factor",
      nextAppointment: "2024-01-18",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
      status: "active",
    },
    {
      id: "p3",
      name: "Kavya Reddy",
      age: 32,
      stage: "Onboarding",
      diagnosis: "Unexplained",
      nextAppointment: "2024-01-20",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavya",
      status: "new",
    },
    {
      id: "p4",
      name: "Rohit Gupta",
      age: 38,
      stage: "Progress Tracking",
      diagnosis: "Endometriosis",
      nextAppointment: "2024-01-22",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohit",
      status: "active",
    },
    {
      id: "p5",
      name: "Ananya Singh",
      age: 29,
      stage: "Assessment",
      diagnosis: "Blocked Tubes",
      nextAppointment: "2024-01-25",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
      status: "active",
    },
    {
      id: "p6",
      name: "Vikram Joshi",
      age: 41,
      stage: "Treatment Plan",
      diagnosis: "Low Sperm Count",
      nextAppointment: "2024-01-28",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
      status: "active",
    },
    {
      id: "p7",
      name: "Meera Nair",
      age: 35,
      stage: "Onboarding",
      diagnosis: "Ovulation Disorders",
      nextAppointment: "2024-01-30",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
      status: "new",
    },
    {
      id: "p8",
      name: "Karan Malhotra",
      age: 33,
      stage: "Progress Tracking",
      diagnosis: "Genetic Factors",
      nextAppointment: "2024-02-02",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karan",
      status: "active",
    },
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      patientName: "Priya Sharma",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Emotional Assessment",
    },
    {
      id: 2,
      patientName: "Arjun Patel",
      date: "2024-01-18",
      time: "2:30 PM",
      type: "Treatment Plan Review",
    },
    {
      id: 3,
      patientName: "Kavya Reddy",
      date: "2024-01-20",
      time: "11:15 AM",
      type: "Initial Consultation",
    },
    {
      id: 4,
      patientName: "Ananya Singh",
      date: "2024-01-25",
      time: "9:30 AM",
      type: "Financial Consultation",
    },
    {
      id: 5,
      patientName: "Meera Nair",
      date: "2024-01-30",
      time: "3:00 PM",
      type: "Initial Assessment",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Santaan.in</h2>
          <p className="text-sm text-muted-foreground italic">
            science for smiles
          </p>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
          >
            <Users className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/patient-onboarding"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <FileText className="mr-3 h-5 w-5" />
            Patient Onboarding
          </Link>
          <Link
            to="/assessment"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Activity className="mr-3 h-5 w-5" />
            Assessment
          </Link>
          <Link
            to="/treatment-plan"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <FileText className="mr-3 h-5 w-5" />
            Treatment Plans
          </Link>
          <Link
            to="/progress-tracker"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Activity className="mr-3 h-5 w-5" />
            Progress Tracker
          </Link>
          <Link
            to="/resources"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <BookOpen className="mr-3 h-5 w-5" />
            Resource Hub
          </Link>
        </nav>

        <div className="pt-4 border-t">
          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground">
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-white">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=counselor" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Dr. Emma Wilson</p>
                <p className="text-xs text-muted-foreground">
                  Senior Counselor
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Dr. Wilson. Here's what's happening today.
            </p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recentPatients.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{recentPatients.filter((p) => p.status === "new").length}{" "}
                  this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingAppointments.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Next: {upcomingAppointments[0]?.time || "No appointments"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Treatment Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground mt-1">
                  8 need review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36</div>
                <p className="text-xs text-muted-foreground mt-1">
                  5 pending completion
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent patients */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Your recently active patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years • {patient.diagnosis}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stage: {patient.stage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {patient.status === "new" && (
                          <Badge variant="destructive">New</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {new Date(
                            patient.nextAppointment,
                          ).toLocaleDateString()}
                        </Button>
                        <Link to={`/progress-tracker?patient=${patient.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Patients
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="space-y-4 mt-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col space-y-1 p-3 bg-accent/50 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium">
                            {appointment.patientName}
                          </p>
                          <Badge variant="outline">{appointment.type}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {new Date(
                            appointment.date,
                          ).toLocaleDateString()} at {appointment.time}
                        </div>
                        <div className="pt-2 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Reschedule
                          </Button>
                          <Button size="sm" className="flex-1">
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="completed" className="mt-4">
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <Activity className="h-10 w-10 mb-2" />
                      <p>No completed appointments today</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center"
                asChild
              >
                <Link to="/patient-onboarding">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>New Patient</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center"
                variant="outline"
                asChild
              >
                <Link to="/assessment">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Start Assessment</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center"
                variant="outline"
                asChild
              >
                <Link to="/treatment-plan">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Create Treatment Plan</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center"
                variant="outline"
                asChild
              >
                <Link to="/resources">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Browse Resources</span>
                </Link>
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t p-4 text-center">
          <p className="text-xs text-muted-foreground">
            created by greybrain.ai
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
