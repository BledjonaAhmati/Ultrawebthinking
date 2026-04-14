/**
 * 💓 Cwy Nin Display - Emotional Intelligence UI Component
 * 
 * Displays Cwy's current emotional state from Nin Engine
 * 
 * Attribution:
 * - Frontend: Blerina
 * - Emotional Intelligence: Sofia
 * - Integration: Lagter
 */

import React, { useState, useEffect } from 'react'
import { Heart, Brain, Code, Activity } from 'lucide-react'

interface NinState {
  emotion: string
  intensity: number
  reason: string
  system_health: number
  code_quality: number
  activity_level: number
  recent_events: string[]
}

const CwyNinDisplay: React.FC = () => {
  const [ninState, setNinState] = useState<NinState | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  
  // Emotion emoji mapping
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
  
  // Fetch Nin state
  useEffect(() => {
    const fetchNinState = async () => {
      try {
        const response = await fetch('http://localhost:7500/api/v1/nin/current')
        if (response.ok) {
          const data = await response.json()
          setNinState(data)
          setIsOnline(true)
        } else {
          setIsOnline(false)
        }
      } catch (error) {
        setIsOnline(false)
      }
    }
    
    // Initial fetch
    fetchNinState()
    
    // Poll every 10 seconds
    const interval = setInterval(fetchNinState, 10000)
    
    return () => clearInterval(interval)
  }, [])
  
  if (!isOnline || !ninState) {
    return (
      <div className="bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-pink-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
              💤
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">💓 Cwy Nin Engine</h2>
              <p className="text-sm text-gray-400">Offline - Waiting to wake up...</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
            Port 7500 Offline
          </div>
        </div>
      </div>
    )
  }
  
  const emoji = getEmotionEmoji(ninState.emotion)
  const intensityPercent = ninState.intensity * 100
  
  // Color for emotion
  const getEmotionColor = (emotion: string): string => {
    if (['excited', 'celebrating', 'happy'].includes(emotion)) return 'from-green-500 to-emerald-500'
    if (['content', 'curious', 'focused'].includes(emotion)) return 'from-blue-500 to-cyan-500'
    if (['concerned'].includes(emotion)) return 'from-yellow-500 to-orange-500'
    if (['worried', 'anxious'].includes(emotion)) return 'from-red-500 to-orange-500'
    return 'from-pink-500 to-purple-500'
  }
  
  return (
    <div className="bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-pink-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getEmotionColor(ninState.emotion)} flex items-center justify-center text-2xl animate-pulse`}>
            {emoji}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">💓 Cwy Nin Engine</h2>
            <p className="text-sm text-gray-400">Emotional Intelligence Core</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white capitalize">{ninState.emotion}</div>
          <div className="text-sm text-gray-400">Intensity: {intensityPercent.toFixed(0)}%</div>
        </div>
      </div>
      
      {/* Reason */}
      <div className="bg-black/20 rounded-lg p-4 mb-4">
        <p className="text-white text-sm italic">"{ninState.reason}"</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* System Health */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <div className="text-xs text-gray-400">System Health</div>
          </div>
          <div className="text-lg font-bold text-white">{(ninState.system_health * 100).toFixed(0)}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                ninState.system_health >= 0.8 ? 'bg-green-500' : 
                ninState.system_health >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${ninState.system_health * 100}%` }}
            />
          </div>
        </div>
        
        {/* Code Quality */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-blue-400" />
            <div className="text-xs text-gray-400">Code Quality</div>
          </div>
          <div className="text-lg font-bold text-white">{(ninState.code_quality * 100).toFixed(0)}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                ninState.code_quality >= 0.8 ? 'bg-blue-500' : 
                ninState.code_quality >= 0.6 ? 'bg-cyan-500' : 'bg-orange-500'
              }`}
              style={{ width: `${ninState.code_quality * 100}%` }}
            />
          </div>
        </div>
        
        {/* Activity Level */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <div className="text-xs text-gray-400">Activity Level</div>
          </div>
          <div className="text-lg font-bold text-white">{(ninState.activity_level * 100).toFixed(0)}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="h-2 rounded-full transition-all bg-gradient-to-r from-pink-500 to-purple-500"
              style={{ width: `${ninState.activity_level * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Recent Events */}
      {ninState.recent_events && ninState.recent_events.length > 0 && (
        <div className="bg-black/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <div className="text-xs text-gray-400">Recent Events</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ninState.recent_events.map((event, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                {event}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Attribution */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-xs text-gray-400">
          Attribution: Alba (Architecture) • Albi (AI Logic) • Sofia (Emotional Intelligence) • Lagter (Integration)
        </div>
      </div>
    </div>
  )
}

export default CwyNinDisplay
