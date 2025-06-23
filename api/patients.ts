import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Mock patients data
      const mockPatients = [
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          counselorId: 'counselor-1'
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Smith',
          email: 'michael.smith@email.com',
          status: 'NEW',
          createdAt: new Date().toISOString(),
          counselorId: 'counselor-1'
        }
      ];

      return res.status(200).json({
        success: true,
        data: {
          patients: mockPatients,
          pagination: {
            page: 1,
            limit: 10,
            total: mockPatients.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        }
      });
    }

    if (req.method === 'POST') {
      // Mock patient creation
      const newPatient = {
        id: Date.now().toString(),
        ...req.body,
        status: 'NEW',
        createdAt: new Date().toISOString(),
        counselorId: 'counselor-1'
      };

      return res.status(201).json({
        success: true,
        data: {
          patient: newPatient,
          message: 'Patient created successfully',
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Patients API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
