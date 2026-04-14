/**
 * 🎯 Cwy Advanced Dashboard
 * Real-time component monitoring + celebration system
 * Shows what works ✅ and what doesn't ❌
 */

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Zap,
  TrendingUp,
  Bell,
  Trophy,
  Sparkles,
  Activity
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

interface ComponentStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  health_score: number
  uptime_percent: number
  last_check: string
  message?: string
  metrics?: {
    requests_per_second?: number
    response_time_ms?: number
    error_rate?: number
  }
}

interface SystemHealth {
  overall_status: 'healthy' | 'warning' | 'critical'
  overall_score: number
  components: ComponentStatus[]
  achievements: Achievement[]
  timestamp: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked_at: string
  is_new: boolean
}

export default function CwyDashboard() {
  const [celebrationActive, setCelebrationActive] = useState(false)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  // Fetch real system health
  const { data: health, isLoading } = useQuery<SystemHealth>({
    queryKey: ['cwy-health'],
    queryFn: async () => {
      const response = await api.services.status('cwy')
      return response.data
    },
    refetchInterval: 5000, // Check every 5 seconds
    onSuccess: (data) => {
      // Check for new achievements
      const newAchs = data.achievements.filter(a => a.is_new)
      if (newAchs.length > 0) {
        setNewAchievements(newAchs)
        triggerCelebration(newAchs)
      }
    },
  })

  const triggerCelebration = (achievements: Achievement[]) => {
    setCelebrationActive(true)
    
    // Play success sound
    const audio = new Audio('/sounds/celebration.mp3')
    audio.play().catch(() => {
      // Fallback if audio fails
      console.log('🎉 Achievement unlocked!')
    })

    // Trigger confetti
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']

    ;(function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      } else {
        setCelebrationActive(false)
      }
    })()

    // Show toast for each achievement
    achievements.forEach((ach) => {
      toast.success(
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="font-bold">{ach.title}</p>
            <p className="text-sm text-gray-600">{ach.description}</p>
          </div>
        </div>,
        {
          duration: 5000,
          style: {
            background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
            color: '#000',
          },
        }
      )
    })
  }

  const getStatusIcon = (status: ComponentStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case 'degraded':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
      case 'down':
        return <XCircle className="w-6 h-6 text-red-500" />
    }
  }

  const getStatusColor = (status: ComponentStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      case 'degraded':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'down':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
    }
  }

  const getOverallStatusColor = () => {
    if (!health) return 'bg-gray-500'
    switch (health.overall_status) {
      case 'healthy':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'critical':
        return 'bg-red-500'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Cwy status...</p>
        </div>
      </div>
    )
  }

  const operationalCount = health?.components.filter(c => c.status === 'operational').length || 0
  const totalComponents = health?.components.length || 0
  const healthPercentage = (operationalCount / totalComponents) * 100

  return (
    <div className="space-y-6 p-6">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {celebrationActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 p-8 rounded-2xl shadow-2xl"
            >
              <div className="text-center text-white">
                <Trophy className="w-24 h-24 mx-auto mb-4 animate-bounce" />
                <h2 className="text-4xl font-bold mb-2">🎉 Achievement Unlocked!</h2>
                {newAchievements.map((ach) => (
                  <div key={ach.id} className="mt-4">
                    <p className="text-2xl font-semibold">{ach.title}</p>
                    <p className="text-lg opacity-90">{ach.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Cwy Advanced Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time component monitoring & achievement tracking
          </p>
        </div>
        
        {/* Overall Status Indicator */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`${getOverallStatusColor()} rounded-full p-4 text-white shadow-lg`}
        >
          <div className="text-center">
            <p className="text-sm font-medium">System Health</p>
            <p className="text-3xl font-bold">{health?.overall_score || 0}%</p>
            <p className="text-xs capitalize">{health?.overall_status}</p>
          </div>
        </motion.div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h3 className="font-semibold">Operational</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {operationalCount}
            <span className="text-lg text-gray-500">/{totalComponents}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold">Health Score</h3>
          </div>
          <p className="text-3xl font-bold text-blue-500">
            {healthPercentage.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">
            {health?.achievements.length || 0}
          </p>
        </div>
      </div>

      {/* Component Status Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Component Status - Real-time Monitoring
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {health?.components.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-l-4 rounded-lg shadow p-4 ${getStatusColor(component.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(component.status)}
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {component.name}
                  </h3>
                </div>
                <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {component.health_score}%
                </span>
              </div>

              {component.message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {component.message}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-semibold">{component.uptime_percent.toFixed(2)}%</span>
                </div>

                {component.metrics?.response_time_ms && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response:</span>
                    <span className="font-semibold">{component.metrics.response_time_ms}ms</span>
                  </div>
                )}

                {component.metrics?.requests_per_second && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">RPS:</span>
                    <span className="font-semibold">{component.metrics.requests_per_second.toFixed(1)}</span>
                  </div>
                )}

                {component.metrics?.error_rate !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error Rate:</span>
                    <span className={`font-semibold ${
                      component.metrics.error_rate > 5 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {component.metrics.error_rate.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Last check: {new Date(component.last_check).toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      {health?.achievements && health.achievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements Unlocked
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {health.achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${
                  achievement.is_new
                    ? 'from-yellow-400 to-orange-500'
                    : 'from-gray-700 to-gray-800'
                } rounded-lg p-6 text-white shadow-lg relative overflow-hidden`}
              >
                {achievement.is_new && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-200" />
                  </motion.div>
                )}

                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-sm opacity-90 mb-3">{achievement.description}</p>
                <p className="text-xs opacity-75">
                  Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Live Activity Log */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 animate-pulse text-blue-500" />
          Live Activity
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <p className="text-sm">
              <span className="font-semibold">API Gateway</span> - All systems operational
            </p>
            <span className="text-xs text-gray-500 ml-auto">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <Zap className="w-4 h-4 text-blue-500" />
            <p className="text-sm">
              <span className="font-semibold">Hardware Monitor</span> - RISC-V metrics updated
            </p>
            <span className="text-xs text-gray-500 ml-auto">5s ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
