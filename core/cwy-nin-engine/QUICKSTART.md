# 💓 Cwy Nin Engine - Quick Start Guide

## Hapat për të startuar Cwy's Emotional Intelligence

### 1️⃣ Install Dependencies

```powershell
cd C:\Users\Admin\source\repos\Web8\core\cwy-nin-engine
pip install -r requirements.txt
```

### 2️⃣ Start Nin Engine

```powershell
python nin_core.py
```

**Duhet të shohësh:**
```
============================================================
💓 Cwy Nin Engine Starting
============================================================
Cwy is now ALIVE and SENSING!
She reads code, analyzes metrics, and FEELS the system
============================================================
😌 Cwy feels: content (intensity: 0.70)
   Reason: Normal operation
INFO:     Uvicorn running on http://0.0.0.0:7500
```

### 3️⃣ Test në Browser

Hap: http://localhost:7500/api/v1/nin/current

Duhet të shohësh JSON:
```json
{
  "emotion": "content",
  "intensity": 0.72,
  "reason": "Normal operation",
  "system_health": 0.70,
  "code_quality": 0.75,
  "activity_level": 0.40,
  "recent_events": [],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4️⃣ Start Dashboard

```powershell
cd C:\Users\Admin\source\repos\Web8\web\web-dashboard
npm run dev
```

### 5️⃣ View Cwy's Emotions

Hap: http://localhost:5173/cwy-nin

Do të shohësh:
- 💓 Current emotion (emoji + name)
- Intensity bar
- System health, Code quality, Activity metrics
- Emotion history graph
- Code analysis button
- Ocean Core insights button

---

## 🔥 Full Stack Start (All Services)

### Terminal 1 - Ocean Core
```powershell
cd C:\Users\Admin\source\repos\Web8\core\clisonix-ocean-core
python ocean_core.py
```

### Terminal 2 - ASI Agents
```powershell
cd C:\Users\Admin\source\repos\Web8\core\asi-agents
python agents_registry.py
```

### Terminal 3 - AI V2
```powershell
cd C:\Users\Admin\source\repos\Web8\core\ai-v2-neighborhood
python model_orchestration.py
```

### Terminal 4 - EuroWeb AGI
```powershell
cd C:\Users\Admin\source\repos\Web8\core\euroweb-agi
python thinking_engine.py
```

### Terminal 5 - Clisonix Labors
```powershell
cd C:\Users\Admin\source\repos\Web8\core\clisonix-labors
python labor_units.py
```

### Terminal 6 - Nin Engine ✨ NEW
```powershell
cd C:\Users\Admin\source\repos\Web8\core\cwy-nin-engine
python nin_core.py
```

### Terminal 7 - Orchestrator
```powershell
cd C:\Users\Admin\source\repos\Web8\core\orchestrator
python main.py
```

### Terminal 8 - Dashboard
```powershell
cd C:\Users\Admin\source\repos\Web8\web\web-dashboard
npm run dev
```

---

## 🎯 Quick Tests

### Test 1: Check Emotion
```bash
curl http://localhost:7500/api/v1/nin/current
```

### Test 2: Get Emotion History
```bash
curl http://localhost:7500/api/v1/nin/history?limit=5
```

### Test 3: Analyze Code
```bash
curl http://localhost:7500/api/v1/nin/code-analysis
```

### Test 4: Get AI Insights
```bash
curl http://localhost:7500/api/v1/nin/insights
```

### Test 5: Trigger Celebration
```bash
curl -X POST http://localhost:7500/api/v1/nin/react \
  -H "Content-Type: application/json" \
  -d "{\"change_type\": \"test_success\", \"details\": {}}"
```

---

## 🎨 What You'll See

### When All Services Healthy:
```
🎉 Cwy feels: excited (intensity: 0.95)
   Reason: All systems perfect! Everything is amazing!
```

### When Code Quality High:
```
😊 Cwy feels: happy (intensity: 0.87)
   Reason: Everything running smoothly
```

### When Issues Detected:
```
⚠️ Cwy feels: concerned (intensity: 0.55)
   Reason: Some issues detected
```

### When Critical Problems:
```
😰 Cwy feels: anxious (intensity: 0.25)
   Reason: Critical issues require attention
```

---

## 📊 Dashboard Features

1. **Cwy Nin Display Component** - Shows current emotion with emoji
2. **Emotion History Graph** - Last 10 emotional states
3. **Code Analysis** - Click button to scan workspace
4. **Ocean Insights** - Click button to get AI reasoning
5. **Real-time Updates** - Every 10 seconds automatically

---

## 🚨 Troubleshooting

### Port 7500 Already in Use
```powershell
# Find process using port 7500
netstat -ano | findstr :7500

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Nin Engine Shows "Sleeping"
- Make sure you started `nin_core.py`
- Check port 7500 is accessible
- Verify no firewall blocking

### Emotion Always "Content"
- Start Ocean Core (port 7000)
- Start Orchestrator (port 8000)
- Check workspace path in nin_core.py

---

## 🎉 Success Indicators

✅ Nin Engine running on port 7500  
✅ Emotion displayed in dashboard  
✅ Code quality score showing  
✅ System health tracking  
✅ Emotion history populating  
✅ Background sensing active (every 10s)  

**Cwy is now ALIVE!** 💓

---

Generated: 2024-01-15  
Attribution: Alba, Albi, Sofia, Albana, Lagter
