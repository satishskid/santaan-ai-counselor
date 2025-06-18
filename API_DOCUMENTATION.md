# CounselorTempo API Documentation

## Overview
The CounselorTempo API is a RESTful API built for Vercel serverless deployment, providing comprehensive endpoints for IVF counseling management.

**Base URL**: `https://your-domain.vercel.app/api`
**Version**: 1.0.0
**Authentication**: JWT Bearer Token

## Table of Contents
- [Authentication](#authentication)
- [Health Check](#health-check)
- [Patients](#patients)
- [Appointments](#appointments)
- [Assessments](#assessments)
- [Treatment Plans](#treatment-plans)
- [Dashboard](#dashboard)
- [EMR Integration](#emr-integration)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "COUNSELOR"
    },
    "accessToken": "jwt_token_here",
    "message": "Login successful"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "PATIENT"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "PATIENT"
    },
    "accessToken": "jwt_token_here",
    "message": "Registration successful"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "COUNSELOR"
    },
    "accessToken": "new_jwt_token_here",
    "message": "Token refreshed successfully"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/auth/logout
Logout and invalidate refresh token.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logout successful"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "COUNSELOR",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "message": "User data retrieved successfully"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Health Check

### GET /api/health
Check API and database health status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "version": "1.0.0",
    "uptime": 3600,
    "memory": {
      "used": 45,
      "total": 128
    },
    "database": {
      "status": "healthy",
      "message": "Database connection is working"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Patients

### GET /api/patients
Get list of patients with pagination and filtering.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (NEW, ACTIVE, INACTIVE, COMPLETED)
- `counselorId` (optional): Filter by counselor ID
- `search` (optional): Search by name or email
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "patient_id",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com",
        "phone": "+1-555-0123",
        "status": "ACTIVE",
        "diagnosis": "Unexplained infertility",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "counselor": {
          "id": "counselor_id",
          "fullName": "Dr. Smith"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/patients
Create a new patient.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0123",
  "dateOfBirth": "1985-03-15T00:00:00.000Z",
  "gender": "female",
  "diagnosis": "Unexplained infertility",
  "counselorId": "counselor_id",
  "medicalHistory": {
    "previousTreatments": "None",
    "medicalConditions": "None",
    "medications": "Prenatal vitamins",
    "allergies": "None",
    "familyHistory": "No family history of infertility"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "patient_id",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "status": "NEW",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "medicalHistory": {
        "id": "history_id",
        "previousTreatments": "None"
      }
    },
    "message": "Patient created successfully"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/patients/[id]
Get patient by ID with full details.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "patient_id",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "+1-555-0123",
      "status": "ACTIVE",
      "medicalHistory": {
        "previousTreatments": "None",
        "medicalConditions": "None"
      },
      "appointments": [],
      "assessments": [],
      "treatmentPlans": []
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/patients/[id]
Update patient information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "status": "ACTIVE"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "patient_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "status": "ACTIVE",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "message": "Patient updated successfully"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Appointments

### GET /api/appointments
Get list of appointments with filtering.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `page`, `limit`, `sortBy`, `sortOrder` (pagination)
- `patientId` (optional): Filter by patient ID
- `counselorId` (optional): Filter by counselor ID
- `status` (optional): Filter by status
- `dateFrom` (optional): Filter appointments from date
- `dateTo` (optional): Filter appointments to date

**Response (200):**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "appointment_id",
        "title": "Initial Consultation",
        "appointmentDate": "2024-01-15T10:00:00.000Z",
        "durationMinutes": 60,
        "status": "SCHEDULED",
        "patient": {
          "id": "patient_id",
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "counselor": {
          "id": "counselor_id",
          "fullName": "Dr. Smith"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### POST /api/appointments
Create a new appointment.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "patientId": "patient_id",
  "counselorId": "counselor_id",
  "title": "Follow-up Session",
  "description": "Review treatment progress",
  "appointmentDate": "2024-01-20T14:00:00.000Z",
  "durationMinutes": 45,
  "type": "follow_up"
}
```

## Assessments

### GET /api/assessments
Get list of assessments.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- Standard pagination parameters
- `patientId` (optional): Filter by patient ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assessments": [
      {
        "id": "assessment_id",
        "assessmentType": "anxiety_screening",
        "status": "COMPLETED",
        "score": 15,
        "completedAt": "2024-01-10T00:00:00.000Z",
        "patient": {
          "id": "patient_id",
          "firstName": "Jane",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

### POST /api/assessments
Create a new assessment.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "assessmentType": "depression_screening",
  "questions": "JSON string of questions",
  "notes": "Initial assessment notes"
}
```

## Treatment Plans

### GET /api/treatment-plans
Get list of treatment plans.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "treatmentPlans": [
      {
        "id": "plan_id",
        "title": "Comprehensive IVF Support Plan",
        "status": "ACTIVE",
        "startDate": "2024-01-01T00:00:00.000Z",
        "patient": {
          "id": "patient_id",
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "milestones": [
          {
            "id": "milestone_id",
            "title": "Initial Assessment Complete",
            "status": "COMPLETED"
          }
        ]
      }
    ]
  }
}
```

### POST /api/treatment-plans
Create a new treatment plan.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "title": "IVF Emotional Support Plan",
  "description": "Comprehensive emotional support during IVF journey",
  "startDate": "2024-01-01T00:00:00.000Z",
  "milestones": [
    {
      "title": "Complete initial assessment",
      "description": "Baseline psychological evaluation",
      "targetDate": "2024-01-07T00:00:00.000Z"
    }
  ],
  "interventions": [
    {
      "title": "Weekly counseling sessions",
      "type": "counseling",
      "frequency": "weekly",
      "duration": "8 weeks"
    }
  ]
}
```

## Dashboard

### GET /api/dashboard/stats
Get dashboard statistics.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPatients": 25,
    "upcomingAppointments": 8,
    "activeTreatmentPlans": 12,
    "completedAssessments": 45,
    "newPatients": 3,
    "activePatients": 20,
    "recentPatients": [
      {
        "id": "patient_id",
        "firstName": "Jane",
        "lastName": "Doe",
        "status": "NEW",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "todaysAppointments": [
      {
        "id": "appointment_id",
        "title": "Initial Consultation",
        "appointmentDate": "2024-01-01T10:00:00.000Z",
        "patient": {
          "firstName": "Jane",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

## EMR Integration

### POST /api/emr/test-connection
Test EMR system connection.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "enabled": true,
  "provider": "custom",
  "baseUrl": "https://emr-system.com/api",
  "apiKey": "your-api-key",
  "timeout": 30000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "EMR connection successful",
    "provider": "custom",
    "capabilities": [
      "Patient Management",
      "Cycle Management",
      "Lab Results"
    ]
  }
}
```

### GET /api/emr/patients/[patientId]
Get patient data from EMR system.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": {
      "id": "patient_id",
      "mrn": "IVF-2024-001",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "currentCycle": {
        "cycleNumber": 2,
        "protocol": "Long Protocol",
        "status": "stimulation"
      },
      "treatmentHistory": []
    },
    "message": "Patient data retrieved successfully from EMR"
  }
}
```

## Error Handling

All API endpoints return consistent error responses:

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window per IP
- **Headers**: Rate limit info included in response headers

## Authentication Flow

1. **Login**: POST `/api/auth/login` → Get access token + refresh token (HTTP-only cookie)
2. **API Calls**: Include `Authorization: Bearer <access_token>` header
3. **Token Refresh**: When access token expires, POST `/api/auth/refresh`
4. **Logout**: POST `/api/auth/logout` → Clear refresh token

## Role-Based Access Control

- **ADMIN**: Full access to all resources
- **COUNSELOR**: Access to assigned patients and related data
- **PATIENT**: Access to own data only

## Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://..."
SHADOW_DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-32-char-secret"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Application
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.com"
```
