import { NextApiRequest, NextApiResponse } from 'next';
import { cors, withErrorHandling, apiResponse, authenticate, AuthenticatedRequest, validateInput, sanitizeInput } from '../_lib/middleware';
import { db } from '../_lib/database';
import { patientUpdateSchema } from '../_lib/validation';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Authenticate user
  if (!authenticate(req, res)) return;

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return apiResponse.error(res, 'Patient ID is required', 400);
  }

  switch (req.method) {
    case 'GET':
      return handleGetPatient(req, res, id);
    case 'PUT':
      return handleUpdatePatient(req, res, id);
    case 'DELETE':
      return handleDeletePatient(req, res, id);
    default:
      return apiResponse.error(res, 'Method not allowed', 405);
  }
};

const handleGetPatient = async (req: AuthenticatedRequest, res: NextApiResponse, id: string) => {
  try {
    // Get patient
    const patient = await db.patient.findUnique(id);

    if (!patient) {
      return apiResponse.error(res, 'Patient not found', 404);
    }

    // Check permissions
    if (req.user?.role === 'PATIENT' && patient.userId !== req.user.id) {
      return apiResponse.error(res, 'Access denied', 403);
    }

    if (req.user?.role === 'COUNSELOR' && patient.counselorId !== req.user.id) {
      return apiResponse.error(res, 'Access denied', 403);
    }

    return apiResponse.success(res, {
      patient,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return apiResponse.error(res, 'Failed to fetch patient', 500);
  }
};

const handleUpdatePatient = async (req: AuthenticatedRequest, res: NextApiResponse, id: string) => {
  try {
    // Check if patient exists
    const existingPatient = await db.patient.findUnique(id);

    if (!existingPatient) {
      return apiResponse.error(res, 'Patient not found', 404);
    }

    // Check permissions
    if (req.user?.role === 'PATIENT' && existingPatient.userId !== req.user.id) {
      return apiResponse.error(res, 'Access denied', 403);
    }

    if (req.user?.role === 'COUNSELOR' && existingPatient.counselorId !== req.user.id) {
      return apiResponse.error(res, 'Access denied', 403);
    }

    // Validate input
    const validatedData = validateInput(patientUpdateSchema)(req, res);
    if (!validatedData) return;

    // Sanitize input
    const updateData = sanitizeInput(validatedData);

    // Update patient
    const updatedPatient = await db.patient.update(id, updateData);

    return apiResponse.success(res, {
      patient: updatedPatient,
      message: 'Patient updated successfully',
    });
  } catch (error) {
    console.error('Update patient error:', error);
    if (error.code === 'P2002') {
      return apiResponse.error(res, 'Email already exists', 409);
    }
    return apiResponse.error(res, 'Failed to update patient', 500);
  }
};

const handleDeletePatient = async (req: AuthenticatedRequest, res: NextApiResponse, id: string) => {
  try {
    // Only admins can delete patients
    if (req.user?.role !== 'ADMIN') {
      return apiResponse.error(res, 'Insufficient permissions', 403);
    }

    // Check if patient exists
    const existingPatient = await db.patient.findUnique(id);

    if (!existingPatient) {
      return apiResponse.error(res, 'Patient not found', 404);
    }

    // Delete patient (cascade will handle related records)
    await db.patient.delete(id);

    return apiResponse.success(res, {
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    return apiResponse.error(res, 'Failed to delete patient', 500);
  }
};

export default withErrorHandling(handler);
