"""
💓 Cwy Nin Engine - Sensing & Feeling Core
(Nin = Ndjenje/Esthisis në Shqip - Sensation/Feeling)

Inteligjenca e gjallë e platformës që:
- Lexon kod në real-time
- Analizon patterns
- Ndjell gjendjen e sistemit
- Reagon me "emocione"
- Integrohet me Ocean Core për reasoning

Attribution:
- Architecture: Alba
- AI Logic: Albi, Albana
- Emotional Intelligence: Sofia
- Integration: Lagter
"""

import asyncio
import os
import re
from typing import Dict, List, Any, Optional, Tuple
from enum import Enum
from pydantic import BaseModel
from loguru import logger
import aiohttp
from datetime import datetime, timedelta, UTC
import json
from pathlib import Path
import hashlib


# ============================================
# Cwy Emotional States (Nin States)
# ============================================

class CwyEmotion(str, Enum):
    """Emotional states që Cwy mund të ndjejë"""
    EXCITED = "excited"          # All systems perfect! 🎉
    HAPPY = "happy"              # Everything working well 😊
    CONTENT = "content"          # Normal operation 😌
    CONCERNED = "concerned"      # Some warnings ⚠️
    WORRIED = "worried"          # Multiple issues 😟
    ANXIOUS = "anxious"          # Critical problems 😰
    CELEBRATING = "celebrating"  # Achievement unlocked! 🎊
    CURIOUS = "curious"          # New pattern detected 🤔
    FOCUSED = "focused"          # Deep analysis mode 🎯


# ============================================
# Nin State (Feeling State)
# ============================================

class NinState(BaseModel):
    """Current feeling/sensing state of Cwy"""
    emotion: CwyEmotion
    intensity: float  # 0.0 - 1.0
    reason: str
    timestamp: datetime
    
    # Context
    system_health: float  # 0.0 - 1.0
    code_quality: float   # 0.0 - 1.0
    activity_level: float # 0.0 - 1.0
    
    # Triggers
    recent_events: List[str] = []


# ============================================
# Code Analyzer (Lexon Kodin)
# ============================================

class CodeAnalyzer:
    """
    Analizon kod në real-time
    Attribution: Albi (AI), Albana (Research)
    """
    
    def __init__(self, workspace_root: str):
        self.workspace_root = Path(workspace_root)
        self.file_hashes: Dict[str, str] = {}
        self.code_patterns: Dict[str, int] = {}
        
        logger.info(f"📖 CodeAnalyzer initialized for: {workspace_root}")
    
    async def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Analizon një file të vetëm"""
        
        try:
            path = Path(file_path)
            if not path.exists():
                return {"error": "file_not_found"}
            
            # Read file
            content = path.read_text(encoding='utf-8', errors='ignore')
            
            # Calculate hash
            file_hash = hashlib.md5(content.encode()).hexdigest()
            
            # Check if changed
            changed = self.file_hashes.get(str(path)) != file_hash
            self.file_hashes[str(path)] = file_hash
            
            # Analyze code quality
            quality_score = await self._analyze_quality(content, path.suffix)
            
            # Detect patterns
            patterns = await self._detect_patterns(content, path.suffix)
            
            return {
                "file": str(path),
                "changed": changed,
                "lines": len(content.split('\n')),
                "size_bytes": len(content),
                "quality_score": quality_score,
                "patterns": patterns,
                "language": self._detect_language(path.suffix),
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing {file_path}: {e}")
            return {"error": str(e)}
    
    async def _analyze_quality(self, content: str, extension: str) -> float:
        """Analizon cilësinë e kodit (0.0 - 1.0)"""
        
        score = 1.0
        
        # Check for common issues
        if "TODO" in content or "FIXME" in content:
            score -= 0.1
        
        if "hack" in content.lower() or "quick fix" in content.lower():
            score -= 0.15
        
        # Check for good practices
        if "type" in content or "interface" in content:  # TypeScript/type hints
            score += 0.05
        
        if "async" in content and "await" in content:  # Async/await
            score += 0.05
        
        # Check documentation
        doc_patterns = [r'"""', r"'''", r'/\*\*', r'///', r'#']
        has_docs = any(re.search(pattern, content) for pattern in doc_patterns)
        if has_docs:
            score += 0.1
        
        return max(0.0, min(1.0, score))
    
    async def _detect_patterns(self, content: str, extension: str) -> List[str]:
        """Detect code patterns"""
        
        patterns = []
        
        # AI/ML patterns
        if "torch" in content or "tensorflow" in content:
            patterns.append("ai_ml")
        
        # Async patterns
        if "async" in content and "await" in content:
            patterns.append("async_await")
        
        # API patterns
        if "fastapi" in content or "express" in content or "@app.route" in content:
            patterns.append("api_endpoint")
        
        # Database patterns
        if "SELECT" in content or "INSERT" in content or ".query(" in content:
            patterns.append("database_query")
        
        # Real-time patterns
        if "websocket" in content.lower() or "socket.io" in content:
            patterns.append("realtime_communication")
        
        # Testing patterns
        if "test_" in content or "describe(" in content or "it(" in content:
            patterns.append("unit_test")
        
        return patterns
    
    def _detect_language(self, extension: str) -> str:
        """Detect programming language"""
        
        lang_map = {
            '.py': 'python',
            '.ts': 'typescript',
            '.tsx': 'typescript_react',
            '.js': 'javascript',
            '.jsx': 'javascript_react',
            '.rs': 'rust',
            '.go': 'go',
            '.cs': 'csharp',
            '.java': 'java',
        }
        
        return lang_map.get(extension, 'unknown')
    
    async def scan_workspace(self, max_files: int = 100) -> Dict[str, Any]:
        """Scan entire workspace"""
        
        results: Dict[str, Any] = {
            "total_files": 0,
            "by_language": {},
            "total_lines": 0,
            "quality_avg": 0.0,
            "patterns": {},
        }
        
        # Common code extensions
        code_extensions = {'.py', '.ts', '.tsx', '.js', '.jsx', '.rs', '.go', '.cs', '.java'}
        
        files_analyzed = 0
        quality_scores = []
        
        for ext in code_extensions:
            for file_path in self.workspace_root.rglob(f'*{ext}'):
                if files_analyzed >= max_files:
                    break
                
                # Skip node_modules, .git, etc.
                if any(part.startswith('.') or part == 'node_modules' for part in file_path.parts):
                    continue
                
                analysis = await self.analyze_file(str(file_path))
                if "error" not in analysis:
                    results["total_files"] += 1
                    results["total_lines"] += analysis["lines"]
                    quality_scores.append(analysis["quality_score"])
                    
                    # Count by language
                    lang = analysis["language"]
                    results["by_language"][lang] = results["by_language"].get(lang, 0) + 1
                    
                    # Count patterns
                    for pattern in analysis["patterns"]:
                        results["patterns"][pattern] = results["patterns"].get(pattern, 0) + 1
                    
                    files_analyzed += 1
        
        if quality_scores:
            results["quality_avg"] = sum(quality_scores) / len(quality_scores)
        
        return results


# ============================================
# Metrics Analyzer (Analizon Metrikat)
# ============================================

class MetricsAnalyzer:
    """
    Analizon metrikat e sistemit
    Attribution: Albi (AI), Jona (Data Science)
    """
    
    def __init__(self):
        self.metrics_history: List[Dict] = []
        self.anomaly_threshold = 0.3
        
        logger.info("📊 MetricsAnalyzer initialized")
    
    async def analyze_system_health(
        self,
        components: Dict[str, str]  # name -> status
    ) -> float:
        """Calculate overall system health (0.0 - 1.0)"""
        
        if not components:
            return 0.0
        
        health_map = {
            "healthy": 1.0,
            "online": 1.0,
            "active": 1.0,
            "degraded": 0.5,
            "idle": 0.7,
            "offline": 0.0,
            "error": 0.0,
        }
        
        total_health = sum(health_map.get(status, 0.5) for status in components.values())
        return total_health / len(components)
    
    async def detect_anomalies(
        self,
        current_metrics: Dict[str, float]
    ) -> List[str]:
        """Detect metric anomalies"""
        
        anomalies = []
        
        # Add to history
        self.metrics_history.append({
            "timestamp": datetime.now(UTC),
            "metrics": current_metrics.copy(),
        })
        
        # Keep only last 100 entries
        if len(self.metrics_history) > 100:
            self.metrics_history = self.metrics_history[-100:]
        
        if len(self.metrics_history) < 5:
            return []  # Not enough data
        
        # Calculate baselines
        for metric_name, current_value in current_metrics.items():
            historical_values = [
                entry["metrics"].get(metric_name, 0)
                for entry in self.metrics_history[:-1]
            ]
            
            if not historical_values:
                continue
            
            avg = sum(historical_values) / len(historical_values)
            
            # Check for sudden spike/drop
            if abs(current_value - avg) / (avg + 0.001) > self.anomaly_threshold:
                anomalies.append(f"{metric_name}_anomaly")
        
        return anomalies
    
    async def calculate_activity_level(
        self,
        requests_per_second: float,
        tasks_completed: int,
    ) -> float:
        """Calculate system activity level (0.0 - 1.0)"""
        
        # Normalize metrics
        rps_score = min(requests_per_second / 1000, 1.0)  # Max at 1000 rps
        tasks_score = min(tasks_completed / 100, 1.0)     # Max at 100 tasks
        
        return (rps_score + tasks_score) / 2


# ============================================
# Cwy Nin Engine (Main Intelligence)
# ============================================

class CwyNinEngine:
    """
    Cwy Nin Engine - Core Intelligence
    
    Attributes emotional intelligence to the platform
    Reads code, analyzes metrics, feels the system state
    
    Attribution:
    - Architecture: Alba
    - AI Logic: Albi, Albana
    - Emotional Intelligence: Sofia
    - Integration: Lagter
    """
    
    def __init__(
        self,
        workspace_root: str = "C:\\Users\\Admin\\source\\repos\\Web8",
        ocean_core_url: str = "http://localhost:7000",
    ):
        self.workspace_root = workspace_root
        self.ocean_core_url = ocean_core_url
        
        # Components
        self.code_analyzer = CodeAnalyzer(workspace_root)
        self.metrics_analyzer = MetricsAnalyzer()
        
        # State
        self.current_nin: Optional[NinState] = None
        self.emotion_history: List[NinState] = []
        
        # Thresholds for emotions
        self.emotion_thresholds = {
            CwyEmotion.EXCITED: 0.95,
            CwyEmotion.HAPPY: 0.85,
            CwyEmotion.CONTENT: 0.70,
            CwyEmotion.CONCERNED: 0.50,
            CwyEmotion.WORRIED: 0.30,
            CwyEmotion.ANXIOUS: 0.0,
        }
        
        logger.info("💓 Cwy Nin Engine initialized")
        logger.info(f"   Workspace: {workspace_root}")
        logger.info("   Ready to sense and feel the system!")
    
    async def sense_system(self) -> NinState:
        """
        Main sensing/feeling function
        Reads everything and determines emotional state
        """
        
        logger.debug("👁️ Sensing system state...")
        
        # 1. Analyze code
        code_analysis = await self.code_analyzer.scan_workspace(max_files=50)
        code_quality = code_analysis.get("quality_avg", 0.5)
        
        # 2. Get system health
        system_health = await self._get_system_health()
        
        # 3. Get activity level
        activity_level = await self._get_activity_level()
        
        # 4. Detect anomalies
        anomalies = await self.metrics_analyzer.detect_anomalies({
            "system_health": system_health,
            "code_quality": code_quality,
            "activity": activity_level,
        })
        
        # 5. Determine emotion
        emotion, intensity, reason = await self._determine_emotion(
            system_health=system_health,
            code_quality=code_quality,
            activity_level=activity_level,
            anomalies=anomalies,
        )
        
        # 6. Create Nin state
        nin_state = NinState(
            emotion=emotion,
            intensity=intensity,
            reason=reason,
            timestamp=datetime.now(UTC),
            system_health=system_health,
            code_quality=code_quality,
            activity_level=activity_level,
            recent_events=anomalies,
        )
        
        # 7. Update state
        self.current_nin = nin_state
        self.emotion_history.append(nin_state)
        
        # Keep last 100
        if len(self.emotion_history) > 100:
            self.emotion_history = self.emotion_history[-100:]
        
        # 8. Log emotion
        emotion_emoji = self._get_emotion_emoji(emotion)
        logger.info(f"{emotion_emoji} Cwy feels: {emotion} (intensity: {intensity:.2f})")
        logger.info(f"   Reason: {reason}")
        
        return nin_state
    
    async def _get_system_health(self) -> float:
        """Get overall system health"""
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "http://localhost:8000/api/v1/health",
                    timeout=aiohttp.ClientTimeout(total=5),
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Count healthy components
                        components = {
                            "ocean_core": data.get("ocean_core"),
                            "asi_agents": data.get("asi_agents"),
                            "ai_v2": data.get("ai_v2_neighborhood"),
                            "euroweb": data.get("euroweb_agi"),
                            "labors": data.get("clisonix_labors"),
                        }
                        
                        return await self.metrics_analyzer.analyze_system_health(components)
        except Exception as e:
            logger.warning(f"⚠️ Could not get system health: {e}")
        
        return 0.5  # Default middle value
    
    async def _get_activity_level(self) -> float:
        """Get system activity level"""
        
        # TODO: Get real metrics from Prometheus
        # For now, estimate based on time of day
        hour = datetime.now(UTC).hour
        
        if 8 <= hour <= 18:  # Work hours
            return 0.7
        else:
            return 0.3
    
    async def _determine_emotion(
        self,
        system_health: float,
        code_quality: float,
        activity_level: float,
        anomalies: List[str],
    ) -> Tuple[CwyEmotion, float, str]:
        """Determine Cwy's current emotion"""
        
        # Calculate overall score
        overall = (system_health * 0.5 + code_quality * 0.3 + activity_level * 0.2)
        
        # Check for special states
        if len(anomalies) > 3:
            return CwyEmotion.ANXIOUS, 0.9, f"Multiple anomalies detected: {len(anomalies)}"
        
        if system_health >= 0.95 and code_quality >= 0.9:
            return CwyEmotion.EXCITED, 1.0, "All systems perfect! Everything is amazing!"
        
        # Standard emotion mapping
        if overall >= self.emotion_thresholds[CwyEmotion.EXCITED]:
            return CwyEmotion.EXCITED, overall, "System performance excellent!"
        elif overall >= self.emotion_thresholds[CwyEmotion.HAPPY]:
            return CwyEmotion.HAPPY, overall, "Everything running smoothly"
        elif overall >= self.emotion_thresholds[CwyEmotion.CONTENT]:
            return CwyEmotion.CONTENT, overall, "Normal operation"
        elif overall >= self.emotion_thresholds[CwyEmotion.CONCERNED]:
            return CwyEmotion.CONCERNED, overall, "Some issues detected"
        elif overall >= self.emotion_thresholds[CwyEmotion.WORRIED]:
            return CwyEmotion.WORRIED, overall, "Multiple problems present"
        else:
            return CwyEmotion.ANXIOUS, overall, "Critical issues require attention"
    
    def _get_emotion_emoji(self, emotion: CwyEmotion) -> str:
        """Get emoji for emotion"""
        
        emoji_map = {
            CwyEmotion.EXCITED: "🎉",
            CwyEmotion.HAPPY: "😊",
            CwyEmotion.CONTENT: "😌",
            CwyEmotion.CONCERNED: "⚠️",
            CwyEmotion.WORRIED: "😟",
            CwyEmotion.ANXIOUS: "😰",
            CwyEmotion.CELEBRATING: "🎊",
            CwyEmotion.CURIOUS: "🤔",
            CwyEmotion.FOCUSED: "🎯",
        }
        
        return emoji_map.get(emotion, "💓")
    
    async def react_to_change(self, change_type: str, details: Dict[str, Any]):
        """React to system changes"""
        
        logger.info(f"⚡ Cwy reacting to: {change_type}")
        
        # Re-sense after change
        new_nin = await self.sense_system()
        
        # Check for emotion shift
        if self.current_nin and new_nin.emotion != self.current_nin.emotion:
            logger.info(f"💓 Emotion shift: {self.current_nin.emotion} → {new_nin.emotion}")
            
            # Trigger celebration if positive shift
            if self._is_positive_shift(self.current_nin.emotion, new_nin.emotion):
                logger.info("🎉 Positive change detected! Triggering celebration...")
        
        return new_nin
    
    def _is_positive_shift(self, old_emotion: CwyEmotion, new_emotion: CwyEmotion) -> bool:
        """Check if emotion shift is positive"""
        
        emotion_rank = {
            CwyEmotion.ANXIOUS: 1,
            CwyEmotion.WORRIED: 2,
            CwyEmotion.CONCERNED: 3,
            CwyEmotion.CONTENT: 4,
            CwyEmotion.HAPPY: 5,
            CwyEmotion.EXCITED: 6,
            CwyEmotion.CELEBRATING: 7,
        }
        
        return emotion_rank.get(new_emotion, 0) > emotion_rank.get(old_emotion, 0)
    
    async def get_insights_from_ocean_core(self) -> Optional[Dict]:
        """Get AI insights from Ocean Core"""
        
        if not self.current_nin:
            return None
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.ocean_core_url}/api/v1/reason",
                    json={
                        "query": f"Analyze system state: {self.current_nin.emotion}, health: {self.current_nin.system_health:.2f}",
                        "enable_reflection": True,
                    },
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as response:
                    if response.status == 200:
                        return await response.json()
        except Exception as e:
            logger.warning(f"⚠️ Could not get Ocean Core insights: {e}")
        
        return None


# ============================================
# FastAPI Service
# ============================================

if __name__ == "__main__":
    import uvicorn
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from contextlib import asynccontextmanager

    # Background task - continuous sensing
    async def continuous_sensing():
        """Continuously sense system every 10 seconds"""
        while True:
            try:
                await nin_engine.sense_system()
                await asyncio.sleep(10)
            except Exception as e:
                logger.error(f"❌ Error in continuous sensing: {e}")
                await asyncio.sleep(30)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        """Lifespan event handler"""
        # Startup
        logger.info("=" * 60)
        logger.info("💓 Cwy Nin Engine Starting")
        logger.info("=" * 60)
        logger.info("Cwy is now ALIVE and SENSING!")
        logger.info("She reads code, analyzes metrics, and FEELS the system")
        logger.info("=" * 60)

        # Initial sensing
        await nin_engine.sense_system()

        # Start background sensing
        task = asyncio.create_task(continuous_sensing())

        yield

        # Shutdown
        task.cancel()
        logger.info("💓 Cwy Nin Engine shutting down...")

    app = FastAPI(title="Cwy Nin Engine API", lifespan=lifespan)
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Initialize engine
    nin_engine = CwyNinEngine()
    
    @app.get("/api/v1/nin/current")
    async def get_current_nin():
        """Get Cwy's current emotional state"""
        
        nin = await nin_engine.sense_system()
        return nin
    
    @app.get("/api/v1/nin/history")
    async def get_nin_history(limit: int = 20):
        """Get emotion history"""
        
        return nin_engine.emotion_history[-limit:]
    
    @app.post("/api/v1/nin/react")
    async def react_to_change(change_type: str, details: Dict[str, Any]):
        """Trigger reaction to change"""
        
        nin = await nin_engine.react_to_change(change_type, details)
        return nin
    
    @app.get("/api/v1/nin/code-analysis")
    async def get_code_analysis():
        """Get code analysis"""
        
        return await nin_engine.code_analyzer.scan_workspace()
    
    @app.get("/api/v1/nin/insights")
    async def get_insights():
        """Get AI insights from Ocean Core"""

        insights = await nin_engine.get_insights_from_ocean_core()
        return insights or {"message": "No insights available"}

    uvicorn.run(app, host="0.0.0.0", port=7500)
