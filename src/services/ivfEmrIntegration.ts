// IVF EMR Integration Service
// Comprehensive bidirectional integration with IVF EMR systems

import { emrService, EMRConfig, PatientRecord, CounselingSession } from './emrService';

// IVF-Specific Data Models
interface IVFPatientData extends PatientRecord {
  // IVF-specific fields
  partnerId?: string;
  partnerName?: string;
  partnerAge?: number;
  diagnosisPrimary?: string;
  diagnosisSecondary?: string;
  amh?: number; // Anti-Müllerian Hormone
  fsh?: number; // Follicle Stimulating Hormone
  lh?: number; // Luteinizing Hormone
  estradiol?: number;
  progesterone?: number;
  testosteroneTotal?: number;
  prolactin?: number;
  thyroidTSH?: number;
  vitaminD?: number;
  bmi?: number;
  bloodType?: string;
  rhFactor?: string;
  geneticScreening?: any;
  infectiousDisease?: any;
  previousPregnancies?: number;
  liveBirths?: number;
  miscarriages?: number;
  ectopicPregnancies?: number;
  currentCycle?: IVFCycle;
  treatmentHistory?: IVFTreatment[];
}

interface IVFCycle {
  id: string;
  cycleNumber: number;
  protocol: string; // Long, Short, Antagonist, Natural, etc.
  startDate: string;
  expectedRetrievalDate?: string;
  expectedTransferDate?: string;
  status: 'planning' | 'stimulation' | 'monitoring' | 'retrieval' | 'transfer' | 'waiting' | 'completed' | 'cancelled';
  medications?: IVFMedication[];
  monitoring?: IVFMonitoring[];
  procedures?: IVFProcedure[];
  outcomes?: IVFOutcome;
}

interface IVFMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  route: string; // oral, injection, nasal, etc.
  instructions?: string;
}

interface IVFMonitoring {
  date: string;
  type: 'ultrasound' | 'bloodwork' | 'both';
  follicleCount?: number;
  leadFollicleSize?: number;
  endometrialThickness?: number;
  estradiol?: number;
  lh?: number;
  progesterone?: number;
  notes?: string;
}

interface IVFProcedure {
  id: string;
  type: 'egg_retrieval' | 'embryo_transfer' | 'iui' | 'biopsy' | 'hysteroscopy' | 'laparoscopy';
  date: string;
  physician: string;
  location: string;
  anesthesia?: string;
  results?: any;
  complications?: string;
  notes?: string;
}

interface IVFOutcome {
  eggsRetrieved?: number;
  matureEggs?: number;
  fertilized?: number;
  embryosDay3?: number;
  embryosDay5?: number;
  embryosTransferred?: number;
  embryosFrozen?: number;
  pregnancyTest?: {
    date: string;
    result: 'positive' | 'negative';
    betaHCG?: number;
  };
  clinicalPregnancy?: boolean;
  liveBirth?: boolean;
  complications?: string[];
}

interface IVFTreatment {
  id: string;
  type: 'ivf' | 'icsi' | 'iui' | 'fet' | 'egg_freezing' | 'sperm_freezing';
  startDate: string;
  endDate?: string;
  clinic: string;
  physician: string;
  cycles: IVFCycle[];
  outcome: 'ongoing' | 'successful' | 'unsuccessful' | 'cancelled';
  notes?: string;
}

// Counseling Integration Data
interface IVFCounselingData {
  sessionId: string;
  patientId: string;
  counselorId: string;
  sessionDate: string;
  sessionType: 'pre_treatment' | 'during_treatment' | 'post_treatment' | 'crisis' | 'decision_making';
  aiPersonaAnalysis?: {
    psychologicalProfile: any;
    copingStrategies: string[];
    riskFactors: string[];
    recommendations: string[];
  };
  interventionPlan?: {
    phases: any[];
    goals: string[];
    strategies: string[];
    timeline: string;
  };
  assessmentResults?: {
    anxietyScore?: number;
    depressionScore?: number;
    stressLevel?: number;
    copingScore?: number;
    relationshipSatisfaction?: number;
  };
  treatmentRecommendations?: string[];
  nextSteps?: string[];
  referrals?: string[];
}

// EMR Integration Configuration for IVF
interface IVFEMRConfig extends EMRConfig {
  ivfSpecific: {
    cycleManagement: boolean;
    medicationTracking: boolean;
    monitoringIntegration: boolean;
    labResultsSync: boolean;
    procedureScheduling: boolean;
    outcomeTracking: boolean;
    counselingIntegration: boolean;
    aiAnalysisSharing: boolean;
  };
  webhooks?: {
    enabled: boolean;
    endpoints: {
      cycleUpdates?: string;
      labResults?: string;
      appointments?: string;
      procedures?: string;
    };
    authentication: {
      type: 'bearer' | 'hmac' | 'basic';
      secret: string;
    };
  };
}

class IVFEMRIntegration {
  private config: IVFEMRConfig;
  private isInitialized = false;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  private getDefaultConfig(): IVFEMRConfig {
    return {
      enabled: false,
      provider: 'custom',
      baseUrl: '',
      apiKey: '',
      timeout: 30000,
      retryAttempts: 3,
      ivfSpecific: {
        cycleManagement: true,
        medicationTracking: true,
        monitoringIntegration: true,
        labResultsSync: true,
        procedureScheduling: true,
        outcomeTracking: true,
        counselingIntegration: true,
        aiAnalysisSharing: true,
      },
      webhooks: {
        enabled: false,
        endpoints: {},
        authentication: {
          type: 'bearer',
          secret: '',
        },
      },
    };
  }

  public configure(config: Partial<IVFEMRConfig>): void {
    this.config = { ...this.config, ...config };
    this.isInitialized = true;
  }

  public getConfig(): IVFEMRConfig {
    return this.config;
  }

  // Test EMR connection with IVF-specific endpoints
  public async testConnection(): Promise<{ success: boolean; message: string; capabilities?: string[] }> {
    if (!this.config.enabled) {
      return { success: false, message: 'IVF EMR integration is disabled' };
    }

    try {
      // Test basic connection
      const basicTest = await emrService.testConnection();
      if (!basicTest.success) {
        return basicTest;
      }

      // Test IVF-specific endpoints
      const capabilities = await this.testIVFCapabilities();
      
      return {
        success: true,
        message: 'IVF EMR connection successful',
        capabilities,
      };
    } catch (error) {
      return {
        success: false,
        message: `IVF EMR connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private async testIVFCapabilities(): Promise<string[]> {
    const capabilities: string[] = [];
    const endpoints = [
      { name: 'Patient Management', path: '/Patient' },
      { name: 'Cycle Management', path: '/IVFCycle' },
      { name: 'Medication Tracking', path: '/MedicationRequest' },
      { name: 'Lab Results', path: '/Observation' },
      { name: 'Procedures', path: '/Procedure' },
      { name: 'Appointments', path: '/Appointment' },
    ];

    for (const endpoint of endpoints) {
      try {
        await this.makeRequest('GET', `${endpoint.path}?_count=1`);
        capabilities.push(endpoint.name);
      } catch (error) {
        // Endpoint not available
      }
    }

    return capabilities;
  }

  // Pull patient data from EMR
  public async pullPatientData(patientId: string): Promise<{
    success: boolean;
    data?: IVFPatientData;
    message: string;
  }> {
    if (!this.config.enabled) {
      return { success: false, message: 'IVF EMR integration is disabled' };
    }

    try {
      // Get basic patient data
      const patientResponse = await emrService.getPatientData(patientId);
      if (!patientResponse.success) {
        return patientResponse;
      }

      // Get IVF-specific data
      const ivfData = await this.getIVFSpecificData(patientId);
      
      const combinedData: IVFPatientData = {
        ...patientResponse.data.patient,
        ...ivfData,
      };

      return {
        success: true,
        data: combinedData,
        message: 'Patient data retrieved successfully from EMR',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to pull patient data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private async getIVFSpecificData(patientId: string): Promise<Partial<IVFPatientData>> {
    const ivfData: Partial<IVFPatientData> = {};

    try {
      // Get lab results
      const labResults = await this.makeRequest('GET', `/Observation?patient=${patientId}&category=laboratory`);
      this.parseLabResults(labResults, ivfData);

      // Get current cycle
      const cycles = await this.makeRequest('GET', `/IVFCycle?patient=${patientId}&status=active`);
      if (cycles.entry && cycles.entry.length > 0) {
        ivfData.currentCycle = this.parseIVFCycle(cycles.entry[0].resource);
      }

      // Get treatment history
      const treatments = await this.makeRequest('GET', `/IVFTreatment?patient=${patientId}`);
      if (treatments.entry) {
        ivfData.treatmentHistory = treatments.entry.map((entry: any) => 
          this.parseIVFTreatment(entry.resource)
        );
      }
    } catch (error) {
      console.warn('Some IVF-specific data could not be retrieved:', error);
    }

    return ivfData;
  }

  // Push counseling data to EMR
  public async pushCounselingData(counselingData: IVFCounselingData): Promise<{
    success: boolean;
    recordId?: string;
    message: string;
  }> {
    if (!this.config.enabled) {
      return { success: false, message: 'IVF EMR integration is disabled' };
    }

    try {
      // Create encounter record
      const encounter = await this.createCounselingEncounter(counselingData);
      
      // Create AI analysis observations if enabled
      if (this.config.ivfSpecific.aiAnalysisSharing && counselingData.aiPersonaAnalysis) {
        await this.createAIAnalysisRecords(counselingData, encounter.id);
      }

      // Create intervention plan if available
      if (counselingData.interventionPlan) {
        await this.createInterventionPlanRecord(counselingData, encounter.id);
      }

      // Create assessment results
      if (counselingData.assessmentResults) {
        await this.createAssessmentRecords(counselingData, encounter.id);
      }

      return {
        success: true,
        recordId: encounter.id,
        message: 'Counseling data successfully pushed to EMR',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to push counseling data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    // Use the existing EMR service for API calls
    return emrService['makeRequest'](method, endpoint, data);
  }

  // Helper methods for data parsing and creation
  private parseLabResults(labResults: any, ivfData: Partial<IVFPatientData>): void {
    // Parse lab results and populate IVF-specific hormone levels
    // Implementation would map LOINC codes to IVF parameters
  }

  private parseIVFCycle(cycleResource: any): IVFCycle {
    // Parse FHIR resource to IVF cycle format
    return {
      id: cycleResource.id,
      cycleNumber: cycleResource.identifier?.[0]?.value || 1,
      protocol: cycleResource.category?.coding?.[0]?.display || 'Unknown',
      startDate: cycleResource.period?.start || new Date().toISOString(),
      status: this.mapCycleStatus(cycleResource.status),
    };
  }

  private parseIVFTreatment(treatmentResource: any): IVFTreatment {
    // Parse FHIR resource to IVF treatment format
    return {
      id: treatmentResource.id,
      type: treatmentResource.code?.coding?.[0]?.code || 'ivf',
      startDate: treatmentResource.performedPeriod?.start || new Date().toISOString(),
      clinic: treatmentResource.location?.display || 'Unknown',
      physician: treatmentResource.performer?.[0]?.display || 'Unknown',
      cycles: [],
      outcome: 'ongoing',
    };
  }

  private mapCycleStatus(fhirStatus: string): IVFCycle['status'] {
    const statusMap: Record<string, IVFCycle['status']> = {
      'planned': 'planning',
      'in-progress': 'stimulation',
      'completed': 'completed',
      'cancelled': 'cancelled',
    };
    return statusMap[fhirStatus] || 'planning';
  }

  private async createCounselingEncounter(counselingData: IVFCounselingData): Promise<any> {
    const encounter = {
      resourceType: 'Encounter',
      status: 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory',
      },
      type: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '386053000',
          display: 'Evaluation procedure',
        }],
      }],
      subject: {
        reference: `Patient/${counselingData.patientId}`,
      },
      participant: [{
        individual: {
          reference: `Practitioner/${counselingData.counselorId}`,
        },
      }],
      period: {
        start: counselingData.sessionDate,
        end: counselingData.sessionDate,
      },
      reasonCode: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '183964008',
          display: 'Treatment compliance',
        }],
      }],
    };

    return this.makeRequest('POST', '/Encounter', encounter);
  }

  private async createAIAnalysisRecords(counselingData: IVFCounselingData, encounterId: string): Promise<void> {
    if (!counselingData.aiPersonaAnalysis) return;

    const observations = [
      {
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'survey',
            display: 'Survey',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '72133-2',
            display: 'Psychological assessment',
          }],
        },
        subject: {
          reference: `Patient/${counselingData.patientId}`,
        },
        encounter: {
          reference: `Encounter/${encounterId}`,
        },
        valueString: JSON.stringify(counselingData.aiPersonaAnalysis),
        component: counselingData.aiPersonaAnalysis.riskFactors?.map((factor: string, index: number) => ({
          code: {
            coding: [{
              system: 'http://loinc.org',
              code: `72133-2-${index}`,
              display: 'Risk Factor',
            }],
          },
          valueString: factor,
        })) || [],
      },
    ];

    await Promise.all(
      observations.map(obs => this.makeRequest('POST', '/Observation', obs))
    );
  }

  private async createInterventionPlanRecord(counselingData: IVFCounselingData, encounterId: string): Promise<void> {
    if (!counselingData.interventionPlan) return;

    const carePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      intent: 'plan',
      category: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '182836005',
          display: 'Review of care plan',
        }],
      }],
      subject: {
        reference: `Patient/${counselingData.patientId}`,
      },
      encounter: {
        reference: `Encounter/${encounterId}`,
      },
      description: 'AI-Generated Intervention Plan for IVF Counseling',
      activity: counselingData.interventionPlan.phases?.map((phase: any, index: number) => ({
        detail: {
          code: {
            text: phase.name || `Phase ${index + 1}`,
          },
          status: 'not-started',
          description: phase.description || '',
          scheduledTiming: {
            repeat: {
              duration: phase.duration || 1,
              durationUnit: 'wk',
            },
          },
        },
      })) || [],
    };

    await this.makeRequest('POST', '/CarePlan', carePlan);
  }

  private async createAssessmentRecords(counselingData: IVFCounselingData, encounterId: string): Promise<void> {
    if (!counselingData.assessmentResults) return;

    const assessmentObservations = Object.entries(counselingData.assessmentResults)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => ({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'survey',
            display: 'Survey',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: this.getLoincCodeForAssessment(key),
            display: this.getDisplayNameForAssessment(key),
          }],
        },
        subject: {
          reference: `Patient/${counselingData.patientId}`,
        },
        encounter: {
          reference: `Encounter/${encounterId}`,
        },
        valueQuantity: {
          value: value,
          unit: 'score',
        },
      }));

    await Promise.all(
      assessmentObservations.map(obs => this.makeRequest('POST', '/Observation', obs))
    );
  }

  private getLoincCodeForAssessment(assessmentType: string): string {
    const loincMap: Record<string, string> = {
      anxietyScore: '72133-2',
      depressionScore: '44249-1',
      stressLevel: '72133-2',
      copingScore: '72133-2',
      relationshipSatisfaction: '72133-2',
    };
    return loincMap[assessmentType] || '72133-2';
  }

  private getDisplayNameForAssessment(assessmentType: string): string {
    const displayMap: Record<string, string> = {
      anxietyScore: 'Anxiety Assessment Score',
      depressionScore: 'Depression Assessment Score',
      stressLevel: 'Stress Level Assessment',
      copingScore: 'Coping Strategies Assessment',
      relationshipSatisfaction: 'Relationship Satisfaction Score',
    };
    return displayMap[assessmentType] || 'Assessment Score';
  }
}

// Export singleton instance
export const ivfEmrIntegration = new IVFEMRIntegration();
export type { 
  IVFPatientData, 
  IVFCycle, 
  IVFTreatment, 
  IVFCounselingData, 
  IVFEMRConfig,
  IVFMedication,
  IVFMonitoring,
  IVFProcedure,
  IVFOutcome
};
