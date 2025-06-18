import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest, validateInput, sanitizeInput } from '../_lib/middleware';
import { db } from '../_lib/database';
import { appointmentCreateSchema, appointmentQuerySchema } from '../_lib/validation';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Authenticate user
  if (!authenticate(req, res)) return;

  switch (req.method) {
    case 'GET':
      return handleGetAppointments(req, res);
    case 'POST':
      return handleCreateAppointment(req, res);
    default:
      return apiResponse.error(res, 'Method not allowed', 405);
  }
};

const handleGetAppointments = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Validate query parameters
    const queryParams = {
      ...req.query,
      page: req.query.page?.toString() || '1',
      limit: req.query.limit?.toString() || '10',
    };

    const validatedQuery = validateInput(appointmentQuerySchema)({ ...req, body: queryParams }, res);
    if (!validatedQuery) return;

    const { page, limit, patientId, counselorId, status, dateFrom, dateTo, sortBy, sortOrder } = validatedQuery;

    // Build where clause
    const where: any = {};
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    if (counselorId) {
      where.counselorId = counselorId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (dateFrom || dateTo) {
      where.appointmentDate = {};
      if (dateFrom) {
        where.appointmentDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.appointmentDate.lte = new Date(dateTo);
      }
    }

    // Role-based filtering
    if (req.user?.role === 'COUNSELOR') {
      where.counselorId = req.user.id;
    } else if (req.user?.role === 'PATIENT') {
      where.patient = { userId: req.user.id };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get appointments with pagination
    const [appointments, total] = await Promise.all([
      db.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { appointmentDate: 'asc' },
      }),
      db.appointment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiResponse.success(res, {
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return apiResponse.error(res, 'Failed to fetch appointments', 500);
  }
};

const handleCreateAppointment = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Only counselors and admins can create appointments
    if (!['COUNSELOR', 'ADMIN'].includes(req.user?.role || '')) {
      return apiResponse.error(res, 'Insufficient permissions', 403);
    }

    // Validate input
    const validatedData = validateInput(appointmentCreateSchema)(req, res);
    if (!validatedData) return;

    // Sanitize input
    const appointmentData = sanitizeInput(validatedData);

    // Set counselor ID if not provided
    if (!appointmentData.counselorId) {
      appointmentData.counselorId = req.user?.id;
    }

    // Check if patient exists and user has access
    const patient = await db.patient.findUnique(appointmentData.patientId);
    if (!patient) {
      return apiResponse.error(res, 'Patient not found', 404);
    }

    if (req.user?.role === 'COUNSELOR' && patient.counselorId !== req.user.id) {
      return apiResponse.error(res, 'Access denied to this patient', 403);
    }

    // Create appointment
    const appointment = await db.appointment.create({
      data: {
        ...appointmentData,
        appointmentDate: new Date(appointmentData.appointmentDate),
      },
      include: {
        patient: true,
        counselor: true,
      },
    });

    return apiResponse.success(res, {
      appointment,
      message: 'Appointment created successfully',
    }, 201);
  } catch (error) {
    console.error('Create appointment error:', error);
    return apiResponse.error(res, 'Failed to create appointment', 500);
  }
};

export default withErrorHandling(handler);
