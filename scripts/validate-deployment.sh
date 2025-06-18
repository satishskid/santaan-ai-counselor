#!/bin/bash

# Deployment Validation Script
# Validates that all requirements are met before deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((FAILED++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_section() {
    echo -e "\n${CYAN}$1${NC}"
}

# Check if file exists
check_file() {
    if [ -f "$1" ]; then
        print_status 0 "$2"
        return 0
    else
        print_status 1 "$2 (missing: $1)"
        return 1
    fi
}

# Check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        print_status 0 "$2"
        return 0
    else
        print_status 1 "$2 (missing: $1)"
        return 1
    fi
}

# Main validation
echo -e "${CYAN}🔍 Starting Deployment Validation...${NC}\n"

# Check directory structure
print_section "📁 Checking directory structure..."
check_dir "api" "API directory"
check_dir "api/_lib" "API utilities directory"
check_dir "api/auth" "Authentication endpoints directory"
check_dir "api/patients" "Patients endpoints directory"
check_dir "api/appointments" "Appointments endpoints directory"
check_dir "api/assessments" "Assessments endpoints directory"
check_dir "api/treatment-plans" "Treatment plans endpoints directory"
check_dir "api/dashboard" "Dashboard endpoints directory"
check_dir "api/emr" "EMR integration endpoints directory"
check_dir "prisma" "Prisma directory"

# Check required configuration files
print_section "📄 Checking configuration files..."
check_file "vercel.json" "Vercel configuration"
check_file "package.json" "Package configuration"
check_file "prisma/schema.prisma" "Prisma schema"
check_file ".env.example" "Environment example"
check_file "API_DOCUMENTATION.md" "API documentation"
check_file "DEPLOYMENT_CHECKLIST.md" "Deployment checklist"

# Check API endpoint files
print_section "🔗 Checking API endpoint files..."
check_file "api/health.ts" "Health check endpoint"
check_file "api/auth/login.ts" "Login endpoint"
check_file "api/auth/register.ts" "Register endpoint"
check_file "api/auth/refresh.ts" "Token refresh endpoint"
check_file "api/auth/logout.ts" "Logout endpoint"
check_file "api/auth/me.ts" "User profile endpoint"
check_file "api/patients/index.ts" "Patients list endpoint"
check_file "api/patients/[id].ts" "Patient detail endpoint"
check_file "api/appointments/index.ts" "Appointments endpoint"
check_file "api/assessments/index.ts" "Assessments endpoint"
check_file "api/treatment-plans/index.ts" "Treatment plans endpoint"
check_file "api/dashboard/stats.ts" "Dashboard stats endpoint"
check_file "api/emr/test-connection.ts" "EMR test endpoint"
check_file "api/emr/patients/[patientId].ts" "EMR patient endpoint"

# Check utility files
print_section "🛠️  Checking utility files..."
check_file "api/_lib/database.ts" "Database utilities"
check_file "api/_lib/middleware.ts" "Middleware utilities"
check_file "api/_lib/auth.ts" "Authentication utilities"
check_file "api/_lib/validation.ts" "Validation schemas"
check_file "api/_lib/env.ts" "Environment validation"

# Check package.json dependencies
print_section "📦 Checking package.json dependencies..."
if [ -f "package.json" ]; then
    # Check for required dependencies
    if grep -q '"@prisma/client"' package.json; then
        print_status 0 "Prisma client dependency"
    else
        print_status 1 "Prisma client dependency"
    fi
    
    if grep -q '"jsonwebtoken"' package.json; then
        print_status 0 "JWT dependency"
    else
        print_status 1 "JWT dependency"
    fi
    
    if grep -q '"bcryptjs"' package.json; then
        print_status 0 "Bcrypt dependency"
    else
        print_status 1 "Bcrypt dependency"
    fi
    
    if grep -q '"express-rate-limit"' package.json; then
        print_status 0 "Rate limiting dependency"
    else
        print_status 1 "Rate limiting dependency"
    fi
    
    if grep -q '"cors"' package.json; then
        print_status 0 "CORS dependency"
    else
        print_status 1 "CORS dependency"
    fi
    
    if grep -q '"zod"' package.json; then
        print_status 0 "Zod validation dependency"
    else
        print_status 1 "Zod validation dependency"
    fi
else
    print_status 1 "Package.json file"
fi

# Check Vercel configuration
print_section "⚡ Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    if grep -q '"version": 2' vercel.json; then
        print_status 0 "Vercel version 2"
    else
        print_status 1 "Vercel version 2"
    fi
    
    if grep -q '"api/\*\*/\*.ts"' vercel.json; then
        print_status 0 "API functions configuration"
    else
        print_status 1 "API functions configuration"
    fi
    
    if grep -q '"routes"' vercel.json; then
        print_status 0 "Route configuration"
    else
        print_warning "Route configuration (recommended)"
    fi
    
    if grep -q '"headers"' vercel.json; then
        print_status 0 "Security headers configuration"
    else
        print_warning "Security headers configuration (recommended)"
    fi
else
    print_status 1 "Vercel configuration file"
fi

# Check Prisma schema
print_section "🗄️  Checking Prisma schema..."
if [ -f "prisma/schema.prisma" ]; then
    if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
        print_status 0 "PostgreSQL database provider"
    else
        print_status 1 "PostgreSQL database provider (required for production)"
    fi
    
    if grep -q 'shadowDatabaseUrl' prisma/schema.prisma; then
        print_status 0 "Shadow database configuration"
    else
        print_warning "Shadow database configuration (recommended for migrations)"
    fi
    
    # Check for required models
    if grep -q 'model User' prisma/schema.prisma; then
        print_status 0 "User model"
    else
        print_status 1 "User model"
    fi
    
    if grep -q 'model Patient' prisma/schema.prisma; then
        print_status 0 "Patient model"
    else
        print_status 1 "Patient model"
    fi
    
    if grep -q 'model Appointment' prisma/schema.prisma; then
        print_status 0 "Appointment model"
    else
        print_status 1 "Appointment model"
    fi
else
    print_status 1 "Prisma schema file"
fi

# Check environment configuration
print_section "🔧 Checking environment configuration..."
if [ -f ".env.example" ]; then
    if grep -q 'DATABASE_URL' .env.example; then
        print_status 0 "DATABASE_URL documented"
    else
        print_status 1 "DATABASE_URL documented"
    fi
    
    if grep -q 'JWT_SECRET' .env.example; then
        print_status 0 "JWT_SECRET documented"
    else
        print_status 1 "JWT_SECRET documented"
    fi
    
    if grep -q 'NODE_ENV' .env.example; then
        print_status 0 "NODE_ENV documented"
    else
        print_status 1 "NODE_ENV documented"
    fi
    
    if grep -q 'FRONTEND_URL' .env.example; then
        print_status 0 "FRONTEND_URL documented"
    else
        print_status 1 "FRONTEND_URL documented"
    fi
    
    if grep -q '32' .env.example || grep -q 'min-32' .env.example; then
        print_status 0 "JWT secret length guidance"
    else
        print_warning "JWT secret length guidance (should specify minimum 32 characters)"
    fi
else
    print_status 1 "Environment example file"
fi

# Check API documentation
print_section "📚 Checking API documentation..."
if [ -f "API_DOCUMENTATION.md" ]; then
    if grep -q '## Authentication' API_DOCUMENTATION.md; then
        print_status 0 "Authentication documentation"
    else
        print_status 1 "Authentication documentation"
    fi
    
    if grep -q '## Error Handling' API_DOCUMENTATION.md; then
        print_status 0 "Error handling documentation"
    else
        print_status 1 "Error handling documentation"
    fi
    
    if grep -q '## Rate Limiting' API_DOCUMENTATION.md; then
        print_status 0 "Rate limiting documentation"
    else
        print_status 1 "Rate limiting documentation"
    fi
    
    # Count JSON examples
    JSON_COUNT=$(grep -c '```json' API_DOCUMENTATION.md 2>/dev/null || echo "0")
    if [ "$JSON_COUNT" -gt 10 ]; then
        print_status 0 "API examples ($JSON_COUNT JSON examples)"
    else
        print_warning "API examples (only $JSON_COUNT JSON examples, recommend more)"
    fi
else
    print_status 1 "API documentation file"
fi

# Print summary
echo -e "\n${BLUE}📊 Validation Summary:${NC}"
TOTAL=$((PASSED + FAILED))
echo -e "${GREEN}✅ Passed: $PASSED/$TOTAL${NC}"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
fi
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED/$TOTAL${NC}"
fi

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Deployment validation passed!${NC}"
    echo -e "${GREEN}✅ All critical requirements are met${NC}"
    echo -e "${GREEN}✅ Ready for Vercel deployment${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "\n${YELLOW}⚠️  Note: There are $WARNINGS warnings (recommended fixes)${NC}"
    fi
    
    echo -e "\n${BLUE}Next steps:${NC}"
    echo -e "1. Set up PostgreSQL database (Vercel Postgres, Supabase, or PlanetScale)"
    echo -e "2. Configure environment variables in Vercel dashboard"
    echo -e "3. Deploy to Vercel"
    echo -e "4. Run post-deployment tests"
    
    exit 0
else
    echo -e "\n${RED}❌ Deployment validation failed!${NC}"
    echo -e "${RED}Please fix the $FAILED error(s) above before deployment.${NC}"
    exit 1
fi
