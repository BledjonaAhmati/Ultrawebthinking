# 🚀 Development Setup Guide

## Prerequisites Checklist

Before starting development, ensure you have all required tools installed:

### Required Tools

- [ ] **Python 3.14+** - [Download](https://www.python.org/downloads/)
- [ ] **Node.js 24+** - [Download](https://nodejs.org/)
- [ ] **npm 11+** - Comes with Node.js
- [ ] **Docker 29+** - [Download](https://www.docker.com/get-started)
- [ ] **Git 2.47+** - [Download](https://git-scm.com/)

### Optional Tools

- [ ] **Rust** - For Kloud service development
- [ ] **PostgreSQL** - For local database development
- [ ] **Redis** - For caching development
- [ ] **Kubernetes** - For local K8s development (Minikube/Kind)

---

## 🖥️ Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Web8kameleon-hub/ultrathinking-monorepo.git
cd ultrathinking-monorepo
```

### 2. Install Global Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (virtualenv recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# ============================================
# Global Configuration
# ============================================

NODE_ENV=development
LOG_LEVEL=debug

# ============================================
# Database Configuration
# ============================================

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=ultrathinking
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=ultrathinking_dev

# ============================================
# Redis Configuration
# ============================================

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# ============================================
# API Gateway
# ============================================

API_GATEWAY_PORT=4000
API_GATEWAY_HOST=localhost

# ============================================
# Service Ports
# ============================================

WEB_CLISONIX_MAIN_PORT=8000
WEB_CLISONIX_BLOG_PORT=8001
WEB_CLISONIX_NEWS_PORT=8002
WEB_ULTRATHINKING_PORT=8003
WEB_ULTRAWEBTHINKING_PORT=8004

APP_STARBOOKING_PORT=3000
APP_HARMONIC_PORT=3001
APP_CWY_PORT=3002

SERVICE_CLISONIX_CLOUD_PORT=5000
SERVICE_CLISONIC_CLOUD_PORT=5001
SERVICE_KLOUD_PORT=6000

# ============================================
# Authentication
# ============================================

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h

# ============================================
# External APIs (Optional)
# ============================================

# Add your API keys here
OPENAI_API_KEY=
STRIPE_API_KEY=
SENDGRID_API_KEY=
```

---

## 🐳 Docker Development

### Start All Services

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Start Specific Service

```bash
# Start only specific services
docker-compose up -d web-clisonix-main app-starbooking

# Rebuild specific service
docker-compose up -d --build web-clisonix-main
```

### Docker Compose File Structure

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Databases
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Web Services
  web-clisonix-main:
    build: ./web/web-clisonix-main
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # Add more services...

volumes:
  postgres_data:
  redis_data:
```

---

## 💻 Local Development (Without Docker)

### Python Services

```bash
# Navigate to Python service
cd web/web-clisonix-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
# or
uvicorn main:app --reload --port 8000
```

### Node.js/TypeScript Services

```bash
# Navigate to Node.js service
cd apps/app-starbooking

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Rust Services

```bash
# Navigate to Rust service
cd services/service-kloud-hardware

# Build and run
cargo build
cargo run

# Run in watch mode (with cargo-watch)
cargo watch -x run
```

---

## 🧪 Running Tests

### All Tests

```bash
# Run all tests across all services
npm test
```

### Python Tests

```bash
# Navigate to Python service
cd web/web-clisonix-main

# Run tests with pytest
pytest

# Run with coverage
pytest --cov=. --cov-report=html
```

### JavaScript/TypeScript Tests

```bash
# Navigate to service
cd apps/app-starbooking

# Run Jest tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Rust Tests

```bash
cd services/service-kloud-hardware

# Run tests
cargo test

# Run with output
cargo test -- --nocapture
```

---

## 🔍 Linting & Formatting

### Python

```bash
# Run Black formatter
black .

# Run flake8 linter
flake8 .

# Run mypy type checker
mypy .
```

### JavaScript/TypeScript

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Run Prettier
npm run format
```

### Rust

```bash
# Format code
cargo fmt

# Run Clippy linter
cargo clippy
```

---

## 🗄️ Database Setup

### PostgreSQL

```bash
# Create databases for each service
psql -U ultrathinking -c "CREATE DATABASE db_clisonix;"
psql -U ultrathinking -c "CREATE DATABASE db_booking;"
psql -U ultrathinking -c "CREATE DATABASE db_kloud;"

# Run migrations (example with Alembic for Python)
cd web/web-clisonix-main
alembic upgrade head
```

### Redis

```bash
# Connect to Redis CLI
redis-cli

# Test connection
PING
# Should return: PONG
```

---

## 🌐 Accessing Services

Once everything is running, access services at:

| Service | URL |
|---------|-----|
| Clisonix Main | http://localhost:8000 |
| Clisonix Blog | http://localhost:8001 |
| Starbooking App | http://localhost:3000 |
| Harmonic App | http://localhost:3001 |
| API Gateway | http://localhost:4000 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## 🛠️ IDE Setup

### Visual Studio Code

Install recommended extensions:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "rust-lang.rust-analyzer",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "github.copilot"
  ]
}
```

### Visual Studio Enterprise 2026

- Already configured for .NET development
- Install Docker extension
- Install Python extension

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Docker Issues

```bash
# Reset Docker
docker system prune -a --volumes

# Restart Docker daemon
# Windows: Restart Docker Desktop
# Linux: sudo systemctl restart docker
```

### Python Virtual Environment

```bash
# Deactivate and recreate
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📚 Additional Resources

- [Architecture Documentation](./architecture.md)
- [API Reference](./api-reference.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guide](../CONTRIBUTING.md)

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] All Docker containers running (`docker-compose ps`)
- [ ] PostgreSQL accessible (`psql -U ultrathinking`)
- [ ] Redis accessible (`redis-cli ping`)
- [ ] Web services responding (curl http://localhost:8000/health)
- [ ] Tests passing (`npm test`)
- [ ] Linting passing (`npm run lint`)

---

**Need Help?**  
Open an issue on GitHub or contact the development team.

**Last Updated:** April 11, 2026
