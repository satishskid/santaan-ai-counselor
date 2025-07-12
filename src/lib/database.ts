import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a single instance of PrismaClient with production configuration
export const prisma = globalThis.__prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// In development, store the instance globally to prevent multiple instances
if (typeof globalThis !== 'undefined' && typeof window === 'undefined') {
  // Only in Node.js environment (server-side)
  globalThis.__prisma = prisma
}

// Database helper functions
export const db = {
  // User operations
  user: {
    findMany: () => prisma.user.findMany(),
    findUnique: (id: string) => prisma.user.findUnique({ where: { id } }),
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    create: (data: any) => prisma.user.create({ data }),
    update: (id: string, data: any) => prisma.user.update({ where: { id }, data }),
    delete: (id: string) => prisma.user.delete({ where: { id } }),
  },

  // Patient operations
  patient: {
    findMany: (include?: any) => prisma.patient.findMany({ 
      include: include || {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
        assessments: true,
        treatmentPlans: true,
        appointments: true,
        notes: true,
        counselor: true,
      }
    }),
    findUnique: (id: string, include?: any) => prisma.patient.findUnique({ 
      where: { id },
      include: include || {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
        assessments: true,
        treatmentPlans: {
          include: {
            milestones: true,
            interventions: true,
          }
        },
        appointments: true,
        notes: {
          include: {
            counselor: true,
          }
        },
        counselor: true,
      }
    }),
    create: (data: any) => prisma.patient.create({ data }),
    update: (id: string, data: any) => prisma.patient.update({ where: { id }, data }),
    delete: (id: string) => prisma.patient.delete({ where: { id } }),
  },

  // Medical History operations
  medicalHistory: {
    create: (data: any) => prisma.medicalHistory.create({ data }),
    update: (patientId: string, data: any) => prisma.medicalHistory.update({ 
      where: { patientId }, 
      data 
    }),
    findByPatient: (patientId: string) => prisma.medicalHistory.findUnique({ 
      where: { patientId } 
    }),
  },

  // Fertility Journey operations
  fertilityJourney: {
    create: (data: any) => prisma.fertilityJourney.create({ data }),
    update: (patientId: string, data: any) => prisma.fertilityJourney.update({ 
      where: { patientId }, 
      data 
    }),
    findByPatient: (patientId: string) => prisma.fertilityJourney.findUnique({ 
      where: { patientId } 
    }),
  },

  // Treatment Pathway operations
  treatmentPathway: {
    create: (data: any) => prisma.treatmentPathway.create({ data }),
    update: (patientId: string, data: any) => prisma.treatmentPathway.update({ 
      where: { patientId }, 
      data 
    }),
    findByPatient: (patientId: string) => prisma.treatmentPathway.findUnique({ 
      where: { patientId } 
    }),
  },

  // Assessment operations
  assessment: {
    findMany: (patientId?: string) => prisma.assessment.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        patient: true,
        counselor: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    findUnique: (id: string) => prisma.assessment.findUnique({ 
      where: { id },
      include: {
        patient: true,
        counselor: true,
      }
    }),
    create: (data: any) => prisma.assessment.create({ data }),
    update: (id: string, data: any) => prisma.assessment.update({ where: { id }, data }),
    delete: (id: string) => prisma.assessment.delete({ where: { id } }),
  },

  // Treatment Plan operations
  treatmentPlan: {
    findMany: (patientId?: string) => prisma.treatmentPlan.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        patient: true,
        counselor: true,
        milestones: true,
        interventions: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    findUnique: (id: string) => prisma.treatmentPlan.findUnique({ 
      where: { id },
      include: {
        patient: true,
        counselor: true,
        milestones: true,
        interventions: true,
      }
    }),
    create: (data: any) => prisma.treatmentPlan.create({ data }),
    update: (id: string, data: any) => prisma.treatmentPlan.update({ where: { id }, data }),
    delete: (id: string) => prisma.treatmentPlan.delete({ where: { id } }),
  },

  // Milestone operations
  milestone: {
    create: (data: any) => prisma.milestone.create({ data }),
    update: (id: string, data: any) => prisma.milestone.update({ where: { id }, data }),
    delete: (id: string) => prisma.milestone.delete({ where: { id } }),
    findByTreatmentPlan: (treatmentPlanId: string) => prisma.milestone.findMany({
      where: { treatmentPlanId },
      orderBy: { targetDate: 'asc' }
    }),
  },

  // Intervention operations
  intervention: {
    create: (data: any) => prisma.intervention.create({ data }),
    update: (id: string, data: any) => prisma.intervention.update({ where: { id }, data }),
    delete: (id: string) => prisma.intervention.delete({ where: { id } }),
    findByTreatmentPlan: (treatmentPlanId: string) => prisma.intervention.findMany({
      where: { treatmentPlanId },
      include: { milestone: true }
    }),
  },

  // Appointment operations
  appointment: {
    findMany: (patientId?: string) => prisma.appointment.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        patient: true,
        counselor: true,
      },
      orderBy: { appointmentDate: 'asc' }
    }),
    findUnique: (id: string) => prisma.appointment.findUnique({ 
      where: { id },
      include: {
        patient: true,
        counselor: true,
      }
    }),
    create: (data: any) => prisma.appointment.create({ data }),
    update: (id: string, data: any) => prisma.appointment.update({ where: { id }, data }),
    delete: (id: string) => prisma.appointment.delete({ where: { id } }),
    findUpcoming: () => prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(),
        },
        status: 'SCHEDULED',
      },
      include: {
        patient: true,
        counselor: true,
      },
      orderBy: { appointmentDate: 'asc' },
      take: 10,
    }),
  },

  // Resource operations
  resource: {
    findMany: () => prisma.resource.findMany({
      where: { isPublic: true },
      include: { createdBy: true },
      orderBy: { createdAt: 'desc' }
    }),
    findUnique: (id: string) => prisma.resource.findUnique({ 
      where: { id },
      include: { createdBy: true }
    }),
    create: (data: any) => prisma.resource.create({ data }),
    update: (id: string, data: any) => prisma.resource.update({ where: { id }, data }),
    delete: (id: string) => prisma.resource.delete({ where: { id } }),
  },

  // Patient Resource operations
  patientResource: {
    create: (data: any) => prisma.patientResource.create({ data }),
    findByPatient: (patientId: string) => prisma.patientResource.findMany({
      where: { patientId },
      include: { resource: true }
    }),
    delete: (patientId: string, resourceId: string) => prisma.patientResource.delete({
      where: { patientId_resourceId: { patientId, resourceId } }
    }),
  },

  // Note operations
  note: {
    findMany: (patientId: string) => prisma.note.findMany({
      where: { patientId },
      include: { counselor: true },
      orderBy: { createdAt: 'desc' }
    }),
    create: (data: any) => prisma.note.create({ data }),
    update: (id: string, data: any) => prisma.note.update({ where: { id }, data }),
    delete: (id: string) => prisma.note.delete({ where: { id } }),
  },
}

// Utility functions
export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

export const disconnectDB = async () => {
  await prisma.$disconnect()
}

// Seed function for development
export const seedDatabase = async () => {
  console.log('Seeding database...')
  
  // Create counselor user
  const counselor = await prisma.user.create({
    data: {
      email: 'dr.emma.wilson@santaan.in',
      fullName: 'Dr. Emma Wilson',
      role: 'COUNSELOR',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=counselor',
    },
  })

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91-9876543210',
        dateOfBirth: new Date('1990-03-15'),
        gender: 'Female',
        status: 'ACTIVE',
        diagnosis: 'PCOS',
        stage: 'Assessment',
        nextAppointment: new Date('2024-01-15T10:00:00Z'),
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        counselorId: counselor.id,
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun.patel@email.com',
        phone: '+91-9876543211',
        dateOfBirth: new Date('1988-07-22'),
        gender: 'Male',
        status: 'ACTIVE',
        diagnosis: 'Male Factor',
        stage: 'Treatment Plan',
        nextAppointment: new Date('2024-01-18T14:30:00Z'),
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
        counselorId: counselor.id,
      },
    }),
  ])

  console.log('Database seeded successfully')
  return { counselor, patients }
}
