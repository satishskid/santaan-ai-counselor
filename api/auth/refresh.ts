import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse } from '../_lib/middleware';
import { refreshAccessToken } from '../_lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token not provided', 401);
    }

    // Refresh access token
    const authResult = await refreshAccessToken(refreshToken);

    // Set new refresh token cookie
    res.setHeader('Set-Cookie', [
      `refreshToken=${authResult.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`, // 30 days
    ]);

    // Return user data and new access token
    return apiResponse.success(res, {
      user: authResult.user,
      accessToken: authResult.accessToken,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return apiResponse.error(res, 'Invalid or expired refresh token', 401);
  }
};

export default withErrorHandling(handler);
