# 🎛️ Web8 Platform Control Center

**Unified dashboard për monitorimin dhe kontrollin e të gjitha 7 core components të platformës.**

---

## 🏗️ Architecture Overview

Platforma Web8 përbëhet nga 7 komponente kryesore:

### 1. 💓 **Cwy Nin Engine** (Port 7500)
- **Përshkrim**: Emotional Intelligence & Code Sensing
- **Përgjegjësi**: 
  - Lexon kod në real-time
  - Analizon cilësinë e kodit
  - Ndjen gjendjen emocionale të sistemit
  - Reagon me "emocione" bazuar në metrika
- **API**: `http://localhost:7500/api/v1/nin/*`
- **Attribution**: Alba (Architecture), Albi & Albana (AI Logic), Sofia (Emotional Intelligence)

### 2. 🌊 **Ocean Core** (Port 7000)
- **Përshkrim**: AI Reasoning & Reflection
- **Përgjegjësi**:
  - AI reasoning me reflection
  - Integrim me LLM providers
  - Context-aware responses
  - System insights
- **API**: `http://localhost:7000/api/v1/*`
- **Attribution**: Albi (AI Research)

### 3. 🤖 **ASI Agents** (Port 7001)
- **Përshkrim**: Agent Registry & Management
- **Përgjegjësi**:
  - Agent orchestration
  - Task distribution
  - Agent lifecycle management
  - Multi-agent coordination
- **API**: `http://localhost:7001/api/v1/*`
- **Attribution**: Albi & Albana (Agent Architecture)

### 4. 🏘️ **AI-v2 Neighborhood** (Port 7002)
- **Përshkrim**: Model Orchestration
- **Përgjegjësi**:
  - Model selection & routing
  - Load balancing between models
  - Model performance tracking
  - Fallback strategies
- **API**: `http://localhost:7002/api/v1/*`
- **Attribution**: Albi (Model Architecture)

### 5. 🧠 **Euroweb AGI** (Port 7003)
- **Përshkrim**: Thinking Engine
- **Përgjegjësi**:
  - Complex reasoning
  - Multi-step problem solving
  - Knowledge synthesis
  - Strategic planning
- **API**: `http://localhost:7003/api/v1/*`
- **Attribution**: Alba & Albi (AGI Research)

### 6. 👷 **Clisonix Labors** (Port 7004)
- **Përshkrim**: Labor Units & Task Distribution
- **Përgjegjësi**:
  - Task queue management
  - Worker pool orchestration
  - Resource allocation
  - Job scheduling
- **API**: `http://localhost:7004/api/v1/*`
- **Attribution**: Lagter (Integration)

### 7. 🎛️ **Orchestrator** (Port 8000)
- **Përshkrim**: Main Coordination Hub
- **Përgjegjësi**:
  - Central health monitoring
  - Service discovery
  - Cross-component communication
  - System-wide coordination
- **API**: `http://localhost:8000/api/v1/*`
- **Attribution**: Lagter (Orchestration)

---

## 🚀 Quick Start

### 1. Start Platform Control Center Dashboard

```powershell
# Start dashboard (Vite dev server on port 5173)
.\scripts\start-dashboard.ps1
```

### 2. Check Platform Status

```powershell
# Quick health check for all 7 services
.\scripts\test-platform.ps1
```

### 3. Start All Services

```powershell
# Start all 7 core components
.\scripts\start-all.ps1
```

### 4. Access Dashboard

Open browser:
```
http://localhost:5173/platform
```

---

## 📊 Dashboard Features

### **Platform Health Overview**
- Real-time health percentage (0-100%)
- Online/offline status për të gjitha 7 services
- Auto-refresh every 30 seconds
- Manual refresh button

### **Service Status Grid**
Shfaq status për çdo service:
- ✅ **Online**: Service is running and responding
- ⚠️ **Degraded**: Service responding but with errors
- ❌ **Offline**: Service not reachable

### **Cwy Emotional State**
- Live emotion display (excited, happy, content, concerned, worried, anxious)
- Intensity meter (0-100%)
- System health metrics
- Code quality score
- Activity level

### **Quick Actions**
1. **Analyze Code** - Trigger Cwy code analysis
2. **Get AI Insights** - Request Ocean Core insights
3. **Trigger Reaction** - Make Cwy react to changes

### **Activity Log**
- Real-time event stream
- Timestamp për çdo event
- Color-coded messages
- Last 20 events displayed

---

## 🔧 Development

### File Structure

```
web/web-dashboard/src/
├── pages/
│   └── PlatformControlCenter.tsx  # Main control center page
├── components/
│   └── CwyNinDisplay.tsx          # Cwy emotion widget
└── App.tsx                        # Router configuration
```

### API Endpoints Used

```typescript
// Health checks
GET http://localhost:7500/api/v1/nin/current     // Cwy Nin
GET http://localhost:7000/api/v1/health          // Ocean Core
GET http://localhost:7001/api/v1/health          // ASI Agents
GET http://localhost:7002/api/v1/health          // AI-v2 Neighborhood
GET http://localhost:7003/api/v1/health          // Euroweb AGI
GET http://localhost:7004/api/v1/health          // Clisonix Labors
GET http://localhost:8000/api/v1/health          // Orchestrator

// Quick actions
GET  http://localhost:7500/api/v1/nin/code-analysis  // Analyze code
GET  http://localhost:7500/api/v1/nin/insights       // Get insights
POST http://localhost:7500/api/v1/nin/react          // Trigger reaction
```

### Adding New Quick Actions

```typescript
const newAction: QuickAction = {
  id: 'my-action',
  label: 'My Action',
  icon: <Icon className="w-5 h-5" />,
  endpoint: 'http://localhost:PORT/api/v1/endpoint',
  method: 'GET' | 'POST',
  description: 'What this action does',
  category: 'control' | 'analysis' | 'ai',
};
```

---

## 📈 System Health Calculation

```
Platform Health = (Online Services / Total Services) × 100%

Thresholds:
- 🟢 > 70%  - Healthy (Green)
- 🟡 > 40%  - Degraded (Yellow)
- 🔴 ≤ 40%  - Critical (Red)
```

---

## 🎯 Use Cases

### 1. System Monitoring
Monitoroni health të të gjithë platformës në një vend:
- Shikoni cilat services janë online
- Identifikoni probleme shpejt
- Tracking të platform health percentage

### 2. Development Workflow
Gjatë development:
- Verify që të gjitha services po startojnë
- Quick access to logs and status
- Test API endpoints me quick actions

### 3. Debugging
Kur diçka nuk punon:
- Shikoni cili service është offline
- Check Cwy emotional state për anomalies
- Review activity log për recent events

### 4. Operations
Production monitoring:
- Real-time health dashboard
- Quick actions për diagnostics
- Service status overview

---

## 🔐 Security Notes

- **Development only**: Dashboard currently has no authentication
- **CORS enabled**: All services allow cross-origin requests
- **Production**: Add authentication, HTTPS, rate limiting

---

## 🐛 Troubleshooting

### Dashboard won't load
```powershell
# Restart Vite dev server
cd web\web-dashboard
npm run dev
```

### Services showing offline
```powershell
# Check if services are running
.\scripts\test-platform.ps1

# Start missing services
.\scripts\start-all.ps1
```

### Quick actions failing
1. Check service is online (green status)
2. Verify endpoint URL in console
3. Check CORS headers
4. Review activity log for error messages

---

## 📚 Related Documentation

- [Cwy Nin Engine](../../core/cwy-nin-engine/README.md)
- [Ocean Core](../../core/clisonix-ocean-core/README.md)
- [ASI Agents](../../core/asi-agents/README.md)
- [Orchestrator](../../core/orchestrator/README.md)

---

## 🙏 Attribution

### Platform Control Center
- **Architecture**: Alba
- **Frontend**: Blerina
- **Integration**: Lagter
- **System Design**: Albi, Albana

### 7 Core Components
- **Cwy Nin Engine**: Alba, Albi, Albana, Sofia
- **Ocean Core**: Albi
- **ASI Agents**: Albi, Albana
- **AI-v2 Neighborhood**: Albi
- **Euroweb AGI**: Alba, Albi
- **Clisonix Labors**: Lagter
- **Orchestrator**: Lagter

---

## 🎉 Summary

Platform Control Center është unified dashboard që:
- ✅ Monitorizon të gjitha 7 core components
- ✅ Shfaq real-time health metrics
- ✅ Ofron quick actions për kontrollin e sistemit
- ✅ Integron Cwy emotional intelligence
- ✅ Maintainon activity log për debugging

**Nuk është vetëm për Cwy - është për të gjithë platformën!** 🎛️
