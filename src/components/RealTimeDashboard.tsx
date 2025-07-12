import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  Activity,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  TestTube,
  Pill,
  Phone,
  MessageCircle,
  Bell,
  RefreshCw,
  BarChart3,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import BackToHome from './BackToHome';

interface PatientStatus {
  id: string;
  name: string;
  status: 'active' | 'monitoring' | 'critical' | 'stable';
  currentPhase: string;
  progress: number;
  lastUpdate: string;
  nextAppointment?: string;
  alerts: number;
  cycleDay?: number;
  interventionPlan?: {
    currentPhase: string;
    completedTasks: number;
    totalTasks: number;
    nextMilestone: string;
  };
}

interface DashboardMetrics {
  totalPatients: number;
  activeInterventions: number;
  todayAppointments: number;
  criticalAlerts: number;
  completionRate: number;
  avgProgressScore: number;
  newPatientsThisWeek: number;
  successfulOutcomes: number;
}

interface RealtimeUpdate {
  id: string;
  patientId: string;
  patientName: string;
  type: 'cycle_update' | 'assessment_completed' | 'appointment_scheduled' | 'intervention_progress' | 'alert';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

const RealTimeDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPatients: 0,
    activeInterventions: 0,
    todayAppointments: 0,
    criticalAlerts: 0,
    completionRate: 0,
    avgProgressScore: 0,
    newPatientsThisWeek: 0,
    successfulOutcomes: 0,
  });

  const [patients, setPatients] = useState<PatientStatus[]>([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Get initial tab from URL parameters
  const initialTab = searchParams.get('tab') || 'patients';

  useEffect(() => {
    // Initialize dashboard data
    loadDashboardData();
    
    // Set up real-time updates simulation
    const interval = setInterval(() => {
      simulateRealtimeUpdate();
    }, 5000); // Update every 5 seconds

    // Set up connection status
    setIsConnected(true);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    // Mock data - in production, this would come from your API
    const mockMetrics: DashboardMetrics = {
      totalPatients: 47,
      activeInterventions: 23,
      todayAppointments: 8,
      criticalAlerts: 2,
      completionRate: 78,
      avgProgressScore: 82,
      newPatientsThisWeek: 5,
      successfulOutcomes: 34,
    };

    const mockPatients: PatientStatus[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        status: 'active',
        currentPhase: 'Stimulation Phase',
        progress: 65,
        lastUpdate: '2 minutes ago',
        nextAppointment: 'Today 2:30 PM',
        alerts: 0,
        cycleDay: 8,
        interventionPlan: {
          currentPhase: 'Stress Management',
          completedTasks: 4,
          totalTasks: 6,
          nextMilestone: 'Coping Skills Assessment',
        },
      },
      {
        id: '2',
        name: 'Emily Chen',
        status: 'monitoring',
        currentPhase: 'Transfer Phase',
        progress: 90,
        lastUpdate: '15 minutes ago',
        nextAppointment: 'Tomorrow 10:00 AM',
        alerts: 1,
        cycleDay: 21,
        interventionPlan: {
          currentPhase: 'Post-Transfer Support',
          completedTasks: 8,
          totalTasks: 10,
          nextMilestone: 'Pregnancy Test Preparation',
        },
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        status: 'critical',
        currentPhase: 'Pre-Treatment',
        progress: 25,
        lastUpdate: '5 minutes ago',
        nextAppointment: 'Today 4:00 PM',
        alerts: 3,
        interventionPlan: {
          currentPhase: 'Anxiety Management',
          completedTasks: 2,
          totalTasks: 8,
          nextMilestone: 'Initial Counseling Session',
        },
      },
      {
        id: '4',
        name: 'Lisa Wang',
        status: 'stable',
        currentPhase: 'Monitoring',
        progress: 45,
        lastUpdate: '1 hour ago',
        nextAppointment: 'Friday 11:30 AM',
        alerts: 0,
        cycleDay: 12,
        interventionPlan: {
          currentPhase: 'Relationship Support',
          completedTasks: 3,
          totalTasks: 7,
          nextMilestone: 'Partner Session',
        },
      },
    ];

    setMetrics(mockMetrics);
    setPatients(mockPatients);
  };

  const simulateRealtimeUpdate = () => {
    const updateTypes = [
      'cycle_update',
      'assessment_completed',
      'appointment_scheduled',
      'intervention_progress',
      'alert',
    ] as const;

    const mockUpdates = [
      {
        type: 'cycle_update' as const,
        message: 'Follicle count updated: 12 follicles detected',
        priority: 'medium' as const,
      },
      {
        type: 'assessment_completed' as const,
        message: 'Completed anxiety assessment - score improved',
        priority: 'low' as const,
      },
      {
        type: 'intervention_progress' as const,
        message: 'Completed mindfulness exercise milestone',
        priority: 'low' as const,
      },
      {
        type: 'alert' as const,
        message: 'High stress level detected - immediate attention needed',
        priority: 'high' as const,
      },
    ];

    const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];

    if (randomPatient) {
      const newUpdate: RealtimeUpdate = {
        id: Date.now().toString(),
        patientId: randomPatient.id,
        patientName: randomPatient.name,
        type: randomUpdate.type,
        message: randomUpdate.message,
        timestamp: new Date().toISOString(),
        priority: randomUpdate.priority,
      };

      setRealtimeUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
      setLastRefresh(new Date());

      // Update patient progress randomly
      if (Math.random() > 0.7) {
        setPatients(prev => prev.map(p => 
          p.id === randomPatient.id 
            ? { ...p, progress: Math.min(100, p.progress + Math.floor(Math.random() * 10)) }
            : p
        ));
      }
    }
  };

  const refreshDashboard = () => {
    loadDashboardData();
    setLastRefresh(new Date());
  };

  const getStatusColor = (status: PatientStatus['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'monitoring': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'stable': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: PatientStatus['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'monitoring': return 'secondary';
      case 'critical': return 'destructive';
      case 'stable': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: RealtimeUpdate['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackToHome />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Dashboard</h1>
            <p className="text-gray-600">Live monitoring of patient interventions and IVF cycles</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button onClick={refreshDashboard} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalPatients}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{metrics.newPatientsThisWeek} this week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Interventions</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activeInterventions}</p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {metrics.completionRate}% completion rate
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.todayAppointments}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">Next in 30 minutes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.criticalAlerts}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="flex items-center mt-2">
                  <Bell className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">Requires attention</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">Patient Monitoring</TabsTrigger>
            <TabsTrigger value="updates">Live Updates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {patients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(patient.status)}`}></div>
                          <div>
                            <CardTitle className="text-lg">{patient.name}</CardTitle>
                            <CardDescription>{patient.currentPhase}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadgeVariant(patient.status)}>
                            {patient.status.toUpperCase()}
                          </Badge>
                          {patient.alerts > 0 && (
                            <Badge variant="destructive">
                              {patient.alerts} alerts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{patient.progress}%</span>
                        </div>
                        <Progress value={patient.progress} className="h-2" />
                      </div>

                      {patient.interventionPlan && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Intervention Plan</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Current Phase: {patient.interventionPlan.currentPhase}</span>
                              <span>
                                {patient.interventionPlan.completedTasks}/{patient.interventionPlan.totalTasks} tasks
                              </span>
                            </div>
                            <Progress 
                              value={(patient.interventionPlan.completedTasks / patient.interventionPlan.totalTasks) * 100} 
                              className="h-1" 
                            />
                            <p className="text-xs text-gray-600">
                              Next: {patient.interventionPlan.nextMilestone}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          {patient.cycleDay && (
                            <span className="text-gray-600">Day {patient.cycleDay}</span>
                          )}
                          <span className="text-gray-500">Updated {patient.lastUpdate}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>

                      {patient.nextAppointment && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Next appointment: {patient.nextAppointment}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Updates</CardTitle>
                <CardDescription>Real-time patient and system updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realtimeUpdates.length > 0 ? (
                    realtimeUpdates.map((update) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          update.priority === 'high' ? 'bg-red-500' :
                          update.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{update.patientName}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(update.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                          <Badge variant="outline" className={`mt-2 ${getPriorityColor(update.priority)}`}>
                            {update.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent updates. Monitoring for real-time changes...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                  <CardDescription>Intervention and treatment outcomes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Intervention Completion Rate</span>
                    <span className="font-bold">{metrics.completionRate}%</span>
                  </div>
                  <Progress value={metrics.completionRate} />
                  
                  <div className="flex justify-between items-center">
                    <span>Average Progress Score</span>
                    <span className="font-bold">{metrics.avgProgressScore}%</span>
                  </div>
                  <Progress value={metrics.avgProgressScore} />
                  
                  <div className="flex justify-between items-center">
                    <span>Successful Outcomes</span>
                    <span className="font-bold">{metrics.successfulOutcomes}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>EMR Sync Status</span>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>AI Analysis Queue</span>
                    <span className="text-sm">3 pending</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Response Time</span>
                    <span className="text-sm text-green-600">&lt; 2s</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <span className="text-sm text-green-600">99.9%</span>
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

export default RealTimeDashboard;
