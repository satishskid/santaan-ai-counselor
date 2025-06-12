# 🌟 Santaan IVF Counseling Platform

> **Comprehensive IVF counseling platform with AI-powered personalized intervention plans, real-time monitoring, and mobile patient engagement.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/satishskid/counselortempo)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-blue)](https://web.dev/progressive-web-apps/)
[![Mobile Optimized](https://img.shields.io/badge/mobile-optimized-green)](https://developers.google.com/web/fundamentals/design-and-ux/responsive)
[![AI Powered](https://img.shields.io/badge/AI-powered-purple)](https://openai.com/)

## 🎯 **Overview**

Santaan is a cutting-edge IVF counseling platform that revolutionizes fertility treatment support through:

- **🤖 AI-Powered Interventions**: Personalized treatment plans using advanced AI
- **📱 Mobile PWA Experience**: Native app feel without app store deployment
- **📊 Real-Time Monitoring**: Live patient progress tracking for counselors
- **🏥 EMR Integration**: Seamless bidirectional data sync with healthcare systems
- **🎨 Professional Design**: Santaan.in branded, mobile-first interface

## ✨ **Key Features**

### 🏥 **For Healthcare Providers**
- **Patient Link Generator**: Create personalized mobile app links for patients
- **Real-Time Dashboard**: Monitor patient progress and intervention effectiveness
- **AI Persona Generator**: Generate comprehensive patient profiles and treatment plans
- **EMR Integration**: Bidirectional sync with existing healthcare systems
- **Assessment Tools**: Comprehensive psychological evaluation instruments
- **Progress Tracking**: Visual analytics and outcome measurement

### 📱 **For Patients**
- **Mobile PWA App**: Install-to-home-screen progressive web app
- **Personalized Journey**: Custom intervention plans based on AI analysis
- **Daily Tasks**: Interactive exercises and progress tracking
- **Educational Resources**: Curated articles, videos, and audio guides
- **Achievement System**: Gamified progress with badges and milestones
- **Offline Support**: Full functionality without internet connection

### 🤖 **AI Integration**
- **Multiple Providers**: Groq, OpenRouter, Hugging Face support
- **Persona Generation**: Comprehensive psychological profiling
- **Intervention Planning**: Evidence-based treatment recommendations
- **Risk Assessment**: Automated identification of high-risk situations
- **Progress Adaptation**: Dynamic plan adjustments based on outcomes

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
