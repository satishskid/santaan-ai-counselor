import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyToken } from './_lib/auth'

// Note: Removed PrismaClient import to avoid database connection issues in demo

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { id } = req.query

    // Route based on whether ID is provided
    if (id && typeof id === 'string') {
      return await handlePatientById(req, res, id)
    } else {
      return await handlePatients(req, res)
    }
  } catch (error) {
    console.error('Patients API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handlePatients(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return await getPatients(req, res)
    case 'POST':
      // For demo purposes, allow POST without authentication
      // const authResult = await verifyToken(req)
      // if (!authResult.success) {
      //   return res.status(401).json({
      //     success: false,
      //     error: 'Authentication required',
      //     message: authResult.error
      //   })
      // }
      return await createPatient(req, res)
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
}

async function handlePatientById(req: VercelRequest, res: VercelResponse, id: string) {
  // For demo purposes, allow all methods without authentication
  // if (req.method !== 'GET') {
  //   const authResult = await verifyToken(req)
  //   if (!authResult.success) {
  //     return res.status(401).json({
  //       success: false,
  //       error: 'Authentication required',
  //       message: authResult.error
  //     })
  //   }
  // }

  switch (req.method) {
    case 'GET':
      return await getPatient(req, res, id)
    case 'PUT':
      return await updatePatient(req, res, id)
    case 'DELETE':
      return await deletePatient(req, res, id)
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
}

async function getPatients(req: VercelRequest, res: VercelResponse) {
  try {
    // For now, return mock data since we might not have database access
    // In production, this would query the actual database
    const mockPatients = [
      {
        id: 'demo-patient1-india',
        firstName: 'Kavya',
        lastName: 'Reddy',
        email: 'kavya.reddy@email.com',
        phone: '+91 98765 54321',
        dateOfBirth: '1990-03-15',
        status: 'ACTIVE',
        createdAt: '2024-01-15T00:00:00Z',
        counselorId: 'demo-counselor1-india',
        diagnosis: 'PCOS with irregular ovulation',
        currentTreatment: 'IUI Cycle 4',
        location: 'Mumbai, Maharashtra'
      },
      {
        id: 'demo-patient2-india',
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun.patel@email.com',
        phone: '+91 98765 54322',
        dateOfBirth: '1988-07-22',
        status: 'ACTIVE',
        createdAt: '2024-02-01T00:00:00Z',
        counselorId: 'demo-counselor1-india',
        diagnosis: 'Male factor infertility - Low sperm count',
        currentTreatment: 'ICSI Cycle 3',
        location: 'Ahmedabad, Gujarat'
      },
      {
        id: 'demo-patient3-india',
        firstName: 'Meera',
        lastName: 'Singh',
        email: 'meera.singh@email.com',
        phone: '+91 98765 54323',
        dateOfBirth: '1985-11-08',
        status: 'ACTIVE',
        createdAt: '2024-03-01T00:00:00Z',
        counselorId: 'demo-counselor2-india',
        diagnosis: 'Recurrent pregnancy loss',
        currentTreatment: 'IVF with PGT Cycle 1',
        location: 'Delhi, NCR'
      },
      {
        id: 'demo-patient4-india',
        firstName: 'Rohit',
        lastName: 'Gupta',
        email: 'rohit.gupta@email.com',
        phone: '+91 98765 54324',
        dateOfBirth: '1992-05-12',
        status: 'NEW',
        createdAt: '2024-03-15T00:00:00Z',
        counselorId: 'demo-counselor2-india',
        diagnosis: 'Unexplained infertility',
        currentTreatment: 'Initial consultation',
        location: 'Bangalore, Karnataka'
      },
      {
        id: 'demo-patient5-india',
        firstName: 'Deepika',
        lastName: 'Nair',
        email: 'deepika.nair@email.com',
        phone: '+91 98765 54325',
        dateOfBirth: '1987-09-25',
        status: 'COMPLETED',
        createdAt: '2023-10-01T00:00:00Z',
        counselorId: 'demo-counselor1-india',
        diagnosis: 'Tubal factor infertility',
        currentTreatment: 'Successful IVF - 12 weeks pregnant',
        location: 'Kochi, Kerala'
      }
    ]

    return res.status(200).json({
      success: true,
      data: mockPatients
    })
  } catch (error) {
    console.error('Get patients error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch patients',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function createPatient(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      diagnosis,
      counselorId
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'firstName, lastName, and email are required'
      })
    }

    // For now, return mock created patient
    // In production, this would create in the database
    const newPatient = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      diagnosis: diagnosis || null,
      counselorId: counselorId || null,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return res.status(201).json({
      success: true,
      data: newPatient,
      message: 'Patient created successfully'
    })
  } catch (error) {
    console.error('Create patient error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create patient',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function getPatient(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    // Return mock patient data based on ID
    const mockPatient = {
      id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1985-03-15',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      counselorId: 'counselor-1',
      diagnosis: 'Unexplained Infertility',
      currentTreatment: 'IVF Cycle 2',
      medicalHistory: {
        previousTreatments: 'IUI attempts (3 cycles)',
        medicalConditions: 'None significant',
        medications: 'Prenatal vitamins, Folic acid',
        allergies: 'None known'
      },
      counselor: {
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        title: 'Senior Fertility Counselor'
      }
    }

    return res.status(200).json({
      success: true,
      data: mockPatient
    })
  } catch (error) {
    console.error('Get patient error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch patient',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function updatePatient(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const updateData = req.body

    // Return mock updated patient
    const updatedPatient = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      data: updatedPatient,
      message: 'Patient updated successfully'
    })
  } catch (error) {
    console.error('Update patient error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update patient',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function deletePatient(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    return res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    })
  } catch (error) {
    console.error('Delete patient error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete patient',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
