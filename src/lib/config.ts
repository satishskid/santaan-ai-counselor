// Production Configuration
export const config = {
  // Application Settings
  app: {
    name: 'Santana AI Counselor',
    description: 'AI-Powered Fertility Counseling Platform',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development'
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    shadowUrl: process.env.PRISMA_DATABASE_URL,
    maxConnections: 10,
    connectionTimeout: 30000
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-development',
    tokenExpiry: '7d',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Feature Flags
  features: {
    clinicRegistration: process.env.NEXT_PUBLIC_ENABLE_CLINIC_REGISTRATION === 'true',
    emrIntegration: process.env.NEXT_PUBLIC_ENABLE_EMR_INTEGRATION === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    billing: process.env.NEXT_PUBLIC_ENABLE_BILLING === 'true',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },

  // Subscription Plans
  subscriptionPlans: {
    BASIC: {
      name: 'Basic Plan',
      price: 99,
      currency: 'USD',
      interval: 'month',
      maxCounselors: 5,
      maxPatients: 100,
      features: [
        'Basic Dashboard',
        'Patient Management',
        'Assessment Tools',
        'Email Support'
      ]
    },
    PREMIUM: {
      name: 'Premium Plan',
      price: 199,
      currency: 'USD',
      interval: 'month',
      maxCounselors: 15,
      maxPatients: 500,
      features: [
        'Advanced Analytics',
        'Custom Branding',
        'API Access',
        'Priority Support',
        'EMR Integration Ready'
      ]
    },
    ENTERPRISE: {
      name: 'Enterprise Plan',
      price: 'custom',
      currency: 'USD',
      interval: 'month',
      maxCounselors: 999,
      maxPatients: 9999,
      features: [
        'White Label Solution',
        'Custom Integrations',
        'Dedicated Support',
        'SLA Guarantee',
        'Advanced Security'
      ]
    }
  },

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    timeout: 30000,
    retryAttempts: 3,
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000 // per window
    }
  },

  // Security Configuration
  security: {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.NEXT_PUBLIC_APP_URL] 
        : ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  },

  // Monitoring Configuration
  monitoring: {
    healthCheck: {
      interval: 60000, // 1 minute
      timeout: 5000,
      retries: 3
    },
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      enableConsole: true,
      enableFile: false
    }
  },

  // EMR Integration Configuration (for future use)
  emr: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_EMR_INTEGRATION === 'true',
    providers: {
      epic: {
        enabled: false,
        baseUrl: process.env.EPIC_BASE_URL,
        clientId: process.env.EPIC_CLIENT_ID,
        clientSecret: process.env.EPIC_CLIENT_SECRET
      },
      cerner: {
        enabled: false,
        baseUrl: process.env.CERNER_BASE_URL,
        clientId: process.env.CERNER_CLIENT_ID,
        clientSecret: process.env.CERNER_CLIENT_SECRET
      }
    }
  },

  // Analytics Configuration
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    providers: {
      googleAnalytics: {
        enabled: false,
        trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID
      },
      mixpanel: {
        enabled: false,
        token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
      }
    }
  },

  // Notification Configuration
  notifications: {
    email: {
      provider: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'noreply@santanacounseling.com',
      fromName: 'Santana AI Counselor'
    },
    sms: {
      provider: 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER
    }
  },

  // File Storage Configuration
  storage: {
    provider: 'vercel-blob',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    bucket: process.env.STORAGE_BUCKET || 'santana-ai-counselor'
  },

  // Clinic Defaults
  clinic: {
    defaultPlan: 'BASIC',
    trialPeriod: 14, // days
    maxTrialClinics: 1000,
    defaultSettings: {
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        logoUrl: null
      },
      features: {
        assessmentTools: true,
        treatmentPlanning: true,
        progressTracking: true,
        resourceLibrary: true
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      }
    }
  }
}

// Helper functions
export const isProduction = () => config.app.environment === 'production'
export const isDevelopment = () => config.app.environment === 'development'
export const isFeatureEnabled = (feature: keyof typeof config.features) => config.features[feature]

// Validation
export const validateConfig = () => {
  const errors: string[] = []

  if (!config.database.url) {
    errors.push('DATABASE_URL is required')
  }

  if (!config.auth.jwtSecret || config.auth.jwtSecret === 'fallback-secret-for-development') {
    if (isProduction()) {
      errors.push('JWT_SECRET must be set in production')
    }
  }

  if (isProduction() && !config.app.url.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_APP_URL must use HTTPS in production')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export default config
