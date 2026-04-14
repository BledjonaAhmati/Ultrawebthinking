# 🌐 API Gateway Service

> **Central routing, authentication, and rate limiting for all microservices**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg)]()
[![Port](https://img.shields.io/badge/port-4000-blue.svg)]()

---

## 📋 Overview

The API Gateway is the **single entry point** for all client requests to the UltraThinking platform. It handles:

- **🔐 Authentication & Authorization** - JWT validation
- **🚦 Rate Limiting** - Prevent abuse
- **🔀 Request Routing** - Smart service discovery
- **📊 Request/Response Logging** - Observability
- **⚡ Caching** - Performance optimization
- **🛡️ Security** - CORS, CSRF protection

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 24+
- **Language**: TypeScript 5.x
- **Framework**: Express.js + express-gateway
- **Auth**: JWT (jsonwebtoken)
- **Rate Limiting**: express-rate-limit
- **Caching**: Redis
- **Validation**: Joi
- **Logging**: Winston + Morgan

---

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- Redis 7+

### Installation

```bash
cd services/service-api-gateway

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
service-api-gateway/
├── src/
│   ├── config/              # Configuration
│   │   ├── routes.ts        # Route definitions
│   │   └── jwt.ts           # JWT configuration
│   ├── middlewares/         # Express middleware
│   │   ├── auth.ts          # Authentication
│   │   ├── rateLimit.ts     # Rate limiting
│   │   ├── logger.ts        # Request logging
│   │   └── errorHandler.ts # Error handling
│   ├── routes/              # API routes
│   │   ├── health.ts        # Health check
│   │   └── proxy.ts         # Service proxy
│   ├── services/            # Business logic
│   │   ├── authService.ts   # Auth logic
│   │   └── routingService.ts# Smart routing
│   ├── utils/               # Utilities
│   │   └── serviceRegistry.ts
│   └── server.ts            # Express server
├── tests/                   # Tests
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 Routing Configuration

### Service Registry

```typescript
const SERVICE_REGISTRY = {
  web: {
    'clisonix-main': 'http://web-clisonix-main:8000',
    'clisonix-blog': 'http://web-clisonix-blog:8001',
    'ultrathinking': 'http://web-ultrathinking:8003',
  },
  apps: {
    'starbooking': 'http://app-starbooking:3000',
    'harmonic': 'http://app-harmonic:3001',
    'cwy': 'http://app-cwy:3002',
  },
  services: {
    'clisonix-cloud': 'http://service-clisonix-cloud:5000',
    'kloud-hardware': 'http://service-kloud-hardware:6000',
  },
};
```

### Route Examples

```
GET  /api/gateway/health           → Gateway health check
POST /api/auth/login               → Authentication
GET  /api/web/clisonix/patients    → Proxied to web-clisonix-main:8000
POST /api/apps/starbooking/booking → Proxied to app-starbooking:3000
GET  /api/services/cloud/files     → Proxied to service-clisonix-cloud:5000
```

---

## 🔐 Authentication Flow

```
┌─────────┐     1. Login      ┌─────────────┐
│ Client  │ ───────────────> │ API Gateway │
└─────────┘                   └──────┬──────┘
                                     │
                              2. Validate credentials
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Auth Service │
                              └──────┬───────┘
                                     │
                              3. Issue JWT token
                                     │
     ┌────────────────────────────────┘
     │
     ▼
┌─────────┐  4. Return token  ┌─────────────┐
│ Client  │ <──────────────── │ API Gateway │
└─────────┘                   └─────────────┘
     │
     │  5. Authenticated requests with token
     │
     ▼
┌─────────────┐    6. Validate   ┌──────────────┐
│ API Gateway │ ────────────────> │ Microservice │
└─────────────┘                   └──────────────┘
```

---

## ⚡ Rate Limiting

### Configuration

```typescript
// General rate limit: 100 requests/15 minutes
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
}));

// Strict rate limit for authentication: 5 requests/15 minutes
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
}));
```

---

## 📊 Request Logging

All requests are logged with:

```json
{
  "timestamp": "2026-04-11T16:00:00Z",
  "method": "GET",
  "url": "/api/web/clisonix/patients",
  "status": 200,
  "responseTime": 45,
  "userId": "uuid",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Integration tests
npm run test:integration
```

---

## 📊 Environment Variables

```env
# Server
PORT=4000
NODE_ENV=production

# Redis
REDIS_URL=redis://:password@localhost:6379/0

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8000

# Services
SERVICE_WEB_CLISONIX_MAIN=http://web-clisonix-main:8000
SERVICE_APP_STARBOOKING=http://app-starbooking:3000
SERVICE_CLISONIX_CLOUD=http://service-clisonix-cloud:5000
```

---

## 🔒 Security Features

### CORS Protection

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
```

### Helmet Security Headers

```typescript
app.use(helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
}));
```

### Request Validation

```typescript
// Example: Validate booking creation
const bookingSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  service: Joi.string().required(),
  date: Joi.date().iso().required(),
  time: Joi.string().regex(/^\d{2}:\d{2}$/).required(),
});
```

---

## 🚢 Deployment

### Docker

```bash
docker build -t service-api-gateway .
docker run -p 4000:4000 service-api-gateway
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: ultrathinking/api-gateway:latest
        ports:
        - containerPort: 4000
        env:
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
```

---

## 📈 Performance

- Response time: < 10ms (proxy overhead)
- Throughput: 50,000+ req/s
- Concurrent connections: 10,000+
- Cache hit ratio: > 80%

---

## 🔧 Monitoring & Observability

### Health Check Endpoint

```bash
curl http://localhost:4000/api/gateway/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-11T16:00:00Z",
  "version": "1.0.0",
  "uptime": 86400,
  "services": {
    "redis": "connected",
    "downstream": {
      "web-clisonix-main": "healthy",
      "app-starbooking": "healthy",
      "service-clisonix-cloud": "healthy"
    }
  }
}
```

---

## 📊 Metrics Exported

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram
- `rate_limit_hits_total` - Rate limit hits
- `jwt_validations_total` - JWT validation count
- `downstream_service_errors_total` - Downstream errors

---

## 🤝 Contributing

See [CONTRIBUTING.md](../../docs/CONTRIBUTING.md)

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE)

---

**Maintained by:** UltraThinking Gateway Team  
**Last Updated:** April 11, 2026
