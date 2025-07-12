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
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0123',
        dateOfBirth: '1985-03-15',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        counselorId: 'counselor-1',
        diagnosis: 'Unexplained Infertility',
        currentTreatment: 'IVF Cycle 2'
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Smith',
        email: 'michael.smith@email.com',
        phone: '+1-555-0124',
        dateOfBirth: '1982-07-22',
        status: 'NEW',
        createdAt: new Date().toISOString(),
        counselorId: 'counselor-1',
        diagnosis: 'Male Factor Infertility',
        currentTreatment: 'Initial Consultation'
      },
      {
        id: '3',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0125',
        dateOfBirth: '1988-11-08',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        counselorId: 'counselor-2',
        diagnosis: 'PCOS',
        currentTreatment: 'IUI Cycle 3'
      },
      {
        id: '4',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@email.com',
        phone: '+1-555-0126',
        dateOfBirth: '1980-05-12',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        counselorId: 'counselor-1',
        diagnosis: 'Tubal Factor',
        currentTreatment: 'Successful IVF'
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
