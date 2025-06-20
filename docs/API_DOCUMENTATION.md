# 🔌 CounselorTempo API Documentation

> **Comprehensive API reference for CounselorTempo - AI-Powered Counseling Practice Management System**

## 🌐 **Base URL**

```
Production: https://santana-ai-counselor.vercel.app/api
Development: http://localhost:5173/api
```

## 🔐 **Authentication**

All API endpoints (except public health checks) require JWT authentication.

### **Authentication Header**
```http
Authorization: Bearer <jwt_token>
```

### **Getting Authentication Token**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "counselor",
      "fullName": "John Doe"
    },
    "accessToken": "jwt_token_here"
  }
}
```

---

## 📋 **API Endpoints Overview**

### **🔐 Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |
| GET | `/auth/me` | Get current user | Yes |

### **👥 Patient Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/patients` | List all patients | Yes |
| POST | `/patients` | Create new patient | Yes |
| GET | `/patients/{id}` | Get patient details | Yes |
| PUT | `/patients/{id}` | Update patient | Yes |
| DELETE | `/patients/{id}` | Delete patient | Yes |

### **📅 Appointment Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/appointments` | List appointments | Yes |
| POST | `/appointments` | Create appointment | Yes |
| GET | `/appointments/{id}` | Get appointment details | Yes |
| PUT | `/appointments/{id}` | Update appointment | Yes |
| DELETE | `/appointments/{id}` | Cancel appointment | Yes |

### **📋 Assessment Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/assessments` | List assessments | Yes |
| POST | `/assessments` | Create assessment | Yes |
| GET | `/assessments/{id}` | Get assessment details | Yes |
| PUT | `/assessments/{id}` | Update assessment | Yes |

### **📈 Treatment Plans**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/treatment-plans` | List treatment plans | Yes |
| POST | `/treatment-plans` | Create treatment plan | Yes |
| GET | `/treatment-plans/{id}` | Get plan details | Yes |
| PUT | `/treatment-plans/{id}` | Update plan | Yes |

### **⚙️ Settings & Configuration**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/settings` | Get user settings | Yes |
| PUT | `/settings` | Update settings | Yes |

### **🔧 System Health & Diagnostics**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Basic health check | No |
| GET | `/admin/system-diagnostics` | Detailed system health | Admin |
| GET | `/admin/testing-suite` | Comprehensive tests | Admin |

---

## 📖 **Detailed Endpoint Documentation**

### **🔐 Authentication Endpoints**

#### **POST /auth/login**

Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "role": "counselor|admin|patient",
      "fullName": "string",
      "createdAt": "ISO 8601 date",
      "lastLogin": "ISO 8601 date"
    },
    "accessToken": "string"
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

#### **POST /auth/register**

Register new user account.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "fullName": "string (required)",
  "role": "counselor|admin|patient (required)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "role": "string",
      "fullName": "string"
    }
  },
  "message": "User registered successfully"
}
```

#### **GET /auth/me**

Get current authenticated user information.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "role": "string",
      "fullName": "string",
      "preferences": {},
      "lastLogin": "ISO 8601 date"
    }
  }
}
```

### **👥 Patient Management**

#### **GET /patients**

Retrieve list of patients with optional filtering and pagination.

**Query Parameters:**
```
?page=1&limit=10&search=john&status=active&sortBy=name&sortOrder=asc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "string",
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dateOfBirth": "ISO 8601 date",
        "status": "active|inactive|completed",
        "counselorId": "string",
        "createdAt": "ISO 8601 date",
        "lastAppointment": "ISO 8601 date"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### **POST /patients**

Create new patient record.

**Request Body:**
```json
{
  "fullName": "string (required)",
  "email": "string (required)",
  "phone": "string",
  "dateOfBirth": "ISO 8601 date",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  },
  "emergencyContact": {
    "name": "string",
    "phone": "string",
    "relationship": "string"
  },
  "medicalHistory": "string",
  "insuranceInfo": {
    "provider": "string",
    "policyNumber": "string"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "status": "active",
      "createdAt": "ISO 8601 date"
    }
  },
  "message": "Patient created successfully"
}
```

### **📅 Appointment Management**

#### **GET /appointments**

Retrieve appointments with filtering options.

**Query Parameters:**
```
?date=2024-12-20&counselorId=123&patientId=456&status=scheduled
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "string",
        "patientId": "string",
        "counselorId": "string",
        "appointmentDate": "ISO 8601 datetime",
        "duration": 60,
        "type": "initial|follow-up|assessment",
        "status": "scheduled|confirmed|completed|cancelled",
        "notes": "string",
        "patient": {
          "fullName": "string",
          "email": "string"
        }
      }
    ]
  }
}
```

#### **POST /appointments**

Schedule new appointment.

**Request Body:**
```json
{
  "patientId": "string (required)",
  "appointmentDate": "ISO 8601 datetime (required)",
  "duration": "number (minutes, default: 60)",
  "type": "initial|follow-up|assessment (required)",
  "notes": "string",
  "reminderEnabled": "boolean (default: true)"
}
```

### **📋 Assessment Management**

#### **GET /assessments**

Retrieve patient assessments.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "assessments": [
      {
        "id": "string",
        "patientId": "string",
        "type": "initial|progress|outcome",
        "title": "string",
        "description": "string",
        "questions": [],
        "responses": {},
        "score": "number",
        "completedAt": "ISO 8601 date",
        "createdBy": "string"
      }
    ]
  }
}
```

#### **POST /assessments**

Create new assessment.

**Request Body:**
```json
{
  "patientId": "string (required)",
  "type": "initial|progress|outcome (required)",
  "title": "string (required)",
  "description": "string",
  "questions": [
    {
      "id": "string",
      "question": "string",
      "type": "multiple-choice|text|scale",
      "options": ["option1", "option2"],
      "required": "boolean"
    }
  ]
}
```

### **🔧 System Health Endpoints**

#### **GET /health**

Basic system health check.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "ISO 8601 datetime",
  "version": "1.0.0",
  "uptime": 3600,
  "database": {
    "status": "connected",
    "responseTime": 45
  }
}
```

#### **GET /admin/system-diagnostics**

Comprehensive system diagnostics (Admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "timestamp": "ISO 8601 datetime",
    "overall_status": "healthy|warning|critical",
    "components": {
      "database": {
        "status": "healthy",
        "responseTime": 45,
        "message": "Connection successful"
      },
      "environment": {
        "status": "healthy",
        "variables": {
          "DATABASE_URL": {"present": true},
          "JWT_SECRET": {"present": true}
        }
      },
      "api_endpoints": {
        "health": {"status": "operational"},
        "auth_login": {"status": "operational"}
      }
    },
    "errors": [],
    "warnings": []
  }
}
```

#### **GET /admin/testing-suite**

Run comprehensive application tests (Admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "timestamp": "ISO 8601 datetime",
    "execution_time": 1500,
    "overall_status": "passed|warning|failed",
    "total_tests": 25,
    "passed_tests": 23,
    "failed_tests": 2,
    "system_health_score": 92,
    "test_categories": {
      "api_endpoints": {
        "status": "passed",
        "passed": 8,
        "failed": 0,
        "total": 8
      },
      "database": {
        "status": "passed",
        "passed": 1,
        "failed": 0,
        "total": 1
      }
    },
    "recommendations": [
      {
        "priority": "high",
        "title": "Missing API Endpoint",
        "description": "Settings endpoint not accessible",
        "action": "Create missing API endpoint file"
      }
    ]
  }
}
```

---

## 🔒 **Error Handling**

### **Standard Error Response Format**

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  },
  "timestamp": "ISO 8601 datetime"
}
```

### **Common HTTP Status Codes**

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side errors |

### **Common Error Codes**

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Login credentials are incorrect |
| `TOKEN_EXPIRED` | JWT token has expired |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `VALIDATION_ERROR` | Request data validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `DATABASE_ERROR` | Database operation failed |

---

## 📊 **Rate Limiting**

- **Standard Endpoints**: 100 requests per minute per user
- **Authentication Endpoints**: 10 requests per minute per IP
- **Admin Endpoints**: 50 requests per minute per admin user

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🔧 **Development & Testing**

### **Testing API Endpoints**

Use the built-in admin testing suite:

1. **Access Testing Suite**: `/admin/testing-suite`
2. **Run Comprehensive Tests**: Tests all endpoints automatically
3. **View Results**: Detailed pass/fail status for each endpoint
4. **Get Recommendations**: Specific fixes for failed tests

### **API Client Examples**

#### **JavaScript/Fetch**
```javascript
// Login and get token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.accessToken;

// Use token for authenticated requests
const patientsResponse = await fetch('/api/patients', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### **cURL**
```bash
# Login
curl -X POST https://santana-ai-counselor.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get patients (replace TOKEN with actual token)
curl -X GET https://santana-ai-counselor.vercel.app/api/patients \
  -H "Authorization: Bearer TOKEN"
```

---

## 📝 **Changelog**

### **Version 1.0.0** (December 2024)
- Initial API release
- Authentication endpoints
- Patient management
- Appointment scheduling
- Assessment tools
- Treatment planning
- Admin diagnostics and testing suite

---

**📞 API Support**: Use the admin testing suite for automated API validation  
**📖 Full Documentation**: See [User Manual](./USER_MANUAL.md) for complete feature documentation  
**🔧 System Health**: Monitor API status at `/api/health`
