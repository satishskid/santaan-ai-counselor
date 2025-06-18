import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SHADOW_DATABASE_URL: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().optional(),
  API_PORT: z.string().transform(val => parseInt(val) || 3001),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(val => parseInt(val) || 12),
  RATE_LIMIT_WINDOW_MS: z.string().transform(val => parseInt(val) || 900000),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(val => parseInt(val) || 100),
  
  // Optional configurations
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(val => parseInt(val) || 587).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  
  MAX_FILE_SIZE: z.string().transform(val => parseInt(val) || 5242880).optional(),
  ALLOWED_FILE_TYPES: z.string().optional(),
  UPLOAD_PATH: z.string().default('./uploads').optional(),
  
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info').optional(),
  
  OPENAI_API_KEY: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
});

// Validate environment variables
export const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      
      console.error('❌ Environment validation failed:');
      console.error(errorMessages);
      process.exit(1);
    }
    throw error;
  }
};

// Get validated environment variables
export const env = validateEnv();

// Environment helpers
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Database configuration
export const getDatabaseConfig = () => ({
  url: env.DATABASE_URL,
  shadowDatabaseUrl: env.SHADOW_DATABASE_URL,
});

// JWT configuration
export const getJWTConfig = () => ({
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
  refreshExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
});

// Security configuration
export const getSecurityConfig = () => ({
  bcryptRounds: env.BCRYPT_ROUNDS,
  rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
});

// CORS configuration
export const getCORSConfig = () => ({
  origin: env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Email configuration
export const getEmailConfig = () => ({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  pass: env.SMTP_PASS,
  from: env.FROM_EMAIL,
});

// File upload configuration
export const getUploadConfig = () => ({
  maxFileSize: env.MAX_FILE_SIZE,
  allowedTypes: env.ALLOWED_FILE_TYPES?.split(',') || [],
  uploadPath: env.UPLOAD_PATH,
});

// Logging configuration
export const getLogConfig = () => ({
  level: env.LOG_LEVEL,
  sentryDsn: env.SENTRY_DSN,
});

// External API configuration
export const getExternalAPIConfig = () => ({
  openai: env.OPENAI_API_KEY,
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
  },
});

// Validate required environment variables for production
export const validateProductionEnv = () => {
  if (!isProduction) return;

  const requiredForProduction = [
    'DATABASE_URL',
    'JWT_SECRET',
    'FRONTEND_URL',
  ];

  const missing = requiredForProduction.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables for production:');
    console.error(missing.join(', '));
    process.exit(1);
  }

  // Validate JWT secret strength in production
  if (env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters in production');
    process.exit(1);
  }

  console.log('✅ Production environment validation passed');
};

// Initialize environment validation
validateProductionEnv();
