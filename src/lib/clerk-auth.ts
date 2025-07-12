import { currentUser } from '@clerk/nextjs'

export interface UserProfile {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  role: 'PATIENT' | 'COUNSELOR' | 'CLINIC_ADMIN' | 'SUPER_ADMIN'
  clinicId?: string
  avatarUrl?: string
  phone?: string
  isActive: boolean
  lastLoginAt?: Date
}

export interface ClinicProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  website?: string
  logoUrl?: string
  subscriptionPlan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
  subscriptionStatus: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
  maxCounselors: number
  maxPatients: number
  settings?: any
}

// Get current user from Clerk and sync with our database
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return null
    }

    // In a real application, you would:
    // 1. Query your database for user by clerkId
    // 2. If user doesn't exist, create them
    // 3. Return the user profile

    // For demo purposes, return a mock user
    const mockUser: UserProfile = {
      id: `user_${clerkUser.id}`,
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role: 'COUNSELOR', // Default role, would be determined from database
      clinicId: 'clinic_demo_123', // Would come from database
      avatarUrl: clerkUser.imageUrl,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber || undefined,
      isActive: true,
      lastLoginAt: new Date()
    }

    return mockUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get clinic profile for current user
export async function getCurrentClinic(): Promise<ClinicProfile | null> {
  try {
    const user = await getCurrentUser()
    
    if (!user || !user.clinicId) {
      return null
    }

    // In a real application, you would query your database for clinic
    // For demo purposes, return a mock clinic
    const mockClinic: ClinicProfile = {
      id: user.clinicId,
      name: 'Demo Fertility Clinic',
      email: 'admin@demofertilityclinic.com',
      phone: '+1 (555) 123-4567',
      address: '123 Medical Center Dr, Healthcare City, HC 12345',
      website: 'https://www.demofertilityclinic.com',
      logoUrl: null,
      subscriptionPlan: 'PREMIUM',
      subscriptionStatus: 'ACTIVE',
      maxCounselors: 15,
      maxPatients: 500,
      settings: {
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981'
        },
        features: {
          assessmentTools: true,
          treatmentPlanning: true,
          progressTracking: true,
          resourceLibrary: true,
          emrIntegration: true
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: true
        }
      }
    }

    return mockClinic
  } catch (error) {
    console.error('Error getting current clinic:', error)
    return null
  }
}

// Check if user has specific role
export function hasRole(user: UserProfile | null, role: string): boolean {
  return user?.role === role
}

// Check if user is admin (clinic admin or super admin)
export function isAdmin(user: UserProfile | null): boolean {
  return user?.role === 'CLINIC_ADMIN' || user?.role === 'SUPER_ADMIN'
}

// Check if user belongs to specific clinic
export function belongsToClinic(user: UserProfile | null, clinicId: string): boolean {
  return user?.clinicId === clinicId
}

// Sync Clerk user with our database
export async function syncUserWithDatabase(clerkUser: any): Promise<UserProfile> {
  // In a real application, you would:
  // 1. Check if user exists in database by clerkId
  // 2. If not, create new user record
  // 3. Update user's lastLoginAt
  // 4. Return user profile

  // For demo purposes, return mock user
  return {
    id: `user_${clerkUser.id}`,
    clerkId: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
    role: 'COUNSELOR',
    clinicId: 'clinic_demo_123',
    avatarUrl: clerkUser.imageUrl,
    phone: clerkUser.phoneNumbers[0]?.phoneNumber || undefined,
    isActive: true,
    lastLoginAt: new Date()
  }
}
