#!/bin/bash

# CounselorTempo Vercel Deployment Script
# This script handles the complete deployment process

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "\n${CYAN}🚀 Step $1: $2${NC}"
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${CYAN}🎯 CounselorTempo Backend Deployment${NC}"
echo -e "${BLUE}Deploying to Vercel with CLI...${NC}\n"

# Step 1: Check prerequisites
print_step "1" "Checking Prerequisites"

if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi
print_success "npm is installed"

if ! command_exists npx; then
    print_error "npx is not installed. Please install Node.js and npm first."
    exit 1
fi
print_success "npx is available"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi
print_success "Found package.json"

if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found. Please ensure Vercel configuration exists."
    exit 1
fi
print_success "Found vercel.json"

# Step 2: Install Vercel CLI
print_step "2" "Installing Vercel CLI"

if ! command_exists vercel; then
    print_info "Installing Vercel CLI globally..."
    npm install -g vercel
    if [ $? -eq 0 ]; then
        print_success "Vercel CLI installed successfully"
    else
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
else
    print_success "Vercel CLI is already installed"
fi

# Step 3: Login to Vercel
print_step "3" "Vercel Authentication"
print_info "Please login to your Vercel account..."
vercel login

if [ $? -eq 0 ]; then
    print_success "Successfully logged in to Vercel"
else
    print_error "Failed to login to Vercel"
    exit 1
fi

# Step 4: Install dependencies
print_step "4" "Installing Dependencies"
print_info "Installing project dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 5: Generate Prisma client
print_step "5" "Generating Prisma Client"
print_info "Generating Prisma client for production..."
npx prisma generate

if [ $? -eq 0 ]; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 6: Environment Variables Setup
print_step "6" "Environment Variables Setup"
print_warning "IMPORTANT: You need to set up environment variables in Vercel"
print_info "Required environment variables:"
echo -e "  ${YELLOW}DATABASE_URL${NC} - PostgreSQL connection string"
echo -e "  ${YELLOW}SHADOW_DATABASE_URL${NC} - Shadow database for migrations"
echo -e "  ${YELLOW}JWT_SECRET${NC} - JWT secret (min 32 characters)"
echo -e "  ${YELLOW}NODE_ENV${NC} - Set to 'production'"
echo -e "  ${YELLOW}FRONTEND_URL${NC} - Your frontend domain"

echo -e "\n${BLUE}You can set these in two ways:${NC}"
echo -e "1. Through Vercel Dashboard: https://vercel.com/dashboard"
echo -e "2. Using Vercel CLI: ${CYAN}vercel env add <NAME>${NC}"

read -p "Have you set up the required environment variables? (y/n): " env_setup
if [[ $env_setup != "y" && $env_setup != "Y" ]]; then
    print_warning "Please set up environment variables before continuing"
    print_info "You can continue the deployment after setting them up"
    exit 0
fi

# Step 7: Deploy to Vercel
print_step "7" "Deploying to Vercel"
print_info "Starting deployment..."

# Deploy with production flag
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
else
    print_error "Deployment failed"
    exit 1
fi

# Step 8: Database Migration
print_step "8" "Database Migration"
print_warning "IMPORTANT: Run database migrations after deployment"
print_info "You need to run these commands with your production DATABASE_URL:"
echo -e "  ${CYAN}npx prisma db push${NC} - Push schema to database"
echo -e "  ${CYAN}npx prisma generate${NC} - Generate client"

print_info "You can run migrations locally with production DATABASE_URL or use Vercel CLI:"
echo -e "  ${CYAN}vercel env pull .env.production${NC} - Pull production env vars"
echo -e "  ${CYAN}DATABASE_URL=\$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2) npx prisma db push${NC}"

# Step 9: Post-deployment testing
print_step "9" "Post-Deployment Testing"
print_info "After deployment, test these endpoints:"
echo -e "  ${GREEN}GET${NC} https://your-domain.vercel.app/api/health"
echo -e "  ${GREEN}POST${NC} https://your-domain.vercel.app/api/auth/register"
echo -e "  ${GREEN}POST${NC} https://your-domain.vercel.app/api/auth/login"

print_info "Use the testing script:"
echo -e "  ${CYAN}API_BASE_URL=https://your-domain.vercel.app node scripts/test-api-endpoints.js${NC}"

# Step 10: Success message
print_step "10" "Deployment Complete"
print_success "🎉 CounselorTempo backend deployed successfully!"
print_info "Next steps:"
echo -e "1. Set up your database (PostgreSQL)"
echo -e "2. Configure environment variables"
echo -e "3. Run database migrations"
echo -e "4. Test API endpoints"
echo -e "5. Update frontend API URLs"

print_info "Documentation:"
echo -e "  📚 API Documentation: ${CYAN}API_DOCUMENTATION.md${NC}"
echo -e "  📋 Deployment Checklist: ${CYAN}DEPLOYMENT_CHECKLIST.md${NC}"

echo -e "\n${GREEN}🚀 Your CounselorTempo backend is now live!${NC}"
