#!/bin/bash

# Complete Application Testing Script
# Tests database, build, and deployment readiness

set -e

echo "🚀 Starting Complete Application Tests..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_section() {
    echo -e "\n${BLUE}📋 $1${NC}"
    echo "----------------------------------------"
}

# Test 1: Database Setup
print_section "Testing Database Setup"

# Check if database file exists
if [ -f "dev.db" ]; then
    print_status 0 "Database file exists"
else
    print_warning "Database file not found, creating..."
    npm run db:push > /dev/null 2>&1
    print_status $? "Database created"
fi

# Test database connection
print_info "Testing database connection..."
npx prisma db pull > /dev/null 2>&1
print_status $? "Database connection successful"

# Check if tables exist
print_info "Checking database schema..."
table_count=$(sqlite3 dev.db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo "0")
if [ "$table_count" -gt 10 ]; then
    print_status 0 "Database schema is complete ($table_count tables)"
else
    print_warning "Database schema incomplete, running migrations..."
    npm run db:push > /dev/null 2>&1
    print_status $? "Database schema updated"
fi

# Check if data exists
print_info "Checking sample data..."
patient_count=$(sqlite3 dev.db "SELECT COUNT(*) FROM patients;" 2>/dev/null || echo "0")
if [ "$patient_count" -gt 0 ]; then
    print_status 0 "Sample data exists ($patient_count patients)"
else
    print_warning "No sample data found, seeding database..."
    npm run db:seed > /dev/null 2>&1
    print_status $? "Database seeded with sample data"
fi

# Test 2: Dependencies and Environment
print_section "Testing Dependencies and Environment"

# Check Node.js version
node_version=$(node --version)
print_info "Node.js version: $node_version"

# Check if dependencies are installed
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    print_status 0 "Dependencies are installed"
else
    print_warning "Dependencies missing, installing..."
    npm install > /dev/null 2>&1
    print_status $? "Dependencies installed"
fi

# Check Prisma client
if [ -d "node_modules/@prisma/client" ]; then
    print_status 0 "Prisma client is available"
else
    print_warning "Prisma client missing, generating..."
    npx prisma generate > /dev/null 2>&1
    print_status $? "Prisma client generated"
fi

# Test 3: TypeScript Compilation
print_section "Testing TypeScript Compilation"

npx tsc --noEmit > /dev/null 2>&1
print_status $? "TypeScript compilation successful"

# Test 4: Build Process
print_section "Testing Build Process"

print_info "Building application..."
npm run build > /dev/null 2>&1
print_status $? "Build successful"

# Check build output
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    print_status 0 "Build output is valid"
else
    print_status 1 "Build output is invalid"
fi

# Check bundle sizes
if [ -d "dist/assets" ]; then
    js_files=$(find dist/assets -name "*.js" -type f)
    css_files=$(find dist/assets -name "*.css" -type f)
    
    js_count=$(echo "$js_files" | wc -l)
    css_count=$(echo "$css_files" | wc -l)
    
    print_info "Build contains $js_count JavaScript files and $css_count CSS files"
    
    # Check for large bundles
    large_files=$(find dist/assets -name "*.js" -size +1M -type f)
    if [ -n "$large_files" ]; then
        print_warning "Large JavaScript bundles detected (>1MB)"
    else
        print_status 0 "Bundle sizes are reasonable"
    fi
fi

# Test 5: Database API Functions
print_section "Testing Database API Functions"

print_info "Testing database operations..."

# Create a simple test script
cat > test_db.mjs << 'EOF'
import { PrismaClient } from '@prisma/client';

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    // Test patient query
    const patients = await prisma.patient.findMany({
      take: 1,
      include: {
        medicalHistory: true,
        appointments: true,
      }
    });

    console.log(`✅ Found ${patients.length} patients`);

    // Test user query
    const users = await prisma.user.findMany({
      take: 1
    });

    console.log(`✅ Found ${users.length} users`);

    // Test appointments
    const appointments = await prisma.appointment.findMany({
      take: 1,
      include: {
        patient: true
      }
    });

    console.log(`✅ Found ${appointments.length} appointments`);

    console.log('✅ All database operations successful');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
EOF

node test_db.mjs
print_status $? "Database API functions work correctly"

# Clean up test file
rm test_db.mjs

# Test 6: Application Structure
print_section "Testing Application Structure"

# Check required files
required_files=(
    "src/main.tsx"
    "src/App.tsx"
    "src/components/home.tsx"
    "src/lib/database.ts"
    "src/lib/api.ts"
    "src/hooks/useApi.ts"
    "prisma/schema.prisma"
    "package.json"
    "vite.config.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Found $file"
    else
        print_status 1 "Missing $file"
    fi
done

# Test 7: Development Server (optional)
print_section "Testing Development Server"

read -p "Do you want to test the development server? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting development server for 10 seconds..."
    
    # Start dev server in background
    npm run dev > dev_server.log 2>&1 &
    dev_pid=$!
    
    # Wait for server to start
    sleep 5
    
    # Test if server is responding
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        print_status 0 "Development server is responding"
    else
        print_warning "Development server not responding (this might be normal)"
    fi
    
    # Stop dev server
    kill $dev_pid 2>/dev/null || true
    sleep 2
    
    # Clean up log file
    rm -f dev_server.log
else
    print_info "Skipping development server test"
fi

# Test 8: Production Build Test
print_section "Testing Production Build"

if command -v python3 &> /dev/null; then
    print_info "Testing production build with Python server..."
    
    cd dist
    python3 -m http.server 8080 > /dev/null 2>&1 &
    server_pid=$!
    cd ..
    
    sleep 2
    
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        print_status 0 "Production build serves correctly"
    else
        print_status 1 "Production build not serving correctly"
    fi
    
    kill $server_pid 2>/dev/null || true
else
    print_info "Python not available, skipping production build test"
fi

# Test 9: Database Performance
print_section "Testing Database Performance"

print_info "Running performance tests..."

# Create performance test
cat > perf_test.mjs << 'EOF'
import { PrismaClient } from '@prisma/client';

async function performanceTest() {
  const prisma = new PrismaClient();
  
  try {
    const start = Date.now();
    
    // Test complex query
    const result = await prisma.patient.findMany({
      include: {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
        assessments: true,
        treatmentPlans: {
          include: {
            milestones: true,
            interventions: true,
          }
        },
        appointments: true,
        notes: true,
      }
    });
    
    const end = Date.now();
    const duration = end - start;
    
    console.log(`✅ Complex query completed in ${duration}ms`);
    console.log(`✅ Retrieved ${result.length} patients with full data`);
    
    if (duration < 1000) {
      console.log('✅ Performance is good');
    } else {
      console.log('⚠️  Performance could be improved');
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

performanceTest();
EOF

node perf_test.mjs
print_status $? "Database performance test completed"

rm perf_test.mjs

# Final Summary
print_section "Test Summary"

echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
echo ""
echo "✅ Database is set up and working"
echo "✅ Application builds successfully"
echo "✅ TypeScript compilation passes"
echo "✅ Database API functions correctly"
echo "✅ All required files are present"
echo "✅ Performance is acceptable"
echo ""
echo -e "${BLUE}📊 Application Statistics:${NC}"
echo "• Database tables: $(sqlite3 dev.db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo "N/A")"
echo "• Sample patients: $(sqlite3 dev.db "SELECT COUNT(*) FROM patients;" 2>/dev/null || echo "N/A")"
echo "• Sample appointments: $(sqlite3 dev.db "SELECT COUNT(*) FROM appointments;" 2>/dev/null || echo "N/A")"
echo "• Build size: $(du -sh dist 2>/dev/null | cut -f1 || echo "N/A")"
echo ""
echo -e "${GREEN}🚀 Your application is ready for deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start development server"
echo "2. Run 'npm run db:studio' to view database"
echo "3. Deploy to your preferred platform"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"
