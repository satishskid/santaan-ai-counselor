import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [patients, upcomingAppointments, treatmentPlans, assessments] = await Promise.all([
      prisma.patient.findMany(),
      prisma.appointment.findMany({
        where: {
          appointmentDate: {
            gte: new Date(),
          },
          status: 'SCHEDULED',
        },
        include: {
          patient: true,
        },
        orderBy: { appointmentDate: 'asc' },
        take: 10,
      }),
      prisma.treatmentPlan.findMany(),
      prisma.assessment.findMany(),
    ]);

    const stats = {
      totalPatients: patients.length,
      upcomingAppointments: upcomingAppointments.length,
      activeTreatmentPlans: treatmentPlans.filter(tp => tp.status === 'ACTIVE').length,
      completedAssessments: assessments.filter(a => a.status === 'COMPLETED').length,
      recentPatients: patients.slice(0, 5),
      todaysAppointments: upcomingAppointments.slice(0, 5),
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
        assessments: true,
        treatmentPlans: true,
        appointments: true,
        notes: true,
        counselor: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (error) {
    console.error('Patients fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get patient by ID
app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
        assessments: true,
        treatmentPlans: {
          include: {
            milestones: true,
            interventions: true,
          }
        },
        appointments: true,
        notes: {
          include: {
            counselor: true,
          }
        },
        counselor: true,
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Patient fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Create new patient
app.post('/api/patients', async (req, res) => {
  try {
    const patient = await prisma.patient.create({
      data: req.body,
      include: {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
      }
    });
    res.status(201).json(patient);
  } catch (error) {
    console.error('Patient creation error:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Get appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = patientId ? { patientId } : {};
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        counselor: true,
      },
      orderBy: { appointmentDate: 'asc' }
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get upcoming appointments
app.get('/api/appointments/upcoming', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(),
        },
        status: 'SCHEDULED',
      },
      include: {
        patient: true,
        counselor: true,
      },
      orderBy: { appointmentDate: 'asc' },
      take: 10,
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Upcoming appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming appointments' });
  }
});

// Get assessments
app.get('/api/assessments', async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = patientId ? { patientId } : {};
    
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        patient: true,
        counselor: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(assessments);
  } catch (error) {
    console.error('Assessments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Get treatment plans
app.get('/api/treatment-plans', async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = patientId ? { patientId } : {};
    
    const treatmentPlans = await prisma.treatmentPlan.findMany({
      where,
      include: {
        patient: true,
        counselor: true,
        milestones: true,
        interventions: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(treatmentPlans);
  } catch (error) {
    console.error('Treatment plans fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch treatment plans' });
  }
});

// IVF EMR Integration Endpoints

// Test EMR connection
app.post('/api/emr/test-connection', async (req, res) => {
  try {
    const { config } = req.body;

    // Mock EMR connection test
    const mockResult = {
      success: true,
      message: 'EMR connection successful',
      capabilities: [
        'Patient Management',
        'Cycle Management',
        'Medication Tracking',
        'Lab Results',
        'Procedures',
        'Appointments'
      ]
    };

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json(mockResult);
  } catch (error) {
    console.error('EMR connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'EMR connection failed',
      error: error.message
    });
  }
});

// Pull patient data from EMR
app.get('/api/emr/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    // Mock IVF patient data from EMR
    const mockPatientData = {
      id: patientId,
      mrn: 'IVF-2024-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      // IVF-specific data
      partnerId: 'partner-001',
      partnerName: 'Michael Johnson',
      partnerAge: 32,
      diagnosisPrimary: 'Unexplained infertility',
      diagnosisSecondary: 'Male factor (mild)',
      amh: 2.8,
      fsh: 6.2,
      lh: 4.1,
      estradiol: 45,
      progesterone: 1.2,
      bmi: 23.5,
      bloodType: 'O+',
      previousPregnancies: 0,
      liveBirths: 0,
      miscarriages: 1,
      currentCycle: {
        id: 'cycle-001',
        cycleNumber: 2,
        protocol: 'Long Protocol',
        startDate: '2024-01-15',
        expectedRetrievalDate: '2024-02-05',
        status: 'stimulation',
        medications: [
          {
            name: 'Gonal-F',
            dosage: '225 IU',
            frequency: 'Daily',
            startDate: '2024-01-15',
            route: 'injection'
          },
          {
            name: 'Cetrotide',
            dosage: '0.25mg',
            frequency: 'Daily',
            startDate: '2024-01-20',
            route: 'injection'
          }
        ],
        monitoring: [
          {
            date: '2024-01-18',
            type: 'both',
            follicleCount: 8,
            leadFollicleSize: 12,
            endometrialThickness: 6.2,
            estradiol: 180
          },
          {
            date: '2024-01-21',
            type: 'both',
            follicleCount: 12,
            leadFollicleSize: 16,
            endometrialThickness: 8.1,
            estradiol: 420
          }
        ]
      },
      treatmentHistory: [
        {
          id: 'treatment-001',
          type: 'ivf',
          startDate: '2023-08-01',
          endDate: '2023-10-15',
          clinic: 'Fertility Center of Excellence',
          physician: 'Dr. Emily Chen',
          outcome: 'unsuccessful',
          cycles: [
            {
              id: 'prev-cycle-001',
              cycleNumber: 1,
              protocol: 'Antagonist Protocol',
              startDate: '2023-08-01',
              status: 'completed',
              outcomes: {
                eggsRetrieved: 8,
                matureEggs: 6,
                fertilized: 4,
                embryosDay5: 2,
                embryosTransferred: 1,
                embryosFrozen: 1,
                pregnancyTest: {
                  date: '2023-09-15',
                  result: 'negative',
                  betaHCG: 2
                }
              }
            }
          ]
        }
      ]
    };

    res.json({
      success: true,
      data: mockPatientData,
      message: 'Patient data retrieved successfully from EMR'
    });
  } catch (error) {
    console.error('EMR patient data fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient data from EMR',
      error: error.message
    });
  }
});

// Push counseling data to EMR
app.post('/api/emr/counseling', async (req, res) => {
  try {
    const counselingData = req.body;

    // Mock pushing counseling data to EMR
    const mockResponse = {
      success: true,
      recordId: `encounter-${Date.now()}`,
      message: 'Counseling data successfully pushed to EMR',
      details: {
        encounterCreated: true,
        aiAnalysisRecorded: !!counselingData.aiPersonaAnalysis,
        interventionPlanCreated: !!counselingData.interventionPlan,
        assessmentResultsRecorded: !!counselingData.assessmentResults
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json(mockResponse);
  } catch (error) {
    console.error('EMR counseling data push error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to push counseling data to EMR',
      error: error.message
    });
  }
});

// Get EMR configuration
app.get('/api/emr/config', async (req, res) => {
  try {
    // Mock EMR configuration
    const mockConfig = {
      enabled: false,
      provider: 'custom',
      baseUrl: '',
      apiKey: '',
      timeout: 30000,
      retryAttempts: 3,
      ivfSpecific: {
        cycleManagement: true,
        medicationTracking: true,
        monitoringIntegration: true,
        labResultsSync: true,
        procedureScheduling: true,
        outcomeTracking: true,
        counselingIntegration: true,
        aiAnalysisSharing: true
      },
      webhooks: {
        enabled: false,
        endpoints: {},
        authentication: {
          type: 'bearer',
          secret: ''
        }
      }
    };

    res.json(mockConfig);
  } catch (error) {
    console.error('EMR config fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch EMR configuration' });
  }
});

// Save EMR configuration
app.post('/api/emr/config', async (req, res) => {
  try {
    const config = req.body;

    // Mock saving EMR configuration
    console.log('Saving EMR configuration:', config);

    res.json({
      success: true,
      message: 'EMR configuration saved successfully'
    });
  } catch (error) {
    console.error('EMR config save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save EMR configuration',
      error: error.message
    });
  }
});

// Webhook endpoint for EMR updates
app.post('/api/emr/webhook', async (req, res) => {
  try {
    const { type, data, timestamp } = req.body;

    console.log('EMR webhook received:', { type, timestamp });

    // Process different types of EMR updates
    switch (type) {
      case 'cycle_update':
        console.log('Processing cycle update:', data);
        break;
      case 'lab_results':
        console.log('Processing lab results:', data);
        break;
      case 'appointment_update':
        console.log('Processing appointment update:', data);
        break;
      case 'procedure_completed':
        console.log('Processing procedure completion:', data);
        break;
      default:
        console.log('Unknown webhook type:', type);
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('EMR webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down API server...');
  await prisma.$disconnect();
  process.exit(0);
});
