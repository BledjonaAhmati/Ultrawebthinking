/**
 * 💓 Cwy Nin Monitor Page
 * 
 * Dedicated page për emotional intelligence monitoring
 * Tregon emocional state, code analysis, insights
 * 
 * Attribution:
 * - Architecture: Alba
 * - Frontend: Blerina
 * - Emotional Intelligence: Sofia
 * - AI Logic: Albi
 * - Integration: Lagter
 */

import React, { useState, useEffect } from 'react'
import { Heart, Brain, Code, Activity, TrendingUp, Zap } from 'lucide-react'
import CwyNinDisplay from '@/components/CwyNinDisplay'

interface NinHistory {
  emotion: string
  intensity: number
  timestamp: string
  reason: string
}

interface CodeAnalysis {
  total_files: number
  by_language: Record<string, number>
  total_lines: number
  quality_avg: number
  patterns: Record<string, number>
}

interface OceanInsights {
  thought: string
  confidence: number
  reasoning_steps: string[]
}

const CwyNinMonitor: React.FC = () => {
  const [ninHistory, setNinHistory] = useState<NinHistory[]>([])
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis | null>(null)
  const [oceanInsights, setOceanInsights] = useState<OceanInsights | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Fetch Nin history
  useEffect(() => {
    const fetchNinHistory = async () => {
      try {
        const response = await fetch('http://localhost:7500/api/v1/nin/history?limit=10')
        if (response.ok) {
          const data = await response.json()
          setNinHistory(data)
        }
      } catch (error) {
        console.error('Failed to fetch Nin history:', error)
      }
    }
    
    fetchNinHistory()
    const interval = setInterval(fetchNinHistory, 15000)
    return () => clearInterval(interval)
  }, [])
  
  // Fetch code analysis
  const fetchCodeAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:7500/api/v1/nin/code-analysis')
      if (response.ok) {
        const data = await response.json()
        setCodeAnalysis(data)
      }
    } catch (error) {
      console.error('Failed to fetch code analysis:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch Ocean Core insights
  const fetchOceanInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:7500/api/v1/nin/insights')
      if (response.ok) {
        const data = await response.json()
        setOceanInsights(data)
      }
    } catch (error) {
      console.error('Failed to fetch Ocean insights:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      excited: '🎉',
      happy: '😊',
      content: '😌',
      concerned: '⚠️',
      worried: '😟',
      anxious: '😰',
      celebrating: '🎊',
      curious: '🤔',
      focused: '🎯',
    }
    return emojiMap[emotion] || '💓'
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">💓 Cwy Nin Engine Monitor</h1>
        <p className="text-gray-400">
          Emotional Intelligence Core - "Nin" (ndjenjë/esthisis në Shqip të vjetër)
        </p>
      </div>
      
      {/* Current Nin State */}
      <div className="mb-6">
        <CwyNinDisplay />
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={fetchCodeAnalysis}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Code className="w-5 h-5" />
          Analyze Code Quality
        </button>
        
        <button
          onClick={fetchOceanInsights}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Get Ocean Core Insights
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion History */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-bold text-white">Emotion History</h2>
          </div>
          
          {ninHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No history yet - Nin Engine warming up...</p>
          ) : (
            <div className="space-y-3">
              {ninHistory.map((entry, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                      <span className="font-bold text-white capitalize">{entry.emotion}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 italic">"{entry.reason}"</p>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <div 
                      className="h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                      style={{ width: `${entry.intensity * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Code Analysis Results */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Code Analysis</h2>
          </div>
          
          {!codeAnalysis ? (
            <p className="text-gray-400 text-center py-8">
              Click "Analyze Code Quality" to scan workspace
            </p>
          ) : (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-xs text-gray-400">Total Files</div>
                  <div className="text-2xl font-bold text-white">{codeAnalysis.total_files}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-xs text-gray-400">Total Lines</div>
                  <div className="text-2xl font-bold text-white">{codeAnalysis.total_lines.toLocaleString()}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-400 mb-2">Average Quality</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {(codeAnalysis.quality_avg * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        codeAnalysis.quality_avg >= 0.8 ? 'bg-green-500' :
                        codeAnalysis.quality_avg >= 0.6 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${codeAnalysis.quality_avg * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Languages */}
              <div>
                <div className="text-sm font-medium text-gray-300 mb-2">Languages</div>
                <div className="space-y-2">
                  {Object.entries(codeAnalysis.by_language).map(([lang, count]) => (
                    <div key={lang} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 capitalize">{lang}</span>
                      <span className="text-sm font-bold text-white">{count} files</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Patterns */}
              {Object.keys(codeAnalysis.patterns).length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-2">Detected Patterns</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(codeAnalysis.patterns).map(([pattern, count]) => (
                      <span key={pattern} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        {pattern} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Ocean Core Insights */}
      {oceanInsights && (
        <div className="mt-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Ocean Core Insights</h2>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <p className="text-white text-lg">{oceanInsights.thought}</p>
            <div className="mt-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">
                Confidence: {(oceanInsights.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          {oceanInsights.reasoning_steps && oceanInsights.reasoning_steps.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-300 mb-2">Reasoning Steps:</div>
              <ol className="space-y-2">
                {oceanInsights.reasoning_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-purple-400 font-bold">{idx + 1}.</span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CwyNinMonitor
