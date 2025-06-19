# 🚀 One-Click CounselorTempo Deployment Guide

This guide will help you deploy the complete CounselorTempo application with **zero post-deployment configuration** required.

## 🎯 What You'll Get

After following this guide, you'll have a **fully functional** CounselorTempo application with:

✅ **Complete Frontend**: React-based IVF counseling platform  
✅ **Complete Backend**: 19 API endpoints with authentication  
✅ **Production Database**: PostgreSQL with all tables and sample data  
✅ **Authentication System**: JWT-based login with role-based access  
✅ **Sample Data**: Ready-to-use patients, appointments, and treatment plans  
✅ **Admin Access**: Immediate access with pre-configured accounts  

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- 10 minutes of your time

## 🚀 Step-by-Step Deployment

### **Step 1: Set Up Database (5 minutes)**

#### **Option A: Vercel Postgres (Recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Storage"** in the sidebar
3. Click **"Create Database"**
4. Select **"PostgreSQL"**
5. Database name: `counselortempo-db`
6. Select your preferred region
7. Click **"Create"**
8. **Copy the connection strings** (you'll need these in Step 3)

#### **Option B: Supabase (Free Alternative)**
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Project name: `counselortempo`
4. Generate a secure password
5. Select region
6. Click **"Create new project"**
7. Go to **Settings** → **Database**
8. **Copy the connection string** (ensure it includes `?schema=public`)

### **Step 2: Deploy to Vercel (2 minutes)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Enter repository URL: `https://github.com/satsantaan/Santana-AI-counselor.git`
5. Click **"Import"**
6. **DO NOT DEPLOY YET** - Click **"Configure Project"**

### **Step 3: Configure Environment Variables (3 minutes)**

In the Vercel project configuration, add these environment variables:

#### **Database Variables**
```bash
# Use the connection strings from Step 1
DATABASE_URL
# Paste your database connection string here

SHADOW_DATABASE_URL  
# For Vercel Postgres: use POSTGRES_URL_NON_POOLING
# For Supabase: use the same connection string
```

#### **Authentication Variables**
```bash
JWT_SECRET
# Value: counselortempo-super-secret-jwt-key-for-production-2024-change-this

JWT_EXPIRES_IN
# Value: 7d

REFRESH_TOKEN_EXPIRES_IN
# Value: 30d
```

#### **Application Variables**
```bash
NODE_ENV
# Value: production

FRONTEND_URL
# Value: https://your-project-name.vercel.app
# (You'll get the actual URL after deployment)
```

#### **Security Variables**
```bash
BCRYPT_ROUNDS
# Value: 12

RATE_LIMIT_WINDOW_MS
# Value: 900000

RATE_LIMIT_MAX_REQUESTS
# Value: 100
```

### **Step 4: Deploy (1 minute)**

1. After adding all environment variables, click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Vercel will automatically:
   - Build the frontend
   - Deploy API endpoints
   - Connect to database
   - Create database schema
   - Set up sample data
   - Configure authentication

### **Step 5: Verify Deployment (1 minute)**

1. **Get your deployment URL** from Vercel dashboard
2. **Test health endpoint**: Visit `https://your-domain.vercel.app/api/health`
3. **Access the application**: Visit `https://your-domain.vercel.app`
4. **Login with default credentials**:
   - Admin: `admin@counselortempo.com` / `admin123`
   - Counselor: `counselor@counselortempo.com` / `counselor123`

## 🎉 Success! Your Application is Live

### **What's Available Immediately**

**Frontend Features:**
- Patient management dashboard
- Appointment scheduling system
- Assessment tools and forms
- Treatment plan creation
- Analytics and reporting
- User authentication

**Backend Features:**
- 19 REST API endpoints
- JWT authentication
- Role-based access control
- Database with sample data
- Security middleware
- Rate limiting

**Sample Data Included:**
- 2 user accounts (admin + counselor)
- 1 sample patient with complete profile
- 1 assessment with results
- 1 treatment plan with milestones
- 1 upcoming appointment

### **Default Login Accounts**

**Administrator Account:**
- Email: `admin@counselortempo.com`
- Password: `admin123`
- Access: Full system administration

**Counselor Account:**
- Email: `counselor@counselortempo.com`
- Password: `counselor123`
- Access: Patient management and counseling tools

### **API Endpoints Available**

All endpoints are immediately functional:

- `GET /api/health` - System health check
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/patients` - Patient management
- `GET /api/appointments` - Appointment scheduling
- `GET /api/assessments` - Patient assessments
- `GET /api/treatment-plans` - Treatment planning
- `GET /api/dashboard/stats` - Dashboard analytics
- `POST /api/emr/test-connection` - EMR integration

## 🔧 Post-Deployment (Optional)

### **Update Frontend URL**
1. Go to Vercel project settings
2. Update `FRONTEND_URL` environment variable with your actual domain
3. Redeploy if needed

### **Change Default Passwords**
1. Login with default credentials
2. Go to user settings
3. Change passwords for security

### **Add Your Own Data**
1. Create additional user accounts
2. Add real patient data
3. Configure EMR integrations
4. Customize treatment templates

## 🛠️ Troubleshooting

### **Common Issues**

**Deployment Fails:**
- Check that all environment variables are set
- Verify database connection string format
- Ensure JWT_SECRET is at least 32 characters

**Database Connection Error:**
- Verify DATABASE_URL is correct
- Check database is accessible
- Ensure connection string includes proper parameters

**Authentication Not Working:**
- Verify JWT_SECRET is set
- Check that NODE_ENV is set to "production"
- Ensure FRONTEND_URL matches your domain

**API Returns 500 Errors:**
- Check Vercel function logs
- Verify all environment variables are set
- Test database connectivity

### **Getting Help**

1. **Check Vercel Logs**: Go to your project → Functions → View logs
2. **Test API Health**: Visit `/api/health` endpoint
3. **Verify Environment Variables**: Check all required variables are set
4. **Database Connectivity**: Test database connection

## 🎯 Next Steps

After successful deployment:

1. **Explore the Application**: Login and test all features
2. **Add Real Data**: Replace sample data with actual patient information
3. **Configure Integrations**: Set up EMR system connections
4. **Customize Settings**: Adjust application settings for your needs
5. **Train Users**: Provide access to counselors and administrators
6. **Monitor Performance**: Use Vercel analytics and monitoring

## 🔒 Security Considerations

- **Change default passwords** immediately
- **Update JWT_SECRET** to a unique value
- **Enable 2FA** on Vercel account
- **Monitor access logs** regularly
- **Keep dependencies updated**

## 📊 What's Included

Your deployed application includes:

**Frontend (React + Vite):**
- Modern, responsive UI
- Patient management interface
- Dashboard with analytics
- Appointment scheduling
- Assessment tools
- Treatment planning

**Backend (Node.js + Prisma):**
- RESTful API with 19 endpoints
- JWT authentication
- PostgreSQL database
- Role-based access control
- Input validation and security
- Rate limiting and CORS

**Database (PostgreSQL):**
- Complete schema with relationships
- Sample data for immediate testing
- Optimized for performance
- Backup and recovery ready

## 🎉 Congratulations!

You now have a **fully functional, production-ready CounselorTempo application** deployed and ready to use!

The entire deployment process is automated, and your application is immediately ready for real-world use with no additional configuration required.
