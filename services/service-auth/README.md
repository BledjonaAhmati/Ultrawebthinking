# 🔐 Authentication Service

> **Centralized authentication and authorization service with JWT**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Language](https://img.shields.io/badge/language-Python-blue.svg)]()
[![Port](https://img.shields.io/badge/port-5100-blue.svg)]()

---

## 📋 Overview

The Authentication Service handles all user authentication, authorization, and session management for the UltraThinking platform.

### Key Features

- 🔐 **JWT Authentication** - Stateless token-based auth
- 🔑 **OAuth2 Support** - Social login integration
- 👤 **User Management** - Registration, profiles, roles
- 🛡️ **Role-Based Access Control (RBAC)** - Fine-grained permissions
- 🔄 **Token Refresh** - Automatic token renewal
- 📧 **Email Verification** - Account activation
- 🔒 **Password Reset** - Secure recovery flow
- 📊 **Audit Logging** - Security event tracking

---

## 🛠️ Tech Stack

- **Runtime**: Python 3.12+
- **Framework**: FastAPI
- **Database**: PostgreSQL (db_auth)
- **Caching**: Redis
- **Password Hashing**: bcrypt
- **JWT**: PyJWT
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Testing**: pytest
- **Email**: SendGrid / SMTP

---

## 🚀 Quick Start

```bash
cd services/service-auth

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload --port 5100
```

---

## 🔌 API Endpoints

### Authentication

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "message": "Registration successful. Please verify your email."
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["user"]
  }
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

#### Verify Email

```http
GET /api/v1/auth/verify-email?token=<verification_token>
```

#### Password Reset Request

```http
POST /api/v1/auth/password-reset/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Password Reset Confirm

```http
POST /api/v1/auth/password-reset/confirm
Content-Type: application/json

{
  "token": "<reset_token>",
  "new_password": "NewSecurePass123!"
}
```

---

### User Management

#### Get Current User

```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PATCH /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

#### Change Password

```http
POST /api/v1/users/me/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "OldPass123!",
  "new_password": "NewPass123!"
}
```

---

### Admin Endpoints

#### List Users

```http
GET /api/v1/admin/users
Authorization: Bearer <admin_token>
```

#### Assign Role

```http
POST /api/v1/admin/users/{user_id}/roles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}
```

---

## 🔐 Security Features

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Password Hashing

```python
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

### JWT Configuration

```python
# JWT Settings
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour
JWT_REFRESH_TOKEN_EXPIRE_DAYS = 7     # 7 days

# Token payload
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["user", "admin"],
  "exp": 1681228800,  # Expiration timestamp
  "iat": 1681225200,  # Issued at
  "jti": "uuid"       # JWT ID (for revocation)
}
```

### Rate Limiting

```python
# Login attempts: 5 per 15 minutes
# Registration: 3 per hour
# Password reset: 3 per hour
```

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE auth_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific test
pytest tests/test_auth.py::test_user_registration
```

### Test Examples

```python
def test_user_registration(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123!",
        "first_name": "Test",
        "last_name": "User"
    })
    assert response.status_code == 201
    assert "user_id" in response.json()

def test_login_success(client, test_user):
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "SecurePass123!"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_invalid_credentials(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "WrongPassword"
    })
    assert response.status_code == 401
```

---

## 📊 Environment Variables

```env
# Server
PORT=5100
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db_auth

# Redis
REDIS_URL=redis://:password@localhost:6379/5

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@ultrathinking.com

# Security
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
```

---

## 🚢 Deployment

### Docker

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5100"]
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-auth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: service-auth
  template:
    metadata:
      labels:
        app: service-auth
    spec:
      containers:
      - name: service-auth
        image: ultrathinking/service-auth:latest
        ports:
        - containerPort: 5100
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: jwt-secret
```

---

## 📈 Monitoring

### Metrics

- `auth_login_attempts_total` - Total login attempts
- `auth_login_success_total` - Successful logins
- `auth_login_failure_total` - Failed logins
- `auth_registrations_total` - New user registrations
- `jwt_validations_total` - JWT validation count
- `password_resets_total` - Password reset requests

### Audit Logging

All authentication events are logged:

```json
{
  "event_type": "login_success",
  "user_id": "uuid",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2026-04-11T16:00:00Z",
  "metadata": {
    "login_method": "email_password"
  }
}
```

---

## 🔒 Best Practices

1. **Never store passwords in plain text**
2. **Use environment variables for secrets**
3. **Implement rate limiting on auth endpoints**
4. **Log all authentication events**
5. **Use HTTPS in production**
6. **Rotate JWT secrets regularly**
7. **Implement multi-factor authentication (MFA) for sensitive operations**

---

**Maintained by:** UltraThinking Security Team  
**Last Updated:** April 11, 2026
