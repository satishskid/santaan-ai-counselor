import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationCenter from "./NotificationCenter";
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
  Loader2,
  Brain,
} from "lucide-react";
import { useDashboardStats, usePatients, useUpcomingAppointments } from "@/hooks/useApi";
import { authApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Fetch real data from database
  const { data: dashboardStats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: patients, loading: patientsLoading } = usePatients();
  const { data: upcomingAppointments, loading: appointmentsLoading } = useUpcomingAppointments();

  // Get current user from localStorage or API
  useEffect(() => {
    const user = authApi.getUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // If no user, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      authApi.removeToken();
      navigate('/login');
    }
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: Date | null) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format appointment time
  const formatAppointmentTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Show loading state
  if (statsLoading || patientsLoading || appointmentsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r bg-card p-4 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary">Santaan.in</h2>
            <p className="text-sm text-muted-foreground italic">
              science for smiles
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r bg-gradient-santaan-primary p-4 flex flex-col text-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Santaan.in</h2>
            <p className="text-sm text-white/80 italic">
              science for smiles
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading dashboard</p>
            <p className="text-sm text-muted-foreground">{statsError}</p>
          </div>
        </div>
      </div>
    );
  }

  const recentPatients = dashboardStats?.recentPatients || [];
  const todaysAppointments = dashboardStats?.todaysAppointments || [];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gradient-santaan-primary p-4 flex flex-col text-white">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Santaan.in</h2>
          <p className="text-sm text-white/80 italic">
            science for smiles
          </p>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white/20 text-white shadow-santaan"
          >
            <Users className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/patient-onboarding"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FileText className="mr-3 h-5 w-5" />
            Patient Onboarding
          </Link>
          <Link
            to="/assessment"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            Assessment
          </Link>
          <Link
            to="/treatment-plan"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FileText className="mr-3 h-5 w-5" />
            Treatment Plans
          </Link>
          <Link
            to="/progress-tracker"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            Progress Tracker
          </Link>
          <Link
            to="/resources"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <BookOpen className="mr-3 h-5 w-5" />
            Resources & Training
          </Link>
          <Link
            to="/ai-persona"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Brain className="mr-3 h-5 w-5" />
            AI Persona & Plans
          </Link>
          <Link
            to="/workflow"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            Workflow Guide
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            Real-Time Dashboard
          </Link>
          <Link
            to="/patient-app"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            Patient Mobile App
          </Link>

        </nav>

        <div className="pt-4 border-t border-white/20">
          <Link
            to="/admin"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="mr-3 h-5 w-5" />
            Admin Panel
          </Link>
          <Link
            to="/admin-debug"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            🔧 Debug System
          </Link>
          <Link
            to="/admin/testing-suite"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            🧪 Testing Suite
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
          <Link
            to="/system-health"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Activity className="mr-3 h-5 w-5" />
            System Health
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
          >
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
            <Link to="/resources">
              <Button className="bg-gradient-santaan-secondary hover:bg-santaan-secondary/90 text-white shadow-santaan">
                <BookOpen className="mr-2 h-4 w-4" />
                Resources & Training
              </Button>
            </Link>
            <button
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-muted-foreground hover:text-santaan-primary transition-colors" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-santaan-secondary text-[10px] font-medium flex items-center justify-center text-white">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=counselor" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{currentUser?.fullName || 'Dr. Emma Wilson'}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.role || 'Senior Counselor'}
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
              Welcome back, {currentUser?.fullName || 'Dr. Wilson'}. Here's what's happening today.
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
                  {dashboardStats?.totalPatients || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{recentPatients.filter((p) => p.status === "NEW").length}{" "}
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
                  {dashboardStats?.upcomingAppointments || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Next: {todaysAppointments[0] ? formatAppointmentTime(todaysAppointments[0].appointmentDate) : "No appointments"}
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
                <div className="text-2xl font-bold">{dashboardStats?.activeTreatmentPlans || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active plans
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
                <div className="text-2xl font-bold">{dashboardStats?.completedAssessments || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed
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
                          <AvatarImage src={patient.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.firstName}`} />
                          <AvatarFallback>
                            {patient.firstName[0]}{patient.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {calculateAge(patient.dateOfBirth)} years • {patient.diagnosis || 'No diagnosis'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stage: {patient.stage || 'Not set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {patient.status === "NEW" && (
                          <Badge variant="destructive">New</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'No appointment'}
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
                    {todaysAppointments.length > 0 ? todaysAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col space-y-1 p-3 bg-accent/50 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium">
                            {appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient'}
                          </p>
                          <Badge variant="outline">{appointment.type || appointment.title}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {formatAppointmentTime(appointment.appointmentDate)}
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
                    )) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Activity className="h-10 w-10 mb-2" />
                        <p>No appointments scheduled for today</p>
                      </div>
                    )}
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                className="h-auto py-4 flex flex-col items-center justify-center bg-gradient-santaan-secondary hover:bg-santaan-secondary/90 text-white"
                asChild
              >
                <Link to="/resources">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Resources & Training</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center bg-gradient-santaan-tertiary hover:bg-santaan-tertiary/90 text-white"
                asChild
              >
                <Link to="/ai-persona">
                  <Brain className="h-6 w-6 mb-2" />
                  <span>AI Persona & Plans</span>
                </Link>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                asChild
              >
                <Link to="/patient-link-generator">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Generate Patient Links</span>
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

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default Home;
