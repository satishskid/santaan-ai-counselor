import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest } from '../_lib/middleware';
import { db } from '../_lib/database';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return apiResponse.error(res, 'Method not allowed', 405);
  }

  // Authenticate user
  if (!authenticate(req, res)) return;

  try {
    // Build where clauses based on user role
    const patientWhere: any = {};
    const appointmentWhere: any = {};
    const assessmentWhere: any = {};
    const treatmentPlanWhere: any = {};

    if (req.user?.role === 'COUNSELOR') {
      // Counselors see only their assigned patients' data
      patientWhere.counselorId = req.user.id;
      appointmentWhere.counselorId = req.user.id;
      assessmentWhere.counselorId = req.user.id;
      treatmentPlanWhere.counselorId = req.user.id;
    } else if (req.user?.role === 'PATIENT') {
      // Patients see only their own data
      patientWhere.userId = req.user.id;
      appointmentWhere.patient = { userId: req.user.id };
      assessmentWhere.patient = { userId: req.user.id };
      treatmentPlanWhere.patient = { userId: req.user.id };
    }

    // Fetch all required data in parallel
    const [
      patients,
      upcomingAppointments,
      treatmentPlans,
      assessments,
      todaysAppointments,
      recentPatients
    ] = await Promise.all([
      // Total patients
      db.patient.findMany({ where: patientWhere }),
      
      // Upcoming appointments
      db.appointment.findMany({
        where: {
          ...appointmentWhere,
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
      
      // Treatment plans
      db.treatmentPlan.findMany({ where: treatmentPlanWhere }),
      
      // Assessments
      db.assessment.findMany({ where: assessmentWhere }),
      
      // Today's appointments
      db.appointment.findMany({
        where: {
          ...appointmentWhere,
          appointmentDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        include: {
          patient: true,
          counselor: true,
        },
        orderBy: { appointmentDate: 'asc' },
        take: 5,
      }),
      
      // Recent patients
      db.patient.findMany({
        where: patientWhere,
        include: {
          counselor: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate statistics
    const stats = {
      totalPatients: patients.length,
      upcomingAppointments: upcomingAppointments.length,
      activeTreatmentPlans: treatmentPlans.filter(tp => tp.status === 'ACTIVE').length,
      completedAssessments: assessments.filter(a => a.status === 'COMPLETED').length,
      
      // Additional stats
      newPatients: patients.filter(p => p.status === 'NEW').length,
      activePatients: patients.filter(p => p.status === 'ACTIVE').length,
      totalTreatmentPlans: treatmentPlans.length,
      draftTreatmentPlans: treatmentPlans.filter(tp => tp.status === 'DRAFT').length,
      completedTreatmentPlans: treatmentPlans.filter(tp => tp.status === 'COMPLETED').length,
      
      // Assessment stats
      totalAssessments: assessments.length,
      pendingAssessments: assessments.filter(a => a.status === 'NOT_STARTED').length,
      inProgressAssessments: assessments.filter(a => a.status === 'IN_PROGRESS').length,
      
      // Recent data
      recentPatients: recentPatients.map(patient => ({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        status: patient.status,
        createdAt: patient.createdAt,
        counselor: patient.counselor ? {
          id: patient.counselor.id,
          fullName: patient.counselor.fullName,
        } : null,
      })),
      
      todaysAppointments: todaysAppointments.map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        patient: {
          id: appointment.patient.id,
          firstName: appointment.patient.firstName,
          lastName: appointment.patient.lastName,
        },
        counselor: appointment.counselor ? {
          id: appointment.counselor.id,
          fullName: appointment.counselor.fullName,
        } : null,
      })),
      
      upcomingAppointmentsList: upcomingAppointments.slice(0, 5).map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        patient: {
          id: appointment.patient.id,
          firstName: appointment.patient.firstName,
          lastName: appointment.patient.lastName,
        },
        counselor: appointment.counselor ? {
          id: appointment.counselor.id,
          fullName: appointment.counselor.fullName,
        } : null,
      })),
    };

    return apiResponse.success(res, stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return apiResponse.error(res, 'Failed to fetch dashboard stats', 500);
  }
};

export default withErrorHandling(handler);
