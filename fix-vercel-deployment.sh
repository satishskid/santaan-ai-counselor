#!/bin/bash

# Santaan AI Counselor - Vercel Deployment Fix Script
# This script fixes common deployment issues and deploys to Vercel

# Colors for output
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

echo -e "${CYAN}🎯 Santaan AI Counselor - Vercel Deployment Fix${NC}"
echo -e "${BLUE}Fixing common deployment issues and deploying...${NC}\n"

# Step 1: Check prerequisites
print_step "1" "Checking Prerequisites"

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

# Step 2: Install dependencies
print_step "2" "Installing Dependencies"
print_info "Installing project dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Generate Prisma client
print_step "3" "Generating Prisma Client"
print_info "Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 4: Build the project
print_step "4" "Building Project"
print_info "Building the project..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Project built successfully"
else
    print_error "Build failed. Please check the build logs."
    exit 1
fi

# Step 5: Install Vercel CLI if not present
print_step "5" "Vercel CLI Setup"

if ! command -v vercel &> /dev/null; then
    print_info "Installing Vercel CLI..."
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

# Step 6: Environment Variables Check
print_step "6" "Environment Variables Setup"
print_warning "CRITICAL: Ensure these environment variables are set in Vercel:"
echo -e "  ${YELLOW}DATABASE_URL${NC} - PostgreSQL connection string"
echo -e "  ${YELLOW}SHADOW_DATABASE_URL${NC} - Shadow database for migrations"
echo -e "  ${YELLOW}JWT_SECRET${NC} - JWT secret (min 32 characters)"
echo -e "  ${YELLOW}NODE_ENV${NC} - Set to 'production'"
echo -e "  ${YELLOW}FRONTEND_URL${NC} - Your Vercel domain"

echo -e "\n${BLUE}Quick setup options:${NC}"
echo -e "1. Vercel Dashboard: https://vercel.com/dashboard → Settings → Environment Variables"
echo -e "2. Vercel CLI: ${CYAN}vercel env add <variable_name>${NC}"

read -p "Have you set up the required environment variables? (y/n): " env_setup
if [[ $env_setup != "y" && $env_setup != "Y" ]]; then
    print_warning "Please set up environment variables before continuing"
    print_info "You can continue the deployment after setting them up"
    exit 0
fi

# Step 7: Deploy to Vercel
print_step "7" "Deploying to Vercel"
print_info "Starting deployment to Vercel..."

# Login to Vercel if not already logged in
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_info "Please login to Vercel..."
    vercel login
fi

# Deploy to production
vercel --prod

if [ $? -eq 0 ]; then
    print_success "🎉 Deployment completed successfully!"
else
    print_error "Deployment failed. Check the logs above for details."
    exit 1
fi

# Step 8: Post-deployment instructions
print_step "8" "Post-Deployment Setup"
print_warning "IMPORTANT: Complete these steps after deployment:"
echo -e "1. ${CYAN}Database Migration:${NC}"
echo -e "   - Set up PostgreSQL database (Vercel Postgres, Supabase, or Railway)"
echo -e "   - Run: ${CYAN}npx prisma db push${NC}"
echo -e "   - Run: ${CYAN}npm run db:seed${NC}"
echo -e ""
echo -e "2. ${CYAN}Test Deployment:${NC}"
echo -e "   - Health check: ${GREEN}https://your-domain.vercel.app/api/health${NC}"
echo -e "   - Frontend: ${GREEN}https://your-domain.vercel.app${NC}"
echo -e ""
echo -e "3. ${CYAN}Default Login Credentials:${NC}"
echo -e "   - Admin: admin@counselortempo.com / admin123"
echo -e "   - Counselor: counselor@counselortempo.com / counselor123"

print_success "🚀 Santaan AI Counselor is now deployed to Vercel!"
print_info "Check your Vercel dashboard for the deployment URL"

echo -e "\n${GREEN}🎯 Deployment Complete!${NC}"
