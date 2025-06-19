# Vercel Environment Variables Setup

## Required Environment Variables for Production Deployment

Copy these exact environment variables into your Vercel project settings:

### **Database Configuration**
```bash
# Primary database URL (use Vercel Postgres POSTGRES_PRISMA_URL)
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public&pgbouncer=true&connect_timeout=15"

# Shadow database URL (use Vercel Postgres POSTGRES_URL_NON_POOLING)
SHADOW_DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"
```

### **Authentication Configuration**
```bash
# JWT Secret (MUST be at least 32 characters)
JWT_SECRET="counselortempo-super-secret-jwt-key-for-production-2024-change-this"

# Token expiration times
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"
```

### **Application Configuration**
```bash
# Node environment
NODE_ENV="production"

# Frontend URL (will be your Vercel domain)
FRONTEND_URL="https://your-project-name.vercel.app"
```

### **Security Configuration**
```bash
# Password hashing rounds
BCRYPT_ROUNDS="12"

# Rate limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

## How to Set Environment Variables in Vercel

### **Method 1: Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above for **Production** environment
5. Click **Save**

### **Method 2: Vercel CLI**
```bash
# Set each variable using CLI
vercel env add DATABASE_URL production
vercel env add SHADOW_DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add NODE_ENV production
vercel env add FRONTEND_URL production
vercel env add JWT_EXPIRES_IN production
vercel env add REFRESH_TOKEN_EXPIRES_IN production
vercel env add BCRYPT_ROUNDS production
vercel env add RATE_LIMIT_WINDOW_MS production
vercel env add RATE_LIMIT_MAX_REQUESTS production
```

## Database Setup Options

### **Option A: Vercel Postgres (Recommended)**
1. In Vercel Dashboard → **Storage** → **Create Database**
2. Select **PostgreSQL**
3. Name: `counselortempo-db`
4. Copy the connection strings:
   - Use `POSTGRES_PRISMA_URL` for `DATABASE_URL`
   - Use `POSTGRES_URL_NON_POOLING` for `SHADOW_DATABASE_URL`

### **Option B: Supabase (Free Alternative)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `counselortempo`
3. Go to **Settings** → **Database**
4. Copy connection string (ensure it includes `?schema=public`)
5. For shadow database, create a second database or use the same with different schema

### **Option C: Railway**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add **PostgreSQL** service
4. Copy connection string from service details

## Pre-configured Values

The following values are already optimized for production:

- **JWT_SECRET**: 64-character secure key (change the provided one)
- **JWT_EXPIRES_IN**: 7 days (good balance of security and UX)
- **REFRESH_TOKEN_EXPIRES_IN**: 30 days (allows long-term sessions)
- **BCRYPT_ROUNDS**: 12 (secure password hashing)
- **RATE_LIMIT**: 100 requests per 15 minutes (prevents abuse)

## Security Notes

1. **Change the JWT_SECRET**: The provided secret is just an example
2. **Use HTTPS**: Vercel automatically provides SSL certificates
3. **Database Security**: Use connection pooling and SSL connections
4. **Environment Isolation**: Only set these for Production environment

## Automatic Setup

Once these environment variables are set, the deployment will automatically:

1. ✅ Build the frontend (React + Vite)
2. ✅ Deploy API endpoints (19 serverless functions)
3. ✅ Connect to PostgreSQL database
4. ✅ Deploy database schema (all tables and relationships)
5. ✅ Create initial admin and sample data
6. ✅ Configure authentication and security
7. ✅ Enable all application features

## Default Login Credentials

After deployment, you can login with:

**Admin Account:**
- Email: `admin@counselortempo.com`
- Password: `admin123`

**Counselor Account:**
- Email: `counselor@counselortempo.com`
- Password: `counselor123`

**Note**: Change these passwords immediately after first login in production.

## Verification

After deployment, verify everything works:

1. **Health Check**: `https://your-domain.vercel.app/api/health`
2. **Frontend**: `https://your-domain.vercel.app`
3. **Login**: Use the default credentials above
4. **Database**: Check that sample data is present

## Troubleshooting

If deployment fails:

1. **Check Environment Variables**: Ensure all required variables are set
2. **Database Connection**: Verify DATABASE_URL format and connectivity
3. **Build Logs**: Check Vercel deployment logs for specific errors
4. **JWT Secret**: Ensure it's at least 32 characters long

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify database connectivity
3. Ensure all environment variables are correctly set
4. Test API endpoints individually
