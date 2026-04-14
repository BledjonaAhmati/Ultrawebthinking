/**
 * 🎯 Cwy Advanced Dashboard - Ultimate System Monitor
 * 
 * Real-time monitoring të gjithë platformës AGI me celebration system
 * 
 * Attribution:
 * - Architecture: Alba
 * - Frontend: Blerina  
 * - Integration: Lagter
 * - Celebration System: Full Team
 * 
 * FILOZOFIA: No fake data - real status, real celebrations!
 */

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Activity, 
  Zap, 
  Brain, 
  Network, 
  Cpu, 
  Users, 
  Factory, 
  Globe,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { api } from '@/lib/api'
import { useWebSocket } from '@/providers/WebSocketProvider'
import { playSound, CELEBRATIONS } from '@/lib/celebrations'

// ============================================
// Types
// ============================================

interface ComponentHealth {
  name: string
  status: 'healthy' | 'degraded' | 'offline'
  uptime_seconds: number
  requests_total: number
  requests_per_second: number
  average_latency_ms: number
  error_rate: number
  attribution: string[]
}

interface AgentStatus {
  agent_name: string
  team_member: string
  status: 'active' | 'idle' | 'working' | 'error' | 'offline'
  tasks_completed: number
  tasks_failed: number
  average_response_time_ms: number
}

interface NodeMesh {
  node_id: string
  node_type: 'agent' | 'service' | 'labor' | 'core'
  status: 'online' | 'offline'
  location: string
  connections: string[]
  attribution: string[]
}

interface SystemHealth {
  ocean_core: 'healthy' | 'degraded' | 'offline'
  asi_agents: 'healthy' | 'degraded' | 'offline'
  ai_v2_neighborhood: 'healthy' | 'degraded' | 'offline'
  euroweb_agi: 'healthy' | 'degraded' | 'offline'
  clisonix_labors: 'healthy' | 'degraded' | 'offline'
  overall_status: 'healthy' | 'degraded' | 'offline'
  timestamp: string
}

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
  unlocked_at?: string
  icon: string
  team_members: string[]
}

// ============================================
// Celebration Engine
// ============================================

const triggerMassiveCelebration = (achievement: Achievement) => {
  // 🎊 MASSIVE CONFETTI EXPLOSION
  const duration = 5000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // Burst from left
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })

    // Burst from right
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)

  // 🔊 PLAY CELEBRATION SOUND
  playSound('/sounds/celebration.mp3')

  // 🎨 SCREEN FLASH
  const flash = document.createElement('div')
  flash.className = 'celebration-flash'
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #ffd700, #ff69b4, #00ffff);
    opacity: 0;
    pointer-events: none;
    z-index: 9999;
    animation: flash 0.5s ease-in-out;
  `
  document.body.appendChild(flash)
  setTimeout(() => flash.remove(), 500)

  // 📢 ANNOUNCEMENT
  console.log(`
    🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
    
    ✨ ACHIEVEMENT UNLOCKED! ✨
    
    ${achievement.title}
    ${achievement.description}
    
    Team: ${achievement.team_members.join(', ')}
    
    🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
  `)
}

// ============================================
// Main Component
// ============================================

export default function CwyAdvancedDashboard() {
  const [lastCelebration, setLastCelebration] = useState<string | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [meshNodes, setMeshNodes] = useState<NodeMesh[]>([])

  // ========================================
  // Data Fetching
  // ========================================

  // System Health (Main Orchestrator)
  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/v1/health')
      return response.json() as Promise<SystemHealth>
    },
    refetchInterval: 5000,
  })

  // ASI Agents Status
  const { data: agentsHealth } = useQuery({
    queryKey: ['agents-health'],
    queryFn: async () => {
      const response = await fetch('http://localhost:7100/api/v1/agents/health')
      return response.json() as Promise<Record<string, AgentStatus>>
    },
    refetchInterval: 5000,
  })

  // Ocean Core Metrics
  const { data: oceanMetrics } = useQuery({
    queryKey: ['ocean-metrics'],
    queryFn: async () => {
      const response = await fetch('http://localhost:7000/api/v1/insights')
      return response.json()
    },
    refetchInterval: 10000,
  })

  // Labors Health
  const { data: laborsHealth } = useQuery({
    queryKey: ['labors-health'],
    queryFn: async () => {
      const response = await fetch('http://localhost:7400/api/v1/labors/health')
      return response.json()
    },
    refetchInterval: 5000,
  })

  // ========================================
  // Achievement Tracking
  // ========================================

  useEffect(() => {
    // Initialize achievements
    const defaultAchievements: Achievement[] = [
      {
        id: 'all_systems_online',
        title: '🌟 All Systems Online',
        description: 'All 6 AGI components are healthy',
        unlocked: false,
        icon: '🚀',
        team_members: ['Alba', 'Lagter', 'Ageim'],
      },
      {
        id: 'agents_active',
        title: '🤖 Agent Army Activated',
        description: 'All 12 ASI Agents are operational',
        unlocked: false,
        icon: '🦾',
        team_members: ['Alba', 'Albi', 'Jona', 'Blerina', 'Ageim', 'Mali', 'Alda', 'Liam', 'Klajdi', 'Sofia', 'Albana', 'Lagter'],
      },
      {
        id: 'zero_errors',
        title: '✨ Perfect Execution',
        description: 'Zero errors across all services for 1 hour',
        unlocked: false,
        icon: '💎',
        team_members: ['Alda', 'Liam', 'Full Team'],
      },
      {
        id: 'high_throughput',
        title: '⚡ Lightning Fast',
        description: '1000+ requests/second with <100ms latency',
        unlocked: false,
        icon: '⚡',
        team_members: ['Alba', 'Ageim', 'Klajdi'],
      },
      {
        id: 'labors_working',
        title: '🏭 Industry Mode',
        description: 'All 4 Labor units processing simultaneously',
        unlocked: false,
        icon: '🔥',
        team_members: ['Albi', 'Jona', 'Mali'],
      },
      {
        id: 'ethical_ai',
        title: '⚖️ Ethical Guardian',
        description: '100% ethical decision rate maintained',
        unlocked: false,
        icon: '🛡️',
        team_members: ['Sofia', 'Alba', 'Albana'],
      },
    ]

    setAchievements(defaultAchievements)
  }, [])

  // Check achievements
  useEffect(() => {
    if (!systemHealth) return

    // Achievement: All Systems Online
    if (systemHealth.overall_status === 'healthy') {
      unlockAchievement('all_systems_online')
    }

    // Achievement: Agents Active
    if (agentsHealth && Object.keys(agentsHealth).length >= 4) {
      const allActive = Object.values(agentsHealth).every(
        (agent: AgentStatus) => agent.status !== 'offline'
      )
      if (allActive) {
        unlockAchievement('agents_active')
      }
    }

    // Achievement: Labors Working
    if (laborsHealth) {
      const laborsList = Object.values(laborsHealth)
      if (laborsList.length === 4) {
        const allWorking = laborsList.every(
          (labor: any) => labor.status === 'processing'
        )
        if (allWorking) {
          unlockAchievement('labors_working')
        }
      }
    }
  }, [systemHealth, agentsHealth, laborsHealth])

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const achievement = prev.find((a) => a.id === id)
      if (!achievement || achievement.unlocked) return prev

      // TRIGGER MASSIVE CELEBRATION! 🎉
      const newAchievement = {
        ...achievement,
        unlocked: true,
        unlocked_at: new Date().toISOString(),
      }

      triggerMassiveCelebration(newAchievement)
      setLastCelebration(id)

      return prev.map((a) => (a.id === id ? newAchievement : a))
    })
  }

  // ========================================
  // Mesh Network Visualization
  // ========================================

  useEffect(() => {
    // Build mesh network from available data
    const nodes: NodeMesh[] = []

    // Core nodes
    if (systemHealth?.ocean_core === 'healthy') {
      nodes.push({
        node_id: 'ocean-core',
        node_type: 'core',
        status: 'online',
        location: 'Port 7000',
        connections: ['euroweb-agi', 'orchestrator'],
        attribution: ['Alba', 'Albi', 'Albana'],
      })
    }

    if (systemHealth?.euroweb_agi === 'healthy') {
      nodes.push({
        node_id: 'euroweb-agi',
        node_type: 'core',
        status: 'online',
        location: 'Port 7300',
        connections: ['ocean-core', 'asi-agents', 'orchestrator'],
        attribution: ['Alba', 'Albana', 'Sofia'],
      })
    }

    // Agent nodes
    if (agentsHealth) {
      Object.entries(agentsHealth).forEach(([name, status]) => {
        nodes.push({
          node_id: `agent-${name}`,
          node_type: 'agent',
          status: status.status === 'offline' ? 'offline' : 'online',
          location: 'Port 7100',
          connections: ['orchestrator', 'euroweb-agi'],
          attribution: [status.team_member],
        })
      })
    }

    // Labor nodes
    if (laborsHealth) {
      Object.entries(laborsHealth).forEach(([name, status]: [string, any]) => {
        nodes.push({
          node_id: `labor-${name}`,
          node_type: 'labor',
          status: status.status === 'offline' ? 'offline' : 'online',
          location: 'Port 7400',
          connections: ['orchestrator', 'ai-v2'],
          attribution: status.attribution || [],
        })
      })
    }

    setMeshNodes(nodes)
  }, [systemHealth, agentsHealth, laborsHealth])

  // ========================================
  // WebSocket Real-time Updates
  // ========================================

  const { subscribe } = useWebSocket()

  useEffect(() => {
    const unsubscribe = subscribe('system:achievement', (data) => {
      console.log('🎉 Achievement unlocked:', data)
      if (data.achievement_id) {
        unlockAchievement(data.achievement_id)
      }
    })
    return unsubscribe
  }, [subscribe])

  // ========================================
  // Render
  // ========================================

  if (healthLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Sparkles className="w-16 h-16 animate-spin mx-auto text-purple-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Cwy Dashboard...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'active':
        return 'text-green-500'
      case 'degraded':
      case 'idle':
        return 'text-yellow-500'
      case 'offline':
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'active':
        return <CheckCircle className="w-5 h-5" />
      case 'degraded':
      case 'idle':
        return <AlertCircle className="w-5 h-5" />
      case 'offline':
      case 'error':
        return <XCircle className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      {/* Header with Celebration */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🎯 Cwy Advanced Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Real-time AGI Platform Monitor - 100% Scalable, 0% Fake Data
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Live monitoring every 5s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {achievements.filter((a) => a.unlocked).length}/{achievements.length} Achievements
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl mb-2">🎉</div>
              <p className="text-sm text-gray-500">
                {systemHealth?.overall_status === 'healthy' ? 'Everything Perfect!' : 'Monitoring...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Ocean Core */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <Brain className="w-8 h-8 text-blue-500" />
            <div className={getStatusColor(systemHealth?.ocean_core || 'offline')}>
              {getStatusIcon(systemHealth?.ocean_core || 'offline')}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Ocean Core</h3>
          <p className="text-xs text-gray-500 mt-1">Alba, Albi, Albana</p>
          <p className="text-xs text-gray-400 mt-2">Port 7000</p>
        </div>

        {/* ASI Agents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-purple-500" />
            <div className={getStatusColor(systemHealth?.asi_agents || 'offline')}>
              {getStatusIcon(systemHealth?.asi_agents || 'offline')}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">ASI Agents</h3>
          <p className="text-xs text-gray-500 mt-1">
            {agentsHealth ? Object.keys(agentsHealth).length : 0}/12 Active
          </p>
          <p className="text-xs text-gray-400 mt-2">Port 7100</p>
        </div>

        {/* AI V2 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <Network className="w-8 h-8 text-green-500" />
            <div className={getStatusColor(systemHealth?.ai_v2_neighborhood || 'offline')}>
              {getStatusIcon(systemHealth?.ai_v2_neighborhood || 'offline')}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">AI V2</h3>
          <p className="text-xs text-gray-500 mt-1">Albi, Lagter</p>
          <p className="text-xs text-gray-400 mt-2">Port 7200</p>
        </div>

        {/* EuroWeb AGI */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between mb-3">
            <Brain className="w-8 h-8 text-pink-500" />
            <div className={getStatusColor(systemHealth?.euroweb_agi || 'offline')}>
              {getStatusIcon(systemHealth?.euroweb_agi || 'offline')}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">EuroWeb AGI</h3>
          <p className="text-xs text-gray-500 mt-1">Alba, Albana, Sofia</p>
          <p className="text-xs text-gray-400 mt-2">Port 7300</p>
        </div>

        {/* Labors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-3">
            <Factory className="w-8 h-8 text-orange-500" />
            <div className={getStatusColor(systemHealth?.clisonix_labors || 'offline')}>
              {getStatusIcon(systemHealth?.clisonix_labors || 'offline')}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Labors</h3>
          <p className="text-xs text-gray-500 mt-1">
            {laborsHealth ? Object.keys(laborsHealth).length : 0}/4 Units
          </p>
          <p className="text-xs text-gray-400 mt-2">Port 7400</p>
        </div>

        {/* Orchestrator */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between mb-3">
            <Globe className="w-8 h-8 text-indigo-500" />
            <div className={getStatusColor(systemHealth?.overall_status || 'offline')}>
              {getStatusIcon(systemHealth?.overall_status || 'offline')}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Orchestrator</h3>
          <p className="text-xs text-gray-500 mt-1">Alba, Lagter</p>
          <p className="text-xs text-gray-400 mt-2">Port 8000</p>
        </div>
      </div>

      {/* Mesh Network Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Network className="w-6 h-6 text-blue-500" />
          Node Mesh Network - UltraWeb Thinking
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {meshNodes.map((node) => (
            <div
              key={node.node_id}
              className={`p-4 rounded-lg border-2 ${
                node.status === 'online'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {node.node_type === 'core' && <Brain className="w-5 h-5" />}
                {node.node_type === 'agent' && <Users className="w-5 h-5" />}
                {node.node_type === 'labor' && <Factory className="w-5 h-5" />}
                {node.node_type === 'service' && <Cpu className="w-5 h-5" />}
                <span className="font-semibold text-sm">{node.node_id}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{node.location}</p>
              <p className="text-xs text-gray-500 mt-1">
                Team: {node.attribution.join(', ')}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    node.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-xs">{node.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Panel */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-8 h-8" />
          Achievements - Celebration System 🎉
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                achievement.unlocked
                  ? 'bg-white/20 border-2 border-yellow-400 shadow-2xl'
                  : 'bg-white/10 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
              <p className="text-sm text-white/80 mb-2">{achievement.description}</p>
              <p className="text-xs text-white/60">Team: {achievement.team_members.join(', ')}</p>
              {achievement.unlocked && (
                <div className="mt-2 flex items-center gap-2 text-yellow-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold">UNLOCKED!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agent Details */}
      {agentsHealth && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-500" />
            ASI Agents Status (Scalable Architecture)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(agentsHealth).map(([name, status]: [string, AgentStatus]) => (
              <div
                key={name}
                className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold capitalize">{name}</span>
                  <div className={getStatusColor(status.status)}>
                    {getStatusIcon(status.status)}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Team: {status.team_member}
                </p>
                <p className="text-xs text-gray-500">
                  Completed: {status.tasks_completed} | Failed: {status.tasks_failed}
                </p>
                <p className="text-xs text-gray-500">
                  Avg latency: {status.average_response_time_ms.toFixed(0)}ms
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clisonix Open Free Data Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-500" />
          Clisonix Open Free Data Links - City Engines & Labs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-500" />
              City Engines
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>🏙️ Tirana Engine - Attribution: Alba, Ageim</li>
              <li>🌊 Durrës Engine - Attribution: Mali, Klajdi</li>
              <li>🏛️ Vlorë Engine - Attribution: Albana, Jona</li>
              <li>🏔️ Shkodër Engine - Attribution: Liam, Alda</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Factory className="w-5 h-5 text-purple-500" />
              City Labs
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>🔬 Research Lab Tirana - Attribution: Albana, Albi</li>
              <li>🧪 Innovation Lab Prishtina - Attribution: Sofia, Blerina</li>
              <li>🏭 Production Lab Durrës - Attribution: Lagter, Mali</li>
              <li>⚙️ DevOps Lab Remote - Attribution: Ageim, Klajdi</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <p>Built with ❤️ by UltraThinking Team</p>
        <p className="mt-1">No fake data. Real intelligence. Real celebrations! 🎉</p>
      </div>
    </div>
  )
}
