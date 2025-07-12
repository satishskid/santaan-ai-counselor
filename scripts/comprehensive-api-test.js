#!/usr/bin/env node

/**
 * Comprehensive API Testing Suite for Santaan AI Counselor
 * Tests all API endpoints for deployment readiness
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  verbose: true
};

// Test results tracking
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  warnings: []
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// Utility functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (name, status, details = '') => {
  const symbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`${symbol} ${name}`, color);
  if (details) log(`   ${details}`, 'cyan');
};

// HTTP request helper
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      ok: response.ok
    };
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
};

// Individual test functions
const tests = {
  // Health Check Tests
  async testHealthEndpoint() {
    testResults.total++;
    try {
      const response = await makeRequest('/api/health');
      
      if (response.status === 200 && response.data.success) {
        testResults.passed++;
        logTest('Health Check Endpoint', 'PASS', `Status: ${response.status}`);
        
        // Validate response structure
        const requiredFields = ['status', 'timestamp', 'environment', 'version'];
        const missingFields = requiredFields.filter(field => !response.data.data[field]);
        
        if (missingFields.length > 0) {
          testResults.warnings.push(`Health endpoint missing fields: ${missingFields.join(', ')}`);
          logTest('Health Response Structure', 'WARN', `Missing: ${missingFields.join(', ')}`);
        }
        
        return true;
      } else {
        throw new Error(`Unexpected response: ${response.status} - ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push(`Health Check: ${error.message}`);
      logTest('Health Check Endpoint', 'FAIL', error.message);
      return false;
    }
  },

  // API Index Test
  async testApiIndex() {
    testResults.total++;
    try {
      const response = await makeRequest('/api');
      
      if (response.status === 200 && response.data.success) {
        testResults.passed++;
        logTest('API Index Endpoint', 'PASS', `Version: ${response.data.version}`);
        return true;
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push(`API Index: ${error.message}`);
      logTest('API Index Endpoint', 'FAIL', error.message);
      return false;
    }
  },

  // CORS Tests
  async testCorsHeaders() {
    testResults.total++;
    try {
      const response = await makeRequest('/api/health', { method: 'OPTIONS' });
      
      const corsHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers'
      ];
      
      const missingHeaders = corsHeaders.filter(header => !response.headers[header]);
      
      if (missingHeaders.length === 0) {
        testResults.passed++;
        logTest('CORS Headers', 'PASS', 'All required CORS headers present');
        return true;
      } else {
        throw new Error(`Missing CORS headers: ${missingHeaders.join(', ')}`);
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push(`CORS: ${error.message}`);
      logTest('CORS Headers', 'FAIL', error.message);
      return false;
    }
  },

  // Authentication Endpoint Tests
  async testAuthEndpoints() {
    const authTests = [
      { endpoint: '/api/auth/login', method: 'POST', expectedStatus: 400 }, // Should fail without credentials
      { endpoint: '/api/auth/register', method: 'POST', expectedStatus: 400 }, // Should fail without data
      { endpoint: '/api/auth/me', method: 'GET', expectedStatus: 401 } // Should fail without token
    ];

    for (const test of authTests) {
      testResults.total++;
      try {
        const response = await makeRequest(test.endpoint, { 
          method: test.method,
          body: test.method === 'POST' ? JSON.stringify({}) : undefined
        });
        
        if (response.status === test.expectedStatus) {
          testResults.passed++;
          logTest(`${test.method} ${test.endpoint}`, 'PASS', `Status: ${response.status}`);
        } else {
          throw new Error(`Expected ${test.expectedStatus}, got ${response.status}`);
        }
      } catch (error) {
        testResults.failed++;
        testResults.errors.push(`${test.endpoint}: ${error.message}`);
        logTest(`${test.method} ${test.endpoint}`, 'FAIL', error.message);
      }
    }
  },

  // Admin Endpoints Test
  async testAdminEndpoints() {
    const adminTests = [
      { endpoint: '/api/admin/system-diagnostics', expectedStatus: 401 }, // Should require auth
      { endpoint: '/api/admin/testing-suite', expectedStatus: 401 } // Should require auth
    ];

    for (const test of adminTests) {
      testResults.total++;
      try {
        const response = await makeRequest(test.endpoint);
        
        if (response.status === test.expectedStatus) {
          testResults.passed++;
          logTest(`Admin ${test.endpoint}`, 'PASS', `Properly secured (${response.status})`);
        } else {
          throw new Error(`Expected ${test.expectedStatus}, got ${response.status}`);
        }
      } catch (error) {
        testResults.failed++;
        testResults.errors.push(`${test.endpoint}: ${error.message}`);
        logTest(`Admin ${test.endpoint}`, 'FAIL', error.message);
      }
    }
  },

  // Error Handling Tests
  async testErrorHandling() {
    testResults.total++;
    try {
      const response = await makeRequest('/api/nonexistent-endpoint');
      
      if (response.status === 404) {
        testResults.passed++;
        logTest('404 Error Handling', 'PASS', 'Returns proper 404 for missing endpoints');
        return true;
      } else {
        throw new Error(`Expected 404, got ${response.status}`);
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push(`Error Handling: ${error.message}`);
      logTest('404 Error Handling', 'FAIL', error.message);
      return false;
    }
  }
};

// Main test runner
async function runTests() {
  log('\n🧪 Santaan AI Counselor - Comprehensive API Testing Suite', 'cyan');
  log('=' * 60, 'cyan');
  log(`Testing API at: ${API_BASE_URL}`, 'blue');
  log('');

  const startTime = Date.now();

  // Run all tests
  for (const [testName, testFunction] of Object.entries(tests)) {
    log(`\n📋 Running ${testName}...`, 'yellow');
    await testFunction();
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  log('\n' + '=' * 60, 'cyan');
  log('📊 TEST SUMMARY', 'cyan');
  log('=' * 60, 'cyan');
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Warnings: ${testResults.warnings.length}`, 'yellow');
  log(`Duration: ${duration}s`, 'blue');

  if (testResults.errors.length > 0) {
    log('\n❌ ERRORS:', 'red');
    testResults.errors.forEach(error => log(`  • ${error}`, 'red'));
  }

  if (testResults.warnings.length > 0) {
    log('\n⚠️  WARNINGS:', 'yellow');
    testResults.warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
  }

  // Deployment readiness assessment
  const passRate = (testResults.passed / testResults.total) * 100;
  log('\n🎯 DEPLOYMENT READINESS:', 'cyan');
  
  if (passRate >= 90) {
    log('✅ READY FOR DEPLOYMENT', 'green');
    log(`Pass rate: ${passRate.toFixed(1)}% - Excellent!`, 'green');
  } else if (passRate >= 75) {
    log('⚠️  DEPLOYMENT WITH CAUTION', 'yellow');
    log(`Pass rate: ${passRate.toFixed(1)}% - Some issues need attention`, 'yellow');
  } else {
    log('❌ NOT READY FOR DEPLOYMENT', 'red');
    log(`Pass rate: ${passRate.toFixed(1)}% - Critical issues must be fixed`, 'red');
  }

  log('');
  return passRate >= 75;
}

// Run tests if called directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`\n💥 Test runner failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { runTests, testResults };
