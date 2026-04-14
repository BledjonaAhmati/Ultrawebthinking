/**
 * 📊 Overview Dashboard
 * System-wide overview and key metrics
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { api } from '@/lib/api'

interface SystemOverview {
  totalServices: number
  activeServices: number
  totalRequests: number
  avgResponseTime: number
  errorRate: number
  uptime: number
}

export default function Overview() {
  const { data: overview, isLoading } = useQuery<SystemOverview>({
    queryKey: ['overview'],
    queryFn: async () => {
      // Fetch overview data from API gateway
      const response = await api.get('/api/overview')
      return response.data
    },
    refetchInterval: 5000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Services',
      value: overview?.totalServices || 0,
      icon: Server,
      color: 'blue',
    },
    {
      label: 'Active Services',
      value: overview?.activeServices || 0,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Total Requests',
      value: (overview?.totalRequests || 0).toLocaleString(),
      icon: TrendingUp,
      color: 'purple',
    },
    {
      label: 'Avg Response Time',
      value: `${overview?.avgResponseTime || 0}ms`,
      icon: Activity,
      color: 'orange',
    },
    {
      label: 'Error Rate',
      value: `${((overview?.errorRate || 0) * 100).toFixed(2)}%`,
      icon: AlertCircle,
      color: overview && overview.errorRate > 0.05 ? 'red' : 'green',
    },
    {
      label: 'System Uptime',
      value: `${Math.floor((overview?.uptime || 0) / 3600)}h`,
      icon: Cpu,
      color: 'cyan',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">System Overview</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4 animate-pulse text-green-500" />
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                <Icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Status</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">Core Services</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">Database</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">API Gateway</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
