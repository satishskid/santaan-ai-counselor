import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest } from '../_lib/middleware';
import { getUserFromToken } from '../_lib/auth';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  // Authenticate user
  if (!authenticate(req, res)) return;

  try {
    // Get user data from token
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return apiResponse.error(res, 'No token provided', 401);
    }

    const user = await getUserFromToken(token);

    return apiResponse.success(res, {
      user,
      message: 'User data retrieved successfully',
    });
  } catch (error) {
    console.error('Get user error:', error);
    return apiResponse.error(res, 'Failed to get user data', 500);
  }
};

export default withErrorHandling(handler);
