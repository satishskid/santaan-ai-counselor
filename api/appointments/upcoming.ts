import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Mock upcoming appointments data
    const upcomingAppointments = [
      {
        id: '1',
        patientName: 'Sample Patient',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        time: '10:00 AM',
        type: 'Consultation',
        status: 'scheduled'
      },
      {
        id: '2', 
        patientName: 'Another Patient',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        time: '2:00 PM',
        type: 'Follow-up',
        status: 'confirmed'
      }
    ]

    return res.status(200).json({
      success: true,
      data: upcomingAppointments,
      count: upcomingAppointments.length
    })
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming appointments',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
