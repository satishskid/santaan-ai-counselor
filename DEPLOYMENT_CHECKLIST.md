# CounselorTempo Backend Deployment Checklist

## Pre-Deployment Validation

### ✅ **1. Code Structure**
- [x] Vercel serverless API structure in `/api` directory
- [x] Proper TypeScript configuration
- [x] All dependencies installed and configured
- [x] Environment configuration files created
- [x] Database schema updated for PostgreSQL

### ✅ **2. API Endpoints**
- [x] Authentication endpoints (login, register, refresh, logout, me)
- [x] Health check endpoint
- [x] Patients CRUD endpoints
- [x] Appointments endpoints
- [x] Assessments endpoints
- [x] Treatment plans endpoints
- [x] Dashboard stats endpoint
- [x] EMR integration endpoints

### ✅ **3. Security & Middleware**
- [x] JWT authentication implemented
- [x] CORS configuration
- [x] Input validation with Zod schemas
- [x] Rate limiting configured
- [x] Security headers implemented
- [x] Error handling middleware
- [x] Request sanitization

### ✅ **4. Database Configuration**
- [x] Prisma schema updated for PostgreSQL
- [x] Database connection utilities
- [x] Environment-based database URLs
- [x] Shadow database configuration for migrations

### ✅ **5. Documentation**
- [x] Complete API documentation
- [x] Environment variables documented
- [x] Authentication flow explained
- [x] Error handling documented

## Deployment Requirements

### **1. Environment Variables (Required)**
```bash
# Database (Production)
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"
SHADOW_DATABASE_URL="postgresql://username:password@hostname:port/shadow_database?schema=public"

# JWT Security
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Application
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-domain.vercel.app"

# Optional
BCRYPT_ROUNDS="12"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

### **2. Database Setup**
Choose one of these options:

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Storage → Create Database
2. Select PostgreSQL
3. Copy connection string to `DATABASE_URL`
4. Create shadow database for migrations

#### Option B: Supabase
1. Create new project at supabase.com
2. Go to Settings → Database
3. Copy connection string (ensure it includes `?schema=public`)
4. Set up shadow database

#### Option C: PlanetScale
1. Create database at planetscale.com
2. Create branch for shadow database
3. Copy connection strings

### **3. Vercel Configuration**
- [x] `vercel.json` configured for serverless functions
- [x] Build settings optimized
- [x] Security headers configured
- [x] Route handling set up

## Deployment Steps

### **Step 1: Database Setup**
1. Create PostgreSQL database (choose option above)
2. Set environment variables in Vercel dashboard
3. Run database migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### **Step 2: Deploy to Vercel**
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy and test

### **Step 3: Post-Deployment Testing**
1. Test health endpoint: `GET /api/health`
2. Test authentication flow
3. Test core API endpoints
4. Verify database connections
5. Check error handling

## Testing Checklist

### **API Endpoint Tests**
- [ ] `GET /api/health` - Returns 200 with system status
- [ ] `POST /api/auth/register` - Creates new user
- [ ] `POST /api/auth/login` - Authenticates user
- [ ] `GET /api/auth/me` - Returns user data with valid token
- [ ] `POST /api/auth/refresh` - Refreshes access token
- [ ] `POST /api/auth/logout` - Logs out user
- [ ] `GET /api/patients` - Returns patients list (authenticated)
- [ ] `POST /api/patients` - Creates new patient (counselor only)
- [ ] `GET /api/dashboard/stats` - Returns dashboard data
- [ ] `POST /api/emr/test-connection` - Tests EMR connection

### **Security Tests**
- [ ] Unauthenticated requests return 401
- [ ] Invalid tokens return 401
- [ ] Role-based access control works
- [ ] Input validation prevents invalid data
- [ ] Rate limiting works (100 requests/15min)
- [ ] CORS headers present
- [ ] Security headers present

### **Error Handling Tests**
- [ ] Invalid JSON returns 400
- [ ] Missing required fields return 400
- [ ] Non-existent resources return 404
- [ ] Duplicate resources return 409
- [ ] Server errors return 500 with proper format

## Production Monitoring

### **Health Checks**
- Monitor `/api/health` endpoint
- Set up uptime monitoring
- Database connection monitoring

### **Performance**
- API response times
- Database query performance
- Memory usage
- Error rates

### **Security**
- Failed authentication attempts
- Rate limit violations
- Unusual access patterns

## Rollback Plan

If deployment fails:
1. Revert to previous Vercel deployment
2. Check environment variables
3. Verify database connectivity
4. Review error logs
5. Fix issues and redeploy

## Success Criteria

✅ **Deployment is successful when:**
- All API endpoints respond correctly
- Authentication flow works end-to-end
- Database operations complete successfully
- Error handling works as expected
- Security measures are active
- Documentation is accessible
- Monitoring is in place

## Next Steps After Deployment

1. **Frontend Integration**: Update frontend API URLs
2. **Testing**: Run comprehensive integration tests
3. **Monitoring**: Set up alerts and dashboards
4. **Documentation**: Share API docs with team
5. **Backup**: Configure database backups
6. **SSL**: Ensure HTTPS is working
7. **Performance**: Monitor and optimize as needed
