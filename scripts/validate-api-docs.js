#!/usr/bin/env node

/**
 * API Documentation Validation Script
 * Validates that all API endpoints are documented and examples are valid JSON
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateAPIDocumentation() {
  log('blue', '🔍 Validating API Documentation...\n');

  const docPath = path.join(__dirname, '..', 'API_DOCUMENTATION.md');
  
  if (!fs.existsSync(docPath)) {
    log('red', '❌ API_DOCUMENTATION.md not found');
    return false;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  let isValid = true;

  // Check for required sections
  const requiredSections = [
    'Authentication',
    'Health Check',
    'Patients',
    'Appointments',
    'Assessments',
    'Treatment Plans',
    'Dashboard',
    'EMR Integration',
    'Error Handling',
    'Rate Limiting'
  ];

  log('blue', '📋 Checking required sections...');
  requiredSections.forEach(section => {
    if (content.includes(`## ${section}`)) {
      log('green', `✅ Section found: ${section}`);
    } else {
      log('red', `❌ Missing section: ${section}`);
      isValid = false;
    }
  });

  // Check for required endpoints
  const requiredEndpoints = [
    'POST /api/auth/login',
    'POST /api/auth/register',
    'POST /api/auth/refresh',
    'POST /api/auth/logout',
    'GET /api/auth/me',
    'GET /api/health',
    'GET /api/patients',
    'POST /api/patients',
    'GET /api/patients/[id]',
    'PUT /api/patients/[id]',
    'GET /api/appointments',
    'POST /api/appointments',
    'GET /api/assessments',
    'POST /api/assessments',
    'GET /api/treatment-plans',
    'POST /api/treatment-plans',
    'GET /api/dashboard/stats',
    'POST /api/emr/test-connection',
    'GET /api/emr/patients/[patientId]'
  ];

  log('blue', '\n🔗 Checking documented endpoints...');
  requiredEndpoints.forEach(endpoint => {
    if (content.includes(`### ${endpoint}`)) {
      log('green', `✅ Endpoint documented: ${endpoint}`);
    } else {
      log('red', `❌ Missing endpoint documentation: ${endpoint}`);
      isValid = false;
    }
  });

  // Validate JSON examples
  log('blue', '\n📝 Validating JSON examples...');
  const jsonBlocks = content.match(/```json\n([\s\S]*?)\n```/g);
  
  if (jsonBlocks) {
    let jsonValid = true;
    jsonBlocks.forEach((block, index) => {
      try {
        const jsonContent = block.replace(/```json\n/, '').replace(/\n```/, '');
        JSON.parse(jsonContent);
        // Don't log every valid JSON to keep output clean
      } catch (error) {
        log('red', `❌ Invalid JSON in block ${index + 1}: ${error.message}`);
        jsonValid = false;
        isValid = false;
      }
    });
    
    if (jsonValid) {
      log('green', `✅ All ${jsonBlocks.length} JSON examples are valid`);
    }
  }

  // Check for authentication headers
  log('blue', '\n🔐 Checking authentication documentation...');
  const authHeaderCount = (content.match(/Authorization: Bearer jwt_token_here/g) || []).length;
  if (authHeaderCount > 0) {
    log('green', `✅ Authentication headers documented in ${authHeaderCount} endpoints`);
  } else {
    log('yellow', '⚠️  No authentication headers found in documentation');
  }

  // Check for error response documentation
  log('blue', '\n❌ Checking error handling documentation...');
  if (content.includes('Error Response Format')) {
    log('green', '✅ Error response format documented');
  } else {
    log('red', '❌ Missing error response format documentation');
    isValid = false;
  }

  // Check for rate limiting documentation
  if (content.includes('Rate Limiting')) {
    log('green', '✅ Rate limiting documented');
  } else {
    log('red', '❌ Missing rate limiting documentation');
    isValid = false;
  }

  // Check for environment variables documentation
  if (content.includes('Environment Variables Required')) {
    log('green', '✅ Environment variables documented');
  } else {
    log('red', '❌ Missing environment variables documentation');
    isValid = false;
  }

  log('blue', '\n📊 Documentation Statistics:');
  log('blue', `- Total sections: ${requiredSections.length}`);
  log('blue', `- Total endpoints: ${requiredEndpoints.length}`);
  log('blue', `- JSON examples: ${jsonBlocks ? jsonBlocks.length : 0}`);
  log('blue', `- File size: ${(content.length / 1024).toFixed(2)} KB`);

  if (isValid) {
    log('green', '\n🎉 API Documentation validation passed!');
    log('green', '✅ All required sections and endpoints are documented');
    log('green', '✅ All JSON examples are valid');
    log('green', '✅ Documentation is complete and ready for use');
  } else {
    log('red', '\n❌ API Documentation validation failed!');
    log('red', 'Please fix the issues above before proceeding.');
  }

  return isValid;
}

// Run validation
const isValid = validateAPIDocumentation();
process.exit(isValid ? 0 : 1);
