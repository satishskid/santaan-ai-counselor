// Indian Demo Data for Sales Team
// Comprehensive demo setup with Indian clinic and patient data

export const indianDemoClinic = {
  id: 'demo-clinic-india',
  name: 'Fertility Care Centre Mumbai',
  email: 'admin@fertilitycaremumbai.com',
  phone: '+91 98765 43210',
  address: 'A-201, Medical Plaza, Bandra West, Mumbai, Maharashtra 400050',
  website: 'www.fertilitycaremumbai.com',
  subscriptionPlan: 'PREMIUM',
  maxCounselors: 15,
  maxPatients: 500,
  subscriptionStatus: 'ACTIVE',
  settings: JSON.stringify({
    branding: {
      primaryColor: '#FF6B35',
      secondaryColor: '#004E89',
      logoUrl: null
    },
    features: {
      assessmentTools: true,
      treatmentPlanning: true,
      progressTracking: true,
      resourceLibrary: true,
      emrIntegration: false
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true
    },
    currency: 'INR',
    language: 'en-IN'
  }),
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date()
}

export const indianDemoUsers = [
  {
    id: 'demo-admin-india',
    email: 'demo.admin@fertilitycaremumbai.com',
    password: 'Demo@2024',
    fullName: 'Dr. Priya Sharma',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: 'ADMIN',
    clinicId: 'demo-clinic-india',
    phone: '+91 98765 43210',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'demo-counselor1-india',
    email: 'demo.counselor1@fertilitycaremumbai.com',
    password: 'Demo@2024',
    fullName: 'Dr. Anjali Mehta',
    firstName: 'Anjali',
    lastName: 'Mehta',
    role: 'COUNSELOR',
    clinicId: 'demo-clinic-india',
    phone: '+91 98765 43211',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'demo-counselor2-india',
    email: 'demo.counselor2@fertilitycaremumbai.com',
    password: 'Demo@2024',
    fullName: 'Dr. Rajesh Kumar',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    role: 'COUNSELOR',
    clinicId: 'demo-clinic-india',
    phone: '+91 98765 43212',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date()
  }
]

export const indianDemoPatients = [
  {
    id: 'demo-patient1-india',
    firstName: 'Kavya',
    lastName: 'Reddy',
    email: 'kavya.reddy@email.com',
    phone: '+91 98765 54321',
    dateOfBirth: new Date('1990-03-15'),
    gender: 'FEMALE',
    clinicId: 'demo-clinic-india',
    counselorId: 'demo-counselor1-india',
    userId: 'demo-patient1-user-india',
    status: 'ACTIVE',
    location: 'Bangalore, Karnataka',
    medicalHistory: JSON.stringify({
      primaryDiagnosis: 'PCOS with irregular ovulation',
      secondaryDiagnosis: 'Mild endometriosis',
      previousTreatments: ['Clomid cycles', 'Lifestyle modifications'],
      allergies: ['Penicillin'],
      medications: ['Metformin 500mg', 'Folic acid'],
      familyHistory: 'Mother had PCOS, Sister conceived with IVF'
    }),
    treatmentHistory: JSON.stringify({
      cyclesAttempted: 3,
      treatmentType: 'IUI',
      currentCycle: 4,
      startDate: '2024-01-15',
      expectedDuration: '6 months',
      notes: 'Responding well to current protocol'
    }),
    psychologicalProfile: JSON.stringify({
      anxietyLevel: 'MODERATE',
      depressionScreening: 'MILD',
      copingStyle: 'Problem-focused',
      supportSystem: 'Strong family support',
      culturalFactors: ['Joint family dynamics', 'Religious beliefs', 'Social pressure']
    }),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'demo-patient2-india',
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@email.com',
    phone: '+91 98765 54322',
    dateOfBirth: new Date('1988-07-22'),
    gender: 'MALE',
    clinicId: 'demo-clinic-india',
    counselorId: 'demo-counselor1-india',
    userId: 'demo-patient2-user-india',
    status: 'ACTIVE',
    location: 'Bhubaneswar, Odisha',
    medicalHistory: JSON.stringify({
      primaryDiagnosis: 'Male factor infertility - Low sperm count',
      secondaryDiagnosis: 'Varicocele Grade 2',
      previousTreatments: ['Varicocele repair surgery', 'Antioxidant supplements'],
      allergies: ['None known'],
      medications: ['Coenzyme Q10', 'Vitamin E'],
      familyHistory: 'Father had diabetes, No known fertility issues'
    }),
    treatmentHistory: JSON.stringify({
      cyclesAttempted: 2,
      treatmentType: 'ICSI',
      currentCycle: 3,
      startDate: '2024-02-01',
      expectedDuration: '4 months',
      notes: 'Sperm parameters improving with treatment'
    }),
    psychologicalProfile: JSON.stringify({
      anxietyLevel: 'HIGH',
      depressionScreening: 'MODERATE',
      copingStyle: 'Emotion-focused',
      supportSystem: 'Supportive spouse, limited family support',
      culturalFactors: ['Male identity concerns', 'Career pressure', 'Financial stress']
    }),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  },
  {
    id: 'demo-patient3-india',
    firstName: 'Meera',
    lastName: 'Singh',
    email: 'meera.singh@email.com',
    phone: '+91 98765 54323',
    dateOfBirth: new Date('1985-11-08'),
    gender: 'FEMALE',
    clinicId: 'demo-clinic-india',
    counselorId: 'demo-counselor2-india',
    userId: 'demo-patient3-user-india',
    status: 'ACTIVE',
    location: 'Hyderabad, Telangana',
    medicalHistory: JSON.stringify({
      primaryDiagnosis: 'Recurrent pregnancy loss',
      secondaryDiagnosis: 'Antiphospholipid syndrome',
      previousTreatments: ['Aspirin therapy', 'Heparin injections', 'Immunological workup'],
      allergies: ['Latex'],
      medications: ['Low-dose aspirin', 'Folic acid', 'Progesterone'],
      familyHistory: 'Mother had multiple miscarriages'
    }),
    treatmentHistory: JSON.stringify({
      cyclesAttempted: 5,
      treatmentType: 'IVF with PGT',
      currentCycle: 1,
      startDate: '2024-03-01',
      expectedDuration: '3 months',
      notes: 'First IVF cycle after 3 pregnancy losses'
    }),
    psychologicalProfile: JSON.stringify({
      anxietyLevel: 'SEVERE',
      depressionScreening: 'MODERATE',
      copingStyle: 'Avoidance',
      supportSystem: 'Strong spousal support, counseling history',
      culturalFactors: ['Grief from losses', 'Religious coping', 'Extended family pressure']
    }),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  },
  {
    id: 'demo-patient4-india',
    firstName: 'Rohit',
    lastName: 'Gupta',
    email: 'rohit.gupta@email.com',
    phone: '+91 98765 54324',
    dateOfBirth: new Date('1992-05-12'),
    gender: 'MALE',
    clinicId: 'demo-clinic-india',
    counselorId: 'demo-counselor2-india',
    userId: 'demo-patient4-user-india',
    status: 'NEW',
    location: 'Pune, Maharashtra',
    medicalHistory: JSON.stringify({
      primaryDiagnosis: 'Unexplained infertility',
      secondaryDiagnosis: 'None',
      previousTreatments: ['Timed intercourse', 'Ovulation induction'],
      allergies: ['Shellfish'],
      medications: ['Multivitamins'],
      familyHistory: 'No known fertility issues'
    }),
    treatmentHistory: JSON.stringify({
      cyclesAttempted: 0,
      treatmentType: 'Initial consultation',
      currentCycle: 0,
      startDate: '2024-03-15',
      expectedDuration: 'TBD',
      notes: 'Recently married couple, trying for 18 months'
    }),
    psychologicalProfile: JSON.stringify({
      anxietyLevel: 'MILD',
      depressionScreening: 'NONE',
      copingStyle: 'Optimistic',
      supportSystem: 'Newly married, strong relationship',
      culturalFactors: ['Career focus', 'Family expectations', 'Financial planning']
    }),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date()
  },
  {
    id: 'demo-patient5-india',
    firstName: 'Deepika',
    lastName: 'Nair',
    email: 'deepika.nair@email.com',
    phone: '+91 98765 54325',
    dateOfBirth: new Date('1987-09-25'),
    gender: 'FEMALE',
    clinicId: 'demo-clinic-india',
    counselorId: 'demo-counselor1-india',
    userId: 'demo-patient5-user-india',
    status: 'COMPLETED',
    location: 'Chennai, Tamil Nadu',
    medicalHistory: JSON.stringify({
      primaryDiagnosis: 'Tubal factor infertility',
      secondaryDiagnosis: 'Previous ectopic pregnancy',
      previousTreatments: ['Laparoscopic surgery', 'Tubal reconstruction'],
      allergies: ['Iodine'],
      medications: ['Prenatal vitamins'],
      familyHistory: 'Sister had successful IVF'
    }),
    treatmentHistory: JSON.stringify({
      cyclesAttempted: 2,
      treatmentType: 'IVF',
      currentCycle: 'SUCCESSFUL',
      startDate: '2023-10-01',
      completionDate: '2024-01-15',
      notes: 'Successful pregnancy achieved, currently 12 weeks pregnant'
    }),
    psychologicalProfile: JSON.stringify({
      anxietyLevel: 'LOW',
      depressionScreening: 'NONE',
      copingStyle: 'Resilient',
      supportSystem: 'Excellent family and friend support',
      culturalFactors: ['Positive family experience', 'Strong faith', 'Community support']
    }),
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2024-01-15')
  }
]

export const indianDemoAppointments = [
  {
    id: 'demo-appt1-india',
    patientId: 'demo-patient1-india',
    counselorId: 'demo-counselor1-india',
    clinicId: 'demo-clinic-india',
    date: new Date('2024-03-25T10:00:00'),
    duration: 60,
    type: 'COUNSELING',
    status: 'SCHEDULED',
    notes: 'Initial counseling session for anxiety management',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-appt2-india',
    patientId: 'demo-patient2-india',
    counselorId: 'demo-counselor1-india',
    clinicId: 'demo-clinic-india',
    date: new Date('2024-03-26T14:00:00'),
    duration: 45,
    type: 'FOLLOW_UP',
    status: 'SCHEDULED',
    notes: 'Follow-up on coping strategies and male factor concerns',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-appt3-india',
    patientId: 'demo-patient3-india',
    counselorId: 'demo-counselor2-india',
    clinicId: 'demo-clinic-india',
    date: new Date('2024-03-27T11:30:00'),
    duration: 90,
    type: 'COUNSELING',
    status: 'SCHEDULED',
    notes: 'Grief counseling and IVF preparation session',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const indianDemoAssessments = [
  {
    id: 'demo-assessment1-india',
    patientId: 'demo-patient1-india',
    type: 'FERTILITY_QUALITY_OF_LIFE',
    status: 'COMPLETED',
    responses: JSON.stringify({
      emotional: { score: 65, concerns: ['Anxiety about treatment outcome', 'Mood swings'] },
      mind_body: { score: 70, concerns: ['Sleep disturbances', 'Stress management'] },
      relational: { score: 80, concerns: ['Communication with spouse', 'Family pressure'] },
      social: { score: 60, concerns: ['Social isolation', 'Work-life balance'] },
      total_score: 68.75
    }),
    recommendations: JSON.stringify([
      'Stress management techniques',
      'Couple communication exercises',
      'Mindfulness meditation',
      'Support group participation'
    ]),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'demo-assessment2-india',
    patientId: 'demo-patient2-india',
    type: 'ANXIETY_DEPRESSION_SCREENING',
    status: 'COMPLETED',
    responses: JSON.stringify({
      anxiety_score: 14,
      depression_score: 8,
      stress_level: 'HIGH',
      sleep_quality: 'POOR',
      specific_concerns: ['Performance anxiety', 'Financial stress', 'Treatment failure fear']
    }),
    recommendations: JSON.stringify([
      'Cognitive behavioral therapy',
      'Relaxation techniques',
      'Male support group',
      'Financial counseling resources'
    ]),
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  }
]

// Indian Rupee pricing for subscription plans
export const indianPricingPlans = {
  BASIC: {
    name: 'Basic Plan',
    price: 8299, // ₹8,299 (approximately $99)
    currency: 'INR',
    interval: 'month',
    maxCounselors: 5,
    maxPatients: 100,
    features: [
      'Basic Dashboard',
      'Patient Management',
      'Assessment Tools',
      'Email Support',
      'Hindi Language Support'
    ]
  },
  PREMIUM: {
    name: 'Premium Plan',
    price: 16599, // ₹16,599 (approximately $199)
    currency: 'INR',
    interval: 'month',
    maxCounselors: 15,
    maxPatients: 500,
    features: [
      'Advanced Analytics',
      'Custom Branding',
      'API Access',
      'Priority Support',
      'EMR Integration Ready',
      'Multi-language Support',
      'WhatsApp Integration'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise Plan',
    price: 41499, // ₹41,499 (approximately $499)
    currency: 'INR',
    interval: 'month',
    maxCounselors: 999,
    maxPatients: 9999,
    features: [
      'White Label Solution',
      'Custom Integrations',
      'Dedicated Support',
      'SLA Guarantee',
      'Advanced Security',
      'On-premise Deployment',
      'Regulatory Compliance'
    ]
  }
}

// Sales demo credentials
export const salesDemoCredentials = {
  admin: {
    email: 'demo.admin@fertilitycaremumbai.com',
    password: 'Demo@2024',
    role: 'Clinic Administrator',
    name: 'Dr. Priya Sharma'
  },
  counselor: {
    email: 'demo.counselor1@fertilitycaremumbai.com',
    password: 'Demo@2024',
    role: 'Senior Counselor',
    name: 'Dr. Anjali Mehta'
  },
  patient: {
    email: 'kavya.reddy@email.com',
    password: 'Demo@2024',
    role: 'Patient',
    name: 'Kavya Reddy'
  }
}
