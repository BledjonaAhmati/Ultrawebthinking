# 📖 API Reference Documentation

## Overview

This document provides comprehensive API documentation for all services in the UltraThinking Monorepo.

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Get Authentication Token

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## Web Services

### Clisonix Main Platform (Port 8000)

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-11T15:36:00Z",
  "version": "1.0.0"
}
```

#### Get Patients

```http
GET /api/v1/patients
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)
- `search` (string, optional): Search term

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1980-01-01",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Create Patient

```http
POST /api/v1/patients
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1990-05-15",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "created_at": "2026-04-11T15:36:00Z"
}
```

---

## Applications

### Starbooking (Port 3000)

#### Get Bookings

```http
GET /api/bookings
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string, optional): Filter by status (pending, confirmed, cancelled)
- `date_from` (date, optional): Start date (YYYY-MM-DD)
- `date_to` (date, optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "customer_id": "uuid",
      "service": "Consultation",
      "date": "2026-04-15",
      "time": "14:00",
      "status": "confirmed",
      "price": 100.00,
      "created_at": "2026-04-10T10:00:00Z"
    }
  ]
}
```

#### Create Booking

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer_id": "uuid",
  "service": "Consultation",
  "date": "2026-04-20",
  "time": "15:00",
  "notes": "First time visit"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "status": "pending",
  "confirmation_code": "ABC123",
  "created_at": "2026-04-11T15:36:00Z"
}
```

#### Check Availability

```http
GET /api/availability?date=2026-04-20
```

**Response:**
```json
{
  "date": "2026-04-20",
  "available_slots": [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00"
  ]
}
```

---

## Backend Services

### Clisonix Cloud Service (Port 5000)

#### Upload File

```http
POST /api/v1/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <binary data>
folder: "patient-records"
```

**Response:**
```json
{
  "file_id": "uuid",
  "url": "https://storage.ultrathinking.com/files/uuid",
  "size": 1024000,
  "mime_type": "application/pdf",
  "uploaded_at": "2026-04-11T15:36:00Z"
}
```

### Kloud Hardware Service (Port 6000)

#### Get Hardware Metrics

```http
GET /api/metrics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "timestamp": "2026-04-11T15:36:00Z",
  "metrics": {
    "cpu_usage": 45.2,
    "memory_usage": 62.8,
    "disk_usage": 78.1,
    "network_in": 1024000,
    "network_out": 512000
  }
}
```

---

## Error Responses

All endpoints follow consistent error formatting:

### 400 Bad Request

```json
{
  "error": "ValidationError",
  "message": "Invalid request body",
  "details": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 404 Not Found

```json
{
  "error": "NotFound",
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred",
  "request_id": "uuid"
}
```

---

## Rate Limiting

All API endpoints are rate-limited:

- **Authenticated requests**: 1000 requests/hour
- **Unauthenticated requests**: 100 requests/hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1681228800
```

---

## Webhooks

Services support webhooks for real-time event notifications.

### Webhook Events

- `booking.created`
- `booking.updated`
- `booking.cancelled`
- `patient.created`
- `patient.updated`
- `file.uploaded`

### Webhook Payload

```json
{
  "event": "booking.created",
  "timestamp": "2026-04-11T15:36:00Z",
  "data": {
    "id": "uuid",
    "status": "pending"
  }
}
```

---

## WebSocket Connections

Real-time updates available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:4000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

---

**Last Updated:** April 11, 2026  
**API Version:** v1.0.0
