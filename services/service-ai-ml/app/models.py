"""
Real Model Manager - PyTorch, Ollama, LLaVA Integration
NO FAKE DATA - Production-ready model loading and inference
"""

import asyncio
from typing import Dict, List, Optional, Any
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    AutoProcessor,
    LlavaForConditionalGeneration,
)
from sentence_transformers import SentenceTransformer
import ollama
from loguru import logger
from PIL import Image
import io
import base64

from app.config import settings


class ModelManager:
    """Manages all AI/ML models"""
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models: Dict[str, Any] = {}
        self.tokenizers: Dict[str, Any] = {}
        self.processors: Dict[str, Any] = {}
        
        logger.info(f"🎯 Using device: {self.device}")
        
    async def initialize(self):
        """Initialize all models"""
        logger.info("🔄 Loading models...")
        
        # Load LLaVA (Vision-Language Model)
        await self._load_llava()
        
        # Load embedding model
        await self._load_embeddings()
        
        # Initialize Ollama client
        await self._init_ollama()
        
        logger.info("✅ All models loaded successfully")
    
    async def _load_llava(self):
        """Load LLaVA vision-language model"""
        try:
            logger.info("📥 Loading LLaVA model...")
            
            model_name = "llava-hf/llava-1.5-7b-hf"
            
            # Load processor
            self.processors["llava"] = AutoProcessor.from_pretrained(model_name)
            
            # Load model
            self.models["llava"] = LlavaForConditionalGeneration.from_pretrained(
                model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
            )
            
            if self.device == "cpu":
                self.models["llava"].to(self.device)
            
            logger.info(f"✅ LLaVA loaded on {self.device}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load LLaVA: {e}")
            # Fallback: use smaller model or skip
            logger.warning("⚠️  Running without LLaVA")
    
    async def _load_embeddings(self):
        """Load sentence embeddings model"""
        try:
            logger.info("📥 Loading embedding model...")
            
            model_name = "sentence-transformers/all-MiniLM-L6-v2"
            self.models["embeddings"] = SentenceTransformer(model_name)
            self.models["embeddings"].to(self.device)
            
            logger.info(f"✅ Embeddings model loaded on {self.device}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load embeddings: {e}")
    
    async def _init_ollama(self):
        """Initialize Ollama client"""
        try:
            logger.info("🔌 Connecting to Ollama...")
            
            # Test connection
            models = ollama.list()
            logger.info(f"✅ Ollama connected. Available models: {len(models.get('models', []))}")
            
            # Pull default model if not exists
            default_model = settings.OLLAMA_MODEL
            try:
                ollama.pull(default_model)
                logger.info(f"📥 Ollama model '{default_model}' ready")
            except Exception as e:
                logger.warning(f"⚠️  Could not pull Ollama model: {e}")
            
        except Exception as e:
            logger.error(f"❌ Ollama not available: {e}")
            logger.warning("⚠️  Running without Ollama")
    
    async def generate_text(
        self,
        prompt: str,
        model: str = "ollama",
        max_tokens: int = 512,
        temperature: float = 0.7,
    ) -> str:
        """Generate text using specified model"""
        
        if model == "ollama":
            return await self._generate_ollama(prompt, max_tokens, temperature)
        else:
            raise ValueError(f"Unknown model: {model}")
    
    async def _generate_ollama(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
    ) -> str:
        """Generate text using Ollama"""
        try:
            response = ollama.generate(
                model=settings.OLLAMA_MODEL,
                prompt=prompt,
                options={
                    "num_predict": max_tokens,
                    "temperature": temperature,
                },
            )
            
            return response["response"]
            
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Generation failed: {e}")
    
    async def analyze_image(
        self,
        image_data: bytes,
        prompt: str = "Describe this image in detail",
    ) -> str:
        """Analyze image using LLaVA"""
        
        if "llava" not in self.models:
            raise HTTPException(
                status_code=503,
                detail="LLaVA model not available"
            )
        
        try:
            # Load image
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            
            # Prepare inputs
            inputs = self.processors["llava"](
                text=prompt,
                images=image,
                return_tensors="pt"
            ).to(self.device)
            
            # Generate
            with torch.no_grad():
                outputs = self.models["llava"].generate(
                    **inputs,
                    max_new_tokens=512,
                    do_sample=False,
                )
            
            # Decode
            response = self.processors["llava"].batch_decode(
                outputs,
                skip_special_tokens=True
            )[0]
            
            return response
            
        except Exception as e:
            logger.error(f"Image analysis failed: {e}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")
    
    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings for texts"""
        
        if "embeddings" not in self.models:
            raise HTTPException(
                status_code=503,
                detail="Embeddings model not available"
            )
        
        try:
            embeddings = self.models["embeddings"].encode(
                texts,
                convert_to_numpy=True,
                show_progress_bar=False,
            )
            
            return embeddings.tolist()
            
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Embedding failed: {e}")
    
    async def cleanup(self):
        """Cleanup models"""
        logger.info("🧹 Cleaning up models...")
        
        for model_name, model in self.models.items():
            try:
                if hasattr(model, "to"):
                    model.to("cpu")
                del model
                logger.info(f"✅ Cleaned up {model_name}")
            except Exception as e:
                logger.warning(f"⚠️  Error cleaning up {model_name}: {e}")
        
        self.models.clear()
        self.tokenizers.clear()
        self.processors.clear()
        
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            logger.info("🧹 CUDA cache cleared")
