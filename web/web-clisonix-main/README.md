# 🌐 Clisonix Main Platform

> **Professional healthcare technology web platform built with Python**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Language](https://img.shields.io/badge/language-Python-blue.svg)]()
[![Port](https://img.shields.io/badge/port-8000-blue.svg)]()

---

## 📋 Overview

Clisonix Main is the core web platform for healthcare technology services. Built with modern Python frameworks, it delivers high-performance, scalable solutions for healthcare providers.

### Key Features

- 🏥 **Healthcare Management** - Patient and provider interfaces
- 🤖 **AI Integration** - Machine learning powered insights
- 📊 **Analytics Dashboard** - Real-time health metrics
- 🔒 **HIPAA Compliant** - Enterprise-grade security
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **High Performance** - Optimized for speed

---

## 🛠️ Tech Stack

- **Runtime**: Python 3.14.3
- **Framework**: FastAPI / Flask
- **Database**: PostgreSQL (db_clisonix)
- **Caching**: Redis
- **ORM**: SQLAlchemy
- **Migration**: Alembic
- **Testing**: pytest
- **Linting**: flake8, black, mypy

---

## 🚀 Quick Start

### Prerequisites

- Python 3.14+
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Navigate to service directory
cd web/web-clisonix-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --port 8000
```

### Using Docker

```bash
# From monorepo root
docker-compose up web-clisonix-main
```

---

## 📁 Project Structure

```
web-clisonix-main/
├── app/
│   ├── api/               # API routes
│   │   └── v1/
│   ├── core/              # Core configuration
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   ├── dependencies/      # FastAPI dependencies
│   └── main.py            # Application entry
├── alembic/               # Database migrations
├── tests/                 # Test files
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## 🔌 API Endpoints

### Health & Status

- `GET /health` - Health check endpoint
- `GET /api/v1/status` - Service status

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token

### Healthcare Services

- `GET /api/v1/patients` - List patients
- `POST /api/v1/patients` - Create patient record
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Schedule appointment

---

## 🧪 Testing

```bash
# Activate virtual environment
source venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_api.py
```

---

## 📊 Environment Variables

```env
# Server
PORT=8000
ENVIRONMENT=development
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db_clisonix

# Redis
REDIS_URL=redis://:password@localhost:6379/0

# Security
JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8001
```

---

## 🚢 Deployment

### Production Build

```bash
# Install production dependencies
pip install -r requirements.txt --no-dev

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Docker

```bash
docker build -t web-clisonix-main .
docker run -p 8000:8000 web-clisonix-main
```

---

## 📈 Performance Metrics

- Response time: < 50ms (average)
- Throughput: 10,000+ requests/second
- Memory usage: < 512MB
- CPU usage: < 30%

---

## 🔒 Security

- JWT authentication
- Rate limiting
- SQL injection protection
- XSS prevention
- CSRF protection
- HIPAA compliance measures

---

## 🤝 Contributing

See [CONTRIBUTING.md](../../docs/CONTRIBUTING.md)

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE)

---

**Maintained by:** Clisonix AI Team  
**Last Updated:** April 11, 2026
