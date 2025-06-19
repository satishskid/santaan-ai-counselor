import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse } from './_lib/middleware';
import { checkDatabaseHealth } from './_lib/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  const startTime = Date.now();
  const healthCheck = {
    timestamp: new Date().toISOString(),
    overall_status: 'healthy',
    response_time: 0,
    components: {
      database: { status: 'unknown', message: '', response_time: 0 },
      environment: { status: 'unknown', variables: {}, missing: [] },
      api_endpoints: {},
      system: { status: 'unknown', memory: {}, uptime: 0 }
    },
    errors: [],
    warnings: []
  };

  try {
    // 1. Database Health Check
    const dbStart = Date.now();
    try {
      const dbHealth = await checkDatabaseHealth();
      healthCheck.components.database = {
        status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        message: dbHealth.message || 'Database connection tested',
        response_time: Date.now() - dbStart,
        details: dbHealth
      };
    } catch (dbError) {
      healthCheck.components.database = {
        status: 'unhealthy',
        message: dbError instanceof Error ? dbError.message : 'Database connection failed',
        response_time: Date.now() - dbStart
      };
      healthCheck.errors.push('Database connection failed');
    }

    // 2. Environment Variables Check
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    const optionalEnvVars = ['NODE_ENV', 'FRONTEND_URL', 'SHADOW_DATABASE_URL'];
    const envStatus = {
      status: 'healthy',
      variables: {},
      missing: [],
      warnings: []
    };

    // Check required variables
    requiredEnvVars.forEach(varName => {
      const value = process.env[varName];
      envStatus.variables[varName] = {
        present: !!value,
        length: value ? value.length : 0,
        masked: value ? `${value.substring(0, 10)}...` : 'NOT_SET'
      };
      
      if (!value) {
        envStatus.missing.push(varName);
        envStatus.status = 'unhealthy';
        healthCheck.errors.push(`Missing required environment variable: ${varName}`);
      }
    });

    // Check optional variables
    optionalEnvVars.forEach(varName => {
      const value = process.env[varName];
      envStatus.variables[varName] = {
        present: !!value,
        value: value || 'NOT_SET',
        optional: true
      };
      
      if (!value) {
        envStatus.warnings.push(`Optional environment variable not set: ${varName}`);
        healthCheck.warnings.push(`Optional environment variable not set: ${varName}`);
      }
    });

    healthCheck.components.environment = envStatus;

    // 3. API Endpoints Status
    const endpoints = [
      { name: 'health', path: '/api/health', method: 'GET' },
      { name: 'system_health', path: '/api/system-health', method: 'GET' },
      { name: 'auth_login', path: '/api/auth/login', method: 'POST' },
      { name: 'auth_register', path: '/api/auth/register', method: 'POST' },
      { name: 'auth_me', path: '/api/auth/me', method: 'GET' },
      { name: 'patients', path: '/api/patients', method: 'GET' },
      { name: 'appointments', path: '/api/appointments', method: 'GET' },
      { name: 'assessments', path: '/api/assessments', method: 'GET' },
      { name: 'treatment_plans', path: '/api/treatment-plans', method: 'GET' },
      { name: 'settings', path: '/api/settings', method: 'GET' }
    ];

    const apiEndpoints = {};
    endpoints.forEach(endpoint => {
      apiEndpoints[endpoint.name] = {
        path: endpoint.path,
        method: endpoint.method,
        status: 'available', // We assume they're available since we can't test them here
        description: `${endpoint.method} ${endpoint.path}`
      };
    });

    healthCheck.components.api_endpoints = apiEndpoints;

    // 4. System Information
    const memoryUsage = process.memoryUsage();
    healthCheck.components.system = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: {
        used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        usage_percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        rss_mb: Math.round(memoryUsage.rss / 1024 / 1024)
      },
      node_version: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development'
    };

    // Memory warning
    const memoryUsagePercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
    if (memoryUsagePercent > 80) {
      healthCheck.warnings.push(`High memory usage: ${memoryUsagePercent}%`);
    }

    // 5. Overall Status Determination
    const hasErrors = healthCheck.errors.length > 0;
    const databaseUnhealthy = healthCheck.components.database.status === 'unhealthy';
    const envUnhealthy = healthCheck.components.environment.status === 'unhealthy';

    if (hasErrors || databaseUnhealthy || envUnhealthy) {
      healthCheck.overall_status = 'unhealthy';
    } else if (healthCheck.warnings.length > 0) {
      healthCheck.overall_status = 'warning';
    } else {
      healthCheck.overall_status = 'healthy';
    }

    // Final response time
    healthCheck.response_time = Date.now() - startTime;

    // Return appropriate status code
    const statusCode = healthCheck.overall_status === 'healthy' ? 200 : 
                      healthCheck.overall_status === 'warning' ? 200 : 503;

    return apiResponse.success(res, healthCheck, statusCode);

  } catch (error) {
    console.error('System health check failed:', error);
    
    healthCheck.overall_status = 'unhealthy';
    healthCheck.errors.push(`System health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    healthCheck.response_time = Date.now() - startTime;

    return apiResponse.error(res, 'System health check failed', 503, healthCheck);
  }
};

export default withErrorHandling(handler);
