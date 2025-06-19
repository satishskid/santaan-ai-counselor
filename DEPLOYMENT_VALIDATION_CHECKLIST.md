# 🧪 CounselorTempo Deployment Validation Checklist

## 🎯 **Pre-Deployment Validation Process**

This comprehensive checklist ensures your CounselorTempo application is ready for successful deployment to Vercel.

## 📋 **Quick Validation Commands**

Run these commands before every deployment:

```bash
# 1. Validate environment variables
node scripts/validate-env-vars.js

# 2. Test database URL format
node scripts/validate-database-url.js

# 3. Test complete build process
node scripts/test-build-process.js

# 4. Run pre-commit validation
node scripts/pre-commit-validation.js

# 5. Generate environment template (if needed)
node scripts/validate-env-vars.js --template
```

## 🗄️ **Database Configuration Validation**

### **Step 1: Validate DATABASE_URL Format**

✅ **Check DATABASE_URL format:**
```bash
node scripts/validate-database-url.js "$DATABASE_URL"
```

**Required format for Supabase:**
```
postgresql://postgres:password@db.project.supabase.co:5432/postgres?schema=public&sslmode=require
```

**Required format for Vercel Postgres:**
```
postgresql://user:pass@host:5432/db?schema=public&pgbouncer=true&connect_timeout=15
```

### **Step 2: Test Database Connectivity**
```bash
# Test Prisma connection
npx prisma db push --preview-feature

# Verify schema deployment
npx prisma studio
```

### **Step 3: Validate All Environment Variables**

**Required Variables Checklist:**
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SHADOW_DATABASE_URL` - Shadow database for migrations
- [ ] `JWT_SECRET` - At least 32 characters
- [ ] `NODE_ENV` - Set to "production"
- [ ] `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- [ ] `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration (default: 30d)
- [ ] `FRONTEND_URL` - Your Vercel domain (set after deployment)
- [ ] `BCRYPT_ROUNDS` - Password hashing rounds (default: 12)
- [ ] `RATE_LIMIT_WINDOW_MS` - Rate limiting window (default: 900000)
- [ ] `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## 🏗️ **Build Process Validation**

### **Step 1: Local Build Test**
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# TypeScript compilation check
npx tsc --noEmit

# Build frontend
npm run build

# Test postbuild script
npm run postbuild
```

### **Step 2: Verify Build Output**
- [ ] `dist/` directory created
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` contains JS/CSS files
- [ ] No TypeScript compilation errors
- [ ] Prisma client generated successfully

### **Step 3: API Endpoints Check**
- [ ] `api/` directory exists
- [ ] Key endpoints present:
  - `api/health.js`
  - `api/auth/login.js`
  - `api/auth/register.js`
  - `api/patients/index.js`
  - `api/appointments/index.js`

## 🔍 **Code Quality Validation**

### **Step 1: Linting and Formatting**
```bash
# ESLint check
npx eslint . --ext .ts,.tsx,.js,.jsx

# Fix ESLint issues
npx eslint . --ext .ts,.tsx,.js,.jsx --fix

# Prettier check
npx prettier --check .

# Fix formatting
npx prettier --write .
```

### **Step 2: TypeScript Validation**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Generate type definitions
npx tsc --declaration --emitDeclarationOnly
```

## 📁 **File Structure Validation**

### **Required Files Checklist:**
- [ ] `package.json` - With all required scripts
- [ ] `vercel.json` - Simplified configuration
- [ ] `prisma/schema.prisma` - Database schema
- [ ] `src/` - Frontend source code
- [ ] `api/` - Backend API endpoints
- [ ] `scripts/` - Validation and setup scripts

### **Required Scripts in package.json:**
- [ ] `"build": "tsc ; vite build"`
- [ ] `"postbuild": "npm run db:deploy"`
- [ ] `"db:generate": "prisma generate"`
- [ ] `"db:deploy": "prisma db push && node scripts/setup-production-db.js"`

## 🚀 **Vercel Configuration Validation**

### **Step 1: vercel.json Validation**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install && npx prisma generate"
}
```

### **Step 2: Environment Variables in Vercel**
- [ ] All 10 environment variables set in Vercel dashboard
- [ ] Variables set for "Production" environment
- [ ] DATABASE_URL format validated
- [ ] JWT_SECRET is secure (32+ characters)

## 🧪 **Pre-Deployment Testing**

### **Step 1: Run Complete Validation**
```bash
# Run all validation checks
node scripts/pre-commit-validation.js
```

### **Step 2: Test Database Setup**
```bash
# Test database schema deployment
npx prisma db push

# Test sample data creation
node scripts/setup-production-db.js
```

### **Step 3: Local Development Test**
```bash
# Start local development
npm run dev:full

# Test API endpoints
curl http://localhost:5173/api/health

# Test frontend
open http://localhost:5173
```

## ✅ **Deployment Readiness Checklist**

Before deploying to Vercel, ensure:

### **Environment Setup:**
- [ ] Database created (Supabase or Vercel Postgres)
- [ ] All environment variables validated
- [ ] DATABASE_URL format correct
- [ ] JWT_SECRET is secure

### **Code Quality:**
- [ ] No ESLint errors
- [ ] No TypeScript compilation errors
- [ ] Code formatted with Prettier
- [ ] All tests passing

### **Build Process:**
- [ ] Local build completes successfully
- [ ] Prisma client generates without errors
- [ ] Database schema deploys successfully
- [ ] Sample data creation works

### **Configuration:**
- [ ] vercel.json is valid and simplified
- [ ] package.json has all required scripts
- [ ] API endpoints are properly structured
- [ ] Frontend builds to dist/ directory

## 🚨 **Common Issues and Solutions**

### **P1012 Database URL Error:**
```bash
# Validate URL format
node scripts/validate-database-url.js "$DATABASE_URL"

# Common fixes:
# 1. Ensure protocol is postgresql:// or postgres://
# 2. Add ?schema=public parameter
# 3. Check username/password encoding
# 4. Verify hostname and port
```

### **Build Failures:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for missing dependencies
npm install

# Verify Prisma client
npx prisma generate
```

### **Environment Variable Issues:**
```bash
# Generate template
node scripts/validate-env-vars.js --template

# Validate all variables
node scripts/validate-env-vars.js
```

## 🎯 **Automated Validation Workflow**

### **Pre-commit Hook (Optional):**
```bash
# Add to .git/hooks/pre-commit
#!/bin/sh
node scripts/pre-commit-validation.js
```

### **GitHub Actions (Optional):**
```yaml
name: Deployment Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: node scripts/pre-commit-validation.js
```

## 🎉 **Success Criteria**

Your application is ready for deployment when:

✅ All validation scripts pass without errors  
✅ Database connection is successful  
✅ Build process completes locally  
✅ Environment variables are properly formatted  
✅ No TypeScript or ESLint errors  
✅ API endpoints are structured correctly  
✅ Vercel configuration is valid  

## 🚀 **Deploy with Confidence**

Once all checks pass:

1. **Commit your changes**: `git add . && git commit -m "Ready for deployment"`
2. **Push to GitHub**: `git push origin main`
3. **Deploy to Vercel**: Import from GitHub or use CLI
4. **Verify deployment**: Test health endpoint and login functionality

**Your CounselorTempo application is now ready for successful deployment!** 🎉
