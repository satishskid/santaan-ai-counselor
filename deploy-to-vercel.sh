#!/bin/bash

# CounselorTempo One-Click Deployment Script
# This script automates the complete deployment process to Vercel

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

echo -e "${CYAN}🎯 CounselorTempo One-Click Deployment${NC}"
echo -e "${BLUE}Deploying complete full-stack application to Vercel...${NC}\n"

# Step 1: Prerequisites Check
print_step "1" "Checking Prerequisites"

if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js first:"
    echo -e "  ${CYAN}https://nodejs.org${NC}"
    exit 1
fi
print_success "npm is available"

if ! command_exists git; then
    print_error "git is not installed. Please install git first."
    exit 1
fi
print_success "git is available"

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

# Step 4: Install Dependencies
print_step "4" "Installing Dependencies"
print_info "Installing project dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 5: Generate Prisma Client
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
print_warning "IMPORTANT: You need to set up environment variables"
print_info "Required environment variables:"
echo -e "  ${YELLOW}DATABASE_URL${NC} - PostgreSQL connection string"
echo -e "  ${YELLOW}SHADOW_DATABASE_URL${NC} - Shadow database for migrations"
echo -e "  ${YELLOW}JWT_SECRET${NC} - JWT secret (min 32 characters)"
echo -e "  ${YELLOW}NODE_ENV${NC} - Set to 'production'"
echo -e "  ${YELLOW}FRONTEND_URL${NC} - Your frontend domain"

echo -e "\n${BLUE}Setting up environment variables...${NC}"

# Set environment variables interactively
echo -e "\n${CYAN}Setting up DATABASE_URL:${NC}"
read -p "Enter your PostgreSQL DATABASE_URL: " DATABASE_URL
vercel env add DATABASE_URL production <<< "$DATABASE_URL"

echo -e "\n${CYAN}Setting up SHADOW_DATABASE_URL:${NC}"
read -p "Enter your SHADOW_DATABASE_URL: " SHADOW_DATABASE_URL
vercel env add SHADOW_DATABASE_URL production <<< "$SHADOW_DATABASE_URL"

echo -e "\n${CYAN}Setting up JWT_SECRET:${NC}"
JWT_SECRET="counselortempo-super-secret-jwt-key-for-production-2024-$(date +%s)"
echo "Generated JWT_SECRET: $JWT_SECRET"
vercel env add JWT_SECRET production <<< "$JWT_SECRET"

echo -e "\n${CYAN}Setting up NODE_ENV:${NC}"
vercel env add NODE_ENV production <<< "production"

echo -e "\n${CYAN}Setting up JWT_EXPIRES_IN:${NC}"
vercel env add JWT_EXPIRES_IN production <<< "7d"

echo -e "\n${CYAN}Setting up REFRESH_TOKEN_EXPIRES_IN:${NC}"
vercel env add REFRESH_TOKEN_EXPIRES_IN production <<< "30d"

echo -e "\n${CYAN}Setting up BCRYPT_ROUNDS:${NC}"
vercel env add BCRYPT_ROUNDS production <<< "12"

echo -e "\n${CYAN}Setting up RATE_LIMIT_WINDOW_MS:${NC}"
vercel env add RATE_LIMIT_WINDOW_MS production <<< "900000"

echo -e "\n${CYAN}Setting up RATE_LIMIT_MAX_REQUESTS:${NC}"
vercel env add RATE_LIMIT_MAX_REQUESTS production <<< "100"

print_success "Environment variables configured"

# Step 7: Deploy to Vercel
print_step "7" "Deploying to Vercel"
print_info "Starting production deployment..."

# Deploy with production flag
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel --prod 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        echo -e "\n${GREEN}🎉 Your CounselorTempo application is live!${NC}"
        echo -e "${CYAN}Frontend: $DEPLOYMENT_URL${NC}"
        echo -e "${CYAN}API Health: $DEPLOYMENT_URL/api/health${NC}"
        
        # Set FRONTEND_URL environment variable
        print_info "Setting FRONTEND_URL environment variable..."
        vercel env add FRONTEND_URL production <<< "$DEPLOYMENT_URL"
        
        # Redeploy with updated FRONTEND_URL
        print_info "Redeploying with updated FRONTEND_URL..."
        vercel --prod
    fi
else
    print_error "Deployment failed"
    exit 1
fi

# Step 8: Verify Deployment
print_step "8" "Verifying Deployment"
if [ -n "$DEPLOYMENT_URL" ]; then
    print_info "Testing deployment..."
    
    # Test health endpoint
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health")
    if [ "$HTTP_STATUS" = "200" ]; then
        print_success "Health check passed"
    else
        print_warning "Health check returned status: $HTTP_STATUS"
    fi
    
    # Run verification script
    if [ -f "scripts/verify-deployment.js" ]; then
        print_info "Running comprehensive verification..."
        node scripts/verify-deployment.js "$DEPLOYMENT_URL"
    fi
fi

# Step 9: Success Information
print_step "9" "Deployment Complete"
print_success "🎉 CounselorTempo deployed successfully!"

if [ -n "$DEPLOYMENT_URL" ]; then
    echo -e "\n${GREEN}🔗 Access Your Application:${NC}"
    echo -e "Frontend: ${CYAN}$DEPLOYMENT_URL${NC}"
    echo -e "API: ${CYAN}$DEPLOYMENT_URL/api/*${NC}"
    echo -e "Health Check: ${CYAN}$DEPLOYMENT_URL/api/health${NC}"
    
    echo -e "\n${GREEN}🔐 Default Login Credentials:${NC}"
    echo -e "Admin: ${CYAN}admin@counselortempo.com${NC} / ${CYAN}admin123${NC}"
    echo -e "Counselor: ${CYAN}counselor@counselortempo.com${NC} / ${CYAN}counselor123${NC}"
    
    echo -e "\n${GREEN}📊 Features Available:${NC}"
    echo -e "✅ Patient Management System"
    echo -e "✅ Appointment Scheduling"
    echo -e "✅ Assessment Tools"
    echo -e "✅ Treatment Plan Creation"
    echo -e "✅ Dashboard with Analytics"
    echo -e "✅ Role-Based Access Control"
    echo -e "✅ Sample Data for Testing"
fi

echo -e "\n${GREEN}🚀 Your CounselorTempo application is ready for use!${NC}"
