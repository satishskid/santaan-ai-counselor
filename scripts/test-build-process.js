#!/usr/bin/env node

/**
 * Build Process Testing Framework
 * Tests the complete build pipeline locally before deployment
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

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

function execCommand(command, description, options = {}) {
  log('blue', `\n🔄 ${description}...`);
  log('cyan', `Command: ${command}`);
  
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      cwd: process.cwd(),
      ...options
    });
    
    log('green', `✅ ${description} completed successfully`);
    return { success: true, output: result };
  } catch (error) {
    log('red', `❌ ${description} failed`);
    if (error.stdout) log('yellow', `Output: ${error.stdout}`);
    if (error.stderr) log('red', `Error: ${error.stderr}`);
    return { success: false, error: error.message, output: error.stdout };
  }
}

function checkFileExists(filePath, description) {
  log('blue', `\n📁 Checking ${description}...`);
  
  if (fs.existsSync(filePath)) {
    log('green', `✅ ${description} exists: ${filePath}`);
    return true;
  } else {
    log('red', `❌ ${description} not found: ${filePath}`);
    return false;
  }
}

function checkPackageJson() {
  log('cyan', '\n📦 Validating package.json...');
  
  if (!checkFileExists('package.json', 'package.json')) {
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['build', 'postbuild', 'db:generate', 'db:deploy'];
    let allScriptsPresent = true;
    
    for (const script of requiredScripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log('green', `✅ Script '${script}' found`);
      } else {
        log('red', `❌ Required script '${script}' missing`);
        allScriptsPresent = false;
      }
    }
    
    // Check required dependencies
    const requiredDeps = ['@prisma/client', 'prisma', 'react', 'vite'];
    for (const dep of requiredDeps) {
      if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
        log('green', `✅ Dependency '${dep}' found`);
      } else {
        log('yellow', `⚠️  Dependency '${dep}' not found`);
      }
    }
    
    return allScriptsPresent;
  } catch (error) {
    log('red', `❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

function testBuildPipeline() {
  const results = {
    steps: [],
    success: true,
    errors: []
  };
  
  log('cyan', '\n🏗️  Testing Complete Build Pipeline');
  log('blue', '===================================');
  
  // Step 1: Install dependencies
  const installResult = execCommand('npm install', 'Installing dependencies');
  results.steps.push({ name: 'npm install', success: installResult.success });
  if (!installResult.success) {
    results.success = false;
    results.errors.push('Failed to install dependencies');
  }
  
  // Step 2: Generate Prisma client
  const prismaGenResult = execCommand('npx prisma generate', 'Generating Prisma client');
  results.steps.push({ name: 'prisma generate', success: prismaGenResult.success });
  if (!prismaGenResult.success) {
    results.success = false;
    results.errors.push('Failed to generate Prisma client');
  }
  
  // Step 3: TypeScript compilation check
  const tscResult = execCommand('npx tsc --noEmit', 'TypeScript compilation check');
  results.steps.push({ name: 'typescript check', success: tscResult.success });
  if (!tscResult.success) {
    results.success = false;
    results.errors.push('TypeScript compilation errors');
  }
  
  // Step 4: Build frontend
  const buildResult = execCommand('npm run build', 'Building frontend');
  results.steps.push({ name: 'frontend build', success: buildResult.success });
  if (!buildResult.success) {
    results.success = false;
    results.errors.push('Frontend build failed');
  }
  
  // Step 5: Check build output
  if (buildResult.success) {
    const distExists = checkFileExists('dist', 'Build output directory');
    const indexExists = checkFileExists('dist/index.html', 'Built index.html');
    
    if (!distExists || !indexExists) {
      results.success = false;
      results.errors.push('Build output incomplete');
    }
  }
  
  return results;
}

function testDatabaseConnection() {
  log('cyan', '\n🗄️  Testing Database Connection');
  log('blue', '===============================');
  
  if (!process.env.DATABASE_URL) {
    log('yellow', '⚠️  DATABASE_URL not set, skipping database tests');
    return { success: true, skipped: true };
  }
  
  // Test database connection with Prisma
  const dbTestResult = execCommand(
    'npx prisma db push --preview-feature --accept-data-loss',
    'Testing database schema deployment',
    { silent: false }
  );
  
  if (!dbTestResult.success) {
    log('red', '❌ Database connection or schema deployment failed');
    log('yellow', '💡 This might be due to:');
    log('yellow', '   - Invalid DATABASE_URL format');
    log('yellow', '   - Database not accessible');
    log('yellow', '   - Network connectivity issues');
    log('yellow', '   - Database permissions');
    return { success: false, error: 'Database connection failed' };
  }
  
  log('green', '✅ Database connection and schema deployment successful');
  return { success: true };
}

function testApiEndpoints() {
  log('cyan', '\n🔌 Testing API Endpoints Structure');
  log('blue', '==================================');
  
  const apiDir = 'api';
  if (!fs.existsSync(apiDir)) {
    log('red', `❌ API directory not found: ${apiDir}`);
    return { success: false, error: 'API directory missing' };
  }
  
  // Check for key API files
  const keyEndpoints = [
    'api/health.js',
    'api/auth/login.js',
    'api/auth/register.js',
    'api/patients/index.js',
    'api/appointments/index.js'
  ];
  
  let allEndpointsPresent = true;
  for (const endpoint of keyEndpoints) {
    if (fs.existsSync(endpoint)) {
      log('green', `✅ API endpoint found: ${endpoint}`);
    } else {
      log('red', `❌ API endpoint missing: ${endpoint}`);
      allEndpointsPresent = false;
    }
  }
  
  return { success: allEndpointsPresent };
}

function generateBuildReport(results) {
  log('cyan', '\n📊 Build Process Report');
  log('blue', '=======================');
  
  if (results.success) {
    log('green', '🎉 All build steps completed successfully!');
  } else {
    log('red', '❌ Build process has issues:');
    results.errors.forEach(error => log('red', `   • ${error}`));
  }
  
  log('blue', '\nStep-by-step results:');
  results.steps.forEach(step => {
    const status = step.success ? '✅' : '❌';
    log(step.success ? 'green' : 'red', `${status} ${step.name}`);
  });
  
  if (!results.success) {
    log('yellow', '\n💡 Recommendations:');
    log('yellow', '1. Fix the failing steps before deployment');
    log('yellow', '2. Ensure all environment variables are set correctly');
    log('yellow', '3. Verify database connectivity');
    log('yellow', '4. Check for TypeScript errors');
  }
}

function main() {
  log('cyan', '🧪 CounselorTempo Build Process Testing');
  log('blue', '=======================================\n');
  
  // Step 1: Validate package.json
  if (!checkPackageJson()) {
    log('red', '❌ package.json validation failed');
    process.exit(1);
  }
  
  // Step 2: Test build pipeline
  const buildResults = testBuildPipeline();
  
  // Step 3: Test database connection (if DATABASE_URL is set)
  const dbResults = testDatabaseConnection();
  
  // Step 4: Test API endpoints structure
  const apiResults = testApiEndpoints();
  
  // Combine results
  const overallSuccess = buildResults.success && 
                        (dbResults.skipped || dbResults.success) && 
                        apiResults.success;
  
  // Generate report
  generateBuildReport({
    success: overallSuccess,
    steps: [
      ...buildResults.steps,
      { name: 'database connection', success: dbResults.skipped || dbResults.success },
      { name: 'api endpoints check', success: apiResults.success }
    ],
    errors: [
      ...buildResults.errors,
      ...(dbResults.error ? [dbResults.error] : []),
      ...(apiResults.error ? [apiResults.error] : [])
    ]
  });
  
  if (overallSuccess) {
    log('green', '\n🚀 Build process validation completed successfully!');
    log('green', '✅ Your application is ready for deployment');
  } else {
    log('red', '\n❌ Build process validation failed');
    log('yellow', '⚠️  Please fix the issues before deploying');
  }
  
  process.exit(overallSuccess ? 0 : 1);
}

// Export for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testBuildPipeline, testDatabaseConnection, testApiEndpoints };
