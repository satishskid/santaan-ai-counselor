#!/bin/bash

# Santaan Counselor - Deployment Testing Script
# This script tests the application for deployment readiness

set -e

echo "🚀 Starting Santaan Counselor Deployment Tests..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
    echo -e "ℹ️  $1"
}

# Check if required files exist
echo "📁 Checking required files..."
required_files=(
    "package.json"
    "vite.config.ts"
    "src/main.tsx"
    "src/App.tsx"
    "src/lib/supabase.ts"
    "src/types/supabase.ts"
    ".env.example"
    "supabase/migrations/001_initial_schema.sql"
    "supabase/seed.sql"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Found $file"
    else
        print_status 1 "Missing $file"
    fi
done

# Check if .env file exists
if [ -f ".env" ]; then
    print_status 0 "Environment file (.env) exists"
    
    # Check if required environment variables are set
    echo "🔧 Checking environment variables..."
    required_vars=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env && ! grep -q "^$var=your_" .env; then
            print_status 0 "$var is configured"
        else
            print_warning "$var needs to be configured in .env file"
        fi
    done
else
    print_warning "No .env file found. Copy .env.example to .env and configure it."
fi

# Check Node.js and npm versions
echo "🔍 Checking Node.js environment..."
node_version=$(node --version)
npm_version=$(npm --version)
print_info "Node.js version: $node_version"
print_info "npm version: $npm_version"

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies are installed"
else
    print_warning "Dependencies not installed. Running npm install..."
    npm install
    print_status $? "Dependencies installed"
fi

# Run TypeScript compilation
echo "🔨 Running TypeScript compilation..."
npx tsc --noEmit
print_status $? "TypeScript compilation successful"

# Run linting
echo "🧹 Running ESLint..."
npm run lint
print_status $? "Linting passed"

# Run tests
echo "🧪 Running tests..."
npm run test:run
print_status $? "All tests passed"

# Build the application
echo "🏗️  Building application..."
npm run build
print_status $? "Build successful"

# Check if build output exists
if [ -d "dist" ]; then
    print_status 0 "Build output directory exists"
    
    # Check if essential files are in build output
    essential_build_files=("dist/index.html" "dist/assets")
    for file in "${essential_build_files[@]}"; do
        if [ -e "$file" ]; then
            print_status 0 "Build contains $file"
        else
            print_status 1 "Build missing $file"
        fi
    done
else
    print_status 1 "Build output directory not found"
fi

# Check bundle size
if [ -d "dist/assets" ]; then
    echo "📊 Analyzing bundle size..."
    js_files=$(find dist/assets -name "*.js" -type f)
    css_files=$(find dist/assets -name "*.css" -type f)
    
    total_js_size=0
    for file in $js_files; do
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        total_js_size=$((total_js_size + size))
    done
    
    total_css_size=0
    for file in $css_files; do
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        total_css_size=$((total_css_size + size))
    done
    
    js_size_mb=$(echo "scale=2; $total_js_size / 1024 / 1024" | bc -l 2>/dev/null || echo "N/A")
    css_size_mb=$(echo "scale=2; $total_css_size / 1024 / 1024" | bc -l 2>/dev/null || echo "N/A")
    
    print_info "JavaScript bundle size: ${js_size_mb} MB"
    print_info "CSS bundle size: ${css_size_mb} MB"
    
    # Warn if bundles are too large
    if [ "$js_size_mb" != "N/A" ] && [ "$(echo "$js_size_mb > 2" | bc -l 2>/dev/null || echo 0)" -eq 1 ]; then
        print_warning "JavaScript bundle is large (${js_size_mb} MB). Consider code splitting."
    fi
fi

# Test if the built application can be served
echo "🌐 Testing built application..."
if command -v python3 &> /dev/null; then
    print_info "Starting test server with Python..."
    cd dist
    python3 -m http.server 8080 &
    server_pid=$!
    cd ..
    sleep 2
    
    # Test if server responds
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        print_status 0 "Test server responds correctly"
    else
        print_status 1 "Test server not responding"
    fi
    
    # Kill test server
    kill $server_pid 2>/dev/null || true
elif command -v npx &> /dev/null && command -v serve &> /dev/null; then
    print_info "Testing with serve..."
    npx serve -s dist -p 8080 &
    server_pid=$!
    sleep 2
    
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        print_status 0 "Test server responds correctly"
    else
        print_status 1 "Test server not responding"
    fi
    
    kill $server_pid 2>/dev/null || true
else
    print_warning "Cannot test built application (no Python or serve available)"
fi

# Check Docker setup if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Checking Docker setup..."
    if [ -f "Dockerfile" ]; then
        print_status 0 "Dockerfile exists"
        
        # Test Docker build (optional, can be slow)
        read -p "Do you want to test Docker build? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Building Docker image..."
            docker build -t counselor-test . --quiet
            print_status $? "Docker build successful"
            
            # Clean up test image
            docker rmi counselor-test > /dev/null 2>&1 || true
        fi
    else
        print_warning "Dockerfile not found"
    fi
else
    print_info "Docker not available, skipping Docker tests"
fi

# Security checks
echo "🔒 Running security checks..."

# Check for sensitive files in build
sensitive_patterns=(".env" "*.key" "*.pem" "config.json")
found_sensitive=false

for pattern in "${sensitive_patterns[@]}"; do
    if find dist -name "$pattern" -type f 2>/dev/null | grep -q .; then
        print_warning "Found sensitive files matching $pattern in build output"
        found_sensitive=true
    fi
done

if [ "$found_sensitive" = false ]; then
    print_status 0 "No sensitive files found in build output"
fi

# Check for hardcoded secrets in source code
echo "🔍 Checking for hardcoded secrets..."
secret_patterns=("password" "secret" "key.*=" "token.*=")
found_secrets=false

for pattern in "${secret_patterns[@]}"; do
    if grep -r -i "$pattern" src/ --include="*.ts" --include="*.tsx" | grep -v "// TODO" | grep -v "// FIXME" | grep -q .; then
        print_warning "Potential hardcoded secrets found (pattern: $pattern)"
        found_secrets=true
    fi
done

if [ "$found_secrets" = false ]; then
    print_status 0 "No obvious hardcoded secrets found"
fi

# Final summary
echo ""
echo "📋 Deployment Readiness Summary"
echo "================================"
print_status 0 "✅ Application builds successfully"
print_status 0 "✅ All tests pass"
print_status 0 "✅ TypeScript compilation successful"
print_status 0 "✅ Linting passes"
print_status 0 "✅ Build output is valid"

echo ""
echo "🎉 Deployment tests completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with actual Supabase credentials"
echo "2. Set up your Supabase database using the migration files"
echo "3. Deploy to your chosen platform (Vercel, Netlify, etc.)"
echo "4. Set up monitoring and error tracking"
echo ""
echo "For detailed deployment instructions, see DEPLOYMENT.md"
