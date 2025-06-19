// API layer for frontend-backend communication
// This provides a clean interface between components and the API server

// API base URL - automatically detects environment
const API_BASE_URL = import.meta.env?.VITE_API_URL ||
  (import.meta.env?.PROD ? '' : 'http://localhost:3001')

// Types for API responses
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// Helper function to make API calls with authentication
const apiCall = async <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem('accessToken')

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))

      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        // Optionally redirect to login
      }

      return {
        data: null,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        success: false,
      }
    }

    const data = await response.json()
    return { data, error: null, success: true }
  } catch (error) {
    console.error('API call failed:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error occurred',
      success: false,
    }
  }
}

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiCall<{ user: any; accessToken: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: {
    email: string;
    password: string;
    fullName: string;
    role?: string
  }) =>
    apiCall<{ user: any; accessToken: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiCall<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  refreshToken: () =>
    apiCall<{ user: any; accessToken: string; message: string }>('/api/auth/refresh', {
      method: 'POST',
    }),

  getProfile: () =>
    apiCall<{ user: any; message: string }>('/api/auth/me'),

  // Helper functions for token management
  setToken: (token: string) => {
    localStorage.setItem('accessToken', token)
  },

  getToken: () => {
    return localStorage.getItem('accessToken')
  },

  removeToken: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },

  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user))
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}

// Health Check API
export const healthApi = {
  check: () => apiCall<{
    status: string;
    timestamp: string;
    environment: string;
    version: string;
    uptime: number;
    memory: { used: number; total: number };
    database: { status: string; message: string };
  }>('/api/health'),
}

// Patient API
export const patientApi = {
  getAll: () => apiCall<any[]>('/api/patients'),

  getById: (id: string) => apiCall<any>(`/api/patients/${id}`),

  create: (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    dateOfBirth?: Date
    gender?: string
    diagnosis?: string
    counselorId?: string
  }) => apiCall<any>('/api/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiCall<any>(`/api/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<any>(`/api/patients/${id}`, {
    method: 'DELETE',
  }),
}

// Medical History API
export const medicalHistoryApi = {
  create: (data: {
    patientId: string
    previousTreatments?: string
    medicalConditions?: string
    medications?: string
    allergies?: string
    familyHistory?: string
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (patientId: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  getByPatient: (patientId: string) => Promise.resolve({ success: true, data: [], error: null }),
}

// Fertility Journey API
export const fertilityJourneyApi = {
  create: (data: {
    patientId: string
    tryingToConceiveSince?: string
    previousIVFAttempts?: string
    challenges?: string
    expectations?: string
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (patientId: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  getByPatient: (patientId: string) => Promise.resolve({ success: true, data: [], error: null }),
}

// Treatment Pathway API
export const treatmentPathwayApi = {
  create: (data: {
    patientId: string
    preferredTreatment?: string
    timeframe?: string
    additionalNotes?: string
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (patientId: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  getByPatient: (patientId: string) => Promise.resolve({ success: true, data: [], error: null }),
}

// Assessment API
export const assessmentApi = {
  getAll: (patientId?: string) => {
    const url = patientId ? `/api/assessments?patientId=${patientId}` : '/api/assessments'
    return apiCall<any[]>(url)
  },

  getById: (id: string) => apiCall<any>(`/api/assessments/${id}`),

  create: (data: {
    patientId: string
    counselorId?: string
    assessmentType: string
    questions?: string
    answers?: string
    score?: number
    notes?: string
  }) => apiCall<any>('/api/assessments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiCall<any>(`/api/assessments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<any>(`/api/assessments/${id}`, {
    method: 'DELETE',
  }),
}

// Treatment Plan API
export const treatmentPlanApi = {
  getAll: (patientId?: string) => {
    const url = patientId ? `/api/treatment-plans?patientId=${patientId}` : '/api/treatment-plans'
    return apiCall<any[]>(url)
  },

  getById: (id: string) => apiCall<any>(`/api/treatment-plans/${id}`),

  create: (data: {
    patientId: string
    counselorId?: string
    title: string
    description?: string
    templateId?: string
    startDate?: Date
    endDate?: Date
    milestones?: Array<{
      title: string
      description?: string
      targetDate?: Date
      notes?: string
    }>
    interventions?: Array<{
      title: string
      description?: string
      type?: string
      frequency?: string
      duration?: string
      notes?: string
    }>
  }) => apiCall<any>('/api/treatment-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiCall<any>(`/api/treatment-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<any>(`/api/treatment-plans/${id}`, {
    method: 'DELETE',
  }),
}

// Milestone API
export const milestoneApi = {
  create: (data: {
    treatmentPlanId: string
    title: string
    description?: string
    targetDate?: Date
    notes?: string
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (id: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  delete: (id: string) => Promise.resolve({ success: true, data: null, error: null }),

  getByTreatmentPlan: (treatmentPlanId: string) => Promise.resolve({ success: true, data: [], error: null }),
}

// Appointment API
export const appointmentApi = {
  getAll: (patientId?: string) => {
    const url = patientId ? `/api/appointments?patientId=${patientId}` : '/api/appointments'
    return apiCall<any[]>(url)
  },

  getById: (id: string) => apiCall<any>(`/api/appointments/${id}`),

  getUpcoming: () => apiCall<any[]>('/api/appointments/upcoming'),

  create: (data: {
    patientId: string
    counselorId?: string
    title: string
    description?: string
    appointmentDate: Date
    durationMinutes?: number
    type?: string
    notes?: string
  }) => apiCall<any>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiCall<any>(`/api/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<any>(`/api/appointments/${id}`, {
    method: 'DELETE',
  }),
}

// Resource API
export const resourceApi = {
  getAll: () => Promise.resolve({ success: true, data: [], error: null }),

  getById: (id: string) => Promise.resolve({ success: true, data: null, error: null }),

  create: (data: {
    title: string
    description?: string
    type: string
    url?: string
    content?: string
    tags?: string[]
    createdById?: string
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (id: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  delete: (id: string) => Promise.resolve({ success: true, data: null, error: null }),
}

// Note API
export const noteApi = {
  getByPatient: (patientId: string) => Promise.resolve({ success: true, data: [], error: null }),

  create: (data: {
    patientId: string
    counselorId?: string
    content: string
    isPrivate?: boolean
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (id: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  delete: (id: string) => Promise.resolve({ success: true, data: null, error: null }),
}

// User API
export const userApi = {
  getAll: () => Promise.resolve({ success: true, data: [], error: null }),

  getById: (id: string) => Promise.resolve({ success: true, data: null, error: null }),

  getByEmail: (email: string) => Promise.resolve({ success: true, data: null, error: null }),

  create: (data: {
    email: string
    fullName?: string
    role?: 'COUNSELOR' | 'ADMIN' | 'PATIENT'
    avatarUrl?: string
  }) => Promise.resolve({ success: true, data, error: null }),

  update: (id: string, data: any) => Promise.resolve({ success: true, data, error: null }),

  delete: (id: string) => Promise.resolve({ success: true, data: null, error: null }),
}

// Dashboard API - aggregated data for dashboard
export const dashboardApi = {
  getStats: () => apiCall<{
    totalPatients: number
    upcomingAppointments: number
    activeTreatmentPlans: number
    completedAssessments: number
    recentPatients: any[]
    todaysAppointments: any[]
  }>('/api/dashboard/stats'),
}
