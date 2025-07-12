// EMR Integration Service for Epic, Cerner, and other FHIR-compliant systems
interface EMRProvider {
  name: string
  baseUrl: string
  clientId: string
  clientSecret: string
  scope: string[]
  enabled: boolean
}

interface FHIRPatient {
  id: string
  identifier: Array<{
    system: string
    value: string
  }>
  name: Array<{
    given: string[]
    family: string
  }>
  gender: string
  birthDate: string
  telecom: Array<{
    system: string
    value: string
  }>
  address: Array<{
    line: string[]
    city: string
    state: string
    postalCode: string
    country: string
  }>
}

interface FHIRObservation {
  id: string
  status: string
  category: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
  }
  valueString?: string
  effectiveDateTime: string
}

interface EMRSyncResult {
  success: boolean
  patientsSync: number
  observationsSync: number
  errors: string[]
  lastSyncTime: string
}

export class EMRService {
  private providers: Map<string, EMRProvider> = new Map()
  private accessTokens: Map<string, { token: string; expiresAt: Date }> = new Map()

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // Epic EMR Configuration
    if (process.env.EPIC_BASE_URL && process.env.EPIC_CLIENT_ID && process.env.EPIC_CLIENT_SECRET) {
      this.providers.set('epic', {
        name: 'Epic',
        baseUrl: process.env.EPIC_BASE_URL,
        clientId: process.env.EPIC_CLIENT_ID,
        clientSecret: process.env.EPIC_CLIENT_SECRET,
        scope: ['patient/*.read', 'observation/*.read', 'condition/*.read'],
        enabled: process.env.EPIC_ENABLED === 'true'
      })
    }

    // Cerner EMR Configuration
    if (process.env.CERNER_BASE_URL && process.env.CERNER_CLIENT_ID && process.env.CERNER_CLIENT_SECRET) {
      this.providers.set('cerner', {
        name: 'Cerner',
        baseUrl: process.env.CERNER_BASE_URL,
        clientId: process.env.CERNER_CLIENT_ID,
        clientSecret: process.env.CERNER_CLIENT_SECRET,
        scope: ['patient/*.read', 'observation/*.read', 'condition/*.read'],
        enabled: process.env.CERNER_ENABLED === 'true'
      })
    }

    // Allscripts EMR Configuration
    if (process.env.ALLSCRIPTS_BASE_URL && process.env.ALLSCRIPTS_CLIENT_ID && process.env.ALLSCRIPTS_CLIENT_SECRET) {
      this.providers.set('allscripts', {
        name: 'Allscripts',
        baseUrl: process.env.ALLSCRIPTS_BASE_URL,
        clientId: process.env.ALLSCRIPTS_CLIENT_ID,
        clientSecret: process.env.ALLSCRIPTS_CLIENT_SECRET,
        scope: ['patient/*.read', 'observation/*.read', 'condition/*.read'],
        enabled: process.env.ALLSCRIPTS_ENABLED === 'true'
      })
    }

    console.log(`EMR Service initialized with ${this.providers.size} providers`)
  }

  // OAuth2 Authentication
  private async getAccessToken(providerKey: string): Promise<string | null> {
    const provider = this.providers.get(providerKey)
    if (!provider || !provider.enabled) {
      return null
    }

    // Check if we have a valid cached token
    const cachedToken = this.accessTokens.get(providerKey)
    if (cachedToken && cachedToken.expiresAt > new Date()) {
      return cachedToken.token
    }

    try {
      const response = await fetch(`${provider.baseUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${provider.clientId}:${provider.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: provider.scope.join(' ')
        })
      })

      if (!response.ok) {
        throw new Error(`OAuth2 failed for ${provider.name}: ${response.statusText}`)
      }

      const tokenData = await response.json()
      const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000))
      
      this.accessTokens.set(providerKey, {
        token: tokenData.access_token,
        expiresAt
      })

      return tokenData.access_token
    } catch (error) {
      console.error(`Failed to get access token for ${provider.name}:`, error)
      return null
    }
  }

  // Fetch patient data from EMR
  async fetchPatient(providerKey: string, patientId: string): Promise<FHIRPatient | null> {
    const provider = this.providers.get(providerKey)
    const accessToken = await this.getAccessToken(providerKey)

    if (!provider || !accessToken) {
      return null
    }

    try {
      const response = await fetch(`${provider.baseUrl}/Patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch patient from ${provider.name}:`, error)
      return null
    }
  }

  // Fetch observations for a patient
  async fetchObservations(providerKey: string, patientId: string): Promise<FHIRObservation[]> {
    const provider = this.providers.get(providerKey)
    const accessToken = await this.getAccessToken(providerKey)

    if (!provider || !accessToken) {
      return []
    }

    try {
      const response = await fetch(`${provider.baseUrl}/Observation?patient=${patientId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch observations: ${response.statusText}`)
      }

      const bundle = await response.json()
      return bundle.entry?.map((entry: any) => entry.resource) || []
    } catch (error) {
      console.error(`Failed to fetch observations from ${provider.name}:`, error)
      return []
    }
  }

  // Sync patient data from EMR to our system
  async syncPatientData(clinicId: string, emrPatientId: string, providerKey: string): Promise<EMRSyncResult> {
    const result: EMRSyncResult = {
      success: false,
      patientsSync: 0,
      observationsSync: 0,
      errors: [],
      lastSyncTime: new Date().toISOString()
    }

    try {
      // Fetch patient data
      const fhirPatient = await this.fetchPatient(providerKey, emrPatientId)
      if (!fhirPatient) {
        result.errors.push('Failed to fetch patient data from EMR')
        return result
      }

      // Convert FHIR patient to our format
      const patientData = this.convertFHIRPatientToLocal(fhirPatient, clinicId)
      
      // Save patient to our database (this would use the DatabaseService)
      // await DatabaseService.createPatient(patientData)
      result.patientsSync = 1

      // Fetch and sync observations
      const observations = await this.fetchObservations(providerKey, emrPatientId)
      result.observationsSync = observations.length

      // Convert and save observations
      for (const observation of observations) {
        const localObservation = this.convertFHIRObservationToLocal(observation, patientData.id)
        // Save observation to our database
        // await DatabaseService.createObservation(localObservation)
      }

      result.success = true
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  // Convert FHIR patient to our local format
  private convertFHIRPatientToLocal(fhirPatient: FHIRPatient, clinicId: string) {
    const name = fhirPatient.name?.[0]
    const phone = fhirPatient.telecom?.find(t => t.system === 'phone')?.value
    const email = fhirPatient.telecom?.find(t => t.system === 'email')?.value

    return {
      firstName: name?.given?.[0] || '',
      lastName: name?.family || '',
      email: email || '',
      phone: phone || '',
      dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : undefined,
      gender: fhirPatient.gender,
      clinicId,
      emrId: fhirPatient.id,
      emrSystem: 'FHIR'
    }
  }

  // Convert FHIR observation to our local format
  private convertFHIRObservationToLocal(fhirObservation: FHIRObservation, patientId: string) {
    return {
      patientId,
      emrId: fhirObservation.id,
      type: fhirObservation.code.coding?.[0]?.display || 'Unknown',
      value: fhirObservation.valueQuantity?.value?.toString() || fhirObservation.valueString || '',
      unit: fhirObservation.valueQuantity?.unit || '',
      date: new Date(fhirObservation.effectiveDateTime),
      status: fhirObservation.status
    }
  }

  // Test EMR connection
  async testConnection(providerKey: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const provider = this.providers.get(providerKey)
    if (!provider) {
      return { success: false, message: 'Provider not configured' }
    }

    if (!provider.enabled) {
      return { success: false, message: 'Provider is disabled' }
    }

    const startTime = Date.now()
    
    try {
      const accessToken = await this.getAccessToken(providerKey)
      if (!accessToken) {
        return { success: false, message: 'Failed to obtain access token' }
      }

      // Test with a simple metadata request
      const response = await fetch(`${provider.baseUrl}/metadata`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json'
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        return { 
          success: true, 
          message: `Successfully connected to ${provider.name}`,
          responseTime 
        }
      } else {
        return { 
          success: false, 
          message: `Connection failed: ${response.statusText}`,
          responseTime 
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return { 
        success: false, 
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime 
      }
    }
  }

  // Get EMR integration status
  getIntegrationStatus(): Record<string, any> {
    const status: Record<string, any> = {}
    
    for (const [key, provider] of this.providers) {
      status[key] = {
        name: provider.name,
        configured: true,
        enabled: provider.enabled,
        baseUrl: provider.baseUrl,
        hasValidToken: this.accessTokens.has(key) && 
                      this.accessTokens.get(key)!.expiresAt > new Date()
      }
    }

    return status
  }

  // Enable/disable EMR provider
  async toggleProvider(providerKey: string, enabled: boolean): Promise<boolean> {
    const provider = this.providers.get(providerKey)
    if (!provider) {
      return false
    }

    provider.enabled = enabled
    
    // Clear cached token when disabling
    if (!enabled) {
      this.accessTokens.delete(providerKey)
    }

    return true
  }

  // Utility methods
  isConfigured(): boolean {
    return this.providers.size > 0
  }

  getConfiguredProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  getEnabledProviders(): string[] {
    return Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.enabled)
      .map(([key, _]) => key)
  }
}

// Singleton instance
export const emrService = new EMRService()

export default emrService
