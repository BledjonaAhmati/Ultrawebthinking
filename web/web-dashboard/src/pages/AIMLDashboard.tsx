/**
 * 🤖 AI/ML Dashboard
 * Real PyTorch, Ollama, LLaVA model management and inference
 */

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Brain, Upload, Send, Zap, Image as ImageIcon } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface AIStatus {
  torch_version: string
  cuda_available: boolean
  gpu_name?: string
  vram_total?: number
  models_loaded: string[]
}

export default function AIMLDashboard() {
  const [prompt, setPrompt] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generatedText, setGeneratedText] = useState('')
  const [imageAnalysis, setImageAnalysis] = useState('')

  // Fetch AI service status
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['ai-status'],
    queryFn: async () => {
      const response = await api.ai.status()
      return response.data as AIStatus
    },
    refetchInterval: 10000,
  })

  // Text generation mutation
  const generateMutation = useMutation({
    mutationFn: async (data: { prompt: string; model?: string }) => {
      const response = await api.ai.generate(data)
      return response.data.text
    },
    onSuccess: (text) => {
      setGeneratedText(text)
      toast.success('Text generated successfully!')
    },
    onError: () => {
      toast.error('Failed to generate text')
    },
  })

  // Image analysis mutation
  const analyzeMutation = useMutation({
    mutationFn: async (data: { image: string; prompt?: string }) => {
      const response = await api.ai.analyzeImage(data)
      return response.data.analysis
    },
    onSuccess: (analysis) => {
      setImageAnalysis(analysis)
      toast.success('Image analyzed successfully!')
    },
    onError: () => {
      toast.error('Failed to analyze image')
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateText = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }
    generateMutation.mutate({ prompt, model: 'ollama' })
  }

  const handleAnalyzeImage = () => {
    if (!selectedImage || !imagePreview) {
      toast.error('Please select an image')
      return
    }
    // Convert to base64
    const base64 = imagePreview.split(',')[1]
    analyzeMutation.mutate({ 
      image: base64,
      prompt: prompt || 'Describe this image in detail'
    })
  }

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI/ML Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Real PyTorch, Ollama & LLaVA integration
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <Brain className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">PyTorch</h3>
          <p className="text-sm opacity-90">{status?.torch_version}</p>
        </div>

        <div className={`rounded-lg p-6 text-white ${
          status?.cuda_available 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
        }`}>
          <Zap className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">
            {status?.cuda_available ? 'CUDA Enabled' : 'CPU Mode'}
          </h3>
          {status?.gpu_name && (
            <p className="text-sm opacity-90">{status.gpu_name}</p>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
          <Brain className="w-8 h-8 mb-2" />
          <h3 className="font-semibold">Models Loaded</h3>
          <p className="text-2xl font-bold">{status?.models_loaded.length || 0}</p>
        </div>
      </div>

      {/* Text Generation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Text Generation (Ollama)
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              placeholder="Enter your prompt here..."
            />
          </div>

          <button
            onClick={handleGenerateText}
            disabled={generateMutation.isPending}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateMutation.isPending ? 'Generating...' : 'Generate'}
          </button>

          {generatedText && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Generated Text:</h3>
              <p className="whitespace-pre-wrap">{generatedText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Analysis (LLaVA) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image Analysis (LLaVA)
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                <Upload className="w-4 h-4" />
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedImage.name}
                </span>
              )}
            </div>
          </div>

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-md rounded-lg shadow-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Analysis Prompt (Optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Describe this image in detail"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button
            onClick={handleAnalyzeImage}
            disabled={analyzeMutation.isPending || !selectedImage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze Image'}
          </button>

          {imageAnalysis && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Analysis:</h3>
              <p className="whitespace-pre-wrap">{imageAnalysis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Loaded Models */}
      {status?.models_loaded && status.models_loaded.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Loaded Models</h2>
          <div className="space-y-2">
            {status.models_loaded.map((model, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-mono text-sm">{model}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
