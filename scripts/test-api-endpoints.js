#!/usr/bin/env node

/**
 * API Endpoints Testing Script
 * Tests all API endpoints to ensure they're working correctly
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  testUser: {
    email: 'test@counselortempo.com',
    password: 'testpassword123',
    fullName: 'Test User',
    role: 'COUNSELOR'
  }
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

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// HTTP request helper
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(config.baseUrl + path);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CounselorTempo-API-Test/1.0',
        ...headers
      },
      timeout: config.timeout
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test suite
class APITester {
  constructor() {
    this.accessToken = null;
    this.testResults = [];
    this.patientId = null;
  }

  async runTest(name, testFn) {
    log('cyan', `\n🧪 Testing: ${name}`);
    try {
      const result = await testFn();
      if (result.success) {
        log('green', `✅ ${name} - PASSED`);
        this.testResults.push({ name, status: 'PASSED', details: result.details });
      } else {
        log('red', `❌ ${name} - FAILED: ${result.error}`);
        this.testResults.push({ name, status: 'FAILED', error: result.error });
      }
    } catch (error) {
      log('red', `❌ ${name} - ERROR: ${error.message}`);
      this.testResults.push({ name, status: 'ERROR', error: error.message });
    }
  }

  async testHealthCheck() {
    const response = await makeRequest('GET', '/api/health');
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        details: `Status: ${response.data.data.status}, DB: ${response.data.data.database?.status}`
      };
    }
    
    return {
      success: false,
      error: `Expected 200 with success=true, got ${response.status}`
    };
  }

  async testUserRegistration() {
    const response = await makeRequest('POST', '/api/auth/register', config.testUser);
    
    if (response.status === 201 && response.data.success && response.data.data.accessToken) {
      this.accessToken = response.data.data.accessToken;
      return {
        success: true,
        details: `User registered with ID: ${response.data.data.user.id}`
      };
    }
    
    // If user already exists, try login instead
    if (response.status === 409) {
      return await this.testUserLogin();
    }
    
    return {
      success: false,
      error: `Expected 201 with access token, got ${response.status}: ${response.data.error || 'Unknown error'}`
    };
  }

  async testUserLogin() {
    const response = await makeRequest('POST', '/api/auth/login', {
      email: config.testUser.email,
      password: config.testUser.password
    });
    
    if (response.status === 200 && response.data.success && response.data.data.accessToken) {
      this.accessToken = response.data.data.accessToken;
      return {
        success: true,
        details: `User logged in: ${response.data.data.user.email}`
      };
    }
    
    return {
      success: false,
      error: `Expected 200 with access token, got ${response.status}: ${response.data.error || 'Unknown error'}`
    };
  }

  async testGetUserProfile() {
    if (!this.accessToken) {
      return { success: false, error: 'No access token available' };
    }

    const response = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${this.accessToken}`
    });
    
    if (response.status === 200 && response.data.success && response.data.data.user) {
      return {
        success: true,
        details: `Profile retrieved for: ${response.data.data.user.email}`
      };
    }
    
    return {
      success: false,
      error: `Expected 200 with user data, got ${response.status}: ${response.data.error || 'Unknown error'}`
    };
  }

  async testCreatePatient() {
    if (!this.accessToken) {
      return { success: false, error: 'No access token available' };
    }

    const patientData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@test.com',
      phone: '+1-555-0123',
      gender: 'female',
      diagnosis: 'Test diagnosis'
    };

    const response = await makeRequest('POST', '/api/patients', patientData, {
      'Authorization': `Bearer ${this.accessToken}`
    });
    
    if (response.status === 201 && response.data.success && response.data.data.patient) {
      this.patientId = response.data.data.patient.id;
      return {
        success: true,
        details: `Patient created with ID: ${this.patientId}`
      };
    }
    
    return {
      success: false,
      error: `Expected 201 with patient data, got ${response.status}: ${response.data.error || 'Unknown error'}`
    };
  }

  async testGetPatients() {
    if (!this.accessToken) {
      return { success: false, error: 'No access token available' };
    }

    const response = await makeRequest('GET', '/api/patients', null, {
      'Authorization': `Bearer ${this.accessToken}`
    });
    
    if (response.status === 200 && response.data.success && Array.isArray(response.data.data.patients)) {
      return {
        success: true,
        details: `Retrieved ${response.data.data.patients.length} patients`
      };
    }
    
    return {
      success: false,
      error: `Expected 200 with patients array, got ${response.status}: ${response.data.error || 'Unknown error'}`
    };
  }

  async testGetDashboardStats() {
    if (!this.accessToken) {
      return { success: false, error: 'No access token available' };
    }

    const response = await makeRequest('GET', '/api/dashboard/stats', null, {
      'Authorization': `Bearer ${this.accessToken}`
    });
    
    if (response.status === 200 && response.data.success && response.data.data.totalPatients !== undefined) {
      return {
        success: true,
        details: `Dashboard stats: ${response.data.data.totalPatients} patients, ${response.data.data.upcomingAppointments} appointments`
      };
    }
    
    return {
      success: false,
      error: `Expected 200 with dashboard stats, got ${response.status}: ${response.data.error || 'Unknown error'}`
    };
  }

  async testUnauthorizedAccess() {
    const response = await makeRequest('GET', '/api/patients');
    
    if (response.status === 401) {
      return {
        success: true,
        details: 'Correctly rejected unauthorized request'
      };
    }
    
    return {
      success: false,
      error: `Expected 401 for unauthorized request, got ${response.status}`
    };
  }

  async testInvalidToken() {
    const response = await makeRequest('GET', '/api/patients', null, {
      'Authorization': 'Bearer invalid-token'
    });
    
    if (response.status === 401) {
      return {
        success: true,
        details: 'Correctly rejected invalid token'
      };
    }
    
    return {
      success: false,
      error: `Expected 401 for invalid token, got ${response.status}`
    };
  }

  async runAllTests() {
    log('blue', '🚀 Starting API Endpoint Tests...');
    log('blue', `Base URL: ${config.baseUrl}`);
    
    // Core functionality tests
    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('User Registration/Login', () => this.testUserRegistration());
    await this.runTest('Get User Profile', () => this.testGetUserProfile());
    await this.runTest('Create Patient', () => this.testCreatePatient());
    await this.runTest('Get Patients List', () => this.testGetPatients());
    await this.runTest('Get Dashboard Stats', () => this.testGetDashboardStats());
    
    // Security tests
    await this.runTest('Unauthorized Access Rejection', () => this.testUnauthorizedAccess());
    await this.runTest('Invalid Token Rejection', () => this.testInvalidToken());

    // Print summary
    this.printSummary();
  }

  printSummary() {
    log('blue', '\n📊 Test Results Summary:');
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    const total = this.testResults.length;
    
    log('green', `✅ Passed: ${passed}/${total}`);
    if (failed > 0) log('red', `❌ Failed: ${failed}/${total}`);
    if (errors > 0) log('yellow', `⚠️  Errors: ${errors}/${total}`);
    
    if (failed === 0 && errors === 0) {
      log('green', '\n🎉 All tests passed! API is ready for deployment.');
    } else {
      log('red', '\n❌ Some tests failed. Please fix issues before deployment.');
      
      // Show failed tests
      this.testResults
        .filter(r => r.status !== 'PASSED')
        .forEach(result => {
          log('red', `  • ${result.name}: ${result.error}`);
        });
    }
  }
}

// Run tests
async function main() {
  const tester = new APITester();
  await tester.runAllTests();
  
  const allPassed = tester.testResults.every(r => r.status === 'PASSED');
  process.exit(allPassed ? 0 : 1);
}

// Handle command line execution
if (require.main === module) {
  main().catch(error => {
    log('red', `Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { APITester, makeRequest };

// Additional test for EMR endpoints
APITester.prototype.testEMRConnection = async function() {
  if (!this.accessToken) {
    return { success: false, error: 'No access token available' };
  }

  const emrConfig = {
    enabled: true,
    provider: 'test',
    baseUrl: 'https://test-emr.com/api',
    apiKey: 'test-key',
    timeout: 30000
  };

  const response = await makeRequest('POST', '/api/emr/test-connection', emrConfig, {
    'Authorization': `Bearer ${this.accessToken}`
  });

  if (response.status === 200 && response.data.success) {
    return {
      success: true,
      details: `EMR connection test: ${response.data.data.message}`
    };
  }

  return {
    success: false,
    error: `Expected 200 with success, got ${response.status}: ${response.data.error || 'Unknown error'}`
  };
};
