# 🏥 CounselorTempo - AI-Powered Counseling Practice Management System

> **Comprehensive counseling practice management system with AI-powered insights, real-time diagnostics, and advanced admin tools for mental health professionals.**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://santana-ai-counselor.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://prisma.io/)

## 🌟 **Live Application**

**🔗 Access the application**: [https://santana-ai-counselor.vercel.app](https://santana-ai-counselor.vercel.app)

## 🎯 **Overview**

CounselorTempo is a comprehensive counseling practice management system designed for mental health professionals. Built with cutting-edge technology and featuring advanced diagnostic tools, real-time monitoring, and comprehensive patient care management.

- **🧪 Advanced Testing Suite**: Comprehensive application testing and diagnostics
- **🔍 Real-Time System Health**: Live monitoring with automated issue detection
- **👥 Multi-Role Support**: Counselors, Administrators, and Patients
- **📊 Comprehensive Analytics**: Real-time dashboard with performance insights
- **🔐 Enterprise Security**: Role-based access control and secure authentication
- **🛠️ Admin Tools**: Advanced debugging and system management capabilities

## ✨ **Key Features**

### 👨‍⚕️ **For Counselors**
- **Patient Management**: Comprehensive patient profiles with detailed history
- **Appointment Scheduling**: Advanced scheduling with automated reminders
- **Assessment Tools**: Standardized psychological evaluation instruments
- **Treatment Planning**: Evidence-based treatment plans with goal tracking
- **Progress Monitoring**: Visual analytics and outcome measurement
- **Session Notes**: Secure note-taking with search and organization

### 👨‍💼 **For Administrators**
- **🧪 Testing Suite**: Comprehensive application testing and validation
- **🔍 System Health Dashboard**: Real-time monitoring with automated diagnostics
- **🔧 Debug Tools**: Advanced troubleshooting and system maintenance
- **👥 User Management**: Role-based access control and user oversight
- **📊 Analytics Dashboard**: System performance and usage analytics
- **⚙️ Settings Management**: System configuration and preferences

### 👤 **For Patients**
- **Self-Service Portal**: Appointment booking and profile management
- **Progress Tracking**: Personal progress visualization and goal tracking
- **Resource Access**: Educational materials and self-help resources
- **Secure Communication**: HIPAA-compliant messaging with counselors
- **Mobile Responsive**: Full functionality on all devices

### 🛠️ **Advanced Admin Tools**
- **Automated Testing**: 50+ comprehensive system tests
- **Real-Time Diagnostics**: Live system health monitoring
- **Error Detection**: Automated issue identification and recommendations
- **Performance Monitoring**: System resource and response time tracking
- **Security Validation**: Authentication and authorization testing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Modern web browser

### **Installation**
```bash
# Clone the repository
git clone https://github.com/satishskid/counselortempo.git
cd counselortempo

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:5173
```

### **Build for Production**
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📱 **Core Workflows**

### **1. Patient Onboarding Workflow**
```
Counselor → Generate Patient Link → Patient Receives → Installs PWA → Daily Engagement
```

1. **Counselor**: Creates patient link via form at `/patient-link-generator`
2. **System**: Generates unique patient ID and personalized URL
3. **Patient**: Receives professional email/SMS with app link
4. **Patient**: Installs PWA to home screen for native app experience
5. **Daily Use**: Completes tasks, tracks progress, accesses resources

### **2. Real-Time Monitoring**
```
Patient Activity → Live Updates → Counselor Dashboard → Intervention Adjustments
```

1. **Patient**: Completes tasks and assessments in mobile app
2. **System**: Real-time data sync and live updates every 5 seconds
3. **Counselor**: Monitors progress via live dashboard at `/dashboard`
4. **AI**: Provides insights and recommendations for plan adjustments

## 🏗️ **Architecture**

### **Frontend Stack**
- **React 18**: Modern component-based UI with hooks
- **TypeScript**: Type-safe development and better DX
- **Tailwind CSS**: Utility-first styling with custom Santaan theme
- **Framer Motion**: Smooth animations and micro-interactions
- **Radix UI**: Accessible component primitives and design system

### **PWA Features**
- **Service Worker**: Offline functionality and intelligent caching
- **Web App Manifest**: Native app installation experience
- **Background Sync**: Data sync when connection returns
- **Push Notifications**: Real-time alerts (infrastructure ready)
- **Install Prompts**: Automatic installation banners

### **AI Integration**
- **Groq**: Fast inference for real-time responses
- **OpenRouter**: Access to multiple AI models (Claude, GPT, etc.)
- **Hugging Face**: Open-source model ecosystem
- **Custom Prompts**: Specialized IVF counseling templates

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd counselortempo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up the database**
   ```bash
   # Run the migration files in your Supabase dashboard
   # Or use Supabase CLI:
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Run tests**
   ```bash
   npm test
   ```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── home.tsx         # Dashboard component
│   ├── PatientOnboarding.tsx
│   ├── AssessmentDashboard.tsx
│   ├── TreatmentPlanCreator.tsx
│   └── PatientProgressTracker.tsx
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client and helpers
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
│   └── supabase.ts      # Generated Supabase types
├── test/                # Test files
└── stories/             # Storybook stories

supabase/
├── migrations/          # Database migrations
└── seed.sql            # Sample data

scripts/
└── test-deployment.sh   # Deployment testing script
```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: Counselors and admin users
- **Patients**: Patient information and status
- **Medical History**: Patient medical background
- **Fertility Journey**: Patient fertility history and expectations
- **Treatment Pathway**: Preferred treatment options
- **Assessments**: ESHRE-based assessment data
- **Treatment Plans**: Structured treatment plans with milestones
- **Appointments**: Scheduling and appointment management
- **Resources**: Educational materials and documents
- **Notes**: Counselor notes and observations

All tables include Row Level Security (RLS) for data protection.

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Test deployment readiness
./scripts/test-deployment.sh
```

### Test Coverage
- **Component Tests**: UI component functionality
- **Integration Tests**: Database operations and API calls
- **E2E Tests**: Complete user workflows
- **Unit Tests**: Individual function testing

## 🚀 Deployment

### Quick Deployment Test
```bash
./scripts/test-deployment.sh
```

### Production Deployment Options

#### 1. Vercel (Recommended)
```bash
# Connect GitHub repo to Vercel
# Set environment variables in dashboard
# Auto-deploy on push to main
```

#### 2. Docker
```bash
# Build and run with Docker
docker build -t counselor-app .
docker run -p 3000:80 counselor-app

# Or use docker-compose
docker-compose up -d
```

#### 3. Traditional Hosting
```bash
npm run build
# Upload dist/ folder to web server
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_PROJECT_ID`: Your Supabase project ID
- `VITE_APP_NAME`: Application name
- `VITE_TEMPO`: Enable development tools

### Database Configuration
1. Run migration files in Supabase dashboard
2. Set up Row Level Security policies
3. Configure authentication settings
4. Load sample data (optional)

## 📊 Features Overview

### Dashboard
- Patient overview with status indicators
- Upcoming appointments calendar
- Quick action buttons
- Statistics and metrics
- Search and filtering

### Patient Onboarding
- 4-step guided process
- Form validation with Zod
- Progress saving
- Data persistence
- Error handling

### Assessment Tools
- Emotional assessment questionnaire
- Financial planning assessment
- Social support evaluation
- Scoring and recommendations
- Progress tracking

### Treatment Planning
- Template-based plan creation
- Milestone tracking
- Intervention management
- Patient-specific customization
- Progress monitoring

### Progress Tracking
- Timeline visualization
- Appointment scheduling
- Note taking
- Resource sharing
- Status updates

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Authentication**: Supabase Auth integration
- **Data Validation**: Client and server-side validation
- **Secure Headers**: HTTPS and security headers
- **Environment Protection**: Secure environment variable handling

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant
- **Dark Mode**: System preference detection
- **Animations**: Smooth transitions with Framer Motion
- **Loading States**: Comprehensive loading indicators
- **Error Boundaries**: Graceful error handling

## 📈 Performance

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and bundle optimization
- **Caching**: Aggressive caching strategies
- **Lazy Loading**: Component and route lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review the test files for usage examples
- Contact the development team

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database and auth by [Supabase](https://supabase.com/)
- Created by greybrain.ai
# Force deployment
