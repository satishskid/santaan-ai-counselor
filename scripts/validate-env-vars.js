#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates all required environment variables for CounselorTempo deployment
 */

import { validateDatabaseUrl } from './validate-database-url.js';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Required environment variables with validation rules
const requiredEnvVars = {
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL database connection string',
    validator: (value) => {
      const result = validateDatabaseUrl(value);
      return {
        isValid: result.isValid,
        message: result.errors.join(', ') || 'Valid PostgreSQL URL'
      };
    },
    example: 'postgresql://user:pass@host:5432/db?schema=public'
  },
  
  SHADOW_DATABASE_URL: {
    required: true,
    description: 'Shadow database for Prisma migrations',
    validator: (value) => {
      const result = validateDatabaseUrl(value);
      return {
        isValid: result.isValid,
        message: result.errors.join(', ') || 'Valid PostgreSQL URL'
      };
    },
    example: 'postgresql://user:pass@host:5432/shadow_db?schema=public'
  },
  
  JWT_SECRET: {
    required: true,
    description: 'Secret key for JWT token signing (minimum 32 characters)',
    validator: (value) => {
      if (!value) return { isValid: false, message: 'JWT_SECRET is required' };
      if (value.length < 32) return { isValid: false, message: 'JWT_SECRET must be at least 32 characters long' };
      if (value === 'your-secret-key' || value === 'change-me') {
        return { isValid: false, message: 'JWT_SECRET should not use default/example values' };
      }
      return { isValid: true, message: `Valid JWT secret (${value.length} characters)` };
    },
    example: 'counselortempo-super-secret-jwt-key-for-production-2024-change-this'
  },
  
  NODE_ENV: {
    required: true,
    description: 'Node.js environment',
    validator: (value) => {
      const validEnvs = ['development', 'production', 'test'];
      if (!validEnvs.includes(value)) {
        return { isValid: false, message: `NODE_ENV must be one of: ${validEnvs.join(', ')}` };
      }
      return { isValid: true, message: `Valid environment: ${value}` };
    },
    example: 'production'
  },
  
  JWT_EXPIRES_IN: {
    required: false,
    description: 'JWT access token expiration time',
    validator: (value) => {
      if (!value) return { isValid: true, message: 'Will use default: 7d' };
      const timePattern = /^(\d+[smhdw]|\d+)$/;
      if (!timePattern.test(value)) {
        return { isValid: false, message: 'Invalid time format. Use: 1h, 7d, 30m, etc.' };
      }
      return { isValid: true, message: `Valid expiration time: ${value}` };
    },
    example: '7d',
    default: '7d'
  },
  
  REFRESH_TOKEN_EXPIRES_IN: {
    required: false,
    description: 'JWT refresh token expiration time',
    validator: (value) => {
      if (!value) return { isValid: true, message: 'Will use default: 30d' };
      const timePattern = /^(\d+[smhdw]|\d+)$/;
      if (!timePattern.test(value)) {
        return { isValid: false, message: 'Invalid time format. Use: 1h, 7d, 30m, etc.' };
      }
      return { isValid: true, message: `Valid expiration time: ${value}` };
    },
    example: '30d',
    default: '30d'
  },
  
  FRONTEND_URL: {
    required: false,
    description: 'Frontend application URL for CORS',
    validator: (value) => {
      if (!value) return { isValid: true, message: 'Optional - will be set after deployment' };
      try {
        new URL(value);
        return { isValid: true, message: `Valid URL: ${value}` };
      } catch {
        return { isValid: false, message: 'Invalid URL format' };
      }
    },
    example: 'https://your-app.vercel.app'
  },
  
  BCRYPT_ROUNDS: {
    required: false,
    description: 'Number of rounds for bcrypt password hashing',
    validator: (value) => {
      if (!value) return { isValid: true, message: 'Will use default: 12' };
      const rounds = parseInt(value);
      if (isNaN(rounds) || rounds < 10 || rounds > 15) {
        return { isValid: false, message: 'BCRYPT_ROUNDS must be a number between 10 and 15' };
      }
      return { isValid: true, message: `Valid bcrypt rounds: ${rounds}` };
    },
    example: '12',
    default: '12'
  },
  
  RATE_LIMIT_WINDOW_MS: {
    required: false,
    description: 'Rate limiting window in milliseconds',
    validator: (value) => {
      if (!value) return { isValid: true, message: 'Will use default: 900000 (15 minutes)' };
      const ms = parseInt(value);
      if (isNaN(ms) || ms < 60000) {
        return { isValid: false, message: 'RATE_LIMIT_WINDOW_MS must be at least 60000 (1 minute)' };
      }
      return { isValid: true, message: `Valid rate limit window: ${ms}ms (${ms/60000} minutes)` };
    },
    example: '900000',
    default: '900000'
  },
  
  RATE_LIMIT_MAX_REQUESTS: {
    required: false,
    description: 'Maximum requests per rate limiting window',
    validator: (value) => {
      if (!value) return { isValid: true, message: 'Will use default: 100' };
      const max = parseInt(value);
      if (isNaN(max) || max < 10) {
        return { isValid: false, message: 'RATE_LIMIT_MAX_REQUESTS must be at least 10' };
      }
      return { isValid: true, message: `Valid max requests: ${max}` };
    },
    example: '100',
    default: '100'
  }
};

function validateEnvironmentVariables(envVars = process.env) {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    info: [],
    missing: [],
    invalid: []
  };
  
  log('cyan', '🔍 Environment Variables Validation');
  log('blue', '=====================================\n');
  
  // Check each required environment variable
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = envVars[varName];
    
    if (config.required && !value) {
      results.missing.push(varName);
      results.errors.push(`Missing required variable: ${varName}`);
      log('red', `❌ ${varName}: MISSING (required)`);
      log('yellow', `   Description: ${config.description}`);
      log('blue', `   Example: ${config.example}`);
    } else if (value) {
      const validation = config.validator(value);
      if (validation.isValid) {
        results.info.push(`${varName}: ${validation.message}`);
        log('green', `✅ ${varName}: ${validation.message}`);
      } else {
        results.invalid.push(varName);
        results.errors.push(`Invalid ${varName}: ${validation.message}`);
        log('red', `❌ ${varName}: ${validation.message}`);
        log('blue', `   Example: ${config.example}`);
      }
    } else if (config.default) {
      results.warnings.push(`${varName} not set, will use default: ${config.default}`);
      log('yellow', `⚠️  ${varName}: Not set, will use default: ${config.default}`);
    } else {
      log('blue', `ℹ️  ${varName}: Not set (optional)`);
    }
    
    console.log();
  }
  
  // Overall validation result
  if (results.errors.length > 0) {
    results.isValid = false;
  }
  
  return results;
}

function generateEnvTemplate() {
  log('cyan', '📝 Environment Variables Template');
  log('blue', '=================================\n');
  
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    log('blue', `# ${config.description}`);
    if (config.required) {
      log('yellow', `${varName}="${config.example}"`);
    } else {
      log('blue', `# ${varName}="${config.example}" # Optional, default: ${config.default || 'none'}`);
    }
    console.log();
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--template')) {
    generateEnvTemplate();
    return;
  }
  
  const results = validateEnvironmentVariables();
  
  // Summary
  log('cyan', '\n📊 Validation Summary');
  log('blue', '=====================');
  
  if (results.isValid) {
    log('green', '✅ All environment variables are valid!');
  } else {
    log('red', `❌ Found ${results.errors.length} error(s)`);
    
    if (results.missing.length > 0) {
      log('red', `Missing required variables: ${results.missing.join(', ')}`);
    }
    
    if (results.invalid.length > 0) {
      log('red', `Invalid variables: ${results.invalid.join(', ')}`);
    }
  }
  
  if (results.warnings.length > 0) {
    log('yellow', `⚠️  ${results.warnings.length} warning(s)`);
  }
  
  log('blue', `ℹ️  ${results.info.length} variable(s) validated successfully`);
  
  if (!results.isValid) {
    log('yellow', '\n💡 To generate a template with all required variables:');
    log('blue', 'node scripts/validate-env-vars.js --template');
  }
  
  process.exit(results.isValid ? 0 : 1);
}

// Export for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateEnvironmentVariables, requiredEnvVars };
