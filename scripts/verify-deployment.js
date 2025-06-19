#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Tests all critical endpoints after deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.argv[2];

if (!BASE_URL) {
  console.error('❌ Please provide the deployment URL as an argument');
  console.error('Usage: node scripts/verify-deployment.js https://your-domain.vercel.app');
  process.exit(1);
}

console.log(`🔍 Verifying deployment at: ${BASE_URL}`);

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function verifyDeployment() {
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/api/health`,
      expectedStatus: 200,
      check: (data) => data.success && data.data.status === 'OK'
    },
    {
      name: 'Database Connection',
      url: `${BASE_URL}/api/health`,
      expectedStatus: 200,
      check: (data) => data.data.database && data.data.database.status === 'healthy'
    },
    {
      name: 'Frontend Loading',
      url: BASE_URL,
      expectedStatus: 200,
      check: (data) => typeof data === 'string' && data.includes('CounselorTempo')
    }
  ];

  let passed = 0;
  let failed = 0;

  console.log('\n🧪 Running deployment verification tests...\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const result = await makeRequest(test.url);
      
      if (result.status === test.expectedStatus && test.check(result.data)) {
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAILED (Status: ${result.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Verification Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 Deployment verification successful!');
    console.log('🚀 Your CounselorTempo application is ready to use!');
    console.log('\n🔗 Access your application:');
    console.log(`Frontend: ${BASE_URL}`);
    console.log(`API Health: ${BASE_URL}/api/health`);
    console.log('\n🔐 Default login credentials:');
    console.log('Admin: admin@counselortempo.com / admin123');
    console.log('Counselor: counselor@counselortempo.com / counselor123');
  } else {
    console.log('\n❌ Deployment verification failed!');
    console.log('Please check the deployment logs and environment variables.');
  }

  return failed === 0;
}

// Run verification
verifyDeployment()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
