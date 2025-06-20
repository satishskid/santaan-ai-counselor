import type { VercelRequest, VercelResponse } from 'next'

// Self-contained diagnostic system that doesn't rely on other modules
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const startTime = Date.now()
  const diagnostics = {
    timestamp: new Date().toISOString(),
    overall_status: 'unknown',
    response_time: 0,
    self_test: {
      api_reachable: true,
      cors_enabled: true,
      method_handling: req.method === 'GET' ? 'working' : 'untested'
    },
    environment: {
      node_env: process.env.NODE_ENV || 'undefined',
      vercel_env: process.env.VERCEL_ENV || 'undefined',
      database_url_present: !!process.env.DATABASE_URL,
      jwt_secret_present: !!process.env.JWT_SECRET,
      all_env_vars: Object.keys(process.env).filter(key => 
        key.includes('DATABASE') || 
        key.includes('JWT') || 
        key.includes('VERCEL') ||
        key.includes('NODE')
      )
    },
    system_info: {
      node_version: process.version,
      platform: process.platform,
      uptime_seconds: process.uptime(),
      memory_usage: {
        used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total_mb: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
      }
    },
    api_endpoints_test: {},
    database_test: { status: 'not_tested', message: 'Will test if possible' },
    file_system_test: { status: 'testing', files_found: [] },
    errors: [],
    warnings: [],
    debug_info: {
      request_headers: req.headers,
      request_method: req.method,
      request_url: req.url,
      vercel_region: process.env.VERCEL_REGION || 'unknown'
    }
  }

  try {
    // Test 1: File System Access
    try {
      const fs = require('fs')
      const path = require('path')
      
      // Check if we can access the API directory
      const apiPath = path.join(process.cwd(), 'api')
      if (fs.existsSync(apiPath)) {
        const apiFiles = fs.readdirSync(apiPath, { recursive: true })
        diagnostics.file_system_test = {
          status: 'working',
          api_directory_exists: true,
          files_found: apiFiles.slice(0, 10), // First 10 files
          total_files: apiFiles.length
        }
      } else {
        diagnostics.file_system_test = {
          status: 'warning',
          api_directory_exists: false,
          message: 'API directory not found at expected location'
        }
        diagnostics.warnings.push('API directory not accessible')
      }
    } catch (fsError) {
      diagnostics.file_system_test = {
        status: 'error',
        message: fsError instanceof Error ? fsError.message : 'File system access failed'
      }
      diagnostics.errors.push('File system access failed')
    }

    // Test 2: Database Connection (if possible)
    try {
      if (process.env.DATABASE_URL) {
        // Try to import and test Prisma
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()
        
        const dbStart = Date.now()
        await prisma.$queryRaw`SELECT 1 as test`
        await prisma.$disconnect()
        
        diagnostics.database_test = {
          status: 'connected',
          response_time: Date.now() - dbStart,
          message: 'Database connection successful'
        }
      } else {
        diagnostics.database_test = {
          status: 'no_url',
          message: 'DATABASE_URL environment variable not set'
        }
        diagnostics.warnings.push('DATABASE_URL not configured')
      }
    } catch (dbError) {
      diagnostics.database_test = {
        status: 'error',
        message: dbError instanceof Error ? dbError.message : 'Database connection failed',
        error_type: dbError instanceof Error ? dbError.constructor.name : 'Unknown'
      }
      diagnostics.errors.push(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown'}`)
    }

    // Test 3: API Endpoints Discovery
    const expectedEndpoints = [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register', 
      '/api/auth/me',
      '/api/patients',
      '/api/appointments',
      '/api/assessments',
      '/api/treatment-plans',
      '/api/settings',
      '/api/admin/system-diagnostics'
    ]

    expectedEndpoints.forEach(endpoint => {
      const endpointName = endpoint.replace('/api/', '').replace('/', '_')
      diagnostics.api_endpoints_test[endpointName] = {
        path: endpoint,
        expected: true,
        status: 'unknown', // We can't test them from here, but we list them
        note: 'Endpoint mapping - actual testing requires separate requests'
      }
    })

    // Test 4: Environment Variables Validation
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET']
    const missingRequired = requiredVars.filter(varName => !process.env[varName])
    
    if (missingRequired.length > 0) {
      diagnostics.errors.push(`Missing required environment variables: ${missingRequired.join(', ')}`)
    }

    // Test 5: Memory and Performance Check
    const memoryPercent = diagnostics.system_info.memory_usage.percentage
    if (memoryPercent > 90) {
      diagnostics.errors.push(`Critical memory usage: ${memoryPercent}%`)
    } else if (memoryPercent > 75) {
      diagnostics.warnings.push(`High memory usage: ${memoryPercent}%`)
    }

    // Determine Overall Status
    if (diagnostics.errors.length > 0) {
      diagnostics.overall_status = 'critical'
    } else if (diagnostics.warnings.length > 0) {
      diagnostics.overall_status = 'warning'
    } else {
      diagnostics.overall_status = 'healthy'
    }

    diagnostics.response_time = Date.now() - startTime

    // Return with appropriate status code
    const httpStatus = diagnostics.overall_status === 'critical' ? 503 : 200

    res.status(httpStatus).json({
      success: true,
      data: diagnostics,
      meta: {
        endpoint: '/api/admin/system-diagnostics',
        self_diagnostic: true,
        can_debug: true,
        admin_access: true
      }
    })

  } catch (error) {
    // Even if everything fails, we still return diagnostic info
    diagnostics.overall_status = 'critical'
    diagnostics.errors.push(`System diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    diagnostics.response_time = Date.now() - startTime

    res.status(503).json({
      success: false,
      error: 'System diagnostic failed',
      data: diagnostics,
      meta: {
        endpoint: '/api/admin/system-diagnostics',
        self_diagnostic: true,
        critical_failure: true
      }
    })
  }
}
