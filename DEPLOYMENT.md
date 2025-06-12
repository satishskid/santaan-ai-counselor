# Santaan Counselor - Deployment Guide

## Overview
This guide covers the complete deployment process for the Santaan IVF Counseling application with a fresh SQLite database design using Prisma ORM.

## ✅ Application Status
**DEPLOYMENT READY** - All tests passed successfully!

- ✅ Database schema created and tested
- ✅ Sample data seeded
- ✅ TypeScript compilation successful
- ✅ Build process working
- ✅ API functions tested
- ✅ Performance validated

## Prerequisites

### 1. Database Setup (SQLite with Prisma)
The application now uses SQLite with Prisma ORM for a simpler, more reliable database solution.

### 2. Environment Configuration
1. Copy `.env.example` to `.env`
2. The database is already configured with SQLite:
   ```
   DATABASE_URL="file:./dev.db"
   VITE_APP_NAME=Santaan Counselor
   VITE_APP_VERSION=1.0.0
   ```

## Database Setup

### 1. Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or manually run the SQL files in Supabase dashboard:
# 1. Go to SQL Editor in Supabase dashboard
# 2. Run supabase/migrations/001_initial_schema.sql
# 3. Run supabase/seed.sql for sample data
```

### 2. Generate TypeScript Types
```bash
npm run types:supabase
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

## Production Deployment

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Option 2: Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Option 3: Docker Deployment
```bash
# Build production image
docker build -t counselor-app .

# Run container
docker run -p 3000:80 counselor-app

# Or use docker-compose
docker-compose up -d
```

### Option 4: Traditional VPS
```bash
# Build for production
npm run build

# Serve with nginx or apache
# Copy dist/ folder to web server root
```

## Environment Variables

### Required Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_PROJECT_ID`: Your Supabase project ID

### Optional Variables
- `VITE_APP_NAME`: Application name (default: "Santaan Counselor")
- `VITE_APP_VERSION`: Application version
- `VITE_TEMPO`: Enable Tempo devtools (development only)

## Security Considerations

### 1. Row Level Security (RLS)
- All tables have RLS enabled
- Policies are configured for proper access control
- Counselors can access all patient data
- Patients can only access their own data

### 2. Environment Security
- Never commit `.env` files
- Use secure environment variable management in production
- Rotate API keys regularly

### 3. HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Use secure headers (already configured in nginx.conf)

## Performance Optimization

### 1. Build Optimization
- Code splitting is enabled by default
- Tree shaking removes unused code
- Assets are optimized and compressed

### 2. Caching
- Static assets are cached for 1 year
- Service worker can be added for offline support

### 3. Database Optimization
- Indexes are created for frequently queried columns
- Use pagination for large datasets
- Implement proper query optimization

## Monitoring and Logging

### 1. Application Monitoring
- Set up error tracking (Sentry recommended)
- Monitor performance metrics
- Set up uptime monitoring

### 2. Database Monitoring
- Monitor Supabase dashboard for performance
- Set up alerts for high usage
- Regular backup verification

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors: `npm run build`
   - Verify all dependencies are installed
   - Check environment variables

2. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure database schema is up to date

3. **Authentication Issues**
   - Check Supabase auth configuration
   - Verify redirect URLs
   - Check user roles and permissions

### Health Checks
- Application health: `GET /health`
- Database connectivity: Check Supabase dashboard
- API endpoints: Test with provided test scripts

## Backup and Recovery

### 1. Database Backups
- Supabase provides automatic backups
- Set up additional backup strategies if needed
- Test restore procedures regularly

### 2. Application Backups
- Source code is in version control
- Environment configurations should be documented
- Keep deployment scripts updated

## Scaling Considerations

### 1. Database Scaling
- Monitor Supabase usage limits
- Consider read replicas for high read workloads
- Implement connection pooling if needed

### 2. Application Scaling
- Use CDN for static assets
- Implement horizontal scaling with load balancers
- Consider serverless deployment options

## Support and Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update Supabase client regularly

### 2. Performance Monitoring
- Regular performance audits
- Database query optimization
- User experience monitoring

For additional support, refer to the project documentation or contact the development team.
