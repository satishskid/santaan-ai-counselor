import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest, validateInput, sanitizeInput } from '../_lib/middleware';
import { db } from '../_lib/database';
import { patientCreateSchema, patientQuerySchema } from '../_lib/validation';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Authenticate user
  if (!authenticate(req, res)) return;

  switch (req.method) {
    case 'GET':
      return handleGetPatients(req, res);
    case 'POST':
      return handleCreatePatient(req, res);
    default:
      return apiResponse.error(res, 'Method not allowed', 405);
  }
};

const handleGetPatients = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Validate query parameters
    const queryParams = {
      ...req.query,
      page: req.query.page?.toString() || '1',
      limit: req.query.limit?.toString() || '10',
    };

    const validatedQuery = validateInput(patientQuerySchema)({ ...req, body: queryParams }, res);
    if (!validatedQuery) return;

    const { page, limit, status, counselorId, search, sortBy, sortOrder } = validatedQuery;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (counselorId) {
      where.counselorId = counselorId;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role-based filtering
    if (req.user?.role === 'COUNSELOR') {
      // Counselors can only see their assigned patients
      where.counselorId = req.user.id;
    } else if (req.user?.role === 'PATIENT') {
      // Patients can only see their own data
      where.userId = req.user.id;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get patients with pagination
    const [patients, total] = await Promise.all([
      db.patient.findMany({
        ...where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      }),
      db.patient.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiResponse.success(res, {
      patients,
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
    console.error('Get patients error:', error);
    return apiResponse.error(res, 'Failed to fetch patients', 500);
  }
};

const handleCreatePatient = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Only counselors and admins can create patients
    if (!['COUNSELOR', 'ADMIN'].includes(req.user?.role || '')) {
      return apiResponse.error(res, 'Insufficient permissions', 403);
    }

    // Validate input
    const validatedData = validateInput(patientCreateSchema)(req, res);
    if (!validatedData) return;

    // Sanitize input
    const patientData = sanitizeInput(validatedData);

    // Prepare data for creation
    const { medicalHistory, fertilityJourney, treatmentPathway, ...patientInfo } = patientData;

    // Create patient with related data
    const patient = await db.patient.create({
      data: {
        ...patientInfo,
        counselorId: patientInfo.counselorId || req.user?.id,
        ...(medicalHistory && {
          medicalHistory: {
            create: medicalHistory,
          },
        }),
        ...(fertilityJourney && {
          fertilityJourney: {
            create: fertilityJourney,
          },
        }),
        ...(treatmentPathway && {
          treatmentPathway: {
            create: treatmentPathway,
          },
        }),
      },
      include: {
        medicalHistory: true,
        fertilityJourney: true,
        treatmentPathway: true,
        counselor: true,
      },
    });

    return apiResponse.success(res, {
      patient,
      message: 'Patient created successfully',
    }, 201);
  } catch (error) {
    console.error('Create patient error:', error);
    if (error.code === 'P2002') {
      return apiResponse.error(res, 'Patient with this email already exists', 409);
    }
    return apiResponse.error(res, 'Failed to create patient', 500);
  }
};

export default withErrorHandling(handler);
