import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Heart,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  MessageCircle,
  Bell,
  User,
  Activity,
  TrendingUp,
  Pill,
  TestTube,
  Brain,
  Phone,
  Video,
  Download,
  Share2,
  Star,
  Award,
  Zap,
  Smile,
  AlertCircle,
  ChevronRight,
  PlayCircle,
  FileText,
  Headphones,
} from 'lucide-react';

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  currentCycle?: {
    cycleNumber: number;
    day: number;
    phase: string;
    nextAppointment: string;
  };
  interventionPlan?: InterventionPlan;
  progress: {
    overall: number;
    currentPhase: number;
    completedTasks: number;
    totalTasks: number;
  };
  upcomingTasks: Task[];
  achievements: Achievement[];
  resources: Resource[];
  appointments: Appointment[];
}

interface InterventionPlan {
  id: string;
  title: string;
  description: string;
  currentPhase: Phase;
  phases: Phase[];
  personalizedStrategies: Strategy[];
  goals: Goal[];
  timeline: string;
  createdBy: string;
  lastUpdated: string;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming';
  tasks: Task[];
  milestones: Milestone[];
  progress: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'reading' | 'reflection' | 'assessment' | 'appointment';
  dueDate?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  resources?: Resource[];
}

interface Strategy {
  id: string;
  title: string;
  description: string;
  category: 'coping' | 'communication' | 'stress_management' | 'relationship' | 'lifestyle';
  techniques: string[];
  resources: Resource[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'progress' | 'consistency' | 'milestone' | 'engagement';
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'exercise' | 'worksheet';
  description: string;
  url?: string;
  duration?: string;
  category: string;
  tags: string[];
}

interface Appointment {
  id: string;
  title: string;
  type: 'counseling' | 'medical' | 'assessment';
  date: string;
  time: string;
  provider: string;
  location: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const PatientApp: React.FC<{ patientId?: string }> = ({ patientId: propPatientId }) => {
  const { patientId: urlPatientId } = useParams();
  const [searchParams] = useSearchParams();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Determine patient ID from URL params or props
  const patientId = urlPatientId || propPatientId || 'patient-001';

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'plan', 'resources', 'progress'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);

    try {
      // Try to load from API first
      if (isOnline) {
        const response = await fetch(`/api/emr/patients/${patientId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Transform EMR data to patient app format
            const transformedData = transformEMRDataToPatientData(result.data);
            setPatientData(transformedData);
            // Cache data for offline use
            localStorage.setItem(`patient-data-${patientId}`, JSON.stringify(transformedData));
            setLoading(false);
            return;
          }
        }
      }

      // Fallback to cached data if offline or API fails
      const cachedData = localStorage.getItem(`patient-data-${patientId}`);
      if (cachedData) {
        setPatientData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Final fallback to mock data
      const mockPatientData = generateMockPatientData(patientId);
      setPatientData(mockPatientData);
      setLoading(false);

    } catch (error) {
      console.error('Error loading patient data:', error);

      // Try cached data on error
      const cachedData = localStorage.getItem(`patient-data-${patientId}`);
      if (cachedData) {
        setPatientData(JSON.parse(cachedData));
      } else {
        // Final fallback to mock data
        const mockPatientData = generateMockPatientData(patientId);
        setPatientData(mockPatientData);
      }
      setLoading(false);
    }
  };

  const transformEMRDataToPatientData = (emrData: any): PatientData => {
    // Transform EMR data structure to PatientApp data structure
    return {
      id: emrData.id,
      firstName: emrData.firstName,
      lastName: emrData.lastName,
      email: emrData.email,
      currentCycle: emrData.currentCycle ? {
        cycleNumber: emrData.currentCycle.cycleNumber,
        day: emrData.currentCycle.day || 1,
        phase: emrData.currentCycle.status || 'Planning',
        nextAppointment: emrData.currentCycle.nextAppointment || 'Not scheduled',
      } : undefined,
      progress: {
        overall: 65, // Calculate based on intervention plan
        currentPhase: 75,
        completedTasks: 12,
        totalTasks: 18,
      },
      // Generate intervention plan based on EMR data
      interventionPlan: generateInterventionPlan(emrData),
      upcomingTasks: generateUpcomingTasks(),
      achievements: generateAchievements(),
      resources: generateResources(),
      appointments: emrData.appointments || [],
    };
  };

  const generateMockPatientData = (patientId: string): PatientData => {
    // Mock patient data - in production, this would come from your API
    const mockPatientData: PatientData = {
      id: patientId,
      firstName: 'Kavya',
      lastName: 'Reddy',
      email: 'kavya.reddy@email.com',
      avatar: '/api/placeholder/150/150',
      currentCycle: {
        cycleNumber: 2,
        day: 8,
        phase: 'Stimulation Phase',
        nextAppointment: 'Tomorrow 2:30 PM',
      },
      progress: {
        overall: 65,
        currentPhase: 75,
        completedTasks: 12,
        totalTasks: 18,
      },
      interventionPlan: {
        id: 'plan-001',
        title: 'Personalized IVF Support Journey',
        description: 'A comprehensive support plan tailored to your unique needs and circumstances.',
        timeline: '12 weeks',
        createdBy: 'Dr. Emily Chen',
        lastUpdated: '2024-01-15',
        currentPhase: {
          id: 'phase-2',
          name: 'Active Treatment Support',
          description: 'Supporting you through the active treatment phase with stress management and coping strategies.',
          duration: '4 weeks',
          status: 'current',
          progress: 75,
          tasks: [
            {
              id: 'task-1',
              title: 'Daily Mindfulness Practice',
              description: 'Practice 10 minutes of guided mindfulness meditation',
              type: 'exercise',
              completed: true,
              priority: 'high',
              estimatedTime: '10 minutes',
            },
            {
              id: 'task-2',
              title: 'Stress Level Check-in',
              description: 'Complete daily stress assessment',
              type: 'assessment',
              completed: false,
              priority: 'medium',
              estimatedTime: '5 minutes',
              dueDate: 'Today',
            },
          ],
          milestones: [
            {
              id: 'milestone-1',
              title: 'Stress Management Mastery',
              description: 'Successfully implement stress reduction techniques',
              targetDate: '2024-02-01',
              completed: false,
            },
          ],
        },
        phases: [
          {
            id: 'phase-1',
            name: 'Preparation & Assessment',
            description: 'Initial assessment and preparation for treatment',
            duration: '2 weeks',
            status: 'completed',
            progress: 100,
            tasks: [],
            milestones: [],
          },
          {
            id: 'phase-2',
            name: 'Active Treatment Support',
            description: 'Supporting you through the active treatment phase',
            duration: '4 weeks',
            status: 'current',
            progress: 75,
            tasks: [],
            milestones: [],
          },
          {
            id: 'phase-3',
            name: 'Post-Treatment Integration',
            description: 'Integration and follow-up support',
            duration: '6 weeks',
            status: 'upcoming',
            progress: 0,
            tasks: [],
            milestones: [],
          },
        ],
        personalizedStrategies: [
          {
            id: 'strategy-1',
            title: 'Mindful Breathing Techniques',
            description: 'Personalized breathing exercises for anxiety management',
            category: 'stress_management',
            techniques: ['4-7-8 Breathing', 'Box Breathing', 'Progressive Relaxation'],
            resources: [],
          },
          {
            id: 'strategy-2',
            title: 'Partner Communication Guide',
            description: 'Strategies for maintaining healthy communication with your partner',
            category: 'relationship',
            techniques: ['Active Listening', 'Emotion Sharing', 'Conflict Resolution'],
            resources: [],
          },
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Reduce Treatment Anxiety',
            description: 'Lower anxiety levels related to IVF treatment',
            targetDate: '2024-02-15',
            progress: 70,
            milestones: [],
          },
          {
            id: 'goal-2',
            title: 'Improve Coping Skills',
            description: 'Develop effective coping strategies for treatment stress',
            targetDate: '2024-03-01',
            progress: 45,
            milestones: [],
          },
        ],
      },
      upcomingTasks: [
        {
          id: 'task-today-1',
          title: 'Morning Meditation',
          description: 'Start your day with 10 minutes of guided meditation',
          type: 'exercise',
          completed: false,
          priority: 'high',
          estimatedTime: '10 minutes',
          dueDate: 'Today',
        },
        {
          id: 'task-today-2',
          title: 'Stress Assessment',
          description: 'Complete your daily stress level check-in',
          type: 'assessment',
          completed: false,
          priority: 'medium',
          estimatedTime: '5 minutes',
          dueDate: 'Today',
        },
        {
          id: 'task-tomorrow-1',
          title: 'Partner Communication Exercise',
          description: 'Practice active listening with your partner',
          type: 'exercise',
          completed: false,
          priority: 'medium',
          estimatedTime: '20 minutes',
          dueDate: 'Tomorrow',
        },
      ],
      achievements: [
        {
          id: 'achievement-1',
          title: 'Consistency Champion',
          description: 'Completed daily tasks for 7 days straight',
          icon: '🏆',
          earnedDate: '2024-01-10',
          category: 'consistency',
        },
        {
          id: 'achievement-2',
          title: 'Mindfulness Master',
          description: 'Completed 20 meditation sessions',
          icon: '🧘‍♀️',
          earnedDate: '2024-01-12',
          category: 'progress',
        },
        {
          id: 'achievement-3',
          title: 'Progress Pioneer',
          description: 'Reached 50% completion of current phase',
          icon: '⭐',
          earnedDate: '2024-01-14',
          category: 'milestone',
        },
      ],
      resources: [
        {
          id: 'resource-1',
          title: 'Understanding IVF: A Complete Guide',
          type: 'article',
          description: 'Comprehensive guide to IVF process and what to expect',
          duration: '15 min read',
          category: 'Education',
          tags: ['IVF', 'Treatment', 'Guide'],
        },
        {
          id: 'resource-2',
          title: 'Relaxation Techniques for Fertility',
          type: 'video',
          description: 'Guided relaxation exercises specifically for fertility treatment',
          duration: '20 minutes',
          category: 'Wellness',
          tags: ['Relaxation', 'Stress Management', 'Video'],
        },
        {
          id: 'resource-3',
          title: 'Fertility Meditation',
          type: 'audio',
          description: 'Calming meditation designed for fertility journey',
          duration: '12 minutes',
          category: 'Mindfulness',
          tags: ['Meditation', 'Audio', 'Fertility'],
        },
      ],
      appointments: [
        {
          id: 'appt-1',
          title: 'Counseling Session',
          type: 'counseling',
          date: '2024-01-16',
          time: '2:30 PM',
          provider: 'Dr. Emily Chen',
          location: 'Fertility Center - Room 203',
          status: 'scheduled',
        },
        {
          id: 'appt-2',
          title: 'Monitoring Appointment',
          type: 'medical',
          date: '2024-01-18',
          time: '10:00 AM',
          provider: 'Dr. Priya Sharma',
          location: 'Fertility Center - Ultrasound Suite',
          status: 'scheduled',
        },
      ],
    };

    return mockPatientData;
  };

  const completeTask = async (taskId: string) => {
    if (!patientData) return;

    try {
      // Update local state immediately for better UX
      setPatientData(prev => ({
        ...prev!,
        upcomingTasks: prev!.upcomingTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        ),
        progress: {
          ...prev!.progress,
          completedTasks: prev!.progress.completedTasks + 1,
        },
      }));

      // Save to local storage
      const updatedData = {
        ...patientData,
        upcomingTasks: patientData.upcomingTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        ),
        progress: {
          ...patientData.progress,
          completedTasks: patientData.progress.completedTasks + 1,
        },
      };
      localStorage.setItem(`patient-data-${patientId}`, JSON.stringify(updatedData));

      // Sync with server if online
      if (isOnline) {
        await fetch('/api/patient/tasks/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId,
            taskId,
            completedAt: new Date().toISOString(),
          }),
        });
      } else {
        // Store for later sync when online
        const offlineActions = JSON.parse(localStorage.getItem('offline-actions') || '[]');
        offlineActions.push({
          type: 'COMPLETE_TASK',
          patientId,
          taskId,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('offline-actions', JSON.stringify(offlineActions));
      }

      // Show achievement if milestone reached
      checkForAchievements(updatedData);

    } catch (error) {
      console.error('Error completing task:', error);
      // Revert optimistic update on error
      loadPatientData();
    }
  };

  const checkForAchievements = (data: PatientData) => {
    const completedTasks = data.progress.completedTasks;

    // Check for task completion milestones
    if (completedTasks === 5 && !data.achievements.find(a => a.id === 'first-five')) {
      const newAchievement: Achievement = {
        id: 'first-five',
        title: 'Getting Started',
        description: 'Completed your first 5 tasks',
        icon: '🌟',
        earnedDate: new Date().toISOString(),
        category: 'progress',
      };

      // Add achievement with animation
      setTimeout(() => {
        setPatientData(prev => ({
          ...prev!,
          achievements: [newAchievement, ...prev!.achievements],
        }));

        // Show achievement notification
        showAchievementNotification(newAchievement);
      }, 500);
    }
  };

  const showAchievementNotification = (achievement: Achievement) => {
    // Create achievement notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 300px;
        animation: slideIn 0.5s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 24px;">${achievement.icon}</div>
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">Achievement Unlocked!</div>
            <div style="font-size: 14px; opacity: 0.9;">${achievement.title}</div>
            <div style="font-size: 12px; opacity: 0.8;">${achievement.description}</div>
          </div>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  // Helper functions for generating data
  const generateInterventionPlan = (emrData: any): InterventionPlan => {
    return {
      id: 'plan-001',
      title: 'Personalized IVF Support Journey',
      description: 'A comprehensive support plan tailored to your unique needs and circumstances.',
      timeline: '12 weeks',
      createdBy: 'Dr. Emily Chen',
      lastUpdated: '2024-01-15',
      currentPhase: {
        id: 'phase-2',
        name: 'Active Treatment Support',
        description: 'Supporting you through the active treatment phase with stress management and coping strategies.',
        duration: '4 weeks',
        status: 'current',
        progress: 75,
        tasks: [],
        milestones: [],
      },
      phases: [
        {
          id: 'phase-1',
          name: 'Preparation & Assessment',
          description: 'Initial assessment and preparation for treatment',
          duration: '2 weeks',
          status: 'completed',
          progress: 100,
          tasks: [],
          milestones: [],
        },
        {
          id: 'phase-2',
          name: 'Active Treatment Support',
          description: 'Supporting you through the active treatment phase',
          duration: '4 weeks',
          status: 'current',
          progress: 75,
          tasks: [],
          milestones: [],
        },
        {
          id: 'phase-3',
          name: 'Post-Treatment Integration',
          description: 'Integration and follow-up support',
          duration: '6 weeks',
          status: 'upcoming',
          progress: 0,
          tasks: [],
          milestones: [],
        },
      ],
      personalizedStrategies: [
        {
          id: 'strategy-1',
          title: 'Mindful Breathing Techniques',
          description: 'Personalized breathing exercises for anxiety management',
          category: 'stress_management',
          techniques: ['4-7-8 Breathing', 'Box Breathing', 'Progressive Relaxation'],
          resources: [],
        },
        {
          id: 'strategy-2',
          title: 'Partner Communication Guide',
          description: 'Strategies for maintaining healthy communication with your partner',
          category: 'relationship',
          techniques: ['Active Listening', 'Emotion Sharing', 'Conflict Resolution'],
          resources: [],
        },
      ],
      goals: [
        {
          id: 'goal-1',
          title: 'Reduce Treatment Anxiety',
          description: 'Lower anxiety levels related to IVF treatment',
          targetDate: '2024-02-15',
          progress: 70,
          milestones: [],
        },
        {
          id: 'goal-2',
          title: 'Improve Coping Skills',
          description: 'Develop effective coping strategies for treatment stress',
          targetDate: '2024-03-01',
          progress: 45,
          milestones: [],
        },
      ],
    };
  };

  const generateUpcomingTasks = (): Task[] => {
    return [
      {
        id: 'task-today-1',
        title: 'Morning Meditation',
        description: 'Start your day with 10 minutes of guided meditation',
        type: 'exercise',
        completed: false,
        priority: 'high',
        estimatedTime: '10 minutes',
        dueDate: 'Today',
      },
      {
        id: 'task-today-2',
        title: 'Stress Assessment',
        description: 'Complete your daily stress level check-in',
        type: 'assessment',
        completed: false,
        priority: 'medium',
        estimatedTime: '5 minutes',
        dueDate: 'Today',
      },
      {
        id: 'task-tomorrow-1',
        title: 'Partner Communication Exercise',
        description: 'Practice active listening with your partner',
        type: 'exercise',
        completed: false,
        priority: 'medium',
        estimatedTime: '20 minutes',
        dueDate: 'Tomorrow',
      },
    ];
  };

  const generateAchievements = (): Achievement[] => {
    return [
      {
        id: 'achievement-1',
        title: 'Consistency Champion',
        description: 'Completed daily tasks for 7 days straight',
        icon: '🏆',
        earnedDate: '2024-01-10',
        category: 'consistency',
      },
      {
        id: 'achievement-2',
        title: 'Mindfulness Master',
        description: 'Completed 20 meditation sessions',
        icon: '🧘‍♀️',
        earnedDate: '2024-01-12',
        category: 'progress',
      },
      {
        id: 'achievement-3',
        title: 'Progress Pioneer',
        description: 'Reached 50% completion of current phase',
        icon: '⭐',
        earnedDate: '2024-01-14',
        category: 'milestone',
      },
    ];
  };

  const generateResources = (): Resource[] => {
    return [
      {
        id: 'resource-1',
        title: 'Understanding IVF: A Complete Guide',
        type: 'article',
        description: 'Comprehensive guide to IVF process and what to expect',
        duration: '15 min read',
        category: 'Education',
        tags: ['IVF', 'Treatment', 'Guide'],
      },
      {
        id: 'resource-2',
        title: 'Relaxation Techniques for Fertility',
        type: 'video',
        description: 'Guided relaxation exercises specifically for fertility treatment',
        duration: '20 minutes',
        category: 'Wellness',
        tags: ['Relaxation', 'Stress Management', 'Video'],
      },
      {
        id: 'resource-3',
        title: 'Fertility Meditation',
        type: 'audio',
        description: 'Calming meditation designed for fertility journey',
        duration: '12 minutes',
        category: 'Mindfulness',
        tags: ['Meditation', 'Audio', 'Fertility'],
      },
    ];
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'exercise': return <Activity className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'reflection': return <Brain className="w-4 h-4" />;
      case 'assessment': return <CheckCircle className="w-4 h-4" />;
      case 'appointment': return <Calendar className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return <FileText className="w-5 h-5" />;
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      case 'exercise': return <Activity className="w-5 h-5" />;
      case 'worksheet': return <FileText className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load patient data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm z-50">
          📱 You're offline - some features may be limited
        </div>
      )}

      {/* Mobile-First Design */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl" style={{ marginTop: !isOnline ? '40px' : '0' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src={patientData.avatar} />
              <AvatarFallback className="bg-white text-blue-600 text-lg font-bold">
                {patientData.firstName[0]}{patientData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">
                Hello, {patientData.firstName}!
              </h1>
              <p className="text-blue-100">Your IVF Support Journey</p>
              {patientData.currentCycle && (
                <div className="flex items-center mt-2 text-sm">
                  <TestTube className="w-4 h-4 mr-1" />
                  <span>Cycle {patientData.currentCycle.cycleNumber}, Day {patientData.currentCycle.day}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="mt-6 bg-white/10 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm font-bold">{patientData.progress.overall}%</span>
            </div>
            <Progress value={patientData.progress.overall} className="h-2 bg-white/20" />
            <div className="flex justify-between text-xs mt-2 text-blue-100">
              <span>{patientData.progress.completedTasks} of {patientData.progress.totalTasks} tasks completed</span>
              <span>{patientData.interventionPlan?.currentPhase.name}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 m-0 rounded-none">
            <TabsTrigger value="dashboard" className="text-xs">
              <div className="flex flex-col items-center">
                <Activity className="w-4 h-4 mb-1" />
                <span>Today</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="plan" className="text-xs">
              <div className="flex flex-col items-center">
                <Target className="w-4 h-4 mb-1" />
                <span>Plan</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">
              <div className="flex flex-col items-center">
                <BookOpen className="w-4 h-4 mb-1" />
                <span>Resources</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">
              <div className="flex flex-col items-center">
                <TrendingUp className="w-4 h-4 mb-1" />
                <span>Progress</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="p-4 space-y-4">
            {/* Today's Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>
                  {patientData.upcomingTasks.filter(t => t.dueDate === 'Today' && !t.completed).length} tasks remaining
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {patientData.upcomingTasks
                  .filter(task => task.dueDate === 'Today')
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border ${getPriorityColor(task.priority)} ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">
                            {getTaskIcon(task.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{task.estimatedTime}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {!task.completed && (
                          <Button
                            size="sm"
                            onClick={() => completeTask(task.id)}
                            className="ml-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </CardContent>
            </Card>

            {/* Next Appointment */}
            {patientData.currentCycle?.nextAppointment && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Next Appointment</h4>
                      <p className="text-sm text-gray-600">{patientData.currentCycle.nextAppointment}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Achievements */}
            {patientData.achievements.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patientData.achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="text-xs">Message Counselor</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Phone className="w-5 h-5 mb-1" />
                    <span className="text-xs">Emergency Contact</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Bell className="w-5 h-5 mb-1" />
                    <span className="text-xs">Set Reminder</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Share2 className="w-5 h-5 mb-1" />
                    <span className="text-xs">Share Progress</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intervention Plan Tab */}
          <TabsContent value="plan" className="p-4 space-y-4">
            {patientData.interventionPlan && (
              <>
                {/* Plan Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{patientData.interventionPlan.title}</CardTitle>
                    <CardDescription>{patientData.interventionPlan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Timeline:</span>
                        <span className="font-medium">{patientData.interventionPlan.timeline}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Created by:</span>
                        <span className="font-medium">{patientData.interventionPlan.createdBy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last updated:</span>
                        <span className="font-medium">
                          {new Date(patientData.interventionPlan.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Phase */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-500" />
                      Current Phase
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{patientData.interventionPlan.currentPhase.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {patientData.interventionPlan.currentPhase.description}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Phase Progress</span>
                          <span>{patientData.interventionPlan.currentPhase.progress}%</span>
                        </div>
                        <Progress value={patientData.interventionPlan.currentPhase.progress} />
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Upcoming Tasks</h4>
                        <div className="space-y-2">
                          {patientData.interventionPlan.currentPhase.tasks.map((task) => (
                            <div key={task.id} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                task.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              <span className={`text-sm ${
                                task.completed ? 'line-through text-gray-500' : ''
                              }`}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* All Phases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Treatment Phases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientData.interventionPlan.phases.map((phase, index) => (
                        <div key={phase.id} className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              phase.status === 'completed' ? 'bg-green-500 text-white' :
                              phase.status === 'current' ? 'bg-blue-500 text-white' :
                              'bg-gray-200 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            {index < patientData.interventionPlan!.phases.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{phase.name}</h4>
                            <p className="text-sm text-gray-600">{phase.description}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <Badge variant={
                                phase.status === 'completed' ? 'default' :
                                phase.status === 'current' ? 'secondary' : 'outline'
                              }>
                                {phase.status}
                              </Badge>
                              <span className="text-xs text-gray-500">{phase.duration}</span>
                            </div>
                            {phase.status !== 'upcoming' && (
                              <div className="mt-2">
                                <Progress value={phase.progress} className="h-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-500" />
                      Your Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientData.interventionPlan.goals.map((goal) => (
                        <div key={goal.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{goal.title}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personalized Strategies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-500" />
                      Your Personalized Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientData.interventionPlan.personalizedStrategies.map((strategy) => (
                        <div key={strategy.id} className="border rounded-lg p-3">
                          <h4 className="font-medium mb-2">{strategy.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Techniques:</h5>
                            <div className="flex flex-wrap gap-2">
                              {strategy.techniques.map((technique, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {technique}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Educational Resources
                </CardTitle>
                <CardDescription>
                  Curated resources to support your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.resources.map((resource) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {resource.category}
                              </Badge>
                              {resource.duration && (
                                <span className="text-xs text-gray-500">{resource.duration}</span>
                              )}
                            </div>
                            <Button size="sm" variant="outline">
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Open
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {resource.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col">
                    <Headphones className="w-6 h-6 mb-2" />
                    <span className="text-sm">Meditation Library</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <PlayCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm">Video Guides</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span className="text-sm">Worksheets</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="w-6 h-6 mb-2" />
                    <span className="text-sm">Downloads</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="p-4 space-y-4">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Journey</span>
                    <span className="font-bold">{patientData.progress.overall}%</span>
                  </div>
                  <Progress value={patientData.progress.overall} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Phase</span>
                    <span className="font-bold">{patientData.progress.currentPhase}%</span>
                  </div>
                  <Progress value={patientData.progress.currentPhase} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {patientData.progress.completedTasks}
                    </div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {patientData.achievements.length}
                    </div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Week's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasks Completed</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">8/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Meditation Sessions</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">5/7</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-5/7 h-full bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stress Level (avg)</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">3/10</span>
                      <Smile className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.appointments
                    .filter(apt => apt.status === 'scheduled')
                    .map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{appointment.title}</h4>
                            <p className="text-sm text-gray-600">{appointment.provider}</p>
                            <p className="text-sm text-gray-500">{appointment.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(appointment.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {appointment.type}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientApp;