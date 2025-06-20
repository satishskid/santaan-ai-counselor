import type { VercelRequest, VercelResponse } from 'next'

// Comprehensive testing suite for admin use
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const startTime = Date.now()
  const testResults = {
    timestamp: new Date().toISOString(),
    test_suite_version: '1.0.0',
    execution_time: 0,
    overall_status: 'running',
    total_tests: 0,
    passed_tests: 0,
    failed_tests: 0,
    skipped_tests: 0,
    test_categories: {
      api_endpoints: { status: 'pending', tests: [] },
      database: { status: 'pending', tests: [] },
      authentication: { status: 'pending', tests: [] },
      file_system: { status: 'pending', tests: [] },
      environment: { status: 'pending', tests: [] }
    },
    detailed_results: [],
    recommendations: [],
    system_health_score: 0
  }

  try {
    // Test 1: API Endpoints Testing
    console.log('🧪 Starting API Endpoints Testing...')
    const apiTests = await testApiEndpoints()
    testResults.test_categories.api_endpoints = apiTests
    testResults.detailed_results.push(...apiTests.tests)

    // Test 2: Database Testing
    console.log('🧪 Starting Database Testing...')
    const dbTests = await testDatabase()
    testResults.test_categories.database = dbTests
    testResults.detailed_results.push(...dbTests.tests)

    // Test 3: Authentication Testing
    console.log('🧪 Starting Authentication Testing...')
    const authTests = await testAuthentication()
    testResults.test_categories.authentication = authTests
    testResults.detailed_results.push(...authTests.tests)

    // Test 4: File System Testing
    console.log('🧪 Starting File System Testing...')
    const fsTests = await testFileSystem()
    testResults.test_categories.file_system = fsTests
    testResults.detailed_results.push(...fsTests.tests)

    // Test 5: Environment Testing
    console.log('🧪 Starting Environment Testing...')
    const envTests = await testEnvironment()
    testResults.test_categories.environment = envTests
    testResults.detailed_results.push(...envTests.tests)

    // Calculate overall results
    const allTests = testResults.detailed_results
    testResults.total_tests = allTests.length
    testResults.passed_tests = allTests.filter(t => t.status === 'passed').length
    testResults.failed_tests = allTests.filter(t => t.status === 'failed').length
    testResults.skipped_tests = allTests.filter(t => t.status === 'skipped').length

    // Calculate health score (0-100)
    testResults.system_health_score = testResults.total_tests > 0 
      ? Math.round((testResults.passed_tests / testResults.total_tests) * 100)
      : 0

    // Determine overall status
    if (testResults.failed_tests === 0) {
      testResults.overall_status = 'passed'
    } else if (testResults.passed_tests > testResults.failed_tests) {
      testResults.overall_status = 'warning'
    } else {
      testResults.overall_status = 'failed'
    }

    // Generate recommendations
    testResults.recommendations = generateRecommendations(testResults)

    testResults.execution_time = Date.now() - startTime

    res.status(200).json({
      success: true,
      data: testResults,
      meta: {
        endpoint: '/api/admin/testing-suite',
        admin_only: true,
        test_suite: true
      }
    })

  } catch (error) {
    testResults.overall_status = 'error'
    testResults.execution_time = Date.now() - startTime
    
    res.status(500).json({
      success: false,
      error: 'Testing suite execution failed',
      data: testResults,
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// API Endpoints Testing
async function testApiEndpoints() {
  const tests = []
  const endpoints = [
    { name: 'Health Check', path: '/api/health', method: 'GET', critical: true },
    { name: 'System Diagnostics', path: '/api/admin/system-diagnostics', method: 'GET', critical: true },
    { name: 'Settings API', path: '/api/settings', method: 'GET', critical: true },
    { name: 'Auth Login', path: '/api/auth/login', method: 'POST', critical: true },
    { name: 'Auth Register', path: '/api/auth/register', method: 'POST', critical: true },
    { name: 'Auth Me', path: '/api/auth/me', method: 'GET', critical: true },
    { name: 'Patients API', path: '/api/patients', method: 'GET', critical: false },
    { name: 'Appointments API', path: '/api/appointments', method: 'GET', critical: false },
    { name: 'Assessments API', path: '/api/assessments', method: 'GET', critical: false },
    { name: 'Treatment Plans API', path: '/api/treatment-plans', method: 'GET', critical: false }
  ]

  for (const endpoint of endpoints) {
    const testResult = {
      test_name: `API: ${endpoint.name}`,
      category: 'api_endpoints',
      status: 'running',
      details: '',
      error: null,
      execution_time: 0,
      critical: endpoint.critical
    }

    const testStart = Date.now()
    
    try {
      // Check if endpoint file exists
      const fs = require('fs')
      const path = require('path')
      
      let filePath = ''
      if (endpoint.path.includes('/admin/')) {
        filePath = path.join(process.cwd(), 'api', 'admin', endpoint.path.split('/').pop() + '.ts')
      } else if (endpoint.path.includes('/auth/')) {
        filePath = path.join(process.cwd(), 'api', 'auth', endpoint.path.split('/').pop() + '.ts')
      } else {
        const fileName = endpoint.path.replace('/api/', '') + '.ts'
        filePath = path.join(process.cwd(), 'api', fileName)
      }

      if (fs.existsSync(filePath)) {
        testResult.status = 'passed'
        testResult.details = `✅ Endpoint file exists at ${filePath}`
      } else {
        testResult.status = 'failed'
        testResult.details = `❌ Endpoint file missing at ${filePath}`
        testResult.error = 'File not found'
      }
    } catch (error) {
      testResult.status = 'failed'
      testResult.error = error instanceof Error ? error.message : 'Unknown error'
      testResult.details = `❌ Error checking endpoint: ${testResult.error}`
    }

    testResult.execution_time = Date.now() - testStart
    tests.push(testResult)
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length

  return {
    status: failedTests === 0 ? 'passed' : 'failed',
    passed: passedTests,
    failed: failedTests,
    total: tests.length,
    tests
  }
}

// Database Testing
async function testDatabase() {
  const tests = []
  
  const dbTest = {
    test_name: 'Database Connection',
    category: 'database',
    status: 'running',
    details: '',
    error: null,
    execution_time: 0,
    critical: true
  }

  const testStart = Date.now()

  try {
    if (!process.env.DATABASE_URL) {
      dbTest.status = 'failed'
      dbTest.details = '❌ DATABASE_URL environment variable not set'
      dbTest.error = 'Missing DATABASE_URL'
    } else {
      // Try to connect to database
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$queryRaw`SELECT 1 as test`
      await prisma.$disconnect()
      
      dbTest.status = 'passed'
      dbTest.details = '✅ Database connection successful'
    }
  } catch (error) {
    dbTest.status = 'failed'
    dbTest.error = error instanceof Error ? error.message : 'Unknown error'
    dbTest.details = `❌ Database connection failed: ${dbTest.error}`
  }

  dbTest.execution_time = Date.now() - testStart
  tests.push(dbTest)

  return {
    status: dbTest.status,
    passed: dbTest.status === 'passed' ? 1 : 0,
    failed: dbTest.status === 'failed' ? 1 : 0,
    total: 1,
    tests
  }
}

// Authentication Testing
async function testAuthentication() {
  const tests = []
  
  const jwtTest = {
    test_name: 'JWT Secret Configuration',
    category: 'authentication',
    status: 'running',
    details: '',
    error: null,
    execution_time: 0,
    critical: true
  }

  const testStart = Date.now()

  try {
    if (!process.env.JWT_SECRET) {
      jwtTest.status = 'failed'
      jwtTest.details = '❌ JWT_SECRET environment variable not set'
      jwtTest.error = 'Missing JWT_SECRET'
    } else if (process.env.JWT_SECRET.length < 32) {
      jwtTest.status = 'failed'
      jwtTest.details = '❌ JWT_SECRET is too short (minimum 32 characters)'
      jwtTest.error = 'Weak JWT_SECRET'
    } else {
      jwtTest.status = 'passed'
      jwtTest.details = `✅ JWT_SECRET configured (${process.env.JWT_SECRET.length} characters)`
    }
  } catch (error) {
    jwtTest.status = 'failed'
    jwtTest.error = error instanceof Error ? error.message : 'Unknown error'
    jwtTest.details = `❌ JWT configuration error: ${jwtTest.error}`
  }

  jwtTest.execution_time = Date.now() - testStart
  tests.push(jwtTest)

  return {
    status: jwtTest.status,
    passed: jwtTest.status === 'passed' ? 1 : 0,
    failed: jwtTest.status === 'failed' ? 1 : 0,
    total: 1,
    tests
  }
}

// File System Testing
async function testFileSystem() {
  const tests = []
  
  const fsTest = {
    test_name: 'API Directory Structure',
    category: 'file_system',
    status: 'running',
    details: '',
    error: null,
    execution_time: 0,
    critical: true
  }

  const testStart = Date.now()

  try {
    const fs = require('fs')
    const path = require('path')
    
    const apiPath = path.join(process.cwd(), 'api')
    if (!fs.existsSync(apiPath)) {
      fsTest.status = 'failed'
      fsTest.details = '❌ API directory not found'
      fsTest.error = 'Missing API directory'
    } else {
      const files = fs.readdirSync(apiPath, { recursive: true })
      const tsFiles = files.filter((f: string) => f.endsWith('.ts'))
      
      fsTest.status = 'passed'
      fsTest.details = `✅ API directory found with ${tsFiles.length} TypeScript files`
    }
  } catch (error) {
    fsTest.status = 'failed'
    fsTest.error = error instanceof Error ? error.message : 'Unknown error'
    fsTest.details = `❌ File system error: ${fsTest.error}`
  }

  fsTest.execution_time = Date.now() - testStart
  tests.push(fsTest)

  return {
    status: fsTest.status,
    passed: fsTest.status === 'passed' ? 1 : 0,
    failed: fsTest.status === 'failed' ? 1 : 0,
    total: 1,
    tests
  }
}

// Environment Testing
async function testEnvironment() {
  const tests = []
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET']
  const optionalVars = ['NODE_ENV', 'VERCEL_ENV', 'FRONTEND_URL']

  for (const varName of requiredVars) {
    const envTest = {
      test_name: `Environment: ${varName}`,
      category: 'environment',
      status: 'running',
      details: '',
      error: null,
      execution_time: 0,
      critical: true
    }

    const testStart = Date.now()

    if (process.env[varName]) {
      envTest.status = 'passed'
      envTest.details = `✅ ${varName} is set`
    } else {
      envTest.status = 'failed'
      envTest.details = `❌ ${varName} is missing`
      envTest.error = 'Missing required environment variable'
    }

    envTest.execution_time = Date.now() - testStart
    tests.push(envTest)
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length

  return {
    status: failedTests === 0 ? 'passed' : 'failed',
    passed: passedTests,
    failed: failedTests,
    total: tests.length,
    tests
  }
}

// Generate recommendations based on test results
function generateRecommendations(testResults: any) {
  const recommendations = []
  
  // Check for critical failures
  const criticalFailures = testResults.detailed_results.filter(
    (test: any) => test.critical && test.status === 'failed'
  )
  
  if (criticalFailures.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'critical_failures',
      title: 'Critical System Failures Detected',
      description: `${criticalFailures.length} critical components are failing`,
      action: 'Address critical failures immediately before proceeding with other fixes'
    })
  }

  // Check for missing API endpoints
  const missingEndpoints = testResults.detailed_results.filter(
    (test: any) => test.category === 'api_endpoints' && test.status === 'failed'
  )
  
  if (missingEndpoints.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'missing_endpoints',
      title: 'Missing API Endpoints',
      description: `${missingEndpoints.length} API endpoints are missing or inaccessible`,
      action: 'Create missing API endpoint files and verify routing configuration'
    })
  }

  // Check for environment issues
  const envFailures = testResults.detailed_results.filter(
    (test: any) => test.category === 'environment' && test.status === 'failed'
  )
  
  if (envFailures.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'environment',
      title: 'Environment Configuration Issues',
      description: `${envFailures.length} required environment variables are missing`,
      action: 'Configure missing environment variables in Vercel dashboard'
    })
  }

  return recommendations
}
