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
      // Check if requesting upcoming appointments
      const isUpcoming = req.url?.includes('upcoming') || req.query.type === 'upcoming';
      
      if (isUpcoming) {
        // Mock upcoming appointments
        const upcomingAppointments = [
          {
            id: '1',
            patientName: 'Sarah Johnson',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            time: '10:00 AM',
            type: 'Consultation',
            status: 'scheduled'
          },
          {
            id: '2', 
            patientName: 'Michael Smith',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            time: '2:00 PM',
            type: 'Follow-up',
            status: 'confirmed'
          }
        ];

        return res.status(200).json({
          success: true,
          data: upcomingAppointments,
          count: upcomingAppointments.length
        });
      }

      // Regular appointments list
      const appointments = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Sarah Johnson',
          date: new Date().toISOString(),
          time: '10:00 AM',
          type: 'Consultation',
          status: 'completed'
        }
      ];

      return res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length
      });
    }

    if (req.method === 'POST') {
      // Mock appointment creation
      const newAppointment = {
        id: Date.now().toString(),
        ...req.body,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      return res.status(201).json({
        success: true,
        data: newAppointment,
        message: 'Appointment created successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Appointments API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
