import { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyToken } from './_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
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
      return await handleCounselorById(req, res, id)
    } else {
      return await handleCounselors(req, res)
    }
  } catch (error) {
    console.error('Counselors API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleCounselors(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return await getCounselors(req, res)
    case 'POST':
      // For demo purposes, allow POST without authentication
      return await createCounselor(req, res)
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
}

async function handleCounselorById(req: VercelRequest, res: VercelResponse, id: string) {
  switch (req.method) {
    case 'GET':
      return await getCounselor(req, res, id)
    case 'PUT':
      return await updateCounselor(req, res, id)
    case 'DELETE':
      return await deleteCounselor(req, res, id)
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
}

async function getCounselors(req: VercelRequest, res: VercelResponse) {
  try {
    // Return mock counselors data
    const mockCounselors = [
      {
        id: 'counselor-1',
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@santanacounseling.com',
        phone: '+1-555-0200',
        title: 'Senior Fertility Counselor',
        specialization: 'IVF & Reproductive Psychology',
        experience: '8 years',
        status: 'ACTIVE',
        availability: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        bio: 'Specialized in helping couples navigate the emotional journey of fertility treatments.',
        credentials: ['Licensed Clinical Social Worker', 'Certified Fertility Counselor'],
        languages: ['English', 'Spanish'],
        patientCount: 45
      },
      {
        id: 'counselor-2',
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        email: 'michael.chen@santanacounseling.com',
        phone: '+1-555-0201',
        title: 'Fertility Counselor',
        specialization: 'Male Fertility & Couples Therapy',
        experience: '5 years',
        status: 'ACTIVE',
        availability: 'BUSY',
        createdAt: new Date().toISOString(),
        bio: 'Expert in addressing male fertility concerns and relationship dynamics during treatment.',
        credentials: ['Licensed Marriage & Family Therapist', 'Fertility Counseling Certificate'],
        languages: ['English', 'Mandarin'],
        patientCount: 32
      },
      {
        id: 'counselor-3',
        firstName: 'Dr. Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@santanacounseling.com',
        phone: '+1-555-0202',
        title: 'Lead Fertility Counselor',
        specialization: 'PCOS & Endometriosis Support',
        experience: '12 years',
        status: 'ACTIVE',
        availability: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        bio: 'Leading expert in supporting women with PCOS and endometriosis through their fertility journey.',
        credentials: ['PhD in Clinical Psychology', 'Board Certified Fertility Counselor'],
        languages: ['English', 'French'],
        patientCount: 67
      }
    ]

    return res.status(200).json({
      success: true,
      data: mockCounselors
    })
  } catch (error) {
    console.error('Get counselors error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch counselors',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function getCounselor(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    // Return mock counselor data based on ID
    const mockCounselor = {
      id,
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@santanacounseling.com',
      phone: '+1-555-0200',
      title: 'Senior Fertility Counselor',
      specialization: 'IVF & Reproductive Psychology',
      experience: '8 years',
      status: 'ACTIVE',
      availability: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      bio: 'Specialized in helping couples navigate the emotional journey of fertility treatments.',
      credentials: ['Licensed Clinical Social Worker', 'Certified Fertility Counselor'],
      languages: ['English', 'Spanish'],
      patientCount: 45,
      schedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '15:00' }
      }
    }

    return res.status(200).json({
      success: true,
      data: mockCounselor
    })
  } catch (error) {
    console.error('Get counselor error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch counselor',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function createCounselor(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      title,
      specialization,
      experience,
      bio,
      credentials,
      languages
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'firstName, lastName, and email are required'
      })
    }

    // Return mock created counselor
    const newCounselor = {
      id: `counselor-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone: phone || null,
      title: title || 'Fertility Counselor',
      specialization: specialization || null,
      experience: experience || null,
      bio: bio || null,
      credentials: credentials || [],
      languages: languages || ['English'],
      status: 'ACTIVE',
      availability: 'AVAILABLE',
      patientCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return res.status(201).json({
      success: true,
      data: newCounselor,
      message: 'Counselor created successfully'
    })
  } catch (error) {
    console.error('Create counselor error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create counselor',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function updateCounselor(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const updateData = req.body

    // Return mock updated counselor
    const updatedCounselor = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      data: updatedCounselor,
      message: 'Counselor updated successfully'
    })
  } catch (error) {
    console.error('Update counselor error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update counselor',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function deleteCounselor(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    return res.status(200).json({
      success: true,
      message: 'Counselor deleted successfully'
    })
  } catch (error) {
    console.error('Delete counselor error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete counselor',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
