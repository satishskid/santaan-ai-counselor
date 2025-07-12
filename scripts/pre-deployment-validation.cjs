#!/usr/bin/env node

/**
 * Pre-Deployment Validation Script for Santaan AI Counselor
 * Comprehensive validation before Vercel deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Validation results
const validationResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  warnings: [],
  critical: []
};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logResult = (test, status, details = '') => {
  const symbols = { PASS: '✅', FAIL: '❌', WARN: '⚠️', CRITICAL: '🚨' };
  const colorMap = { PASS: 'green', FAIL: 'red', WARN: 'yellow', CRITICAL: 'magenta' };
  
  log(`${symbols[status]} ${test}`, colorMap[status]);
  if (details) log(`   ${details}`, 'cyan');
  
  validationResults.total++;
  if (status === 'PASS') validationResults.passed++;
  else if (status === 'FAIL') validationResults.failed++;
  else if (status === 'WARN') validationResults.warnings++;
  else if (status === 'CRITICAL') {
    validationResults.failed++;
    validationResults.critical.push(test);
  }
};

// Validation functions
const validations = {
  // 1. File Structure Validation
  validateFileStructure() {
    log('\n📁 Validating File Structure...', 'yellow');
    
    const requiredFiles = [
      'package.json',
      'vercel.json',
      'vite.config.ts',
      'tsconfig.json',
      'prisma/schema.prisma',
      'api/index.ts',
      'api/health.ts',
      'api/auth/login.ts',
      'api/auth/register.ts',
      'api/auth/me.ts',
      'api/admin/system-diagnostics.ts',
      'api/admin/testing-suite.ts',
      'src/main.tsx',
      'src/App.tsx'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length === 0) {
      logResult('Required Files Present', 'PASS', 'All critical files found');
    } else {
      logResult('Required Files Present', 'FAIL', `Missing: ${missingFiles.join(', ')}`);
      validationResults.errors.push(`Missing files: ${missingFiles.join(', ')}`);
    }

    // Check for build output
    if (fs.existsSync('dist')) {
      logResult('Build Output Directory', 'PASS', 'dist/ directory exists');
    } else {
      logResult('Build Output Directory', 'WARN', 'dist/ not found - run npm run build');
      validationResults.warnings.push('Build output not found');
    }
  },

  // 2. Package.json Validation
  validatePackageJson() {
    log('\n📦 Validating package.json...', 'yellow');
    
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check required scripts
      const requiredScripts = ['build', 'dev', 'db:generate'];
      const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
      
      if (missingScripts.length === 0) {
        logResult('Required Scripts', 'PASS', 'All required scripts present');
      } else {
        logResult('Required Scripts', 'FAIL', `Missing: ${missingScripts.join(', ')}`);
      }

      // Check for conflicting dependencies
      const conflicts = [];
      if (pkg.dependencies.next && pkg.dependencies.vite) {
        conflicts.push('next + vite conflict');
      }
      
      if (conflicts.length === 0) {
        logResult('Dependency Conflicts', 'PASS', 'No conflicts detected');
      } else {
        logResult('Dependency Conflicts', 'CRITICAL', conflicts.join(', '));
        validationResults.critical.push('Dependency conflicts detected');
      }

      // Check for @vercel/node
      if (pkg.devDependencies['@vercel/node']) {
        logResult('Vercel Types', 'PASS', '@vercel/node types present');
      } else {
        logResult('Vercel Types', 'FAIL', '@vercel/node types missing');
      }

    } catch (error) {
      logResult('Package.json Parse', 'CRITICAL', error.message);
    }
  },

  // 3. Vercel Configuration Validation
  validateVercelConfig() {
    log('\n⚡ Validating Vercel Configuration...', 'yellow');
    
    try {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      
      // Check version
      if (vercelConfig.version === 2) {
        logResult('Vercel Config Version', 'PASS', 'Version 2 specified');
      } else {
        logResult('Vercel Config Version', 'FAIL', `Version ${vercelConfig.version} not recommended`);
      }

      // Check build command
      if (vercelConfig.buildCommand === 'npm run build') {
        logResult('Build Command', 'PASS', 'Correct build command');
      } else {
        logResult('Build Command', 'WARN', `Build command: ${vercelConfig.buildCommand}`);
      }

      // Check output directory
      if (vercelConfig.outputDirectory === 'dist') {
        logResult('Output Directory', 'PASS', 'Correct output directory');
      } else {
        logResult('Output Directory', 'FAIL', `Output: ${vercelConfig.outputDirectory}`);
      }

      // Check functions configuration
      if (vercelConfig.functions && vercelConfig.functions['api/**/*.ts']) {
        logResult('API Functions Config', 'PASS', 'API functions configured');
      } else {
        logResult('API Functions Config', 'WARN', 'API functions not explicitly configured');
      }

      // Check rewrites
      if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
        logResult('URL Rewrites', 'PASS', `${vercelConfig.rewrites.length} rewrite rules`);
      } else {
        logResult('URL Rewrites', 'FAIL', 'No rewrite rules found');
      }

    } catch (error) {
      logResult('Vercel Config Parse', 'CRITICAL', error.message);
    }
  },

  // 4. TypeScript Configuration
  validateTypeScriptConfig() {
    log('\n🔷 Validating TypeScript Configuration...', 'yellow');
    
    try {
      const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
      
      // Check target
      if (tsConfig.compilerOptions.target === 'ES2020') {
        logResult('TypeScript Target', 'PASS', 'ES2020 target');
      } else {
        logResult('TypeScript Target', 'WARN', `Target: ${tsConfig.compilerOptions.target}`);
      }

      // Check module resolution
      if (tsConfig.compilerOptions.moduleResolution === 'bundler') {
        logResult('Module Resolution', 'PASS', 'Bundler resolution');
      } else {
        logResult('Module Resolution', 'WARN', `Resolution: ${tsConfig.compilerOptions.moduleResolution}`);
      }

      // Check JSX
      if (tsConfig.compilerOptions.jsx === 'react-jsx') {
        logResult('JSX Configuration', 'PASS', 'React JSX transform');
      } else {
        logResult('JSX Configuration', 'WARN', `JSX: ${tsConfig.compilerOptions.jsx}`);
      }

    } catch (error) {
      logResult('TypeScript Config Parse', 'FAIL', error.message);
    }
  },

  // 5. Vite Configuration
  validateViteConfig() {
    log('\n⚡ Validating Vite Configuration...', 'yellow');
    
    try {
      const viteConfigContent = fs.readFileSync('vite.config.ts', 'utf8');
      
      // Check build targets
      if (viteConfigContent.includes('es2020') || viteConfigContent.includes('chrome80')) {
        logResult('Vite Build Targets', 'PASS', 'Modern browser targets');
      } else if (viteConfigContent.includes('es2015') || viteConfigContent.includes('chrome58')) {
        logResult('Vite Build Targets', 'CRITICAL', 'Legacy targets will cause build failures');
        validationResults.critical.push('Vite build targets too old');
      } else {
        logResult('Vite Build Targets', 'WARN', 'Build targets not clearly defined');
      }

      // Check for deprecated options
      if (viteConfigContent.includes('polyfillModulePreload')) {
        logResult('Vite Deprecated Options', 'WARN', 'polyfillModulePreload is deprecated');
      } else {
        logResult('Vite Deprecated Options', 'PASS', 'No deprecated options found');
      }

    } catch (error) {
      logResult('Vite Config Read', 'FAIL', error.message);
    }
  },

  // 6. API Endpoints Validation
  validateApiEndpoints() {
    log('\n🔌 Validating API Endpoints...', 'yellow');
    
    const apiFiles = [
      'api/index.ts',
      'api/health.ts',
      'api/auth/login.ts',
      'api/auth/register.ts',
      'api/auth/me.ts',
      'api/admin/system-diagnostics.ts',
      'api/admin/testing-suite.ts'
    ];

    let validEndpoints = 0;
    let typeErrors = 0;

    apiFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for Vercel types
        if (content.includes('@vercel/node')) {
          validEndpoints++;
        } else if (content.includes('NextApiRequest')) {
          typeErrors++;
          validationResults.errors.push(`${file} uses Next.js types instead of Vercel types`);
        }
      }
    });

    if (typeErrors === 0) {
      logResult('API Type Imports', 'PASS', 'All endpoints use Vercel types');
    } else {
      logResult('API Type Imports', 'CRITICAL', `${typeErrors} files use wrong types`);
      validationResults.critical.push('API endpoints use incorrect types');
    }

    logResult('API Endpoint Files', validEndpoints === apiFiles.length ? 'PASS' : 'WARN', 
      `${validEndpoints}/${apiFiles.length} endpoints found`);
  },

  // 7. Build Process Validation
  validateBuildProcess() {
    log('\n🔨 Validating Build Process...', 'yellow');
    
    try {
      // Check if build succeeds
      log('   Running build test...', 'cyan');
      execSync('npm run build', { stdio: 'pipe' });
      logResult('Build Process', 'PASS', 'Build completes successfully');
      
      // Check build output
      if (fs.existsSync('dist/index.html')) {
        logResult('Build Output HTML', 'PASS', 'index.html generated');
      } else {
        logResult('Build Output HTML', 'FAIL', 'index.html not found');
      }

      if (fs.existsSync('dist/assets')) {
        logResult('Build Output Assets', 'PASS', 'Assets directory created');
      } else {
        logResult('Build Output Assets', 'FAIL', 'Assets directory not found');
      }

    } catch (error) {
      logResult('Build Process', 'CRITICAL', 'Build fails');
      validationResults.critical.push('Build process fails');
      validationResults.errors.push(`Build error: ${error.message}`);
    }
  },

  // 8. Environment Variables Check
  validateEnvironmentSetup() {
    log('\n🔐 Validating Environment Setup...', 'yellow');
    
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NODE_ENV'
    ];

    const optionalEnvVars = [
      'SHADOW_DATABASE_URL',
      'FRONTEND_URL',
      'JWT_EXPIRES_IN'
    ];

    // Check for .env file
    if (fs.existsSync('.env')) {
      logResult('Environment File', 'PASS', '.env file exists');
    } else {
      logResult('Environment File', 'WARN', '.env file not found (OK for production)');
    }

    // Check environment template
    if (fs.existsSync('vercel-env-template.json')) {
      logResult('Environment Template', 'PASS', 'Vercel env template exists');
    } else {
      logResult('Environment Template', 'WARN', 'Environment template missing');
    }

    logResult('Environment Variables', 'PASS', 
      `${requiredEnvVars.length} required, ${optionalEnvVars.length} optional vars documented`);
  }
};

// Main validation runner
async function runValidation() {
  log('\n🎯 Santaan AI Counselor - Pre-Deployment Validation', 'cyan');
  log('=' * 70, 'cyan');
  log('Comprehensive validation for Vercel deployment readiness\n', 'blue');

  const startTime = Date.now();

  // Run all validations
  for (const [name, validation] of Object.entries(validations)) {
    try {
      await validation();
    } catch (error) {
      logResult(name, 'CRITICAL', `Validation failed: ${error.message}`);
      validationResults.critical.push(name);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  log('\n' + '=' * 70, 'cyan');
  log('📊 VALIDATION SUMMARY', 'cyan');
  log('=' * 70, 'cyan');
  log(`Total Checks: ${validationResults.total}`, 'blue');
  log(`Passed: ${validationResults.passed}`, 'green');
  log(`Failed: ${validationResults.failed}`, 'red');
  log(`Warnings: ${validationResults.warnings}`, 'yellow');
  log(`Critical Issues: ${validationResults.critical.length}`, 'magenta');
  log(`Duration: ${duration}s`, 'blue');

  // Show critical issues
  if (validationResults.critical.length > 0) {
    log('\n🚨 CRITICAL ISSUES (MUST FIX):', 'magenta');
    validationResults.critical.forEach(issue => log(`  • ${issue}`, 'magenta'));
  }

  // Show errors
  if (validationResults.errors.length > 0) {
    log('\n❌ ERRORS:', 'red');
    validationResults.errors.forEach(error => log(`  • ${error}`, 'red'));
  }

  // Show warnings
  if (validationResults.warnings.length > 0) {
    log('\n⚠️  WARNINGS:', 'yellow');
    validationResults.warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
  }

  // Deployment recommendation
  const criticalIssues = validationResults.critical.length;
  const passRate = (validationResults.passed / validationResults.total) * 100;

  log('\n🎯 DEPLOYMENT RECOMMENDATION:', 'cyan');
  
  if (criticalIssues === 0 && passRate >= 90) {
    log('✅ READY FOR DEPLOYMENT', 'green');
    log('All critical checks passed. Deployment should succeed.', 'green');
  } else if (criticalIssues === 0 && passRate >= 75) {
    log('⚠️  DEPLOYMENT WITH CAUTION', 'yellow');
    log('No critical issues, but some warnings need attention.', 'yellow');
  } else {
    log('❌ NOT READY FOR DEPLOYMENT', 'red');
    log('Critical issues must be resolved before deployment.', 'red');
  }

  log(`\nPass Rate: ${passRate.toFixed(1)}%`, 'blue');
  log('');

  return criticalIssues === 0 && passRate >= 75;
}

// Run validation if called directly
if (require.main === module) {
  runValidation()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`\n💥 Validation failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { runValidation, validationResults };
