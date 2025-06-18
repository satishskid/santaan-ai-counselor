import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a single instance of PrismaClient for serverless functions
export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Database connection helper
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// Graceful disconnect
export const disconnectDB = async () => {
  await prisma.$disconnect();
};

// Health check for database
export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection is working' };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', message: 'Database connection failed', error: error.message };
  }
};

// Database helper functions for common operations
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
      },
      orderBy: { createdAt: 'desc' }
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

  // Assessment operations
  assessment: {
    findMany: (where?: any, include?: any) => prisma.assessment.findMany({
      where,
      include: include || {
        patient: true,
        counselor: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    findUnique: (id: string) => prisma.assessment.findUnique({ where: { id } }),
    create: (data: any) => prisma.assessment.create({ data }),
    update: (id: string, data: any) => prisma.assessment.update({ where: { id }, data }),
    delete: (id: string) => prisma.assessment.delete({ where: { id } }),
  },

  // Treatment plan operations
  treatmentPlan: {
    findMany: (where?: any, include?: any) => prisma.treatmentPlan.findMany({
      where,
      include: include || {
        patient: true,
        counselor: true,
        milestones: true,
        interventions: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    findUnique: (id: string) => prisma.treatmentPlan.findUnique({ where: { id } }),
    create: (data: any) => prisma.treatmentPlan.create({ data }),
    update: (id: string, data: any) => prisma.treatmentPlan.update({ where: { id }, data }),
    delete: (id: string) => prisma.treatmentPlan.delete({ where: { id } }),
  },

  // Appointment operations
  appointment: {
    findMany: (where?: any, include?: any) => prisma.appointment.findMany({
      where,
      include: include || {
        patient: true,
        counselor: true,
      },
      orderBy: { appointmentDate: 'asc' }
    }),
    findUnique: (id: string) => prisma.appointment.findUnique({ where: { id } }),
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
};
