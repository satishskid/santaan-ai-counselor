import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './database';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

// Token generation
export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { 
      id: user.id, 
      type: 'refresh' 
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Token verification
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      type: string;
      iat: number;
      exp: number;
    };
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// User authentication
export const authenticateUser = async (email: string, password: string) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // For now, we'll use a simple password check since we don't have password field in schema
  // In production, you should add password field to User model and hash passwords
  const isValidPassword = password === 'password123'; // Temporary for demo
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
};

// User registration
export const registerUser = async (userData: {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}) => {
  const { email, password, fullName, role = 'PATIENT' } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password (for future implementation)
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      fullName,
      role,
      // password: hashedPassword, // Add this when you add password field to schema
    },
  });

  // Generate tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
};

// Refresh token
export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  
  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate new tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    ...tokens,
  };
};

// Get user from token
export const getUserFromToken = async (token: string) => {
  const decoded = verifyAccessToken(token);
  
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
};

// Password reset (placeholder for future implementation)
export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Don't reveal if user exists or not
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { id: user.id, type: 'password_reset' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // In production, send email with reset link
  console.log(`Password reset token for ${email}: ${resetToken}`);

  return { message: 'If an account with that email exists, a password reset link has been sent.' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      type: string;
    };

    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid token type');
    }

    const hashedPassword = await hashPassword(newPassword);

    // Update user password (when password field is added to schema)
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        // password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return { message: 'Password reset successfully' };
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
};

// Role-based access control
export const hasPermission = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const isAdmin = (userRole: string): boolean => {
  return userRole === 'ADMIN';
};

export const isCounselor = (userRole: string): boolean => {
  return userRole === 'COUNSELOR' || userRole === 'ADMIN';
};

export const isPatient = (userRole: string): boolean => {
  return userRole === 'PATIENT';
};

// Session management (for future implementation with Redis or database)
export const createSession = async (userId: string, refreshToken: string) => {
  // Store session in database or Redis
  // This is a placeholder for future implementation
  console.log(`Creating session for user ${userId}`);
};

export const destroySession = async (refreshToken: string) => {
  // Remove session from database or Redis
  // This is a placeholder for future implementation
  console.log(`Destroying session with token ${refreshToken}`);
};
