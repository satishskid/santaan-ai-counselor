import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Basic API info
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'CounselorTempo API',
      version: '1.0.0',
      endpoints: [
        'GET /api/health - Health check',
        'POST /api/auth/login - User login',
        'GET /api/auth/me - Current user',
        'GET /api/admin/testing-suite - System tests'
      ]
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
