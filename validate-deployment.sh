#!/bin/bash

# CounselorTempo Comprehensive Deployment Validation
# Runs all validation checks before deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${CYAN}🧪 $1${NC}"
    echo -e "${BLUE}$(printf '=%.0s' $(seq 1 ${#1}))====${NC}"
}

print_step() {
    echo -e "\n${BLUE}🔍 $1...${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main validation function
main() {
    print_header "CounselorTempo Deployment Validation"
    
    local validation_passed=true
    local warnings=0
    
    # Step 1: Prerequisites Check
    print_step "Checking Prerequisites"
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        validation_passed=false
    else
        print_success "Node.js is available"
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        validation_passed=false
    else
        print_success "npm is available"
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        validation_passed=false
    else
        print_success "package.json found"
    fi
    
    # Step 2: Environment Variables Validation
    print_step "Validating Environment Variables"
    
    if node scripts/validate-env-vars.js; then
        print_success "Environment variables validation passed"
    else
        print_error "Environment variables validation failed"
        validation_passed=false
    fi
    
    # Step 3: Database URL Validation
    print_step "Validating Database URL"
    
    if [ -n "$DATABASE_URL" ]; then
        if node scripts/validate-database-url.js "$DATABASE_URL"; then
            print_success "Database URL validation passed"
        else
            print_error "Database URL validation failed"
            validation_passed=false
        fi
    else
        print_warning "DATABASE_URL not set - skipping database validation"
        ((warnings++))
    fi
    
    # Step 4: Build Process Testing
    print_step "Testing Build Process"
    
    if node scripts/test-build-process.js; then
        print_success "Build process testing passed"
    else
        print_error "Build process testing failed"
        validation_passed=false
    fi
    
    # Step 5: Pre-commit Validation
    print_step "Running Pre-commit Validation"
    
    if node scripts/pre-commit-validation.js; then
        print_success "Pre-commit validation passed"
    else
        print_error "Pre-commit validation failed"
        validation_passed=false
    fi
    
    # Step 6: Final Report
    print_header "Validation Report"
    
    if [ "$validation_passed" = true ]; then
        print_success "🎉 All validation checks passed!"
        
        if [ $warnings -gt 0 ]; then
            print_warning "Found $warnings warning(s) - consider addressing them"
        fi
        
        echo -e "\n${GREEN}✅ Your CounselorTempo application is ready for deployment!${NC}"
        echo -e "\n${CYAN}Next steps:${NC}"
        echo -e "${BLUE}1. Commit your changes: git add . && git commit -m 'Ready for deployment'${NC}"
        echo -e "${BLUE}2. Push to GitHub: git push origin main${NC}"
        echo -e "${BLUE}3. Deploy to Vercel: Import from GitHub or use CLI${NC}"
        echo -e "${BLUE}4. Set environment variables in Vercel dashboard${NC}"
        echo -e "${BLUE}5. Test your deployed application${NC}"
        
    else
        print_error "❌ Validation failed - please fix the issues before deployment"
        echo -e "\n${YELLOW}💡 To fix issues:${NC}"
        echo -e "${BLUE}1. Review the error messages above${NC}"
        echo -e "${BLUE}2. Fix the failing validation checks${NC}"
        echo -e "${BLUE}3. Run this script again: ./validate-deployment.sh${NC}"
        echo -e "${BLUE}4. Refer to DEPLOYMENT_VALIDATION_CHECKLIST.md for detailed guidance${NC}"
    fi
    
    # Exit with appropriate code
    if [ "$validation_passed" = true ]; then
        exit 0
    else
        exit 1
    fi
}

# Help function
show_help() {
    echo -e "${CYAN}CounselorTempo Deployment Validation Script${NC}"
    echo -e "${BLUE}==========================================${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  --env-template Generate environment variables template"
    echo "  --db-only      Run only database validation"
    echo "  --build-only   Run only build process testing"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all validation checks"
    echo "  $0 --env-template     # Generate environment variables template"
    echo "  $0 --db-only          # Test only database connectivity"
    echo "  $0 --build-only       # Test only build process"
    echo ""
    echo "For detailed guidance, see: DEPLOYMENT_VALIDATION_CHECKLIST.md"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    --env-template)
        print_header "Environment Variables Template"
        node scripts/validate-env-vars.js --template
        exit 0
        ;;
    --db-only)
        print_header "Database Validation Only"
        if [ -n "$DATABASE_URL" ]; then
            node scripts/validate-database-url.js "$DATABASE_URL"
        else
            print_error "DATABASE_URL not set"
            exit 1
        fi
        exit 0
        ;;
    --build-only)
        print_header "Build Process Testing Only"
        node scripts/test-build-process.js
        exit $?
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}Unknown option: $1${NC}"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
