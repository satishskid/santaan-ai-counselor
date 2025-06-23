#!/usr/bin/env node

/**
 * CounselorTempo Health Check Script
 * Verifies all critical systems are operational
 */

const https = require('https');

const BASE_URL = 'https://santana-ai-counselor.vercel.app';

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function runHealthCheck() {
  console.log('🔍 CounselorTempo Health Check Starting...\n');
  
  const tests = [
    {
      name: 'API Health Endpoint',
      url: `${BASE_URL}/api/health`,
      check: (data) => data.success === true
    },
    {
      name: 'Environment Variables',
      url: `${BASE_URL}/api/health`,
      check: (data) => {
        const vars = data.data?.environment_variables;
        return vars?.DATABASE_URL && vars?.JWT_SECRET && vars?.FRONTEND_URL;
      }
    },
    {
      name: 'API Index',
      url: `${BASE_URL}/api`,
      check: (data) => data.success === true && data.message === 'CounselorTempo API'
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const data = await fetchJson(test.url);
      const passed = test.check(data);
      
      if (passed) {
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      allPassed = false;
    }
    console.log('');
  }

  if (allPassed) {
    console.log('🎉 All health checks PASSED! Application is fully operational.');
    process.exit(0);
  } else {
    console.log('🚨 Some health checks FAILED! Please investigate.');
    process.exit(1);
  }
}

runHealthCheck().catch(console.error);
