#!/usr/bin/env node

/**
 * Database URL Validation Script
 * Validates DATABASE_URL format and connectivity for Prisma/PostgreSQL
 */

import { URL } from 'url';

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

function validateDatabaseUrl(databaseUrl) {
  const results = {
    isValid: false,
    errors: [],
    warnings: [],
    info: [],
    correctedUrl: null
  };

  if (!databaseUrl) {
    results.errors.push('DATABASE_URL is not provided');
    return results;
  }

  try {
    // Parse the URL
    const url = new URL(databaseUrl);
    
    // Check protocol
    if (!['postgresql:', 'postgres:'].includes(url.protocol)) {
      results.errors.push(`Invalid protocol: ${url.protocol}. Must be 'postgresql:' or 'postgres:'`);
    }
    
    // Check hostname
    if (!url.hostname) {
      results.errors.push('Missing hostname in DATABASE_URL');
    } else {
      results.info.push(`Hostname: ${url.hostname}`);
    }
    
    // Check port
    if (!url.port) {
      results.warnings.push('No port specified, will use default PostgreSQL port (5432)');
    } else {
      results.info.push(`Port: ${url.port}`);
    }
    
    // Check username
    if (!url.username) {
      results.errors.push('Missing username in DATABASE_URL');
    } else {
      results.info.push(`Username: ${url.username}`);
    }
    
    // Check password
    if (!url.password) {
      results.warnings.push('No password specified in DATABASE_URL');
    } else {
      results.info.push('Password: [HIDDEN]');
    }
    
    // Check database name
    const dbName = url.pathname.slice(1); // Remove leading slash
    if (!dbName) {
      results.errors.push('Missing database name in DATABASE_URL');
    } else {
      results.info.push(`Database: ${dbName}`);
    }
    
    // Check query parameters
    const searchParams = url.searchParams;
    
    // Check for schema parameter
    if (!searchParams.has('schema')) {
      results.warnings.push('Missing schema parameter, consider adding ?schema=public');
      // Create corrected URL with schema
      const correctedUrl = new URL(databaseUrl);
      correctedUrl.searchParams.set('schema', 'public');
      results.correctedUrl = correctedUrl.toString();
    } else {
      results.info.push(`Schema: ${searchParams.get('schema')}`);
    }
    
    // Check for SSL mode (important for production)
    if (!searchParams.has('sslmode')) {
      results.warnings.push('No SSL mode specified, consider adding sslmode=require for production');
    } else {
      results.info.push(`SSL Mode: ${searchParams.get('sslmode')}`);
    }
    
    // Supabase-specific checks
    if (url.hostname.includes('supabase')) {
      results.info.push('Detected Supabase database');
      
      // Check for pooler
      if (url.hostname.includes('pooler')) {
        results.info.push('Using Supabase connection pooler');
      }
      
      // Check port for Supabase
      if (url.port === '6543') {
        results.info.push('Using Supabase pooler port (6543)');
      } else if (url.port === '5432') {
        results.info.push('Using direct PostgreSQL port (5432)');
      }
    }
    
    // Vercel Postgres specific checks
    if (url.hostname.includes('vercel-storage')) {
      results.info.push('Detected Vercel Postgres database');
      
      // Check for pgbouncer parameter
      if (searchParams.has('pgbouncer')) {
        results.info.push('Using pgbouncer connection pooling');
      }
      
      // Check for connect_timeout
      if (searchParams.has('connect_timeout')) {
        results.info.push(`Connection timeout: ${searchParams.get('connect_timeout')}s`);
      }
    }
    
    // If no errors, mark as valid
    if (results.errors.length === 0) {
      results.isValid = true;
    }
    
  } catch (error) {
    results.errors.push(`Invalid URL format: ${error.message}`);
  }
  
  return results;
}

function generateCorrectUrls(hostname, username, password, database, port = '5432') {
  const examples = {
    supabase: `postgresql://${username}:${password}@${hostname}:${port}/${database}?schema=public&sslmode=require`,
    vercelPostgres: `postgresql://${username}:${password}@${hostname}:${port}/${database}?schema=public&pgbouncer=true&connect_timeout=15`,
    generic: `postgresql://${username}:${password}@${hostname}:${port}/${database}?schema=public`
  };
  
  return examples;
}

function main() {
  log('cyan', '🔍 Database URL Validation Tool');
  log('blue', '=====================================\n');
  
  // Get DATABASE_URL from environment or command line
  const databaseUrl = process.env.DATABASE_URL || process.argv[2];
  
  if (!databaseUrl) {
    log('red', '❌ No DATABASE_URL provided');
    log('yellow', 'Usage: node validate-database-url.js [DATABASE_URL]');
    log('yellow', 'Or set DATABASE_URL environment variable');
    process.exit(1);
  }
  
  log('blue', 'Validating DATABASE_URL...\n');
  
  const results = validateDatabaseUrl(databaseUrl);
  
  // Display results
  if (results.info.length > 0) {
    log('cyan', '📋 Database Information:');
    results.info.forEach(info => log('blue', `   ℹ️  ${info}`));
    console.log();
  }
  
  if (results.warnings.length > 0) {
    log('yellow', '⚠️  Warnings:');
    results.warnings.forEach(warning => log('yellow', `   ⚠️  ${warning}`));
    console.log();
  }
  
  if (results.errors.length > 0) {
    log('red', '❌ Errors:');
    results.errors.forEach(error => log('red', `   ❌ ${error}`));
    console.log();
  }
  
  if (results.isValid) {
    log('green', '✅ DATABASE_URL is valid!');
  } else {
    log('red', '❌ DATABASE_URL has issues that need to be fixed');
    
    if (results.correctedUrl) {
      log('yellow', '\n💡 Suggested corrected URL:');
      log('green', results.correctedUrl);
    }
    
    log('yellow', '\n💡 Example correct formats:');
    log('blue', 'Supabase:');
    log('green', 'postgresql://postgres:password@db.project.supabase.co:5432/postgres?schema=public&sslmode=require');
    log('blue', 'Vercel Postgres:');
    log('green', 'postgresql://user:pass@host:5432/db?schema=public&pgbouncer=true&connect_timeout=15');
  }
  
  process.exit(results.isValid ? 0 : 1);
}

// Export for testing
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main();
}

export { validateDatabaseUrl, generateCorrectUrls };
