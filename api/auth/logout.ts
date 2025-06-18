import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse } from '../_lib/middleware';
import { destroySession } from '../_lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Destroy session (placeholder for future implementation)
      await destroySession(refreshToken);
    }

    // Clear refresh token cookie
    res.setHeader('Set-Cookie', [
      'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    ]);

    return apiResponse.success(res, {
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return apiResponse.error(res, 'Logout failed', 500);
  }
};

export default withErrorHandling(handler);
