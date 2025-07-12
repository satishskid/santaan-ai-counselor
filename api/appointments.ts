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
      return await handleAppointmentById(req, res, id)
    } else {
      return await handleAppointments(req, res)
    }
  } catch (error) {
    console.error('Appointments API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleAppointments(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return await getAppointments(req, res)
    case 'POST':
      // For demo purposes, allow POST without authentication
      return await createAppointment(req, res)
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
}

async function handleAppointmentById(req: VercelRequest, res: VercelResponse, id: string) {
  switch (req.method) {
    case 'GET':
      return await getAppointment(req, res, id)
    case 'PUT':
      return await updateAppointment(req, res, id)
    case 'DELETE':
      return await deleteAppointment(req, res, id)
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
}

async function getAppointments(req: VercelRequest, res: VercelResponse) {
  try {
    const { patientId, counselorId, upcoming, status } = req.query

    // Return mock appointments data
    const mockAppointments = [
      {
        id: '1',
        patientId: '1',
        counselorId: 'counselor-1',
        title: 'Initial Counseling Session',
        description: 'First counseling session to establish rapport and assess needs',
        type: 'COUNSELING',
        status: 'SCHEDULED',
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        location: 'Room 101',
        isVirtual: false,
        notes: 'Patient prefers in-person sessions',
        createdAt: new Date().toISOString(),
        patient: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com'
        },
        counselor: {
          firstName: 'Dr. Emily',
          lastName: 'Rodriguez',
          title: 'Senior Fertility Counselor'
        }
      },
      {
        id: '2',
        patientId: '2',
        counselorId: 'counselor-1',
        title: 'Virtual Consultation',
        description: 'Follow-up session to discuss treatment progress',
        type: 'FOLLOW_UP',
        status: 'SCHEDULED',
        appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 45,
        location: null,
        isVirtual: true,
        meetingLink: 'https://meet.example.com/abc123',
        notes: 'Virtual session requested by patient',
        createdAt: new Date().toISOString(),
        patient: {
          firstName: 'Michael',
          lastName: 'Smith',
          email: 'michael.smith@email.com'
        },
        counselor: {
          firstName: 'Dr. Emily',
          lastName: 'Rodriguez',
          title: 'Senior Fertility Counselor'
        }
      },
      {
        id: '3',
        patientId: '3',
        counselorId: 'counselor-2',
        title: 'Treatment Planning Session',
        description: 'Discuss IUI treatment plan and emotional preparation',
        type: 'TREATMENT_PLANNING',
        status: 'COMPLETED',
        appointmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 90,
        location: 'Room 203',
        isVirtual: false,
        notes: 'Patient showed good understanding of treatment process',
        createdAt: new Date().toISOString(),
        patient: {
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@email.com'
        },
        counselor: {
          firstName: 'Dr. Michael',
          lastName: 'Chen',
          title: 'Fertility Counselor'
        }
      }
    ]

    let filteredAppointments = mockAppointments

    // Filter by patientId if provided
    if (patientId && typeof patientId === 'string') {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.patientId === patientId
      )
    }

    // Filter by counselorId if provided
    if (counselorId && typeof counselorId === 'string') {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.counselorId === counselorId
      )
    }

    // Filter by upcoming appointments if requested
    if (upcoming === 'true') {
      const now = new Date()
      filteredAppointments = filteredAppointments.filter(
        appointment => new Date(appointment.appointmentDate) > now && appointment.status === 'SCHEDULED'
      )
    }

    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.status === status.toUpperCase()
      )
    }

    // Sort by appointment date
    filteredAppointments.sort((a, b) => 
      new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    )

    return res.status(200).json({
      success: true,
      data: filteredAppointments
    })
  } catch (error) {
    console.error('Get appointments error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function getAppointment(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    // Return mock appointment data based on ID
    const mockAppointment = {
      id,
      patientId: '1',
      counselorId: 'counselor-1',
      title: 'Initial Counseling Session',
      description: 'First counseling session to establish rapport and assess needs',
      type: 'COUNSELING',
      status: 'SCHEDULED',
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 60,
      location: 'Room 101',
      isVirtual: false,
      notes: 'Patient prefers in-person sessions',
      createdAt: new Date().toISOString(),
      patient: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0123'
      },
      counselor: {
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        title: 'Senior Fertility Counselor',
        email: 'emily.rodriguez@santanacounseling.com'
      }
    }

    return res.status(200).json({
      success: true,
      data: mockAppointment
    })
  } catch (error) {
    console.error('Get appointment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function createAppointment(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      patientId,
      counselorId,
      title,
      description,
      appointmentDate,
      durationMinutes,
      type,
      location,
      isVirtual,
      notes
    } = req.body

    // Validate required fields
    if (!patientId || !title || !appointmentDate || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'patientId, title, appointmentDate, and type are required'
      })
    }

    // Return mock created appointment
    const newAppointment = {
      id: Date.now().toString(),
      patientId,
      counselorId: counselorId || null,
      title,
      description: description || null,
      type,
      status: 'SCHEDULED',
      appointmentDate,
      durationMinutes: durationMinutes || 60,
      location: location || null,
      isVirtual: isVirtual || false,
      notes: notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return res.status(201).json({
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    })
  } catch (error) {
    console.error('Create appointment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create appointment',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function updateAppointment(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const updateData = req.body

    // Return mock updated appointment
    const updatedAppointment = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully'
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update appointment',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function deleteAppointment(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    })
  } catch (error) {
    console.error('Delete appointment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete appointment',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
