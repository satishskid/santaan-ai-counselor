import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, validateInput, sanitizeInput } from '../_lib/middleware';
import { registerUser } from '../_lib/auth';
import { registerSchema } from '../_lib/validation';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  // Validate input
  const validatedData = validateInput(registerSchema)(req, res);
  if (!validatedData) return;

  // Sanitize input
  const userData = sanitizeInput(validatedData);

  try {
    // Register user
    const authResult = await registerUser(userData);

    // Set secure HTTP-only cookie for refresh token
    res.setHeader('Set-Cookie', [
      `refreshToken=${authResult.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`, // 30 days
    ]);

    // Return user data and access token
    return apiResponse.success(res, {
      user: authResult.user,
      accessToken: authResult.accessToken,
      message: 'Registration successful',
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message.includes('already exists')) {
      return apiResponse.error(res, 'User already exists with this email', 409);
    }
    return apiResponse.error(res, 'Registration failed', 400);
  }
};

export default withErrorHandling(handler);
