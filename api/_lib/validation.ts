import { z } from 'zod';

// User validation schemas
export const userCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['PATIENT', 'COUNSELOR', 'ADMIN']).default('PATIENT'),
  avatarUrl: z.string().url().optional(),
});

export const userUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  role: z.enum(['PATIENT', 'COUNSELOR', 'ADMIN']).optional(),
  avatarUrl: z.string().url().optional(),
});

// Patient validation schemas
export const patientCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  diagnosis: z.string().optional(),
  stage: z.string().optional(),
  counselorId: z.string().optional(),
  medicalHistory: z.object({
    previousTreatments: z.string().optional(),
    medicalConditions: z.string().optional(),
    medications: z.string().optional(),
    allergies: z.string().optional(),
    familyHistory: z.string().optional(),
  }).optional(),
  fertilityJourney: z.object({
    tryingToConceiveSince: z.string().optional(),
    previousIVFAttempts: z.string().optional(),
    challenges: z.string().optional(),
    expectations: z.string().optional(),
  }).optional(),
  treatmentPathway: z.object({
    preferredTreatment: z.string().optional(),
    timeframe: z.string().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
});

export const patientUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  diagnosis: z.string().optional(),
  stage: z.string().optional(),
  status: z.enum(['NEW', 'ACTIVE', 'INACTIVE', 'COMPLETED']).optional(),
  counselorId: z.string().optional(),
});

// Assessment validation schemas
export const assessmentCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  counselorId: z.string().optional(),
  assessmentType: z.string().min(1, 'Assessment type is required'),
  questions: z.string().optional(),
  answers: z.string().optional(),
  notes: z.string().optional(),
});

export const assessmentUpdateSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  questions: z.string().optional(),
  answers: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  completedAt: z.string().datetime().optional(),
});

// Treatment plan validation schemas
export const treatmentPlanCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  counselorId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  templateId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    description: z.string().optional(),
    targetDate: z.string().datetime().optional(),
    notes: z.string().optional(),
  })).optional(),
  interventions: z.array(z.object({
    title: z.string().min(1, 'Intervention title is required'),
    description: z.string().optional(),
    type: z.string().optional(),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});

export const treatmentPlanUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Appointment validation schemas
export const appointmentCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  counselorId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  appointmentDate: z.string().datetime('Invalid appointment date'),
  durationMinutes: z.number().min(15).max(480).default(60),
  type: z.string().optional(),
  notes: z.string().optional(),
});

export const appointmentUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  appointmentDate: z.string().datetime('Invalid appointment date').optional(),
  durationMinutes: z.number().min(15).max(480).optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  type: z.string().optional(),
  notes: z.string().optional(),
});

// Note validation schemas
export const noteCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  counselorId: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  isPrivate: z.boolean().default(false),
});

export const noteUpdateSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
  isPrivate: z.boolean().optional(),
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['PATIENT', 'COUNSELOR']).default('PATIENT'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// EMR integration validation schemas
export const emrConfigSchema = z.object({
  enabled: z.boolean(),
  provider: z.string().min(1, 'Provider is required'),
  baseUrl: z.string().url('Invalid base URL').optional(),
  apiKey: z.string().optional(),
  timeout: z.number().min(1000).max(60000).default(30000),
  retryAttempts: z.number().min(0).max(5).default(3),
});

// Query parameter validation
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 10, 100)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const patientQuerySchema = z.object({
  status: z.enum(['NEW', 'ACTIVE', 'INACTIVE', 'COMPLETED']).optional(),
  counselorId: z.string().optional(),
  search: z.string().optional(),
}).merge(paginationSchema);

export const appointmentQuerySchema = z.object({
  patientId: z.string().optional(),
  counselorId: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
}).merge(paginationSchema);
