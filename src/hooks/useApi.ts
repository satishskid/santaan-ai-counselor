import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from '../lib/api'

// Generic hook for API operations
export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiFunction()
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Hook for mutations (create, update, delete)
export function useMutation<T, P = any>(
  mutationFunction: (params: P) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const mutate = useCallback(async (params: P) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await mutationFunction(params)
      if (response.success) {
        setData(response.data)
        return response
      } else {
        setError(response.error)
        return response
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { data: null, error: errorMessage, success: false }
    } finally {
      setLoading(false)
    }
  }, [mutationFunction])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { mutate, loading, error, data, reset }
}

// Specific hooks for common operations
export function usePatients() {
  return useApi(() => import('../lib/api').then(api => api.patientApi.getAll()))
}

export function usePatient(id: string | null) {
  return useApi(
    () => id ? import('../lib/api').then(api => api.patientApi.getById(id)) : Promise.resolve({ data: null, error: null, success: true }),
    [id]
  )
}

export function useAssessments(patientId?: string) {
  return useApi(
    () => import('../lib/api').then(api => api.assessmentApi.getAll(patientId)),
    [patientId]
  )
}

export function useTreatmentPlans(patientId?: string) {
  return useApi(
    () => import('../lib/api').then(api => api.treatmentPlanApi.getAll(patientId)),
    [patientId]
  )
}

export function useAppointments(patientId?: string) {
  return useApi(
    () => import('../lib/api').then(api => api.appointmentApi.getAll(patientId)),
    [patientId]
  )
}

export function useUpcomingAppointments() {
  return useApi(() => import('../lib/api').then(api => api.appointmentApi.getUpcoming()))
}

export function useResources() {
  return useApi(() => import('../lib/api').then(api => api.resourceApi.getAll()))
}

export function useDashboardStats() {
  return useApi(() => import('../lib/api').then(api => api.dashboardApi.getStats()))
}

export function useNotes(patientId: string | null) {
  return useApi(
    () => patientId ? import('../lib/api').then(api => api.noteApi.getByPatient(patientId)) : Promise.resolve({ data: null, error: null, success: true }),
    [patientId]
  )
}

// Mutation hooks
export function useCreatePatient() {
  return useMutation((data: any) => import('../lib/api').then(api => api.patientApi.create(data)))
}

export function useUpdatePatient() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    import('../lib/api').then(api => api.patientApi.update(id, data))
  )
}

export function useCreateAssessment() {
  return useMutation((data: any) => import('../lib/api').then(api => api.assessmentApi.create(data)))
}

export function useUpdateAssessment() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    import('../lib/api').then(api => api.assessmentApi.update(id, data))
  )
}

export function useCreateTreatmentPlan() {
  return useMutation((data: any) => import('../lib/api').then(api => api.treatmentPlanApi.create(data)))
}

export function useCreateMilestone() {
  return useMutation((data: any) => import('../lib/api').then(api => api.milestoneApi.create(data)))
}

export function useCreateAppointment() {
  return useMutation((data: any) => import('../lib/api').then(api => api.appointmentApi.create(data)))
}

export function useUpdateAppointment() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    import('../lib/api').then(api => api.appointmentApi.update(id, data))
  )
}

export function useCreateNote() {
  return useMutation((data: any) => import('../lib/api').then(api => api.noteApi.create(data)))
}

export function useCreateMedicalHistory() {
  return useMutation((data: any) => import('../lib/api').then(api => api.medicalHistoryApi.create(data)))
}

export function useCreateFertilityJourney() {
  return useMutation((data: any) => import('../lib/api').then(api => api.fertilityJourneyApi.create(data)))
}

export function useCreateTreatmentPathway() {
  return useMutation((data: any) => import('../lib/api').then(api => api.treatmentPathwayApi.create(data)))
}
