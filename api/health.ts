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

  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    // System information
    const systemInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      database: dbHealth,
    };

    // Determine overall health status
    const isHealthy = dbHealth.status === 'healthy';
    const statusCode = isHealthy ? 200 : 503;

    return apiResponse.success(res, systemInfo, statusCode);
  } catch (error) {
    console.error('Health check failed:', error);
    return apiResponse.error(res, 'Health check failed', 503, {
      database: { status: 'unhealthy', message: 'Database connection failed' }
    });
  }
};

export default withErrorHandling(handler);
