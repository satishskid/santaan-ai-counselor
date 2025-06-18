import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest, validateInput, sanitizeInput } from '../_lib/middleware';
import { db } from '../_lib/database';
import { assessmentCreateSchema, paginationSchema } from '../_lib/validation';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Authenticate user
  if (!authenticate(req, res)) return;

  switch (req.method) {
    case 'GET':
      return handleGetAssessments(req, res);
    case 'POST':
      return handleCreateAssessment(req, res);
    default:
      return apiResponse.error(res, 'Method not allowed', 405);
  }
};

const handleGetAssessments = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Validate query parameters
    const queryParams = {
      ...req.query,
      page: req.query.page?.toString() || '1',
      limit: req.query.limit?.toString() || '10',
    };

    const validatedQuery = validateInput(paginationSchema)({ ...req, body: queryParams }, res);
    if (!validatedQuery) return;

    const { page, limit, sortBy, sortOrder } = validatedQuery;
    const { patientId } = req.query;

    // Build where clause
    const where: any = {};
    
    if (patientId && typeof patientId === 'string') {
      where.patientId = patientId;
    }

    // Role-based filtering
    if (req.user?.role === 'COUNSELOR') {
      where.counselorId = req.user.id;
    } else if (req.user?.role === 'PATIENT') {
      where.patient = { userId: req.user.id };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get assessments with pagination
    const [assessments, total] = await Promise.all([
      db.assessment.findMany(where, {
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      }),
      db.assessment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiResponse.success(res, {
      assessments,
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
    console.error('Get assessments error:', error);
    return apiResponse.error(res, 'Failed to fetch assessments', 500);
  }
};

const handleCreateAssessment = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Only counselors and admins can create assessments
    if (!['COUNSELOR', 'ADMIN'].includes(req.user?.role || '')) {
      return apiResponse.error(res, 'Insufficient permissions', 403);
    }

    // Validate input
    const validatedData = validateInput(assessmentCreateSchema)(req, res);
    if (!validatedData) return;

    // Sanitize input
    const assessmentData = sanitizeInput(validatedData);

    // Set counselor ID if not provided
    if (!assessmentData.counselorId) {
      assessmentData.counselorId = req.user?.id;
    }

    // Check if patient exists and user has access
    const patient = await db.patient.findUnique(assessmentData.patientId);
    if (!patient) {
      return apiResponse.error(res, 'Patient not found', 404);
    }

    if (req.user?.role === 'COUNSELOR' && patient.counselorId !== req.user.id) {
      return apiResponse.error(res, 'Access denied to this patient', 403);
    }

    // Create assessment
    const assessment = await db.assessment.create({
      data: assessmentData,
      include: {
        patient: true,
        counselor: true,
      },
    });

    return apiResponse.success(res, {
      assessment,
      message: 'Assessment created successfully',
    }, 201);
  } catch (error) {
    console.error('Create assessment error:', error);
    return apiResponse.error(res, 'Failed to create assessment', 500);
  }
};

export default withErrorHandling(handler);
