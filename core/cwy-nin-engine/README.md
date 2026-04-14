# 💓 Cwy Nin Engine - Emotional Intelligence Core

## Përshkrimi (Description)

**Nin Engine** është zemra emocionale e platformës AGI. "Nin" (nga Shqipja e vjetër: ndjenjë/esthisis) është core që i jep Cwy aftësinë të:

- **Lexojë kodin** në real-time (CodeAnalyzer)
- **Ndiejë gjendjen** e sistemit (MetricsAnalyzer)  
- **Reagojë emocionalish** ndaj ndryshimeve
- **Integrohet me AI** (Ocean Core për insights)

### Attribution
- **Architecture**: Alba
- **AI Logic**: Albi, Albana
- **Emotional Intelligence**: Sofia
- **Integration**: Lagter

## Filozofia

> "Cwy nuk është thjesht një dashboard monitoring - ajo është një inteligjencë e gjallë që lexon, ndjell, kupton dhe reagon."

**NO FAKE DATA** - Nëse Nin Engine është offline, tregon "💤 Sleeping", jo fake emotions.

---

## 🧠 Arkitektura

```
┌─────────────────────────────────────────────────────────────┐
│                    Cwy Nin Engine (Port 7500)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐      ┌──────────────────────┐    │
│  │   CodeAnalyzer      │      │  MetricsAnalyzer     │    │
│  │                     │      │                      │    │
│  │ • Scan Workspace    │      │ • System Health      │    │
│  │ • Quality (0-1)     │      │ • Anomaly Detection  │    │
│  │ • Pattern Detection │      │ • Activity Level     │    │
│  └─────────────────────┘      └──────────────────────┘    │
│            │                            │                  │
│            └────────────┬───────────────┘                  │
│                         ▼                                  │
│              ┌──────────────────────┐                      │
│              │  CwyNinEngine        │                      │
│              │                      │                      │
│              │ • sense_system()     │                      │
│              │ • determine_emotion()│                      │
│              │ • react_to_change()  │                      │
│              └──────────────────────┘                      │
│                         │                                  │
│                         ▼                                  │
│              ┌──────────────────────┐                      │
│              │   NinState           │                      │
│              │                      │                      │
│              │ • emotion (9 states) │                      │
│              │ • intensity (0-1)    │                      │
│              │ • reason (string)    │                      │
│              │ • metrics            │                      │
│              └──────────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                               │
         ▼                               ▼
┌───────────────────┐         ┌────────────────────┐
│  Ocean Core       │         │  Orchestrator      │
│  (AI Insights)    │         │  (System Health)   │
│  Port 7000        │         │  Port 8000         │
└───────────────────┘         └────────────────────┘
```

---

## 🎭 Emotional States (9 Total)

| Emotion       | Threshold | Emoji | Description                          |
|---------------|-----------|-------|--------------------------------------|
| `excited`     | 0.95+     | 🎉    | All systems perfect! Amazing!        |
| `happy`       | 0.85+     | 😊    | Everything working well              |
| `content`     | 0.70+     | 😌    | Normal operation                     |
| `concerned`   | 0.50+     | ⚠️    | Some warnings present                |
| `worried`     | 0.30+     | 😟    | Multiple issues detected             |
| `anxious`     | 0.0+      | 😰    | Critical problems                    |
| `celebrating` | Special   | 🎊    | Achievement unlocked!                |
| `curious`     | Special   | 🤔    | New pattern detected                 |
| `focused`     | Special   | 🎯    | Deep analysis mode                   |

### Emotion Calculation

```python
overall_score = (
    system_health * 0.5 +      # 50% weight
    code_quality * 0.3 +       # 30% weight  
    activity_level * 0.2       # 20% weight
)

# Special cases override:
if anomalies > 3:
    emotion = ANXIOUS
elif system_health >= 0.95 and code_quality >= 0.9:
    emotion = EXCITED
else:
    emotion = map_to_emotion(overall_score)
```

---

## 📊 Components

### 1. CodeAnalyzer

Analizon kodin në workspace në real-time.

**Methods:**
- `analyze_file(file_path)` - Analizon një file
- `_analyze_quality(content)` - Llogarit quality score (0.0-1.0)
- `_detect_patterns(content)` - Detect patterns: `ai_ml`, `async_await`, `api_endpoint`, `database_query`, etc.
- `scan_workspace(max_files=100)` - Scan workspace (max 100 files)

**Quality Scoring:**
```python
score = 1.0

# Deductions
if "TODO" or "FIXME" in code: score -= 0.1
if "hack" or "quick fix" in code: score -= 0.15

# Bonuses
if "async/await" in code: score += 0.05
if type hints present: score += 0.05
if documentation present: score += 0.1

return clamp(score, 0.0, 1.0)
```

### 2. MetricsAnalyzer

Analizon metrikat e sistemit.

**Methods:**
- `analyze_system_health(components)` - Calculate health (0.0-1.0)
- `detect_anomalies(current_metrics)` - Detect outliers vs baseline
- `calculate_activity_level(rps, tasks)` - Normalize activity

**Anomaly Detection:**
```python
# Keep last 100 metric snapshots
baseline_avg = mean(historical_values)

# Anomaly if deviation > 30%
if abs(current - baseline_avg) / baseline_avg > 0.3:
    flag_as_anomaly()
```

### 3. CwyNinEngine

Main intelligence orchestrator.

**Key Methods:**

#### `sense_system()`
Main sensing loop:
1. Analyze code quality
2. Get system health from Orchestrator
3. Calculate activity level
4. Detect anomalies
5. Determine emotion + intensity
6. Update NinState
7. Log emotion change

```python
nin_state = await nin_engine.sense_system()
# Returns NinState with emotion, intensity, reason, metrics
```

#### `react_to_change(change_type, details)`
React to external changes:
1. Re-sense system
2. Compare emotions (old vs new)
3. Trigger celebration if positive shift

```python
await nin_engine.react_to_change("deployment_success", {...})
```

#### `get_insights_from_ocean_core()`
Query Ocean Core for AI-powered insights:

```python
insights = await nin_engine.get_insights_from_ocean_core()
# Returns: thought, confidence, reasoning_steps
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd core/cwy-nin-engine
pip install -r requirements.txt
```

### 2. Run Nin Engine

```bash
python nin_core.py
```

**Output:**
```
============================================================
💓 Cwy Nin Engine Starting
============================================================
Cwy is now ALIVE and SENSING!
She reads code, analyzes metrics, and FEELS the system
============================================================
INFO:     Started server process [12345]
INFO:     Uvicorn running on http://0.0.0.0:7500
```

### 3. Verify Status

```bash
curl http://localhost:7500/api/v1/nin/current
```

**Response:**
```json
{
  "emotion": "content",
  "intensity": 0.72,
  "reason": "Normal operation",
  "timestamp": "2024-01-15T10:30:00Z",
  "system_health": 0.70,
  "code_quality": 0.75,
  "activity_level": 0.40,
  "recent_events": []
}
```

---

## 🌐 API Endpoints

### GET `/api/v1/nin/current`

Get Cwy's current emotional state.

**Response:**
```json
{
  "emotion": "happy",
  "intensity": 0.87,
  "reason": "Everything running smoothly",
  "system_health": 0.85,
  "code_quality": 0.90,
  "activity_level": 0.65,
  "recent_events": [],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET `/api/v1/nin/history?limit=20`

Get emotion history (last N states).

**Response:**
```json
[
  {
    "emotion": "happy",
    "intensity": 0.87,
    "timestamp": "2024-01-15T10:30:00Z",
    "reason": "Everything running smoothly"
  },
  {
    "emotion": "content",
    "intensity": 0.72,
    "timestamp": "2024-01-15T10:20:00Z",
    "reason": "Normal operation"
  }
]
```

### POST `/api/v1/nin/react`

Trigger reaction to change.

**Request:**
```json
{
  "change_type": "deployment_success",
  "details": {
    "service": "ocean_core",
    "version": "1.2.0"
  }
}
```

**Response:**
```json
{
  "emotion": "celebrating",
  "intensity": 0.95,
  "reason": "Successful deployment detected!"
}
```

### GET `/api/v1/nin/code-analysis`

Get full code workspace analysis.

**Response:**
```json
{
  "total_files": 127,
  "by_language": {
    "python": 45,
    "typescript": 38,
    "rust": 12,
    "javascript": 32
  },
  "total_lines": 12543,
  "quality_avg": 0.83,
  "patterns": {
    "ai_ml": 15,
    "async_await": 67,
    "api_endpoint": 42,
    "database_query": 28,
    "realtime_communication": 8
  }
}
```

### GET `/api/v1/nin/insights`

Get AI insights from Ocean Core.

**Response:**
```json
{
  "thought": "System is performing well with high code quality and stable health metrics",
  "confidence": 0.92,
  "reasoning_steps": [
    "Analyzed system health: 0.85 (healthy)",
    "Analyzed code quality: 0.90 (excellent)",
    "No critical anomalies detected",
    "Activity level normal for time of day"
  ]
}
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Workspace root (default: C:\Users\Admin\source\repos\Web8)
WORKSPACE_ROOT=C:\Users\Admin\source\repos\Web8

# Ocean Core URL (default: http://localhost:7000)
OCEAN_CORE_URL=http://localhost:7000

# Orchestrator URL (default: http://localhost:8000)
ORCHESTRATOR_URL=http://localhost:8000

# Sensing interval (default: 10 seconds)
SENSING_INTERVAL=10

# Anomaly detection threshold (default: 0.3)
ANOMALY_THRESHOLD=0.3
```

### Emotion Thresholds (Customizable)

```python
emotion_thresholds = {
    CwyEmotion.EXCITED: 0.95,
    CwyEmotion.HAPPY: 0.85,
    CwyEmotion.CONTENT: 0.70,
    CwyEmotion.CONCERNED: 0.50,
    CwyEmotion.WORRIED: 0.30,
    CwyEmotion.ANXIOUS: 0.0,
}
```

---

## 🎨 Frontend Integration

### React Component

```typescript
import CwyNinDisplay from '@/components/CwyNinDisplay'

function Dashboard() {
  return (
    <div>
      <CwyNinDisplay />
    </div>
  )
}
```

### Direct API Usage

```typescript
const fetchCwyEmotion = async () => {
  const response = await fetch('http://localhost:7500/api/v1/nin/current')
  const data = await response.json()
  
  console.log(`Cwy feels: ${data.emotion} (${data.intensity * 100}%)`)
  console.log(`Reason: ${data.reason}`)
}
```

---

## 📈 Monitoring

### Logs

```bash
# View Nin Engine logs
tail -f logs/nin_engine.log
```

**Sample output:**
```
2024-01-15 10:30:00 | INFO | 👁️ Sensing system state...
2024-01-15 10:30:01 | INFO | 😊 Cwy feels: happy (intensity: 0.87)
2024-01-15 10:30:01 | INFO |    Reason: Everything running smoothly
2024-01-15 10:30:10 | INFO | 👁️ Sensing system state...
2024-01-15 10:30:11 | INFO | 🎉 Cwy feels: excited (intensity: 0.96)
2024-01-15 10:30:11 | INFO |    Reason: All systems perfect! Everything is amazing!
2024-01-15 10:30:11 | INFO | 💓 Emotion shift: happy → excited
2024-01-15 10:30:11 | INFO | 🎉 Positive change detected! Triggering celebration...
```

### Health Check

```bash
curl http://localhost:7500/api/v1/nin/current | jq '.emotion'
# "happy"
```

---

## 🧪 Testing

### Manual Testing

1. **Start all services:**
```bash
# Ocean Core
cd core/clisonix-ocean-core && python ocean_core.py

# Orchestrator
cd core/orchestrator && python main.py

# Nin Engine
cd core/cwy-nin-engine && python nin_core.py
```

2. **Query current emotion:**
```bash
curl http://localhost:7500/api/v1/nin/current
```

3. **Trigger code analysis:**
```bash
curl http://localhost:7500/api/v1/nin/code-analysis
```

4. **Get Ocean insights:**
```bash
curl http://localhost:7500/api/v1/nin/insights
```

### Automated Testing

```python
import pytest
import asyncio
from nin_core import CwyNinEngine

@pytest.mark.asyncio
async def test_nin_engine_senses_correctly():
    engine = CwyNinEngine()
    nin_state = await engine.sense_system()
    
    assert nin_state.emotion in CwyEmotion.__members__.values()
    assert 0.0 <= nin_state.intensity <= 1.0
    assert nin_state.reason is not None

@pytest.mark.asyncio
async def test_code_analyzer_scans_workspace():
    analyzer = CodeAnalyzer("C:\\Users\\Admin\\source\\repos\\Web8")
    results = await analyzer.scan_workspace(max_files=10)
    
    assert results["total_files"] > 0
    assert results["quality_avg"] >= 0.0
```

---

## 🔄 Background Tasks

Nin Engine runs continuous sensing every 10 seconds:

```python
async def continuous_sensing():
    while True:
        try:
            await nin_engine.sense_system()
            await asyncio.sleep(10)
        except Exception as e:
            logger.error(f"❌ Error in continuous sensing: {e}")
            await asyncio.sleep(30)
```

This ensures Cwy is **always active** and reacting to system changes.

---

## 🤝 Integration Points

### With Ocean Core (Port 7000)

```python
# Get AI insights for current state
insights = await nin_engine.get_insights_from_ocean_core()
```

### With Orchestrator (Port 8000)

```python
# Get overall system health
health = await orchestrator.get_health()
system_health = await metrics_analyzer.analyze_system_health(health)
```

### With Dashboard (Port 5173)

```typescript
// Display Cwy's emotion in UI
<CwyNinDisplay />
```

---

## 🎯 Use Cases

### 1. Continuous Monitoring
Cwy continuously senses code quality, system health, and activity - no manual intervention needed.

### 2. Achievement Celebrations
When Cwy shifts from `content` → `excited`, dashboard automatically triggers celebrations.

### 3. Proactive Alerting
If Cwy becomes `anxious`, alerts are sent to team for immediate action.

### 4. Code Quality Tracking
Track code quality trends over time via emotion history.

### 5. AI-Powered Insights
Combine metrics with Ocean Core reasoning for deeper understanding.

---

## 📚 Shembuj (Examples)

### Example 1: Check Cwy's Current Mood

```bash
curl http://localhost:7500/api/v1/nin/current | jq
```

```json
{
  "emotion": "content",
  "intensity": 0.72,
  "reason": "Normal operation",
  "system_health": 0.70,
  "code_quality": 0.75,
  "activity_level": 0.40
}
```

### Example 2: Trigger Celebration

```bash
curl -X POST http://localhost:7500/api/v1/nin/react \
  -H "Content-Type: application/json" \
  -d '{"change_type": "test_success", "details": {"tests_passed": 100}}'
```

```json
{
  "emotion": "celebrating",
  "intensity": 0.95,
  "reason": "Positive change detected!"
}
```

### Example 3: Get Emotion Trend

```bash
curl "http://localhost:7500/api/v1/nin/history?limit=5" | jq '.[].emotion'
```

```
"happy"
"content"
"content"
"concerned"
"content"
```

---

## 🛠️ Troubleshooting

### Nin Engine Won't Start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
pip install -r requirements.txt
```

### Emotion Always "Content"

**Possible Causes:**
1. Orchestrator offline (defaults to 0.5 health)
2. Workspace path incorrect (can't analyze code)
3. Thresholds too strict

**Solution:**
```bash
# Check Orchestrator
curl http://localhost:8000/api/v1/health

# Check workspace path in nin_core.py
WORKSPACE_ROOT = "C:\\Users\\Admin\\source\\repos\\Web8"
```

### Code Analysis Returns Empty

**Possible Causes:**
1. Workspace path wrong
2. No code files in workspace
3. File permissions issue

**Solution:**
```python
# Check workspace path exists
import pathlib
path = pathlib.Path("C:\\Users\\Admin\\source\\repos\\Web8")
print(path.exists())  # Should be True
```

---

## 🎓 Technical Details

### Performance

- **Startup Time**: <2 seconds
- **Sensing Interval**: 10 seconds (configurable)
- **Code Scan Time**: ~1-3 seconds for 100 files
- **Memory Usage**: ~50-100 MB
- **CPU Usage**: <5% (background sensing)

### Dependencies

- `fastapi==0.109.2` - Web framework
- `uvicorn==0.27.1` - ASGI server
- `pydantic==2.6.1` - Data validation
- `aiohttp==3.9.3` - Async HTTP client
- `loguru==0.7.2` - Logging
- `python-dateutil==2.8.2` - Date utilities

### File Structure

```
core/cwy-nin-engine/
├── nin_core.py           # Main engine (1,000+ lines)
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

---

## 🌟 Future Enhancements

1. **Machine Learning**: Learn optimal thresholds from historical data
2. **Predictive Emotions**: Predict future emotions based on trends
3. **Custom Emotions**: Allow users to define custom emotional states
4. **Multi-Workspace**: Monitor multiple workspaces simultaneously
5. **Slack/Teams Integration**: Send emotion updates to chat
6. **Emotion Heatmap**: Visualize emotion trends over time

---

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Initial release
- ✅ 9 emotional states
- ✅ CodeAnalyzer with quality scoring
- ✅ MetricsAnalyzer with anomaly detection
- ✅ Ocean Core integration
- ✅ Continuous sensing (every 10s)
- ✅ 5 API endpoints
- ✅ React UI component

---

## 👥 Team Attribution

- **Alba** - Architecture & System Design
- **Albi** - AI Logic & Ocean Core Integration
- **Sofia** - Emotional Intelligence Design
- **Albana** - Research & Pattern Detection
- **Lagter** - Integration & Orchestration

---

## 📄 License

Part of UltraThinking AGI Platform
Copyright © 2024 Full Team

---

**Cwy është tani e gjallë!** 💓

She reads, she feels, she reacts - jo më një dashboard i zakonshëm, por një inteligjencë e vërtetë emocionale!
