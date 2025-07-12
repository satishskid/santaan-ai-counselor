import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

// CORS configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};

// CORS middleware
export const cors = (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
};

// JWT token verification
export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }
    return jwt.verify(token, secret) as any;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication middleware
export const authenticate = (req: AuthenticatedRequest, res: VercelResponse) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return false;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    req.user = decoded;
    return true;
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return false;
  }
};

// Role-based authorization
export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: VercelResponse) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return false;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return false;
    }

    return true;
  };
};

// Rate limiting configuration
export const createRateLimit = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Input validation middleware
export const validateInput = <T>(schema: z.ZodSchema<T>) => {
  return (req: VercelRequest, res: VercelResponse): T | null => {
    try {
      const validatedData = schema.parse(req.body);
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        res.status(400).json({ error: 'Invalid input data' });
      }
      return null;
    }
  };
};

// Error handling wrapper
export const withErrorHandling = (handler: Function) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        res.status(409).json({ error: 'Resource already exists' });
      } else if (error.code === 'P2025') {
        // Prisma record not found
        res.status(404).json({ error: 'Resource not found' });
      } else if (error.message?.includes('Invalid token')) {
        res.status(401).json({ error: 'Authentication failed' });
      } else {
        res.status(500).json({ 
          error: 'Internal server error',
          ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
      }
    }
  };
};

// Method validation
export const allowMethods = (methods: string[]) => {
  return (req: VercelRequest, res: VercelResponse) => {
    if (!methods.includes(req.method || '')) {
      res.setHeader('Allow', methods.join(', '));
      res.status(405).json({ error: `Method ${req.method} not allowed` });
      return false;
    }
    return true;
  };
};

// Request logging middleware
export const logRequest = (req: VercelRequest, res: VercelResponse) => {
  const start = Date.now();
  const { method, url } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${method} ${url} - ${res.statusCode} (${duration}ms)`);
  });
};

// Sanitize input data
export const sanitizeInput = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
};

// API response helper
export const apiResponse = {
  success: (res: VercelResponse, data: any, status: number = 200) => {
    res.status(status).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  },
  
  error: (res: VercelResponse, message: string, status: number = 400, details?: any) => {
    res.status(status).json({
      success: false,
      error: message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    });
  },
};
