import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest, validateInput, sanitizeInput } from '../_lib/middleware';
import { db } from '../_lib/database';
import { treatmentPlanCreateSchema, paginationSchema } from '../_lib/validation';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Authenticate user
  if (!authenticate(req, res)) return;

  switch (req.method) {
    case 'GET':
      return handleGetTreatmentPlans(req, res);
    case 'POST':
      return handleCreateTreatmentPlan(req, res);
    default:
      return apiResponse.error(res, 'Method not allowed', 405);
  }
};

const handleGetTreatmentPlans = async (req: AuthenticatedRequest, res: NextApiResponse) => {
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

    // Get treatment plans with pagination
    const [treatmentPlans, total] = await Promise.all([
      db.treatmentPlan.findMany(where, {
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      }),
      db.treatmentPlan.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiResponse.success(res, {
      treatmentPlans,
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
    console.error('Get treatment plans error:', error);
    return apiResponse.error(res, 'Failed to fetch treatment plans', 500);
  }
};

const handleCreateTreatmentPlan = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Only counselors and admins can create treatment plans
    if (!['COUNSELOR', 'ADMIN'].includes(req.user?.role || '')) {
      return apiResponse.error(res, 'Insufficient permissions', 403);
    }

    // Validate input
    const validatedData = validateInput(treatmentPlanCreateSchema)(req, res);
    if (!validatedData) return;

    // Sanitize input
    const treatmentPlanData = sanitizeInput(validatedData);

    // Set counselor ID if not provided
    if (!treatmentPlanData.counselorId) {
      treatmentPlanData.counselorId = req.user?.id;
    }

    // Check if patient exists and user has access
    const patient = await db.patient.findUnique(treatmentPlanData.patientId);
    if (!patient) {
      return apiResponse.error(res, 'Patient not found', 404);
    }

    if (req.user?.role === 'COUNSELOR' && patient.counselorId !== req.user.id) {
      return apiResponse.error(res, 'Access denied to this patient', 403);
    }

    // Prepare data for creation
    const { milestones, interventions, ...planData } = treatmentPlanData;

    // Create treatment plan with related data
    const treatmentPlan = await db.treatmentPlan.create({
      data: {
        ...planData,
        startDate: planData.startDate ? new Date(planData.startDate) : null,
        endDate: planData.endDate ? new Date(planData.endDate) : null,
        ...(milestones && milestones.length > 0 && {
          milestones: {
            create: milestones.map(milestone => ({
              ...milestone,
              targetDate: milestone.targetDate ? new Date(milestone.targetDate) : null,
            })),
          },
        }),
        ...(interventions && interventions.length > 0 && {
          interventions: {
            create: interventions,
          },
        }),
      },
      include: {
        patient: true,
        counselor: true,
        milestones: true,
        interventions: true,
      },
    });

    return apiResponse.success(res, {
      treatmentPlan,
      message: 'Treatment plan created successfully',
    }, 201);
  } catch (error) {
    console.error('Create treatment plan error:', error);
    return apiResponse.error(res, 'Failed to create treatment plan', 500);
  }
};

export default withErrorHandling(handler);
