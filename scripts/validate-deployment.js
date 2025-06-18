#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Validates that all requirements are met before deployment
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  addCheck(name, status, message) {
    this.checks.push({ name, status, message });
    if (status === 'error') {
      this.errors.push(`${name}: ${message}`);
    } else if (status === 'warning') {
      this.warnings.push(`${name}: ${message}`);
    }
  }

  checkFileExists(filePath, description) {
    const exists = fs.existsSync(filePath);
    this.addCheck(
      description,
      exists ? 'success' : 'error',
      exists ? 'Found' : 'Missing required file'
    );
    return exists;
  }

  checkDirectoryStructure() {
    log('blue', '📁 Checking directory structure...');
    
    const requiredDirs = [
      { path: 'api', desc: 'API directory' },
      { path: 'api/_lib', desc: 'API utilities directory' },
      { path: 'api/auth', desc: 'Authentication endpoints' },
      { path: 'api/patients', desc: 'Patients endpoints' },
      { path: 'api/appointments', desc: 'Appointments endpoints' },
      { path: 'api/assessments', desc: 'Assessments endpoints' },
      { path: 'api/treatment-plans', desc: 'Treatment plans endpoints' },
      { path: 'api/dashboard', desc: 'Dashboard endpoints' },
      { path: 'api/emr', desc: 'EMR integration endpoints' },
      { path: 'prisma', desc: 'Prisma directory' }
    ];

    requiredDirs.forEach(({ path: dirPath, desc }) => {
      const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
      this.addCheck(
        desc,
        exists ? 'success' : 'error',
        exists ? 'Directory exists' : 'Directory missing'
      );
    });
  }

  checkRequiredFiles() {
    log('blue', '📄 Checking required files...');
    
    const requiredFiles = [
      { path: 'vercel.json', desc: 'Vercel configuration' },
      { path: 'package.json', desc: 'Package configuration' },
      { path: 'prisma/schema.prisma', desc: 'Prisma schema' },
      { path: '.env.example', desc: 'Environment example' },
      { path: 'API_DOCUMENTATION.md', desc: 'API documentation' },
      { path: 'DEPLOYMENT_CHECKLIST.md', desc: 'Deployment checklist' },
      
      // API files
      { path: 'api/health.ts', desc: 'Health check endpoint' },
      { path: 'api/auth/login.ts', desc: 'Login endpoint' },
      { path: 'api/auth/register.ts', desc: 'Register endpoint' },
      { path: 'api/auth/refresh.ts', desc: 'Token refresh endpoint' },
      { path: 'api/auth/logout.ts', desc: 'Logout endpoint' },
      { path: 'api/auth/me.ts', desc: 'User profile endpoint' },
      { path: 'api/patients/index.ts', desc: 'Patients list endpoint' },
      { path: 'api/patients/[id].ts', desc: 'Patient detail endpoint' },
      { path: 'api/appointments/index.ts', desc: 'Appointments endpoint' },
      { path: 'api/assessments/index.ts', desc: 'Assessments endpoint' },
      { path: 'api/treatment-plans/index.ts', desc: 'Treatment plans endpoint' },
      { path: 'api/dashboard/stats.ts', desc: 'Dashboard stats endpoint' },
      { path: 'api/emr/test-connection.ts', desc: 'EMR test endpoint' },
      { path: 'api/emr/patients/[patientId].ts', desc: 'EMR patient endpoint' },
      
      // Utility files
      { path: 'api/_lib/database.ts', desc: 'Database utilities' },
      { path: 'api/_lib/middleware.ts', desc: 'Middleware utilities' },
      { path: 'api/_lib/auth.ts', desc: 'Authentication utilities' },
      { path: 'api/_lib/validation.ts', desc: 'Validation schemas' },
      { path: 'api/_lib/env.ts', desc: 'Environment validation' }
    ];

    requiredFiles.forEach(({ path: filePath, desc }) => {
      this.checkFileExists(filePath, desc);
    });
  }

  checkPackageJson() {
    log('blue', '📦 Checking package.json...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check required dependencies
      const requiredDeps = [
        '@prisma/client',
        'jsonwebtoken',
        'bcryptjs',
        'express-rate-limit',
        'cors',
        'zod'
      ];

      const requiredDevDeps = [
        '@types/jsonwebtoken',
        '@types/bcryptjs'
      ];

      requiredDeps.forEach(dep => {
        const exists = packageJson.dependencies && packageJson.dependencies[dep];
        this.addCheck(
          `Dependency: ${dep}`,
          exists ? 'success' : 'error',
          exists ? `Version: ${packageJson.dependencies[dep]}` : 'Missing dependency'
        );
      });

      requiredDevDeps.forEach(dep => {
        const exists = packageJson.devDependencies && packageJson.devDependencies[dep];
        this.addCheck(
          `Dev dependency: ${dep}`,
          exists ? 'success' : 'warning',
          exists ? `Version: ${packageJson.devDependencies[dep]}` : 'Missing dev dependency'
        );
      });

    } catch (error) {
      this.addCheck('Package.json parsing', 'error', `Failed to parse: ${error.message}`);
    }
  }

  checkVercelConfig() {
    log('blue', '⚡ Checking Vercel configuration...');
    
    try {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      
      // Check required configuration
      const hasVersion = vercelConfig.version === 2;
      this.addCheck(
        'Vercel version',
        hasVersion ? 'success' : 'error',
        hasVersion ? 'Version 2 configured' : 'Must use version 2'
      );

      const hasFunctions = vercelConfig.functions && vercelConfig.functions['api/**/*.ts'];
      this.addCheck(
        'Serverless functions',
        hasFunctions ? 'success' : 'error',
        hasFunctions ? 'API functions configured' : 'Missing API function configuration'
      );

      const hasRoutes = vercelConfig.routes && Array.isArray(vercelConfig.routes);
      this.addCheck(
        'Route configuration',
        hasRoutes ? 'success' : 'warning',
        hasRoutes ? 'Routes configured' : 'No route configuration'
      );

      const hasHeaders = vercelConfig.headers && Array.isArray(vercelConfig.headers);
      this.addCheck(
        'Security headers',
        hasHeaders ? 'success' : 'warning',
        hasHeaders ? 'Security headers configured' : 'No security headers'
      );

    } catch (error) {
      this.addCheck('Vercel config parsing', 'error', `Failed to parse: ${error.message}`);
    }
  }

  checkPrismaSchema() {
    log('blue', '🗄️  Checking Prisma schema...');
    
    try {
      const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
      
      // Check database provider
      const hasPostgreSQL = schema.includes('provider = "postgresql"');
      this.addCheck(
        'Database provider',
        hasPostgreSQL ? 'success' : 'error',
        hasPostgreSQL ? 'PostgreSQL configured' : 'Must use PostgreSQL for production'
      );

      // Check for shadow database
      const hasShadowDb = schema.includes('shadowDatabaseUrl');
      this.addCheck(
        'Shadow database',
        hasShadowDb ? 'success' : 'warning',
        hasShadowDb ? 'Shadow database configured' : 'Shadow database recommended for migrations'
      );

      // Check for required models
      const requiredModels = ['User', 'Patient', 'Appointment', 'Assessment', 'TreatmentPlan'];
      requiredModels.forEach(model => {
        const hasModel = schema.includes(`model ${model}`);
        this.addCheck(
          `Model: ${model}`,
          hasModel ? 'success' : 'error',
          hasModel ? 'Model defined' : 'Missing required model'
        );
      });

    } catch (error) {
      this.addCheck('Prisma schema parsing', 'error', `Failed to read: ${error.message}`);
    }
  }

  checkEnvironmentExample() {
    log('blue', '🔧 Checking environment configuration...');
    
    try {
      const envExample = fs.readFileSync('.env.example', 'utf8');
      
      const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'NODE_ENV',
        'FRONTEND_URL'
      ];

      requiredVars.forEach(varName => {
        const hasVar = envExample.includes(varName);
        this.addCheck(
          `Environment variable: ${varName}`,
          hasVar ? 'success' : 'error',
          hasVar ? 'Documented in .env.example' : 'Missing from .env.example'
        );
      });

      // Check JWT secret length guidance
      const hasJWTGuidance = envExample.includes('min-32-chars') || envExample.includes('32');
      this.addCheck(
        'JWT secret guidance',
        hasJWTGuidance ? 'success' : 'warning',
        hasJWTGuidance ? 'JWT secret length guidance provided' : 'Should specify minimum 32 characters for JWT secret'
      );

    } catch (error) {
      this.addCheck('Environment example parsing', 'error', `Failed to read: ${error.message}`);
    }
  }

  checkAPIDocumentation() {
    log('blue', '📚 Checking API documentation...');
    
    try {
      const docs = fs.readFileSync('API_DOCUMENTATION.md', 'utf8');
      
      const requiredSections = [
        'Authentication',
        'Health Check',
        'Patients',
        'Appointments',
        'Error Handling',
        'Rate Limiting'
      ];

      requiredSections.forEach(section => {
        const hasSection = docs.includes(`## ${section}`);
        this.addCheck(
          `Documentation section: ${section}`,
          hasSection ? 'success' : 'error',
          hasSection ? 'Section documented' : 'Missing documentation section'
        );
      });

      // Check for example requests/responses
      const hasJSONExamples = (docs.match(/```json/g) || []).length > 10;
      this.addCheck(
        'API examples',
        hasJSONExamples ? 'success' : 'warning',
        hasJSONExamples ? 'Sufficient JSON examples provided' : 'Should include more request/response examples'
      );

    } catch (error) {
      this.addCheck('API documentation parsing', 'error', `Failed to read: ${error.message}`);
    }
  }

  checkTypeScriptConfig() {
    log('blue', '📝 Checking TypeScript configuration...');
    
    const hasTsConfig = this.checkFileExists('tsconfig.json', 'TypeScript config');
    
    if (hasTsConfig) {
      try {
        const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
        
        const hasStrict = tsConfig.compilerOptions && tsConfig.compilerOptions.strict;
        this.addCheck(
          'TypeScript strict mode',
          hasStrict ? 'success' : 'warning',
          hasStrict ? 'Strict mode enabled' : 'Consider enabling strict mode'
        );

      } catch (error) {
        this.addCheck('TypeScript config parsing', 'warning', `Failed to parse: ${error.message}`);
      }
    }
  }

  async runAllChecks() {
    log('cyan', '🔍 Starting Deployment Validation...\n');
    
    this.checkDirectoryStructure();
    this.checkRequiredFiles();
    this.checkPackageJson();
    this.checkVercelConfig();
    this.checkPrismaSchema();
    this.checkEnvironmentExample();
    this.checkAPIDocumentation();
    this.checkTypeScriptConfig();
    
    this.printSummary();
    return this.errors.length === 0;
  }

  printSummary() {
    log('blue', '\n📊 Validation Summary:');
    
    const success = this.checks.filter(c => c.status === 'success').length;
    const errors = this.checks.filter(c => c.status === 'error').length;
    const warnings = this.checks.filter(c => c.status === 'warning').length;
    const total = this.checks.length;
    
    log('green', `✅ Passed: ${success}/${total}`);
    if (warnings > 0) log('yellow', `⚠️  Warnings: ${warnings}/${total}`);
    if (errors > 0) log('red', `❌ Errors: ${errors}/${total}`);
    
    if (errors === 0) {
      log('green', '\n🎉 Deployment validation passed!');
      log('green', '✅ All critical requirements are met');
      log('green', '✅ Ready for Vercel deployment');
      
      if (warnings > 0) {
        log('yellow', '\n⚠️  Warnings (recommended fixes):');
        this.warnings.forEach(warning => {
          log('yellow', `  • ${warning}`);
        });
      }
    } else {
      log('red', '\n❌ Deployment validation failed!');
      log('red', 'The following errors must be fixed before deployment:');
      this.errors.forEach(error => {
        log('red', `  • ${error}`);
      });
    }
  }
}

// Run validation
async function main() {
  const validator = new DeploymentValidator();
  const isValid = await validator.runAllChecks();
  process.exit(isValid ? 0 : 1);
}

// Handle command line execution
if (require.main === module) {
  main().catch(error => {
    log('red', `Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { DeploymentValidator };
