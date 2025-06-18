import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest } from '../../_lib/middleware';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  // Authenticate user
  if (!authenticate(req, res)) return;

  // Only counselors and admins can access EMR patient data
  if (!['COUNSELOR', 'ADMIN'].includes(req.user?.role || '')) {
    return apiResponse.error(res, 'Insufficient permissions', 403);
  }

  const { patientId } = req.query;

  if (!patientId || typeof patientId !== 'string') {
    return apiResponse.error(res, 'Patient ID is required', 400);
  }

  try {
    // Mock IVF patient data from EMR
    const mockPatientData = {
      id: patientId,
      mrn: `IVF-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
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
      
      // Lab values
      amh: 2.8,
      fsh: 6.2,
      lh: 4.1,
      estradiol: 45,
      progesterone: 1.2,
      bmi: 23.5,
      bloodType: 'O+',
      
      // Reproductive history
      previousPregnancies: 0,
      liveBirths: 0,
      miscarriages: 1,
      
      // Current cycle information
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
      
      // Treatment history
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
      ],
      
      // Psychological assessments from EMR
      psychologicalProfile: {
        anxietyLevel: 'moderate',
        depressionScreening: 'mild',
        copingStrategies: ['support_groups', 'meditation', 'exercise'],
        previousCounseling: true,
        supportSystem: 'strong'
      }
    };

    return apiResponse.success(res, {
      data: mockPatientData,
      message: 'Patient data retrieved successfully from EMR',
      source: 'EMR_MOCK',
      retrievedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('EMR patient data fetch error:', error);
    return apiResponse.error(res, 'Failed to retrieve patient data from EMR', 500, {
      patientId,
      error: error.message
    });
  }
};

export default withErrorHandling(handler);
