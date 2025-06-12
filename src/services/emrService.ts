// EMR Integration Service
// This service handles integration with Electronic Medical Record systems

interface EMRConfig {
  enabled: boolean;
  provider: 'epic' | 'cerner' | 'allscripts' | 'athenahealth' | 'custom' | 'fhir';
  baseUrl: string;
  apiKey: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  timeout: number;
  retryAttempts: number;
}

interface PatientRecord {
  id: string;
  mrn?: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface CounselingSession {
  id: string;
  patientId: string;
  counselorId: string;
  sessionDate: string;
  sessionType: 'initial' | 'follow-up' | 'assessment' | 'intervention';
  duration: number; // minutes
  notes: string;
  aiPersona?: any;
  interventionPlan?: any;
  assessmentResults?: any;
  nextAppointment?: string;
}

interface EMRResponse {
  success: boolean;
  message: string;
  recordId?: string;
  errors?: string[];
}

class EMRService {
  private config: EMRConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EMRConfig {
    const savedConfig = localStorage.getItem('emr_config');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    
    return {
      enabled: false,
      provider: 'fhir',
      baseUrl: '',
      apiKey: '',
      timeout: 30,
      retryAttempts: 3
    };
  }

  public updateConfig(newConfig: Partial<EMRConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('emr_config', JSON.stringify(this.config));
  }

  public getConfig(): EMRConfig {
    return { ...this.config };
  }

  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config.enabled) {
      return { success: false, message: 'EMR integration is disabled' };
    }

    try {
      const response = await this.makeRequest('GET', '/health', {});
      return { success: true, message: 'EMR connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: `EMR connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Create or update patient record in EMR
  public async syncPatientRecord(patient: PatientRecord): Promise<EMRResponse> {
    if (!this.config.enabled) {
      return { success: false, message: 'EMR integration is disabled' };
    }

    try {
      const fhirPatient = this.convertToFHIRPatient(patient);
      const response = await this.makeRequest('POST', '/Patient', fhirPatient);
      
      return {
        success: true,
        message: 'Patient record synced successfully',
        recordId: response.id
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to sync patient record: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Send counseling session data to EMR
  public async createCounselingRecord(session: CounselingSession): Promise<EMRResponse> {
    if (!this.config.enabled) {
      return { success: false, message: 'EMR integration is disabled' };
    }

    try {
      const fhirEncounter = this.convertToFHIREncounter(session);
      const response = await this.makeRequest('POST', '/Encounter', fhirEncounter);
      
      // Also create observation records for AI analysis if available
      if (session.aiPersona || session.interventionPlan) {
        await this.createAIAnalysisObservations(session, response.id);
      }

      return {
        success: true,
        message: 'Counseling session recorded successfully',
        recordId: response.id
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create counseling record: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Send AI analysis results as clinical observations
  public async sendAIAnalysis(patientId: string, aiPersona: any, interventionPlan: any): Promise<EMRResponse> {
    if (!this.config.enabled) {
      return { success: false, message: 'EMR integration is disabled' };
    }

    try {
      const observations = this.convertAIAnalysisToFHIR(patientId, aiPersona, interventionPlan);
      
      const results = await Promise.all(
        observations.map(obs => this.makeRequest('POST', '/Observation', obs))
      );

      return {
        success: true,
        message: `AI analysis sent successfully (${results.length} observations created)`,
        recordId: results[0]?.id
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to send AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Retrieve patient data from EMR
  public async getPatientData(patientId: string): Promise<{ success: boolean; data?: any; message: string }> {
    if (!this.config.enabled) {
      return { success: false, message: 'EMR integration is disabled' };
    }

    try {
      const patient = await this.makeRequest('GET', `/Patient/${patientId}`, {});
      const encounters = await this.makeRequest('GET', `/Encounter?patient=${patientId}`, {});
      const observations = await this.makeRequest('GET', `/Observation?patient=${patientId}`, {});

      return {
        success: true,
        data: {
          patient,
          encounters: encounters.entry || [],
          observations: observations.entry || []
        },
        message: 'Patient data retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve patient data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async makeRequest(method: string, endpoint: string, data: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout * 1000);

    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      };

      // Add authentication based on provider
      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const options: RequestInit = {
        method,
        headers,
        signal: controller.signal
      };

      if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EMR API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private convertToFHIRPatient(patient: PatientRecord): any {
    return {
      resourceType: 'Patient',
      id: patient.id,
      identifier: patient.mrn ? [{
        use: 'usual',
        type: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MR'
          }]
        },
        value: patient.mrn
      }] : [],
      name: [{
        use: 'official',
        family: patient.lastName,
        given: [patient.firstName]
      }],
      gender: patient.gender.toLowerCase(),
      birthDate: patient.dateOfBirth,
      telecom: [
        ...(patient.email ? [{
          system: 'email',
          value: patient.email,
          use: 'home'
        }] : []),
        ...(patient.phone ? [{
          system: 'phone',
          value: patient.phone,
          use: 'home'
        }] : [])
      ],
      address: patient.address ? [{
        use: 'home',
        line: [patient.address.street],
        city: patient.address.city,
        state: patient.address.state,
        postalCode: patient.address.zipCode
      }] : []
    };
  }

  private convertToFHIREncounter(session: CounselingSession): any {
    return {
      resourceType: 'Encounter',
      status: 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory'
      },
      type: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '386053000',
          display: 'Evaluation procedure'
        }]
      }],
      subject: {
        reference: `Patient/${session.patientId}`
      },
      participant: [{
        individual: {
          reference: `Practitioner/${session.counselorId}`
        }
      }],
      period: {
        start: session.sessionDate,
        end: new Date(new Date(session.sessionDate).getTime() + session.duration * 60000).toISOString()
      },
      reasonCode: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '8619003',
          display: 'Infertility counseling'
        }]
      }],
      note: [{
        text: session.notes
      }]
    };
  }

  private convertAIAnalysisToFHIR(patientId: string, aiPersona: any, interventionPlan: any): any[] {
    const observations = [];

    // Psychological profile observation
    if (aiPersona?.psychologicalProfile) {
      observations.push({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'survey',
            display: 'Survey'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '72133-2',
            display: 'Psychological assessment'
          }]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: new Date().toISOString(),
        valueString: JSON.stringify(aiPersona.psychologicalProfile),
        note: [{
          text: 'AI-generated psychological profile for fertility counseling'
        }]
      });
    }

    // Intervention plan observation
    if (interventionPlan?.overview) {
      observations.push({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'therapy',
            display: 'Therapy'
          }]
        }],
        code: {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '182836005',
            display: 'Review of treatment plan'
          }]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: new Date().toISOString(),
        valueString: JSON.stringify(interventionPlan),
        note: [{
          text: 'AI-generated personalized intervention plan'
        }]
      });
    }

    return observations;
  }

  private async createAIAnalysisObservations(session: CounselingSession, encounterId: string): Promise<void> {
    if (session.aiPersona || session.interventionPlan) {
      const observations = this.convertAIAnalysisToFHIR(session.patientId, session.aiPersona, session.interventionPlan);
      
      // Link observations to the encounter
      observations.forEach(obs => {
        obs.encounter = { reference: `Encounter/${encounterId}` };
      });

      await Promise.all(
        observations.map(obs => this.makeRequest('POST', '/Observation', obs))
      );
    }
  }
}

// Export singleton instance
export const emrService = new EMRService();
export type { EMRConfig, PatientRecord, CounselingSession, EMRResponse };
