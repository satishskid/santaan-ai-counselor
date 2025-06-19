import type { VercelRequest, VercelResponse } from 'next'
import { authenticateRequest } from '../_lib/middleware'
import { validateRequest } from '../_lib/validation'
import { z } from 'zod'

// Settings schema
const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
  }).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  privacy: z.object({
    shareData: z.boolean().optional(),
    analytics: z.boolean().optional(),
  }).optional(),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(req)
    if (!authResult.success) {
      return res.status(401).json({ error: authResult.error })
    }

    const { user } = authResult

    if (req.method === 'GET') {
      // Get user settings
      try {
        // For now, return default settings since we don't have a settings table
        const defaultSettings = {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          language: 'en',
          timezone: 'UTC',
          privacy: {
            shareData: false,
            analytics: true,
          },
          profile: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          }
        }

        res.status(200).json({
          success: true,
          data: defaultSettings,
          message: 'Settings retrieved successfully'
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
        res.status(500).json({
          success: false,
          error: 'Failed to fetch settings'
        })
      }
    } else if (req.method === 'PUT') {
      // Update user settings
      const validation = validateRequest(settingsSchema, req.body)
      if (!validation.success) {
        return res.status(400).json({ error: validation.error })
      }

      try {
        // For now, just return success since we don't have a settings table
        // In a real implementation, you would save to database
        
        res.status(200).json({
          success: true,
          data: validation.data,
          message: 'Settings updated successfully'
        })
      } catch (error) {
        console.error('Error updating settings:', error)
        res.status(500).json({
          success: false,
          error: 'Failed to update settings'
        })
      }
    } else {
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('Settings API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
