#!/usr/bin/env node

/**
 * Pre-commit Validation Workflow
 * Comprehensive validation before git commits and deployments
 */

import { execSync } from 'child_process';
import { validateEnvironmentVariables } from './validate-env-vars.js';
import { testBuildPipeline } from './test-build-process.js';

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

function runValidationStep(stepName, validationFunction) {
  log('blue', `\n🔍 ${stepName}...`);
  log('cyan', '='.repeat(stepName.length + 4));
  
  try {
    const result = validationFunction();
    if (result.success || result.isValid) {
      log('green', `✅ ${stepName} passed`);
      return { success: true, result };
    } else {
      log('red', `❌ ${stepName} failed`);
      return { success: false, result };
    }
  } catch (error) {
    log('red', `❌ ${stepName} error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function validateCodeQuality() {
  log('blue', '\n🔍 Code Quality Validation');
  log('cyan', '==========================');
  
  const checks = [];
  
  // ESLint check
  try {
    execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0', { stdio: 'pipe' });
    log('green', '✅ ESLint: No issues found');
    checks.push({ name: 'ESLint', success: true });
  } catch (error) {
    log('red', '❌ ESLint: Issues found');
    log('yellow', 'Run: npx eslint . --ext .ts,.tsx,.js,.jsx --fix');
    checks.push({ name: 'ESLint', success: false });
  }
  
  // TypeScript check
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log('green', '✅ TypeScript: No compilation errors');
    checks.push({ name: 'TypeScript', success: true });
  } catch (error) {
    log('red', '❌ TypeScript: Compilation errors found');
    log('yellow', 'Run: npx tsc --noEmit to see details');
    checks.push({ name: 'TypeScript', success: false });
  }
  
  // Prettier check
  try {
    execSync('npx prettier --check .', { stdio: 'pipe' });
    log('green', '✅ Prettier: Code formatting is correct');
    checks.push({ name: 'Prettier', success: true });
  } catch (error) {
    log('yellow', '⚠️  Prettier: Code formatting issues found');
    log('yellow', 'Run: npx prettier --write . to fix');
    checks.push({ name: 'Prettier', success: false, warning: true });
  }
  
  const allPassed = checks.every(check => check.success || check.warning);
  return { success: allPassed, checks };
}

function validateGitStatus() {
  log('blue', '\n🔍 Git Status Validation');
  log('cyan', '========================');
  
  try {
    // Check for uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      log('yellow', '⚠️  Uncommitted changes found:');
      log('blue', status);
      return { success: true, hasChanges: true, warning: 'Uncommitted changes present' };
    } else {
      log('green', '✅ Git: Working directory clean');
      return { success: true, hasChanges: false };
    }
  } catch (error) {
    log('red', `❌ Git status check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function validateDeploymentReadiness() {
  log('blue', '\n🔍 Deployment Readiness Check');
  log('cyan', '=============================');
  
  const checks = [];
  
  // Check vercel.json
  try {
    const fs = await import('fs');
    if (fs.existsSync('vercel.json')) {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      log('green', '✅ vercel.json exists and is valid JSON');
      checks.push({ name: 'vercel.json', success: true });
      
      // Check for required fields
      if (vercelConfig.buildCommand) {
        log('green', `✅ Build command: ${vercelConfig.buildCommand}`);
      } else {
        log('yellow', '⚠️  No build command specified in vercel.json');
      }
      
      if (vercelConfig.outputDirectory) {
        log('green', `✅ Output directory: ${vercelConfig.outputDirectory}`);
      }
      
    } else {
      log('red', '❌ vercel.json not found');
      checks.push({ name: 'vercel.json', success: false });
    }
  } catch (error) {
    log('red', `❌ vercel.json validation failed: ${error.message}`);
    checks.push({ name: 'vercel.json', success: false });
  }
  
  // Check Prisma schema
  try {
    const fs = await import('fs');
    if (fs.existsSync('prisma/schema.prisma')) {
      log('green', '✅ Prisma schema exists');
      checks.push({ name: 'prisma schema', success: true });
    } else {
      log('red', '❌ Prisma schema not found');
      checks.push({ name: 'prisma schema', success: false });
    }
  } catch (error) {
    log('red', `❌ Prisma schema check failed: ${error.message}`);
    checks.push({ name: 'prisma schema', success: false });
  }
  
  // Check API directory
  try {
    const fs = await import('fs');
    if (fs.existsSync('api')) {
      const apiFiles = fs.readdirSync('api', { recursive: true });
      const jsFiles = apiFiles.filter(file => file.endsWith('.js'));
      log('green', `✅ API directory exists with ${jsFiles.length} endpoint files`);
      checks.push({ name: 'api endpoints', success: true });
    } else {
      log('red', '❌ API directory not found');
      checks.push({ name: 'api endpoints', success: false });
    }
  } catch (error) {
    log('red', `❌ API directory check failed: ${error.message}`);
    checks.push({ name: 'api endpoints', success: false });
  }
  
  const allPassed = checks.every(check => check.success);
  return { success: allPassed, checks };
}

function generateValidationReport(results) {
  log('cyan', '\n📊 Pre-commit Validation Report');
  log('blue', '===============================');
  
  const allSteps = [
    { name: 'Environment Variables', result: results.envValidation },
    { name: 'Code Quality', result: results.codeQuality },
    { name: 'Git Status', result: results.gitStatus },
    { name: 'Deployment Readiness', result: results.deploymentReadiness }
  ];
  
  let overallSuccess = true;
  let hasWarnings = false;
  
  allSteps.forEach(step => {
    if (step.result.success) {
      log('green', `✅ ${step.name}: PASSED`);
    } else {
      log('red', `❌ ${step.name}: FAILED`);
      overallSuccess = false;
    }
    
    if (step.result.warning) {
      log('yellow', `⚠️  ${step.name}: ${step.result.warning}`);
      hasWarnings = true;
    }
  });
  
  log('cyan', '\n🎯 Summary');
  log('blue', '==========');
  
  if (overallSuccess) {
    log('green', '🎉 All validation checks passed!');
    if (hasWarnings) {
      log('yellow', '⚠️  Some warnings were found - consider addressing them');
    }
    log('green', '✅ Ready for commit and deployment');
  } else {
    log('red', '❌ Validation failed - please fix the issues before committing');
    log('yellow', '\n💡 Next steps:');
    log('yellow', '1. Fix the failing validation checks');
    log('yellow', '2. Run this script again to verify fixes');
    log('yellow', '3. Commit your changes when all checks pass');
  }
  
  return { success: overallSuccess, hasWarnings };
}

function main() {
  log('cyan', '🧪 CounselorTempo Pre-commit Validation');
  log('blue', '=======================================\n');
  
  const results = {};
  
  // Step 1: Environment Variables Validation
  results.envValidation = runValidationStep(
    'Environment Variables Validation',
    () => validateEnvironmentVariables()
  );
  
  // Step 2: Code Quality Validation
  results.codeQuality = runValidationStep(
    'Code Quality Validation',
    () => validateCodeQuality()
  );
  
  // Step 3: Git Status Validation
  results.gitStatus = runValidationStep(
    'Git Status Validation',
    () => validateGitStatus()
  );
  
  // Step 4: Deployment Readiness Check
  results.deploymentReadiness = runValidationStep(
    'Deployment Readiness Check',
    () => validateDeploymentReadiness()
  );
  
  // Generate final report
  const report = generateValidationReport(results);
  
  // Exit with appropriate code
  process.exit(report.success ? 0 : 1);
}

// Export for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  validateCodeQuality,
  validateGitStatus,
  validateDeploymentReadiness,
  generateValidationReport
};
