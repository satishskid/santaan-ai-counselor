# 🚀 Deploy CounselorTempo NOW - Web Interface

## 🎯 **Instant Deployment via Vercel Dashboard**

Since CLI tools aren't available in this environment, let's deploy using the Vercel web interface. This is actually easier and more visual!

## 📋 **Prerequisites (2 minutes)**

### **Step 1: Create Database**
Choose one option:

#### **Option A: Vercel Postgres (Recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Storage"** → **"Create Database"**
3. Select **"PostgreSQL"**
4. Name: `counselortempo-db`
5. **Copy these connection strings:**
   - `POSTGRES_PRISMA_URL` → use for `DATABASE_URL`
   - `POSTGRES_URL_NON_POOLING` → use for `SHADOW_DATABASE_URL`

#### **Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create project: `counselortempo`
3. Settings → Database → Copy connection string

## 🚀 **Deploy to Vercel (5 minutes)**

### **Step 1: Import Repository**
1. **Go to**: [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository**
3. **Repository URL**: `https://github.com/satsantaan/Santana-AI-counselor.git`
4. **Click "Import"**

### **Step 2: Configure Project**
Vercel will auto-detect:
- ✅ **Framework**: Vite
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Install Command**: `npm install`

**Don't deploy yet!** Click **"Configure Project"**

### **Step 3: Set Environment Variables**
Add these **10 environment variables** in the Vercel dashboard:

```bash
# Database Configuration
DATABASE_URL
# Value: Your PostgreSQL connection string from Step 1

SHADOW_DATABASE_URL
# Value: Your shadow database connection string from Step 1

# Authentication Configuration
JWT_SECRET
# Value: counselortempo-super-secret-jwt-key-for-production-2024-change-this

JWT_EXPIRES_IN
# Value: 7d

REFRESH_TOKEN_EXPIRES_IN
# Value: 30d

# Application Configuration
NODE_ENV
# Value: production

FRONTEND_URL
# Value: https://your-project-name.vercel.app (you'll get this after deployment)

# Security Configuration
BCRYPT_ROUNDS
# Value: 12

RATE_LIMIT_WINDOW_MS
# Value: 900000

RATE_LIMIT_MAX_REQUESTS
# Value: 100
```

### **Step 4: Deploy**
1. **Click "Deploy"**
2. **Wait 2-3 minutes** for deployment to complete
3. **Vercel will automatically:**
   - Build the frontend (React + Vite)
   - Deploy 19 API endpoints
   - Connect to your database
   - Create database schema
   - Set up sample data
   - Configure authentication

### **Step 5: Update Frontend URL**
1. **Copy your deployment URL** (e.g., `https://santana-ai-counselor.vercel.app`)
2. **Go to Project Settings** → **Environment Variables**
3. **Update `FRONTEND_URL`** with your actual URL
4. **Redeploy** (optional, but recommended)

## ✅ **Verification (1 minute)**

### **Test Your Deployment**
1. **Health Check**: Visit `https://your-domain.vercel.app/api/health`
2. **Frontend**: Visit `https://your-domain.vercel.app`
3. **Login**: Use default credentials below

### **Default Login Credentials**
**Administrator:**
- Email: `admin@counselortempo.com`
- Password: `admin123`

**Counselor:**
- Email: `counselor@counselortempo.com`
- Password: `counselor123`

## 🎉 **Success! What You Now Have**

### **Complete Application Features:**
✅ **Patient Management System** - Add, edit, view patient records  
✅ **Appointment Scheduling** - Book and manage appointments  
✅ **Assessment Tools** - Psychological evaluations and screenings  
✅ **Treatment Plan Creation** - Comprehensive care planning  
✅ **Dashboard Analytics** - Real-time statistics and insights  
✅ **Role-Based Access** - Admin, Counselor, Patient roles  
✅ **Sample Data** - Ready-to-use test data  

### **Technical Features:**
✅ **19 REST API Endpoints** - Complete backend functionality  
✅ **JWT Authentication** - Secure login system  
✅ **PostgreSQL Database** - Production-ready data storage  
✅ **Security Middleware** - CORS, rate limiting, validation  
✅ **Serverless Architecture** - Auto-scaling Vercel functions  

### **Sample Data Included:**
- 👤 **2 User Accounts** (Admin + Counselor)
- 🏥 **1 Sample Patient** with complete profile
- 📝 **1 Assessment** with results
- 📋 **1 Treatment Plan** with milestones
- 📅 **1 Appointment** scheduled

## 🔧 **Alternative: CLI Deployment**

If you prefer command line, run this in your terminal:

```bash
# Navigate to project directory
cd "/Users/satish/Downloads/counseor tempo/counselortempo"

# Run the automated deployment script
./deploy-to-vercel.sh
```

This script will:
1. Install Vercel CLI
2. Login to Vercel
3. Set up environment variables
4. Deploy the application
5. Verify deployment

## 🛠️ **Troubleshooting**

### **Common Issues:**

**Build Fails:**
- Check all environment variables are set
- Verify database connection string format

**Database Connection Error:**
- Ensure `DATABASE_URL` is correct
- Check database is accessible from Vercel

**API Returns 500:**
- Verify all 10 environment variables are set
- Check Vercel function logs

**Frontend Loads but API Fails:**
- Check `NODE_ENV` is set to "production"
- Verify `JWT_SECRET` is at least 32 characters

### **Getting Help:**
1. **Check Vercel Logs**: Project → Functions → View logs
2. **Test Health Endpoint**: `/api/health`
3. **Verify Environment Variables**: All 10 variables set

## 🎯 **Next Steps After Deployment**

1. **Change Default Passwords** - Update admin and counselor passwords
2. **Add Real Data** - Replace sample data with actual patient information
3. **Configure EMR Integration** - Set up external system connections
4. **Train Users** - Provide access to counselors and staff
5. **Monitor Performance** - Use Vercel analytics

## 🔒 **Security Notes**

- **Change the JWT_SECRET** to a unique value
- **Update default passwords** immediately
- **Enable 2FA** on your Vercel account
- **Monitor access logs** regularly

## 📊 **What's Deployed**

Your live application includes:

**Frontend (React + Vite):**
- Modern, responsive UI
- Patient management interface
- Dashboard with real-time analytics
- Appointment scheduling system
- Assessment and treatment tools

**Backend (Node.js + Serverless):**
- 19 REST API endpoints
- JWT authentication system
- PostgreSQL database integration
- Role-based access control
- Security middleware and validation

**Database (PostgreSQL):**
- Complete schema with relationships
- Sample data for immediate testing
- Optimized for performance
- Ready for production use

## 🎉 **Congratulations!**

Your **complete CounselorTempo application** is now live and ready for production use!

**🔗 Access your application at your Vercel URL and start using it immediately!**
