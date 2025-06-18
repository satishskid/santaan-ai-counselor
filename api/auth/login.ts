import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, validateInput, sanitizeInput } from '../_lib/middleware';
import { authenticateUser } from '../_lib/auth';
import { loginSchema } from '../_lib/validation';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  // Validate input
  const validatedData = validateInput(loginSchema)(req, res);
  if (!validatedData) return;

  // Sanitize input
  const { email, password } = sanitizeInput(validatedData);

  try {
    // Authenticate user
    const authResult = await authenticateUser(email, password);

    // Set secure HTTP-only cookie for refresh token
    res.setHeader('Set-Cookie', [
      `refreshToken=${authResult.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`, // 30 days
    ]);

    // Return user data and access token
    return apiResponse.success(res, {
      user: authResult.user,
      accessToken: authResult.accessToken,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return apiResponse.error(res, 'Invalid credentials', 401);
  }
};

export default withErrorHandling(handler);
