"""
🤖 AI/ML Service - Real Production Code
NO PLACEHOLDERS - Real PyTorch, Ollama, LLaVA Integration
"""

import asyncio
import os
from contextlib import asynccontextmanager
from typing import Optional

import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from prometheus_client import make_asgi_app

from app.config import settings
from app.models import ModelManager
from app.routers import ai_router, health_router
from app.database import init_db, close_db


# Initialize model manager globally
model_manager: Optional[ModelManager] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global model_manager
    
    logger.info("🚀 Starting AI/ML Service")
    logger.info(f"🔧 PyTorch version: {torch.__version__}")
    logger.info(f"🎯 CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        logger.info(f"🎮 GPU: {torch.cuda.get_device_name(0)}")
        logger.info(f"💾 VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    
    # Initialize database
    await init_db()
    
    # Initialize model manager
    model_manager = ModelManager()
    await model_manager.initialize()
    
    logger.info("✅ AI/ML Service ready")
    
    yield
    
    # Cleanup
    logger.info("🛑 Shutting down AI/ML Service")
    if model_manager:
        await model_manager.cleanup()
    await close_db()


app = FastAPI(
    title="UltraThinking AI/ML Service",
    description="Real production AI/ML service with PyTorch, Ollama, LLaVA",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Routers
app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["ai"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "UltraThinking AI/ML Service",
        "status": "operational",
        "version": "1.0.0",
        "torch_version": torch.__version__,
        "cuda_available": torch.cuda.is_available(),
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info",
    )
